window.TSC = window.TSC || { };

(function ($, TSC) {
   TSC.MainView = Backbone.View.extend({
      el: $('#loadImageModal'),
      events: {
         'click #js-loadImageSubmit': 'submitClick'
      },
      initialize: function () {
         _.bindAll(this, 'submitClick', 'remove');

         if (window.location.hash) {
            var paper = new TSC.PaperModel({
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

         var paper = new TSC.PaperModel({
            id: id,
            imageUrl: url
         });
         paper.save();

         this.loadPaperView(paper);
      },
      loadPaperView: function (paper) {
         window.paperView = new TSC.PaperView({ model: paper });
         this.remove();
      },
      remove: function () {
         $('#js-loadImage').remove();
         $(this.el).remove();
      }
   });
   var mainView = new TSC.MainView();
})(jQuery, window.TSC);