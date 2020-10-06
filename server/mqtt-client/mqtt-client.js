const fs = require('fs');
const mqtt = require('mqtt');
const { logMessageWithAppStatusUpdate, logMessage, LogLevels } = require('../logger/logger');

const AuthTypes = {
    Pass: `pass`,
    Cert: `cert`
}

const createMqttClientInstance = (appConfig, appStatus, onMessageFromBroker) => {
    const componentName = `mqttClient`;

    const [mqttHost, mqttPort] = appConfig.brokers[0].host.split(':');
    const authType = appConfig.brokers[0].connect_options.auth_type || AuthTypes.Cert

    let key, cert, trustedCaList, username, password;
    if (authType === AuthTypes.Cert) {
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
    } else {
        username = appConfig.brokers[0].connect_options.username;
        password = appConfig.brokers[0].connect_options.password;
    }

    const options = {
        port: mqttPort,
        host: mqttHost,
        username: username,
        password: password,
        key: key,
        cert: cert,
        rejectUnauthorized: true,
        ca: trustedCaList,
        protocol: authType === AuthTypes.Cert ? `mqtts` : `mqtt`
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

