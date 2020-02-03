const fs = require('fs');
const update = require('immutability-helper');
const {logMessage, LogLevels} = require('../logger/logger');


const componentName = `config`;

const loadConfig = (filePath) => {
    try {
        const fileContent = fs.readFileSync(filePath);
        return JSON.parse(fileContent)
    } catch (e) {
        logMessage({
            logLevel: LogLevels.ERROR,
            componentName,
            error: e
        });

        return {}
    }
};

const saveConfig = (filePath, configObj) => {
    const data = JSON.stringify(configObj, undefined, 2);
    fs.writeFileSync(filePath, data);
};

const updateConfig = (filePath, updateObject) => {
    const oldConfig = loadConfig(filePath);
    const updatedConfig = update(oldConfig, {$merge: updateObject});
    saveConfig(filePath, updatedConfig);

    return updatedConfig
};


module.exports = {
    loadConfig,
    updateConfig
};
