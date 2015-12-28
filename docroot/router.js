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
define(['backbone', 'recline'], function (Backbone, Recline) {
	console.log('[router] loaded 11');
  var Router = Backbone.Router.extend({
		routes : {
			'dash/comp/' : 'getCompDash' 
		},

//?backend=gdocs&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheet%2Fccc%3Fkey%3D1R0_i_H-InRaQQK6_ECuenLeoAM2TH32edBPbue9c5Rc%23gid%3D0

		getCompDash : function (queryString) {
			var self = this;
			require(['views/dashCompViews'], function (Views) {
				console.log("q", self.urlDecodeParams(self.parseQueryString(queryString)));
				var params = self.urlDecodeParams(self.parseQueryString(queryString));
        var model = new Recline.Model.Dataset(params);
				var View = new Views.dashCompView({q : params, model : model});
				View.render();
				console.log('getDash', params);
			});
		},
    parseQueryString : function (str) {
      return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
    },
    urlDecodeParams : function (params) {
      var decoded = {}
      console.log("aa", params);
      _.each(params, function (p, k) {
        console.log("decode",p,k);
        decoded[k]= decodeURIComponent(p);
      });
      return decoded;
    },
		_parseQueryString : function (queryString) {
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
