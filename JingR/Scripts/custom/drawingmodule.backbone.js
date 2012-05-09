(function ($) {
   var Line = Backbone.Model.extend({
      defaults: {
         x1: 0,
         y1: 0,
         x2: 0,
         y2: 0
      }
   });

   var LineCollection = Backbone.Collection.extend({
      model: Line
   });

   var LineView = Backbone.View.extend({
      initialize: function () {
         _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
      },
      render: function () {
         var pathString = 'M' + this.model.attributes.x1 + ' ' + this.model.attributes.y1 + 'L' + this.model.attributes.x2 + ' ' + this.model.attributes.y2;
         var path = this.options.paper.path(pathString);
         path.attr("stroke", "#F50062");
         path.attr("stroke-width", "3");

         return this; // for chainable calls, like .render().el
      }
   });

   var PaperView = Backbone.View.extend({
      el: $('#paper'),
      events: {
         'click': 'paperClick'
      },
      initialize: function () {
         _.bindAll(this, 'render', 'paperClick', 'addLine'); // every function that uses 'this' as the current object should be in here

         this.collection = new LineCollection();
         this.collection.bind('add', this.addLine); // collection event binder

         this.paper = Raphael("paper", 500, 500);

         this.render();
      },
      render: function () {
         this.paper.rect(0, 0, 500, 500).attr({ fill: 'blue', 'fill-opacity': 0 });

         var self = this;
         _(this.collection.models).each(function (line) {
            self.addLine(line);
         }, this);
      },
      paperClick: function (e) {
         var line = new Line();
         line.set({
            x1: 0,
            y1: 0,
            x2: 100,
            y2: 100
         });
         this.collection.add(line);
      },
      addLine: function (line) {
         var self = this;
         var lineView = new LineView({
            model: line,
            paper: self.paper
         });
         lineView.render();
      }
   });

   var paperView = new PaperView();
})(jQuery);