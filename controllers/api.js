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
  // test
  symbols.forEach((symbol) => {
    if (symbol.symbol === 'VSB' || symbol.symbol === 'VUN') {
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
exports.getQuotes = (req, res, next) => {
  const symbolsStr = req.query.symbols;
  console.log(symbolsStr);
  const url = makeQuotesUrl(JSON.parse(symbolsStr));
  console.log(url);
  request(url, (error, response, body) => {
    if (error) { return next(error); }
    // if (request.statusCode === 403) {
    //   return next(new Error('Error when getting quotes'));
    // }
    // Google returns string with //, chop it off.
    console.log('body', body);
    const result = JSON.parse(body.replace(/\/\//, ''));
    res.send({ response: JSON.stringify(result) });
  });
};
