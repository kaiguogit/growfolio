const BASE_STYLE = 'font-weight: normal; padding: 0 5px; color: #0d0d0d;';
const LOG_STYLES = {
    info: 'background: #dbf0fe; ' + BASE_STYLE,
    warning: 'background: #fff3b2; ' + BASE_STYLE
};
const log = {};

const _log = function(type, args, alwaysLog) {
    let formatted, error, fancySupport;
    let console = window.console;
    if (console && (__DEV__ || alwaysLog)) {
        fancySupport = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
        if (type === 'error' && typeof console.error === 'function') {
            console.error.apply(console, args);
        } else if (fancySupport && typeof console.groupCollapsed === 'function') {
            formatted = Array.prototype.slice.call(args).join(' ');
            console.groupCollapsed('%c ' + formatted, LOG_STYLES[type]);
            error = new Error();
            if (error.stack) {
                console.log(error.stack.split('\n').slice(1).join('\n'));
            }
            console.groupEnd();
        } else if (typeof console.log === 'function') {
            console.log.apply(console, args);
        }
    }
};

/**
 * Print something to the console. Use for general info/debugging purposes. Only performed on
 * debug builds.
 *
 *
 * @param {...*} - Message arguments. See
 *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Console/log}.
 * @alias fweb.log.info
 *
 */
log.info = function() {
    _log('info', arguments);
};

/**
 * Print a warning to the console. Only performed on debug builds.
 *
 * @param {...*} - Message arguments. See
 *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Console/log}.
 */
log.warn = function() {
    _log('warning', arguments);
};

/**
 * Print an error to the console. Performed on all builds.
 *
 * @param {...*} - Message arguments. See
 *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Console/error}.
 */
log.error = function() {
    _log('error', arguments, true);
};

export default log;