const path = require('path');
const fs = require('fs');
const {createWeServerInstance} = require('./webserver/server');
const {createDataServerInstance} = require('./dataserver/server');
const {createMqttClientInstance} = require('./mqtt-client/mqtt-client');
const {loadConfig, updateConfig} = require('./helpers/config');
const {InitialAppStatus} = require('./helpers/status');
const {logMessage, LogLevels} = require('./logger/logger');


let webServer, dataServer, mqttClient;
let appStatus = InitialAppStatus;
const dirName = path.resolve();
const SETTINGS_FILE_PATH = path.join(dirName, '../', `settings.json`);
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

const socketContainer = {};
const onMessageFromBroker = (msg) => {
    try {
        socketContainer.socket.write(msg)
    } catch (e) {
        logMessage({
            logLevel: LogLevels.ERROR,
            componentName,
            error: e
        });
    }
};

try {
    webServer = createWeServerInstance(appConfig, appStatus, onReceiveConfigUpdate);
    dataServer = createDataServerInstance(appConfig, appStatus, onReceivePlcMessage, socketContainer);
    mqttClient = createMqttClientInstance(appConfig, appStatus, onMessageFromBroker);

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
