define(['backbone', 'views/baseViews', 'jquery', 'recline', 'multiBarHorizontalChart', 'nvd3'], function (Backbone, BaseViews, $, Recline, MultiBarHorizontalChart, NV) {
  var Views = {};
  var compView = BaseViews.baseView.extend({
    initialize : function (opts) {
      this.$el = $("#region-main");
      this.tpl = '#dash-template';
      this.schoolBaseUrl = 'http://ncdkanrny2efmnpl.devcloud.acquia-sites.com/schooldashboard?schools=';
      console.log("[compView]", opts);
      this._init(opts);
      _.bindAll('updateDash');
//      this.model.fetch();
    },
    events : {
      "change select":  "updateDash"
    },

    updateDash : function (e) {
      var self = this;
      this.uuids = this.$(e.target).val();
      console.log('[dcv]update dash', e, this.uuids);
      this.loadModels(function () {
        self.getDataset();
        self.renderCharts();
      });
    },

    loadModels : function (fn) {
      self = this;
      var j=0;
      console.log('load models');
      this.schools = [];
      _.each(this.uuids, function (uuid, i) {
        var school = new Backbone.Model({url : self.schoolBaseUrl + 'uuid'});
        console.log('dcv lm', school);
        school.url = self.schoolBaseUrl + uuid;
        school.fetch({
          success : function (model, res) {
            if (model.get('schools')[0].errors) {
              console.log('error retrieveing school', model.get('schools')[0].errors);
              alert('Error retrieving school: ', model.get('schools')[0].errors);
              return;
            }
            self.schools.push(model.get('schools')[0]);
            console.log('schools', self.schools);
            console.log('school fetch success', res, model);
            // keep track of how many models we got
              console.log('>>>',i ,self.uuids.length - 1, j)
            if (j === self.uuids.length - 1) {
              fn();
            }
            j++;
          }
        });
      });
    },

    getDataset : function () {
      this.dataset = new Recline.Model.Dataset({ records : this.schools });
      console.log("[dcv]dataset", this.schools, this.dataset);
    },

    render : function () {
      var self = this;
      console.log("[compView] RENDER");
      this.template({title : self.title});
      this.loadSelect();
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
        //console.log("dcv_charts ",state, self.dataset, i);
        self.$el.append('<div class="nvd3-dash-bar-chart" id="bar-chart-'+i+'"></div>');
        var discreteBar = new MultiBarHorizontalChart({
          model: self.dataset,
          state: state,
          el: $('#bar-chart-'+i)
        });
        discreteBar.render();
        NV.utils.windowResize(discreteBar.update);
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
