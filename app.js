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

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

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
app.set('port', process.env.PORT || 8000);
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
  .delete(transactionController.deleteTransactions);

app.route('/api/allocations')
  .get(allocationController.getAllocations)
  .post(allocationController.createAllocations)
  .delete(allocationController.deleteAllocations);
app.route('/api/quotes')
  .get(apiController.getQuotes);

app.get('*', homeController.index);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
