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
define('performance-table',["exports", "./services/holding-service"], function (exports, _holdingService) {
    "use strict";

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
        function PerformanceTable(holdingService) {
            var _this = this;

            _classCallCheck(this, PerformanceTable);

            this.holdingService = holdingService;
            this.holdingService.init().then(function () {
                _this.holdings = _this.holdingService.holdings;
            });
            setInterval(function () {
                return _this.holdingService.refresh();
            }, REFRESH_INTERVAL);
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

        return PerformanceTable;
    }(), _class.inject = [_holdingService.HoldingService], _temp);
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
            this.name = "Portfolio1";
            this.currentTable = PERF;
            this.tables = [PERF, TRSC];
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

        HoldingService.prototype.init = function init() {
            var _this = this;

            this.holdings = [];
            return this._loadTransactionsToHolding().then(function () {
                return _this._loadQuotes();
            }).then(function () {
                _this._calculate(_this.holdings);
            });
        };

        HoldingService.prototype.refresh = function refresh() {
            var _this2 = this;

            this._loadQuotes().then(function () {
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
                console.log("quotes is", quotes);
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
define('colored-number',["exports", "aurelia-framework"], function (exports, _aureliaFramework) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ColoredNumber = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _desc, _value, _class, _descriptor;

    var UP = "up";
    var DOWN = "down";

    var ColoredNumber = exports.ColoredNumber = (_class = function () {
        function ColoredNumber() {
            _classCallCheck(this, ColoredNumber);

            _initDefineProp(this, "number", _descriptor, this);
        }

        ColoredNumber.prototype.color = function color(number) {
            if (number > 0) {
                return UP;
            }
            if (number < 0) {
                return DOWN;
            }
            return '';
        };

        return ColoredNumber;
    }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, "number", [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class);
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
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        return CapitalizeValueConverter;
    }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./styles.css\"></require>\n  <require from=\"./portfolio\"></require>\n\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <a class=\"navbar-brand\" href=\"#\">\n        <i class=\"fa fa-user\"></i>\n        <span>Portfolio</span>\n      </a>\n    </div>\n  </nav>\n\n  <loading-indicator loading.bind=\"router.isNavigating || api.isRequesting\"></loading-indicator>\n\n  <div class=\"container\">\n    <div class=\"row\">\n      <portfolio class=\"col-md-10 col-md-offset-1 \"></portfolio>\n    </div>\n  </div>\n</template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 70px; }\n\n.up {\n    color: #093;\n}\n.down {\n    color: #d14836;\n}"; });
define('text!debug.html', ['module'], function(module) { module.exports = "<template>\n  <pre><code>${json}</code></pre>\n</template>"; });
define('text!performance-table.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./debug\"></require>\n    <require from=\"./value-converters/percent\"></require>\n\n    <table class=\"table\" aurelia-table=\"data.bind: holdings; display-data.bind: $displayData\">\n        <thead>\n            <tr>\n                <th>Symbol</th>\n                <th>Last Price</th>\n                <th>Change</th>\n                <th>Shares</th>\n                <th>Cost Basis</th>\n                <th>Market Value</th>\n                <th>Gain</th>\n                <th>Gain %</th>\n                <th>Day's Gain</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr repeat.for=\"holding of $displayData\">\n                <td>${holding.symbol}</td>\n                <td>${holding.quote.LastTradePriceOnly}</td>\n                <td class=${numberColor(holding.quote.Change)}>\n                    ${holding.quote.Change_PercentChange}\n                </td>\n                <td>${holding.shares}</td>\n                <td>${holding.cost}</td>\n                <td>${holding.mkt_value}</td>\n                <td class=${numberColor(holding.gain)}>${holding.gain}</td>\n                <td class=${numberColor(holding.gain_percent)}>${holding.gain_percent | percent}</td>\n                <td class=${numberColor(holding.days_gain)}>${holding.days_gain}</td>\n            </tr>\n        </tbody>\n    </table>\n    <!-- <debug></debug> -->\n</template>"; });
define('text!portfolio.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./transaction-table\"></require>\n    <require from=\"./performance-table\"></require>\n    <require from=\"./value-converters/capitalize\"></require>\n\n    <h1>${name}</h1>\n    <ul class=\"nav nav-tabs\">\n        <li repeat.for=\"table of tables\">\n            <a href=\"#\" click.delegate=\"$parent.selectTable(table)\">${table | capitalize}</a>\n        </li>\n    </ul>\n    <transaction-table if.bind=\"currentTable === 'transactions'\"></transaction-table>\n    <performance-table if.bind=\"currentTable === 'performance'\"></performance-table>\n</template>"; });
define('text!transaction-table.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"./value-converters/capitalize\"></require>\n\n    <table class=\"table\" aurelia-table=\"data.bind: transactions; display-data.bind: $displayData\">\n        <thead>\n            <tr>\n                <th>Symbol</th>\n                <th>Type</th>\n                <th>Date</th>\n                <th>Shares</th>\n                <th>Price</th>\n                <th>Commission</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr repeat.for=\"trsc of $displayData\">\n                <td>${trsc.symbol}</td>\n                <td>${trsc.type | capitalize}</td>\n                <td>${trsc.date.toDateString()}</td>\n                <td>${trsc.shares}</td>\n                <td>${trsc.price}</td>\n                <td>${trsc.commission}</td>\n            </tr>\n        </tbody>\n    </table>\n</template>"; });
define('text!colored-number.html', ['module'], function(module) { module.exports = "<template>\n    <span class=\"${color(number)}\">${number}</span>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map