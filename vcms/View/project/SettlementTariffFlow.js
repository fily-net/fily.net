$.NameSpace('$View.project');
$View.project.SettlementTariffFlow = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, proId: 0 };
    var coms = {}, taskList, viewP;
    var _taskAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: 'wfId', name: 'wfId', type: 'attr' },
        { title: 'proId', name: 'proId', type: 'attr' },
        { title: 'accountInfoId', name: 'accountInfoId', type: 'attr' },
        { title: '工程', name: 'dbo.SYS_TRANS_PRO_CODE(proId)', type: 'none', width: 150, ifEnabledTips: true },
        { title: '发起人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'select', textKey: 'uid', ifFilter: true, loadApi: 'm=SYS_CM_USERS&action=getAllUsers', filterItems: ['equal'], width: 80 },
        { title: '发起时间', name: 'cTime', type: 'date', width: 130 },
        { title: '<font color="red">当前任务状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}'}], width: 150 },
        { title: '状态', name: 'state', ifTrans: true, type: 'select', ifFilter: true, gtID: 448, filterItems: ['equal'], width: 80 },
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 35, title: '分包费用结算流程', icon: 'icon-glyph-gift', cn: 'b0' },
            'layout': { min: 244, max: 500, isRoot: 1, start: 450, dir: 'ns', dirLock: 2 },
            'taskList': { aHeader: _taskAry, loadApi: 'm=SYS_TABLE_BASE&table=PRO_SC_COST_COUNT&action=pagingForRightsWFList&orderCondition={"cTime": "desc"}', ifBindID: false, ifEnabledFilter: true, onSuccess: function (obj) { if (obj.Length) { obj.List.fireClick(0); } else { toolBar.fireClick(0); } }, onTDClick: onTaskClick, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1}} }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: {
                type: 'Layout',
                name: 'layout',
                eHead: { type: 'List', name: 'taskList' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        taskList = coms.taskList; viewP = coms.layout.eFoot;
    }
    function onTaskClick(obj) {
        var _tg = obj.Target;
        new $.UI.View({ p: viewP, url: 'View/project/SettlementTariffFlowInfo.js', proId: _tg.getAttr('proId'), accountInfoId: _tg.getAttr('accountInfoId'), taskId: _tg.getAttr('id'), wfId: _tg.getAttr('wfId'), onNextSuccess: function () { taskList.refresh(); } });
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