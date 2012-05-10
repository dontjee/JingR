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
         _.bindAll(this, 'render', 'remove'); // every function that uses 'this' as the current object should be in here
      },
      render: function () {
         var pathString = 'M' + this.model.attributes.x1 + ' ' + this.model.attributes.y1 + 'L' + this.model.attributes.x2 + ' ' + this.model.attributes.y2;
         this.path = this.options.paper.path(pathString);
         this.path.attr("stroke", "#F50062");
         this.path.attr("stroke-width", "3");

         return this; // for chainable calls, like .render().el
      },
      remove: function () {
         this.path.remove();
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
         _.bindAll(this, 'render', 'mouseDown', 'mouseMove', 'mouseUp', 'addLine'); // every function that uses 'this' as the current object should be in here

         this.collection = new LineCollection();
         this.collection.bind('add', this.addLine); // collection event binder

         this.paper = Raphael("paper", 500, 500);
         this.paperOffset = $(this.el).offset();

         this.render();
      },
      render: function () {
         this.paper.rect(0, 0, 500, 500).attr({ fill: 'blue', 'fill-opacity': 0 });

         var self = this;
         _(this.collection.models).each(function (line) {
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

         this.begin = {
            x: e.clientX - this.paperOffset.left,
            y: e.clientY - this.paperOffset.top
         };
      },
      mouseMove: function (e) {
         if (!this.isDragging) {
            return;
         }

         var end = {
            x: e.clientX - this.paperOffset.left,
            y: e.clientY - this.paperOffset.top
         };

         if (this.previous) {
            this.previous.remove();
         }

         //var selectedType = drawingTypeButtons.children('.active').data('type');
         var selectedType = 'line';
         if (selectedType === 'line') {
            var line = new Line();
            line.set({
               x1: this.begin.x,
               y1: this.begin.y,
               x2: end.x,
               y2: end.y
            });
            this.previous = this.addLine(line);
         } else if (selectedType == 'arrow') {
            //this.previous = receiveArrow(begin.x, begin.y, end.x, end.y);
         } else if (selectedType === 'text') {
            //this.previous = receiveTextBox(begin.x, begin.y, end.x, end.y);
         }
      },
      mouseUp: function (e) {
         this.isDragging = false;
         if (this.clickIsTextarea) {
            return;
         }

         if (this.previous) {
            this.previous.remove();
         }

         var end = {
            x: e.clientX - this.paperOffset.left,
            y: e.clientY - this.paperOffset.top
         };
         var line = new Line();
         line.set({
            x1: this.begin.x,
            y1: this.begin.y,
            x2: end.x,
            y2: end.y
         });

         this.collection.add(line);
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