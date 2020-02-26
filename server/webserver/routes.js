const path = require('path');
const fs = require('fs');
const {Router} = require(`express`);
const express = require(`express`);
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const {getDeviceHostName} = require('../helpers/utils');
const {logMessage, logMessageWithAppStatusUpdate, LogLevels} = require('../logger/logger');
const {validateConfig} = require('./validation');

const dirName = path.join(path.resolve(), '/webserver');
const CLIENT_BUILD_PATH = path.join(dirName, '../..', '/frontend/build');

const createRouterInstance = (appConfig, appStatus, onReceiveConfigUpdate) => {
    const componentName = `router`;
    const router = new Router();

    router.use(express.static(CLIENT_BUILD_PATH));
    router.use(fileUpload({}));
    router.use(bodyParser.json());

    router.get('/', (req, res) => {
        res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
    });

    router.get('/logo.gif', (req, res) => {
        const [host, port] = req.headers.host.split(`:`);
        res.redirect(`http://${getDeviceHostName(host)}/wbm/logo.gif`)
    });

    router.get('/favicon.ico', (req, res) => {
        const [host, port] = req.headers.host.split(`:`);
        res.redirect(`http://${getDeviceHostName(host)}/wbm/favicon.ico`)
    });

    router.get('/wbm/:fileName', (req, res) => {
        const [host, port] = req.headers.host.split(`:`);
        res.redirect(`http://${getDeviceHostName(host)}/wbm/${req.params.fileName}`)
    });

    router.get('/config', cors(), (req, res) => {
        res.json(appConfig);
    });

    router.get('/status', cors(), (req, res) => {
        res.json(appStatus);
    });

    router.post('/upload', cors(), (req, res) => {
        if (req.files === null) {
            return res.status(400).json({msg: 'No file uploaded'});
        }

        const file = req.files.file;
        const filePath = path.join(dirName, '../../credentials/', file.name);

        fs.mkdirSync(path.dirname(filePath), {recursive: true});
        file.mv(filePath, err => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }

            res.json({fileName: file.name, filePath: filePath});
        });
    });

    router.post('/config', cors(), (req, res) => {
        try {
            const configUpdate = validateConfig(req.body);
            onReceiveConfigUpdate(configUpdate);

            return res.json(appConfig)
        } catch (e) {
            logMessage({
                logLevel: LogLevels.ERROR,
                componentName,
                error: e
            });

            return res.status(500).json({error: e.message});
        }
    });

    return router
};


module.exports = {
    createRouterInstance
};
