##QueryParamSupport
Decorator that adds query param support to a route handler React class. 

A route handler is a class referenced directly by a route
in your Router, and therefore receives props.location.query.

###Installation and usage
0. Install npm module

	```js
	npm install xxxx --save
	```

1. Import and add the decorator:

	```js
	import {queryParamSupport } from 'query-param-support';
	
	@queryParamSupport
	export default class MyClass extends Component {
	}
```
     
2. Optionally define defaultQueryParams on the parent class:

	```js
	@queryParamSupport
	export default class MyClass extends Component {
	    defaultQueryParams = {
	        myparam: 'bacon'
	    }
	}
```

3. Get a query param value:

	```js
	const value = this.queryParams.myparam;
	```

4. Set a query param value:

	```js
	this.setQueryParams({ myparam: 'nutella' });
	```

### Also
- Set many query param values at once, like setState().
- Supports get and set arrays.
- Removes params from the URL that match the default value, like Ember.
- Optionally create browser history when setting param values.
- Read one query param using an alternate props, for instance nextProps from within componentWillReceiveProps().

**Support:** jbutsch@netflix.com