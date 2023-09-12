export function wait(time: number) {
    return new Promise<void>((resolve) => {
        window.setTimeout(resolve, time);
    });
}

export function waitAnimation(time?: number) {
    return new Promise((resolve) => {
        if (time) {
            window.setTimeout(() => {
                window.requestAnimationFrame(resolve);
            }, time);
        } else {
            window.requestAnimationFrame(resolve);
        }
    });
}

export async function retry(time: number, callback: () => Promise<boolean>) {
    let done = false;
    do {
        try {
            done = await callback();
            if (!done) {
                throw new Error('Attempt failed, trying again');
            }
        } catch (e) {
            await wait(time);
        }
    } while (!done);
}

type ExtendedFunction0<T> = (...args: any[]) => T;
type ExtendedFunction1<T, U> = (arg0: T) => U;
type ExtendedFunction2<T, U, V> = (arg0: T, arg1: U) => V;
type ExtendedFunction3<T, U, V, W> = (arg0: T, arg1: U, arg2: V) => W;
type ExtendedFunction4<T, U, V, W, X> = (arg0: T, arg1: U, arg2: V, arg3: W) => X;

export function debounce<T>(func: ExtendedFunction0<T>, wait: number, immediate?: boolean): () => void;
export function debounce<T, U>(func: ExtendedFunction1<T, U>, wait: number, immediate?: boolean): (arg0: T) => void;
export function debounce<T, U, V>(func: ExtendedFunction2<T, U, V>, wait: number, immediate?: boolean): (arg0: T, arg1: U) => void;
export function debounce<T, U, V, W>(func: ExtendedFunction3<T, U, V, W>, wait: number, immediate?: boolean): (arg0: T, arg1: U, arg2: V) => void;
export function debounce<T, U, V, W, X>(func: ExtendedFunction4<T, U, V, W, X>, wait: number, immediate?: boolean): (arg0: T, arg1: U, arg2: V, arg3: W) => void;
export function debounce(func: Function, wait: number, immediate?: boolean): Function {
    var timeout: number | undefined;
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

type CleanPromise<T> = T extends Promise<infer U> ? Promise<U> : Promise<T>;
type PrmoiseFunction<T extends(...args: any) => any> = (
    ...args: Parameters<T>
) => CleanPromise<ReturnType<T>>;

export function debouncePromise<T extends (...args: any)=> any>(func: T, wait: number, thisArg?: any): PrmoiseFunction<T> {
    var self = thisArg || {};

    var args: any;
    var timeout: number | undefined;
    var promise: Promise<any> | undefined;
    var resolveExternal: any;

    return function () {
        args = arguments;

        // If there is no promise, create one
        if (!promise) {
            promise = new Promise<any>(function (resolve) {
                resolveExternal = resolve;
                timeout = window.setTimeout(function () {
                    timeout = undefined;
                    promise = undefined;
                    resolve(func.apply(self, args));
                }, wait);
            });
        } else {
            // There is a promise, so we need to reset the timeout
            if (timeout) {
                window.clearTimeout(timeout);
                timeout = window.setTimeout(function () {
                    timeout = undefined;
                    promise = undefined;
                    resolveExternal(func.apply(self, args));
                }, wait);
            } else {
                throw 'No Promise or Timeout for debouncePromise';
            }
        }
        return promise;
    } as any;
}