$.namespace('$View.device');
$View.device.CarInfo = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, title: '', proId: 0, type: null, onNext: _fn };
    var popTips, mainList, infoForm;
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
        { title: '车牌号', name: 'carCode', comType: 'Input', req: true, group: { name: 'g1', width: 280} },
        { title: '车名称', name: 'carName', comType: 'Input', req: true, group: 'g1' },
        { title: '车型', name: 'carType', comType: 'Select', gtID: 383, req: true, group: 'g1' },
        { title: '车辆类型', name: 'vehicleType', comType: 'Select', gtID: 384, req: true, group: 'g1' },
        { title: '用途', name: 'useType', comType: 'Select', gtID: 385, req: true, group: 'g1' },
        { title: '产地', name: 'production', comType: 'Select', gtID: 386, req: true, group: 'g1' },
        { title: '吨位/座位', name: 'tonnage', comType: 'Select', gtID: 387, req: true, group: 'g1' },
        { title: '品牌', name: 'brands', comType: 'Select', gtID: 388, req: true, group: 'g1' },
        { title: '型号', name: 'code', comType: 'Input', req: true, group: 'g1' },
        { title: '登记证书编号', name: 'carNum', comType: 'Input', req: true, group: 'g1' },
        { title: '发动机编号', name: 'engineNum', comType: 'Input', req: true, group: { name: 'g2', width: 280} },
        { title: '车架编号', name: 'frameNum', comType: 'Input', req: true, group: 'g2' },
        { title: '登记日期', name: 'regeistTime', comType: 'Date', group: 'g2' },
        { title: '车主', name: 'carOwner', comType: 'Select', gtID: 389, popWidth: 300, group: 'g2' },
        { title: '车主性质', name: 'carNature', comType: 'Select', gtID: 390, group: 'g2' },
        { title: '使用单位', name: 'useUnit', comType: 'Select', gtID: 391, popWidth: 300, group: 'g2' },
        { title: '原使用单位', name: 'origUseUnit', comType: 'Select', gtID: 392, popWidth: 300, group: 'g2' },
        { title: '调出日期', name: 'recallTime', comType: 'Date', group: 'g2' },
        { title: '调进日期', name: 'reinTime', comType: 'Date', group: 'g2' },
        { title: '使用部门', name: 'useDept', comType: 'Select', group: 'g2' },
        { title: '当前使用人', name: 'usePerson', comType: 'Select', group: { name: 'g3', width: 280} },
        { title: '当前状况', name: 'state', comType: 'Select', gtID: 393, group: 'g3' },
        { title: '保养日期', name: 'maintainTime', comType: 'Date', group: 'g3' },
        { title: '保养公里数', name: 'maintainKilometers', comType: 'KeyInput', dataType: 'double', group: 'g3' },
        { title: '内台办费用', name: 'inCost', comType: 'KeyInput', dataType: 'double', req: true, group: 'g3' },
        { title: '外台办费用', name: 'outCost', comType: 'KeyInput', dataType: 'double', req: true, group: 'g3' },
        { title: '下次复证日期', name: 'nextCheckTime', comType: 'Date', group: 'g3' },
        { title: '附件', name: 'link', comType: 'FileUploader', group: 'g3' },
        { title: '备注', name: 'note', comType: 'TextArea', group: 'g3' }
    ];
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootTips': { head_h: 30, title: '车辆管理--任务列表', icon: 'icon-glyph-align-left', toolBarSkin: 'mr5 Button-default', cn: 'b0', gbsID: 92, onToolBarClick: onToolBarClick },
            'mainLayout': { min: 300, max: 500, isRoot: 1, start: 320, dir: 'we', dirLock: 1 },
            'infoForm': { head_h: 0, foot_h: 30, items: _infoAry, loadApi: 'm=SYS_TABLE_BASE&table=DEVICE_CAR&action=getByID', state: 'Update', updateApi: 'm=SYS_TABLE_BASE&table=DEVICE_CAR&action=updateByID' },
            'noteList': { aHeader: _noteAry, loadApi: 'm=SYS_TABLE_BASE&table=DEVICE_CAR_REPAIR&action=pagingForRightsWFList&jsonCondition={"oid":' + args.proId + '}', colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1}} }
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
        coms = $.layout({ args: comArgs, struct: struct });
        mainList = coms.noteList; infoForm = coms.infoForm; infoForm.loadDataByID(args.proId);
    }
    function _event() { }
    function _override() { }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            case '93':
                //新建任务
                var infoAry = [
                    { title: '应用名称', name: 'nodeName', comType: 'Input', width: 250, req: true },
                    { title: '备注', name: 'note', comType: 'TextArea', width: 500, height: 350 }
                ];
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建修理任务', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 700, ifFixedHeight: false });
                popTips.Form = new $.UI.Form({ p: popTips.body, extSubmitVal: { oid: args.proId }, insertApi: 'm=SYS_TABLE_BASE&action=addWorkFlowRow&table=DEVICE_CAR_REPAIR&&wfIndexId=105', items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; mainList.refresh(); onLoadTypeSuccess(); } });
                break;
            case '38':
                MConfirm.setWidth(250).show('确定修改该记录?').evt('onOk', function () { if (infoForm.check(true)[0] != false) { infoForm.submit(); } });
                break;
            case 'back':
                new $.UI.View({ p: args.p, url: 'View/device/Car.js', fireid: args.proId });
                break;
        }
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}