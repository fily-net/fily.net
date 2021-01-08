$.namespace('$View.common');
$View.common.ListInfo = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, loadApi: '', aHeader: [], fiAry: [], start: 320, table: '', pid: null, onAddItem: _fn };
    var infoF, formBtn, mainList, toolBar;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: args.start, dir: 'ns', dirLock: 2 },
            'mainList': { aHeader: args.aHeader, onTDClick: onMainListClick, loadApi: args.loadApi, updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=' + args.table, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } }, onSuccess: function (obj) { if (obj.Length) { obj.List.fireClick(0); } else { onReset(); } } },
            'infoForm': { head_h: 22, ifFixedHeight: false, title: '基本信息', icon: 'icon-compact-info-card', items: args.fiAry, loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=' + args.table, updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=' + args.table, insertApi: 'm=SYS_TABLE_BASE&action=addRow&table=' + args.table }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'rootLayout',
            eHead: { type: 'List', name: 'mainList' },
            eFoot: { type: 'Form', name: 'infoForm' }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        toolBar = coms.toolBar;
        infoF = coms['infoForm']; formBtn = infoF.getButton('FORM-SYS-SUBMIT'); mainList = coms['mainList'];
        infoF.evt('onSubmitSuccess', function () { mainList.refresh(null, true); });
    }
    function _event() { }
    function _override() { }
    me.addRecord = function () { onAddItem(); }
    me.delRecord = function () {
        var _ids = mainList.getAttr('selIds');
        if (_ids && _ids.length) {
            MConfirm.setWidth(250).show('确定删除<font color="red">' + _ids.length + '</font>项记录?').evt('onOk', function () {
                $.Util.ajax({
                    args: 'm=SYS_TABLE_BASE&action=deleteByIDs&table=' + args.table + '&ids=' + _ids.join(','),
                    onSuccess: function () { mainList.refresh({ onSuccess: function () { mainList.fireClick(0); } }); MTips.show('删除记录成功!', 'ok'); },
                    onError: function (d) { MTips.show('删除记录失败!', 'error'); }
                });
            });
        } else {
            MTips.show('请选择记录', 'warn');
        }
    }

    function onAddItem() {
        var _scFI = infoF.items['scanCode'];
        infoF.show().set('state', 'Insert').reset().focus();
        if (args.pid) { infoF.set('insertApi', 'm=SYS_TABLE_TREE&action=addTreeNodeByPid&table=' + args.table + '&pid=' + args.pid); }
        if (_scFI) { var _cStr = getBarCodeString(); _scFI.setData(_cStr, _cStr); }
        formBtn.setIcon('icon-glyph-plus-sign').setText('添加基本信息');
        args.onAddItem(infoF);
    }
    function onReset() { infoF.hide(); }
    function onMainListClick(obj) {
        var _id = obj.Target.getAttr('rowId');
        infoF.show().loadDataByID(_id, function () { formBtn.setIcon('icon-glyph-edit').setText('修改'); });
    }
    function getBarCodeString() {
        var _val = '', _now = new Date(), _h = _now.getHours(), _m = _now.getMinutes(), _s = _now.getSeconds();
        _h = _h < 10 ? ('0' + _h) : _h;
        _m = _m < 10 ? ('0' + _m) : _m;
        _s = _s < 10 ? ('0' + _s) : _s;
        _val = _now.date8() + _h + _m + _s;
        return _val;
    }
    me.loadByPid = function (api, pid) { args.pid = pid; api += '&pid=' + pid; mainList.setAttr('ifAjax', false).loadAjax({ args: api }); return me; }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}