define(['backbone', 'underscore'], function (Backbone, _) {
  var Views = {};
  Views.baseView = Backbone.View.extend({
    _init : function (opts) {
      console.log('[baseView]', opts);
      _.extend(this, opts);
    }
  });
  return Views;
});
