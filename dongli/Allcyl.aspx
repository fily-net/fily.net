<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Allcyl.aspx.cs" Inherits="Allcyl" %>

<%@ Register TagPrefix="dl" TagName="DLHeader" Src="Header.ascx" %>
<%@ Register TagPrefix="dl" TagName="DLFooter" Src="Footer.ascx" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>东黎绒毛制品有限公司--全产业链</title>
    <link type="text/css" href="css/reset.css" rel="stylesheet">
    <link type="text/css" href="css/style.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="css/slide.css">
    <style type="text/css">
       .maskDiv{position: absolute;display:none;width:100%;height: 100%;top:0;bottom:0;left:0;right:0;background-color: #000;  filter:alpha(opacity=68);
           -moz-opacity:0.68;
           -khtml-opacity: 0.68;
           opacity: 0.68;
           z-index: 100000001;
       }
        .vedioDiv{display:none;width:844px;height: 474px; position: absolute;top:50%;left:50%;margin-left:-422px;margin-top:-237px;border:1px solid #000000;z-index: 100000001;background-color: #000;}
    </style>
</head>
<body>
    <div class="maskDiv"></div>
    <div id="a1" class="vedioDiv"></div>
    <dl:DLHeader runat="server" />
    <div class="lunbo" style="height: 474px;">
        <div>
            <div id="show" rel="autoPlay">
                <div class="img">
                  <span>
                      <asp:Repeater ID="ImageList" runat="server">
                        <ItemTemplate>
                            <a href="javascript:;" data-vedio="<%# Fily.Util.Filter.refilterStr(Eval("videoUrl").ToString()) %>" target="_blank"><img style="width:960px;height:320px;" src="uploads/docmg/<%# Fily.Util.Filter.refilterStr(Eval("sysName").ToString()) %>.<%# Fily.Util.Filter.refilterStr(Eval("extName").ToString()) %>" /></a>
                        </ItemTemplate>
                    </asp:Repeater>
                  </span>
                    <div class="masks mk1"></div>
                    <div class="masks mk2"></div>
                </div>
            </div>
        </div>
    </div>
    <dl:DLFooter runat="server" />
    <script src="js/slide.js"></script>
<script type="text/javascript" src="ckplayer/ckplayer.js" charset="utf-8"></script>
<script type="text/javascript">
    $.fn.ckplayer = function (options) {
        var defaults = {
            img: 'images/ad.jpg',
            vedio: 'http://www.zhichengcg.com/test/20150825dongliProject/sm.mp4'
        };
        var opts = $.extend(defaults, options);
        var flashvars = {
            p: 0,
            e: 1,
            i: opts.img,//初始图片地址
            hl: opts.vedio,
            ht: '20',
            hr: '',
            loaded: 'loadedHandler'//当播放器加载完成后发送该js函数loaded
        };
        return this.each(function () {
            var video = [opts.vedio + '->video/mp4', 'http://www.ckplayer.com/webm/0.webm->video/webm', 'http://www.ckplayer.com/webm/0.ogv->video/ogg'];
            var support = ['all'];
            CKobject.embedHTML5('a1', 'ckplayer_a1', 844, 474, video, flashvars, support);
            CKobject.getObjectById('ckplayer_a1').changeFace(true);
        })
    }

    function loadedHandler() {
        if (CKobject.getObjectById('ckplayer_a1').getType()) {//说明使用html5播放器
            //alert("加载完成");
            //dis();
        }
        else {
            alert('播放器已加载，调用的是Flash播放模块');
        }
    }









</script>
<script type="text/javascript">
    (function () {
        $('.img a').click(function (event) {
            event.stopPropagation();
            if (!$(this).attr("data-vedio").toString()) {
                   $('.maskDiv').fadeIn(80);
                       //alert($(this).find('img').attr('src'));
                       $('#a1').fadeIn(100).append("<img src='"+$(this).find('img').attr('src')+"' width='100%'>");
                       $('#a1').height($('#a1 img').height())
            } else {
                //alert(typeof ($(this).attr("data-vedio"))+"11");
                var urlVedio = $(this).attr("data-vedio");
                $('.maskDiv').fadeIn(80);
                $('#a1').fadeIn(100).ckplayer({
                    img: 'images/ad.jpg',
                    vedio: urlVedio + '?' + Math.random()
                });
            }
        })

        $(document).click(function (event) {
            event.stopPropagation();
            $('#a1').fadeOut(1000).empty();
            $('.maskDiv').fadeOut(80);
        })
    })();
</script>
</body>
</html>