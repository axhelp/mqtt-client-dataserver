const fs = require('fs');
const mqtt = require('mqtt');
const {logMessageWithAppStatusUpdate, LogLevels} = require('../logger/logger');


const createMqttClientInstance = (appConfig, appStatus) => {
    const componentName = `mqttClient`;

    const [mqttHost, mqttPort] = appConfig.brokers[0].host.split(':');

    let key, cert, trustedCaList;
    try {
        key = fs.readFileSync(appConfig.brokers[0].connect_options.ssl_options.private_key);
        cert = fs.readFileSync(appConfig.brokers[0].connect_options.ssl_options.key_store);
        trustedCaList = fs.readFileSync(appConfig.brokers[0].connect_options.ssl_options.trust_store);
    } catch (e) {
        logMessageWithAppStatusUpdate(
            appStatus,
            {
                logLevel: LogLevels.ERROR,
                componentName,
                error: e
            }
        );
        return
    }

    const options = {
        port: mqttPort,
        host: mqttHost,
        key: key,
        cert: cert,
        rejectUnauthorized: true,
        ca: trustedCaList,
        protocol: 'mqtts'
    };

    let mqttClient;
    try {
        mqttClient = mqtt.connect(options);
    } catch (e) {
        logMessageWithAppStatusUpdate(
            appStatus,
            {
                logLevel: LogLevels.ERROR,
                componentName,
                error: e
            }
        );
    }

    mqttClient.on('connect', () => {
        logMessageWithAppStatusUpdate(
            appStatus,
            {
                logLevel: LogLevels.OK,
                componentName,
                message: `Mqtt client connected to server ${options.host}:${options.port}`,
            }
        );
    });

    mqttClient.on('reconnect', () => {
        logMessageWithAppStatusUpdate(
            appStatus,
            {
                logLevel: LogLevels.WARN,
                componentName,
                message: `Mqtt client reconnecting`,
            }
        );
    });

    mqttClient.on('close', () => {
        logMessageWithAppStatusUpdate(
            appStatus,
            {
                logLevel: LogLevels.WARN,
                componentName,
                message: `Mqtt client closed`
            }
        );
        mqttClient.reconnect();
    });

    mqttClient.on('error', (e) => {
        logMessageWithAppStatusUpdate(
            appStatus,
            {
                logLevel: LogLevels.ERROR,
                componentName,
                message: `Error`,
                error: e
            }
        );
        mqttClient.reconnect();
    });

    return mqttClient
};

module.exports = {
    createMqttClientInstance
};

