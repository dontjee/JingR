<%@ Page Title="" Language="C#" MasterPageFile="~/Base.Master" AutoEventWireup="true"
   CodeBehind="default.aspx.cs" Inherits="JingR.Default" %>

<asp:Content ID="head" ContentPlaceHolderID="head" runat="server">
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
         <div id="paper">
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
      var drawingModule = (function () {
         var paper;
         var drawing = $.connection.drawingHub;

         drawing.drawIt = function (x, y) {
            paper.text(x, y, 'you clicked here');
         };

         drawing.receiveImage = function (url) {
            var image = paper.image(url, 0, 0, 500, 500);
            image.click(handlePaperClick);
         };

         drawing.receiveLine = function (x1, y1, x2, y2) {
            paper.path('M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2);
         };


         $.connection.hub.start();

         var drawingTypeButtons = $('#drawingType');
         var handlePaperClick = function (begin, end) {
            var selectedType = drawingTypeButtons.children('.active').data('type');

            if(selectedType === 'line') {
               drawing.sendLine(begin.x, begin.y, end.x, end.y);
            } else if(selectedType == 'arrow') {
               //todo
            } else if( selectedType === 'text') {
               drawing.sendIt(end.x, end.y);
            }
         };

         var setupEvents = function () {
            var clickBox = paper.rect(0, 0, 500, 500).attr({ fill: 'blue', 'fill-opacity': 0 });

            var paperOffset = $('#paper').offset();
            var begin, end;
            clickBox.mousedown(function (e) {
               begin = {
                  x: e.clientX - paperOffset.left,
                  y: e.clientY - paperOffset.top
               };
            });

            clickBox.mouseup(function (e) {
               end = {
                  x: e.clientX - paperOffset.left,
                  y: e.clientY - paperOffset.top
               };

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
