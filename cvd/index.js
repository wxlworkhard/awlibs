const formhandler = require('../formhandler');
const Lazychain = require('../lazychain');


function CVD(store) {
    this.store = store;
}

CVD.dispatch = formhandler.dispatch;
CVD.register = formhandler.register;

CVD.prototype.getStore = function () {
    return {
        ...this.store,
    };
}

CVD.prototype.setStore = function (store) {
    return this.store = {
        ...this.store,
        ...store,
    };
}

CVD.prototype.init = function (connectorHandle, validatorHandle, dependencyHandle) {
    this.initConnector(connectorHandle);
    this.initValidator(validatorHandle);
    this.initDependency(dependencyHandle);
};

CVD.prototype.flow = function (params) {
    const lc = new Lazychain(params);

    lc.tap((cvdResult) => {
        return this.connector({
            ...cvdResult
        });
    }).tap((cvdResult) => {
        return this.validator({
            ...cvdResult,
        });
    }).tap((cvResult) => {
        return this.dependency({
            ...cvResult,
        });
    });

    return lc.force();
}



CVD.prototype.initConnector = function (connectorHandle) {
    this.connector = (function (args) {
        let { key, value, params } = args;
        let { model } = this.store;

        // let cRet = connectorHandle(key, value, params, this.store);
        let cRet = typeof connectorHandle == 'function' ? connectorHandle(key, value, params, this.store) : null;
        cRet = cRet == null ? value : cRet;

        if (Object.keys(model).indexOf(key) != -1) {
            model = {
                ...model,
                [key]: cRet == null ? getDefaultValue(model, key) : cRet
            };
        }

        this.store = {
            ...this.store,
            model,
        };

        return {
            ...args,
            cRet,
        };
    }).bind(this);
};

CVD.prototype.initValidator = function (validatorHandle) {
    this.validator = (function (args) {
        /**
         * key 校验的控件标准   Required
         * cRet 要校验的值
         */
        let { key, cRet, params } = args;
        let { desc } = this.store;

        let vRet = {
            valid: true,
            msg: ''
        };

        // vRet = validatorHandle(key, cRet, params) || vRet;
        let tmp = typeof validatorHandle == 'function' ? validatorHandle(key, cRet, params) : null;
        vRet = tmp || vRet;

        desc = {
            ...desc,
            [key]: {
                ...desc[key],
                ...vRet
            }
        };

        this.store.desc = desc;

        return {
            ...args,
            vRet,
        };
    }).bind(this);
}

CVD.prototype.initDependency = function (dependencyHandle) {
    this.dependency = (function (args) {
        let { key, cRet, params } = args;
        let { desc } = this.store;

        // let store = dependencyHandle(key, cRet, params, this.store);
        let store = typeof dependencyHandle == 'function' ? dependencyHandle(key, cRet, params, this.store) : null;

        this.store = {
            ...this.store,
            ...store
        };
        return {
            ...args,
        };
    }).bind(this);
}

function getDefaultValue(obj, key) {
    const type = Object.prototype.toString.call(obj[key]);
    const typeValueMap = {
        '[object String]': '',
        '[object Object]': {},
        '[object Array]': [],
    };

    let ret = typeValueMap[type];

    if (ret == null) {
        ret = '';
    }
    return ret;
}

module.exports = CVD;