define(['rv3', 'lodash'], function (Base, _) {⏎
    var multiBarHorizontalChart = Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'multiBarHorizontalChart';
      Base.prototype.initialize.call(self, options);
      self.state.set('computeXLabels', false);
    },
    render: function(){
      var self = this;
      Base.prototype.render.call(self, {});
    },
    getDefaults: function(){
      return {
        options: {
          tooltips: true,
          reduceXTicks: false,
        }
      };
    }
  });
  return multiBarHorizontalChart;
});
