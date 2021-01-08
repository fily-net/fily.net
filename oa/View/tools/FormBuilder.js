$.namespace('$View.tools');
$View.tools.FormBuilder = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, table: 'SYS_CM_UI' };
    var viewEditor, vToolBar, mList, popTips;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _aHeader = [
            { name: 'id', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'comType', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'depth', type: 'attr' },
            { name: 'nodeName', type: 'none' }
        ];
        var comArgs = {
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 220, dir: 'we', dirLock: 1 },
            'structTips': { head_h: 30, foot_h: 30, icon: 'icon-compact-struct', title: '表单列表', cn: 'b0' },
            'viewList': { ifShowIcon: 'comType', aHeader: _aHeader, loadApi: 'm=SYS_TABLE_TREE&action=getTreeListByPid&pid=3&table='+args.table, style: 'tree:nodeName', onTDClick: onListClick },
            'viewToolBar': { itemAlign: 'right', itemSkin: 'Button-toolbar', onClick: onToolBarClick },
            'viewEditor': { url: 'View/tools/FormEditor.js', onLoad: function (view) { viewEditor = view; } }
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
        coms = $.layout({ args: comArgs, struct: struct });
        vToolBar = coms.viewToolBar; mList = coms.viewList;
    }
    function _event() { }
    function _override() { }
    function onListClick(obj) {
        var _tg = obj.Target, _id = _tg.getAttr('id');
        if (_tg.getAttr('comType')=='form' && viewEditor) {
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
                        { name: 'type', comType: 'Select', ifHead: false, items: [{ value: '0', text: '分类' }, { value: 'form', text: '表单'}], req: true },
                        { name: 'nodeName', comType: 'TextArea', ifHead: false, req: true }
                    ],
                    insertApi: 'm=SYS_TABLE_TREE&action=addTreeNodeByPid&table=' + args.table + '&pid=' + _id
                }).show().evt('onSubmitSuccess', function (j) { var _sNum = (+_eSelTR.attr('sons'))+1; _eSelTR.attr('sons', _sNum); popTips.hide(); MTips.show('新建成功', 'ok'); mList.reExpandTR(_id, 'ID'); });
                break;
        }
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}