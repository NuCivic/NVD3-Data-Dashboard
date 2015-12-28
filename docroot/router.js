/**
 * Backbone Router
 *
 * NOTE: To ignore baseURL
 *
 *	Backbone.history.start({
 *			pushState: true,
 *			root: "/public/search/"
 *	});
 *
 **/
define(['backbone'], function (Backbone) {
	console.log('[router] loaded 11');
  var Router = Backbone.Router.extend({
		routes : {
			'dash/comp/?*queryString' : 'getCompDash' 
		},

		getCompDash : function (queryString) {
//			require(['views/dashCompViews'], function (Views) {
				console.log(queryString);
				var params = this.parseQueryString(queryString);
				console.log('getDash', params);
//			});
		},
		parseQueryString : function (queryString) {
			var params = {};
			if(queryString){
					_.each(
							_.map(decodeURI(queryString).split(/&/g),function(el,i){
									var aux = el.split('='), o = {};
									if(aux.length >= 1){
											var val = undefined;
											if(aux.length == 2)
													val = aux[1];
											o[aux[0]] = val;
									}
									return o;
							}),
							function(o){
									_.extend(params,o);
							}
					);
			}
			return params;
    }
	});

	var AppRouter = new Router();

	AppRouter.on('getDash', function () {
		console.log("Hello get Dash");
	});

	AppRouter.on('defaultRoute', function () {
		console.log('Default route');
	});

	console.log('router', Router, AppRouter);
  Backbone.history.start();
});
