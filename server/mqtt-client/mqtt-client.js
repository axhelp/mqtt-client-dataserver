const fs = require('fs');
const mqtt = require('mqtt');
const {logMessageWithAppStatusUpdate, logMessage, LogLevels} = require('../logger/logger');


const createMqttClientInstance = (appConfig, appStatus, onMessageFromBroker) => {
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
        mqttClient.subscribe(appConfig.brokers[0].subscribe_data[0].topic, (err) => {
            if (!err) {
                logMessage({
                    logLevel: LogLevels.OK,
                    componentName,
                    message: `Mqtt client subscribed to topic ${appConfig.brokers[0].subscribe_data[0].topic}`,
                })
            }
            else {
                logMessage({
                    logLevel: LogLevels.OK,
                    componentName,
                    message: `Error subscribe to topic ${appConfig.brokers[0].subscribe_data[0].topic}: ${err.message}`,
                })
            }
        })
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
    });

    mqttClient.on('message', (topic, msg) => {
        onMessageFromBroker(msg.toString());
    });

    return mqttClient
};

module.exports = {
    createMqttClientInstance
};

