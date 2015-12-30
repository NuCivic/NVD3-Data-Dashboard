define(['backbone', 'views/baseViews', 'jquery', 'recline', 'multiBarHorizontalChart'], function (Backbone, BaseViews, $, Recline, MultiBarHorizontalChart) {
  var selectView = BaseViews.baseView.extend({
    initialize : function (opts) {
      console.log('[selectView] Init', opts);
      this.tpl = "#chosen-select-widget";
      this.$el = $('#dash-select');
      this._init(opts);
      this.render();
    },

    render : function () {
      var self = this;
      require(['chosenSelect'], function () {
        var choices = self.choices;
        console.log('choices', choices);
        self.$el.html = self.template({ selectionType : self.selectionType, choices : choices });
        this.$(".chosen-select").chosen(); 
     });
   }
  });
  
  return selectView;
});
