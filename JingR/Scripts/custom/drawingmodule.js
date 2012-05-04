﻿var drawingModule = (function () {
   var paper, id;

   var receiveTextBox = function (x1, y1, x2, y2, text) {
      var textArea = $('<textarea>');
      textArea.val(text);

      var paperElement = $('#paper');
      paperElement.append(textArea);
      textArea.css('position', 'absolute');

      var top = y1 > y2 ? y2 : y1;
      var left = x1 > x2 ? x2 : x1;
      var paperOffset = paperElement.offset();

      textArea.css('left', left + paperOffset.left);
      textArea.css('top', top + paperOffset.top);
      var height = y2 > y1 ? y2 - y1 : y1 - y2;
      height = height > 30 ? height : 30;
      textArea.css('height', height);
      var width = x2 > x1 ? x2 - x1 : x1 - x2;
      width = width > 60 ? width : 60;
      textArea.css('width', width);

      return $(textArea);
   };

   var receiveImage = function (url) {
      var image = paper.image(url, 0, 0, 500, 500);
      image.toBack();
   };

   var receiveLine = function (x1, y1, x2, y2) {
      var p = paper.path('M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2);
      p.attr("stroke", "#F50062");
      p.attr("stroke-width", "3");
      return p;
   };

   var receiveArrow = function (x1, y1, x2, y2) {
      var p = paper.path('M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2);
      p.attr("stroke", "#F50062");
      p.attr("stroke-width", "3");
      p.attr("arrow-end", "block -wide -wide");

      return p;
   };

   var sendLine = function (x1, y1, x2, y2) {
      receiveLine(x1, y1, x2, y2);
      $.post('/api/' + id + '/line', { x1: x1, y1: y1, x2: x2, y2: y2 }, function (data) {
         alert('saved line');
      });
   };

   var sendArrow = function (x1, y1, x2, y2) {
      receiveArrow(x1, y1, x2, y2);
      $.post('/api/' + id + '/arrow', { x1: x1, y1: y1, x2: x2, y2: y2 }, function (data) {
         alert('saved arrow');
      });
   };

   var sendTextBox = function (x1, y1, x2, y2, text) {
      receiveTextBox(x1, y1, x2, y2, text);

      $.post('/api/' + id + '/text', { x1: x1, y1: y1, x2: x2, y2: y2, value: text }, function (data) {
         alert('saved text');
      });
   };

   var sendImage = function (url) {
      receiveTextBox(receiveImage(url));

      $.post('/api/' + id + '/image', { url: url }, function (data) {
         alert('saved image');
      });
   };

   var drawingTypeButtons = $('#drawingType');
   var handlePaperClick = function (begin, end) {
      var selectedType = drawingTypeButtons.children('.active').data('type');

      if (selectedType === 'line') {
         sendLine(begin.x, begin.y, end.x, end.y);
      } else if (selectedType == 'arrow') {
         sendArrow(begin.x, begin.y, end.x, end.y);
      } else if (selectedType === 'text') {
         var textBox = receiveTextBox(begin.x, begin.y, end.x, end.y);
         textBox.blur(function () {
            sendTextBox(begin.x, begin.y, end.x, end.y, $(this).val());
         });
      }
   };

   var getDrawing = function () {
      $.get('/api/' + id, {}, function (data) {
         var i;
         for (i in data.Lines) {
            var line = data.Lines[i];
            receiveLine(line.X1, line.Y1, line.X2, line.Y2);
         }

         for (i in data.Arrows) {
            var arrow = data.Arrows[i];
            receiveArrow(arrow.X1, arrow.Y1, arrow.X2, arrow.Y2);
         }

         for (i in data.Text) {
            var text = data.Text[i];
            receiveTextBox(text.X1, text.Y1, text.X2, text.Y2, text.Value);
         }

         if (data.Image) {
            receiveImage(data.Image.Url);
         }
      });
   };

   var setupEvents = function () {
      paper.rect(0, 0, 500, 500).attr({ fill: 'blue', 'fill-opacity': 0 });
      var paperElement = $('#paper');
      var paperOffset = paperElement.offset();
      var begin, end;

      var previous;
      var mouseMove = function (e) {
         end = {
            x: e.clientX - paperOffset.left,
            y: e.clientY - paperOffset.top
         };
         if(previous) {
            previous.remove();
         }

         var selectedType = drawingTypeButtons.children('.active').data('type');
         if (selectedType === 'line') {
            previous = receiveLine(begin.x, begin.y, end.x, end.y);
         } else if (selectedType == 'arrow') {
            previous = receiveArrow(begin.x, begin.y, end.x, end.y);
         } else if (selectedType === 'text') {
            previous = receiveTextBox(begin.x, begin.y, end.x, end.y);
         }
      };

      var clickIsTextarea = false;
      paperElement.mousedown(function (e) {
         if ($(e.target).is('textarea')) {
            clickIsTextarea = true;
            return;
         } else {
            clickIsTextarea = false;
         }

         begin = {
            x: e.clientX - paperOffset.left,
            y: e.clientY - paperOffset.top
         };

         paperElement.mousemove(mouseMove);
      });

      paperElement.mouseup(function (e) {
         if (clickIsTextarea) {
            return;
         }
         end = {
            x: e.clientX - paperOffset.left,
            y: e.clientY - paperOffset.top
         };

         previous.remove();
         paperElement.unbind('mousemove');

         handlePaperClick(begin, end);
      });

      $('#loadImageSubmit').click(function () {
         var url = $(this).parent().siblings('.modal-body').children('input').val();
         sendImage(url);
      });

      $('.btn-group').button();
   };

   return {
      init: function (paperIn, idIn) {
         paper = paperIn;
         id = idIn;
         setupEvents();
         getDrawing();
      }
   };
})();