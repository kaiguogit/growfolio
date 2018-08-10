/**
 * Create a promise that will reject at timeout
 * https://stackoverflow.com/questions/32461271/nodejs-timeout-a-promise-if-failed-to-complete-in-time
 *
 * @param {number} timeout
 * @param {promise} promise
 * @returns
 */
Promise.timeout = (timeout, promise) => {
    return Promise.race([
        promise,
        new Promise((resolve, reject) => {
            setTimeout(() => { reject('Timed out'); }, timeout);
        })
    ]);
};
/**
 * Creat a promise with delay.
 * https://stackoverflow.com/questions/39538473/using-settimeout-on-promise-chain
 */
const delay = (t, v, isReject) => {
    return new Promise(function(resolve, reject) {
        setTimeout((isReject ? reject : resolve).bind(null, v), t);
    });
 };

if (!Promise.prototype.delay) {
    Promise.prototype.delay = function(t) {
        return this.then(function(v) {
            return delay(t, v);
        }, function(error) {
            return delay(t, error, true);
        });
    };
}

// Add `finally()` to `Promise.prototype`
// Realized I don't need it, just need to add a catch to chain, then add any promise to chain.

// http://thecodebarbarian.com/using-promise-finally-in-node-js.html
// https://stackoverflow.com/questions/35999072/what-is-the-equivalent-of-bluebird-promise-finally-in-native-es6-promises/35999141#35999141
// const promiseFinally = require('promise.prototype.finally');
// promiseFinally.shim();

// if (!Promise.prototype.finally) {
//     Promise.prototype.finally = function(onFinally) {
//         return this.then(
//         /* onFulfilled */
//         res => Promise.resolve(onFinally()).then(() => res),
//         /* onRejected */
//         err => Promise.resolve(onFinally()).then(() => { throw err; })
//         );
//     };
// }