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

const BASE_URI = 'https://www.alphavantage.co/query';
// Expect symbol for TSX to have prefix "TSX:", e.g TSX:VFV
const makeQuotesUrl = (symbol) => {
  const params = {
    function: 'TIME_SERIES_DAILY_ADJUSTED',
    symbol,
    apikey: process.env.ALPHA_VANTAGE_API_KEY
  };
  return makeUrl(BASE_URI, params);
};

/**
 * GET /api/quotes
 */
exports.getQuotes = (req, res) => {
  const symbol = req.query.symbol;
  const url = makeQuotesUrl(symbol);
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
      // const result = JSON.parse(body.replace(/\/\//, ''));
      const result = JSON.parse(body);
      res.json({ success: true, result });
    } catch (err) {
      res.json(errorReponse);
    }
  });
};
