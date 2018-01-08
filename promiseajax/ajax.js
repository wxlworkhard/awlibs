var AJAX_OPTIONS = {
    url: '',
    type: 'GET',
    async: true,
    cache: false,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    timeout: 0,
    params: null
};

function Ajax(options) {
    var options = Object.assign({}, AJAX_OPTIONS, options);

    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        // xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }

    options.type = options.type.toUpperCase();
    (options.contentType.indexOf('json') != -1) && (options.contentType = 'application/json');

    options.params = serializeParams(options);

    if (options.type == 'GET') {
        options.url += (options.params ? 
                        getUrlConnector(options.url) + options.params : 
                        '');
        delete options.params;
    }

    // 处理返回数据
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                var response = xhr.responseText;
                var error;

                try {
                    response = JSON.parse(response);
                } catch (e) {
                    error = e;
                }

                if (error) {
                    ajaxError(error, xhr, options);  
                } else {
                    ajaxSuccess(response, xhr, options);
                }
            } else {
                ajaxError(null, xhr, options);
            }
        }
    }

    xhr.open(options.type, options.url, options.async);
    if (options.type == 'POST') {
        xhr.setRequestHeader('Content-Type', options.contentType);
    }

    // 使用 v 参数的方式防止缓存，该方式跨域请求时需要服务端做相关配置
    // if (options.type == 'GET' && !options.cache) {
    //     xhr.setRequestHeader('If-Modified-Since', '0');
    //     xhr.setRequestHeader('Cache-Control', 'no-cache');
    // }
    xhr.send(options.params);
}

function ajaxSuccess(data, xhr, options) {
    var context = options.context;
    options.success.call(context, data, xhr, options);
}

function ajaxError(error, xhr, options) {
    var context = options.context;
    options.error.call(context, error ? error : xhr, options);
}

function getUrlConnector(url) {
    return url.indexOf('?') == -1 ? '?' : '&';
}

function serializeParams(options) {
    var type = options.type;
    var params = options.params || {};
    var contentType = options.contentType;

    if (type == 'POST' && contentType == 'application/json') {
        return JSON.stringify(params);
    }

    if (type == 'GET' && !options.cache) {
        params['v'] = +new Date();
    }

    var s = [],
        add = function (key, value) {
            s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        },

        loop = function (key, value) {
            if (typeof value == 'object' && value !== null) {
                if (Object.prototype.toString.call(value) == '[object Object]') {
                    for (var propName in value ) {
                        loop(key + '[' + propName + ']', value[propName]);
                    }
                }

                if (Object.prototype.toString.call(value) == '[object Array]') {
                    for (var i = 0, l = value.length; i < l; i++) {
                        loop(key + '[' + i + ']', value[i]);
                    }
                }
            } else {
                // number, string, boolean, null, undefined, function
                if (typeof value != 'undefined' && typeof value != 'function') {
                    add(key, value);
                }
            }
        }

    for (var propName in params) {
        loop(propName, params[propName]);
    }
    return s.join('&');
};
export default Ajax;