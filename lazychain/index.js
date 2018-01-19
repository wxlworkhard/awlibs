function Lazychain(target) {
    this._calls = [];
    this._target = target;
}

Lazychain.prototype.force = function () {
    return this._calls.reduce((target, thunk) => {
        return thunk(target);
    }, this._target);
}

Lazychain.prototype.tap = function (fun) {
    this._calls.push((target) => {
        return fun(target);
    });
    return this;
}

export default Lazychain;