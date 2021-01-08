$.NameSpace('$View.qt');
$View.qt.TopicResults = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, topicId: 0, topicTitle: '' };
    var coms = {}, rootTips, eBody, _paging;
    var _html = '<div class="title"><a _tid="{0}" MTips="删除" class="icon-compact-del"></a><a _tid="{0}" MTips="展开" _type="{1}" class="icon-compact-line-r"></a><div class="_title">{2}</div><div class="_info"><span style="margin-right:15px;">创建人：{3}</span><span>创建时间：{4}</span></div></div></div>';
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _hAry = [
            { title: '姓名', name: 'name', type: 'none', width: 100 },
            { title: '邮箱', name: 'email', type: 'none', width: 150 },
            { title: '手机号', name: 'phoneNumber', type: 'none', width: 120 },
            { title: 'QQ号', name: 'qq', type: 'none', width: 120 },
            { title: '真实值', name: 'value', type: 'none', width: 120 },
            { title: '文本值', name: 'text', type: 'none', ifEnabledTips: true, width: 280 },
            { title: '提交时间', name: 'cTime', type: 'date', width: 130 }
        ];
        var comArgs = {
            'root': { head_h: 30, foot_h: 30, title: args.topicTitle, icon: 'icon-glyph-gift', cn: 'b0', toolBarAry: [{ text: '返回', name: 'addTopic', skin: 'Button-blue', visibled: false, css: 'margin-top:2px;margin-right:15px;'}], onToolBarClick: onToolBarClick },
            'mainList': { aHeader: _hAry, loadApi: 'm=SYS_TABLE_BASE&action=pagingForList&table=SYS_QT_PAPER_ANSWER&jsonCondition={"topicId": ' + args.topicId + '}', colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1}} }
        };
        var struct = { p: owner, type: 'Tips', name: 'root', body: { type: 'List', name: 'mainList'} };
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        rootTips = coms.root;
    }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'addTopic':
                
                break;
        }
    }
    me.loadTopicResults = function (topicId) { args.topicId = topicId; loadResults(); }
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