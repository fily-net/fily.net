$.NameSpace('$View.device');
$View.device.Car = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, gtRootID: 156, fireid: null, infoUrl: 'View/device/CarInfo.js' }, popTips;
    var coms = {}, typeTab, mainList, currProType, toolBar, currID;
    var ghAry = [
        { type: 'checkbox', width: 40 },
        { title: '<font class="c_6">使用状态</font>', name: 'state', type: 'select', ifTrans: true, width: 100, ifFilter: true, filterItems: ['equal'], gtID: 366 },
        { title: '车牌号', name: 'carCode', type: 'none', width: 120, ifFilter: true, filterItems: ['like'] },
        { title: '车名称', name: 'carName', type: 'none', width: 120, ifFilter: true, filterItems: ['like'] },
        { title: '车型', name: 'carType', type: 'select', ifTrans: true, width: 50, gtID: 383, ifFilter: true, filterItems: ['equal'] },
        { title: '车辆类型', name: 'vehicleType', type: 'select', ifTrans: true, width: 80, gtID: 384, ifFilter: true, filterItems: ['equal'] },
        { title: '用途', name: 'useType', type: 'none', ifTrans: true, width: 60 },
        { title: '产地', name: 'production', type: 'none', ifTrans: true, width: 50 },
        { title: '吨位/座位', name: 'tonnage', type: 'none', ifTrans: true, width: 80 },
        { title: '品牌', name: 'brands', type: 'none', ifTrans: true, width: 50 },
        { title: '型号', name: 'code', type: 'none', width: 120 },
        { title: '登记证书编号', name: 'carNum', type: 'none', width: 120 },
        { title: '发动机编号', name: 'engineNum', type: 'none', width: 120 },
        { title: '车架编号', name: 'frameNum', type: 'none', width: 120 },
        { title: '登记日期', name: 'regeistTime', type: 'date', width: 120 },
        { title: '车主', name: 'carOwner', type: 'none', ifEnabledTips: true, ifTrans: true, width: 120 },
        { title: '车主性质', name: 'carNature', type: 'none', ifTrans: true, width: 60 },
        { title: '使用单位', name: 'useUnit', type: 'none', ifEnabledTips: true, ifTrans: true, width: 120 },
        { title: '原使用单位', name: 'origUseUnit', type: 'none', ifEnabledTips: true, ifTrans: true, width: 120 },
        { title: '调出日期', name: 'recallTime', type: 'date', width: 130 },
        { title: '调进日期', name: 'reinTime', type: 'date', width: 130 },
        { title: '使用部门', name: 'useDept', type: 'none', width: 120, ifTrans: true, trans: 'SYS_TRANS_ROLE' },
        { title: '当前使用人', name: 'usePerson', type: 'none', ifTrans: true, trans: 'SYS_TRANS_USER', width: 120 },
        { title: '当前状况', name: 'status', type: 'none', ifTrans: true, width: 120 },
        { title: '内台办费用', name: 'inCost', type: 'none', width: 120 },
        { title: '外台办费用', name: 'outCost', type: 'none', width: 120 },
        { title: '下次复证日期', name: 'nextCheckTime', type: 'date', width: 130 },
        { title: '备注', name: 'note', type: 'none', width: 120 }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootDiv': { head_h: 30, title: '车辆管理', icon: 'icon-glyph-align-left', toolBarSkin: 'mr5 Button-default', cn: 'b0', gbsID: 94, onToolBarClick: onToolClick },
            'mainList': { aHeader: ghAry, loadApi: 'm=SYS_TABLE_BASE&table=DEVICE_CAR&action=pagingForList', ifEnabledFilter: true, colControls: { header: {}, paging: { pageSize: 10, pageIndex: 1} }, onTDDoubleClick: onListDClick, onTDClick: onListClick, onSuccess: function (obj) { if (obj.Length && args.fireid) { obj.List.fireClick(args.fireid, 'ID'); } } }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootDiv',
            body: { type: 'List', name: 'mainList' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        mainList = coms.mainList;
    }
    function onListClick(obj) { currID = obj.Target.getAttr('rowid'); }
    function onListDClick(obj) { new $.UI.View({ p: args.p, title: obj.getAttr('merchantName'), type: 'normal', url: args.infoUrl, proId: obj.getAttr('rowid') }); }
    function onToolClick(obj) {
        if (obj.Name == 'toUL') { new $.UI.View({ p: args.p, url: 'View/crm/Index.js' }); return; }
        switch (+obj.Name) {
            case 95:
                //新建项目
                var infoAry = [
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
                    { title: '当前状况', name: 'status', comType: 'Select', gtID: 393, group: 'g3' },
                    { title: '保养日期', name: 'maintainTime', comType: 'Date', group: 'g3' },
                    { title: '保养公里数', name: 'maintainKilometers', comType: 'KeyInput', dataType: 'double', group: 'g3' },
                    { title: '内台办费用', name: 'inCost', comType: 'KeyInput', dataType: 'double', req: true, group: 'g3' },
                    { title: '外台办费用', name: 'outCost', comType: 'KeyInput', dataType: 'double', req: true, group: 'g3' },
                    { title: '下次复证日期', name: 'nextCheckTime', comType: 'Date', group: 'g3' },
                    { title: '附件', name: 'link', comType: 'FileUploader', group: 'g3' },
                    { title: '备注', name: 'note', comType: 'TextArea', group: 'g3' }
                ];
                var oP = +$.ck.get('SESSIONID');
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建项目', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 880, ifFixedHeight: false });
                if (currProType == 170) { oP = 0; }
                popTips.Form = new $.UI.Form({ p: popTips.body, insertApi: 'm=SYS_TABLE_BASE&table=DEVICE_CAR&action=addRow', items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; mainList.refresh(); } });
                break;
            case 96:
                //删除项目
                var _ids = mainList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择车辆', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除' + _ids + '条车辆记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_BASE&table=DEVICE_CAR&action=deleteByIDs&ids=' + _ids.join(','),
                        onSuccess: function () { MTips.show('删除成功', 'ok'); mainList.refresh(); }
                    })
                });
                break;
            case 97:
                if (!currID) { MTips.show('请先选择车辆', 'warn'); return; }
                var _hAry = [
                    { type: 'checkbox', width: 50 },
                    { title: '行前里程', name: 'preMileage', type: 'none', width: 120, onChange: onMileageChange },
                    { title: '行后里程', name: 'afterMileage', type: 'none', width: 120, onChange: onMileageChange },
                    { title: '实驶公里', name: 'realMileage', type: 'none', width: 120 },
                    { title: '车辆状况', name: 'carQingKuang', type: 'none', ifTrans: true, width: 80 },
                    { title: '驾驶员', name: 'dirver', type: 'none', ifTrans: true, trans: 'SYS_TRANS_DRIVER', width: 120 },
                    { title: '日期', name: 'rTime', type: 'date', width: 130 }
                ];
                var _fAry = [
                    { title: '行前里程', name: 'preMileage', comType: 'KeyInput', dataType: 'double', req: true, group: { name: 'g1', width: 280} },
                    { title: '行后里程', name: 'afterMileage', comType: 'KeyInput', dataType: 'double', req: true, group: 'g1' },
                    { title: '实驶公里', name: 'realMileage', comType: 'Label', dataType: 'double', group: 'g1' },
                    { title: '车辆状况', name: 'carQingKuang', comType: 'Select', gtID: 393, req: true, group: { name: 'g2', width: 280} },
                    { title: '驾驶员', name: 'dirver', comType: 'Select', loadApi: 'm=SYS_TABLE_BASE&table=CAR_DRIVER&action=getByCondition', req: true, group: 'g2' },
                    { title: '日期', name: 'rTime', comType: 'Date', group: 'g2' }
                ];
                new $.UI.View({ p: args.p, url: 'View/device/CarRecords.js', title: '行驶', proId: currID, table: 'DEVICE_CAR_DRIVING_RECORD', trans: 'SYS_TRANS_DRIVER', headAry: _hAry, formAry: _fAry });
                break;
            case 98:
                if (!currID) { MTips.show('请先选择车辆', 'warn'); return; }
                var _hAry = [
                    { type: 'checkbox', width: 50 },
                    { title: '油类型', name: 'oilType', type: 'none', ifTrans: true, width: 120 },
                    { title: '金额', name: 'price', type: 'none', width: 120 },
                    { title: '车辆状况', name: 'carQingKuang', type: 'none', ifTrans: true, width: 80 },
                    { title: '驾驶员', name: 'dirver', type: 'none', ifTrans: true, trans: 'SYS_TRANS_DRIVER', width: 120 },
                    { title: '日期', name: 'rTime', type: 'date', width: 130 },
                    { title: '备注', name: 'note', type: 'note', width: 150 }
                ];
                var _fAry = [
                    { title: '车油类型', name: 'oilType', comType: 'Select', gtID: 442, req: true, group: { name: 'g1', width: 280} },
                    { title: '金额', name: 'price', comType: 'KeyInput', dataType: 'double', req: true, group: 'g1' },
                    { title: '车辆状况', name: 'carQingKuang', comType: 'Select', gtID: 393, req: true, group: 'g1' },
                    { title: '驾驶员', name: 'dirver', comType: 'Select', loadApi: 'm=SYS_TABLE_BASE&table=CAR_DRIVER&action=getByCondition', trans: 'SYS_TRANS_DRIVER', req: true, group: 'g1' },
                    { title: '日期', name: 'rTime', comType: 'Date', req: true, group: { name: 'g2', width: 280} },
                    { title: '备注', name: 'note', comType: 'TextArea', group: 'g2' }
                ];
                new $.UI.View({ p: args.p, url: 'View/device/CarRecords.js', title: '加油', proId: currID, table: 'DEVICE_CAR_OIL', headAry: _hAry, formAry: _fAry });
                break;
            case 99:
                if (!currID) { MTips.show('请先选择车辆', 'warn'); return; }
                var _hAry = [
                    { type: 'checkbox', width: 50 },
                    { title: '具体内容', name: 'note', type: 'none', width: 150 },
                    { title: '金额', name: 'price', type: 'none', width: 120 },
                    { title: '修理厂', name: 'repairShop', type: 'none', ifTrans: true, width: 80 },
                    { title: '驾驶员', name: 'dirver', type: 'none', ifTrans: true, trans: 'SYS_TRANS_DRIVER', width: 120 },
                    { title: '日期', name: 'rTime', type: 'date', width: 130 }
                ];
                var _fAry = [
                    { title: '具体内容', name: 'note', comType: 'Input', req: true, group: { name: 'g1', width: 280} },
                    { title: '金额', name: 'price', comType: 'KeyInput', dataType: 'double', group: 'g1' },
                    { title: '修理厂', name: 'repairShop', comType: 'Select', gtID: 445, req: true, group: 'g1' },
                    { title: '驾驶员', name: 'dirver', comType: 'Select', loadApi: 'm=SYS_TABLE_BASE&table=CAR_DRIVER&action=getByCondition', trans: 'SYS_TRANS_DRIVER', req: true, group: 'g1' },
                    { title: '日期', name: 'rTime', comType: 'Date', req: true, group: 'g1' }
                ];
                new $.UI.View({ p: args.p, url: 'View/device/CarRecords.js', title: '验车', proId: currID, table: 'DEVICE_CAR_CHECK', headAry: _hAry, formAry: _fAry });
                break;
            case 100:
                if (!currID) { MTips.show('请先选择车辆', 'warn'); return; }
                var _hAry = [
                    { type: 'checkbox', width: 50 },
                    { title: '事故地点', name: 'address', type: 'none', width: 120 },
                    { title: '计划金额', name: 'planPrice', type: 'none', width: 120 },
                    { title: '实际金额', name: 'realPrice', type: 'none', width: 120 },
                    { title: '风险', name: 'risk', type: 'none', width: 80 },
                    { title: '违反交通规则', name: 'risk', type: 'none', width: 180 },
                    { title: '驾驶员', name: 'dirver', type: 'none', ifTrans: true, trans: 'SYS_TRANS_DRIVER', width: 120 },
                    { title: '事故日期', name: 'rTime', type: 'date', width: 130 },
                    { title: '记录日期', name: 'cTime', type: 'date', width: 130 },
                    { title: '备注', name: 'note', type: 'note', width: 150 }
                ];
                var _fAry = [
                    { title: '事故地点', name: 'address', comType: 'Input', req: true, group: { name: 'g1', width: 280} },
                    { title: '计划金额', name: 'planPrice', comType: 'KeyInput', dataType: 'double', group: 'g1' },
                    { title: '实际金额', name: 'realPrice', comType: 'KeyInput', req: true, dataType: 'double', group: 'g1' },
                    { title: '风险', name: 'risk', comType: 'Input', group: 'g1' },
                    { title: '违反交通规则', name: 'breakRules', comType: 'Input', req: true, group: 'g1' },
                    { title: '驾驶员', name: 'dirver', comType: 'Select', loadApi: 'm=SYS_TABLE_BASE&table=CAR_DRIVER&action=getByCondition', trans: 'SYS_TRANS_DRIVER', req: true, group: { name: 'g2', width: 280} },
                    { title: '事故日期', name: 'rTime', comType: 'Date', req: true, group: { name: 'g2', width: 280} },
                    { title: '备注', name: 'note', comType: 'TextArea', group: 'g2' }
                ];
                new $.UI.View({ p: args.p, url: 'View/device/CarRecords.js', title: '事故', proId: currID, table: 'DEVICE_CAR_ACCIDENT', headAry: _hAry, formAry: _fAry });
                break;
            case 34:
                mainList.saveAsExecl('机具列表');
                break;
            case 35:
                (new $.Util.printer(mainList.get('p'))).print();
                break;
        }
    }

    function onMileageChange(obj) {
        console.log(obj);
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