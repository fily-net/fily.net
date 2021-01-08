$.namespace('$View.depository');
$View.depository.TKManager = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, table: 'SYS_TK_INDEX', rootID: 1 };
    var whList, infoF, formBtn, cID, cTR, tkTips, cType, refreshID;
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
        var _tItemAry = [{ value: 0, text: '分类' }, { value: 1, text: '单据'}];
        var _mItemAry = [
            { title: '名称', name: 'nodeName', comType: 'Input', group: { name: 'g1', width: 300} },
            { title: '类型', name: 'type', comType: 'Select', group: 'g1', items: _tItemAry },
            { title: '备注', name: 'note', comType: 'TextArea', group: 'g1' }
        ];
        var comArgs = {
            'rootTips': { head_h: 30, foot_h: 0, cn: 'b0', title: '单据管理', icon: 'icon-glyph-align-left', toolBarSkin: 'Button-default', toolBarAry: [{ text: '删除', name: 'delete', icon: 'icon-glyph-minus-sign', css: 'margin-top:3px;', cn: 'mr10' }, { text: '新建', name: 'new', icon: 'icon-glyph-plus-sign', css: 'margin-top:3px;'}], onToolBarClick: onTipsToolBarClick },
            'rootLayout': { min: 244, max: 500, isRoot: 1, start: 283, dir: 'we', dirLock: 1 },
            'whTreeList': { aHeader: _mHeaderAry, style: 'tree:nodeName', ifShowIcon: 'type', rootID: args.rootID, table: args.table, onTDClick: onWHListClick },
            'infoF': { items: _mItemAry, head_h: 25, ifFixedHeight: false, title: '基本信息', icon: 'icon-glyph-file', loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=' + args.table, updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=' + args.table },
            'tkTips': { title: '单据字段列表', icon: 'icon-glyph-list', ifFixedHeight: false, head_h: 30, cn: 'b0', css: 'position: relative;border-top:1px solid #F0F0F0;', toolBarSkin: 'Button-default', toolBarAry: [{ text: '删除字段', name: 'deleteField', icon: 'icon-glyph-minus', css: 'margin-top:3px;', cn: 'mr10' }, { text: '新建字段', name: 'newField', icon: 'icon-glyph-plus', css: 'margin-top:3px;'}], onToolBarClick: onTipsToolBarClick }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootTips',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'List', name: 'whTreeList' },
                eFoot: [
                    { type: 'Form', name: 'infoF' },
                    { type: 'Tips', name: 'tkTips' }
                ]
            }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        whList = coms.whTreeList; infoF = coms.infoF; tkTips = coms.tkTips.hide();
        infoF.evt('onSubmitSuccess', function () {
            switch (infoF.get('state')) {
                case 'Insert':
                    if (currTR) { whList.reExpandTR(currTR); } else { whList.refresh(); }
                    break;
                case 'Update':
                    if (refreshID < args.rootID) { whList.refresh(); } else { whList.reExpandTR(refreshID, 'ID'); }
                    break;
            }
        });
        formBtn = infoF.getButton('FORM-SYS-SUBMIT');
    }
    function _event() { }
    function _override() { }
    function onTipsToolBarClick(obj) {
        switch (obj.Name) {
            case 'new': onAdd(); break;
            case 'delete': whList.deleteSelRow(); break;
            case 'newField':
                onAdd(); 
                break;
            case 'deleteField':
                whList.deleteSelRow(); 
                break;
        }
    }
    function onWHListClick(obj) {
        var _tg = obj.Target;
        cID = _tg.getAttr('rowId'); cTR = _tg.eTr; cType = +_tg.getAttr('type'); refreshID = _tg.getAttr('pid');
        infoF.loadDataByID(cID, function (obj) { formBtn.setIcon('icon-glyph-edit').setText('修改单据信息'); }, true);
        if (cType) {
            tkTips.show();

        } else {
            tkTips.hide();
        }
    }
    function onAdd() {
        var _pid = args.rootID;
        if (cType == 1) { MTips.show('单据中不能再新建单据', 'warn'); return; }
        if (cID) { _pid = cID; }
        infoF.set('state', 'Insert').reset().focus();
        infoF.set('insertApi', 'm=SYS_TABLE_TREE&action=addTreeNodeByPid&table=' + args.table + '&pid=' + _pid);
        formBtn.setIcon('icon-glyph-plus-sign').setText('添加单据分类');
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}