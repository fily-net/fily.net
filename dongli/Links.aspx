<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Links.aspx.cs" Inherits="Home" %>
<%@ outputcache Duration="5" VaryByParam="*" %>

<!DOCTYPE html>
<html>
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
    <div>
        <div>合作伙伴</div>
        <asp:DataList ID="Companys" runat="server">
            <HeaderTemplate><ul></HeaderTemplate>
            <ItemTemplate>
                <li><%# Eval("title") %></li>
            </ItemTemplate>
            <FooterTemplate></ul></FooterTemplate>
        </asp:DataList>
        <div>友情链接</div>
        <asp:DataList ID="Links" runat="server">
            <HeaderTemplate><ul></HeaderTemplate>
            <ItemTemplate>
                <li><%# Eval("title") %></li>
            </ItemTemplate>
            <FooterTemplate></ul></FooterTemplate>
        </asp:DataList>
    </div>
</body>
</html>
