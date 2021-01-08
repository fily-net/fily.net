$.namespace('$View.depository');
$View.depository.StockBatch = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, table: 'SYS_WH_INDEX', rootID: 4 };
    var sView, toolBar;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { name: 'id', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'depth', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'type', type: 'attr' },
            { name: 'nodeName', type: 'none' }
        ];
        var comArgs = {
            'rootTips': { head_h: 33, foot_h: 0, cn: 'b0', title: '仓库库存详情' },
            'rootLayout': { min: 180, max: 300, isRoot: 1, start: 130, dir: 'we', dirLock: 1 },
            'whTreeList': { aHeader: _mHeaderAry, style: 'tree:nodeName', ifShowIcon: 'type', rootID: args.rootID, table: 'SYS_WH_INDEX', onTDClick: onWHListClick, onTDClickBefore: onWHClickBefore },
            'stockInfo': { url: 'View/depository/StockBatchInfo.js', onLoad: function (view) { sView = view; } }
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
    }
    function _event() { }
    function _override() {}
    function onWHListClick(obj) { sView.loadStock(obj.Target.getAttr('rowId')); }
    function onWHClickBefore(obj) { if (obj.eTr && +obj.eTr.attr('type') != 2) { return false; }; }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}