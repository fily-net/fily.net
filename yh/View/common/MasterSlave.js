$.NameSpace('$View.common');
$View.common.MasterSlave = function (j) {
    var me = this, _fn = function () { };
    var owner, tab, btnSet;
    var url = 'm=SYS_TABLE_BASE&table=';
    var args = { p: $DB, table: '', toolBarAry: [], ifLoadData: true, childs: [], listArgs: {}, wfIndexId: 0, fnId: 0, appId: 0, gtRootID: 1, pid: null, onAddFormBefore: _fn, onMainListClick: _fn, onLoadListSuccess: _fn, onListSuccessBefore: _fn };
    var lArgs = { colControls: { header: { height: 30 }, paging: { pageSize: 20, pageIndex: 1}} };
    var popTips, mList, infoF, btnSet, toolBar;
    var coms, currID, childs = [], ifTree = false;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _lArgs = $.Util.initArgs(args.listArgs, lArgs), _pObj = _lArgs.colControls.paging;
        _lArgs.deleteApi = url + args.table + '&action=deleteByIDs';
        if (args.table && args.ifLoadData) { _lArgs.loadApi = url + args.table + '&action=pagingForList&pageSize=' + _pObj.pageSize + '&pageIndex=' + _pObj.pageIndex; }
        _lArgs.updateApi = url + args.table + '&action=updateForList';
        _lArgs.onTDClick = onMainListClick;
        _lArgs.onSuccess = function (obj) { args.onListSuccessBefore(obj, me); if (obj.Length) { obj.List.fireClick(0); } else { toolBar.fireClick(0); }; args.onLoadListSuccess(mList, childs, obj); };
        if (_lArgs.style && _lArgs.style.indexOf('tree:') != -1) { ifTree = true; }
        var comArgs = {
            'rootDiv': { head_h: 30, foot_h: 0 },
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 320, dir: 'ns', dirLock: 2 },
            'toolBar': { items: args.toolBarAry, itemSkin: 'Button-toolbar', onClick: onToolBarClick },
            'masterList': _lArgs,
            'slaveTab': { ifFixedHeight: true, head_h: 35 }
        };
        var struct = {
            p: args.p,
            type: 'BaseDiv',
            name: 'rootDiv',
            head: { type: 'ButtonSet', name: 'toolBar' },
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'List', name: 'masterList' },
                eFoot: { type: 'Tab', name: 'slaveTab' }
            }
        };
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        for (var i = 0, _iLen = args.childs.length; i < _iLen; i++) { me.addChild(args.childs[i]); }
        mList = coms.masterList; btnSet = coms.slaveTab.BtnSet; toolBar = coms.toolBar;
    }

    function onMainListClick(obj) {
        var _id = obj.Target.getAttr('rowid') || obj.Target.getAttr('id'); btnSet.setAllEnabled(true); currID = _id;
        if (!currID) { return; }
        for (var c = 0, _cLen = childs.length; c < _cLen; c++) {
            var _child = childs[c], _com = _child[1];
            switch (_child[0]) {
                case 'Form':
                    _com.loadDataByID(_id);
                    _com.show().getButton('FORM-SYS-SUBMIT').setIcon('icon-glyph-edit').setText('修改基本信息');
                    break;
                case 'List':
                    _com.loadAjax({
                        args: url + _child[2] + '&action=pagingForList&pageSize=10&pageIndex=1&jsonCondition={"oid":' + _id + '}',
                        cbFn: { onSuccess: function () { } }
                    });
                    break;
            }
        }
        args.onMainListClick(mList, childs, obj);
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'sys_add':
                onAddItem(); break;
            case 'sys_add_item':
                if (!currID) { MTips.show('请选择关联的主项', 'warn'); return; }
                onAddItem();
                break;
            case 'sys_add_main':
                currID = '0'; onAddItem(); break;
            case 'sys_delete':
                var _sIds = mList.getAttr('selIds');
                if (_sIds && _sIds.length) {
                    MConfirm.evt('onOk', function () { mList.delSelRows(); }).setWidth(250).show('确定删除已选择的<font color="red">' + _sIds.length + '</font>项记录?');
                } else {
                    MTips.show('请先选择要删除的记录!', 'warn')
                }
                break;
            case 'sys_refresh':
                mList.refresh();
                break;
            case 'sys_print':

                break;
            case 'sys_saveAsExcel':

                break;
            case 'sys_copyToExcel':

                break;
            case 'sys_managerTables':
                popTips = new $.UI.Tips({ width: 700, height: 500, icon: 'icon-glyph-list-alt', comMode: 'auto', title: '功能模块对照表管理', head_h: 25, ifMask: true, ifDrag: false, ifClose: true });
                new $.UI.View({ p: popTips.body, url: 'View/common/TreeList.js', table: 'SYS_CM_GLOBAL_TABLE', rootID: args.gtRootID });
                break;
        }
    }

    function onAddItem() {
        if (args.onAddFormBefore(infoF) != false) {
            var _scFI = infoF.items['scanCode'], _btns = btnSet.aItem;
            coms['slaveTab'].setSelTab(0);
            for (var i = 1; i < _btns.length; i++) { _btns[i].setEnabled(false); }
            infoF.show().set('state', 'Insert').reset().focus();
            if (_scFI) { var _cStr = getBarCodeString(); _scFI.setData(_cStr, _cStr); }
            if (args.pid) { infoF.set('insertApi', 'm=SYS_TABLE_TREE&action=addTreeNodeByPid&table=' + args.table + '&pid=' + args.pid); }
            infoF.getButton('FORM-SYS-SUBMIT').setIcon('icon-glyph-plus-sign').setText('添加基本信息');
        }
    }


    function onSlaveMenuClick(iObj, _obj, list) {
        if (!currID) { MTips.show('请先选择关联的主表记录', 'warn'); return; }
        switch (iObj.Value) {
            case 'sys_list_clear':
                MConfirm.evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_BASE&api=deleteByOid&table=' + _obj.table + "&oid=" + currID,
                        onSuccess: function () { MTips.show('清空成功', 'ok'); list.refresh(); },
                        onError: function () { MTips.show('清空失败', 'warn'); }
                    });
                }).setWidth(250).show('确定清空关联的记录?');
                break;
            case 'sys_list_delete':
                var _sels = list.getAttr('selIds');
                if (_sels && _sels.length) {
                    MConfirm.evt('onOk', function () {
                        $.Util.ajax({
                            args: 'm=SYS_TABLE_BASE&api=deleteByIDs&table=' + _obj.table + '&ids=' + _sels.join(','),
                            onSuccess: function () { MTips.show('删除成功', 'ok'); list.refresh(); },
                            onError: function () { MTips.show('删除失败', 'warn'); }
                        });
                    }).setWidth(250).show('确定删除选中记录?');
                } else {
                    MTips.show('请选择记录', 'warn');
                }
                break;
            case 'sys_list_add':
                popTips = new $.UI.Tips({ width: 350, icon: 'icon-glyph-plus', comMode: 'x-auto', y: 200, title: '添加<font color="red">' + _obj.text + '</font>', head_h: 25, ifFixedHeight: false, ifMask: true, ifDrag: false, ifClose: true });
                var _form = new $.UI.Form({ p: popTips.body, ifFixedHeight: false, btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '新建', icon: 'icon-glyph-plus', css: 'margin-left:102px;'}], insertApi: 'm=SYS_TABLE_BASE&api=addRow&table=' + _obj.table, items: _obj.formItemAry, foot_h: 32, extSubmitVal: { oid: currID} });
                _form.evt('onSubmitSuccess', function () { MTips.show('添加成功', 'ok'); _form.reset(); list.refresh(); popTips.remove(); popTips = null; })
                     .evt('onSubmitError', function () { MTips.show('添加失败', 'warn'); });
                break;
        }
    }

    me.addChild = function (o) {
        var _obj = o || {}, _type = _obj.type, _com;
        var _item = coms['slaveTab'].addTabItem(_obj), _cArgs = _obj.comArgs;
        var _insertStr = 'm=SYS_TABLE_BASE&api=addRow&table=' + args.table;
        if (args.wfIndexId) { _insertStr = 'm=SYS_TABLE_BASE&api=addWorkFlowRow&table=' + args.table + '&wfIndexId=' + args.wfIndexId + '&fnId=' + args.fnId + '&appId=' + args.appId; }
        switch (_type) {
            case 'Form':
                _com = new $.UI.Form({
                    p: _item.Body, items: _obj.items, foot_h: 35,
                    insertApi: _insertStr,
                    updateApi: 'm=SYS_TABLE_BASE&api=updateByID&table=' + args.table,
                    loadApi: 'm=SYS_TABLE_BASE&api=getByID&table=' + args.table
                }).hide();
                _com.evt('onSubmit', function () {
                    if (ifTree) { _com.set('insertApi', 'm=SYS_TABLE_TREE&api=addTreeNodeByPid&table=' + args.table + '&pid=' + (currID || args.pid || 0)); }
                }).evt('onSubmitSuccess', function (obj) {
                    MTips.show('提交成功', 'ok'); onAddItem(); mList.refresh(null, true, true);
                }).evt('onSubmitError', function (d) { MTips.show(d, 'error'); });
                infoF = _com;
                break;
            case 'List':
                var _t = _obj.table;
                var _uApi = url + _t + '&action=updateForList', _dApi = url + _t + '&action=deleteByIDs';
                _com = new $.UI.List({ p: _item.Body, aHeader: _obj.aHeader, deleteApi: _dApi, updateApi: _uApi, colControls: { header: { head: 30 }, paging: { pageIndex: 1, pageSize: 10}} });
                new $.UI.Button({
                    p: _com.get('colControls').paging.p,
                    align: 'right',
                    name: 'toolBar',
                    type: 'menu',
                    css: 'margin-top:1px;margin-right:20px;',
                    icon: 'icon-glyph-align-justify',
                    items: [
                        { value: 'sys_list_clear', icon: 'icon-glyph-trash', text: '清空' },
                        { value: 'sys_list_delete', icon: 'icon-glyph-remove', text: '删除' },
                        { value: 'sys_list_add', icon: 'icon-glyph-plus', text: '添加' }
                    ],
                    onMenuClick: function (iObj) { onSlaveMenuClick(iObj, _obj, _com); }
                })
                break;
        }
        childs.push([_type, _com, _t]);
    }

    me.loadByPid = function (api, pid) {
        args.pid = pid;
        api += '&pid=' + pid; mList.setAttr('ifAjax', false).loadAjax({ args: api });
        infoF.setExt("pid", pid);
        if (pid != -1) { toolBar.show(); } else { toolBar.hide(); }
        return me;
    }


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
    me.remove = function () { owner.remove(); me = null; delete me; }
    me.init = function (j) { setDefault(j); layout(); return me; }
    if (arguments.length) { me.init(j); }
    return me;
}