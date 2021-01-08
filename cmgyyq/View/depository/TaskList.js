$.NameSpace('$View.depository');
$View.depository.TaskList = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, whId: 0, type: '', taskAry: [], msAry: [], onComplete: _fn };
    var coms = {}, taskInfo, tkId, taskList, currObj;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
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
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        taskList = coms.taskList;
    }
    function onWFNextSucc(obj) {
        $.Util.ajax({
            args: 'm=SYS_TABLE_BASE&action=updateRights&table=' + args.type + '&users=' + obj.Node.owner + '&id=' + tkId,
            onSuccess: function () { taskList.refresh(); }
        });
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