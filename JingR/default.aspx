<%@ Page Title="" Language="C#" MasterPageFile="~/Base.Master" AutoEventWireup="true"
   CodeBehind="default.aspx.cs" Inherits="JingR.Default" %>

<asp:Content ID="head" ContentPlaceHolderID="head" runat="server">
   <style>
      textarea {
      resize: none;
    }
   </style>
</asp:Content>
<asp:Content ID="body" ContentPlaceHolderID="Body" runat="server">
   <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
         <div class="container">
            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"><span
               class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>
            </a><a class="brand" href="/">JingR</a>
            <div class="nav-collapse">
               <ul class="nav">
                  <li class="active"><a href="/">Home</a></li>
                  <li><a href="#about">About</a></li>
               </ul>
            </div>
         </div>
      </div>
   </div>
   <div class="container">
      <div class="row-fluid">
         <div id="paper" style="width: 500px; height: 500px;">
         </div>
      </div>
      <div class="row-fluid">
         <div class="span2">
            <a id="loadImage" class="btn" href="#loadImageModal" data-toggle="modal">Load Image…</a>
         </div>
         <div class="span10 form-horizontal">
            <label class="control-label">
               Draw:</label>
            <div id="drawingType" class="btn-group inline controls" data-toggle="buttons-radio">
               <button class="btn active" data-type="line">Line</button>
               <button class="btn" data-type="arrow">Arrow</button>
               <button class="btn" data-type="text">Text</button>
            </div>
         </div>
      </div>
   </div>

   <div id="loadImageModal" class="modal hide fade">
      <div class="modal-header">
         Url please</div>
      <div class="modal-body">
         <label>
            Enter url below</label>
         <input type="text" class="span3" placeholder="Url to image">
      </div>
      <div class="modal-footer">
         <button type="submit" class="btn" data-dismiss="modal">
            Cancel</button>
         <button id="loadImageSubmit" type="submit" class="btn btn-primary" data-dismiss="modal">
            Submit</button>
      </div>
   </div>
</asp:Content>
<asp:Content ID="scripts" ContentPlaceHolderID="Scripts" runat="server">
   <script type="text/javascript" src="Scripts/jquery.signalR.min.js"></script>
   <script type="text/javascript" src="/signalr/hubs"></script>
   <script type="text/javascript" src="Scripts/raphael-min.js"></script>
   <script type="text/javascript">
      Raphael.fn.arrow = function (x1, y1, x2, y2, size) {
         var angle = Math.atan2(x1 - x2, y2 - y1);
         angle = (angle / (2 * Math.PI)) * 360;
         var arrowPath = this.path("M" + x2 + " " + y2 + " L" + (x2 - size) + " " + (y2 - size) + " L" + (x2 - size) + " " + (y2 + size) + " L" + x2 + " " + y2).attr("fill", "black").rotate((90 + angle), x2, y2);
         var linePath = this.path("M" + x1 + " " + y1 + " L" + x2 + " " + y2);
         return [linePath, arrowPath];
      };
      var drawingModule = (function () {
         var paper;
         var drawing = $.connection.drawingHub;

         drawing.drawTextBox = function (x1, y1, x2, y2, text) {
            var textArea = $('<textarea>');
            textArea.val(text);

            var paperElement = $('#paper');
            paperElement.append(textArea);
            textArea.css('position', 'absolute');

            // assumes 1 < 2
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


         $.connection.hub.start();

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
   </script>
   <script type="text/javascript">
      $(function () {
         var paper = Raphael("paper", 500, 500);

         drawingModule.init(paper);
      });
   </script>
</asp:Content>
