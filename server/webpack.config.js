const path = require('path');
const nodeExternals = require('webpack-node-externals');
module.exports = {
    target: "node",
    entry: {
        app: ["./mqtt-client-dataserver.js"]
    },
    output: {
        path: path.resolve(__dirname),
        filename: "./bundle-mqtt-client-dataserver.js"
    },
    externals: [nodeExternals()],
};
