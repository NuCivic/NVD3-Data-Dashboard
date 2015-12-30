define(['backbone', 'views/baseViews', 'jquery', 'recline', 'multiBarHorizontalChart'], function (Backbone, BaseViews, $, Recline, MultiBarHorizontalChart) {
  var Views = {};
  var compView = BaseViews.baseView.extend({
    initialize : function (opts) {
      this.$el = $("#region-main");
      this.tpl = '#dash-template';
      console.log("[compView]", opts);
      this._init(opts);
      console.log('init dcview', this.model.fetch);
      this.model.fetch();
    },

    render : function () {
      var self = this;
      console.log("[compView] RENDER");
      this.template({title : self.title});
//      if (self.states.length > 0) self.renderCharts();
//    nv.utils.windowResize(discreteBar.update);
    },

    renderCharts : function () {
      var self = this;
      self.states.forEach(function (state, i) {
        console.log("dcv_charts ",state, i);
        self.$el.append('<div class="nvd3-dash-bar-chart" id="bar-chart-'+i+'"></div>');
        var discreteBar = new MultiBarHorizontalChart({
          model: self.model,
          state: state,
          el: $('#bar-chart-'+i)
        });
        discreteBar.render();
      });
    }
  });
  Views.dashCompView = compView;
  return Views;
});
