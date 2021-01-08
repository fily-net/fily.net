<%@ Page Language="C#" AutoEventWireup="true" CodeFile="BrandList.aspx.cs" Inherits="BrandList" %>
<%@ Register TagPrefix="dl" TagName="DLHeader" Src="Header.ascx" %>
<%@ Register TagPrefix="dl" TagName="DLFooter" Src="Footer.ascx" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
     <title>东黎绒毛制品有限公司--品牌与产品列表页</title>
    <link type="text/css" href="css/reset.css" rel="stylesheet">
    <link type="text/css" href="css/style.css" rel="stylesheet">
    <link type="text/css" href="css/sly.css" rel="stylesheet">
    <style type="text/css">
        .ulListss{overflow:hidden;}
        .ulListss li{float:left;display:block;height: 261px;width:220px;border:1px solid red;}
        .divdiv a{float:left;}
    </style>
</head>
<body>
    <dl:DLHeader runat="server" />
    <div class="lunbo" style="background-color: #fff;">
       <div class="brandDiv">
          <div class="menu"><a href="Brand.aspx"></a><span class="menus" id="Title" runat="server">私人高端定制-男装</span></div>
           <div class="clothsList">
           <div id="content">
           <div id="sections" class="container">
           <div id="vertical" class="clearfix">
               <div class="slyWrap example2">
                   <div class="scrollbar">
                       <div class="handle" style="position: absolute; top: 0px; height: 154px;"></div>
                   </div>
                   <div class="sly" data-options="{ &quot;scrollBy&quot;: 90, &quot;startAt&quot;: 0 }" style="overflow: hidden; position: relative;">
                       <div style="position: absolute; top: 0px;">
                          <div class="divdiv">
                              <asp:Repeater ID="Images" runat="server">
                                <ItemTemplate>
                                    <a href="BrandDetail.aspx?detail=<%# Eval("id") %>&t2=<%# Eval("t2") %>&t1=<%# Eval("t1") %>">
                                        <img style="width:220px;height:261px;" src="<%# Fily.Util.Filter.refilterStr(Eval("preImage").ToString()) %>">
                                    </a>
                                </ItemTemplate>
                            </asp:Repeater>
                          </div>
                       </div>
                   </div>
                   <ul class="pages"><li class="active">1</li><li>2</li><li>3</li><li>4</li></ul>
               </div>


           </div><!--end:#vertical-->



           </div><!--end:#sections-->
           </div><!--end:#content-->
           </div>
       </div>
    </div>
    <dl:DLFooter runat="server" />
    <script src="js/sly/jquery.sly.js" defer="defer"></script>
    <script src="js/sly/plugins.js" defer="defer"></script>
    <script src="js/sly/main.js" defer="defer"></script>
</body>
</html>