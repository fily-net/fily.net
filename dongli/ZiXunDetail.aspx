<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ZiXunDetail.aspx.cs" Inherits="ZiXunDetail" %>
<%@ Register TagPrefix="dl" TagName="DLHeader" Src="Header.ascx" %>
<%@ Register TagPrefix="dl" TagName="DLFooter" Src="Footer.ascx" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>东黎绒毛制品有限公司--新闻详细页</title>
    <link type="text/css" href="css/reset.css" rel="stylesheet">
    <link type="text/css" href="css/style.css" rel="stylesheet">
    <link rel="stylesheet" href="js/jScrollbar.jquery.css" type="text/css" />
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
                width: 100%;
                height: 45px;
                float: left;
                margin: 20px;
                text-align: center;
                vertical-align: middle;
                font-size: 28px;
               
                
                line-height: 45px;
                border-bottom:1px solid rgba(139, 128, 111, .5);
        }
        .box ul > li .note{
            width: 100%;
            height: 250px;
            float:left;
            line-height:28px;
            font-size:20px;
            overflow:auto;
            padding: 0px 20px;
            text-indent:40px;
        }

        .box ul > li .back{
            float:right;
            margin-right:50px;
        }
        .box ul > li .date{
            float:right;
            margin-right:50px;
            font-size:16px;
        }
    </style>
</head>
<body>
    <dl:DLHeader runat="server" />
    <div class="lunbo">
    <img src="images/bgImg.png" width="100%">
    <div class="boxOne">
    </div>
    <div class="boxTwo">

        <div class="jScrollbar3" style="width:1000px">
            <div class="jScrollbar_mask" style="width:920px;">
                <p class="titleDiv" id="Title" runat="server"></p><span class="back" style="float:right; margin-top:-30px;"><a href="ZiXun.aspx">返回</a></span>
                <p class="date"  id="CTime" runat="server"></p>
                <p id="Note" runat="server"></p>
            </div>

            <div class="jScrollbar_draggable">
                <a href="#" class="draggable"></a>
            </div>

            <div class="clr"></div>
        </div>
        </div>
    </div>
    <dl:DLFooter runat="server" />
    <script type="text/javascript" src="js/jquery-ui.js"></script>
    <script type="text/javascript" src="js/jquery-mousewheel.js"></script>
    <script type="text/javascript" src="js/jScrollbar.jquery.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            $('.jScrollbar3').jScrollbar();
        });
    </script>
</body>
</html>
