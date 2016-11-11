'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.queryParamSupport = queryParamSupport;

require('string.prototype.startswith');

require('string.prototype.endswith');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * React Query Param Support
 * Support: https://github.com/jeff3dx/query-param-support
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
       * @param {string} value - the query param string value
       */

    }, {
      key: '_boolify',
      value: function _boolify(value) {
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
    }, {
      key: '_queryParamToArray',


      /**
       * Convert array string to array
       */
      value: function _queryParamToArray(value) {
        var result = value;
        if (typeof value === 'string' && !Array.isArray(value) && value.startsWith('[') && value.endsWith(']')) {
          try {
            result = JSON.parse(value);
          } catch (ex) {
            console.error(ex);
            // Can't parse so fall back to verbatim value
            result = value;
          }
        }
        return result;
      }

      /**
       * Current calculated query params. Updates upon componentWillUpdate() or setQueryParams.
       * Optimizes the case where this.queryParams is referenced multiple times before the next render cycle.
       */

    }, {
      key: 'getQueryParam',


      /**
       * Get one query param value.
       * @param {string} name - The query param name
       * @param {object} props - Optional. An alternate props object to use instead of the current props
       */
      value: function getQueryParam(name) {
        var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props;

        var defaults = this.defaultQueryParams || {};
        var result = typeof props.location.query[name] !== 'undefined' ? props.location.query[name] : defaults[name];
        result = this._boolify(result);
        result = this._queryParamToArray(result);
        return result;
      }
    }, {
      key: 'setQueryParams',


      /**
       * Set query param values. Merges changes into the current values, similar to setState().
       * Removes params that match the default.
       * @param {object} params - Object of name:values to overlay on current query param values.
       * @param {boolean} addHistory - true = add browser history, default false.
       */
      value: function setQueryParams(params) {
        var addHistory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var nextQueryParams = _extends({}, this.props.location.query, params);
        var defaults = this.defaultQueryParams || {};

        Object.keys(nextQueryParams).forEach(function (key) {
          // Array to string
          if (Array.isArray(nextQueryParams[key])) {
            nextQueryParams[key] = JSON.stringify(nextQueryParams[key]);
          }
          // Remove params that match the default
          if (nextQueryParams[key] === defaults[key]) {
            delete nextQueryParams[key];
          }
        });

        if (!this.context || !this.context.router) {
          throw new Error('QueryParamSupport -- missing context.router. You should have static contextTypes={router: routeShape} defined in your class.');
        }

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
              all[key] = _this2._boolify(all[key]);
              all[key] = _this2._queryParamToArray(all[key]);
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