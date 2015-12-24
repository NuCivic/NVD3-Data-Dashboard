requirejs.config({
  shim : {
		'rv3' : {
			deps : ['recline'],
			exports : 'rv3'
		},
  	'recline' : {
			exports : 'recline',
			deps : ['underscore', 'backbone', 'jquery']
		},
		'underscore' : {
			exports : '_'
		},
		'backbone' : {
			exports: 'backbone'
		}
	},
	paths : {
		'jquery' : 'lib/jquery',
		'rv3' : 'lib/recline.view.nvd3.js/dist/recline.view.nvd3.min',
		'recline' : 'lib/recline',
		'underscore' : 'lib/underscore',
		'backbone' : 'lib/backbone'
	}
});

require(['recline', 'rv3'], function (recline, rv3) {
console.log(rv3);
var state = new recline.Model.ObjectState({
  xfield: 'state',
  seriesFields: ['total'],
  group: true,
  options: {
    donut: true
  }
});

/**
 * Pie Chart
 */
console.log(state, rv3);

});
