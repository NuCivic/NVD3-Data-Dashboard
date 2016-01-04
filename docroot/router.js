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
			'dash/comp(/)'      : 'compare',
      'dash/detail/:id'   : 'detail',
      'static(/)'        : 'getStatic',
      '*path'            : 'getCompDash'
		},


		compare : function (queryString) {
			var self = this;
      var barColors = ['steelBlue', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal', 'SeaGreen', 'peru'];
			require(['views/dashViews'], function (Views) {
				var params = self.urlDecodeParams(self.parseQueryString(queryString));
        var model = new Recline.Model.Dataset(params);
        var seriesFields = ['total_students', 'extracurricular_count', 'sports_count', 'courses_count', 'graduation_rate_2014', 'ontrack_year1_2014'];
        var states = [];

        seriesFields.forEach(function (field) {
          var state = new Recline.Model.ObjectState({
            xfield: 'name',
            seriesFields: [field],
            group: true,
            options: {
             showValues: true,
             tooltips: false,
             showControls: false,
             stacked : true,
             margin: {top: 30, right: 20, bottom: 50, left: 250},
             barColor: barColors 
            }
          });
          states.push(state);
        });
				var View = new Views.dashCompView({
          q : params,
          metaDataUrl : "http://ncdkanrny2efmnpl.devcloud.acquia-sites.com/schooldashboard",
          title : "School Comparison Dashboard",
          states : states,
          barColors : barColors,
          $el : $("#region-main"),
          tpl : '#dash-template',
          apiBaseUrl : 'http://ncdkanrny2efmnpl.devcloud.acquia-sites.com/schooldashboard?schools='
        });

				View.render();
  		});
		},

    detail : function (id) {
      require(['views/dashViews'], function (Views) {
          console.log('detail view', id);
            var View = new Views.detailView({
            $el : $("#region-main"),
            tpl : '#dash-detail-template',
            apiBaseUrl : 'http://ncdkanrny2efmnpl.devcloud.acquia-sites.com/schooldashboard?schools=',
            itemId : id,
            itemTitleField : 'name'
          });
          View.loadPage();
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
}, function (err) {
  console.log("[router]ERR", err);
});


function randColArray(n) {
  var x= [];
  for (i = 0; i++; i<n) {
    x.push('#'+Math.floor(Math.random()*16777215).toString(16));
  }
 return x;
}
