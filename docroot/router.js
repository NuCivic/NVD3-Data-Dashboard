define(['backbone'], function (Backbone) {
	console.log('[router] loaded 11');
  var Router = Backbone.Router.extend({
		routes : {
			'dash/:backend/:id' : 'getDash' 
		},

		getDash : function (backend, id) {
			console.log('getDash', backend, id);
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
