function existy(x) {
    return x != null;
}

function dispatch() {
    const funcs = [].slice.call(arguments, 0);

    return function () {
        const args = [].slice.call(arguments, 0);
        let ret;
        funcs.some((item) => {
            ret = item.apply(this, args);
            if (existy(ret)) {
                return true;
            }
        });
        return ret;
    }
}

function register(key, func) {
    const keyArray = key.split(',');
    return function () {
        const args = [].slice.call(arguments, 0);
        if (keyArray.indexOf(args[0]) != -1) {
            return func.apply(this, args);
        } else {
            return undefined;
        }
    }
}

export default {
    dispatch,
    register
}