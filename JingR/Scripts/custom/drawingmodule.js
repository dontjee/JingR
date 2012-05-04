var drawingModule = (function () {
 var paper;

 var drawing = $.connection.drawingHub;
 $.connection.hub.start();

 drawing.drawTextBox = function (x1, y1, x2, y2, text) {
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

 drawing.receiveImage = function (url) {
    var image = paper.image(url, 0, 0, 500, 500);
    image.click(handlePaperClick);
 };

 drawing.receiveLine = function (x1, y1, x2, y2) {
    return paper.path('M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2);
 };

 drawing.receiveArrow = function (x1, y1, x2, y2) {
    return paper.arrow(x1, y1, x2, y2, 12);
 };

 var drawingTypeButtons = $('#drawingType');
 var handlePaperClick = function (begin, end) {
    var selectedType = drawingTypeButtons.children('.active').data('type');

    if (selectedType === 'line') {
       drawing.sendLine(begin.x, begin.y, end.x, end.y);
    } else if (selectedType == 'arrow') {
       drawing.sendArrow(begin.x, begin.y, end.x, end.y);
    } else if (selectedType === 'text') {
       var textBox = drawing.drawTextBox(begin.x, begin.y, end.x, end.y);
       textBox.blur(function () {
          drawing.sendTextBox(begin.x, begin.y, end.x, end.y, $(this).val());
       });
    }
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
       if (previous) {
          if (previous instanceof Array) {
             previous[0].remove();
             previous[1].remove();
          } else {
             previous.remove();
          }
       }

       var selectedType = drawingTypeButtons.children('.active').data('type');
       if (selectedType === 'line') {
          previous = drawing.receiveLine(begin.x, begin.y, end.x, end.y);
       } else if (selectedType == 'arrow') {
          previous = drawing.receiveArrow(begin.x, begin.y, end.x, end.y);
       } else if (selectedType === 'text') {
          previous = drawing.drawTextBox(begin.x, begin.y, end.x, end.y);
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

       if (previous instanceof Array) {
          previous[0].remove();
          previous[1].remove();
       } else {
          previous.remove();
       }
       paperElement.unbind('mousemove');

       handlePaperClick(begin, end);
    });

    $('#loadImageSubmit').click(function () {
       var url = $(this).parent().siblings('.modal-body').children('input').val();
       drawing.sendImage(url);
    });

    $('.btn-group').button();
 };

 return {
    init: function (paperIn) {
       paper = paperIn;
       setupEvents();
    }
 };
})();