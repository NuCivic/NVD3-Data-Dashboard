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
			'dash/comp(/)'  : 'getCompDash', 
      'static(/)'        : 'getStatic',
      '*path'         : 'getCompDash'
		},

//?backend=gdocs&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheet%2Fccc%3Fkey%3D1R0_i_H-InRaQQK6_ECuenLeoAM2TH32edBPbue9c5Rc%23gid%3D0

///?backend=gdoc&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1_M45YGdwC8-ZLuphJD5lODAJmx2ANNis63mBlDk32TQ%2Fedit%3Fusp%3Dsharing

    getStatic : function () {
      var self = this;
      require(['recline', 'rv3', 'multiBarHorizontalChart', 'chosenSelect'], function (Recline, RV3, MultiBarChart) {
        console.log("[static] 1");
        $('#region-main').append("<div id='my-gdocs'></div>");
        $('#region-main').append("<div id='total-students'></div>");
        var dataset = new Recline.Model.Dataset({
          //url: 'https://docs.google.com/spreadsheet/ccc?key=0Aon3JiuouxLUdGZPaUZsMjBxeGhfOWRlWm85MmV0UUE#gid=0',
//          url: 'https://docs.google.com/spreadsheet/ccc?key=1R0_i_H-InRaQQK6_ECuenLeoAM2TH32edBPbue9c5Rc#gid=0',
            url: 'https://docs.google.com/spreadsheets/d/12c7pKJc4xwvKy33wBTa5Vr_4freCCavnYdN1s8yKGOo/edit?usp=sharing',
          backend: 'gdocs'
        });

        var grid = new Recline.View.Grid({
          model: dataset
        });


        var oneDimensionWithLabels = new Recline.Model.ObjectState({
          xfield: 'schoolname',
          seriesFields: ['schooltotalstudents'],
          group: true,
          options: {
            showValues: true,
            tooltips: false,
            showControls: false,
            stacked: true,
            barColors: randColArray(10),
            margin: {top: 30, right: 20, bottom: 50, left: 250}
          }
        });

        var discreteBar = new MultiBarChart({
          model: dataset,
          state: oneDimensionWithLabels,
          el: $('#total-students')
        });

        discreteBar.render();
        $(".chosen-select").chosen();
        $('#my-gdocs').append(grid.el);

        // Now do the query to the backend to load data
        dataset.fetch().done(function(dataset) {
          $.each(dataset.records.models, function(key, value) {
            console.log();
            $('#search-select')
            .append($("<option></option>")
            .attr("value",value.attributes.schoolid)
            .text(value.attributes.schoolname));
          });

          $("#search-select").trigger("chosen:updated");
          $("#search-select").width("300");

          if (console) {
            console.log(dataset);
          }
        }); // require close
      });
    },

		getCompDash : function (queryString) {
			var self = this;
      var barColors = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green',
               'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red',
               'silver', 'teal', 'white', 'yellow'];
			require(['views/dashCompViews'], function (Views) {
				var params = self.urlDecodeParams(self.parseQueryString(queryString));
        console.log("params", params);
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
//            forceX : [0,109],
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
                          barColors : barColors
        });
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
