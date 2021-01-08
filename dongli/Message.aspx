<%@ Register TagPrefix="dl" TagName="DLHeader" Src="Header.ascx" %>
<%@ Register TagPrefix="dl" TagName="DLFooter" Src="Footer.ascx" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Message.aspx.cs" Inherits="Message" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<!DOCTYPE html>
<html>
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>东黎绒毛制品有限公司--留言板</title>
    <link type="text/css" href="css/reset.css" rel="stylesheet">
    <link type="text/css" href="css/style.css" rel="stylesheet">
    <style type="text/css">
        #a1{margin:auto;}
    </style>
</head>
<body>
    <dl:DLHeader runat="server" />
    <div class="lunbo" style="height:474px;background-color:#fcf5e0 ">
        <div class="boxOne_">
        </div>
        <div class="boxTwo">
            <form action="api.aspx?m=SYS_CM_USERS&action=addMessage" method="post" class="basic-grey" onsubmit="return check(this);">

                <label>
                    <span>您的姓名 :</span>
                    <input id="name" type="text" name="name" placeholder="您的姓名" />
                </label>
                <label>
                    <span>联系电话 :</span>
                    <input id="mobile" type="text" name="mobile" placeholder="联系电话" />
                </label>
                <label>
                    <span>电子邮件 :</span>
                    <input id="url" type="text" name="url" placeholder="电子邮件" />
                </label>
                <label>
                    <span>留言内容 :</span>
                    <textarea id="note" name="note" placeholder="写下您的留言内容"></textarea>
                </label>
                <label>
                    <span>验证码 :</span>
                    <input id="yzm" type="yzm" name="yzm" placeholder="验证码" style="float: left"/>
                    <span style="float: left"><img src="images/yzm.jpg"> </span>
                    <a href="javascript:;" class="aHref">看不清，再来一张</a>
                    <div style="clear:both;"></div>
                </label>
                <label>
                    <span>&nbsp;</span>
                    <input type="submit" class="button" value="提交" />
                </label>
            </form>
       </div>
    </div>
    <dl:DLFooter runat="server" />
    <script type="text/javascript">
        function check(form)
        {
            var elements = new Array();
            var tagElements = form.getElementsByTagName('input');
            for (var j = 0; j < tagElements.length; j++) {
                var _value = tagElements[j].value;
                if (!_value) {
                    alert('请填写表单数据!');
                    return false;
                }
            }
            alert("提交成功, 请稍后!");
            return true;
        }
    </script>
</body>
</html>
