<%@ Page Title="" Language="C#" MasterPageFile="~/Base.Master" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="JingR.Default" %>
<asp:Content ID="head" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="body" ContentPlaceHolderID="Body" runat="server">
   <a id="clicker" href="#">Click Me</a>
</asp:Content>
<asp:Content ID="scripts" ContentPlaceHolderID="Scripts" runat="server">
<script type="text/javascript" src="Scripts/jquery.signalR.min.js"></script>
<script src="/signalr/hubs" type="text/javascript"></script>
<script type="text/javascript" src="Scripts/raphael.js"></script>

<script type="text/javascript">
   $(function () {
      var drawing = $.connection.draw;

      drawing.drawIt = function (points) {
         alert(points);
      };

      $('#clicker').click(function () {
         drawing.sendIt("1,2");
      });

      $.connection.hub.start();
   });
</script>
</asp:Content>