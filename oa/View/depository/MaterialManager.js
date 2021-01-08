$.namespace('$View.depository');
$View.depository.MaterialManager = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var dList, toolBar;
    function _default() {

    }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { title: '选择', name: 'choose', type: 'checkbox', width: 45 },
            { title: 'ID', name: 'id', type: 'attr' },
            { title: '条形码', name: 'scanCode', type: 'none', width: 120, ifFilter: 1, ifSort: 1 },
            { title: '物资编号', name: 'code', type: 'none', width: 100, ifFilter: 1, ifSort: 1 },
            { title: '物资名称', name: 'nodeName', type: 'none', width: 100, ifFilter: 1, ifSort: 1 },
            { title: '规格', trans: '', name: 'guige', type: 'none', width: 60, ifFilter: 1 },
            { title: '单位', name: 'danwei', type: 'none', ifTrans: true, width: 50, ifFilter: 1, ifSort: 1 },
            { title: '计划价', name: 'planPrice', type: 'none', width: 100, ifFilter: 1, ifSort: 1 },
            { title: '最高价', name: 'highPrice', type: 'none', width: 100, ifFilter: 1, ifSort: 1 },
            { title: '备注', name: 'note', type: 'none', width: 150 }
        ];
        var _mItemAry = [
            { title: '条形码', name: 'scanCode', comType: 'Input', group: { name: 'g1', width: 300} },
            { title: '物资编号', name: 'code', comType: 'Input', group: 'g1' },
            { title: '物资名称', name: 'nodeName', comType: 'Input', group: 'g1' },
            { title: '单位', name: 'danwei', comType: 'Select', gtID: 252, defText: '只', text: '只', value: 255, group: { name: 'g2', width: 300} },
            { title: '计划价', name: 'planPrice', comType: 'KeyInput', dataType: 'double', group: 'g2' },
            { title: '最高价', name: 'highPrice', comType: 'KeyInput', dataType: 'double', group: 'g2' },
            { title: '规格', name: 'guige', comType: 'Input', group: 'g2' },
            { title: '备注', name: 'note', comType: 'TextArea', group: { name: 'g3', width: 300} }
        ];
        var comArgs = {
            'rootTips': { head_h: 30, title: '仓库物资结构管理', icon: 'icon-glyph-th-large', cn: 'b0', gbsID: 121, toolBarSkin: 'mr10 Button-default', onToolBarClick: onToolBarClick },
            'rootLayout': { min: 244, max: 500, isRoot: 1, start: 500, dir: 'we', dirLock: 1 },
            'sView': { url: 'View/common/TreeList.js', table: 'SYS_WH_MS', ifShowID: false, lockLevel: 2, rootID: 1, ifExpandAll: true, onTDClick: onStructClick },
            'infoView': { url: 'View/common/ListInfo.js', aHeader: _mHeaderAry, start: 250, fiAry: _mItemAry, table: 'SYS_WH_MS', onLoad: function (view) { dList = view; } }
        }
        var struct = {
            p: owner,
            name: 'rootTips',
            type: 'Tips',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'View', name: 'sView' },
                eFoot: { type: 'View', name: 'infoView' }
            }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        toolBar = coms.rootTips.toolBar;
    }
    function _event() {

    }
    function _override() {

    }
    function onStructClick(obj) {
        var _level = obj.TreeList.get('currLevel'), _rowId = -1;
        if (_level == 2) {
            _rowId = obj.Attr.selID;
            dList.loadByPid('m=SYS_TABLE_TREE&table=SYS_WH_MS&action=pagingListByPid', _rowId);
            if (_rowId != -1) { toolBar.show(); } else { toolBar.hide(); }
        } else {
            if (! +obj.Target.getAttr('sons')) { dList.loadByPid('m=SYS_TABLE_TREE&table=SYS_WH_MS&action=pagingListByPid', -1); }
        }
    }

    function onToolBarClick(obj) {
        switch (+obj.Name) {
            case 122:
                dList.addRecord(); break;
            case 123:
                dList.delRecord(); break;
        }
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}