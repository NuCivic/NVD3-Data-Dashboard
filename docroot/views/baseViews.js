define(['backbone', 'underscore'], function (Backbone, _) {
  var Views = {};
  Views.baseView = Backbone.View.extend({
    _init : function (opts) {
      console.log('[baseView]', opts);
      _.extend(this, opts);
    },

    template: function (data) {
      console.log('template', data, $(this.tpl).html(), _.template($(this.tpl).html(), {title : 'title'}));
      var t = _.template($(this.tpl).html());
      var c = t(data);
      this.$el.html(c);
    }

  });

  return Views;
}, function (err) {
  console.log("[baeViews]ERR", err);
});
