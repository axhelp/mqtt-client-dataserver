const StatusEnum = {
    OK: `OK`,
    WARNING: `WARNING`,
    ERROR: `ERROR`
};

const InitialAppStatus = {
    webServer: {
        status: StatusEnum.WARNING,
        message: 'Initializing'
    },
    dataServer: {
        status: StatusEnum.WARNING,
        message: 'Initializing'
    },
    mqttClient: {
        status: StatusEnum.WARNING,
        message: 'Initializing'
    }
};

const updateAppStatus = (appStatus, componentName, status, message) => {
    appStatus[componentName] = {
        status, message
    };
};


module.exports = {
    updateAppStatus,
    InitialAppStatus
};
