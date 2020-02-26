const path = require('path');
module.exports = {
    target: "node",
    entry: {
        app: ["./mqtt-client-dataserver.js"]
    },
    output: {
        path: path.resolve(__dirname),
        filename: "./bundle-mqtt-client-dataserver.js"
    },
    module: {
        rules: [
            { test: /\.js$/, use: 'shebang-loader' }
        ],
    },
    externals: [],
};
