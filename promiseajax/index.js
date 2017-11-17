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
/**
 *
 * @param {多次ajax 请求} ajaxObject
 */
function multipleAjax(ajaxArray){
    var promise = new Promise(function (resolve, reject) {
        let indexAjax = 0,
            callbackData = [];
        _.forEach(ajaxArray,(itemajax,index)=>{
            sendAjax(itemajax.type,itemajax.params).then((data) => {
                if(data.code !==0){
                    reject(data.msg);
                }
                callbackData.push({
                    index:index,
                    data:data.data
                });
                indexAjax ++;
                if(indexAjax === ajaxArray.length){
                    callbackData = _.sortBy(callbackData,'index').map((item)=>{return item.data});
                    resolve(callbackData);
                }
            });

        });
    });
    return promise;
}
module.exports = {
    get,
    post,
    multipleAjax
}
