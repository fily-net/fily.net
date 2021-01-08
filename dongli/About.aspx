<%@ Page Language="C#" AutoEventWireup="true" CodeFile="About.aspx.cs" Inherits="About" %>
<%@ Register TagPrefix="dl" TagName="DLHeader" Src="Header.ascx" %>
<%@ Register TagPrefix="dl" TagName="DLFooter" Src="Footer.ascx" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>赤峰东黎绒毛制品有限公司--关于我们</title>
    <link type="text/css" href="css/reset.css" rel="stylesheet">
    <link type="text/css" href="css/style.css" rel="stylesheet">
    <link rel="stylesheet" href="js/jScrollbar.jquery.css" type="text/css" />
    <style>
        body, p, div {
            word-wrap: break-word;
        }
        .lunbo {
            background-image:url("images/bgImg.png");
            height:560px;
        }
        .box {
            width: 1000px;
            filter: alpha(opacity=68);
            -moz-opacity: 0.88;
            -khtml-opacity: 0.88;
            opacity: 0.88;
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
                font-size: 30px;
                color:#fff;
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

        <div class="boxOne">
        </div>
        <div class="boxTwo">
           <div class="gsjs" id="Title" runat="server" ></div>
            <div class="jScrollbar3">
                <div class="jScrollbar_mask" id="Note" runat="server">
                </div>
                <div class="jScrollbar_draggable">
                    <a href="#" class="draggable"></a>
                </div>

                <div class="clr"></div>
            </div>
        </div>
    </div>    <dl:DLFooter runat="server" />
    <script type="text/javascript" src="js/jquery-4.js" defer="defer"></script>
    <script type="text/javascript" src="js/jquery.SuperSlide.2.1.1.js" defer="defer"></script>
    <script type="text/javascript" src="js/jquery-ui.js" defer="defer"></script>
    <script type="text/javascript" src="js/jquery-mousewheel.js" defer="defer"></script>
    <script type="text/javascript" src="js/jScrollbar.jquery.js" defer="defer"></script>
    <script type="text/javascript" defer="defer">
        $(document).ready(function () {
            $('.jScrollbar3').jScrollbar();
        });
    </script>
</body>
</html>