$.namespace('$View.depository');
$View.depository.BatchQuery = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var batchList, taskList;
    var _msAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: '操作', name: 'o', type: 'operate', width: 80, items: [{ name: 'delete', text: '删除' }] },
        { title: '扫描码', name: 'scanCode', type: 'none', width: 120 },
        { title: '物资名称', name: 'nodeName', type: 'none', width: 100 },
        { title: '最高价(￥)', name: 'highPrice', type: 'none', width: 100 },
        { title: '<font color="red">实际价(￥)</font>', name: 'price', type: 'none', width: 100, comType: 'KeyInput', ifEdit: true },
        { title: '<font color="red">实收数量</font>', name: 'number', type: 'none', width: 100, comType: 'KeyInput', ifEdit: true },
        { title: '实际总值(￥)', name: 'totalSum', union: '$price*$number', type: 'none', width: 100 },
        { title: '计划价(￥)', name: 'planPrice', type: 'none', width: 100 },
        { title: '计划总值(￥)', name: 'planSum', union: '$planPrice*$number', type: 'none', width: 100 }
    ];
    var _msDetailAry = [
        { title: '扫描码', name: 'scanCode', type: 'none', width: 120 },
        { title: '物资编号', name: 'code', type: 'none', width: 100 },
        { title: '物资名称', name: 'nodeName', type: 'none', width: 120 },
        { title: '规格', name: 'ms.guige', type: 'none', width: 50 },
        { title: '单位', name: 'ms.danwei', type: 'none', ifTrans: true, width: 50 },
        { title: '计划价', name: 'ms.planPrice', type: 'none', width: 80 },
        { title: '最高价', name: 'ms.highPrice', type: 'none', width: 80 },
        { title: '平均价', name: 'ms.avgPrice', type: 'none', width: 80 },
        { title: '<font color="red">进价(￥)</font>', name: 'isnull(detail.price, 0)', type: 'none', width: 80 },
        { title: '<font color="red">实收量</font>', name: 'isnull(detail.number, 0)', type: 'none', width: 100 },
        { title: '<font color="red">实总价(￥)</font>', name: 'isnull(detail.sum, 0)', type: 'none', width: 100 }
    ];
    var _taskAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: 'wfId', name: 'wfId', type: 'attr' },
        { title: '收料单据号', name: 'code', type: 'none', width: 150, ifFilter: true, filterItems: ['like'] },
        { title: '收料库', name: 'whId', ifTrans: true, trans: 'SYS_TRANS_WH', ifFilter: true, type: 'select', loadApi: 'm=SYS_TABLE_TREE&action=getNodesByPid&table=SYS_WH_INDEX&pid=4', filterItems: ['equal'], width: 120 },
        { title: '发票号', name: 'faPiaoHao', type: 'none', width: 100, ifFilter: true, filterItems: ['like'] },
        { title: '结算方法', name: 'jieSuanMethod', ifTrans: true, type: 'select', width: 80, ifFilter: true, filterItems: ['equal'], gtID: 275 },
        { title: '总金额(￥)', name: 'cost', type: 'none', width: 100 },
        { title: '供应商', name: 'gongYingShang', type: 'none', width: 130 },
        { title: '收料人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'select', textKey: 'uid', ifFilter: true, loadApi: 'm=SYS_CM_USERS&action=getAllUsers', filterItems: ['equal'], width: 80 },
        { title: '收料时间', name: 'shouLiaoTime', type: 'date', width: 130 },
        { title: '开单时间', name: 'cTime', type: 'date', width: 130 },
        { title: '<font color="red">当前任务状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}' }], width: 150 },
        { title: '备注', name: 'note', key: 'note', type: 'none', width: 120, ifEnabledTips: true }
    ];
    var _fiAry = [
        { name: 'code', title: '收料单据号', comType: 'Label' },
        { name: 'cost', title: '金额', comType: 'KeyInput', dataType: 'double', req: true },
        { name: 'faPiaoHao', title: '发票号', comType: 'Input', req: true },
        { name: 'whId', title: '收料库', dataType: 'int', comType: 'Select', loadApi: 'm=SYS_TABLE_TREE&action=getNodesByPid&table=SYS_WH_INDEX&pid=4', req: true },
        { name: 'gongYingShang', title: '供应商', comType: 'Input' },
        { name: 'jieSuanMethod', title: '结算方式', gtID: 275, comType: 'Select' },
        { name: 'shouLiaoTime', title: '收料时间', comType: 'Date', req: true },
        { name: 'note', title: '物资用途', comType: 'TextArea' }
    ];
    var _msDetailAry = [
        { title: '扫描码', name: 'scanCode', type: 'none', width: 120 },
        { title: '物资编号', name: 'code', type: 'none', width: 100 },
        { title: '物资名称', name: 'nodeName', type: 'none', width: 120 },
        { title: '规格', name: 'ms.guige', type: 'none', width: 50 },
        { title: '单位', name: 'ms.danwei', type: 'none', ifTrans: true, width: 50 },
        { title: '计划价', name: 'ms.planPrice', type: 'none', width: 80 },
        { title: '最高价', name: 'ms.highPrice', type: 'none', width: 80 },
        { title: '平均价', name: 'ms.avgPrice', type: 'none', width: 80 },
        { title: '<font color="red">进价(￥)</font>', name: 'isnull(detail.price, 0)', type: 'none', width: 80 },
        { title: '<font color="red">实收量</font>', name: 'isnull(detail.number, 0)', type: 'none', width: 100 },
        { title: '<font color="red">实总价(￥)</font>', name: 'isnull(detail.sum, 0)', type: 'none', width: 100 }
    ];
    function _default() {

    }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 30, title: '仓库批次查询', icon: 'icon-glyph-tasks', cn: 'b0' },
            'detail': { head_h: 30, title: '物资详情', icon: 'icon-glyph-tasks', cn: 'b0' },
            'layout': { min: 244, max: 500, isRoot: 1, start: 450, dir: 'ns', dirLock: 2 },
            'batchList': { aHeader: _msDetailAry, ifBindID: false, ifEnabledFilter: false, colControls: { header: {} } },
            'taskList': { aHeader: _taskAry, loadApi: 'm=SYS_TABLE_BASE&table=TK_WH_RECEIVE&action=pagingForRightsWFList', ifBindID: false, ifEnabledFilter: true, onSuccess: function (obj) { if (obj.Length) { obj.List.fireClick(0); } else { toolBar.fireClick(0); } }, onTDClick: onTaskClick, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } } }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: {
                type: 'Layout',
                name: 'layout',
                eHead: { type: 'List', name: 'taskList' },
                eFoot: {
                    type: 'Tips', name: 'detail',
                    body: { type: 'List', name: 'batchList' }
                }
            }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        taskList = coms.taskList; batchList = coms.batchList;
    }
    function _event() {

    }
    function _override() {

    }
    function onTaskClick(obj) { batchList.loadAjax({ args: 'm=SYS_CM_WH&action=getMSDetailForTK&tkId=' + obj.Target.getAttr('id') + '&type=TK_WH_RECEIVE' }); }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}