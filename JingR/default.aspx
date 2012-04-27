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
      <div id="paper">
      </div>
      <a id="loadImage" class="btn" href="#loadImageModal" data-toggle="modal">Load Image…</a>
      <div id="loadImageModal" class="modal hide fade">
         <div class="modal-header">Url please</div>
         <div class="modal-body">
             <label>Enter url below</label>
             <input type="text" class="span3" placeholder="Url to image">
         </div>
         <div class="modal-footer">
            <button type="submit" class="btn" data-dismiss="modal">Cancel</button>
            <button id="loadImageSubmit" type="submit" class="btn btn-primary" data-dismiss="modal">Submit</button>
         </div>
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

         drawing.receiveImage = function(url) {
            var image = paper.image(url, 0, 0, 500, 500);
            image.click(handlePaperClick);
         };


         $.connection.hub.start();

         var handlePaperClick = function (e) {
            drawing.sendIt(e.offsetX, e.offsetY);
         };

         var setupEvents = function () {
            var clickBox = paper.rect(0, 0, 500, 500).attr({ fill: 'blue', 'fill-opacity': 0 });

            clickBox.click(handlePaperClick);

            $('#loadImageSubmit').click(function () {
               var url = $(this).parent().siblings('.modal-body').children('input').val();
               drawing.sendImage(url);
            });
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
