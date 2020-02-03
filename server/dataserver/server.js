const net = require('net');
const {logMessage, logMessageWithAppStatusUpdate, LogLevels} = require('../logger/logger');


const createDataServerInstance = (appConfig, appStatus, onReceivePlcMessage) => {
    const componentName = `dataServer`;

    const dataServer = net.createServer();
    dataServer.listen(appConfig.data_server.port);

    dataServer.on('close', () => {
        logMessageWithAppStatusUpdate(
            appStatus,
            {
                logLevel: LogLevels.WARN,
                componentName,
                message: `Data server on port ${appConfig.data_server.port} closed`,
            }
        );
    });

    dataServer.on(`listening`, () => {
        logMessageWithAppStatusUpdate(
            appStatus,
            {
                logLevel: LogLevels.OK,
                componentName,
                message: `Data server is listening on port ${appConfig.data_server.port}`,
            }
        );
    });

    dataServer.on('error', (e) => {
        logMessageWithAppStatusUpdate(
            appStatus,
            {
                logLevel: LogLevels.ERROR,
                componentName,
                error: e
            }
        );
        dataServer.listen(appConfig.data_server.port);
    });

    dataServer.on(`connection`, (socket) => {
        logMessageWithAppStatusUpdate(
            appStatus,
            {
                logLevel: LogLevels.OK,
                componentName,
                message: `PLC connected`,
            }
        );

        socket.on(`data`, (data) => {
            try {
                const dataString = data.toString();
                const plcMessage = JSON.parse(dataString);
                onReceivePlcMessage(plcMessage);
            } catch (e) {
                logMessage({
                    logLevel: LogLevels.ERROR,
                    componentName,
                    error: e
                })
            }
        });

        socket.on(`close`, () => {
            logMessageWithAppStatusUpdate(
                appStatus,
                {
                    logLevel: LogLevels.WARN,
                    componentName,
                    message: `PLC disconnected`,
                }
            );
        });

        socket.on(`error`, (e) => {
            logMessageWithAppStatusUpdate(
                appStatus,
                {
                    logLevel: LogLevels.ERROR,
                    componentName,
                    error: e
                }
            );
        });
    });

    return dataServer
};

module.exports = {
    createDataServerInstance
};
