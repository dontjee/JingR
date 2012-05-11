window.TSC = window.TSC || { };

(function ($, TSC) {
   TSC.Arrow = Backbone.Model.extend({
      defaults: {
         begin: { x: 0, y: 0 },
         end: { x: 0, y: 0 }
      }
   });

   TSC.ArrowCollection = Backbone.Collection.extend({
      model: window.TSC.Arrow
   });

   TSC.ArrowView = Backbone.View.extend({
      initialize: function () {
         _.bindAll(this, 'render', 'modelChange'); // every function that uses 'this' as the current object should be in here

         this.model.on('change:end', this.modelChange);
      },
      modelChange: function () {
         this.path.remove();
         this.render();
      },
      render: function () {
         var pathString = 'M' + this.model.attributes.begin.x + ' ' + this.model.attributes.begin.y + 'L' + this.model.attributes.end.x + ' ' + this.model.attributes.end.y;
         this.path = this.options.paper.path(pathString);
         this.path.attr("stroke", "#F50062");
         this.path.attr("stroke-width", "3");
         this.path.attr("arrow-end", "block -wide -wide");

         return this; // for chainable calls, like .render().el
      }
   });
})(jQuery, window.TSC);