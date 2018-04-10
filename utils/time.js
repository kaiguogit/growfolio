const moment = require('moment-timezone');
const NEW_YORK_TIME_ZONE = 'America/New_York';

const guardEmptyDate = (date) => {
    if (!date) {
        return moment();
    }
    if (!moment.isMoment(date)) {
        return moment(date);
    }
    return date;
};

/**
 * is date one of week day?
 * @param {Moment} date
 */
const isWeekDay = date => {
    date = guardEmptyDate(date);
    const dow = date.tz(NEW_YORK_TIME_ZONE).day();
    if (dow > 0 && dow < 6) {
        return true;
    }
    return false;
};

/**
 * Get last week day.
 * @param {Moment} date On or before the date.
 */
const lastWeekDay = (date) => {
    date = guardEmptyDate(date);
    let dow = date.tz(NEW_YORK_TIME_ZONE).day();
    if (dow === 0) {
        //today is Sunday return last Friday
        return moment.tz(NEW_YORK_TIME_ZONE).day(-2);
    }
    if (dow === 6) {
        //today is Staturday return this Friday
        return moment.tz(NEW_YORK_TIME_ZONE).day(5);
    }
    // today is weekday
    return date;
};

const isMarketOpened = () => {
    if (isWeekDay()) {
        const now = moment();
        // Set to new york time's 9:30 - 16:00
        const marketOpen = moment.tz(NEW_YORK_TIME_ZONE).hour(9).minute(30).second(0);
        const marketClose = moment.tz(NEW_YORK_TIME_ZONE).hour(16).minute(0).second(0);
        //Exclusive https://momentjs.com/docs/#/query/is-between/
        return now.isBetween(marketOpen, marketClose, 'minute', '()');
    }
    return false;
};

// Between Eastern Time weekday 4pm - 11:59pm. Other time include weekend day is considered
// before market close.
const isAfterMarketClose = () => {
    if (isWeekDay()) {
        const now = moment();
        // Set to new york time's 9:30 - 16:00
        const marketClose = moment.tz(NEW_YORK_TIME_ZONE).hour(16).minute(0).second(0);
        const endOfDay = moment.tz(NEW_YORK_TIME_ZONE).hour(23).minute(59).second(59);
        return now.isBetween(marketClose, endOfDay, 'second', '[]]');
    }
    return false;
};

const yesterday = () => {
    return moment().subtract(1, 'days');
};

module.exports = {
    NEW_YORK_TIME_ZONE,
    lastWeekDay,
    isMarketOpened,
    isAfterMarketClose,
    yesterday
};