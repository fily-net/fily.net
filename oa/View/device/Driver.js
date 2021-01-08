$.namespace('$View.device');
$View.device.Driver = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var _api = 'm=SYS_TABLE_BASE&action=pagingForList&table=CAR_DRIVER', formBtn, infoF, toolBar, uList;
    function _default() { }
    function _layout() {
        var _userHAry = [
            { name: 'cb', type: 'checkbox', width: 50 },
            { name: 'type', type: 'select', ifTrans: true, title: '类型', width: 120, ifFilter: true, filterItems: ['equal'], gtID: 513 },
            { name: 'nextCheckTime', title: '提醒', sqlName: 'dbo.SYS_CHECK_VALIDTIME(nextCheckTime, getdate(), 90, 30)', type: 'none', width: 130 },
            { name: 'nodeName', type: 'none', title: '驾驶员姓名', width: 100, ifFilter: true, filterItems: ['like'] },
            { name: 'sex', type: 'select', ifTrans: true, title: '性别', width: 60, ifFilter: true, filterItems: ['equal'], gtID:131 },
            { name: 'birthday', type: 'date', title: '出生年月', width: 140, ifFilter: true, filterItems: ['equal'] },
            { name: 'idNumber', type: 'none', title: '身份证号', width: 140, ifFilter: true, filterItems: ['like'] },
            { name: 'getLicenseTime', type: 'date', title: '初领证日期', width: 140, ifFilter: true, filterItems: ['equal'] },
            { name: 'address', type: 'none', title: '地址', width: 150 },
            { name: 'driverCode', type: 'none', title: '驾照编号', width: 150, ifFilter: true, filterItems: ['like'] },
            { name: 'carType', type: 'select', ifTrans: true, title: '准驾车型', width: 220, ifFilter: true, filterItems: ['equal'], gtID: 372 },
            { name: 'department', ifTrans: true, trans: 'SYS_TRANS_ROLE', title: '部门', width: 80 },
            { name: 'mobilePhoneNum', type: 'none', title: '移动电话', width: 120 },
            { name: 'note', type: 'none', title: '备注', width: 150 }
        ];
        var _userInfo = [
            { name: 'avatar', title: '', comType: 'Label', group: { name: 'g1', width: 320 }, type: 'image', ifSubmit: false },
            { name: 'code', title: '驾驶员编号', comType: 'Input', group: 'g1', req: true, sErr: '驾驶员编号必填' },
            { name: 'nodeName', title: '驾驶员姓名', comType: 'Input', group: 'g1', req: true, sErr: '驾驶员姓名必填' },
            { name: 'sex', title: '性别', comType: 'Radios', gtID: 131, value: 132, defText: 132, group: 'g1' },
            { name: 'birthday', title: '出生年月', comType: 'Date', group: { name: 'g2', width: 320} },
            { name: 'idNumber', title: '身份证号码', comType: 'Input', group: 'g2' },
            { name: 'getLicenseTime', title: '初领证日期', comType: 'Date', group: 'g2' },
            { name: 'address', title: '地址', comType: 'Input', group: 'g2' },
            { name: 'driverCode', title: '驾照编号', group: 'g2', comType: 'Input' },
            { name: 'carType', title: '准驾车型', comType: 'Select', group: 'g2', ifTrans: true, gtID: 372, popWidth: 350 },
            { name: 'type', title: '类型', comType: 'Select', group: { name: 'g3', width: 320 }, ifTrans: true, gtID: 513, req: true, onChange: function (obj) { if (obj.Value == '514') { obj.FormItem.next.show(); } else { obj.FormItem.next.hide(); } } },
            { name: 'department', title: '部门', comType: 'Select', trans: 'SYS_TRANS_ROLE', loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid":3}', group: 'g3', visibled: false },
            { name: 'mobilePhoneNum', title: '联系电话', group: 'g3', comType: 'Input' },
            { name: 'nextCheckTime', title: '下次检测日', comType: 'Date', group: 'g3' },
            { name: 'note', title: '备注', comType: 'TextArea', group: 'g3' }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'userTips': { head_h: 30, title: '驾驶员管理', icon: 'icon-glyph-user', cn: 'b0', onToolBarClick: onToolBarClick, toolBarSkin: 'mr10 Button-default', gbsID: 86 },
            'userList': { aHeader: _userHAry, ifEnabledFilter: true, loadApi: _api, colControls: { header: {}, paging: {} }, onTDClick: onUserClick, onSuccess: function (obj) { if (obj.Length) { obj.List.fireClick(0); } else { toolBar.fireClick(0); } } },
            'userForm': { head_h: 30, icon_h: 18, loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=CAR_DRIVER', insertApi: 'm=SYS_TABLE_BASE&action=addRow&table=CAR_DRIVER', updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=CAR_DRIVER', title: '驾驶员基本信息', icon: 'icon-vector-info-card', items: _userInfo, onFinishInit: onFormInit, onSubmitSuccess: onFormSubmitSuccess },
            'userLayout': { min: 200, max: 500, start: 320, dir: 'ns', dirLock: 2, isRoot: true }
        }
        var viewStruct = {
            p: owner,
            type: 'Layout',
            name: 'userLayout',
            eHead: {
                type: 'Tips',
                name: 'userTips',
                body: { type: 'List', name: 'userList' }
            },
            eFoot: { type: 'Form', name: 'userForm' }
        }
        coms = $.layout({ args: comArgs, struct: viewStruct });
        toolBar = coms.userTips.toolBar; infoF = coms.userForm; uList = coms.userList;
    }
    function _event() { }
    function _override() { }
    function onFormInit(obj) { formBtn = infoF.getButton('FORM-SYS-SUBMIT'); }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            case '87':
                infoF.set('state', 'Insert').reset().focus();
                formBtn.setIcon('icon-glyph-plus-sign').setText('添加驾驶员');
                break;
            case '88':
                var _ids = uList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择人', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除该' + _ids.length + '项记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_BASE&table=CAR_DRIVER&action=deleteByIDs&ids=' + _ids.join(','),
                        onSuccess: function () { uList.refresh() }
                    });
                });
                break;
        }
    }

    function onFormSubmitSuccess(obj) {
        switch (obj.Form.get('state').trim()) {
            case 'Update':
                MTips.show('修改信息成功', 'ok'); uList.refresh();
                break;
            case 'Insert':
                MTips.show('添加信息成功', 'ok'); uList.refresh(); obj.Form.reset().set('state', 'Insert').focus();
                break;
        }
    }

    function onUserClick(obj) { delayShowInfo(obj.Target.getAttr('rowId')); }
    function delayShowInfo(id) {
        if (!infoF) { setTimeout(function () { delayShowInfo(id); }, 200); return; }
        infoF.loadDataByID(id, function () { formBtn.setIcon('icon-glyph-edit').setText('修改驾驶员信息'); });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}