define(['backbone', 'views/baseViews', 'jquery', 'recline', 'multiBarHorizontalChart'], function (Backbone, BaseViews, $, Recline, MultiBarHorizontalChart) {
  var Views = {};
  var compView = BaseViews.baseView.extend({
    initialize : function (opts) {
      this.$el = $("#dashContainer");
      console.log("[compView]", opts);
      this._init(opts);
      console.log('init dcview', this.model.fetch);
      this.model.fetch();
    },

    render : function () {
      var self = this;
      console.log("[compView] RENDER");
    var discreteBar = new MultiBarHorizontalChart({
      model: self.model,
      state: self.state,
      el: $('#dashContainer')
    });
    discreteBar.render();
//    nv.utils.windowResize(discreteBar.update);
    }
  });
  Views.dashCompView = compView;
  return Views;
});
