module.exports = function () {
    return {
        pageList: [
            {
                title: 'demo',
                srcPrefix: './demo/',
                src: './demo/page/index.js'
            }
        ],
        devServer: {
            port: 8866,
        },
        openBrowserUrl: 'http://127.0.0.1:8866/webpack-dev-server',
    };
};