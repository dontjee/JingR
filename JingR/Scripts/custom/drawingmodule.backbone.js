(function ($) {
   var Arrow = Backbone.Model.extend({
      defaults: {
         begin: { x: 0, y: 0 },
         end: { x: 0, y: 0 }
      }
   });

   var ArrowCollection = Backbone.Collection.extend({
      model: Arrow
   });

   var ArrowView = Backbone.View.extend({
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

   var Textbox = Backbone.Model.extend({
      defaults: {
         begin: { x: 0, y: 0 },
         end: { x: 0, y: 0 }
      }
   });

   var TextboxCollection = Backbone.Collection.extend({
      model: Textbox
   });

   var TextboxView = Backbone.View.extend({
      initialize: function () {
         _.bindAll(this, 'render', 'modelChange'); // every function that uses 'this' as the current object should be in here

         this.model.on('change:end', this.modelChange);
      },
      modelChange: function () {
         this.textbox.remove();
         this.render();
      },
      render: function () {
         this.textbox = $('<textarea>');

         var parentElement = $(this.options.parentElement);

         parentElement.append(this.textbox);
         this.textbox.css('position', 'absolute');

         var x1 = this.model.attributes.begin.x,
             x2 = this.model.attributes.end.x,
             y1 = this.model.attributes.begin.y,
             y2 = this.model.attributes.end.y;

         var top = y1 > y2 ? y2 : y1;
         var left = x1 > x2 ? x2 : x1;
         var paperOffset = parentElement.offset();

         this.textbox.css('left', left + paperOffset.left);
         this.textbox.css('top', top + paperOffset.top);

         var height = y2 > y1 ? y2 - y1 : y1 - y2;
         height = height > 30 ? height : 30;
         this.textbox.css('height', height);

         var width = x2 > x1 ? x2 - x1 : x1 - x2;
         width = width > 60 ? width : 60;
         this.textbox.css('width', width);

         return this; // for chainable calls, like .render().el
      }
   });

   var DrawingButtonsView = Backbone.View.extend({
      el: $('#js-drawingType'),
      initialize: function () {
         _.bindAll(this, 'getSelectedType');
      },
      getSelectedType: function () {
         var selected = $(this.el).children('button.active');
         return selected.data('type');
      }
   });

   var PaperModel = Backbone.Model.extend({
      urlRoot: '/api'
   });

   var PaperView = Backbone.View.extend({
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

         this.arrows = new ArrowCollection();
         this.arrows.url = '/api/' + this.model.attributes.id + '/arrows';
         this.arrows.bind('add', this.addArrow); // collection event binder

         this.textboxes = new TextboxCollection();
         this.textboxes.url = '/api/' + this.model.attributes.id + '/textboxes';
         this.textboxes.bind('add', this.addTextbox);

         this.paper = Raphael("js-paper", 500, 500);
         var image = this.paper.image(this.model.attributes.imageUrl, 0, 0, 500, 500);
         image.toBack();

         this.paperOffset = $(this.el).offset();

         this.drawingButtons = new DrawingButtonsView();

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
            this.drawing = new Arrow();
            this.drawing.set({
               begin: begin,
               end: begin
            });

            this.arrows.add(this.drawing);
         } else {
            this.drawing = new Textbox();
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
         var arrowView = new ArrowView({
            model: arrow,
            paper: self.paper
         });
         return arrowView.render();
      },
      addTextbox: function (textbox) {
         var self = this;
         var textboxView = new TextboxView({
            model: textbox,
            parentElement: self.el
         });

         return textboxView.render();
      }
   });

   var MainView = Backbone.View.extend({
      el: $('#loadImageModal'),
      events: {
         'click #js-loadImageSubmit': 'submitClick'
      },
      initialize: function () {
         _.bindAll(this, 'submitClick', 'remove');

         if (window.location.hash) {
            var paper = new PaperModel({
               id: window.location.hash.substr(1)
            });

            var self = this;
            paper.fetch({
               success: function () {
                  self.loadPaperView(paper);
               }
            });
         }
      },
      submitClick: function () {
         var url = $(this.el).find('input').val();

         var max = 99999, min = 1;
         var id = Math.floor(Math.random() * (max - min + 1)) + min;

         var paper = new PaperModel({
            id: id,
            imageUrl: url
         });
         paper.save();

         this.loadPaperView(paper);
      },
      loadPaperView: function (paper) {
         window.paperView = new PaperView({ model: paper });
         this.remove();
      },
      remove: function () {
         $('#js-loadImage').remove();
         $(this.el).remove();
      }
   });

   var mainView = new MainView();
})(jQuery);