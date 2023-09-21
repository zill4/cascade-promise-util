"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debouncePromise = exports.debounce = exports.retry = exports.waitAnimation = exports.wait = void 0;
function wait(time) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, time);
    });
}
exports.wait = wait;
function waitAnimation(time) {
    return new Promise((resolve) => {
        if (time) {
            window.setTimeout(() => {
                window.requestAnimationFrame(resolve);
            }, time);
        }
        else {
            window.requestAnimationFrame(resolve);
        }
    });
}
exports.waitAnimation = waitAnimation;
async function retry(time, callback) {
    let done = false;
    do {
        try {
            done = await callback();
            if (!done) {
                throw new Error('Attempt failed, trying again');
            }
        }
        catch (e) {
            await wait(time);
        }
    } while (!done);
}
exports.retry = retry;
function debounce(func, wait, immediate) {
    var timeout;
    var self = {};
    return function () {
        var args = arguments;
        var later = () => {
            timeout = undefined;
            if (!immediate) {
                func.apply(self, args);
            }
        };
        var callNow = immediate && !timeout;
        window.clearTimeout(timeout);
        timeout = window.setTimeout(later, wait);
        if (callNow) {
            func.apply(self, args);
        }
    };
}
exports.debounce = debounce;
function debouncePromise(func, wait, thisArg) {
    var self = thisArg || {};
    var args;
    var timeout;
    var promise;
    var resolveExternal;
    return function () {
        args = arguments;
        if (!promise) {
            promise = new Promise(function (resolve) {
                resolveExternal = resolve;
                timeout = window.setTimeout(function () {
                    timeout = undefined;
                    promise = undefined;
                    resolve(func.apply(self, args));
                }, wait);
            });
        }
        else {
            if (timeout) {
                window.clearTimeout(timeout);
                timeout = window.setTimeout(function () {
                    timeout = undefined;
                    promise = undefined;
                    resolveExternal(func.apply(self, args));
                }, wait);
            }
            else {
                throw 'No Promise or Timeout for debouncePromise';
            }
        }
        return promise;
    };
}
exports.debouncePromise = debouncePromise;
//# sourceMappingURL=PromiseUtil.js.map