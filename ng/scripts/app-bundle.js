define('app',['exports', './web-api'], function (exports, _webApi) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    App.inject = function inject() {
      return [_webApi.WebAPI];
    };

    function App(api) {
      _classCallCheck(this, App);

      this.api = api;
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Growfolio';
      config.map([{ route: '', moduleId: 'portfolio', title: 'Portfolio' }]);

      this.router = router;
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().plugin('aurelia-table').feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('performance-table',['exports', './web-api'], function (exports, _webApi) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PerformanceTable = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _class, _temp;

    var PerformanceTable = exports.PerformanceTable = (_temp = _class = function () {
        function PerformanceTable(api) {
            _classCallCheck(this, PerformanceTable);

            this.api = api;
            this.holdings = {};
        }

        PerformanceTable.prototype._getTransactions = function _getTransactions() {
            var _this = this;

            return this.api.getTransactionList().then(function (transactions) {
                return _this.transactions = transactions;
            });
        };

        PerformanceTable.prototype.created = function created() {
            this._loadData();
        };

        PerformanceTable.prototype._loadData = function _loadData() {
            var _this2 = this;

            this._getTransactions().then(function () {
                var holdingMap = {};

                _this2.transactions.forEach(function (trsc) {
                    if (!holdingMap[trsc.symbol]) {
                        holdingMap[trsc.symbol] = {
                            symbol: trsc.symbol,
                            sellTransactions: [],
                            buyTransactions: [],
                            cost: 0
                        };
                    }
                    if (trsc.type === 'buy') {
                        holdingMap[trsc.symbol].buyTransactions.push(trsc);
                    } else {
                        holdingMap[trsc.symbol].sellTransactions.push(trsc);
                    }
                });

                _this2._calcHoldingCost(holdingMap);
                _this2.holdings = Object.values(holdingMap);
            });
        };

        PerformanceTable.prototype._calcHoldingCost = function _calcHoldingCost(holdings) {
            Object.keys(holdings).forEach(function (symbol) {
                var holding = holdings[symbol];
                var soldShares = holding.sellTransactions.reduce(function (acc, cur) {
                    return acc + cur.shares;
                }, 0);

                holding.cost = holding.buyTransactions.reduce(function (acc, trsc) {
                    var leftShares = void 0,
                        cost = void 0;

                    if (trsc.shares < soldShares) {
                        leftShares = 0;
                        soldShares -= trsc.shares;
                    } else {
                        leftShares = trsc.shares - soldShares;
                        soldShares = 0;
                    }
                    cost = leftShares / trsc.shares * (trsc.shares * trsc.price + trsc.commission);
                    return acc + cost;
                }, 0);
            });
        };

        return PerformanceTable;
    }(), _class.inject = [_webApi.WebAPI], _temp);
});
define('portfolio',["exports", "./web-api"], function (exports, _webApi) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Portfolio = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _class, _temp;

    var TRSC = "transactions";
    var PERF = "performance";

    var Portfolio = exports.Portfolio = (_temp = _class = function () {
        function Portfolio(api) {
            _classCallCheck(this, Portfolio);

            this.api = api;
            this.name = "p1";
            this.currentTable = TRSC;
            this.tables = [TRSC, PERF];
        }

        Portfolio.prototype.selectTable = function selectTable(table) {
            this.currentTable = table;
        };

        return Portfolio;
    }(), _class.inject = [_webApi.WebAPI], _temp);
});
define('transaction-table',['exports', './web-api'], function (exports, _webApi) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TransactionTable = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _class, _temp;

    var TransactionTable = exports.TransactionTable = (_temp = _class = function () {
        function TransactionTable(api) {
            _classCallCheck(this, TransactionTable);

            this.api = api;
        }

        TransactionTable.prototype.created = function created() {
            var _this = this;

            this.api.getTransactionList().then(function (transactions) {
                return _this.transactions = transactions;
            });
        };

        return TransactionTable;
    }(), _class.inject = [_webApi.WebAPI], _temp);
});
define('web-api',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var latency = 200;
  var id = 0;

  function getId() {
    return ++id;
  }

  var holdings = [{
    id: getId(),
    symbol: 'YHOO',
    price: 123
  }];

  var transactions = [{
    id: getId(),
    symbol: 'YHOO',
    type: 'buy',
    shares: 1000,
    price: 1.00,
    commission: 50.00,
    date: new Date(2016, 11, 7)
  }, {
    id: getId(),
    symbol: 'YHOO',
    type: 'buy',
    shares: 1000,
    price: 1.10,
    commission: 30.00,
    date: new Date(2016, 11, 8)
  }, {
    id: getId(),
    symbol: 'YHOO',
    type: 'sell',
    shares: 1500,
    price: 1.20,
    commission: 0.00,
    date: new Date(2016, 11, 15)
  }];

  var WebAPI = exports.WebAPI = function () {
    function WebAPI() {
      _classCallCheck(this, WebAPI);

      this.isRequesting = false;
    }

    WebAPI.prototype.getTransactionList = function getTransactionList() {
      return this._sendArray(transactions);
    };

    WebAPI.prototype.getHoldingList = function getHoldingList() {
      return this._sendArray(holdings);
    };

    WebAPI.prototype._sendArray = function _sendArray(data) {
      var _this = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(data.slice(0));
          _this.isRequesting = false;
        }, latency);
      });
    };

    WebAPI.prototype.getHoldingDetails = function getHoldingDetails(id) {
      var _this2 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          var found = holdings.filter(function (x) {
            return x.id == id;
          })[0];
          resolve(JSON.parse(JSON.stringify(found)));
          _this2.isRequesting = false;
        }, latency);
      });
    };

    WebAPI.prototype.saveHolding = function saveHolding(holding) {
      var _this3 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          var instance = JSON.parse(JSON.stringify(holding));
          var found = holdings.filter(function (x) {
            return x.id == holding.id;
          })[0];

          if (found) {
            var index = holdings.indexOf(found);
            holdings[index] = instance;
          } else {
            instance.id = getId();
            holdings.push(instance);
          }

          _this3.isRequesting = false;
          resolve(instance);
        }, latency);
      });
    };

    return WebAPI;
  }();
});
define('resources/index',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.configure = configure;
    function configure(config) {
        config.globalResources(['./elements/loading-indicator']);
    }
});
define('resources/elements/loading-indicator',['exports', 'nprogress', 'aurelia-framework'], function (exports, _nprogress, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LoadingIndicator = undefined;

  var nprogress = _interopRequireWildcard(_nprogress);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var LoadingIndicator = exports.LoadingIndicator = (0, _aureliaFramework.decorators)((0, _aureliaFramework.noView)(['nprogress/nprogress.css']), (0, _aureliaFramework.bindable)({ name: 'loading', defaultValue: false })).on(function () {
    function _class() {
      _classCallCheck(this, _class);
    }

    _class.prototype.loadingChanged = function loadingChanged(newValue) {
      if (newValue) {
        nprogress.start();
      } else {
        nprogress.done();
      }
    };

    return _class;
  }());
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./styles.css\"></require>\n  <require from=\"./portfolio\"></require>\n\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <a class=\"navbar-brand\" href=\"#\">\n        <i class=\"fa fa-user\"></i>\n        <span>Portfolio</span>\n      </a>\n    </div>\n  </nav>\n\n  <loading-indicator loading.bind=\"router.isNavigating || api.isRequesting\"></loading-indicator>\n\n  <div class=\"container\">\n    <div class=\"row\">\n      <portfolio class=\"col-md-10 col-md-offset-1 \"></portfolio>\n    </div>\n  </div>\n</template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 70px; }"; });
define('text!performance-table.html', ['module'], function(module) { module.exports = "<template>\n    <table class=\"table\" aurelia-table=\"data.bind: holdings; display-data.bind: $displayData\">\n        <thead>\n            <tr>\n                <th>Symbol</th>\n                <th>Cost Basis</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr repeat.for=\"holding of $displayData\">\n                <td>${holding.symbol}</td>\n                <td>${holding.cost}</td>\n            </tr>\n        </tbody>\n    </table>\n</template>"; });
define('text!portfolio.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./transaction-table\"></require>\n    <require from=\"./performance-table\"></require>\n\n    <h1>${name}</h1>\n    <a repeat.for=\"table of tables\" click.delegate=\"$parent.selectTable(table)\">${table}</a>\n    <transaction-table if.bind=\"currentTable === 'transactions'\"></transaction-table>\n    <performance-table if.bind=\"currentTable === 'performance'\"></performance-table>\n</template>"; });
define('text!transaction-table.html', ['module'], function(module) { module.exports = "<template>\n    <table class=\"table\" aurelia-table=\"data.bind: transactions; display-data.bind: $displayData\">\n        <thead>\n            <tr>\n                <th>Symbol</th>\n                <th>Type</th>\n                <th>Date</th>\n                <th>Shares</th>\n                <th>Price</th>\n                <th>Commission</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr repeat.for=\"trsc of $displayData\">\n                <td>${trsc.symbol}</td>\n                <td>${trsc.type}</td>\n                <td>${trsc.date.toDateString()}</td>\n                <td>${trsc.shares}</td>\n                <td>${trsc.price}</td>\n                <td>${trsc.commission}</td>\n            </tr>\n        </tbody>\n    </table>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map