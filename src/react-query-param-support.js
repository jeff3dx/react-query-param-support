import 'string.prototype.startswith';
import 'string.prototype.endswith';

/**
 * React Query Param Support
 * Support: https://github.com/jeff3dx/query-param-support
 *
 * Decorator that adds query param support to a route handler React class.
 * See readme.md for more details.
 */
export function queryParamSupport(target) {

  return class QueryParamComponent extends target {
    /* Clear the query param cache */
    componentWillUpdate() {
      this._queryParamsCache = null;

      if (super.componentWillUpdate) {
        super.componentWillUpdate();
      }
    }

    /**
     * Convert boolean string to boolean type.
     * Any query param set to "true" or "false" will be converted to a boolean type.
     * @param {string} value - the query param string value
     */
    _boolify(value) {
      if (typeof value === 'string') {
        const value2 = value.toLowerCase().trim();
        if (value2 === 'true') {
          return true;
        } else if (value2 === 'false') {
          return false;
        }
      }
      return value;
    };

    /**
     * Convert array string to array
     */
    _queryParamToArray(value) {
      let result = value;
      if (typeof value === 'string' && !Array.isArray(value) && value.startsWith('[') && value.endsWith(']')) {
        try {
          result = JSON.parse(value);
        } catch(ex) {
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
    _queryParamsCache;

    /**
     * Getter returns all query params in one object with defaults resolved.
     */
    get queryParams() {
      if (this._queryParamsCache === null || typeof this._queryParamsCache === 'undefined') {
        if (!this.props.location || !this.props.location.query) {
          throw new Error('Missing props.location.query. queryParamSupport decorator probably applied to a class that is not a route handler.');
        }
        const defaults = this.defaultQueryParams || {};
        const all = { ...defaults, ...this.props.location.query };
        Object.keys(all).forEach(key => {
          all[key] = this._boolify(all[key]);
          all[key] =this._queryParamToArray(all[key]);
        });
        this._queryParamsCache = all;
      }
      return this._queryParamsCache;
    }

    /**
     * Get one query param value.
     * @param {string} name - The query param name
     * @param {object} props - Optional. An alternate props object to use instead of the current props
     */
    getQueryParam(name, props = this.props) {
      const defaults = this.defaultQueryParams || {};
      let result = typeof props.location.query[name] !== 'undefined' ? props.location.query[name] : defaults[name];
      result = this._boolify(result);
      result = this._queryParamToArray(result);
      return result;
    };

    /**
     * Set query param values. Merges changes into the current values, similar to setState().
     * Removes params that match the default.
     * @param {object} params - Object of name:values to overlay on current query param values.
     * @param {boolean} addHistory - true = add browser history, default false.
     */
    setQueryParams(params, addHistory = false) {
      const nextQueryParams = { ...this.props.location.query, ...params };
      const defaults = this.defaultQueryParams || {};

      Object.keys(nextQueryParams).forEach(key => {
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
    };
  };
}
