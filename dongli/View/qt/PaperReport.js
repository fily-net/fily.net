$.NameSpace('$View.qt');
$View.qt.PaperReport = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, paperId: 0 };
    var coms = {}, rootTips, eBody;
    var _html = '<div class="title"><div class="_title">{0}<span class="type t-{1}"></span></div></div><div class="content"><table class="dataintable"></table></div>';
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _tbAry = [{ text: '显示图标', name: 'showChart', skin: 'Button-blue', css: 'margin-top:2px;margin-right:15px;'}];
        var comArgs = { 'root': { head_h: 30, foot_h: 30, icon: 'icon-glyph-gift', cn: 'b0', toolBarAry: _tbAry, onToolBarClick: onToolBarClick} };
        var struct = { p: owner, type: 'Tips', name: 'root' }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        rootTips = coms.root; eBody = rootTips.body.cn('Waterfall').h('<ul class="ListItem"></ul>').fc();
        if (args.paperId) { loadData(); }
    }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'showChart':
                MTips.show('正在开发中...');
                break;
        }
    }

    function loadData() {
        eBody.h('<div style="padding:20px;z-index:20;text-align:center;"><img src="images/loading/gif/loading51.gif" /></div>');
        $.Util.ajax({
            args: 'm=SYS_CM_OA&action=loadPaperAllTopicsReport&paperId=' + args.paperId + '&dataType=json',
            onSuccess: function (d) {
                var _dAry = eval(d.get(0)), _dLen = _dAry.length, _info = $.JSON.decode(d.get(1) || '{}');
                rootTips.setTitle('<font class="fwb c_6">' + _info.nodeName + '</font>的报表');
                if (!_dLen) { eBody.h('<div style="padding:20px;text-align:center;"><img src="images/EmptyData.gif"></div>'); } else { eBody.h(''); };
                new $.UI.FormItem({ p: eBody.adElm('', 'li').css('width:100%;height:45px;'), title: '链接：', value: $.Util.url2Obj().path + '/mobile/survey.html?guid=' + _info.guid, width: 600 });
                for (var i = 0; i < _dLen; i++) { addItem(_dAry[i]); }
            }
        });
    }

    function addItem(obj) {
        var _temp = eBody.adElm('', 'li').h(_html.format(obj.title, obj.type)), _tempP = _temp.fc().ns().fc(), _allCount = obj.count;
        _tempP.adElm('', 'tr').h('<th>选项</th><th>有效回答人数<span class="c_6 fwb fr">' + _allCount + '</span></th><th>比例</th>');
        for (var i = 0, _len = obj.items.length; i < _len; i++) {
            var _itemVal = obj.items[i], _bate = (+_itemVal.count / +_allCount).toFixed(2) * 100;
            _tempP.adElm('', 'tr').h('<td>' + _itemVal.text + '</td><td>' + _itemVal.count + '</td><td><a class="process"><b class="normal" id="process-value" style="width:' + _bate + '%;">' + _bate + '%</b></a></td>');
        }
    }

    me.loadpaper = function (paperId) { args.paperId = paperId; loadData(); }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.show = function () { owner.show(); return me; }
    me.hide = function () { owner.hide(); return me; }
    me.remove = function () { owner.r(); me = null; delete me; }
    me.init = function (j) { setDefault(j); layout(); return me; }
    if (arguments.length) { me.init(j); }
    return me;
}