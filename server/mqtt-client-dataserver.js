const path = require('path');
const {createWeServerInstance} = require('./webserver/server');
const {createDataServerInstance} = require('./dataserver/server');
const {createMqttClientInstance} = require('./mqtt-client/mqtt-client');
const {loadConfig, updateConfig} = require('./helpers/config');
const {InitialAppStatus} = require('./helpers/status');
const {logMessage, LogLevels} = require('./logger/logger');


let webServer, dataServer, mqttClient;
let appStatus = InitialAppStatus;
const SETTINGS_FILE_PATH = path.join(__dirname, '../', `settings.json`);
const componentName = `server`;

const onReceivePlcMessage = (message) => {
    try {
        mqttClient.publish(appConfig.brokers[0].publish_data[0].topics[0], JSON.stringify(message));
    } catch (e) {
        logMessage({
            logLevel: LogLevels.ERROR,
            componentName,
            error: e
        });
    }
};

const onReceiveConfigUpdate = (configUpdate) => {
    updateConfig(SETTINGS_FILE_PATH, configUpdate);

    if (webServer) {
        webServer.close();
    }
    if (dataServer) {
        dataServer.close();
    }
    if (mqttClient) {
        mqttClient.end();
    }

    logMessage({
        logLevel: LogLevels.WARN,
        componentName,
        message: `Restarting application`
    });

    process.exit();
};

const appConfig = loadConfig(SETTINGS_FILE_PATH);

try {
    webServer = createWeServerInstance(appConfig, appStatus, onReceiveConfigUpdate);
    dataServer = createDataServerInstance(appConfig, appStatus, onReceivePlcMessage);
    mqttClient = createMqttClientInstance(appConfig, appStatus);

    logMessage({
        logLevel: LogLevels.WARN,
        componentName,
        message: `Application started`
    });
} catch (e) {
    logMessage({
        logLevel: LogLevels.ERROR,
        componentName,
        error: e
    });
}
