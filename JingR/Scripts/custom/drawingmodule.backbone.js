(function ($) {
   var Line = Backbone.Model.extend({
      defaults: {
         begin: { x: 0, y: 0 },
         end: { x: 0, y: 0 }
      }
   });

   var LineCollection = Backbone.Collection.extend({
      model: Line
   });

   var LineView = Backbone.View.extend({
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

         return this; // for chainable calls, like .render().el
      }
   });

   var PaperView = Backbone.View.extend({
      el: $('#paper'),
      events: {
         'mousedown': 'mouseDown',
         'mousemove': 'mouseMove',
         'mouseup': 'mouseUp'
      },
      initialize: function () {
         _.bindAll(this, 'render', 'mouseDown', 'mouseMove', 'mouseUp', 'setEndpointOfDrawing', 'addLine'); // every function that uses 'this' as the current object should be in here

         this.lineCollection = new LineCollection();
         this.lineCollection.bind('add', this.addLine); // collection event binder

         this.paper = Raphael("paper", 500, 500);
         this.paperOffset = $(this.el).offset();

         this.render();
      },
      render: function () {
         this.paper.rect(0, 0, 500, 500).attr({ fill: 'blue', 'fill-opacity': 0 });

         var self = this;
         _(this.lineCollection.models).each(function (line) {
            self.addLine(line);
         }, this);
      },
      mouseDown: function (e) {
         this.isDragging = true;
         if ($(e.target).is('textarea')) {
            this.clickIsTextarea = true;
            return;
         } else {
            this.clickIsTextarea = false;
         }

         var begin = {
            x: e.clientX - this.paperOffset.left,
            y: e.clientY - this.paperOffset.top
         };
         this.drawing = new Line();
         this.drawing.set({
            begin: begin,
            end: begin
         });

         this.lineCollection.add(this.drawing);
      },
      mouseMove: function (e) {
         if (!this.isDragging) {
            return;
         }

         this.setEndpointOfDrawing(e);
      },
      mouseUp: function (e) {
         this.isDragging = false;
         if (this.clickIsTextarea) {
            return;
         }

         this.setEndpointOfDrawing(e);
      },
      setEndpointOfDrawing: function (e) {
         var end = {
            x: e.clientX - this.paperOffset.left,
            y: e.clientY - this.paperOffset.top
         };

         this.drawing.set({
            end: end
         });
      },
      addLine: function (line) {
         var self = this;
         var lineView = new LineView({
            model: line,
            paper: self.paper
         });
         return lineView.render();
      }
   });

   var paperView = new PaperView();
})(jQuery);