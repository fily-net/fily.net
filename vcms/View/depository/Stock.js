$.NameSpace('$View.depository');
$View.depository.Stock = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, table: 'SYS_WH_INDEX', rootID: 4 };
    var coms = {}, sView, toolBar;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { name: 'id', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'depth', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'type', type: 'attr' },
            { name: 'ifReceipt', type: 'attr' },
            { name: 'nodeName', type: 'none' }
        ];
        var comArgs = {
            'rootTips': { head_h: 33, foot_h: 0, cn: 'b0', title: '仓库详情', icon: 'icon-glyph-align-left', toolBarSkin: 'Button-default', onToolBarClick: function (obj) { sView.action(obj.Name); } },
            'rootLayout': { min: 180, max: 300, isRoot: 1, start: 220, dir: 'we', dirLock: 1 },
            'whTreeList': { aHeader: _mHeaderAry, style: 'tree:nodeName', ifShowIcon: 'type', rootID: args.rootID, table: 'SYS_WH_INDEX', onTDClick: onWHListClick, onTDClickBefore: onWHClickBefore },
            'stockInfo': { url: 'View/depository/StockInfo.js', onLoad: function (view) { sView = view; } }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootTips',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'List', name: 'whTreeList' },
                eFoot: { type: 'View', name: 'stockInfo' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        toolBar = coms.rootTips.toolBar;
    }

    function onWHListClick(obj) {
        var _tg = obj.Target; sView.loadStock(_tg.getAttr('rowId'));
        var _bAry = [{ name: 'receive', type: 'tab', text: '收料', css: 'margin-right:10px;', icon: 'icon-glyph-gift'}];
        /*var _bAry = [{ name: 'allocate', type: 'tab', text: '调拨', css: 'margin-right:10px;', icon: 'icon-glyph-retweet'}];
        if (_tg.getAttr('ifReceipt')=='8') { _bAry.push({ name: 'receive', type: 'tab', text: '收料', css: 'margin-right:10px;', icon: 'icon-glyph-gift' }); }*/
        toolBar.reLoadItems(_bAry).fireClick(0);
    }
    function onWHClickBefore(obj) { if (obj.eTr && +obj.eTr.attr('type') != 2) { return false; }; }
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