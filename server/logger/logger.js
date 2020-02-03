const {updateAppStatus} = require('../helpers/status');


const LogLevels = {
    DEBUG: `DEBUG`,
    OK: `OK`,
    WARN: `WARN`,
    ERROR: `ERROR`
};

const logMessage = ({logLevel, componentName, message, error}) => {
    console.log(`${LogLevels[logLevel]}    ${componentName}    ${message ? message : ``}    ${error ? error.message : ``}`)
};

const logMessageWithAppStatusUpdate = (appStatus, {logLevel, componentName, message, error}) => {
    const statusMessage = `${message ? message : ``}    ${error ? error.message : ``}`;
    updateAppStatus(appStatus, componentName, logLevel, statusMessage);
    logMessage({logLevel, componentName, message, error});
};

module.exports = {
    logMessage,
    logMessageWithAppStatusUpdate,
    LogLevels
};
