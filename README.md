#React Query Param Support
JavaScript [decorator](http://https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.e3bcycini) that adds query param support to a route handler React class.

**Support:** jbutsch@netflix.com
####Requirements
Designed to work with **route handler** classes referenced by **React Router**.

(A route handler is a class referenced directly by a route
define in your Router, and therefore receives props.location.query.)

##Installation
####Netflix corporate users
Your project should use the Netflix npm registry (only available t0 Netflix corporate users). To do so the root of your project should have file **.npmrc** with the following line

	registry = http://artifacts.netflix.com/api/npm/npm-netflix
Then run the install command

	npm install react-query-param-support.git --save

####Other users
Run the install command

	npm install https://github.com/jeff3dx/query-param-support.git --save

##Usage
**1. Import and add the decorator to your class**
	
	import { queryParamSupport } from 'react-query-param-support';
	
	@queryParamSupport
	export default class MyClass extends Component {
	}

**2. Optionally define defaultQueryParams on the parent class**
	
	@queryParamSupport
	export default class MyClass extends Component {
	    defaultQueryParams = {
	        myparam: 'bacon'
	    }
	}

**3. Get a query param value**
	
	const value = this.queryParams.myparam;

**4. Set a query param value**
	
	this.setQueryParams({ myparam: 'nutella' });
	

## Notes
- Set many query param values at once, like setState().
- Supports get and set arrays.
- Removes params from the URL that match the default value, like Ember.
- Optionally create browser history when setting param values.
- Read one query param using an alternate props, for instance nextProps from within componentWillReceiveProps().

