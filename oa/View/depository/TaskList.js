$.namespace('$View.depository');
$View.depository.TaskList = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, whId: 0, type: '', taskAry: [], msAry: [], onComplete: _fn };
    var taskInfo, tkId, taskList, currObj;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _loadApi = 'm=SYS_TABLE_BASE&action=pagingForRightsWFList&table=' + args.type + '&jsonCondition={"whId":' + args.whId + '}';
        var comArgs = {
            'layout': { min: 244, max: 500, isRoot: 1, start: 320, dir: 'ns', dirLock: 2 },
            'taskInfo': { url: 'View/workflow/WorkFlowInfo.js', onNextSuccess: onWFNextSucc, onLoadComplete: onWFLoad, onCompleteBefore: function () { MTips.show('您确定(修改仓库物资库存)?', 'warn'); }, onComplete: onWFComplete, onLoad: function (view) { taskInfo = view; } },
            'taskList': { aHeader: args.taskAry, loadApi: _loadApi, ifBindID: false, ifEnabledFilter: false, onSuccess: function (obj) { obj.List.fireClick(0); }, onTDClick: onTaskClick, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1}} }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'layout',
            eHead: { type: 'List', name: 'taskList' },
            eFoot: { type: 'View', name: 'taskInfo' }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        taskList = coms.taskList;
    }
    function _event() { }
    function _override() { }
    function onWFNextSucc(obj) {
        $.Util.ajax({ args: 'm=SYS_TABLE_BASE&action=updateRights&table=' + args.type + '&users=' + obj.Node.owner + '&id=' + tkId, onSuccess: function () { taskList.refresh(); } });
    }
    function onWFComplete(obj) { args.onComplete(obj, tkId, args.type); }
    function onWFLoad() {
        var _eMS = taskInfo.addPanel({ title: '物资详情' }).css('height:200px;position: relative;border:1px dashed #e0e0e0;');
        new $.UI.List({ p: _eMS, ifBindID: false, ifEnabledFilter: false, aHeader: args.msAry, loadApi: 'm=SYS_CM_WH&action=getMSDetailForTK&tkId=' + tkId + '&type=' + args.type, colControls: { header: {}} });
    }
    function onTaskClick(obj) { var _tg = obj.Target; tkId = _tg.getAttr('id'); delayShowInfo(_tg.getAttr('wfId')); }
    function delayShowInfo(wfId) {
        if (!taskInfo) { setTimeout(function () { delayShowInfo(wfId); }, 200); return; }
        taskInfo.setInstanceId(wfId);
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}