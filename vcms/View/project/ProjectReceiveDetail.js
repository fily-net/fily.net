$.NameSpace('$View.project');
$View.project.ProjectReceiveDetail = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, proId: 0, taskId: null };
    var coms = {}, taskInfo, taskList, currObj, msList, msInfos = {}, toolBar, popTips, detailList;
    var gongYingShang;
    var _taskAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { name: 'gongYingShang', type: 'attr' },
        { title: '订单号', name: 'code', type: 'none', width: 150, ifFilter: true, filterItems: ['like'] },
        { title: '无税金额', name: 'wuShuiJinE', type: 'none', width: 100 },
        { title: '加税合计', name: 'jiaShuiHeJi', type: 'none', width: 100 },
        { title: '采购人', name: 'caiGouPerson', type: 'none', width: 80 },
        { title: '采购部门', name: 'caiGouDept', type: 'none', width: 80 },
        { title: '供应商', name: 'gongYingShang', type: 'none', width: 200, ifEnabledTips: true },
        { title: '预定时间', name: 'orderTime', type: 'date', width: 130 },
        { title: '到货时间', name: 'arrivedTime', type: 'date', width: 130 },
        { title: '备注', name: 'note', key: 'note', type: 'none', width: 100, ifEnabledTips: true }
    ];
    var _detailAry = [
        { title: '物资编号', name: 'msCode', type: 'none', width: 130 },
        { title: '物资类别', name: 'msType', type: 'none', width: 180, ifEnabledTips: true },
        { title: '物资名称', name: 'msName', type: 'none', width: 130 },
        { title: '规格', name: 'guiGe', type: 'none', width: 100 },
        { title: '单位', name: 'danWei', type: 'none',  width: 100 },
        { title: '税率', name: 'shuiLv', type: 'none', width: 80 },
        { title: '无税净价', name: 'wuShuiJinJia', type: 'none', width: 100 },
        { title: '含税净价', name: 'hanShuiJinJia', type: 'none', width: 100 },
        { title: '无税金额', name: 'wuShuiJinE', type: 'none', width: 100 },
        { title: '加税合计', name: 'jiaShuiHeJi', type: 'none', width: 100 },
        { title: '税额', name: 'shuiE', type: 'none', width: 100 },
        { title: '扣税类别', name: 'kouShuiLeiBei', type: 'none', width: 100 },
        { title: '<font color="red">数量</font>', name: 'num', type: 'none', width: 100 }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _toolAry = [
           // { name: 'import', text: '导入数据' }
        ];
        console.log(args.info);
        var comArgs = {
            'root': { head_h: 30, title: '工程物资订单详情', icon: 'fa fa-file-text-o', cn: 'b0', toolBarSkin: 'mr5 Button-default', toolBarAry: _toolAry, onToolBarClick: onToolBarClick },
            'layout': { min: 560, max: 900, isRoot: 1, start: 810, dir: 'we', dirLock: 1 },
            'taskList': {
                aHeader: _taskAry,
                loadApi: 'm=SYS_TABLE_BASE&table=PROJECT_CAIGOU&action=pagingForList&jsonCondition={"proCode": "' + args.info.proCode + '"}',
                ifEnabledFilter: true,
                onSuccess: function (obj) {
                    obj.List.fireClick(0);
                },
                onTDClick: onTaskClick,
                colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } }
            },
            'detailList': {
                aHeader: _detailAry,
                ifEnabledFilter: true,
                colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } }
            }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: {
                type: 'Layout',
                name: 'layout',
                eHead: { type: 'List', name: 'taskList' },
                eFoot: { type: 'List', name: 'detailList' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        taskList = coms.taskList;
        detailList = coms.detailList;
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'import':
                new $.UI.View({ url: 'View/ms/MSFileManager.js' });
                break;
        }
    }

    
    function onTaskClick(obj) { 
        var _tg = obj.Target; 
        var tkId = _tg.getAttr('id');
        detailList.loadAjax({
            args: 'm=SYS_TABLE_BASE&table=PROJECT_CAIGOU_DETAIL&action=pagingForList&jsonCondition={"caiGouId": ' + tkId + '}'
        });
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