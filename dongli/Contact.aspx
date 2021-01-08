<%@ Register TagPrefix="dl" TagName="DLHeader" Src="Header.ascx" %>
<%@ Register TagPrefix="dl" TagName="DLFooter" Src="Footer.ascx" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Contact.aspx.cs" Inherits="Contact" %>
<!DOCTYPE html>
<html>
<head lang="ch" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>东黎绒毛制品有限公司--联系我们</title>
    <link type="text/css" href="css/reset.css" rel="stylesheet">
    <link type="text/css" href="css/style.css" rel="stylesheet">
    <script type="text/javascript" src="http://api.map.baidu.com/api?key=&v=1.1&services=true"></script>
</head>
<body>
    <dl:DLHeader runat="server" ID="header" />
    <div class="lunbo">
        <div class="cUs">
          <ul class="ulUs">
              <!--
              <li>赤峰东荣集团</li>
              <li>电话:(86)476-8867777/886888</li>
              <li>传真:(86)476-8867666</li>
              <li>邮箱:dongrong@dongronggroup.com</li>
              <li>地址:内蒙古赤峰市红山经济卡发区东荣路一号</li>
              <li>网址:http://www.dongronggroup.com</li>
                  -->
              <li><asp:Label ID="CompanyName" runat="server" Text="公司名"></asp:Label></li>
              <li><span>电话：</span><asp:Label ID="Phone" runat="server" Text="地址"></asp:Label></li>
              <li><span>传真：</span><asp:Label ID="Fax" runat="server" Text="传真"></asp:Label></li>
              <li><span>邮箱：</span><asp:Label ID="Eamil" runat="server" Text="传真"></asp:Label></li>
              <li><span>地址：</span><asp:Label ID="Address" runat="server" Text="地址"></asp:Label></li>
              <li><span>网址：</span><asp:Label ID="Website" runat="server" Text="传真"></asp:Label></li>
              <li><img ID="Code" runat="server" /> </li>
          </ul>
            <ul>
            
            </ul>
          <div class="bduMap">
              <div id="dituContent" style="width:717px;height: 452px;border:1px solid #ccc;" ></div>
          </div>
        </div>
    </div>
    <dl:DLFooter runat="server" />
    <script type="text/javascript">
        //创建和初始化地图函数：
        function initMap() {
            createMap();//创建地图
            setMapEvent();//设置地图事件
            addMapControl();//向地图添加控件
            addMarker();//向地图中添加marker
        }

        //创建地图函数：
        function createMap() {
            var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
            var point = new BMap.Point(118.987959, 42.29353);//定义一个中心点坐标
            map.centerAndZoom(point, 13);//设定地图的中心点和坐标并将地图显示在地图容器中
            window.map = map;//将map变量存储在全局
        }

        //地图事件设置函数：
        function setMapEvent() {
            map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
            map.enableScrollWheelZoom();//启用地图滚轮放大缩小
            map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
            map.enableKeyboard();//启用键盘上下左右键移动地图
        }

        //地图控件添加函数：
        function addMapControl() {
            //向地图中添加缩放控件
            var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE });
            map.addControl(ctrl_nav);
            //向地图中添加缩略图控件
            var ctrl_ove = new BMap.OverviewMapControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1 });
            map.addControl(ctrl_ove);
            //向地图中添加比例尺控件
            var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
            map.addControl(ctrl_sca);
        }

        //标注点数组
        var markerArr = [{ title: "内蒙古赤峰东荣集团", content: "内蒙古赤峰市红山经济开发区东荣路一号", point: "118.985228|42.295024", isOpen: 1, icon: { w: 23, h: 25, l: 46, t: 21, x: 9, lb: 12 } }
        ];
        //创建marker
        function addMarker() {
            for (var i = 0; i < markerArr.length; i++) {
                var json = markerArr[i];
                var p0 = json.point.split("|")[0];
                var p1 = json.point.split("|")[1];
                var point = new BMap.Point(p0, p1);
                var iconImg = createIcon(json.icon);
                var marker = new BMap.Marker(point, { icon: iconImg });
                var iw = createInfoWindow(i);
                var label = new BMap.Label(json.title, { "offset": new BMap.Size(json.icon.lb - json.icon.x + 10, -20) });
                marker.setLabel(label);
                map.addOverlay(marker);
                label.setStyle({
                    borderColor: "#808080",
                    color: "#333",
                    cursor: "pointer"
                });

                (function () {
                    var index = i;
                    var _iw = createInfoWindow(i);
                    var _marker = marker;
                    _marker.addEventListener("click", function () {
                        this.openInfoWindow(_iw);
                    });
                    _iw.addEventListener("open", function () {
                        _marker.getLabel().hide();
                    })
                    _iw.addEventListener("close", function () {
                        _marker.getLabel().show();
                    })
                    label.addEventListener("click", function () {
                        _marker.openInfoWindow(_iw);
                    })
                    if (!!json.isOpen) {
                        label.hide();
                        _marker.openInfoWindow(_iw);
                    }
                })()
            }
        }
        //创建InfoWindow
        function createInfoWindow(i) {
            var json = markerArr[i];
            var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>" + json.content + "</div>");
            return iw;
        }
        //创建一个Icon
        function createIcon(json) {
            var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w, json.h), { imageOffset: new BMap.Size(-json.l, -json.t), infoWindowOffset: new BMap.Size(json.lb + 5, 1), offset: new BMap.Size(json.x, json.h) })
            return icon;
        }

        initMap();//创建和初始化地图
    </script>
</body>
</html>