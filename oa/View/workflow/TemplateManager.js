$.namespace('$View.workflow');
$View.workflow.TemplateManager = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB }, table = 'SYS_WF_INDEX';
    var flowChart, _currTR, tToolBar, mList, popTips;
    function _default() { }
    function _layout() {
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
            'structTips': { head_h: 38, foot_h: 40, icon: 'icon-compact-struct', title: '系统流程模版列表', cn: 'b0' },
            'mList': { ifShowIcon: 'type', aHeader: _aHeader, loadApi: 'm=SYS_CM_WF&action=getWFIndex&jsonCondition={"pid":1}', updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=' + table, style: 'tree:nodeName', onTDClick: onListClick },
            'tToolBar': { itemAlign: 'right', itemSkin: 'Button-default', onClick: onToolBarClick },
            'flowChart': { url: 'View/workflow/FlowChart.js', onLoad: function (view) { flowChart = view; } }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'rootLayout',
            eHead: {
                type: 'Tips',
                name: 'structTips',
                body: { type: 'List', name: 'mList' },
                foot: { type: 'ButtonSet', name: 'tToolBar' }
            },
            eFoot: { type: 'View', name: 'flowChart' }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        tToolBar = coms.tToolBar; mList = coms.mList;
    }
    function _event() { }
    function _override() { }
    function onListClick(obj) {
        var _tg = obj.Target, _id = _tg.getAttr('id'), _json = _tg.getAttr('json');
        if ((+_tg.getAttr('type')) && flowChart) {
            flowChart.loadById(_id);
            tToolBar.reLoadItems([{ name: 'deleteItem', text: '删除选择项', cn: 'mr5', icon: 'icon-glyph-minus'}]);
        } else {
            var _tbAry = [
                { name: 'deleteItem', text: '删除选择项', cn: 'mr5', icon: 'icon-glyph-minus' },
                { name: 'addItem', text: '新建子项', icon: 'icon-glyph-plus' }
            ];
            tToolBar.reLoadItems(_tbAry);
        }
    }

    function onToolBarClick(obj) {
        var _eSelTR = mList.getAttr('eSelTR'), _id = _eSelTR.attr('rowid');
        switch (obj.Name) {
            case 'deleteItem':
                MConfirm.evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_TREE&action=delTreeNode&table=' + table + '&id=' + _id,
                        onSuccess: function () { mList.deleteTR(_eSelTR); }
                    });
                }).setWidth(250).show('确定删除该项吗?');
                break;
            case 'addItem':
                if (popTips) { popTips.remove(); }
                popTips = new $.UI.PopDialog({ p: $DB, ePop: obj.Owner, ifClose: true, css: 'max-width:160px;padding:5px 10px 5px 10px;' });
                popTips.init({
                    type: 'Form', ifFixedHeight: false, state: 'Insert',
                    btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '新建(Add)', icon: 'icon-glyph-plus', skin: 'Button-blue', align: 'right'}],
                    items: [
                        { name: 'type', comType: 'Select', ifHead: false, items: [{ value: 0, text: '流程类型' }, { value: 1, text: '流程模版'}], req: true },
                        { name: 'nodeName', comType: 'TextArea', ifHead: false, req: true },
                    ],
                    insertApi: 'm=SYS_TABLE_TREE&action=addTreeNodeByPid&table=' + table + '&pid=' + _id
                }).evt('onSubmitSuccess', function (j) { var _sNum = (+_eSelTR.attr('sons')) + 1; _eSelTR.attr('sons', _sNum); popTips.hide(); MTips.show('新建成功', 'ok'); mList.reExpandTR(_id, 'ID'); });
                popTips.get('owner').dc('oh');
                break;
        }
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}