$.namespace('$View.tz');
$View.tz.Measure = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, rootID: 336 };
    var toolBar, addSort, addZC, mainList, popTips, _sort, _type, currID;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { name: 'id', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'depth', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'type', type: 'attr' },
            { name: 'nodeName', type: 'none' }
        ];
        var tbAry = [
            { name: 'searchAllTasks', text: '查询所有任务', cn: 'mr5', icon: 'icon-glyph-search' },
            { name: 'addSort', text: '添加类型', cn: 'mr5', icon: 'icon-glyph-plus' },
            { name: 'addZC', text: '添加计量器具', cn: 'mr5', icon: 'icon-glyph-plus-sign', visibled: false }
        ];
        var hAry = [
            { name: 'id', type: 'attr' },
            { title: '器具ID', name: 'id', type: 'none', width: 50 },
            { title: '器具类型', name: 'nodeName', sqlName: 'nodeName', type: 'none', width: 130 },
            { title: '扫描码', name: 'scanCode', type: 'none', width: 120 },
            { title: '器具编码', name: 'wareCode', type: 'none', width: 100 },
            { title: '器具编号', name: 'wareNumber', type: 'none', width: 120 },
            { title: '器具型号', name: 'wareMode', type: 'none', ifEnabledTips: true, width: 60 },
            { title: '主要规格', name: 'wareFormat', type: 'none', width: 80 },
            { title: '制造单位', name: 'madeUnits', ifEnabledTips: true, type: 'none', width: 80 },
            { title: '使用单位', name: 'usedUnits', ifTrans: true, trans: 'SYS_TRANS_ROLE', type: 'none', width: 80 },
            { title: '投用日期', name: 'usedTime', type: 'date', width: 125 },
            { title: '鉴定类型', name: 'assessType', ifTrans: true, type: 'none', width: 60 },
            { title: '上次送检定日期', name: 'preCheckTime', type: 'date', width: 120 },
            { title: '检查周期', name: 'checkCycle', ifTrans: true, type: 'none', width: 60 },
            { title: '下次维修时间', name: 'repairTime', sqlName: 'dbo.SYS_CHECK_VALIDTIME(repairTime, getdate(), 90, 30)', type: 'none', width: 125, ifFilter: 1, ifSort: 1 },
            { title: '备注', ifEnabledTips: true, name: 'note', type: 'none', width: 100 }
        ];
        var comArgs = {
            'rootTips': { head_h: 33, foot_h: 0, cn: 'b0', title: '计量器具管理', icon: 'icon-glyph-align-left', toolBarSkin: 'Button-default', toolBarAry: tbAry, onToolBarClick: onToolBarClick },
            'rootLayout': { min: 180, max: 300, isRoot: 1, start: 220, dir: 'we', dirLock: 1 },
            'treeList': { aHeader: _mHeaderAry, style: 'tree:nodeName', ifShowIcon: 'type', table: 'SYS_CM_GLOBAL_TABLE', rootID: args.rootID, onTDClickBefore: onClickBefore },
            'mainList': { aHeader: hAry, loadApi: 'm=SYS_TABLE_BASE&action=pagingForList&table=TZ_MEASURE', colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onTDDoubleClick: onListTDDoubleClick, onTDClick: onListClick }
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
        coms = $.layout({ args: comArgs, struct: struct });
        toolBar = coms.rootTips.toolBar; addSort = toolBar.items['addSort']; addZC = toolBar.items['addZC']; mainList = coms.mainList;
    }
    function _event() { }
    function _override() { }
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
                //新建消防器具记录
                var infoAry = [
                    { name: 'scanCode', comType: 'ScanCode', title: '扫描码', group: { name: 'g1', width: 320} },
                    { name: 'nodeName', comType: 'Input', title: '器具名称', group: 'g1' },
                    { name: 'wareCode', comType: 'Input', title: '器具编码', group: 'g1', req: true, sErr: '名称不能为空' },
                    { name: 'wareNumber', comType: 'Input', title: '器具编号', group: 'g1', req: true, sErr: '编号不能为空' },
                    { name: 'wareMode', comType: 'Input', title: '器具型号', group: 'g1', req: true, sErr: '型号不能为空' },
                    { name: 'wareFormat', comType: 'Input', title: '主要规格', group: 'g1' },
                    { name: 'wareAccuracy', comType: 'Input', title: '精确度', group: { width: 320, name: 'g2'} },
                    { name: 'usedUnits', comType: 'Select', title: '使用单位', loadApi: 'm=SYS_TABLE_TREE&table=SYS_CM_ROLE&action=getNodesByPid&pid=3', req: true, sErr: '使用单位不能为空', group: 'g2' },
                    { name: 'usedTime', comType: 'Date', title: '投用日期', group: 'g2' },
                    { name: 'serialNumber', comType: 'Input', title: '出厂编号', group: 'g2' },
                    { name: 'madeUnits', comType: 'Input', title: '制造单位', group: 'g2' },
                    { name: 'assessType', comType: 'Select', gtID: 166, title: '鉴定类别', group: 'g2' },
                    { name: 'assetNumber', comType: 'Input', title: '资产编号', group: { width: 320, name: 'g3'} },
                    { name: 'origiCost', comType: 'Input', title: '原值', group: 'g3' },
                    { name: 'checkCycle', comType: 'Select', gtID: 167, title: '检查周期', group: 'g3', onChange: onSelectChange },
                    { name: 'nextCheckTime', comType: 'Label', title: '下次送检定日期', group: 'g3' },
                    { name: 'note', comType: 'TextArea', title: '备注', group: 'g3' }
                ], _code = getBarCodeString();
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建项目', comMode: 'x-auto', y: 40, ifMask: true, ifClose: true, width: 650, ifFixedHeight: false });
                popTips.Form = new $.UI.Form({ p: popTips.body, insertApi: 'm=SYS_TABLE_BASE&table=TZ_ZICHAN&action=addRow', extSubmitVal: { wareSort: _sort, wareType: _type }, items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; mainList.refresh(); } });
                popTips.Form.items[0].setData(_code, _code, false);
                break;
            case 'searchAllTasks':
                new $.UI.View({ p: args.p, currID: currID, url: 'View/tz/MeasureFlow.js' });
                break;
        }
    }
    function onSelectDept(obj) { obj.FormItem.next.reset().set('loadApi', 'm=SYS_CM_USERS&action=getUsersByDept&dept=' + obj.Value); }
    function onListClick(obj) { currID = obj.Target.getAttr('rowid'); }
    function onListTDDoubleClick(obj) { new $.UI.View({ p: args.p, currID: obj.getAttr('rowid'), url: 'View/tz/MeasureFlow.js' }); }
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

    function onClickBefore(obj) {
        var _eTR = obj.eTr, _jc;
        if (_eTR) {
            var _depth = +_eTR.attr('depth')
            switch (_depth) {
                case 5:
                    addSort.show(); addZC.hide(); _sort = _eTR.attr('id'); _jc = '{"wareSort":' + _sort + '}';
                    break;
                case 6:
                    _sort = _eTR.attr('pid'); _type = _eTR.attr('id'); _jc = '{"wareSort":' + _sort + ', "wareType": ' + _type + '}';
                    addSort.hide(); addZC.show();
                    break;
            }
        }
        mainList.loadAjax({ args: 'm=SYS_TABLE_BASE&action=pagingForList&table=TZ_MEASURE&jsonCondition=' + _jc, cbFn: { onSuccess: function () {  } } });
    }

    function getBarCodeString() {
        var _val = '', _now = new Date(), _h = _now.getHours(), _m = _now.getMinutes(), _s = _now.getSeconds();
        _h = _h < 10 ? ('0' + _h) : _h;
        _m = _m < 10 ? ('0' + _m) : _m;
        _s = _s < 10 ? ('0' + _s) : _s;
        _val = _now.date8() + _h + _m + _s;
        return _val;
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}