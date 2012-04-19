<%@ Page Title="" Language="C#" MasterPageFile="~/Base.Master" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="JingR.Default" %>
<asp:Content ID="head" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="body" ContentPlaceHolderID="Body" runat="server">
   <a id="clicker" href="#">Click Me</a>
   <div id="paper"></div>
</asp:Content>
<asp:Content ID="scripts" ContentPlaceHolderID="Scripts" runat="server">
<script type="text/javascript" src="Scripts/jquery.signalR.min.js"></script>
<script src="/signalr/hubs" type="text/javascript"></script>
<script type="text/javascript" src="Scripts/raphael-min.js"></script>

<script type="text/javascript">
   var drawingModule = (function () {
      var paper;
      var drawing = $.connection.draw;

      drawing.drawIt = function (points) {
         paper.text(10, 10, points);
      };


      $.connection.hub.start();

      var setupEvents = function () {
         var clickBox = paper.rect(0, 0, 500, 500).attr({fill:'blue', 'fill-opacity': 0});

         clickBox.click(function () {
            drawing.sendIt("1,2");
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
      var c = paper.rect(40, 40, 50, 50, 10);

      drawingModule.init(paper);
   });
</script>
</asp:Content>