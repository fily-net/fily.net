$.namespace('$View.depository');
$View.depository.Stock = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, table: 'SYS_WH_INDEX', rootID: 4 };
    var sView, toolBar;
    function _default() {

    }
    function _layout() {
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
        coms = $.layout({ args: comArgs, struct: struct });
        toolBar = coms.rootTips.toolBar;
    }
    function _event() {

    }
    function _override() {

    }
    function onWHListClick(obj) {
        var _tg = obj.Target; sView.loadStock(_tg.getAttr('rowId'));
        var _bAry = [{ name: 'receive', type: 'tab', text: '收料', css: 'margin-right:10px;', icon: 'icon-glyph-gift'}];
        /*var _bAry = [{ name: 'allocate', type: 'tab', text: '调拨', css: 'margin-right:10px;', icon: 'icon-glyph-retweet'}];
        if (_tg.getAttr('ifReceipt')=='8') { _bAry.push({ name: 'receive', type: 'tab', text: '收料', css: 'margin-right:10px;', icon: 'icon-glyph-gift' }); }*/
        toolBar.reLoadItems(_bAry).fireClick(0);
    }
    function onWHClickBefore(obj) { if (obj.eTr && +obj.eTr.attr('type') != 2) { return false; }; }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}