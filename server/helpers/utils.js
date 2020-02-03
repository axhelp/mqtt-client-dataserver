const getDeviceHostName = (requestUrl) => {
    return process.env.NODE_ENV === `development`
        ? `192.168.1.10`
        : requestUrl;
};


module.exports = {
    getDeviceHostName
};
