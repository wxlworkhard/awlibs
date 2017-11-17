import _ from 'lodash';
import Ajax from './ajax';

function ErrorFactory(type) {
    this.type = type;
    return this;
}

function sendAjax(type, params) {
    var params = _.assign({}, params, {
        type
    });
    var _uid = +new Date();

    var promise = new Promise(function(resolve, reject) {
        Ajax(_.assign({}, params, {
            success: function(resData) {
                resolve(resData);
                // if (resData && resData.resCode === 0) {
                //     resolve(resData);
                // } else {
                //     var error = new ErrorFactory('resCode');
                //     reject(error);
                // }
            },
            error: function() {
                var error = new ErrorFactory('res');
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

export {
    get,
    post
};
