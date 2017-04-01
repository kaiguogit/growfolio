'use strict';

const request = require('request');
const { makeUrl } = require('../utils');

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples'
  });
};

/**
 * GET /api/quotes
 * Yahoo quotes
 */
exports.getQuotes = (req, res, next) => {
  var BASE_URI = 'https://query.yahooapis.com/v1/public/yql';
  var qs = {
    q: `select * from yahoo.finance.quotes where symbol in ("YHOO","AAPL","GOOG","MSFT")`,
    format:'json',
    diagnostics: 'true',
    env: 'store://datatables.org/alltableswithkeys',
    callback: ''
  }
  request.get({url: BASE_URI, qs: qs}, (err, request, body) => {
    if (err) { return next(err); }
    if (request.statusCode === 403) {
      return next(new Error('Error when getting quotes'));
    }
    res.send({response: JSON.parse(body)});
  });
}

/**
 * GET /api/foursquare
 * Foursquare API example.
 */
exports.getFoursquare = (req, res, next) => {
  const token = req.user.tokens.find(token => token.kind === 'foursquare');
  async.parallel({
    trendingVenues: (callback) => {
      foursquare.Venues.getTrending('40.7222756', '-74.0022724', { limit: 50 }, token.accessToken, (err, results) => {
        callback(err, results);
      });
    },
    venueDetail: (callback) => {
      foursquare.Venues.getVenue('49da74aef964a5208b5e1fe3', token.accessToken, (err, results) => {
        callback(err, results);
      });
    },
    userCheckins: (callback) => {
      foursquare.Users.getCheckins('self', null, token.accessToken, (err, results) => {
        callback(err, results);
      });
    }
  });
  //
  let symbolsStr = symbols.map(x => (
    x.exch ? `${x.exch}:${x.symbol}` : x.symbol
  ));
  symbolsStr = symbolsStr.join(',');
  const params = {
    client: 'ig',
    q: symbolsStr
  };
  return makeUrl(BASE_URI, params);
};

/**
 * GET /api/quotes
 * Yahoo quotes
 */
exports.getQuotes = (req, res) => {
  const symbolsStr = req.query.symbols;
  const url = makeQuotesUrl(JSON.parse(symbolsStr));
  request(url, (error, response, body) => {
    const errorReponse = {
      status_code: request.statusCode,
      error,
      message: 'Error when getting quotes',
      success: false
    };
    if (error) { res.json(errorReponse); }
    // if (request.statusCode === 403) {
    //   return next(new Error('Error when getting quotes'));
    // }
    // Google returns string with //, chop it off.
    try {
      const result = JSON.parse(body.replace(/\/\//, ''));
      res.json({ success: true, result });
    } catch (err) {
      res.json(errorReponse);
    }
  });
};
