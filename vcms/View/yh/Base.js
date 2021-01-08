$.NameSpace('$View.yh');
$View.yh.Base = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, table: null, type: null, headAry: [], infoAry: [], taskUrl: 'View/yh/YHTask.js' };
    var coms = {}, mainList, infoF, popTips, toolBar;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        args.headAry.unshift({ name: 'status', type: 'attr' });
        var comArgs = {
            'root': { head_h: 35 },
            'layout': { min: 244, max: 500, isRoot: 1, start: 340, dir: 'ns', dirLock: 2 },
            'toolBar': { itemAlign: 'right', gbsID: 80, itemSkin: 'mr5 Button-default', onClick: onToolBarClick },
            'status': { itemAlign: 'left', skin: 'ButtonSet-tab fl', itemSkin: 'Button-tab', gtType: 'tab', gtID: 348, css: 'margin-right:20px;', onSuccess: function (obj) { obj.ButtonSet.fireClick(0); }, onClick: onStatusClick },
            'sList': { aHeader: args.headAry, onTDClick: onListClick, ifEnabledFilter: true, deleteApi: 'm=SYS_TABLE_BASE&action=deleteByIDs&table=' + args.table, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onTDDoubleClick: onListDClick },
            'info': { items: args.infoAry, extSubmitVal: { status: 349, type: args.type }, head_h: 30, foot_h: 35, title: '基本信息', loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=' + args.table, updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=' + args.table, insertApi: 'm=SYS_TABLE_BASE&action=addRow&table=' + args.table, onSubmitSuccess: function () { mainList.refresh(); }, onSubmit: onFormSubmit }
        }
        var struct = {
            p: owner,
            name: 'root',
            type: 'BaseDiv',
            head: [{ type: 'ButtonSet', name: 'status' }, { type: 'ButtonSet', name: 'toolBar'}],
            body: {
                type: 'Layout',
                name: 'layout',
                eHead: { type: 'List', name: 'sList' },
                eFoot: { type: 'Form', name: 'info' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        mainList = coms.sList; infoF = coms.info; toolBar = coms.toolBar;
    }

    function onListDClick(obj) { new $.UI.View({ p: args.p, url: args.taskUrl, proType: args.type, proId: obj.getAttr('rowid'), status: obj.getAttr('status') }); }
    function onFormSubmit(obj) { var _form = obj.Form; if (_form.get('state') == 'Update' && obj.Data.UValue.repairTime) { _form.setExt('status', 350); } }
    function onListClick(obj) {
        var _id = obj.Target.getAttr('rowId');
        infoF.setIcon('icon-glyph-edit').items['link'].set('instanceId', _id);
        infoF.loadDataByID(_id, function () { infoF.getButton('FORM-SYS-SUBMIT').setIcon('icon-glyph-edit').setText('修改基本信息'); });
    }

    function onStatusClick(obj) {
        mainList.loadAjax({
            args: 'm=SYS_TABLE_BASE&action=pagingForList&table=' + args.table + '&jsonCondition={"status":' + obj.Name + ', "type":' + args.type + '}',
            cbFn: { onSuccess: function (obj) { if (obj.Length) { mainList.fireClick(0); } else { toolBar.fireClick('add'); } } }
        });
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case '81':
                onAddItem();
                break;
            case 'delete':
                var _sIds = mainList.getAttr('selIds');
                if (_sIds && _sIds.length) {
                    MConfirm.evt('onOk', function () { mainList.delSelRows(); }).setWidth(250).show('确定删除已选择的<font color="red">' + _sIds.length + '</font>项记录?');
                } else {
                    MTips.show('请先选择要删除的记录!', 'warn')
                }
                break;
        }
    }

    function onAddItem() {
        var _scFI = infoF.items['scanCode'];
        infoF.show().set('state', 'Insert').reset().focus();
        if (_scFI) { var _cStr = $.Util.code.FullDate(); _scFI.setData(_cStr, _cStr); }
        infoF.setIcon('icon-glyph-plus-sign').getButton('FORM-SYS-SUBMIT').setIcon('icon-glyph-plus-sign').setText('添加基本信息');
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