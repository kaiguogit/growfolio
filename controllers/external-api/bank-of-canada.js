const request = require('request-promise-native');
const BASE_URI = 'https://www.bankofcanada.ca/valet/observations/group/FX_RATES_DAILY/json';

process.$request = request;
exports.exchangeRate = () => {
    return request({
        url: BASE_URI,
        json: true,
        qs: {
            start_date: '2017-01-03'
        }
    }).then((data) => {
        const observations = data.observations;
        return observations;
    }, err => {
        return Promise.reject(err);
    });
};