<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Videos.aspx.cs" Inherits="Home" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<!DOCTYPE html>
<html>
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
    <div>
        <div>文件服务器路径：uploads/docmg/</div>
        <div>文件字段：id, pid, nodeName, sysName, extName, origName, catelog, size, type, link, note</div>
        <div>轮播图片列表</div>
        <asp:DataList ID="Pictures" runat="server">
            <HeaderTemplate><ul></HeaderTemplate>
            <ItemTemplate>
                <li>
                    <a href="<%# Eval("link") %>">
                        <img src="uploads/docmg/<%# Eval("sysName") %>.<%# Eval("extName") %>" />
                    </a>
            </ItemTemplate>
            <FooterTemplate></ul></FooterTemplate>
        </asp:DataList>


        <!--
        <div>视频列表</div>
        <asp:DataList ID="Videos" runat="server">
            <HeaderTemplate><ul></HeaderTemplate>
            <ItemTemplate>
                <li>
                    <a href="<%# Eval("link") %>">
                        <img src="uploads/docmg/<%# Eval("sysName") %>.<%# Eval("extName") %>" />
                    </a>
                </li>
            </ItemTemplate>
            <FooterTemplate></ul></FooterTemplate>
        </asp:DataList>
            -->


        <div>视频列表</div>
        <form runat="server">
            <asp:Menu runat="server" ID="Test" />
        </form>
    </div>
</body>
</html>
