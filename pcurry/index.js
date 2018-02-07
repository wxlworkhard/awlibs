module.exports = function pcurry() {
    const flows = [];
    return recursive(arguments[0], flows);

    function recursive() {
        let target = arguments[0];
        const flows = arguments[1];

        if (typeof target == 'function' ) {
            flows.push(target);

            return function() {
                return recursive(arguments[0], flows);
            }
        }

        if (target && typeof target.then == 'function') {
            flows.forEach((func) => {
                target = func(target);
            });

            return target;
        }
    }
}