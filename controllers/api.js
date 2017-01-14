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
  const symbolsStr = req.query.q;
  const qs = {
    client: 'ig',
    q: symbolsStr
  };
  const baseUrl = 'http://finance.google.com/finance/info';
  const url = makeUrl(baseUrl, qs);
  console.log(url);
  request(url, (error, response, body) => {
    if (error) { return next(error); }
    // if (request.statusCode === 403) {
    //   return next(new Error('Error when getting quotes'));
    // }
    // Google returns string with //, chop it off.
    const result = JSON.parse(body.replace(/\/\//, ''));
    res.send({ response: JSON.stringify(result) });
  });
};
