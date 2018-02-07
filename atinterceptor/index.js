/**
 * Async task interceptor
 * 异步任务拦截器
 */



const DEFAULT_CONFIGS = {
    errorTypeKey: 'atinterceptorErrorType',
    msgKey: 'atinterceptorMsg',
};


const getErrorDesc = (function () {
    const MAP = {
        'req:q1': '请求错误：重复请求',
        'res:s1': '响应错误：响应异常'
    };

    return function (errorType, configs) {
        return {
            [configs.errorTypeKey]: errorType,
            [configs.msgKey]: MAP[errorType] || '未定义错误类型'
        };
    }
})();

function asyncTaskMemoize(asyncTag, configs) {
    asyncTag = {
        ...asyncTag
    };

    configs = {
        ...DEFAULT_CONFIGS,
        ...configs
    };

    return function (getAsyncTaskArray, repeat, tagKey, onAsyncTagChange) {
        validateParams.apply(undefined, [].slice.call(arguments));

        return new Promise((resolve, reject) => {
            if (!asyncTag[tagKey]) {
                asyncTag[tagKey] = 'ready';
            }

            if (asyncTag[tagKey] == 'running' && !repeat) {
                return reject({
                    ...getErrorDesc('req:q1', configs)
                });
            }

            asyncTag[tagKey] = 'running';
            onAsyncTagChange && onAsyncTagChange(asyncTag);

            const asyncTaskArray = getAsyncTaskArray();

            return Promise.all(asyncTaskArray).then((result) => {
                asyncTag[tagKey] = 'ready';
                onAsyncTagChange && onAsyncTagChange(asyncTag);

                return resolve(result);
            }).catch((tmpError) => {
                // 注意这里包含的错误情况（如语法错误）可能比较多，真正的错误信息会打印
                console.error(tmpError);

                // 把错误统一归结为 res:s1
                const error = {
                    ...tmpError,
                    ...getErrorDesc('res:s1', configs),
                };
                return reject(error);
            });
        }).catch((tmpError) => {
            console.error(tmpError);

            const error = {
                ...tmpError,
            };

            // 语法错误，需要马上解决
            if (!error[configs.errorTypeKey]) {
                asyncTag[tagKey] = 'ready';
                onAsyncTagChange && onAsyncTagChange(asyncTag);
                return;
            } else { // 拦截器定义的错误，throw 到下一层

                // 重复提交，不修改 tag
                if (error[configs.errorTypeKey] == 'req:q1') {

                }

                if (error[configs.errorTypeKey] == 'res:s1') {
                    asyncTag[tagKey] = 'ready';
                    onAsyncTagChange && onAsyncTagChange(asyncTag);
                }

                throw error;
            }

        });
    };
}


function validateParams(getAsyncTaskArray, repeat, tagKey, onAsyncTagChange) {
    if (!getAsyncTaskArray || typeof getAsyncTaskArray !== 'function') {
        throw 'getAsyncTaskArray param error';
    }

    if (typeof repeat != 'boolean') {
        throw 'repeat param error';
    }

    if (!tagKey || typeof tagKey != 'string') {
        throw 'tagKey param error';
    }

    if (onAsyncTagChange && typeof onAsyncTagChange !== 'function') {
        throw 'onAsyncTagChange param error';
    }
}

module.exports = asyncTaskMemoize;
