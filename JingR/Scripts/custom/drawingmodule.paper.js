window.TSC = window.TSC || { };
(function ($, TSC) {
   TSC.PaperModel = Backbone.Model.extend({
      urlRoot: '/api'
   });

   TSC.PaperView = Backbone.View.extend({
      el: $('#js-paper'),
      events: {
         'mousedown': 'mouseDown',
         'mousemove': 'mouseMove',
         'mouseup': 'mouseUp'
      },
      initialize: function () {
         window.location.hash = this.model.attributes.id;

         _.bindAll(this, 'render', 'mouseDown', 'mouseMove', 'mouseUp', 'setEndpointOfDrawing', 'addArrow', 'addTextbox'); // every function that uses 'this' as the current object should be in here

         $(this.el).show();
         $('#js-buttons').show();

         var pusher = new Pusher('f92e432c5c1537977aaf');

         this.arrows = new window.TSC.ArrowCollection();
         this.arrows.url = '/api/' + this.model.attributes.id + '/arrows';
         this.arrows.bind('add', this.addArrow); // collection event binder
         var arrowChannel = pusher.subscribe(this.model.attributes.id + '-' + 'arrows');
         this.arrowPusher = new Backpusher(arrowChannel, this.arrows);

         this.textboxes = new TSC.TextBoxCollection();
         this.textboxes.url = '/api/' + this.model.attributes.id + '/textboxes';
         this.textboxes.bind('add', this.addTextbox);
         var textboxChannel = pusher.subscribe(this.model.attributes.id + '-' + 'textboxes');
         this.textboxPusher = new Backpusher(textboxChannel, this.textboxes);

         this.paper = Raphael("js-paper", 500, 500);
         var image = this.paper.image(this.model.attributes.imageUrl, 0, 0, 500, 500);
         image.toBack();

         this.paperOffset = $(this.el).offset();

         this.drawingButtons = new TSC.DrawingButtonsView();

         this.render();
      },
      render: function () {
         this.paper.rect(0, 0, 500, 500).attr({ fill: 'blue', 'fill-opacity': 0 });

         var self = this;
         this.textboxes.fetch({
            success: function () {
               _(self.textboxes.models).each(function (textbox) {
                  self.addTextbox(textbox);
               }, self);
            }
         });

         this.arrows.fetch({
            success: function () {
               _(self.arrows.models).each(function (arrow) {
                  self.addArrow(arrow);
               }, self);
            }
         });
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

         if (this.drawingButtons.getSelectedType() == 'arrow') {
            this.drawing = new window.TSC.Arrow();
            this.drawing.set({
               begin: begin,
               end: begin
            });

            this.arrows.add(this.drawing);
         } else {
            this.drawing = new TSC.TextBox();
            this.drawing.set({
               begin: begin,
               end: begin
            });

            this.textboxes.add(this.drawing);
         }

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
         this.drawing.save();
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
      addArrow: function (arrow) {
         var self = this;
         var arrowView = new window.TSC.ArrowView({
            model: arrow,
            paper: self.paper
         });
         return arrowView.render();
      },
      addTextbox: function (textbox) {
         var self = this;
         var textboxView = new TSC.TextboxView({
            model: textbox,
            parentElement: self.el
         });

         return textboxView.render();
      }
   });
})(jQuery, window.TSC);