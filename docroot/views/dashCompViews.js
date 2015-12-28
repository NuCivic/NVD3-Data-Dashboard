define(['backbone', 'views/baseViews', 'jquery', 'recline'], function (Backbone, BaseViews, $, Recline) {
  var Views = {};
  var compView = BaseViews.baseView.extend({
    initialize : function (opts) {
      this.$el = $("#dashContainer");
      console.log("[compView]", opts);
      this._init(opts);
    },

    render : function () {
      console.log("[compView] RENDER");
      var graph = new Recline.View.Graph({
        model: this.model,
        state: {
          graphType: "columns",
          group: "schoolname",
          series: ["schooltotalstudents"]
        }
      });
      this.$el.append(graph.el);
      graph.render();
      graph.redraw();
    }
  });
  Views.dashCompView = compView;
  return Views;
});
