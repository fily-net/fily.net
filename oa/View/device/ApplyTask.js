$.namespace('$View.device');
$View.device.ApplyTask = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, proId: 0, proCode: '' };
    var taskInfo, tkId, taskList, toolBar;
    var _taskAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: 'wfId', name: 'wfId', type: 'attr' },
        { title: '申请单据号', name: 'code', type: 'none', width: 150, ifFilter: true, filterItems: ['like'] },
        { title: '工程', name: 'dbo.SYS_TRANS_PRO_CODE(proId)', type: 'none', width: 130 },
        { title: '申请人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'select', textKey: 'uid', ifFilter: true, loadApi: 'm=SYS_CM_USERS&action=getAllUsers', filterItems: ['equal'], width: 80 },
        { title: '使用时间', name: 'useTime', type: 'date', width: 130 },
        { title: '结束时间', name: 'endTime', type: 'date', width: 130 },
        { title: '台班费', name: 'cost', type: 'none', width: 130 },
        { title: '使用地点', name: 'address', ifEnabledTips: true, type: 'none', width: 130 },
        { title: '开单时间', name: 'cTime', type: 'date', width: 130 },
        { title: '<font color="red">当前任务状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}'}], width: 150 },
        { title: '申请原因', name: 'note', key: 'note', type: 'none', width: 120, ifEnabledTips: true }
    ];
    var _fiAry = [
        { name: 'code', title: '申请单据号', comType: 'Label', group: { name: 'g1', width: 280} },
        { name: 'useTime', title: '使用时间', comType: 'Timer', req: true, group: 'g1' },
        { name: 'address', title: '使用地点', comType: 'Input', req: true, group: 'g1' },
        { name: 'note', title: '申请用途', comType: 'TextArea', group: 'g1' }
    ];
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 30, title: '车辆与机具申请', icon: 'icon-glyph-gift', cn: 'b0', toolBarSkin: 'mr10 Button-default', gbsID: 126, onToolBarClick: onToolBarClick },
            'layout': { min: 244, max: 500, isRoot: 1, start: 450, dir: 'ns', dirLock: 2 },
            'taskInfo': { url: 'View/workflow/WorkFlowInfo.js', onLoadComplete: onWFLoad, onRights: onWFRights, onComplete: onWFComplete, onNextSuccess: onWFNextSucc, onLoad: function (view) { taskInfo = view; } },
            'taskList': { aHeader: _taskAry, loadApi: 'm=SYS_TABLE_BASE&table=DEVICE_APPLY&action=pagingForRightsWFList', ifBindID: false, ifEnabledFilter: true, onSuccess: function (obj) { if (obj.Length) { obj.List.fireClick(0); } else { toolBar.fireClick(0); } }, onTDClick: onTaskClick, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1}} }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: {
                type: 'Layout',
                name: 'layout',
                eHead: { type: 'List', name: 'taskList' },
                eFoot: { type: 'View', name: 'taskInfo' }
            }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        taskList = coms.taskList; toolBar = coms.root.toolBar;
    }
    function _event() { }
    function _override() { }
    function onWFNextSucc(obj) {
        $.Util.ajax({
            args: 'm=SYS_TABLE_BASE&table=DEVICE_APPLY&action=updateRights&users=' + obj.Node.owner + '&id=' + tkId,
            onSuccess: function () { taskList.refresh({ onSuccess: function (obj) { obj.List.fireClick(0); } }, false, false); }
        });
    }

    function onToolBarClick(obj) {
        switch (+obj.Name) {
            case 127:
                if (!taskInfo) { return; }
                var _title = '无工程';
                if (args.proId) { _title = '工程：<font class="c_6">' + args.proCode + '</font>'; }
                taskInfo.setInstanceId(-1); taskInfo.setTitle('新建' + _title + '申请任务');
                var _eExt = taskInfo.addPanel({ title: '车辆与机具申请单' }).css('height:auto;position: relative;background-color: #fff;border: 1px solid #ededed;border-bottom-color: #d5d5d5;box-shadow: 0 1px 2px #eee;'), _carList, _macList;
                var _form = new $.UI.Form({ p: _eExt, ifFixedHeight: false, submitApi: 'm=SYS_TABLE_BASE&action=addWorkFlowRow&table=DEVICE_APPLY&&wfIndexId=104', extSubmitVal: { proId: args.proId, proCode: args.proCode }, items: _fiAry, foot_h: 35 });
                if (_form.items['code']) { var _code = 'SQ' + $.Util.code.FullDate(); _form.items['code'].setData(_code, _code); }
                _form.evt('onSubmitSuccess', function (data) { taskList.refresh({ onSuccess: function () { taskList.fireClick(0); } }); });

                break;
        }
    }

    function onWFComplete(obj) {
        MConfirm.setWidth(250).show('流程完成将会修改仓库库存信息！').evt('onOk', function () {
            $.Util.ajax({ args: 'm=SYS_CM_WH&action=onReceiveComplete&tkId=' + tkId });
        });
    }

    function onWFRights(wf, ToolBar, Node) {
        switch (+Node.treeOrder) {
            case 1:
                var _carP = taskInfo.addPanel({ title: '车辆列表' }).css('height:320px;position: relative;background-color: #fff;border: 1px solid #ededed;border-bottom-color: #d5d5d5;box-shadow: 0 1px 2px #eee;');
                var _macP = taskInfo.addPanel({ title: '机具列表' }).css('height:320px;position: relative;background-color: #fff;border: 1px solid #ededed;border-bottom-color: #d5d5d5;box-shadow: 0 1px 2px #eee;');
                var carAry = [
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
                    { title: '调出日期', name: 'recallTime', type: 'date', width: 130 },
                    { title: '调进日期', name: 'reinTime', type: 'date', width: 130 },
                    { title: '当前使用人', name: 'usePerson', type: 'none', ifTrans: true, trans: 'SYS_TRANS_USER', width: 120 },
                    { title: '当前状况', name: 'status', type: 'none', ifTrans: true, width: 120 },
                    { title: '备注', name: 'note', type: 'none', width: 120 }
                ];
                var macAry = [
                    { type: 'checkbox', width: 40 },
                    { title: '<font class="c_6">使用状态</font>', name: 'state', type: 'select', ifTrans: true, width: 100, ifFilter: true, filterItems: ['equal'], gtID: 366 },
                    { title: '设备编号', name: 'deviceCode', type: 'none', width: 110, ifFilter: true, filterItems: ['like'] },
                    { title: '设备名称', name: 'deviceName', type: 'none', width: 110 },
                    { title: '型号', name: 'deviceType', type: 'none', width: 110 },
                    { title: '主要规格', name: 'guiGe', type: 'none', width: 110 },
                    { title: '复杂系数机', name: 'xiShuJi', type: 'none', width: 110 },
                    { title: '复杂系数电', name: 'xiShuDian', type: 'none', width: 110 },
                    { title: '电机型号', name: 'dianJiXinHao', type: 'none', width: 110 },
                    { title: '电机功率KW', name: 'dianJiGongLv', type: 'none', width: 110 },
                    { title: '制造厂', name: 'maker', type: 'none', width: 110 },
                    { title: '出厂日期', name: 'outTime', type: 'date', width: 130 },
                    { title: '投产日期', name: 'useTime', type: 'date', width: 130 },
                    { title: '备注', name: 'note', comType: 'none', width: 150 }
                ];
                var _cList = new $.UI.List({ p: _carP, aHeader: carAry, loadApi: 'm=SYS_TABLE_BASE&table=DEVICE_CAR&action=pagingForList&jsonCondition={"state":367}', ifEnabledFilter: true, colControls: { header: { height: 30 }, paging: { pageSize: 5, pageIndex: 1}} });
                var _mList = new $.UI.List({ p: _macP, aHeader: macAry, loadApi: 'm=SYS_TABLE_BASE&table=DEVICE_MACHINES&action=pagingForList&jsonCondition={"state":367}', ifEnabledFilter: true, colControls: { header: { height: 30 }, paging: { pageSize: 5, pageIndex: 1}} });
                ToolBar.addItem({
                    text: '选择车辆与机具',
                    icon: 'icon-glyph-check',
                    cn: 'mr10',
                    onClick: function () {
                        var _cIds = _cList.getAttr('selIds') || [], _mIds = _mList.getAttr('selIds') || [];
                        if (_cIds.length > 0 && _mIds.length > 0) { MTips.show('请先选择车辆与机具', 'warn'); return false; }
                        MConfirm.setWidth(350).show('确定选择车辆与机具?').evt('onOk', function () {
                            $.Util.ajax({
                                args: 'm=SYS_CM_DEVICE&action=setDevicesById&tkId=' + tkId + '&cars=' + _cIds.join(',') + '&machines=' + _mIds.join(','),
                                onSuccess: function () { MTips.show('选择成功', 'ok'); }
                            });
                        });
                    }
                });
                break;
            case 2:
                var _infoAry = [
                    { name: 'endTime', title: '结束时间', comType: 'Timer', req: true, group: { name: 'g1', width: 280} },
                    { name: 'operator', title: '操作人', comType: 'Input', req: true, group: 'g1' },
                    { name: 'cost', title: '台班费', comType: 'KeyInput', dataType: 'double', group: 'g1' }
                ];
                var _eExt = taskInfo.addPanel({ title: '结算产值' }).css('height:auto;position: relative;background-color: #fff;border: 1px solid #ededed;border-bottom-color: #d5d5d5;box-shadow: 0 1px 2px #eee;');
                var _form = new $.UI.Form({ p: _eExt, ifFixedHeight: false, state: 'Update', loadApi: 'm=SYS_TABLE_BASE&table=DEVICE_APPLY&action=getByID', updateApi: 'm=SYS_TABLE_BASE&table=DEVICE_APPLY&action=updateByID', items: _infoAry, foot_h: 35, onSubmitSuccess: function (obj) { taskList.refresh(); } });
                _form.loadDataByID(tkId, function (obj) { _form.items['endTime'].set('isChange', true); });
                break;
        }
    }

    function onWFLoad(obj) {
        if (+obj.currNode.treeOrder != 1) {
            var carAry = [
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
                { title: '调出日期', name: 'recallTime', type: 'date', width: 130 },
                { title: '调进日期', name: 'reinTime', type: 'date', width: 130 },
                { title: '当前使用人', name: 'usePerson', type: 'none', ifTrans: true, trans: 'SYS_TRANS_USER', width: 120 },
                { title: '当前状况', name: 'status', type: 'none', ifTrans: true, width: 120 },
                { title: '备注', name: 'note', type: 'none', width: 120 }
            ];
            var macAry = [
                { title: '<font class="c_6">使用状态</font>', name: 'state', type: 'select', ifTrans: true, width: 100, ifFilter: true, filterItems: ['equal'], gtID: 366 },
                { title: '设备编号', name: 'deviceCode', type: 'none', width: 110, ifFilter: true, filterItems: ['like'] },
                { title: '设备名称', name: 'deviceName', type: 'none', width: 110 },
                { title: '型号', name: 'deviceType', type: 'none', width: 110 },
                { title: '主要规格', name: 'guiGe', type: 'none', width: 110 },
                { title: '复杂系数机', name: 'xiShuJi', type: 'none', width: 110 },
                { title: '复杂系数电', name: 'xiShuDian', type: 'none', width: 110 },
                { title: '电机型号', name: 'dianJiXinHao', type: 'none', width: 110 },
                { title: '电机功率KW', name: 'dianJiGongLv', type: 'none', width: 110 },
                { title: '制造厂', name: 'maker', type: 'none', width: 110 },
                { title: '出厂日期', name: 'outTime', type: 'date', width: 130 },
                { title: '投产日期', name: 'useTime', type: 'date', width: 130 },
                { title: '备注', name: 'note', comType: 'none', width: 150 }
            ];
            var _carP = taskInfo.addPanel({ title: '车辆列表' }).css('height:320px;position: relative;background-color: #fff;border: 1px solid #ededed;border-bottom-color: #d5d5d5;box-shadow: 0 1px 2px #eee;');
            var _macP = taskInfo.addPanel({ title: '机具列表' }).css('height:320px;position: relative;background-color: #fff;border: 1px solid #ededed;border-bottom-color: #d5d5d5;box-shadow: 0 1px 2px #eee;');
            new $.UI.List({ p: _carP, aHeader: carAry, loadApi: 'm=SYS_CM_DEVICE&action=getDevicesById&type=0&id=' + tkId, ifEnabledFilter: true, colControls: { header: { height: 30}} });
            new $.UI.List({ p: _macP, aHeader: macAry, loadApi: 'm=SYS_CM_DEVICE&action=getDevicesById&type=1&id=' + tkId, ifEnabledFilter: true, colControls: { header: { height: 30}} });
        }
    }
    function onTaskClick(obj) { var _tg = obj.Target; tkId = _tg.getAttr('id'); delayShowInfo(_tg.getAttr('wfId')); }
    function delayShowInfo(wfId) {
        if (!taskInfo) { setTimeout(function () { delayShowInfo(wfId); }, 200); return; }
        taskInfo.setInstanceId(wfId);
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}