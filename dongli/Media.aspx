<%@ Register TagPrefix="dl" TagName="DLHeader" Src="Header.ascx" %>
<%@ Register TagPrefix="dl" TagName="DLFooter" Src="Footer.ascx" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Media.aspx.cs" Inherits="Media" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>东黎绒毛制品有限公司--播放媒体</title>
    <link type="text/css" href="css/reset.css" rel="stylesheet">
    <link type="text/css" href="css/style.css" rel="stylesheet">
    <style type="text/css">
        #a1{margin:auto;}
    </style>
    <style>
        .lunbo {
            background-image:url("images/bgImg.png");
            height:560px;
        }
        .box {
            width: 1000px;
            filter: alpha(opacity=68);
            -moz-opacity: 0.68;
            -khtml-opacity: 0.68;
            opacity: 0.68;
            position: absolute;
            top: 50%;
            margin-top: -180px;
            bottom: 0;
            height: 360px;
            left: 50%;
            margin-left: -500px;
            background-color: #fff;
            -webkit-box-shadow: 0 0 10px rgba(139, 128, 111, .5);
            -moz-box-shadow: 0 0 10px rgba(139, 128, 111, .5);
            box-shadow: 0 0 10px rgba(139, 128, 111, .5);
            overflow:hidden;
        }
        .box ul {
            list-style:none;
            transition: all 1s ease 0.5s;
        }
        .box ul > li{
            width: 1000px;
            height: 360px;
            float:left;
        }
        .box ul > li .title{
                width: 145px;
                height: 145px;
                float: left;
                margin: 20px;
                text-align: center;
                vertical-align: middle;
                font-size: 28px;
                border-radius: 50%;
                background-color: #ccc;
                line-height: 145px;
        }
        .box ul > li .note{
            width: 720px;
            height: 300px;
            float:left;
            margin: 20px;
            line-height:28px;
            font-size:20px;
            overflow:auto;
            text-indent:40px;
        }
    </style>
</head>
<body>
    <dl:DLHeader runat="server" />

    <div class="lunbo">
       <div class="mediaDiv">
           <div class="loading"><img src="images/loading.gif"> </div>
            <a id="goLeft" class="btnL"><img src="images/arr_l.png"> </a>
            <a id="goRight" class="btnR"><img src="images/arr_r.png"> </a>
            <div id="a1"></div>
       </div>
    </div>
    <dl:DLFooter runat="server" />
    

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
                var video = [
                    opts.vedio + '->video/mp4',
                    'http://www.ckplayer.com/webm/0.webm->video/webm',
                    'http://www.ckplayer.com/webm/0.ogv->video/ogg'
                ];
                var support = ['all'];
                CKobject.embedHTML5('a1', 'ckplayer_a1', 844, 474, video, flashvars, support);
                CKobject.getObjectById('ckplayer_a1').changeFace(true);
            })
        }
        var dis = function () {
            var loading = $('.loading');
            loading.fadeIn(2000, function () {
                loading.fadeOut(1000);
                //alert("加载完毕")
            })
        }
        function loadedHandler() {
            if (CKobject.getObjectById('ckplayer_a1').getType()) {//说明使用html5播放器
                //alert("加载完成");
                dis();
            }
            else {
                alert('播放器已加载，调用的是Flash播放模块');
            }
        }



        jQuery.ajax({
            url: 'api.aspx?m=SYS_TABLE_BASE&table=SYS_CM_FILES&action=getByCondition&jsonCondition={"pid": "221"}&dataType=json',
            success: function (data) {
                var _dataAry = data.split('\u0003'), arr = [];
                _dataAry = eval(_dataAry[1]);
                for (var i = 0, _len = _dataAry.length; i < _len; i++){
                    var _d = _dataAry[i];
                    arr.push({
                        img: _d.imageUrl,
                        vedio: ('uploads/'+_d.catelog+'/'+_d.sysName +'.'+_d.extName) ||  _d.videoUrl
                    });
                }

                        $('#a1').ckplayer({
                            img: 'images/ad.jpg',
                            vedio: arr[0].vedio + '?' + Math.random()
                        });

                var iNow = 0;
                var btnL = $('.btnL');
                var btnR = $('.btnR');
                btnL.click(function () {
                    iNow--;
                    if (iNow < 0) {
                        iNow = arr.length - 1;
                    }

                    console.log('click left: ', arr[iNow]);

                    $('#a1').ckplayer({
                        img: arr[iNow].img,
                        vedio: arr[iNow].vedio + '?' + Math.random()
                    });


                });
                btnR.click(function () {
                    iNow++;
                    if (iNow > arr.length - 1) {
                        iNow = 0;
                    }
                    console.log('click right: ', arr[iNow]);
                    $('#a1').ckplayer({
                        img: arr[iNow].img,
                        vedio: arr[iNow].vedio + '?' + Math.random()
                    });
                });


            }
        });

        /*
        var arr = [
            { img: 'images/ad.jpg', vedio: 'http://www.zhichengcg.com/test/20150825dongliProject/sm.mp4' },
            { img: 'images/ad1.jpg', vedio: 'http://www.zhichengcg.com/test/20150825dongliProject/sm.mp4' },
            { img: 'images/ad2.jpg', vedio: 'http://www.zhichengcg.com/test/20150825dongliProject/sm.mp4' }
        ];*/

    </script>

</body>
</html>
