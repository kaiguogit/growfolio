
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
