$.namespace('$View.rights');
$View.rights.Index = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var currView, currIdx;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _iAry = [
            { text: '系统功能树', type: 'tab', icon: 'icon-glyph-tasks', name: 'SYS_CM_FN_TREE', rootID: 1 },
            { text: '全局对照表', type: 'tab', icon: 'icon-glyph-list-alt', name: 'SYS_CM_GLOBAL_TABLE', rootID: 1 },
            { text: '系统工具栏', type: 'tab', icon: 'icon-glyph-wrench', name: 'SYS_CM_GLOBAL_BTNSET', rootID: 1 }
        ];
        var comArgs = {
            'rootTips': { head_h: 37, foot_h: 0, cn: 'b0', title: '<font class="c_6">权限设置</font>', icon: 'icon-glyph-eye-close', gbsID: 9, onToolBarClick: onToolBarClick },
            'typeTab': { items: _iAry, onTabClick: onTabClick }
        }
        var struct = { p: owner, type: 'Tips', name: 'rootTips' }
        coms = $.layout({ args: comArgs, struct: struct });
        var tips = coms.rootTips;
        var tab = new $.UI.Tab({ pHead: tips.head, pBody: tips.body, items: _iAry, onTabClick: onTabClick });
        tips.head.chn(3).css('margin:3px 0px 5px 20px;');
    }
    function _event() { }
    function _override() { }
    function onToolBarClick(obj) { if (currView) { currView.saveSetting(); } }
    function onTabClick(obj) {
        if (currIdx == obj.Name) { return; }
        currIdx = obj.Name;
        new $.UI.View({ p: obj.Body, url: 'View/rights/Public.js', table: obj.Name, rootID: obj.Button.get('rootID'), onLoad: function (view, self) { currView = view; } });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}