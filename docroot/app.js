requirejs.config({
  shim : {
		'rv3' : {
			deps : ['recline', 'backbone', 'd3', 'lodash', 'lodash.data'],
			exports : 'rv3'
		},
    'pieChart' : {
			deps : ['rv3']
		},
    'multiBarHorizontalChart' : {
      deps : ['rv3']
    },
  	'recline' : {
			exports : 'recline',
			deps : ['underscore', 'backbone', 'jquery', 'recline.backends.gdocs']
		},
    'recline.backends.gdocs' : { deps : ['jquery'] },
		'underscore' : {
			exports : '_'
		},
		'lodash' : {
			exports : '_'
		},
		'lodash.data' : {
			deps : ['lodash']
		},
		'backbone' : {
			exports: 'backbone'
		},
		'nvd3' : {
			exports : 'nv'
		},
    'chosenSelect' : { deps : ['jquery'] } 
	},
	paths : {
    'text' : 'lib/text/text',
    'jquery' : 'lib/jquery',
		'rv3' : 'lib/recline.view.nvd3.js/src/recline.view.nvd3.base',
		'pieChart' : 'lib/recline.view.nvd3.js/src/recline.view.nvd3.pieChart',
		'multiBarHorizontalChart' : 'lib/recline.view.nvd3.js/src/recline.view.nvd3.multiBarHorizontalChart',
    'recline' : 'lib/recline',
    'recline.backends.gdocs' : 'lib/recline_backends/backend.gdocs',
		'underscore' : 'lib/underscore',
		'backbone' : 'lib/backbone',
		'd3' : 'lib/d3.min',
		'lodash' : 'lib/lodash',
		'lodash.data' : 'lib/lodash.data.min',
		'nvd3' : 'lib/nvd3/build/nv.d3.min',
    'templates' : 'templates.html',
    'chosenSelect' : 'lib/chosen_v1.4.2/chosen.jquery.min'
	}
});

require(['text!templates', 'backbone', 'config', 'jquery', 'router'], function (Tpl, Backbone, Config, $) {
  $(Config.el).append(Tpl);
  Backbone.history.start({route: Config.route});
});
