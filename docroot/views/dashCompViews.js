define(['backbone', 'views/baseViews', 'jquery'], function (Backbone, BaseViews, $) {
  var Views = {};
  var compView = BaseViews.baseView.extend({
    initialize : function (opts) {
      this.$el = $("#dashContainer");
      console.log("[compView]", opts);
      this._init(opts);
    },

    render : function () {
      console.log("[compView] RENDER", this.$el);
      this.$el.html("FOO");
    }
  });
  Views.dashCompView = compView;
  return Views;
});
