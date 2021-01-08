<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Brand.aspx.cs" Inherits="Brand" %>
<%@ Register TagPrefix="dl" TagName="DLHeader" Src="Header.ascx" %>
<%@ Register TagPrefix="dl" TagName="DLFooter" Src="Footer.ascx" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>东黎绒毛制品有限公司--品牌与产品</title>
    <link type="text/css" href="css/reset.css" rel="stylesheet">
    <link type="text/css" href="css/style.css" rel="stylesheet">
    <style type="text/css">
        #a1{margin:auto;}
    </style>
</head>
<body>
    <dl:DLHeader runat="server" />
    <div class="lunbo">
       <div class="brandDiv">
           <ul id="nav1" class="nav1 clearfix" >
               <li class="nLi on" style="margin:10px 0;">
                   <h3><a href="javascript:;" class="subb subImg1" tid="772"></a></h3>
                   <ul class="sub sub0" style="display: block">
                       <li><a href="#">私人高端定制</a></li>
                   </ul>
               </li>

               <li class="nLi">
                   <h3>
                       <a href="javascript:;" class="subb subImg2" tid="773"></a>
                       <ul class="sub sub1">
                           <li><a href="#">品牌东黎</a></li>
                       </ul>
                   </h3>
               </li>
               <li class="nLi">
                   <!-- 假设当前频道为“预告片”，手动或后台程序添加titOnClassName类名（默认是'on'），相当于设置参数defaultIndex:1。若同时设置参数returnDefault:true，则鼠标移走后0.3秒返回当前频道 -->
                   <h3>
                       <a href="javascript:;" class="subb subImg3" tid="774"></a>
                       <ul class="sub sub2">
                           <li><a href="#">活力东黎</a></li>
                       </ul>
                   </h3>
               </li>
               <li class="nLi">
                   <h3>
                       <a href="javascript:;" class="subb subImg4" tid="775"></a>
                       <ul class="sub sub3">
                           <li><a href="#">东黎童装</a></li>
                       </ul>
                   </h3>
               </li>

           </ul>
           <ul id="conDiv">
               <li tid="776"><a><span class="sp1"><img  src="images/nz.png"></span></a> </li>
               <li tid="777"><a><span class="sp1"><img src="images/manz.png"></span></a> </li>
               <li tid="778"><a><span class="sp1"><img src="images/wj.png"></span></a> </li>
               <li tid="779"><a><span class="sp1"><img  src="images/other.png"></span></a> </li>
           </ul>
       </div>
    </div>
    <dl:DLFooter runat="server" />
    <script id="jsID" type="text/javascript">
        var _t1 = 772;
        $('#nav1 .nLi').click(function (i, elem) {
            var index = $(this).index();
            $('#nav1 .nLi').removeClass('on');
            $(this).addClass('on');
            $('.nLi ul').hide();
            $(this).find('ul').show();
            _t1 = i.target.getAttribute('tid');
        });

        $('#conDiv a').click(function (j) {
            var _t2 = findLi(j.target).getAttribute('tid');
            var _url = "BrandList.aspx?t2=" + _t2 + "&t1=" + _t1;
            window.location.href = _url;
        });

        function findLi(target) {
            if (target) {
                if (target && target.tagName == 'LI') {
                    return target;
                } else {
                    return findLi(target.parentNode);
                }
            }
        }
</script>
</body>
</html>
