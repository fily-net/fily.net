$.NameSpace('$View.rights');
$View.rights.Index = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms = {}, currView, currIdx;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _iAry = [
            { text: '系统功能树', type: 'tab', icon: 'icon-glyph-tasks', name: 'SYS_CM_FN_TREE', rootID: 1 },
            { text: '全局对照表', type: 'tab', icon: 'icon-glyph-list-alt', name: 'SYS_CM_GLOBAL_TABLE', rootID: 1 },
            { text: '系统工具栏', type: 'tab', icon: 'icon-glyph-wrench', name: 'SYS_CM_GLOBAL_BTNSET', rootID: 1 }
        ];
        var comArgs = {
            'rootTips': { head_h: 33, foot_h: 0, cn: 'b0', title: '<font class="c_6">权限设置</font>', icon: 'icon-glyph-eye-close', toolBarSkin: 'mr5 Button-default', gbsID: 9, onToolBarClick: onToolBarClick },
            'typeTab': { items: _iAry, onTabClick: onTabClick }
        }
        var struct = { p: owner, type: 'Tips', name: 'rootTips' }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        var tips = coms.rootTips;
        var tab = new $.UI.Tab({ pHead: tips.head, pBody: tips.body, items: _iAry, onTabClick: onTabClick });
        tips.head.chn(3).css('margin:3px 0px 5px 20px;');
    }
    function onToolBarClick(obj) { if (currView) { currView.saveSetting(); } }
    function onTabClick(obj) {
        if (currIdx == obj.Name) { return; }
        currIdx = obj.Name;
        new $.UI.View({ p: obj.Body, url: 'View/rights/Public.js', table: obj.Name, rootID: obj.Button.get('rootID'), onLoad: function (view, self) { currView = view; } });
    }

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