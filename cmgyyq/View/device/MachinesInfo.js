$.NameSpace('$View.device');
$View.device.MachinesInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, title: '', proId: 0, type: null, onNext: _fn };
    var coms = {}, popTips, mainList, infoForm;
    var _noteAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: 'wfId', name: 'wfId', type: 'attr' },
        { title: '<font color="red">当前流程状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}'}], width: 150 },
        { title: '应用名称', name: 'nodeName', type: 'none', width: 120 },
        { title: '最近操作人', name: 'mPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 120 },
        { title: '最近操作时间', name: 'mTime', type: 'date', width: 130 },
        { title: '流程发起者', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 120 },
        { title: '发起时间', name: 'cTime', type: 'date', width: 130 },
        { title: '备注', name: 'note', key: 'note', type: 'none', width: 200 }
    ];
    var _infoAry = [
        { title: '设备编号', name: 'deviceCode', comType: 'Input', req: true },
        { title: '设备名称', name: 'deviceName', comType: 'Input', req: true },
        { title: '型号', name: 'deviceType', comType: 'Input', req: true },
        { title: '主要规格', name: 'guiGe', comType: 'Input', req: true },
        { title: '复杂系数机', name: 'xiShuJi', comType: 'Input', req: true },
        { title: '复杂系数电', name: 'xiShuDian', comType: 'Input', req: true },
        { title: '电机型号', name: 'dianJiXinHao', comType: 'Input', req: true },
        { title: '电机功率KW', name: 'dianJiGongLv', comType: 'Input', req: true },
        { title: '制造厂', name: 'maker', comType: 'Input', req: true },
        { title: '出厂日期', name: 'outTime', comType: 'Date', req: true },
        { title: '投产日期', name: 'useTime', comType: 'EndDate', matchItem: 'outTime', req: true },
        { title: '原值', name: 'origCost', comType: 'KeyInput', dataType: 'double' },
        { title: '安装地点', name: 'address', comType: 'Input' },
        { title: '折旧年限', name: 'zheJiuTime', comType: 'Date' },
        { title: '分类', name: 'type', comType: 'Input' },
        { title: '内台办费用', name: 'inCost', comType: 'KeyInput', dataType: 'double', req: true },
        { title: '外台办费用', name: 'outCost', comType: 'KeyInput', dataType: 'double', req: true },
        { title: '下次复证日期', name: 'nextCheckTime', comType: 'Date' },
        { title: '附件', name: 'link', comType: 'FileUploader' },
        { title: '备注', name: 'note', comType: 'TextArea' }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootTips': { head_h: 30, title: '机具管理--任务列表', icon: 'icon-glyph-align-left', toolBarSkin: 'mr5 Button-default', cn: 'b0', gbsID: 92, onToolBarClick: onToolBarClick },
            'mainLayout': { min: 300, max: 500, isRoot: 1, start: 320, dir: 'we', dirLock: 1 },
            'infoForm': { head_h: 0, foot_h: 30, items: _infoAry, loadApi: 'm=SYS_TABLE_BASE&table=DEVICE_MACHINES&action=getByID', state: 'Update', updateApi: 'm=SYS_TABLE_BASE&table=DEVICE_MACHINES&action=updateByID' },
            'noteList': { aHeader: _noteAry, loadApi: 'm=SYS_TABLE_BASE&table=DEVICE_MACHINES_REPAIR&action=pagingForRightsWFList&jsonCondition={"oid":' + args.proId + '}', colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1}} }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootTips',
            body: {
                name: 'mainLayout',
                type: 'Layout',
                eHead: { name: 'infoForm', type: 'Form' },
                eFoot: { name: 'noteList', type: 'List' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        mainList = coms.noteList; infoForm = coms.infoForm; infoForm.loadDataByID(args.proId);
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case '93':
                //新建项目
                var infoAry = [
                    { title: '应用名称', name: 'nodeName', comType: 'Input', width: 250, req: true },
                    { title: '备注', name: 'note', comType: 'TextArea', width: 500, height: 350 }
                ];
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建项目', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 700, ifFixedHeight: false });
                popTips.Form = new $.UI.Form({ p: popTips.body, extSubmitVal: { oid: args.proId }, insertApi: 'm=SYS_TABLE_BASE&action=addWorkFlowRow&table=DEVICE_MACHINES_REPAIR&wfIndexId=105', items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; mainList.refresh(); onLoadTypeSuccess(); } });
                break;
            case '38':
                MConfirm.setWidth(250).show('确定修改该记录?').evt('onOk', function () { if (infoForm.check(true)[0] != false) { infoForm.submit(); } });
                break;
            case 'back':
                new $.UI.View({ p: args.p, url: 'View/device/Machines.js', fireid: args.proId });
                break;
        }
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