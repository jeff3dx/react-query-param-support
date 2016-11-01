import _ from 'lodash';

/**
 * QueryParamSupport
 * Support: jbutsch@netflix.com
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
     * @param value - the query param string value
     */
    boolify(value) {
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
     * Current calculated query params. Updates upon componentWillUpdate() or setQueryParams.
     * Optimizes the case where this.queryParams is referenced multiple times before the next render cycle.
     */
    _queryParamsCache = null;

    /**
     * Getter returns all query params in one object with defaults resolved.
     */
    get queryParams() {
      if (this._queryParamsCache === null) {
        if (!this.props.location || !this.props.location.query) {
          throw new Error('Missing props.location.query. queryParamSupport decorator probably applied to a class that is not a route handler.');
        }
        const defaults = this.defaultQueryParams || {};
        const all = { ...defaults, ...this.props.location.query };
        Object.keys(all).forEach(key => {
          all[key] = this.boolify(all[key]);
          if (!Array.isArray(all[key]) && _.startsWith(all[key], '[') && _.endsWith(all[key], ']')) {
            const list = all[key].substring(1, all[key].length - 1);
            all[key] = list.split(',');
          }
        });
        this._queryParamsCache = all;
      }
      return this._queryParamsCache;
    }

    /**
     * Get one query param value. Recalculates every time it's called.
     * @param name - The query param name
     * @param props - Optional. An alternate props object to use instead of the current props
     */
    getQueryParam(name, props) {
      props = props || this.props;
      const defaults = this.defaultQueryParams || {};
      // If query param is not defined on the query get it's default
      const result = typeof props.location.query[name] !== 'undefined' ? props.location.query[name] : defaults[name];
      return this.boolify(result);
    };

    /**
     * Set query param values. Merges the changes in to the current values, similar to setState().
     * Removes params that match the default.
     * @param params - Object of name:values to overlay on current query param values.
     * @param addHistory - true = add browser history, default false.
     */
    setQueryParams(params, addHistory) {
      const nextQueryParams = { ...this.props.location.query, ...params };
      const defaults = this.defaultQueryParams || {};

      Object.keys(nextQueryParams).forEach(key => {
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
    };
  };
}
