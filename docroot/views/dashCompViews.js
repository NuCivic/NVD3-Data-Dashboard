define(['backbone', 'views/baseViews', 'jquery', 'recline', 'multiBarHorizontalChart'], function (Backbone, BaseViews, $, Recline, MultiBarHorizontalChart) {
  var Views = {};
  var compView = BaseViews.baseView.extend({
    initialize : function (opts) {
      this.$el = $("#region-main");
      this.tpl = '#dash-template';
      console.log("[compView]", opts);
      this._init(opts);
      _.bindAll('updateDash');
//      this.model.fetch();
    },
    events : {
      "change select":  "updateDash"
    },

    updateDash : function (e) {
      this.uids = this.$(e.target).val();
      console.log('[dcv]update dash', e, this.uids);
    },

    render : function () {
      var self = this;
      console.log("[compView] RENDER");
      this.template({title : self.title});
      this.loadSelect();
//      if (self.states.length > 0) self.renderCharts();
//    nv.utils.windowResize(discreteBar.update);
    },

    loadSelect : function () {
      var self = this;
      console.log('[sv]load', this);
      var choiceModel = new Backbone.Model();
      choiceModel.url = this.metaDataUrl;
      choiceModel.fetch({
        success : function (res, model) {
          console.log("[selectView] fetch", res, model);
          self.renderSelect(choiceModel.get('schools')); // success
          self.delegateEvents();
         }
      });
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
    },

    renderSelect : function (choices){
      var self = this;
      console.log('renderselect', this);
      require(['views/selectView'], function (View) {
        var selectView = new View({ selectionType : 'Schools', choices : choices});
      });
    }
  });
  Views.dashCompView = compView;
  return Views;
});
