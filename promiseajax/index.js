const Ajax = require('./ajax');

function sendAjax(type, params) {
    var params = Object.assign({}, params, {
        type
    });
    var _uid = +new Date();

    var promise = new Promise(function(resolve, reject) {
        Ajax(Object.assign({}, params, {
            success: function(resData) {
                resolve(resData);
            },
            error: function(error) {
                reject(error);
            }
        }));
    });
    return promise;
}

function get(params) {
    return sendAjax('get', params);
}

function post(params) {
    return sendAjax('post', params);
}

module.exports = {
    get,
    post
};
