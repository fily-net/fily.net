<%@ Control Language="C#" AutoEventWireup="true" CodeFile="Header.ascx.cs" Inherits="Header" %>

<!--
<div class="header">
    <div class="chDiv">
        <a href="#"><span>Chinese</span></a>
        <a><span>|</span></a>
        <a href="#"><span>English</span></a>
    </div>

    <ul id="nav" class="nav clearfix">
        <asp:Repeater ID="MenuList" runat="server">
            <ItemTemplate>
                <li class="nLi">
                    <h3><a class="<%# Eval("note") %>" href="<%# Fily.Util.Filter.refilterStr(Eval("url").ToString()) %>"><%# Fily.Util.Filter.refilterStr(Eval("nodeName").ToString()) %></a></h3>
                </li>
            </ItemTemplate>
        </asp:Repeater>
    </ul>
</div>
    -->


<div class="header">
    <div class="chDiv">
        <a href="#"><span>Chinese</span></a>
        <a><span>|</span></a>
        <a href="#"><span>English</span></a>
    </div>

    <ul id="nav" class="nav clearfix">
        
                <li class="nLi">
                    <h3><a class="subb" href="Index.aspx">首页</a></h3>
                </li>
            
                <li class="nLi">
                    <h3>
                        <a class="subb">关于我们</a>
                        <!--
                        <ul class="sub">
                            <li><a href="gsjj_01.html">公司介绍</a></li>
                            <li><a href="qywh_02.html">企业文化</a></li>
                            <li><a href="gsry_03.html">公司荣誉</a></li>
                            <li><a href="cpjj_04.html">产品介绍</a></li>
                            <li><a href="qybz_05.html">质量保证</a></li>
                        </ul>-->
                        <ul class="sub">
                            <li><a href="About.aspx?wm=1">公司介绍</a></li>
                            <li><a href="About.aspx?wm=2">企业文化</a></li>
                            <li><a href="About.aspx?wm=3">公司荣誉</a></li>
                            <li><a href="About.aspx?wm=4">产品介绍</a></li>
                            <li><a href="About.aspx?wm=5">质量保证</a></li>
                        </ul>
                    </h3>
                </li>
            
                <li class="nLi">
                    <h3><a class="subb" href="Brand.aspx">品牌与产品</a></h3>
                </li>
            
                <li class="nLi">
                    <h3><a class="subb" href="Media.aspx">媒体播放</a></h3>
                </li>
            
                <li class="nLi">
                    <h3><a class="uno" href=""><img src="images/logo.png"></a></h3>
                </li>
            
                <li class="nLi">
                    <h3><a class="subb" href="ZiXun.aspx">资讯动态</a></h3>
                </li>
            
                <li class="nLi">
                    <h3><a class="subb" href="Message.aspx">留言板</a></h3>
                </li>
            
                <li class="nLi">
                    <h3><a class="subb" href="Alink.aspx">网上商城</a></h3>
                </li>
            
                <li class="nLi">
                    <h3><a class="subb" href="Contact.aspx">联系我们</a></h3>
                </li>
            
    </ul>
</div>

<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/jquery.SuperSlide.2.1.1.js"></script>
<script id="jsID" type="text/javascript">
    jQuery("#nav").slide({
        type: "menu",// 效果类型，针对菜单/导航而引入的参数（默认slide）
        titCell: ".nLi", //鼠标触发对象
        targetCell: ".sub", //titCell里面包含的要显示/消失的对象
        effect: "slideDown", //targetCell下拉效果
        delayTime: 300, //效果时间
        triggerTime: 0, //鼠标延迟触发时间（默认150）
        returnDefault: true //鼠标移走后返回默认状态，例如默认频道是“预告片”，鼠标移走后会返回“预告片”（默认false）
    });
</script>