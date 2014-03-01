var hkPromise = function () {
    'use strict';

    var STATUS = {
        INITIAL: "initial",
        RESOLVED: "resolved",
        DENIED: "denied"
    };

    function _bind(fn, context) {
        return function () {
            return fn.apply(context, arguments);
        };
    }

    function Promise() {
        this._thenCallbacks = [];
        this._failCallbacks = [];
        this._status = STATUS.INITIAL;
        this._result = null;
    }

    Promise.prototype.resolve = function () {
        this._status = STATUS.RESOLVED;
        this._result = Array.prototype.slice.call(arguments);
        var index = this._thenCallbacks.length;
        while (index--) {
            this._thenCallbacks[index].apply(this, arguments);
        }
        return this;
    };

    Promise.prototype.deny = function (reason) {
        this._status = STATUS.DENIED;
        this._result = reason;
        var index = this._failCallbacks.length;
        while (index--) {
            this._failCallbacks[index].apply(null, [reason]);
        }
        return this;
    };

    Promise.prototype.then = function (callback, context) {
        if (this._status === STATUS.RESOLVED) {
            callback.apply(context, this._result);
        } else {
            this._thenCallbacks.push(_bind(callback, context));
        }
        return this;
    };

    Promise.prototype.fail = function (callback, context) {
        if (this._status === STATUS.DENIED) {
            callback.apply(context, this._result);
        } else {
            this._failCallbacks.push(_bind(callback, context));
        }
        return this;
    };

    function when(promises) {
        var newPromise = new Promise(),
            promisesLeft = promises.length,
            resolvedArguments = new Array(promises.length);

        for (var i = 0; i < promises.length; i++) {
            promises[i]
                .then(function () {
                    resolvedArguments[this.position] = Array.prototype.slice.call(arguments);
                    if (--promisesLeft === 0) {
                        newPromise.resolve.apply(newPromise, resolvedArguments);
                    }
                }, { position: i })
                .fail(function (reason) {
                    newPromise.deny(reason);
                });
        }
        return newPromise;
    }

    return {
        Promise: Promise,
        when: when
    };
};
