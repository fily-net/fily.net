$.NameSpace('$View.project');
$View.project.ProjectDuiWu = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, tid: 'PRO_SUPPLIER', type: '746', title: '工程施工队伍申请' };
    var coms = {}, taskInfo, tkId, wfId, taskList, popTips, infoBody;
    var _taskAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: 'wfId', name: 'wfId', type: 'attr' },
        { title: '施工队伍', name: 'companyName', type: 'none', width: 250, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '联系人', name: 'contact', type: 'none', width: 100, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '联系人电话', name: 'mobilphone', type: 'none', width: 120, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '资质证书', name: 'QCN', type: 'none', width: 120, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '资质等级', name: 'QL', type: 'none', width: 80, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '法定代表人', name: 'legalPerson', type: 'none', width: 100, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '负责人', name: 'responsePerson', type: 'none', width: 100, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '申请人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'select', textKey: 'uid', ifFilter: true, loadApi: 'm=SYS_CM_USERS&action=getAllUsers', filterItems: ['equal'], width: 80 },
        { title: '申请时间', name: 'cTime', type: 'date', width: 145 },
        //{ title: '<font color="red">审核状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}'}], width: 150 },
        { title: '状态', name: 'state', ifTrans: true, type: 'select', ifFilter: true, gtID: 744, filterItems: ['equal'], width: 80 },
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _extAry = [
            { name: 'detail', url: 'View/project/SupplierForm.js', type: 'tab', icon: 'fa fa-list', text: '详细信息' }
            //{ name: 'files', url: 'View/project/SupplierApplyWF.js', type: 'tab', icon: 'fa fa-file-o', text: '申请流程' }
        ];
        var comArgs = {
            'root': { head_h: 30, title: args.title, icon: 'fa fa-edit', cn: 'b0', toolBarSkin: 'mr5 Button-default', gbsID: 152, onToolBarClick: onToolBarClick },
            'layout': { min: 244, max: 500, isRoot: 1, start: 450, dir: 'ns', dirLock: 2 },
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
                onTDClick: onTaskClick,
                colControls: { header: {}, paging: { pageSize: 4, pageIndex: 1 } }
            },
            'detailInfo': {
                head_h: 35
            },
            'tabInfo': { items: _extAry, skin: 'ButtonSet-tab fl', itemSkin: 'Button-tab', onClick: onTypeClick }
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
                    type: 'BaseDiv',
                    name: 'detailInfo',
                    head: { type: 'ButtonSet', name: 'tabInfo' }
                }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        taskList = coms.taskList;
        infoBody = coms['detailInfo'].body;
    }

    function onTypeClick(obj) {
        if (!obj.Args.url) { return false; }
        new $.UI.View({ p: infoBody, url: obj.Args.url, sid: tkId, wfId: wfId, onSubmitSuccess: onFormSubmitSuccess });
    }

    function onFormSubmitSuccess(obj) {
        if (taskList) {
            taskList.refresh({ onSuccess: function (obj) { taskList.fireClick(0); } });
        }
    }

    function onToolBarClick(obj) {
        switch (obj.name) {
            case '153':
                var _fiAry = [
                    { title: '企业名称', name: 'companyName', comType: 'Input', req: true, sErr: '企业名称不能为空', width: 400, group: { width: 700 } },
                    { title: '资质证书', name: 'QCN', comType: 'Input', req: false, sErr: '企业资质证书编号不能为空', width: 400 },
                    { title: '资质等级', name: 'QL', comType: 'Input', req: false, sErr: '企业资质等级不能为空', width: 400 },
                    { title: '法定代表人', name: 'legalPerson', comType: 'Input', req: false, sErr: '法定代表人不能为空', width: 400 },
                    { title: '负责人', name: 'responsePerson', comType: 'Input', req: false, sErr: '负责人不能为空', width: 400 },
                    { title: '联系人', name: 'contact', comType: 'Input', req: true, sErr: '联系人不能为空', width: 400 },
                    { title: '联系人电话', name: 'mobilphone', comType: 'Input', req: true, sErr: '联系人电话不能为空', width: 400 },
                    { title: '营业执照', name: 'link', comType: 'FileUploader', width: 400 },
                    { title: '经营范围', name: 'business', comType: 'TextArea', width: 400, height: 200 }
                ];
                if (popTips) { popTips.remove(); popTips = null; }
                popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-edit', title: '发起流程申请', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 520, ifFixedHeight: false });
                (new $.UI.Form({
                    p: popTips.body,
                    items: _fiAry,
                    ifFixedHeight: false,
                    state: 'Insert',
                    extSubmitVal: {
                        type: args.type
                    },
                    submitApi: 'm=SYS_CM_PRO&action=addSupplierApply',
                    onSubmitSuccess: function () {
                        popTips.remove(); popTips = null;
                        taskList.refresh({}, true, false);
                    }
                })).focus();
                break;
        }
    }

    function onTaskClick(obj) {
        var _tg = obj.Target;
        tkId = _tg.getAttr('id');
        wfId = _tg.getAttr('wfId');
        coms['tabInfo'].fireClick(0);
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