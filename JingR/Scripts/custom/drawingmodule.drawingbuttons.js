window.TSC = window.TSC || { };
(function ($, TSC) {
   TSC.DrawingButtonsView = Backbone.View.extend({
      el: $('#js-drawingType'),
      initialize: function () {
         _.bindAll(this, 'getSelectedType');
      },
      getSelectedType: function () {
         var selected = $(this.el).children('button.active');
         return selected.data('type');
      }
   });
})(jQuery, window.TSC);