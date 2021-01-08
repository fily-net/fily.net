$.NameSpace('$View.project');
$View.project.SupplierQueryList = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, tid: 'PRO_SUPPLIER', type: '746', dbclick: _fn  };
    var coms = {};
    var _taskAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: 'wfId', name: 'wfId', type: 'attr' },
        { title: 'companyName', name: 'companyName', type: 'attr' },
        { title: '物资供应商', name: 'companyName', type: 'none', width: 150, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '资质证书', name: 'QCN', type: 'none', width: 120, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '资质等级', name: 'QL', type: 'none', width: 80, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '法定代表人', name: 'legalPerson', type: 'none', width: 100, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '负责人', name: 'responsePerson', type: 'none', width: 100, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '联系人', name: 'contact', type: 'none', width: 100, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '联系人电话', name: 'mobilphone', type: 'none', width: 100, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '申请人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'select', textKey: 'uid', ifFilter: true, loadApi: 'm=SYS_CM_USERS&action=getAllUsers', filterItems: ['equal'], width: 80 },
        { title: '申请时间', name: 'cTime', type: 'date', width: 130 },
        { title: '<font color="red">审核状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}'}], width: 150 },
        { title: '状态', name: 'state', ifTrans: true, type: 'select', ifFilter: true, gtID: 744, filterItems: ['equal'], width: 80 },
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'taskList': {
                aHeader: _taskAry,
                loadApi: 'm=SYS_TABLE_BASE&table=' + args.tid + '&action=pagingForList&jsonCondition={"type": ' + args.type + '}',
                ifBindID: false,
                ifEnabledFilter: true,
                onSuccess: function (obj) {
                    if (obj.Length) {
                        obj.List.fireClick(0);
                    }
                },
                onTDDoubleClick: onTaskClick,
                colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } }
            }
        }
        var struct = {
            p: owner, type: 'List', name: 'taskList'
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        taskList = coms.taskList;
    }

    function onTaskClick(obj) {
        var _tr = obj.eTr;
        args.dbclick(_tr.attr('id'), _tr.attr('companyName'));
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