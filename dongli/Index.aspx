<%@ Register TagPrefix="dl" TagName="DLHeader" Src="Header.ascx" %>
<%@ Register TagPrefix="dl" TagName="DLFooter" Src="Footer.ascx" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Index.aspx.cs" Inherits="Index" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>赤峰东黎绒毛制品有限公司--首页</title>
    <link type="text/css" href="css/reset.css" rel="stylesheet">
    <link type="text/css" href="css/style.css" rel="stylesheet">
    <link type="text/css" href="css/lrtk.css" rel="stylesheet">

</head>
<body>
    <dl:DLHeader runat="server" />
    <div class="lunbo">
         <div class="slide-main" id="touchMain">

        <div class="slide-box" id="slideContent">
            <a class="prev" href="javascript:;" stat="prev1001"><img src="images/l-btn.png" /></a>


            <asp:Repeater ID="MeiTiXinWen" runat="server">
                <ItemTemplate>
                    <div class="slide">
                        <a stat="sslink-<%#Eval("treeOrder") %>" href="<%# Fily.Util.Filter.refilterStr(Eval("url").ToString()) %>" target="_blank">
                            <img src="uploads/<%#Eval("catelog") %>/<%# Fily.Util.Filter.refilterStr(Eval("sysName").ToString()) %>.<%# Fily.Util.Filter.refilterStr(Eval("extName").ToString()) %>" width="100%">
                        </a>
                    </div>
                </ItemTemplate>
            </asp:Repeater>
            <a class="next" href="javascript:;" stat="next1002"><img src="images/r-btn.png" /></a>
            <div class="item">
                <asp:Repeater ID="MeiTiXinWen1" runat="server">
                    <ItemTemplate>
                        <a stat="item100<%#Eval("treeOrder") %>" href="javascript:;"></a>
                    </ItemTemplate>
                </asp:Repeater>
            </div>
<script type="text/javascript" src="js/lrtk.js"></script>
        </div>
    </div>
    </div>
    <dl:DLFooter runat="server" />
</body>
</html>
