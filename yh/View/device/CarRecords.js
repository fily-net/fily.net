$.NameSpace('$View.device');
$View.device.CarRecords = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, title: '', proId: 0, table: '', headAry: [], formAry: [] };
    var coms = {}, popTips, mainList, infoForm;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootTips': { head_h: 30, title: args.title + '记录', icon: 'icon-glyph-align-left', toolBarSkin: 'mr5 Button-default', cn: 'b0', gbsID: 102, onToolBarClick: onToolBarClick },
            'mainLayout': { min: 200, max: 500, isRoot: 1, start: 220, dir: 'ns', dirLock: 2 },
            'infoForm': { head_h: 0, state: 'Insert', ifFixedHeight: false, extSubmitVal: { oid: args.proId }, insertApi: 'm=SYS_TABLE_BASE&action=addRow&table=' + args.table, items: args.formAry, loadApi: 'm=SYS_TABLE_BASE&table=' + args.table + '&action=getByID', updateApi: 'm=SYS_TABLE_BASE&table=' + args.table + '&action=updateByID', onSubmitSuccess: function () { mainList.refresh({ onSuccess: function (obj) { obj.List.fireClick(0); } }, true, true); } },
            'noteList': { aHeader: args.headAry, loadApi: 'm=SYS_TABLE_BASE&table=' + args.table + '&action=pagingForList&jsonCondition={"oid":' + args.proId + '}', onTDClick: onListClick, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onSuccess: function (obj) { if (obj.Length) { mainList.fireClick(0); } else { coms.rootTips.toolBar.fireClick(0); } } }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootTips',
            body: {
                name: 'mainLayout',
                type: 'Layout',
                eHead: { name: 'noteList', type: 'List' },
                eFoot: { name: 'infoForm', type: 'Form' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        mainList = coms.noteList; infoForm = coms.infoForm;
    }
    function onListClick(obj) { infoForm.loadDataByID(obj.Target.getAttr('rowid')).btnSet.items[0].setIcon('icon-glyph-edit').setText('更新记录'); }
    function onToolBarClick(obj) {
        if (obj.Name == 'back') { new $.UI.View({ p: args.p, url: 'View/device/Car.js', fireid: args.proId }); return; }
        switch (+obj.Name) {
            case 103:
                infoForm.set('state', 'Insert').reset().focus().btnSet.items[0].setIcon('icon-glyph-plus').setText('新建记录');
                break;
            case 104:
                var _ids = mainList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择记录', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除该' + _ids.length + '项记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_BASE&table=' + args.table + '&action=deleteByIDs&ids=' + _ids.join(','),
                        onSuccess: function () { mainList.refresh(); }
                    });
                });
                break;
        }
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