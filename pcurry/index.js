module.exports = function pcurry(promise, length) {
    length = length || 1;

    return recursive(promise, length);

    function recursive(promise, length) {
        if (length > 0) {
            return function() {
                length -= 1;
                const onResolved = typeof arguments[0] == 'function' ? arguments[0] : undefined;
                const onRejected = typeof arguments[1] == 'function' ? arguments[1] : undefined;
                promise = promise.then(onResolved, onRejected);
                return recursive(promise, length);
            }
        } else {
            return promise;
        }
    }
}