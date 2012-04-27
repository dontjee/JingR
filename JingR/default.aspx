<%@ Page Title="" Language="C#" MasterPageFile="~/Base.Master" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="JingR.Default" %>
<asp:Content ID="head" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="body" ContentPlaceHolderID="Body" runat="server">
   <div id="paper"></div>
</asp:Content>
<asp:Content ID="scripts" ContentPlaceHolderID="Scripts" runat="server">
<script type="text/javascript" src="Scripts/jquery.signalR.min.js"></script>
<script src="/signalr/hubs" type="text/javascript"></script>
<script type="text/javascript" src="Scripts/raphael-min.js"></script>

<script type="text/javascript">
   var drawingModule = (function () {
      var paper;
      var drawing = $.connection.drawingHub;

      drawing.drawIt = function (x, y) {
         paper.text(x, y, 'you clicked here');
      };


      $.connection.hub.start();

      var setupEvents = function () {
         var clickBox = paper.rect(0, 0, 500, 500).attr({ fill: 'blue', 'fill-opacity': 0 });

         clickBox.click(function (e) {
            drawing.sendIt(e.offsetX, e.offsetY);
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