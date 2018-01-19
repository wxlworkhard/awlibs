module.exports = function () {
    return {
        devServer: {
            port: 8866,
        },
        openBrowserUrl: 'http://127.0.0.1:8866/webpack-dev-server',

        alias: {
            module: __dirname
        }
    };
};