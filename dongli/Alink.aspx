<%@ Register TagPrefix="dl" TagName="DLHeader" Src="Header.ascx" %>
<%@ Register TagPrefix="dl" TagName="DLFooter" Src="Footer.ascx" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Alink.aspx.cs" Inherits="Alink" %>
<!DOCTYPE html>

<html>
<head lang="ch">
    <meta charset="UTF-8">
    <title>东黎绒毛制品有限公司--网上商城</title>
    <link type="text/css" href="css/reset.css" rel="stylesheet">
    <link type="text/css" href="css/style.css" rel="stylesheet">
    <style type="text/css">
        #a1{margin:auto;}
    </style>
</head>
<body>
    <dl:DLHeader runat="server" />
    <div class="lunbo" style="background-color: #fbfbfb">
       <ul class="Alinks">
           <asp:Repeater ID="MeiTiXinWen" runat="server">
                <ItemTemplate>
                    <li class="li_<%#Eval("title") %>"><a href="<%# Fily.Util.Filter.refilterStr(Eval("url").ToString()) %>"></a></li>
                </ItemTemplate>
            </asp:Repeater>
       </ul>
    </div>
    <dl:DLFooter runat="server" />
    <script type="text/javascript" src="ckplayer/ckplayer.js" charset="utf-8"></script>
</body>
</html>
