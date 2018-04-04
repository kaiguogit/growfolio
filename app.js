// Backend is based on hackathon boilerplate
// https://github.com/sahat/hackathon-starter
// Frontend is based on react slingshot
// https://github.com/coryhouse/react-slingshot

/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const https = require('https');
const http = require('http');
const fs = require('fs');


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const apiController = require('./controllers/api');
// const contactController = require('./controllers/contact');
const transactionController = require('./controllers/transaction');
const allocationController = require('./controllers/allocation');
const historicalQuoteController = require('./controllers/quote');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

// SSL keys
const options = {
  key: fs.readFileSync('test/fixtures/keys/key.pem'),
  cert: fs.readFileSync('test/fixtures/keys/cert.pem')
};

/**
 * Create Express server.
 */
const app = express();

/** Get isDEv
 * https://stackoverflow.com/questions/8449665/how-do-you-detect-the-environment-in-an-express-js-app
 * https://github.com/expressjs/express/blob/master/lib/application.js#L71
 */
const isDev = app.get('env') === 'development';

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

const ensureSecure = (req, res, next) => {
  // Use 'x-forwarded-proto' for heroku as Heroku terminates SSL connections at the load balancer
  // level
  // https://stackoverflow.com/questions/32952085/express-js-redirect-to-https-and-send-index-html
  // https://stackoverflow.com/questions/24015292/express-4-x-redirect-http-to-https
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
  // OK, continue
    return next();
  }
  res.redirect(`https://${req.headers.host}${req.url}`);
};

if (!isDev) {
  app.all('*', ensureSecure);
}

/**
 * Enable CORS
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
/**
 * Express configuration.
 */

app.set('views', path.join(__dirname, 'views'));
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// pass the authorization checker middleware
const authCheckMiddleware = require('./middleware/auth-check');

app.use('/api', authCheckMiddleware);
/**
 * Primary app routes.
 */
app.post('/signup', userController.postSignup);
app.post('/login', userController.postLogin);

app.route('/api/transactions')
  .get(transactionController.getTransactions)
  .post(transactionController.createTransactions)
  .put(transactionController.editTransactions)
  .delete(transactionController.deleteTransactions);

app.route('/api/allocations')
  .get(allocationController.getAllocations)
  .post(allocationController.createAllocations)
  .delete(allocationController.deleteAllocations);
app.route('/api/quotes')
  .get(apiController.getQuotes);
app.route('/api/historical-quotes')
  .get(historicalQuoteController.getHistoricalQuotes)
  .post(historicalQuoteController.createHistoricalQuotes)
  .put(historicalQuoteController.editHistoricalQuotes)
  .delete(historicalQuoteController.deleteHistoricalQuotes);
app.get('*', homeController.index);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */

// Create an HTTP service.
// http://expressjs.com/en/api.html
// https://docs.nodejitsu.com/articles/HTTP/servers/how-to-create-a-HTTPS-server/
// https://stackoverflow.com/questions/5998694/how-to-create-an-https-server-in-node-js
// https://stackoverflow.com/questions/8355473/listen-on-http-and-https-for-a-single-express-app
app.set('httpPort', process.env.PORT || 8000);
app.set('httpsPort', isDev ? 8001 : 443);
http.createServer(app).listen(app.get('httpPort'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('httpPort'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

// Create an HTTPS service identical to the HTTP service.
// Can't use this for Heroku as it doesn't allow binding 443
// It's load balancer will terminates SSL/TLS and give dyno plain HTTP traffic.
// https://stackoverflow.com/questions/28260492/express-unable-to-bind-to-port-443-on-heroku

// https.createServer(options, app).listen(app.get('httpsPort'), () => {
//   console.log('%s App is running at https://localhost:%d in %s mode', chalk.green('✓'), app.get('httpsPort'), app.get('env'));
//   console.log('  Press CTRL-C to stop\n');
// });

module.exports = app;
