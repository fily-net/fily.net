$.NameSpace('$View.depository');
$View.depository.WHManager = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, table: 'SYS_WH_INDEX', rootID: 4 };
    var coms = {}, whList, infoF, formBtn, tFI, cID, cTR, cType, refreshID;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { name: 'id', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'depth', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'type', type: 'attr' },
            { name: 'nodeName', type: 'none' }
        ];
        var _tItemAry = [{ value: 0, text: '区域' }, { value: 1, text: '城市' }, { value: 2, text: '仓库'}];
        var _mItemAry = [
            { title: '名称', name: 'nodeName', comType: 'Input', group: { name: 'g1', width: 300} },
            { title: '可收料否', name: 'ifReceipt', dataType: 'int', comType: 'Radios', defValue: 9, gtID: 7, group: 'g1' },
            { title: '备注', name: 'note', comType: 'TextArea', group: 'g1' }
        ];
        var comArgs = {
            'rootTips': { head_h: 30, foot_h: 0, cn: 'b0', title: '仓库分类', icon: 'icon-glyph-align-left', toolBarSkin: 'Button-default', toolBarAry: [{ text: '删除仓库', name: 'delete', icon: 'icon-glyph-minus-sign', css: 'margin-top:3px;', cn: 'mr10' }, { text: '新建仓库', name: 'new', icon: 'icon-glyph-plus-sign', css: 'margin-top:3px;'}], onToolBarClick: onTipsToolBarClick },
            'rootLayout': { min: 244, max: 500, isRoot: 1, start: 283, dir: 'we', dirLock: 1 },
            'whTreeList': { aHeader: _mHeaderAry, style: 'tree:nodeName', ifShowIcon: 'type', rootID: args.rootID, table: args.table, onTDClick: onWHListClick },
            'infoF': { items: _mItemAry, insertApi: 'm=SYS_TABLE_TREE&action=addTreeNodeByPid&table=' + args.table + '&pid=4', extSubmitVal: { type: 2 }, head_h: 25, ifFocus: false, ifFixedHeight: false, title: '基本信息', icon: 'icon-compact-info-card', loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=' + args.table, updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=' + args.table, onLoadFormSuccess: function (obj) { tFI = obj.Form.items['type']; } }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootTips',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'List', name: 'whTreeList' },
                eFoot: { type: 'Form', name: 'infoF' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        whList = coms.whTreeList; infoF = coms.infoF;
        infoF.evt('onSubmitSuccess', function () {
            switch (infoF.get('state')) {
                case 'Insert':
                    if (cTR) { whList.reExpandTR(cTR); } else { whList.refresh(); }
                    break;
                case 'Update':
                    if (refreshID < args.rootID) { whList.refresh(); } else { whList.reExpandTR(refreshID, 'ID'); }
                    break;
            }
        });
        formBtn = infoF.getButton('FORM-SYS-SUBMIT');
    }

    function onTipsToolBarClick(obj) {
        switch (obj.Name) {
            case 'new': onAdd(); break;
            case 'delete': whList.deleteSelRow(); break;
        }
    }

    function onTypeChange(obj) {
        var _self = obj.FormItem.next;
        if (+obj.Value == 2) { _self.show(); } else { _self.hide(); }
    }

    function onWHListClick(obj) {
        var _tg = obj.Target;
        cID = _tg.getAttr('rowId'); cTR = _tg.eTr; cType = +_tg.getAttr('type'); refreshID = _tg.getAttr('pid');
        infoF.loadDataByID(cID, function (obj) { formBtn.setIcon('icon-glyph-edit').setText('修改'); }, true);
    }

    function onAdd() {
        infoF.set('state', 'Insert').reset().focus();
        formBtn.setIcon('icon-glyph-plus-sign').setText('添加仓库分类');
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