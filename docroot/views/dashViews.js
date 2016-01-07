define(['backbone', 'views/baseViews', 'jquery', 'recline', 'multiBarHorizontalChart', 'nvd3'], function (Backbone, BaseViews, $, Recline, MultiBarHorizontalChart, NV) {
  var Views = {};
  Views.compView = BaseViews.baseView.extend({
    initialize : function (opts) {
      this.$el = $("#region-main");
      this.tpl = '#dash-template';
      this._init(opts);
      _.bindAll('updateDash');
    },
    events : {
      "change select":  "updateDash",
      "click .chosen-choices .search-choice" : "navDetail"
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
      this.items = [];
      _.each(this.uuids, function (uuid, i) {
        var item = new Backbone.Model({url : self.apiBaseUrl + 'uuid'});
        item.url = self.apiBaseUrl + uuid;
        item.fetch({
          success : function (model, res) {
            if (model.get('schools').length == 0){
              alert('Error retrieving schools!');
              return;
            }else if (model.get('schools')[0].errors) {
              alert('Error retrieving school: ', model.get('schools')[0].errors);
              return;
            }
            self.items.push(model.get('schools')[0]);
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
      this.dataset = new Recline.Model.Dataset({ records : this.items });
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
        success : function (model, res) {
          self.choices = model;
          self.renderSelect(choiceModel.get('schools')); // success
          self.delegateEvents();
          self.addEventListeners();
         }
      });
    },

    renderCharts : function () {
      var self = this;
      // Add 50px per school added to the chart.
      var chartHeight = 150 + (self.dataset.recordCount - 1) * 50;
      self.states.forEach(function (state, i) {
        // Add new elements only if they do not exists
        if (!$('#bar-chart-'+i).length) {
          self.$('#dash-charts').append('<div class="nvd3-dash-bar-chart col-xs-12 col-md-6" id="bar-chart-'+i+'"></div>');
        }
        // Override 'columnClass' variable in the base MultiBarHorizontalChart class.
        var extendedMultiBarHorizontalChart = MultiBarHorizontalChart.extend({

          template:'<div class="recline-graph recline-nvd3">' +
                      '{{data}}' +
                      '<div class="{{columnClass}} {{viewId}} recline-nvd3"style="display: block;">' +
                        '<div id="{{viewId}}" class="recline-nvd3">' +
                            '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' +
                            ' height="{{height}}" width="{{width}}">' +
                            '</svg>' +
                        '</div>' +
                      '</div>' +
                    '</div> ',

          getLayoutParams: function(){
            var self = this;
            var layout = {
              columnClass: '',
              width: self.state.get('width') || self.$el.innerWidth() || DEFAULT_CHART_WIDTH,
              height: self.state.get('height') || DEFAULT_CHART_HEIGHT
            };
            return layout;
          }
        });

        var discreteBar = new extendedMultiBarHorizontalChart({
          model: self.dataset,
          state: state,
          el: $('#bar-chart-'+i)
        });
        this.$('#bar-chart-'+i).css('height', chartHeight + 'px');
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
    },

    addEventListeners : function () {
      self = this;
      console.log("addEventListeners");
      $('body').click('.chosen-choices .search-choice', function (e) {
      console.log('target', $(e.target));
      if ($(e.target).is('span')) {
          console.log($(e.target).text().trim());
          e.preventDefault();
          var choice = $(e.target).text().trim();
          var choices = self.choices.get('schools');
          var chosen = choices.filter(function ( obj ) {
              return obj.name === choice;
              })[0].uuid;
         if (typeof chosen !== undefined) {
           Backbone.history.navigate('#dash/detail/'+chosen, true);
       }
          console.log('clicck', chosen.uuid, choice, choices);
        };
      });
    },


});

  Views.detailView = BaseViews.baseView.extend({
    initialize : function (opts) {
      //umm...
      console.log("[detail]", opts);
      this._init(opts);
    },

    loadPage : function () {
        var self = this;
        var item = new Backbone.Model();
        item.url = self.apiBaseUrl + self.itemId;
        item.fetch({
          success : function (model, res) {
            if (model.get('schools').length === 0) {
              alert('Error retrieving school');
              return;
            } else {
              var records = [];
              records.push(model.get('schools')[0]);
              self.dataset = new Recline.Model.Dataset({ records : records });
              self.model = model;
              self.title = model.get('schools')[0][self.itemTitleField];
              self.render();
            }
          }
        });
    },

    renderCompareCharts : function () {
      var self = this;
      var chartHeight = 150 + (self.compareCharts.length - 1) * 50;

      _.each(self.compareCharts, function (chart, i) {
        // Add new elements only if they do not exists
        if (!$('#compare-chart-'+i).length) {
          self.$('#compare-charts-container').append('<div class="nvd3-dash-bar-chart col-xs-12 col-md-6" id="compare-chart-'+i+'"></div>');
        }

      var state = new Recline.Model.ObjectState({
        group : true,
        xfield : 'name',
        seriesFields: chart.fields,
        options: {
          showXAxis: false,
          showValues: true,
          showControls: false
        }
      });

      // Override the template and the default layout params.
      var extendedMultiBarHorizontalChart = MultiBarHorizontalChart.extend({

            template:'<div class="recline-graph recline-nvd3">' +
                        '{{data}}' +
                        '<div class="{{columnClass}} {{viewId}} recline-nvd3"style="display: block;">' +
                          '<div id="{{viewId}}" class="recline-nvd3">' +
                              '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' +
                              ' height="{{height}}" width="{{width}}">' +
                              '</svg>' +
                          '</div>' +
                        '</div>' +
                      '</div> ',

              getLayoutParams: function(){
                var self = this;
                var layout = {
                  columnClass: '',
                  width: self.state.get('width') || self.$el.innerWidth() || DEFAULT_CHART_WIDTH,
                  height: self.state.get('height') || DEFAULT_CHART_HEIGHT
                };
                return layout;
              }
      });

      var discreteBar = new extendedMultiBarHorizontalChart({
        model: self.dataset,
        state: state,
        el: $('#compare-chart-'+i)
      });

      discreteBar.render();
      self.$('#compare-chart-'+i).css('height', chartHeight + 'px');
      NV.utils.windowResize(discreteBar.update);
    });
  },

    renderSummaryCharts : function () {
      var self = this;
      require(['pieChart'], function (PieChart) {
        self.summaryCharts.forEach(function (summaryChart, i) {

          self.$('#summary-charts-container').append('<div class="nvd3-dash-pie-chart col-xs-12 col-md-6" id="summary-chart-'+i+'"></div>');
          console.log('pie', self.dataset);

          var state = new Recline.Model.ObjectState({
            xfield : 'pct_stu_safe_2014',
            seriesFields : ['pct_stu_safe_2014'], //chart.fields,
            options : {
              donut : true,
              showLegend: false,
              showLabels: true,
              labelType: 'key',
              labelsOutside: true,
              //title: summaryChart.title,
              //titleOffset: 200,
              tooltips: false,
            }
          });


      var extendedPieChart = PieChart.extend({

            template:'<div class="recline-graph recline-nvd3">' +
                        '{{data}}' +
                        '<div class="{{columnClass}} {{viewId}} recline-nvd3"style="display: block;">' +
                          '<div id="{{viewId}}" class="recline-nvd3">' +
                              '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' +
                              ' height="{{height}}" width="{{width}}">' +
                              '</svg>' +
                          '</div>' +
                        '</div>' +
                      '</div> ',

              getLayoutParams: function(){
                var self = this;
                var layout = {
                  columnClass: '',
                  width: self.state.get('width') || self.$el.innerWidth() || DEFAULT_CHART_WIDTH,
                  height: self.state.get('height') || DEFAULT_CHART_HEIGHT
                };
                return layout;
              },

              alterChart: function(chart){
                var self = this;
                chart
                .x(function(d) {
                  return `${summaryChart.title} ${d.x}`;
                })
                .y(function(d) {
                  console.log(d);
                  return d.y;
                });
                // we don't want labels to fill all the canvas.
                if(self.series.length > 10){
                  chart.showLegend(false);
                }
              },
      });

      var pieChart = new extendedPieChart({
        model : self.dataset,
        state : state,
        el : "#summary-chart-" + i
      });


      pieChart.render();
      //self.$('#summary-chart-' + i + ' .recline-nvd3').append('<p>'+chart.title+'</p>');

      NV.utils.windowResize(pieChart.update);
        });
      });
    },

    renderInfoItems : function () {
      var self = this;
      self.infoItems.forEach(function (infoItem) {

        console.log("I>>", $("#info-item").html(), infoItem);
        var tpl = _.template($("#info-item").html());
        self.$('.dash-info-section').append(tpl(infoItem));
      });
    },

    render : function () {
      var self = this;
      this.$el.html(this.template(self));
      self.renderCompareCharts();
      self.renderSummaryCharts();
      self.renderInfoItems();
    },

  });

  return Views;
});
