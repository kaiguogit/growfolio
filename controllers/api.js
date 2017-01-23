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

const BASE_URI = 'http://finance.google.com/finance/info';
const makeQuotesUrl = (symbols) => {
  // Accommodate bug in production,that Toronto exch can't get qutoes properly.
  symbols.forEach((symbol) => {
    if (symbol.symbol === 'VSB' || symbol.symbol === 'VUN' || symbol.symbol === 'CPD') {
      symbol.exch = 'TSE';
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
