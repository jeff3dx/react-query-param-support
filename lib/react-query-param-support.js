'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.queryParamSupport = queryParamSupport;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * QueryParamSupport
 * Support: jbutsch@netflix.com
 *
 * Decorator that adds query param support to a route handler React class.
 * See readme.md for more details.
 */
function queryParamSupport(target) {
  return function (_target) {
    _inherits(QueryParamComponent, _target);

    function QueryParamComponent() {
      _classCallCheck(this, QueryParamComponent);

      return _possibleConstructorReturn(this, (QueryParamComponent.__proto__ || Object.getPrototypeOf(QueryParamComponent)).apply(this, arguments));
    }

    _createClass(QueryParamComponent, [{
      key: 'componentWillUpdate',


      /* Clear the query param cache */
      value: function componentWillUpdate() {
        this._queryParamsCache = null;

        if (_get(QueryParamComponent.prototype.__proto__ || Object.getPrototypeOf(QueryParamComponent.prototype), 'componentWillUpdate', this)) {
          _get(QueryParamComponent.prototype.__proto__ || Object.getPrototypeOf(QueryParamComponent.prototype), 'componentWillUpdate', this).call(this);
        }
      }

      /**
       * Convert boolean string to boolean type.
       * Any query param set to "true" or "false" will be converted to a boolean type.
       * @param value - the query param string value
       */

    }, {
      key: 'boolify',
      value: function boolify(value) {
        if (typeof value === 'string') {
          var value2 = value.toLowerCase().trim();
          if (value2 === 'true') {
            return true;
          } else if (value2 === 'false') {
            return false;
          }
        }
        return value;
      }

      /**
       * Current calculated query params. Updates upon componentWillUpdate() or setQueryParams.
       * Optimizes the case where this.queryParams is referenced multiple times before the next render cycle.
       */

    }, {
      key: 'getQueryParam',


      /**
       * Get one query param value. Recalculates every time it's called.
       * @param name - The query param name
       * @param props - Optional. An alternate props object to use instead of the current props
       */
      value: function getQueryParam(name, props) {
        props = props || this.props;
        var defaults = this.defaultQueryParams || {};
        // If query param is not defined on the query get it's default
        var result = typeof props.location.query[name] !== 'undefined' ? props.location.query[name] : defaults[name];
        return this.boolify(result);
      }
    }, {
      key: 'setQueryParams',


      /**
       * Set query param values. Merges the changes in to the current values, similar to setState().
       * Removes params that match the default.
       * @param params - Object of name:values to overlay on current query param values.
       * @param addHistory - true = add browser history, default false.
       */
      value: function setQueryParams(params, addHistory) {
        var nextQueryParams = _extends({}, this.props.location.query, params);
        var defaults = this.defaultQueryParams || {};

        Object.keys(nextQueryParams).forEach(function (key) {
          // Convert arrays to strings
          if (Array.isArray(nextQueryParams[key])) {
            // set query param array
            nextQueryParams[key] = '[' + nextQueryParams[key].toString() + ']';
          }
          // Remove params that match the default
          if (nextQueryParams[key] === defaults[key]) {
            delete nextQueryParams[key];
          }
        });

        if (addHistory) {
          this.context.router.push({ pathname: window.location.pathname, query: nextQueryParams });
        } else {
          this.context.router.replace({ pathname: window.location.pathname, query: nextQueryParams });
        }

        // Clear the cache
        this._queryParamsCache = null;
      }
    }, {
      key: 'queryParams',


      /**
       * Getter returns all query params in one object with defaults resolved.
       */
      get: function get() {
        var _this2 = this;

        if (this._queryParamsCache === null || typeof this._queryParamsCache === 'undefined') {
          (function () {
            if (!_this2.props.location || !_this2.props.location.query) {
              throw new Error('Missing props.location.query. queryParamSupport decorator probably applied to a class that is not a route handler.');
            }
            var defaults = _this2.defaultQueryParams || {};
            var all = _extends({}, defaults, _this2.props.location.query);
            Object.keys(all).forEach(function (key) {
              all[key] = _this2.boolify(all[key]);
              if (!Array.isArray(all[key]) && _lodash2.default.startsWith(all[key], '[') && _lodash2.default.endsWith(all[key], ']')) {
                var list = all[key].substring(1, all[key].length - 1);
                all[key] = list.split(',');
              }
            });
            _this2._queryParamsCache = all;
          })();
        }
        return this._queryParamsCache;
      }
    }]);

    return QueryParamComponent;
  }(target);
}