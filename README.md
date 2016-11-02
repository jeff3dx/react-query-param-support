#QueryParamSupport
Decorator that adds query param support to a route handler React class.

####Requirements
This decorator is designed to work with route handler classes referenced by React Router.

(A route handler is a class referenced directly by a route
define in your Router, and therefore receives props.location.query.)

###Installation and usage
**1. Install npm module**

Your project should use the Netflix npm registry. To do so the root of your project should have file **.npmrc** with the following line

	registry = http://artifacts.netflix.com/api/npm/npm-netflix
Then run the install command

	npm install react-query-param-support.git --save

**2. Import and add the decorator in your class**
	
	import { queryParamSupport } from 'react-query-param-support';
	
	@queryParamSupport
	export default class MyClass extends Component {
	}

**3. Optionally define defaultQueryParams on the parent class**
	
	@queryParamSupport
	export default class MyClass extends Component {
	    defaultQueryParams = {
	        myparam: 'bacon'
	    }
	}

**4. Get a query param value**
	
	const value = this.queryParams.myparam;

**5. Set a query param value**
	
	this.setQueryParams({ myparam: 'nutella' });

### Also
- Set many query param values at once, like setState().
- Supports get and set arrays.
- Removes params from the URL that match the default value, like Ember.
- Optionally create browser history when setting param values.
- Read one query param using an alternate props, for instance nextProps from within componentWillReceiveProps().

**Support:** jbutsch@netflix.com