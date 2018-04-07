
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
const delay = (t, v) => {
    return new Promise(function(resolve) {
        setTimeout(resolve.bind(null, v), t);
    });
 };

Promise.prototype.delay = function(t) {
    return this.then(function(v) {
        return delay(t, v);
    });
};
