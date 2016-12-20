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
define('debug',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Debug = exports.Debug = function () {
    function Debug() {
      _classCallCheck(this, Debug);

      this.bindingContext = null;
    }

    Debug.prototype.updateJson = function updateJson() {
      if (this.bindingContext === null) {
        this.json = 'null';
      } else if (this.bindingContext === undefined) {
        this.json = 'undefined';
      } else {
        this.json = JSON.stringify(this.bindingContext, null, 2);
      }
    };

    Debug.prototype.bind = function bind(bindingContext) {
      this.bindingContext = bindingContext;
      this.updateJson();
      this.interval = setInterval(this.updateJson, 150);
    };

    Debug.prototype.unbind = function unbind() {
      this.bindingContext = null;
      clearInterval(this.interval);
    };

    return Debug;
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
define('messages',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var TransactionAdded = exports.TransactionAdded = function TransactionAdded(transaction) {
    _classCallCheck(this, TransactionAdded);

    this.transaction = transaction;
  };
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
    price: 40.00,
    commission: 50.00,
    date: new Date(2016, 11, 7)
  }, {
    id: getId(),
    symbol: 'YHOO',
    type: 'buy',
    shares: 1000,
    price: 40.10,
    commission: 30.00,
    date: new Date(2016, 11, 8)
  }, {
    id: getId(),
    symbol: 'YHOO',
    type: 'sell',
    shares: 1500,
    price: 41.20,
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

    WebAPI.prototype.saveTransaction = function saveTransaction(transaction) {
      var _this3 = this;

      this.isRequesting = true;
      console.log("transaction is ", transaction);
      return new Promise(function (resolve) {
        setTimeout(function () {
          var instance = JSON.parse(JSON.stringify(transaction));
          var found = transactions.filter(function (x) {
            return x.id == transaction.id;
          })[0];

          if (found) {
            var index = transactions.indexOf(found);
            transactions[index] = instance;
          } else {
            instance.id = getId();
            transactions.push(instance);
          }
          _this3.isRequesting = false;
          resolve(instance);
        }, latency);
      });
    };

    return WebAPI;
  }();
});
define('performance-table/performance-table',['exports', '../services/holding-service', 'aurelia-event-aggregator', '../messages'], function (exports, _holdingService, _aureliaEventAggregator, _messages) {
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

    var REFRESH_INTERVAL = 10000;
    var UP = "up";
    var DOWN = "down";

    var PerformanceTable = exports.PerformanceTable = (_temp = _class = function () {
        function PerformanceTable(holdingService, ea) {
            var _this = this;

            _classCallCheck(this, PerformanceTable);

            this.holdingService = holdingService;
            this.ea = ea;
            this.holdings = this.holdingService.holdings;
            this.holdingService.load();
            setInterval(function () {
                return _this.holdingService.refresh();
            }, REFRESH_INTERVAL);

            this._subscriptEvents();
        }

        PerformanceTable.prototype.numberColor = function numberColor(number) {
            if (number > 0) {
                return UP;
            }
            if (number < 0) {
                return DOWN;
            }
            return '';
        };

        PerformanceTable.prototype._subscriptEvents = function _subscriptEvents() {
            var _this2 = this;

            this.ea.subscribe(_messages.TransactionAdded, function (msg) {
                return _this2.holdingService.load();
            });
        };

        return PerformanceTable;
    }(), _class.inject = [_holdingService.HoldingService, _aureliaEventAggregator.EventAggregator], _temp);
});
define('portfolio/portfolio',['exports', '../web-api', 'aurelia-event-aggregator', '../messages'], function (exports, _webApi, _aureliaEventAggregator, _messages) {
    'use strict';

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
        function Portfolio(api, ea) {
            _classCallCheck(this, Portfolio);

            this.api = api;
            this.ea = ea;
            this._subscriptEvents();
            this.name = "Portfolio1";
            this.currentTable = PERF;
            this.tables = [PERF, TRSC];
            this.transactionFormOpened = false;
        }

        Portfolio.prototype.selectTable = function selectTable(table) {
            this.currentTable = table;
        };

        Portfolio.prototype.toggleTransactionForm = function toggleTransactionForm() {
            this.transactionFormOpened = !this.transactionFormOpened;
        };

        Portfolio.prototype._subscriptEvents = function _subscriptEvents() {
            var _this = this;

            this.ea.subscribe(_messages.TransactionAdded, function () {
                return _this.transactionFormOpened = false;
            });
        };

        return Portfolio;
    }(), _class.inject = [_webApi.WebAPI, _aureliaEventAggregator.EventAggregator], _temp);
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
define('services/api',['exports', 'aurelia-fetch-client', 'whatwg-fetch'], function (exports, _aureliaFetchClient) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.API = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var client = new _aureliaFetchClient.HttpClient();

    function queryParams(params) {
        var esc = encodeURIComponent;
        return Object.keys(params).map(function (k) {
            return esc(k) + '=' + esc(params[k]);
        }).join('&');
    }

    function makeUrl(url, params) {
        return url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(params);
    }

    var API = exports.API = function () {
        function API() {
            _classCallCheck(this, API);

            this.client = client;
        }

        API.prototype.getQuotes = function getQuotes(symbols) {
            var symbolsStr = symbols.map(function (symbol) {
                return '\"' + symbol + '\"';
            }).join(',');

            var url = 'https://query.yahooapis.com/v1/public/yql';
            var params = {
                q: 'select * from yahoo.finance.quotes where symbol in (' + symbolsStr + ')',
                format: 'json',
                diagnostics: 'true',
                env: 'store://datatables.org/alltableswithkeys',
                callback: ''
            };
            return this.client.fetch(makeUrl(url, params)).then(function (response) {
                return response.json();
            }).then(function (data) {
                var result = data.query.results.quote;

                return Array.isArray(result) ? result : [result];
            });
        };

        return API;
    }();
});
define('services/holding-service',['exports', '../web-api', './api'], function (exports, _webApi, _api) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.HoldingService = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _class, _temp;

    var HoldingService = exports.HoldingService = (_temp = _class = function () {
        function HoldingService(api, realAPI) {
            _classCallCheck(this, HoldingService);

            this.api = api;
            this.realAPI = realAPI;
            this.holdings = [];
        }

        HoldingService.prototype.load = function load() {
            var _this = this;

            return this._loadTransactionsToHolding().then(function () {
                return _this.refresh();
            });
        };

        HoldingService.prototype.refresh = function refresh() {
            var _this2 = this;

            return this._loadQuotes().then(function () {
                return _this2._calculate(_this2.holdings);
            });
        };

        HoldingService.prototype._loadTransactionsToHolding = function _loadTransactionsToHolding() {
            var map = this.holdings;
            return this.api.getTransactionList().then(function (transactions) {
                transactions.forEach(function (trsc) {
                    var holding = map.find(function (x) {
                        return x.symbol === trsc.symbol;
                    });
                    if (!holding) {
                        holding = {
                            symbol: trsc.symbol,
                            sellTransactions: [],
                            buyTransactions: [],
                            cost: 0
                        };
                        map.push(holding);
                    }
                    if (trsc.type === 'buy') {
                        holding.buyTransactions.push(trsc);
                    } else {
                        holding.sellTransactions.push(trsc);
                    }
                });
            });
        };

        HoldingService.prototype._loadQuotes = function _loadQuotes() {
            var _this3 = this;

            var symbols = this.holdings.map(function (x) {
                return x.symbol;
            });

            return this.realAPI.getQuotes(symbols).then(function (quotes) {
                quotes.forEach(function (quote) {
                    var holding = _this3.holdings.find(function (x) {
                        return x.symbol === quote.symbol;
                    });
                    holding.quote = quote;
                });
            });
        };

        HoldingService.prototype._calculate = function _calculate(holdings) {
            var _this4 = this;

            holdings.forEach(function (holding) {
                _this4._calcHoldingCost(holding);
                holding.mkt_value = holding.shares * holding.quote.LastTradePriceOnly;
                holding.gain = holding.mkt_value - holding.cost;
                holding.gain_percent = holding.gain / holding.cost;
                holding.days_gain = holding.shares * holding.quote.Change;
            });
        };

        HoldingService.prototype._calcHoldingCost = function _calcHoldingCost(holding) {
            var soldShares = holding.sellTransactions.reduce(function (acc, cur) {
                return acc + cur.shares;
            }, 0);
            holding.cost = 0;
            holding.shares = 0;

            holding.buyTransactions.forEach(function (trsc) {
                var leftShares = void 0,
                    cost = void 0;

                if (trsc.shares < soldShares) {
                    leftShares = 0;
                    soldShares -= trsc.shares;
                } else {
                    leftShares = trsc.shares - soldShares;
                    soldShares = 0;
                }
                holding.cost += leftShares / trsc.shares * (trsc.shares * trsc.price + trsc.commission);
                holding.shares += leftShares;
            }, 0);
        };

        return HoldingService;
    }(), _class.inject = [_webApi.WebAPI, _api.API], _temp);
});
define('transaction-form/transaction-form',['exports', '../web-api', 'aurelia-event-aggregator', '../messages'], function (exports, _webApi, _aureliaEventAggregator, _messages) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TransactionForm = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _class, _temp;

    var TransactionForm = exports.TransactionForm = (_temp = _class = function () {
        function TransactionForm(api, ea) {
            _classCallCheck(this, TransactionForm);

            this.types = ['buy', 'sell'];

            this.api = api;
            this.ea = ea;
            this.transaction = { type: 'buy' };
        }

        TransactionForm.prototype.save = function save() {
            debugger;
        };

        TransactionForm.prototype.save = function save() {
            var _this = this;

            var temp = JSON.parse(JSON.stringify(this.transaction));
            temp.date = new Date(temp.date);
            this.api.saveTransaction(temp).then(function (transaction) {
                _this.ea.publish(new _messages.TransactionAdded(transaction));
                _this.transaction = {};
            });
        };

        _createClass(TransactionForm, [{
            key: 'canSave',
            get: function get() {
                return this.transaction.symbol;
            }
        }]);

        return TransactionForm;
    }(), _class.inject = [_webApi.WebAPI, _aureliaEventAggregator.EventAggregator], _temp);
});
define('transaction-table/transaction-table',['exports', '../web-api', 'aurelia-event-aggregator', '../messages'], function (exports, _webApi, _aureliaEventAggregator, _messages) {
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
        function TransactionTable(api, ea) {
            _classCallCheck(this, TransactionTable);

            this.api = api;
            this.ea = ea;
            this._subscriptEvents();
            this.transactions = [];
        }

        TransactionTable.prototype.created = function created() {
            this.load();
        };

        TransactionTable.prototype.load = function load() {
            var _this = this;

            this.api.getTransactionList().then(function (transactions) {
                return _this.transactions = transactions;
            });
        };

        TransactionTable.prototype._subscriptEvents = function _subscriptEvents() {
            var _this2 = this;

            this.ea.subscribe(_messages.TransactionAdded, function (msg) {
                return _this2.load();
            });
        };

        return TransactionTable;
    }(), _class.inject = [_webApi.WebAPI, _aureliaEventAggregator.EventAggregator], _temp);
});
define('value-converters/capitalize',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var CapitalizeValueConverter = exports.CapitalizeValueConverter = function () {
        function CapitalizeValueConverter() {
            _classCallCheck(this, CapitalizeValueConverter);
        }

        CapitalizeValueConverter.prototype.toView = function toView(string) {
            if (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        };

        return CapitalizeValueConverter;
    }();
});
define('value-converters/date-format',['exports', 'moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DateFormatValueConverter = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var DateFormatValueConverter = exports.DateFormatValueConverter = function () {
    function DateFormatValueConverter() {
      _classCallCheck(this, DateFormatValueConverter);
    }

    DateFormatValueConverter.prototype.toView = function toView(value, format) {
      return (0, _moment2.default)(value).format(format);
    };

    return DateFormatValueConverter;
  }();
});
define('value-converters/object-keys-value-converter',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var ObjectKeysValueConverter = exports.ObjectKeysValueConverter = function () {
        function ObjectKeysValueConverter() {
            _classCallCheck(this, ObjectKeysValueConverter);
        }

        ObjectKeysValueConverter.prototype.toView = function toView(obj) {
            var temp = [];

            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    temp.push(prop);
                }
            }
            debugger;
            return temp;
        };

        return ObjectKeysValueConverter;
    }();
});
define('value-converters/object-values-value-converter',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var ObjectValuesValueConverter = exports.ObjectValuesValueConverter = function () {
        function ObjectValuesValueConverter() {
            _classCallCheck(this, ObjectValuesValueConverter);
        }

        ObjectValuesValueConverter.prototype.toView = function toView(obj) {
            var temp = [];

            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    temp.push(obj[prop]);
                }
            }
            debugger;
            return temp;
        };

        return ObjectValuesValueConverter;
    }();
});
define('value-converters/percent',['exports', 'numeral'], function (exports, _numeral) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PercentValueConverter = undefined;

    var _numeral2 = _interopRequireDefault(_numeral);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var PercentValueConverter = exports.PercentValueConverter = function () {
        function PercentValueConverter() {
            _classCallCheck(this, PercentValueConverter);
        }

        PercentValueConverter.prototype.toView = function toView(number) {
            return (0, _numeral2.default)(number).format('0.00%');
        };

        return PercentValueConverter;
    }();
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./styles.css\"></require>\n  <require from=\"./portfolio/portfolio\"></require>\n\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <a class=\"navbar-brand\" href=\"#\">\n        <i class=\"fa fa-user\"></i>\n        <span>Portfolio</span>\n      </a>\n    </div>\n  </nav>\n\n  <loading-indicator loading.bind=\"router.isNavigating || api.isRequesting\"></loading-indicator>\n\n  <div class=\"container\">\n    <portfolio></portfolio>\n  </div>\n</template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 70px; }\n\n.up {\n    color: #093;\n}\n.down {\n    color: #d14836;\n}\n\n.row-no-padding > [class*=\"col-\"] {\n    padding-left: 0 !important;\n    padding-right: 0 !important;\n}\n\n.row-sm-padding > [class*=\"col-\"] {\n    padding-left: 5px !important;\n    padding-right: 5px !important;\n}"; });
define('text!debug.html', ['module'], function(module) { module.exports = "<template>\n  <pre><code>${json}</code></pre>\n</template>"; });
define('text!performance-table/performance-table.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../debug\"></require>\n    <require from=\"../value-converters/percent\"></require>\n\n    <table class=\"table\" aurelia-table=\"data.bind: holdings; display-data.bind: $displayData\">\n        <thead>\n            <tr>\n                <th>Symbol</th>\n                <th>Last Price</th>\n                <th>Change</th>\n                <th>Shares</th>\n                <th>Cost Basis</th>\n                <th>Market Value</th>\n                <th>Gain</th>\n                <th>Gain %</th>\n                <th>Day's Gain</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr repeat.for=\"holding of $displayData\">\n                <td>${holding.symbol}</td>\n                <td>${holding.quote.LastTradePriceOnly}</td>\n                <td class=${numberColor(holding.quote.Change)}>\n                    ${holding.quote.Change_PercentChange}\n                </td>\n                <td>${holding.shares}</td>\n                <td>${holding.cost}</td>\n                <td>${holding.mkt_value}</td>\n                <td class=${numberColor(holding.gain)}>${holding.gain}</td>\n                <td class=${numberColor(holding.gain_percent)}>${holding.gain_percent | percent}</td>\n                <td class=${numberColor(holding.days_gain)}>${holding.days_gain}</td>\n            </tr>\n        </tbody>\n    </table>\n    <!-- <debug></debug> -->\n</template>"; });
define('text!portfolio/portfolio.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../transaction-table/transaction-table\"></require>\n    <require from=\"../performance-table/performance-table\"></require>\n    <require from=\"../value-converters/capitalize\"></require>\n    <require from=\"../transaction-form/transaction-form\"></require>\n\n    <h1>${name}</h1>\n    <ul class=\"nav nav-tabs\">\n        <li repeat.for=\"table of tables\">\n            <a href=\"#\" click.delegate=\"$parent.selectTable(table)\">${table | capitalize}</a>\n        </li>\n    </ul>\n    <div class=\"btn-group\">\n        <a type=\"button\" class=\"btn btn-default\" click.delegate=\"toggleTransactionForm()\">\n            Add Transaction\n        </a>\n    </div>\n    <transaction-form if.bind=\"transactionFormOpened\"></transaction-form>\n    <section>\n        <transaction-table if.bind=\"currentTable === 'transactions'\"></transaction-table>\n        <performance-table if.bind=\"currentTable === 'performance'\"></performance-table>\n    </section>\n</template>"; });
define('text!transaction-form/transaction-form.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../value-converters/capitalize\"></require>\n\n    <form class=\"form\" role=\"form\">\n        <div class=\"row row-sm-padding\">\n            <div class=\"col-xs-1 form-group\">\n                <label for=\"type\">Type</label>\n                <select id=\"type\" name=\"types\" class=\"form-control\" value.bind=\"transaction.type\">\n                    <option repeat.for=\"type of types\" value.bind=\"type\">${type | capitalize}</option>\n                </select>\n            </div>\n            <div class=\"col-xs-1 form-group\">\n                <label for=\"symbol\">Symbol</label>\n                <input type=\"text\" class=\"form-control\" id=\"symbol\" value.bind=\"transaction.symbol\">\n            </div>\n            <div class=\"col-xs-2 form-group\">\n                <label for=\"date\">Date</label>\n                <input type=\"date\" class=\"form-control\" id=\"date\" value.bind=\"transaction.date\">\n            </div>\n            <div class=\"col-xs-1 form-group\">\n                <label for=\"shares\">Shares</label>\n                <input type=\"number\" class=\"form-control\" id=\"shares\" value.bind=\"transaction.shares\">\n            </div>\n            <div class=\"col-xs-1 form-group\">\n                <label for=\"price\">Price</label>\n                <input type=\"number\" class=\"form-control\" id=\"price\" value.bind=\"transaction.price\">\n            </div>\n            <div class=\"col-xs-1 form-group\">\n                <label for=\"commission\">Commission</label>\n                <input type=\"number\" class=\"form-control\" id=\"commission\" value.bind=\"transaction.commission\">\n            </div>\n            <div class=\"col-xs-1 form-group\">\n                <label for=\"notes\">Notes</label>\n                <input type=\"text\" class=\"form-control\" id=\"notes\" value.bind=\"transaction.notes\">\n            </div>\n        </div>\n        <button class=\"btn btn-primary\" click.delegate=\"save()\" disabled.bind=\"!canSave\">Add to portfolio</button>\n    </form>\n</template>"; });
define('text!transaction-table/transaction-table.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"../value-converters/capitalize\"></require>\n    <require from=\"../value-converters/date-format\"></require>\n\n    <table class=\"table\" aurelia-table=\"data.bind: transactions; display-data.bind: $displayData\">\n        <thead>\n            <tr>\n                <th>Symbol</th>\n                <th>Type</th>\n                <th>Date</th>\n                <th>Shares</th>\n                <th>Price</th>\n                <th>Commission</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr repeat.for=\"trsc of $displayData\">\n                <td>${trsc.symbol}</td>\n                <td>${trsc.type | capitalize}</td>\n                <td>${trsc.date | dateFormat:'M/D/YYYY'}</td>\n                <td>${trsc.shares}</td>\n                <td>${trsc.price}</td>\n                <td>${trsc.commission}</td>\n            </tr>\n        </tbody>\n    </table>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map