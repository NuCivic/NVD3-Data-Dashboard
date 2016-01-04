define(['backbone', 'views/baseViews', 'jquery', 'recline', 'multiBarHorizontalChart', 'nvd3'], function (Backbone, BaseViews, $, Recline, MultiBarHorizontalChart, NV) {
  var Views = {};
  Views.compView = BaseViews.baseView.extend({
    initialize : function (opts) {
      this.$el = $("#region-main");
      this.tpl = '#dash-template';
      this.schoolBaseUrl = 'http://ncdkanrny2efmnpl.devcloud.acquia-sites.com/schooldashboard?schools=';
      this._init(opts);
      _.bindAll('updateDash');
    },
    events : {
      "change select":  "updateDash"
    },

    updateDash : function (e) {
      var self = this;
      this.uuids = this.$(e.target).val();
      this.loadModels(function () {
        self.getDataset();
        self.renderCharts();
        self.addSchoolLabelColors();
      });
    },

    loadModels : function (fn) {
      self = this;
      var j=0;
      this.schools = [];
      _.each(this.uuids, function (uuid, i) {
        var school = new Backbone.Model({url : self.schoolBaseUrl + 'uuid'});
        school.url = self.schoolBaseUrl + uuid;
        school.fetch({
          success : function (model, res) {
            if (model.get('schools')[0].errors) {
              alert('Error retrieving school: ', model.get('schools')[0].errors);
              return;
            }
            self.schools.push(model.get('schools')[0]);
            // keep track of how many models we got
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
    },

    render : function () {
      var self = this;
      this.template({title : self.title});
      this.loadSelect();
    },

    loadSelect : function () {
      var self = this;
      var choiceModel = new Backbone.Model();
      choiceModel.url = this.metaDataUrl;
      choiceModel.fetch({
        success : function (res, model) {
          self.renderSelect(choiceModel.get('schools')); // success
          self.delegateEvents();
         }
      });
    },

    renderCharts : function () {
      var self = this;
      var chartHight = 150 + (self.dataset.recordCount - 1) * 50;
      self.states.forEach(function (state, i) {
        self.$el.append('<div class="nvd3-dash-bar-chart" id="bar-chart-'+i+'"></div>');
        var discreteBar = new MultiBarHorizontalChart({
          model: self.dataset,
          state: state,
          el: $('#bar-chart-'+i)
        });
        $('#bar-chart-'+i).css('height', chartHight + 'px');
        $('#bar-chart-'+i).css('width', '80%');
        $('#bar-chart-'+i).css('margin', '0 auto');
        discreteBar.render();
        NV.utils.windowResize(discreteBar.update);
      });
    },

    renderSelect : function (choices){
      var self = this;
      require(['views/selectView'], function (View) {
        var selectView = new View({ selectionType : 'Schools', choices : choices});
      });
    },

    addSchoolLabelColors : function () {
      var self = this;
      _.each(this.$('.search-choice'), function (choice, i) {
        var css = {
          background : self.barColors[i] +' none',
          color            : '#E2E8A0'
        };
        $(choice).css(css);
      });
    }
  });

  Views.detailView = BaseViews.baseView.extend({
    initialize : function (opts) {
      //umm...
      console.log('detailView init', opts);
      this._init(opts);
    },

    loadPage : function () {
        var self = this;
        var item = new Backbone.Model();
        item.url = self.apiBaseUrl + self.itemId;
        item.fetch({
          success : function (model, res) {
            console.log('fetch 0',model, res);
            if (model.get('schools').length === 0) {
              alert('Error retrieving school: ', model.get('schools')[0].errors);
              return;
            } else {
              console.log('fetch detail', model, res);
              self.title = model.get('schools')[0][self.itemTitleField];
              self.render();
            }
          }
        });
    },

    render : function () {
        console.log('render', this)
      var self = this;
      this.$el.html(this.template(self));
    }
  });
  return Views;
});
