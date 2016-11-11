#React Query Param Support
JavaScript [decorator](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.e3bcycini) that adds query param support to a React component.

Report issues [here](https://github.com/jeff3dx/query-param-support/issues).

####Requirements
Designed to work with React Router and a **route handler** class. A route handler is a class directly referenced by your Router, and therefore receives *props.location.query*.

##Installation
####github users
Run the install command:

	npm install https://github.com/jeff3dx/query-param-support.git --save

####Netflix corporate users
You should use the Netflix private NPM registry. Contact [Jeff Butsch](mailto:jbutsch@netflix.com) for instructions. 

Then run the install command:

	npm install react-query-param-support --save


##Usage
###1. Import and add the decorator to your class
	
	import { queryParamSupport } from 'react-query-param-support';
	
	@queryParamSupport
	export default class MyClass extends Component {
	}

###2. Include router in your contextTypes
	
	import { queryParamSupport } from 'react-query-param-support';
	import { routerShape } from 'react-router';
	
	@queryParamSupport
	export default class MyClass extends Component {
		static contextTypes = {
			router: routerShape
		}
	}

###3. Get a query param value
	
	const value = this.queryParams.myparam;

###4. Set a query param value
	
	this.setQueryParams({ myparam: 'nutella' });

###5. Optional - Define defaultQueryParams

defaultQueryParams allows your app to have default values when there are no query params included in the URL. If a query param is not included in the URL it's default will be used. Likewise if you set a query param to it's default value it will be removed from the URL and it's default value will be used. If you define defaults for all your query params your app will start with a clean URL uncluttered by query params.  

	import { queryParamSupport } from 'react-query-param-support';
	import { routerShape } from 'react-router';
	
	@queryParamSupport
	export default class MyClass extends Component {
		static contextTypes = {
			router: routerShape
		}

	    defaultQueryParams = {
	        myparam: 'bacon'
	    }
	}


###How default values work

* If a query param is not included in the URL but has a default value defined the default value will be returned.
* If a query param is not included in the URL and it does not have a default value defined, **undefined** will be returned.
* If you set a query param to it's default value, it will be **removed from the URL** and it's default value will be returned.
	
##Arrays

You can set a query param value to an array. Arrays will be serialized to a query param string when set, and deserialized back to an array when read.

	const food = ['bacon', 'nutella'];
	this.setQueryParams({ lunch: food });
	const food2 = this.queryParams.lunch;

To clear an array set the value to an empty array. (Don't set it to null or empty string which will prevent the query param from being interpreted as an array.)

	this.setQueryParams({ food: [] });

You can set a default value to a stringified array (JSON format).

	defaultQueryParams = {
		lunch: '["bacon","nutella"]'
	}


## Notes
- Set many query param values at once, like setState().
- Supports get and set arrays.
- Removes params from the URL that match the default value.
- Optionally create browser history when setting param values.
- Use getQueryParam() to read one value using an alternate props, for instance nextProps from within componentWillReceiveProps().


