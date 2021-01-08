$.NameSpace('$View.project');
$View.project.PM = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, typeId: 0 };
    var coms = {}, taskInfo, popTips, taskList, viewP;
    var _taskAry = [
        { name: 'id', type: 'attr' },
        { type: 'checkbox', width: 60 },
        { title: '工程类型', name: 'proType', type: 'select', width: 100, ifFilter: true, gtID: 456, filterItems: ['equal'] },
        { title: '<font color="#C84823">当前状态</font>', name: 'state', type: 'select', width: 100, ifFilter: true, gtID: 505, filterItems: ['equal'] },
        { title: '收单日', name: 'collectTime', type: 'date', width: 145, ifFilter: true, filterItems: ['equal'] },
        { title: '工程编号', name: 'proCode', type: 'none', width: 140, ifFilter: true, filterItems: ['like'] },
        { title: '工程地址', name: 'address', type: 'none', width: 280, ifFilter: true, filterItems: ['like'] },

        //{ title: '工程性质', name: 'proNature', type: 'select', width: 80, ifFilter: true, gtID: 468, filterItems: ['equal'] },
        //{ title: '施工部门', name: 'execDept', type: 'select', width: 120, ifFilter: true, gtID: 472, filterItems: ['equal'] },
        { title: '工程区域', name: 'proArea', type: 'select', width: 100, ifFilter: true, gtID: 469, filterItems: ['equal'] },

        //{ title: '请照情况', name: 'qingZhao', type: 'select', width: 120, ifFilter: true, gtID: 7, filterItems: ['equal'] },
        //{ title: '施工队伍', name: 'execTeam', ifEnabledTips: true, ifTrans: true, trans: 'SYS_TRANS_CPN', textKey: 'companyName', loadApi: 'm=SYS_TABLE_BASE&action=getByCondition&orderCol=cTime&table=PRO_SUPPLIER', type: 'select', width: 220, ifFilter: true, filterItems: ['equal'] },
        //{ title: '施工期限', name: 'deadline', type: 'date', width: 130, ifFilter: true, filterItems: ['equal'] },
        { title: '申请单位', name: 'applyDanWei', type: 'none', width: 200, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '联系人', name: 'applyContact', type: 'none', width: 80, ifFilter: true, filterItems: ['like'] },
        { title: '联系电话', name: 'applyMobile', type: 'none', width: 130, ifFilter: true, filterItems: ['like'] },
        { title: '合同编号', name: 'heTongCode', type: 'none', width: 180, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        //{ title: '合同价', name: 'heTongPrice', type: 'none', width: 120 },
        { title: '施工队伍', name: 'execTeamName', type: 'none', width: 200, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '联系人', name: 'execTeamLeader', type: 'none', width: 80, ifFilter: true, filterItems: ['like'] },
        { title: '联系电话', name: 'execTeamLeaderMobile', type: 'none', width: 130, ifFilter: true, filterItems: ['like'] },
        { title: '接水编号', name: 'jieShuiCode', type: 'none', width: 130, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '接水单号', name: 'jieShuiDanCode', type: 'none', width: 130, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
        { title: '开工日期', name: 'bTime', type: 'date', width: 145, ifFilter: true, filterItems: ['equal'] },
        { title: '竣工日期', name: 'eTime', type: 'date', width: 145, ifFilter: true, filterItems: ['equal'] },
        { title: '发起人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'select', textKey: 'uid', ifFilter: true, loadApi: 'm=SYS_CM_USERS&action=getAllUsers', filterItems: ['equal'], width: 80 },
        { title: '发起时间', name: 'cTime', type: 'date', width: 145 },
        { title: '备注', name: 'note', key: 'note', type: 'none', width: 160, ifEnabledTips: true, ifFilter: true, filterItems: ['equal'] }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _rightApi = 'm=SYS_TABLE_BASE&table=PRO_MG&action=pagingForRightsWFList';
        var _baseApi = 'm=SYS_TABLE_BASE&table=PRO_MG&action=pagingForList&orderCondition={"collectTime":"desc"}';
        if (+args.typeId) {
            _baseApi += '&jsonCondition={"proType": "' + args.typeId + '"}';
        }
        var _toolBarAry = [
            { name: 'switch', text: '切换至全屏模式', css: 'margin-top:2px;margin-right:10px;', icon: 'fa-arrows-alt', skin: 'Button-blue' }
        ];
        var comArgs = {
            'root': { head_h: 30, title: '工程管理', icon: 'fa-briefcase', cn: 'b0', toolBarAry: _toolBarAry, toolBarSkin: 'mr5 Button-default', gbsID: 112, onToolBarClick: onToolBarClick },
            'layout': { min: 354, max: 600, isRoot: 1, start: 480, dir: 'ns', dirLock: 2 },
            'taskList': { aHeader: _taskAry, loadApi: _baseApi, ifEnabledFilter: true, onSuccess: function (obj) { if (obj.Length) { obj.List.fireClick(0); } }, onTDClick: onTaskClick, colControls: { header: {}, paging: { pageSize: 2, pageIndex: 1}} }
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
    function onQingZhaoChange(obj) {
        if (+obj.Value == 8) {
            obj.FormItem.next.show().next.show().next.show();
        } else {
            obj.FormItem.next.hide().next.hide().next.hide();
        }
    }
    function onToolBarClick(obj) {
        if (obj.name == 'switch') {
            new $.UI.View({ p: args.p, url: 'View/project/PMFullScreen.js', typeId: args.typeId });
            return false;
        }
        switch (+obj.Name) {
            case 113:
                var _fiAry = [
                    { name: 'proCode', title: '施工编号', comType: 'Input', req: true, group: { name: 'g1', width: 280} },
                    { name: 'proType', title: '类型', comType: 'Select', group: 'g1', gtID: 456, req: true },
                    //{ name: 'proNature', title: '性质', comType: 'Select', group: 'g1', gtID: 468, req: true },
                    { name: 'proArea', title: '区域', comType: 'Select', group: 'g1', gtID: 469, req: true },
                    { name: 'address', title: '地址', comType: 'Input', group: 'g1', req: true },
                    { name: 'customer', title: '客户名', comType: 'Input', group: 'g1' },
                    { name: 'contact', title: '联系方式', comType: 'Input', group: 'g1' },
                    { name: 'proSource', title: '来源', comType: 'Select', group: 'g1', gtID: 470, req: true },
                    { name: 'acreage', title: '配套面积', comType: 'KeyInput', dataType: 'double', group: 'g1' },
                    { name: 'collectTime', title: '收单日', comType: 'Date', group: { name: 'g2', width: 280 } },
                    { name: 'issuedTime', title: '下单日', comType: 'EndDate', matchItem: 'collectTime', group: 'g2' },
                    //{ name: 'execDept', title: '施工部门', dataType: 'int', comType: 'Select', ifTrans: true, gtID: 472, req: true, group: 'g2', onChange: function (obj) { obj.Form.setHidden('dept', obj.Value); } },
                    { name: 'deadline', title: '施工期限', comType: 'Date', group: { name: 'g3', width: 280} },
                    { name: 'qingZhao', title: '请照情况', comType: 'Select', group: 'g3', gtID: 7, onChange: onQingZhaoChange },
                    { name: 'handleTime', title: '办理日', comType: 'Date', req: true, visibled: false, group: 'g3' },
                    { name: 'allowTime', title: '许可日', comType: 'Date', req: true, visibled: false, group: 'g3' },
                    { name: 'payCost', title: '支付费用', comType: 'KeyInput', dataType: 'double', visibled: false, group: 'g3' },
                    { name: 'note', title: '备注', comType: 'TextArea', group: 'g3' }
                ];
                if (popTips) { popTips.remove(); popTips = null; }
                popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-plus', title: '新建工程', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 640, ifFixedHeight: false });
                (new $.UI.Form({ p: popTips.body, state: 'Insert', insertApi: 'm=SYS_CM_PRO&action=addProject', items: _fiAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; taskList.refresh({ onSuccess: function (obj) { obj.List.fireClick(0); } }, false, false); } })).focus();
                break;
            case 114:
                var _ids = taskList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择要删除的行', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除' + _ids.length + '条记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_TREE&table=PRO_MG&action=deleteByIDs&ids=' + _ids.join(','),
                        onSuccess: function () { MTips.show('删除成功', 'ok'); taskList.refresh({ onSuccess: function (obj) { obj.List.fireClick(0); } }); }
                    })
                });
                break;
            case 155:
                popTips = new $.UI.Tips({ comMode: 'x-auto', width: 500, height: 400, y: 100, head_h: 30, ifMask: true, ifClose: true, title: '上传物资领料单', icon: 'fa-upload' });
                new $.UI.FileUploader({ p: popTips.body, uploadApi: 'm=SYS_CM_FILES&action=uploadMSDetail' });
                break;
        }
    }
    function onTaskClick(obj) {
        new $.UI.View({ p: viewP, url: 'View/project/PMInfo.js', typeId: args.typeId, proId: obj.Target.getAttr('id'), proList: taskList, onLoad: function (view) { taskInfo = view; }, onSubmitSuccess: function () { taskList.refresh(); } });
    }
    function delayShowInfo(fn) { if (!taskInfo) { setTimeout(function () { delayShowInfo(fn); }, 200); return; }; fn(); }
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