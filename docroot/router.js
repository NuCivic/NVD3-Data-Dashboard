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
      var barColors = ['#5BC0EB', '#FDE74C', '#9BC53D', '#E55934', '#FA7921'];
			require(['views/dashViews'], function (Views) {
				var params = self.urlDecodeParams(self.parseQueryString(queryString));
        var model = new Recline.Model.Dataset(params);
        // @@ confParam - seriesFields - what fields do we want to compare
        var seriesFields = ['total_students', 'extracurricular_count', 'sports_count', 'courses_count', 'graduation_rate_2014', 'ontrack_year1_2014'];

        // @@todo - move this to the view!
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

				var View = new Views.compView({
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
            // @confParam - base url for item query
            apiBaseUrl : 'http://ncdkanrny2efmnpl.devcloud.acquia-sites.com/schooldashboard?schools=',
            itemId : id,
            // @@confParam - string / the identifier for the record - used in  page title
            itemTitleField : 'name',
            // @@configParam - text / maybe we want to define topmatter?
            topmatter : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            // @@confParam - array of objects define compareCharts
            compareCharts : [ 
              {
                title : 'GRAD RATE (4 Year)',
                fields : [ 'graduation_rate_2013', 'graduation_rate_2014', 'graduation_rate_boro' ]
              },
              {
                title : 'COLLEGE ENROLL (Or Career Programs)',
                fields : [ 'college_career_rate_2013', 'college_career_rate_2014', 'college_career_rate_boro']
              }
            ],
            // @@confParam = array of objects define sumnmaryCharts
            summaryCharts : [
              {
                title : '<span class="strong">Students feel safe</span> in the hallways, bathrooms, locker rooms, and cafeteria.',
                fields: ['pct_stu_safe_2014']
              },
              {
                title : '<span class="strong">Students feel their school offers enough variety</span> of programs, classes, and activities to keep them interested in school.',
                fields: ['pct_stu_enough_variety_2014']
              },
           ],
           infoItems : [
            { field: 'quality_review_year',
              title: 'Quality Review Year' },
            { field: 'qr_teacher_collaboration',
              title: 'Quality Review Collaboration' },
           { field: 'qr_high_expectations',
              title: 'Quality Review High Expectations' },
           { field: 'qr_assessing_student_learning',
              title: 'Quality Review Student Learning' },
           { field: 'qr_instruction',
              title: 'Quality Review Instruction' }
          ]
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
