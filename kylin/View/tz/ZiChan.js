$.NameSpace('$View.tz');
$View.tz.ZiChan = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, rootID: 222 };
    var coms = {}, toolBar, mainList, popTips, _sort, _type, currID;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { name: 'id', type: 'attr' },
            { name: 'nodeName', type: 'none' }
        ];
        var tbAry = [
            { name: 'searchAllTasks', text: '查询所有任务', cn: 'mr5', icon: 'icon-glyph-search' },
        //{ name: 'addSort', text: '添加类型', cn: 'mr5' },
            {name: 'addZC', text: '添加资产', cn: 'mr5', skin: 'Button-blue' }
        ];
        var hAry = [
            { title: 'ID', name: 'id', type: 'attr' },
            { title: '扫描码', name: 'scanCode', type: 'none', width: 120, ifFilter: true, filterItems: ['like'] },
            { title: '资产编号', name: 'zcCode', type: 'none', width: 100, ifFilter: true, filterItems: ['like'] },
            { title: '原资产编号', name: 'zcOrigalCode', type: 'none', width: 80, ifFilter: true, filterItems: ['like'] },
            { title: '资产名称', name: 'zcName', type: 'none', width: 150, ifFilter: true, filterItems: ['like'] },
            { title: '规格类型', name: 'zcNorm', type: 'none', width: 150, ifFilter: true, filterItems: ['like'] },
            { title: '计量单位', name: 'zcUnits', ifTrans: true, type: 'select', gtID: 252, width: 80, ifFilter: true, filterItems: ['equal'] },
            { title: '管理部门', name: 'zcMgDept', ifTrans: true, trans: 'SYS_TRANS_ROLE', type: 'select', loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid":"3"}', width: 80, ifFilter: true, filterItems: ['equal'] },
            { title: '保管人', name: 'zcKeeper', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 80 },
            { title: '使用部门', name: 'zcUseDept', ifTrans: true, trans: 'SYS_TRANS_ROLE', type: 'select', loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid":"3"}', width: 80, ifFilter: true, filterItems: ['equal'] },
            { title: '使用人', name: 'zcUser', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 80 },
            { title: '存放地点', name: 'zcStorage', type: 'none', width: 80 },
            { title: '折旧费分摊信息', name: 'zcAssessedInfo', type: 'none', width: 120 },
            { title: '购买时间', name: 'zcBuyTime', type: 'date', width: 130 },
            { title: '实物入账时间', name: 'zcPATime', type: 'date', width: 130 },
            { title: '财务入账时间', name: 'zcFATime', type: 'date', width: 130 },
            { title: '币种', name: 'zcCurrency', ifTrans: true, type: 'none', width: 80 },
            { title: '资产原值', name: 'zcOrigalCost', type: 'none', width: 80 },
            { title: '资产值', name: 'zcCost', type: 'none', width: 80 },
            { title: '提供商', name: 'zcProvider', type: 'none', width: 80 },
            { title: '修理电话', name: 'zcMaintainPhone', type: 'none', width: 80 },
            { title: '折旧费', name: 'zcDepreciation', type: 'none', width: 80 },
            { title: '月折旧费', name: 'zcMonthDepreciation', type: 'none', width: 80 },
            { title: '存值', name: 'zcRemainValue', type: 'none', width: 80 },
            { title: '逾龄资产', name: 'ifOverYear', ifTrans: true, type: 'none', width: 80 },
            { title: '当前使用状态', name: 'invalidState', ifTrans: true, type: 'none', width: 80 },
            { title: '租赁状态', name: 'leasState', ifTrans: true, type: 'none', width: 80 },
            { title: '备注', name: 'note', type: 'none', width: 150, ifFilter: 1, ifSort: 1 }
        ];
        var infoAry = [
            { title: '扫描码', name: 'scanCode', comType: 'ScanCode', group: { name: 'g1', width: 320 }, req: 1 },
            { title: '资产编号', name: 'zcCode', comType: 'Input', group: 'g1' },
            { title: '原资产编号', name: 'zcOrigalCode', comType: 'Input', group: 'g1' },
            { title: '资产名称', name: 'zcName', comType: 'Input', group: 'g1' },
            { title: '规格类型', name: 'zcNorm', comType: 'Input', group: 'g1' },
            { title: '计量单位', name: 'zcUnits', comType: 'Select', gtID: 233, group: 'g1' },
            { title: '管理部门', name: 'zcMgDept', comType: 'Select', loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid":"3"}', group: 'g1', onChange: onSelectDept },
            { title: '保管人', name: 'zcKeeper', comType: 'Select', group: 'g1', textKey: 'uid' },
            { title: '使用部门', name: 'zcUseDept', comType: 'Select', loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid":"3"}', group: 'g1', onChange: onSelectDept },
            { title: '使用人', name: 'zcUser', comType: 'Select', group: 'g1', textKey: 'uid' },
            { title: '存放地点', name: 'zcStorage', comType: 'Input', group: 'g1' },
            { title: '折旧费信息', name: 'zcAssessedInfo', comType: 'Input', group: 'g1' },
            { title: '购买时间', name: 'zcBuyTime', comType: 'Date', group: 'g1' },
            { title: '实物入账时间', name: 'zcPATime', comType: 'Date', group: 'g1' },
            { title: '财务入账时间', name: 'zcFATime', comType: 'Date', group: { name: 'g2', width: 320} },
            { title: '币种', name: 'zcCurrency', comType: 'Select', gtID: 243, group: 'g2' },
            { title: '资产原值', name: 'zcOrigalCost', comType: 'KeyInput', group: 'g2' },
            { title: '资产值', name: 'zcCost', comType: 'KeyInput', group: 'g2' },
            { title: '提供商', name: 'zcProvider', comType: 'Input', group: 'g2' },
            { title: '修理电话', name: 'zcMaintainPhone', comType: 'Input', group: 'g2' },
            { title: '折旧费', name: 'zcDepreciation', comType: 'KeyInput', dataType: 'double', group: 'g2' },
            { title: '月折旧费', name: 'zcMonthDepreciation', comType: 'KeyInput', dataType: 'double', group: 'g2' },
            { title: '存值', name: 'zcRemainValue', comType: 'KeyInput', dataType: 'double', group: 'g2' },
            { title: '逾龄资产', name: 'ifOverYear', comType: 'Select', gtID: 7, group: 'g2' },
            { title: '当前使用状态', name: 'invalidState', comType: 'Select', gtID: 247, group: 'g2' },
            { title: '租赁状态', name: 'leasState', comType: 'Select', gtID: 7, group: 'g2' },
            { title: '备注', name: 'note', comType: 'TextArea', group: 'g2' }
        ]
        var comArgs = {
            'rootTips': { head_h: 33, foot_h: 0, cn: 'b0', title: '固定资产管理', icon: 'icon-glyph-align-left', toolBarSkin: 'Button-default', toolBarAry: tbAry, onToolBarClick: onToolBarClick },
            'rootLayout': { min: 180, max: 300, isRoot: 1, start: 200, dir: 'we', dirLock: 1 },
            'infoLayout': { min: 180, max: 400, start: 320, dir: 'ns', dirLock: 2 },
            'infoForm': { items: infoAry },
            'treeList': { aHeader: _mHeaderAry, ifShowIcon: 'type', loadApi: 'm=SYS_TABLE_TREE&action=getNodesByPid&table=GENERAL_MS&pid=5', onTDClick: onTypeClick, onSuccess: function (obj) { obj.List.fireClick(0); } },
            'mainList': { aHeader: hAry, ifEnabledFilter: true, loadApi: 'm=SYS_TABLE_BASE&action=pagingForList&table=TZ_ZICHAN', colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onTDDoubleClick: onListTDDoubleClick, onTDClick: onListClick }
        };
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootTips',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'List', name: 'treeList' },
                eFoot: { type: 'List', name: 'mainList' }
            }
        };
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        toolBar = coms.rootTips.toolBar; mainList = coms.mainList;
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'addSort':
                if (!_sort) { _sort = 222; }
                popTips = new $.UI.PopDialog({ p: $DB, ifClose: true, css: 'max-width:165px;padding:10px;' });
                popTips.clearHTML(false).set('ePop', obj.Owner).init({
                    type: 'Form', ifFixedHeight: false, state: 'Insert',
                    btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '新建(Add)', icon: 'icon-glyph-plus', align: 'right'}],
                    items: [{ name: 'nodeName', comType: 'TextArea', ifHead: false, req: true}],
                    insertApi: 'm=SYS_TABLE_TREE&action=addTreeNodeByPid&table=TZ_ZICHAN&pid=' + _sort
                }).show().evt('onSubmitSuccess', function (j) { popTips.hide(); MTips.show('新建成功', 'ok'); });
                break;
            case 'addZC':
                if (!_type) { MTips.show('请先选择类型', 'error'); return; }
                //新建资产
                var infoAry = [
                    { title: '扫描码', name: 'scanCode', comType: 'ScanCode', group: { name: 'g1', width: 320 }, req: 1 },
                    { title: '资产编号', name: 'zcCode', comType: 'Input', group: 'g1' },
                    { title: '原资产编号', name: 'zcOrigalCode', comType: 'Input', group: 'g1' },
                    { title: '资产名称', name: 'zcName', comType: 'Input', group: 'g1' },
                    { title: '规格类型', name: 'zcNorm', comType: 'Input', group: 'g1' },
                    { title: '计量单位', name: 'zcUnits', comType: 'Select', gtID: 233, group: 'g1' },
                    { title: '管理部门', name: 'zcMgDept', comType: 'Select', loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid":"3"}', group: 'g1', onChange: onSelectDept },
                    { title: '保管人', name: 'zcKeeper', comType: 'Select', group: 'g1', textKey: 'uid' },
                    { title: '使用部门', name: 'zcUseDept', comType: 'Select', loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid":"3"}', group: 'g1', onChange: onSelectDept },
                    { title: '使用人', name: 'zcUser', comType: 'Select', group: 'g1', textKey: 'uid' },
                    { title: '存放地点', name: 'zcStorage', comType: 'Input', group: 'g1' },
                    { title: '折旧费信息', name: 'zcAssessedInfo', comType: 'Input', group: 'g1' },
                    { title: '购买时间', name: 'zcBuyTime', comType: 'Date', group: 'g1' },
                    { title: '实物入账时间', name: 'zcPATime', comType: 'Date', group: 'g1' },
                    { title: '财务入账时间', name: 'zcFATime', comType: 'Date', group: { name: 'g2', width: 320} },
                    { title: '币种', name: 'zcCurrency', comType: 'Select', gtID: 243, group: 'g2' },
                    { title: '资产原值', name: 'zcOrigalCost', comType: 'KeyInput', group: 'g2' },
                    { title: '资产值', name: 'zcCost', comType: 'KeyInput', group: 'g2' },
                    { title: '提供商', name: 'zcProvider', comType: 'Input', group: 'g2' },
                    { title: '修理电话', name: 'zcMaintainPhone', comType: 'Input', group: 'g2' },
                    { title: '折旧费', name: 'zcDepreciation', comType: 'KeyInput', dataType: 'double', group: 'g2' },
                    { title: '月折旧费', name: 'zcMonthDepreciation', comType: 'KeyInput', dataType: 'double', group: 'g2' },
                    { title: '存值', name: 'zcRemainValue', comType: 'KeyInput', dataType: 'double', group: 'g2' },
                    { title: '逾龄资产', name: 'ifOverYear', comType: 'Select', gtID: 7, group: 'g2' },
                    { title: '当前使用状态', name: 'invalidState', comType: 'Select', gtID: 247, group: 'g2' },
                    { title: '租赁状态', name: 'leasState', comType: 'Select', gtID: 7, group: 'g2' },
                    { title: '备注', name: 'note', comType: 'TextArea', group: 'g2' }
                ], _code = getBarCodeString();
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新增资产', comMode: 'x-auto', y: 40, ifMask: true, ifClose: true, width: 650, ifFixedHeight: false });
                popTips.Form = new $.UI.Form({ p: popTips.body, insertApi: 'm=SYS_TABLE_BASE&table=TZ_ZICHAN&action=addRow', extSubmitVal: { zcType: _type }, items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; mainList.refresh(); } });
                popTips.Form.items[0].setData(_code, _code, false);
                break;
            case 'searchAllTasks':
                new $.UI.View({ p: args.p, currID: currID, url: 'View/tz/ZiChanFlow.js' });
                break;
        }
    }
    function onSelectDept(obj) { obj.FormItem.next.reset().set('loadApi', 'm=SYS_CM_USERS&action=getUsersByDept&dept=' + obj.Value); }
    function onListClick(obj) {
        currID = obj.Target.getAttr('rowid');

    }
    function onListTDDoubleClick(obj) { new $.UI.View({ p: args.p, currID: obj.getAttr('rowid'), url: 'View/tz/ZiChanFlow.js' }); }
    function onValidChange(obj) {
        var _next = obj.FormItem.next, _now = new Date(), _pVal = obj.FormItem.pre.getValue(), _mNum;
        if (_pVal) { _now = new Date(_pVal); }
        switch (obj.Text) {
            case '半年':
                _now.setMonth(_now.getMonth() + 6); _mNum = 6; break;
            default:
                var _var = +obj.Text.split('')[0]; _now.setFullYear(_now.getFullYear() + _var); _mNum = +_var * 12; break;
        }
        _next.setData(_now.date2Str(), _now.date2Str());
        popTips.Form.setExt('validMonth', _mNum);
    }

    function onTypeClick(obj) { _type = obj.Target.getAttr('id'); mainList.loadAjax({ args: 'm=SYS_TABLE_BASE&action=pagingForList&table=TZ_ZICHAN&jsonCondition={"zcType":' + _type + '}' }); }
    function getBarCodeString() {
        var _val = '', _now = new Date(), _h = _now.getHours(), _m = _now.getMinutes(), _s = _now.getSeconds();
        _h = _h < 10 ? ('0' + _h) : _h;
        _m = _m < 10 ? ('0' + _m) : _m;
        _s = _s < 10 ? ('0' + _s) : _s;
        _val = _now.date8() + _h + _m + _s;
        return _val;
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