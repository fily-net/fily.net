$.NameSpace('$View.tools');
$View.tools.UIBuilder = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, table: 'SYS_CM_UI' };
    var coms = {}, viewEditor, vToolBar, mList, popTips;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _aHeader = [
            { name: 'id', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'type', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'depth', type: 'attr' },
            { name: 'nodeName', type: 'none' }
        ];
        var comArgs = {
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 220, dir: 'we', dirLock: 1 },
            'structTips': { head_h: 30, foot_h: 30, icon: 'icon-compact-struct', title: '组件列表', cn: 'b0' },
            'viewList': { ifShowIcon: 'type', aHeader: _aHeader, table: args.table, rootID: 1, style: 'tree:nodeName', onTDClick: onListClick },
            'viewToolBar': { itemAlign: 'right', itemSkin: 'Button-toolbar', onClick: onToolBarClick },
            'viewEditor': { url: 'View/tools/ViewEditor.js', onLoad: function (view) { viewEditor = view; } }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'rootLayout',
            eHead: {
                type: 'Tips',
                name: 'structTips',
                body: { type: 'List', name: 'viewList' },
                foot: { type: 'ButtonSet', name: 'viewToolBar' }
            },
            eFoot: { type: 'View', name: 'viewEditor' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        vToolBar = coms.viewToolBar; mList = coms.viewList;
        //--**--Codeing here--**--//
    }

    function onListClick(obj) {
        var _tg = obj.Target, _id = _tg.getAttr('id');
        if ((+_tg.getAttr('type')) && viewEditor) {
            vToolBar.reLoadItems([{ name: 'deleteItem', title: '删除', cn: 'mr5', icon: 'icon-glyph-minus'}]);
            viewEditor.loadById(_id);
        } else {
            var _tbAry = [
                { name: 'deleteItem', title: '删除选择项', cn: 'mr5', icon: 'icon-glyph-minus' },
                { name: 'addItem', title: '新建子项', icon: 'icon-glyph-plus' }
            ];
            vToolBar.reLoadItems(_tbAry);
        }
    }

    function onToolBarClick(obj) {
        var _eSelTR = mList.getAttr('eSelTR'), _id = _eSelTR.attr('rowid');
        switch (obj.Name) {
            case 'deleteItem':
                MConfirm.evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_TREE&action=delTreeNode&table=' + args.table + '&id=' + _id,
                        onSuccess: function () { mList.deleteTR(_eSelTR); }
                    });
                }).setWidth(250).show('确定删除该项吗?');
                break;
            case 'addItem':
                if (popTips) { popTips.remove(); }
                popTips = new $.UI.PopDialog({ p: $DB, ifClose: true, css: 'max-width:165px;padding:10px;' });
                popTips.clearHTML(false).set('ePop', obj.Owner).init({
                    type: 'Form', ifFixedHeight: false, state: 'Insert',
                    btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '新建(Add)', icon: 'icon-glyph-plus', align: 'right'}],
                    items: [
                        { name: 'type', comType: 'Select', ifHead: false, items: [{ value: 0, text: '类型' }, { value: 1, text: '视图'}], req: true },
                        { name: 'nodeName', comType: 'TextArea', ifHead: false, req: true }
                    ],
                    insertApi: 'm=SYS_TABLE_TREE&action=addTreeNodeByPid&table=' + args.table + '&pid=' + _id
                }).show().evt('onSubmitSuccess', function (j) { var _sNum = (+_eSelTR.attr('sons'))+1; _eSelTR.attr('sons', _sNum); popTips.hide(); MTips.show('新建成功', 'ok'); mList.reExpandTR(_id, 'ID'); });
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