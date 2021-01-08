$.namespace('$View.tz');
$View.tz.Fire = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, rootID: 1 };
    var toolBar, addFire, addPlace, mainList, popTips, _address, _place;
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
            { name: 'addPlace', text: '添加地点', cn: 'mr5', icon: 'icon-glyph-plus', visibled: false },
            { name: 'addFire', text: '添加器具', cn: 'mr5', icon: 'icon-glyph-plus-sign', visibled: false }
        ];
        var hAry = [
            { title: 'ID', name: 'id', type: 'attr' },
            { title: '器具ID', name: 'id', type: 'none', width: 50 },
            { title: '扫描码', name: 'scanCode', type: 'none', comType: 'Select', width: 120, ifFilter: 1, ifSort: 1 },
            { title: '消防器名称', name: 'name', ifTrans: true, type: 'none', width: 150, ifFilter: 1, ifSort: 1 },
            { title: '消防部门', name: 'address', ifTrans: true, trans: 'SYS_TRANS_FPN', type: 'none', width: 150, ifFilter: 1 },
            { title: '放置点', name: 'place', ifTrans: true, trans: 'SYS_TRANS_FPN', type: 'none', width: 100, ifFilter: 1, ifSort: 1 },
            { title: '设置时间', name: 'setTime', type: 'date', width: 125, ifFilter: 1, ifSort: 1 },
            { title: '有效期', name: 'valid', ifTrans: true, type: 'none', width: 80, ifFilter: 1, ifSort: 1 },
            { title: '本次维修时间', name: 'mTime', sqlName: "repairTime", type: 'date', width: 125, ifFilter: 1, ifSort: 1 },
            { title: '下次维修时间', name: 'repairTime', sqlName: 'dbo.SYS_CHECK_VALIDTIME(repairTime, getdate(), 90, 30)', type: 'none', width: 125, ifFilter: 1, ifSort: 1 },
            { title: '数量', name: 'num', type: 'none', width: 45 },
            { title: '箱', name: 'box', type: 'none', width: 45 },
            { title: '备注', name: 'note', type: 'none', width: 150, ifFilter: 1, ifSort: 1 }
        ];
        var comArgs = {
            'rootTips': { head_h: 33, foot_h: 0, cn: 'b0', title: '消防器具管理', icon: 'icon-glyph-align-left', toolBarSkin: 'Button-default', toolBarAry: tbAry, onToolBarClick: onToolBarClick },
            'rootLayout': { min: 180, max: 300, isRoot: 1, start: 220, dir: 'we', dirLock: 1 },
            'treeList': { aHeader: _mHeaderAry, style: 'tree:nodeName', ifShowIcon: 'type', table: 'TZ_FIRE_PLACE', rootID: args.rootID, onTDClickBefore: onClickBefore },
            'fireType': { gtID: 196, onClick: onFireTypeClick },
            'fireList': { aHeader: hAry, loadApi: 'm=SYS_TABLE_BASE&action=pagingForList&table=TZ_FIRE_WARE', colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onTDDoubleClick: onListTDDoubleClick },
            'stuct': { items: [{ title: '放置地点分类', icon: 'icon-vector-house' }, { title: '消防器具分类', icon: 'icon-vector-hot-water-tank'}] }
        };
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootTips',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'Accordion', name: 'stuct', items: [{ type: 'List', name: 'treeList' }, { type: 'Menu', name: 'fireType'}] },
                eFoot: { type: 'List', name: 'fireList' }
            }
        };
        coms = $.layout({ args: comArgs, struct: struct });
        toolBar = coms.rootTips.toolBar; addFire = toolBar.items['addFire']; addPlace = toolBar.items['addPlace']; mainList = coms.fireList;
    }
    function _event() { }
    function _override() { }
    function onFireTypeClick(obj) {
        mainList.loadAjax({ args: 'm=SYS_TABLE_BASE&action=pagingForList&table=TZ_FIRE_WARE&jsonCondition={"name":' + obj.Value + '}' });
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'addPlace':

                break;
            case 'searchAllTasks':
                new $.UI.View({ p: args.p, url: 'View/tz/FireFlow.js' });
                break;
            case 'addFire':
                //新建消防器具记录
                var infoAry = [
                    { name: 'scanCode', comType: 'ScanCode', title: '扫描码', group: { name: 'g1', width: 320 }, req: 1 },
                    { name: 'name', comType: 'Select', gtID: 196, title: '消防器名称', group: 'g1' },
                    { name: 'num', comType: 'KeyInput', dataType: 'int', title: '数量', group: 'g1' },
                    { name: 'box', comType: 'KeyInput', dataType: 'int', title: '箱', group: 'g1' },
                    { name: 'setTime', comType: 'Date', title: '设置时间', group: { name: 'g2', width: 320} },
                    { name: 'valid', comType: 'Select', title: '有效时间', gtID: 210, group: 'g2', onChange: onValidChange },
                    { name: 'repairTime', comType: 'Label', title: '修理时间', group: 'g2' },
                    { name: 'note', comType: 'TextArea', title: '备注', group: 'g2' }
                ], _code = getBarCodeString();
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建项目', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 650, ifFixedHeight: false });
                popTips.Form = new $.UI.Form({ p: popTips.body, insertApi: 'm=SYS_TABLE_BASE&table=TZ_FIRE_WARE&action=addRow', extSubmitVal: { address: _address, place: _place }, items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; mainList.refresh(); } });
                popTips.Form.items[0].setData(_code, _code, false);
                break;
        }
    }
    function onListTDDoubleClick(obj) { new $.UI.View({ p: args.p, currID: obj.getAttr('rowid'), url: 'View/tz/FireFlow.js' }); }
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
            var _type = +_eTR.attr('type')
            switch (_type) {
                case 0:
                    addPlace.show(); addFire.hide(); _jc = '{"address":' + _eTR.attr('id') + '}';
                    break;
                case 1:
                    _address = _eTR.attr('pid'); _place = _eTR.attr('id'); _jc = '{"address":' + _address + ', "place": ' + _place + '}';
                    addPlace.hide(); addFire.show();
                    break;
                case 2:
                    addPlace.hide(); addFire.hide();
                    break;
            }
        }
        mainList.loadAjax({ args: 'm=SYS_TABLE_BASE&action=pagingForList&table=TZ_FIRE_WARE&jsonCondition=' + _jc });
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