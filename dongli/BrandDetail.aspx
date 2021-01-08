<%@ Page Language="C#" AutoEventWireup="true" CodeFile="BrandDetail.aspx.cs" Inherits="BrandDetail" %>
<%@ Register TagPrefix="dl" TagName="DLHeader" Src="Header.ascx" %>
<%@ Register TagPrefix="dl" TagName="DLFooter" Src="Footer.ascx" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>东黎绒毛制品有限公司--品牌与产品详细页</title>
    <link type="text/css" href="css/reset.css" rel="stylesheet">
    <link type="text/css" href="css/style.css" rel="stylesheet">
    <style type="text/css">
        #a1{margin:auto;}
    </style>
</head>
<body>
    <dl:DLHeader runat="server" />
    <div class="lunbo" style="background-color: #fff;">
       <div class="brandDiv1">
          <div class="menu"><a id="Back" runat="server"></a> <span class="menus"><asp:Label ID="Title" runat="server" Text="私人定制-女装"></asp:Label></span></div>
           <div class="infoDiv">
            <ul class="info0">
                <li>
                    <div>
                        <p class="typeNum"><span>S</span><span>M</span><span>L</span><span>XL</span></p>
                        <p class="typeNum1" id="Guige" runat="server"></p>
                        <p class="typeNum2"><span>Baby</span><span>Cashmere</span><span>Storm</span></p>
                        <p class="typeNum3"><span>System®</span></p>
                    </div>
                </li>
            </ul>
           </div>
           <div class="cont">
              <a href="#" class="btnl"></a>
              <a href="#" class="btnr"></a>
              <div class="cloths">
                <ul id="clothsBig">
                    <li><img id="Big1" runat="server" /></li>
                    <li><img id="Big2" runat="server" /></li>
                    <li><img id="Big3" runat="server" /></li>
                    <li><img id="Big4" runat="server" /></li>
                    <li><img id="Big5" runat="server" /></li>
                </ul>
              </div>
           </div>
           <div class="infoDiv1">
               <ul class="info1">
                   <li>
                        <div>
                            <p id="Note" runat="server"></p>
                        </div>
                    </li>
                </ul>
           </div>
       </div>

    </div>
    <div class="content1">
        <div class="conD" style="width:500px;overflow:hidden;height:166px;">
            <ul class="ulList" style="width:500px;overflow:hidden;">
                <li><img id="Small1" runat="server" /></li>
                <li><img id="Small2" runat="server" /></li>
                <li><img id="Small3" runat="server" /></li>
                <li><img id="Small4" runat="server" /></li>
                <li><img id="Small5" runat="server" /></li>
            </ul>
        </div>
    </div>
    <dl:DLFooter runat="server" />

    <script type="text/javascript">
        $(window).load(function () {
            var total = $('#clothsBig li').length;
            var iNowtt = 0;
            var iNow = 1;
            var iNow2 = 2;
            var iNow3 = total - 1;
            var bool = true;
            var liWidth1 = $('#clothsBig li').eq(0).width();
            var liWidth2 = $('.ulList li').eq(0).width();

            $('#clothsBig').css({ 'width': total * liWidth1 + 'px', 'left': 0, 'position': 'absolute' });
            $('.ulList').css({ 'width': total * (liWidth2) + 'px', 'left': 0, 'position': 'absolute' });

            function getWidth() {
                $('#clothsBig').css({
                    'position': 'absolute',
                    'width': $('#clothsBig li').length * liWidth1 + 'px'
                })
                $('.ulList').css({
                    'position': 'absolute',
                    'width': $('.ulList li').length * (liWidth2) + 'px'
                });

            }
            getWidth();
            $('.btnr').click(function () {
                //alert("左");
                if (bool) {
                    bool = false;
                    for (var i = 0; i < iNow; i++) {
                        $('#clothsBig li').eq(i).clone(true).appendTo('#clothsBig');
                        $('.ulList li').eq(i).clone(true).appendTo('.ulList');

                        //getWidth();
                    }
                    $('#clothsBig').animate({
                        'left': -liWidth1 * iNow + 'px'
                    }, 500, function () {
                        for (var i = 0; i < iNow; i++) {
                            var $li = $('#clothsBig li').eq(0).remove();
                            $('#clothsBig').css({
                                'left': 0
                            })
                        }
                        bool = true;
                    });


                    iNowtt++;
                    //alert(iNowtt)
                    $('.ulList li').removeClass();
                    $('.ulList li').eq(iNow).addClass('on');
                    $('.ulList').animate({
                        'left': -(liWidth2 + 10) * iNow + 'px'
                    }, function () {
                        for (var i = 0; i < iNow; i++) {
                            var $li = $('.ulList li').eq(0).remove();
                            $('.ulList').css({
                                'left': 0
                            })
                        }
                        bool = true;
                    })
                }
            })
            $('.btnl').click(function () {
                if (bool) {
                    bool = false;
                    var oLength = $('#clothsBig li').length;
                    for (var i = 0; i < iNow; i++) {
                        var oLi = $('#clothsBig li').eq(oLength - 1).clone(true);
                        var oLi1 = $('.ulList li').eq(oLength - 1).clone(true);


                        oLi.insertBefore($('#clothsBig li').eq(0));
                        oLi1.insertBefore($('.ulList li').eq(0));


                        $('#clothsBig').css({
                            'left': ($('#clothsBig').position().left - $('#clothsBig li').eq(0).width()) + 'px'
                        });
                        $('.ulList').css({
                            'left': ($('.ulList').position().left - $('.ulList li').eq(0).width()) + 'px'
                        });

                        getWidth();
                    }

                    $('#clothsBig').animate({
                        'left': 0
                    }, 500, function () {
                        for (var i = 0; i < iNow; i++) {
                            $('#clothsBig li').eq(oLength).remove();
                        }
                        bool = true;
                    });


                    $('.ulList li').removeClass();
                    $('.ulList li').eq(0).addClass('on');
                    $('.ulList').animate({
                        'left': 0
                    }, function () {
                        for (var i = 0; i < iNow; i++) {
                            $('.ulList li').eq(oLength).remove();
                        }
                        bool = true;
                    })
                }
            })
        })
    </script>
</body>
</html>
