$.namespace('$View.device');
$View.device.CarRecords = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, title: '', proId: 0, table: '', headAry: [], formAry: [] };
    var popTips, mainList, infoForm;
    function _default() { }
    function _layout() {
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
        coms = $.layout({ args: comArgs, struct: struct });
        mainList = coms.noteList; infoForm = coms.infoForm;
    }
    function _event() { }
    function _override() { }
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
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}