define(['backbone', 'views/baseViews', 'jquery', 'recline', 'multiBarHorizontalChart'], function (Backbone, BaseViews, $, Recline, MultiBarHorizontalChart) {
  var selectView = BaseViews.baseView.extend({
    initialize : function (opts) {
      console.log('[selectView] Init', opts);
      this.tpl = "#chosen-select-widget";
      this.$el = $('#dash-select');
      this._init(opts);
      this.loadView();
    },

    loadView : function () {
      var self = this;
      console.log('[sv]load', this);
      this.model = new Backbone.Model();
      this.model.url = this.url;
      console.log('[selectView], model',this.model);
      this.model.fetch({
        success : function (res, model) {
          console.log("[selectView] fetch", res, model);
          self.render(); // success
         }
      });
    },

    render : function () {
      var self = this;
      require(['chosenSelect'], function () {
        var choices = self.model.get('schools');
        console.log('choices', choices);
        self.$el.html = self.template({ selectionType : self.selectionType, choices : choices });
        this.$(".chosen-select").chosen(); 
     });
   }
  });
  
  return selectView;
});
