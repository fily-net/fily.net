<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ZiXun.aspx.cs" Inherits="ZiXun" %>
<%@ Register TagPrefix="dl" TagName="DLHeader" Src="Header.ascx" %>
<%@ Register TagPrefix="dl" TagName="DLFooter" Src="Footer.ascx" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>东黎绒毛制品有限公司--咨询动态</title>
    <link type="text/css" href="css/reset.css" rel="stylesheet">
    <link type="text/css" href="css/style.css" rel="stylesheet">
    <style type="text/css">
        #a1{margin:auto;}
    </style>
</head>
<body>
    <dl:DLHeader runat="server" />
    <div class="lunbo" style="height:474px;background-color:#fcf5e0 ">
        <div class="boxOne">
        </div>
        <div class="boxTwo">
            <div class="slideTxtBox" style="height: 360px;">
                <div class="hd">
                    <ul>
                        <li class="on"><a href="javascript:;"  class="li0"></a> </li>
                        <li><a href="javascript:;"  class="li1"></a> </li>
                    </ul>
                </div>
                <div class="bd">
                    <ul id="gongsixinwen" style="display: none;">
                        <asp:Repeater ID="GongSiXinWen" runat="server">
                            <ItemTemplate>
                                <li><span class="date"><%# Eval("cTime") %></span><a href="ZiXunDetail.aspx?zxid=<%# Eval("id") %>" target="_blank"><%# Fily.Util.Filter.refilterStr(Eval("title").ToString()) %></a></li>
                            </ItemTemplate>
                        </asp:Repeater>
                    </ul>
                    <ul id="meitixinwen" style="display: block;">
                        <asp:Repeater ID="MeiTiXinWen" runat="server">
                            <ItemTemplate>
                                <li><span class="date"><%# Eval("cTime") %></span><a href="ZiXunDetail.aspx?zxid=<%# Eval("id") %>" target="_blank"><%# Fily.Util.Filter.refilterStr(Eval("title").ToString()) %></a></li>
                            </ItemTemplate>
                        </asp:Repeater>
                    </ul>
                </div>
                <ul id="pagination-digg">
                    <li class="previous-off" onclick="javascript:goPre();"><a href="javascript:;">上一页</a></li>
                    <li class="next_" onclick="javascript:goNext();"><a href="javascript:;" >下一页</a></li>
                </ul>
            </div>
       </div>
    </div>
    <dl:DLFooter runat="server" />
    <script id="jsID" type="text/javascript">
        var _gongsixinwen = jQuery("#gongsixinwen"),
            _meitixinwen = jQuery("#meitixinwen"),
            _gsIndex = 1, 
            _mtIndex = 1, 
            _gsMax = 0,
            _mtMax = 0;

       // console.log(_gongsixinwen);

        jQuery(".slideTxtBox").slide({
            trigger: "click"
        });

        function goPre(){
            if (_gongsixinwen.css('display') == 'block') {
                if (_gsIndex == 1) {
                    alert('已经是第一页了哦！');
                    return;
                } else {
                    _gsIndex = _gsIndex - 1;
                    if (_gsIndex < 1) { _gsIndex = 1; }
                    loadZiXun(_gsIndex, '767', function (data) {
                        _gongsixinwen[0].innerHTML = data;
                    });
                }
            } else {
                if (_mtIndex == 1) {
                    alert('已经是第一页了哦！');
                    return;
                } else {
                    _mtIndex = _mtIndex - 1;
                    if (_mtIndex < 1) { _mtIndex = 1; }
                    loadZiXun(_mtIndex, '768', function (data) {
                        _meitixinwen[0].innerHTML = data;
                    });
                }
            }
        }

        function goNext(){
            if (_gongsixinwen.css('display') == 'block') {
                if (_gsIndex == _gsMax) {
                    alert('已经是最后一页了哦！');
                    return;
                } else {
                    _gsIndex = _gsIndex + 1;
                    if (_gsIndex > _gsMax) { _gsIndex = _gsMax; }
                    loadZiXun(_gsIndex, '767', function (data) {
                        //console.log(data);
                        _gongsixinwen[0].innerHTML = data;
                    });
                }
            } else {
                if (_mtIndex == _mtMax) {
                    alert('已经是最后一页了哦！');
                    return;
                } else {
                    _mtIndex = _mtIndex + 1;
                    if (_mtIndex > _mtMax) { _mtIndex = _mtMax; }
                    loadZiXun(_mtIndex, '768', function (data) {
                        _meitixinwen[0].innerHTML = data;
                    });
                }
            }
        }

        function loadZiXun(pageIndex, type, callback) {
            jQuery.ajax({
                url: 'api.aspx?m=SYS_TABLE_BASE&table=DL_NEWS&action=pagingForList&jsonCondition={"type": "'+type+'"}&pageIndex='+pageIndex+'&dataType=json',
                success: function (data) {
                    var _dataAry = data.split('\u0003'), arr = [];
                    _dataAry = eval(_dataAry[1]);
                    if (_dataAry) {
                        var _str = '';
                        var _item = null;
                        for (var i = 0, _len = _dataAry.length; i < _len; i++){
                            _item = _dataAry[i];
                            _str += '<li><span class="date">'+_item.cTime+'</span><a href="ZiXunDetail.aspx?zxid='+_item.id+'" target="_blank">'+_item.title+'</a></li>';
                        }
                        callback(_str);
                    } else {
                        alert('已经是最后一页了');
                    }
                    
                }
            });
        }
    </script>
</body>
</html>
