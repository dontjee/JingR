window.TSC = window.TSC || { };

(function ($, TSC) {
   TSC.TextBox = Backbone.Model.extend({
      defaults: {
         begin: { x: 0, y: 0 },
         end: { x: 0, y: 0 }
      }
   });

   TSC.TextBoxCollection = Backbone.Collection.extend({
      model: TSC.TextBox
   });

   TSC.TextboxView = Backbone.View.extend({
      initialize: function () {
         _.bindAll(this, 'render', 'modelChange', 'blur'); // every function that uses 'this' as the current object should be in here

         this.model.on('change:end', this.modelChange);
      },
      modelChange: function () {
         this.textbox.remove();
         this.render();
      },
      render: function () {
         this.textbox = $('<textarea>');
         this.textbox.blur(this.blur);
         this.textbox.val(this.model.attributes.value);

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
      },
      blur: function () {
         this.model.set('value', this.textbox.val());
         this.model.save();
      }
   });
})(jQuery, window.TSC);