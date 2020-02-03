const express = require('express');
const http = require('http');
const {logMessageWithAppStatusUpdate, LogLevels} = require('../logger/logger');
const {createRouterInstance} = require('./routes');


const createWeServerInstance = (appConfig, appStatus, onReceiveConfigUpdate) => {
    const componentName = `webServer`;

    const port = appConfig.web_server && appConfig.web_server.port || 4000;
    const app = express();

    const httpServer = http.createServer(app);

    httpServer.listen(port);

    httpServer.on('close', () => {
        logMessageWithAppStatusUpdate(
            appStatus,
            {
                logLevel: LogLevels.WARN,
                componentName,
                message: `Web server on port ${port} closed`
            }
        );
    });

    httpServer.on('listening', () => {
        logMessageWithAppStatusUpdate(
            appStatus,
            {
                logLevel: LogLevels.OK,
                componentName,
                message: `Web server is listening on port ${port}`
            }
        );
    });

    const router = createRouterInstance(appConfig, appStatus, onReceiveConfigUpdate);
    app.use(`/`, router);

    return httpServer
};

module.exports = {
    createWeServerInstance
};
