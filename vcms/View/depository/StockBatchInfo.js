$.NameSpace('$View.depository');
$View.depository.StockBatchInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms = {}, sList, sView, batchList;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { title: 'ID', name: 'ms.id', key: 'id', type: 'attr' },
            { title: '扫描码', name: 'ms.scanCode', key: 'scanCode', type: 'none', width: 120 },
            { title: '物资编号', name: 'ms.code', key: 'code', type: 'none', width: 100 },
            { title: '物资名称', name: 'ms.nodeName', key: 'nodeName', type: 'none', width: 120 },
            { title: '<font color="red">当前库存</font>', name: 'isnull(stock.number, 0)', key: 'number', type: 'none', width: 100 },
            { title: '<font color="red">当前总值(￥)</font>', name: 'isnull(stock.totalSum, 0)', key: 'totalSum', type: 'none', width: 100 },
            { title: '规格', name: 'ms.guige', key: 'guige', type: 'none', width: 50 },
            { title: '单位', name: 'ms.danwei', key: 'danwei', type: 'none', ifTrans: true, width: 50 },
            { title: '计划价(￥)', name: 'ms.planPrice', key: 'planPrice', type: 'none', width: 100 },
            { title: '平均价(￥)', name: 'ms.avgPrice', key: 'avgPrice', type: 'none', width: 100 },
            { title: '最高价(￥)', name: 'ms.highPrice', key: 'highPrice', type: 'none', width: 100 },
            { title: '商品备注', name: 'ms.note', key: 'note', type: 'none', width: 100, ifEnabledTips: true }
        ];
        var _batchHeaderAry = [
            { title: '批次号', name: 'batchCode', type: 'none', width: 150 },
            { title: '批次类型', name: 'type', ifTrans: true, type: 'none', width: 80 },
            { title: '进价', name: 'price', type: 'none', width: 90 },
            { title: '总量', name: 'totalNum', type: 'none', width: 80 },
            { title: '批次库存量', name: 'remainNum', type: 'none', width: 80 },
            { title: '生成时间', name: 'cTime', type: 'date', width: 130 },
            { title: '操作人', name: 'cPerson', type: 'none', ifTrans: true, trans: 'SYS_TRANS_USER', width: 100 }
        ];
        var comArgs = {
            'layout': { min: 244, max: 500, isRoot: 1, start: 430, dir: 'we', dirLock: 1 },
            'rootLayout': { min: 244, max: 500, start: 420, dir: 'ns', dirLock: 2 },
            'sView': { url: 'View/common/TreeList.js', table: 'SYS_WH_MS', ifShowToolBar: false, rootID: 1, ifShowID: false, lockLevel: 2, ifExpandAll: true, onTDClick: onStructClick, onLoad: function (view) { sView = view; } },
            'sList': { aHeader: _mHeaderAry, ifBindID: false, ifEnabledFilter: false, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onTDClick: onStockTDClick, onSuccess: function (obj) { if (obj.Length) { obj.List.fireClick(0); } else { batchList.loadAjax({ args: 'm=SYS_CM_WH&action=getAllMSBatchDetail&msId=0&whId=0' }); } } },
            'batchInfo': { head_h: 30, title: '批次详情', icon: 'icon-glyph-th-list' },
            'batchList': { aHeader: _batchHeaderAry, ifBindID: false, ifEnabledFilter: false, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1}} }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'layout',
            eHead: { type: 'View', name: 'sView' },
            eFoot: { type: 'Layout', name: 'rootLayout', eHead: { type: 'List', name: 'sList' }, eFoot: { type: 'Tips', name: 'batchInfo', body: { type: 'List', name: 'batchList'}} }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        sList = coms.sList; batchList = coms.batchList;
    }

    function onStructClick(obj) {
        var _level = obj.TreeList.get('currLevel'), _rowId = -1, _whID = args.whID;
        if (!_whID) { return; };
        if (_level == 2) {
            _rowId = obj.Attr.selID;
            sList.setAttr('ifAjax', false).loadAjax({ args: 'm=SYS_CM_WH&action=getStockNumByWH&msPid=' + _rowId + '&whId=' + _whID });
        } else {
            if (! +obj.Target.getAttr('sons')) {
                sList.setAttr('ifAjax', false).loadAjax({ args: 'm=SYS_CM_WH&action=getStockNumByWH&msPid=-1&whId=-1' });
            }
        }
    }
    function onStockTDClick(obj) {
        batchList.loadAjax({ args: 'm=SYS_CM_WH&action=getAllMSBatchDetail&msId=' + obj.Target.getAttr('id') + '&whId=' + args.whID });
    }
    me.loadStock = function (whID) { args.whID = whID; sView.treeList.List.refresh(null, true, true); }
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