module.exports = function () {
    return {
         entryConfig: {
            srcPrefix: './app/demo/',
            entryFilename: 'export.js',
        },
        devServer: {
            port: 8866
        },
        // openBrowserUrl: 'http://127.0.0.1:8866/webpack-dev-server',

        alias: {
            awlibs: __dirname
        }
    };
};