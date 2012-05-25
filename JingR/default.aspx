<%@ Page Title="" Language="C#" MasterPageFile="~/Base.Master" AutoEventWireup="true"
   CodeBehind="default.aspx.cs" Inherits="JingR.Default" %>

<asp:Content ID="head" ContentPlaceHolderID="head" runat="server">
   <link href="Content/jingr.css" rel="stylesheet" type="text/css" />
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
               </ul>
            </div>
         </div>
      </div>
   </div>
   <div class="container">
      <div class="row-fluid">
         <div id="js-paper" style="width: 500px; height: 500px;">
         </div>
      </div>
      <div class="row-fluid">
         <div class="span2">
            <a id="js-loadImage" class="btn" href="#loadImageModal" data-toggle="modal">Load Image…</a>
         </div>
         <div id="js-buttons" class="span10 form-horizontal">
            <label class="control-label">
               Draw:</label>
            <div id="drawingType" class="btn-group inline controls" data-toggle="buttons-radio">
               <button class="btn active" data-type="arrow">Arrow</button>
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
         <input type="text" class="span3" placeholder="Url to image" value="http://localhost:61839/content/images/lighthouse.jpg">
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
   <script type="text/javascript" src="Scripts/raphael-min.js"></script>
   <script src="Scripts/custom/drawingmodule.js" type="text/javascript"></script>
   <script type="text/javascript">
      $(function () {
         var paper = Raphael("js-paper", 500, 500);

         drawingModule.init(paper);
      });
   </script>
</asp:Content>
