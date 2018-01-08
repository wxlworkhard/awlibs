function setConfigs(key, value) {
    return {
        ...this,
        configs: {
            ...this.configs,
            [key]: value
        }
    };
}

function fetchDataMemoize(asyncOperateTag) {
    asyncOperateTag = {
        ...asyncOperateTag
    };

    return (getAsyncTaskArray, tagKey, onAsyncOperateTagChange) => {
        argsValidate(getAsyncTaskArray, tagKey, onAsyncOperateTagChange);
        const configs = this.configs;

        return new Promise((resolve, reject) => {
            if (!asyncOperateTag[tagKey]) {
                asyncOperateTag[tagKey] = 'init';
            }

            if (asyncOperateTag[tagKey] == 'loading') {
                return reject({
                    [configs.errorTypeKey]: 'req:q2',
                    [configs.msgKey]: '重复提交',
                });
            }

            asyncOperateTag[tagKey] = 'loading';
            onAsyncOperateTagChange && onAsyncOperateTagChange(asyncOperateTag);

            const asyncTaskArray = getAsyncTaskArray();

            return Promise.all(asyncTaskArray).then((result) => {
                const hasError = result.some((item) => {
                    if (configs.resS1ErrorCase(item)) {
                        reject({
                            ...item,
                            [configs.errorTypeKey]: 'res:s1',
                        });
                        return true;
                    }
                });

                if (hasError) {
                    return;
                }

                asyncOperateTag[tagKey] = 'success';
                onAsyncOperateTagChange && onAsyncOperateTagChange(asyncOperateTag);

                return resolve(configs.successFilter(result));
            }).catch((tmpError) => {
                // 注意这里包含的错误类型可能比较多，真正的错误信息会打印
                // 这里把错误统一归结为 res:s2
                console.error(tmpError);
                const error = {
                    ...tmpError,
                    [configs.errorTypeKey]: 'res:s2',
                    [configs.msgKey]: '系统繁忙',
                };
                reject(error);
            });
        }).catch((tmpError) => {
            console.error(tmpError);
            const error = {
                ...tmpError,
            };

            if (!error[configs.errorTypeKey]) {
                asyncOperateTag[tagKey] = 'error';
                onAsyncOperateTagChange && onAsyncOperateTagChange(asyncOperateTag);
            } else {
                if (error[configs.errorTypeKey] == 'req:q2') {
                    // 重复提交，不修改 tag
                }

                // res s1 s2 error
                if (error[configs.errorTypeKey].indexOf('res:s') != -1) {
                    asyncOperateTag[tagKey] = 'error';
                    onAsyncOperateTagChange && onAsyncOperateTagChange(asyncOperateTag);
                }

                configs.errorCb(error);
            }

            throw error;
        });
    };
}

function argsValidate(getAsyncTaskArray, tagKey, onAsyncOperateTagChange) {
    if (!getAsyncTaskArray || typeof getAsyncTaskArray !== 'function') {
        throw 'getAsyncTaskArray 参数错误';
    }

    if (!tagKey || typeof tagKey !== 'string') {
        throw 'tagKey 参数错误';
    }

    if (onAsyncOperateTagChange && typeof onAsyncOperateTagChange !== 'function') {
        throw 'onAsyncOperateTagChange 参数错误';
    }
}

function factory(configs) {
    return {
        configs: {
            ...configs,
        },
        setConfigs,
        fetchDataMemoize,
    };
}

export default factory;