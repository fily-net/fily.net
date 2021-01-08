$.namespace('$View.workflow');
$View.workflow.WFRuleManager = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, table: 'SYS_WF_RULE' }, eRule;
    var mainList, formTips;
    var _ruleTBAry = [
        { title: '删除模版', cn: 'mr3 mt5', name: 'delRule', icon: 'icon-glyph-minus-sign' },
        { title: '添加模版', cn: 'mt5', name: 'addRule', icon: 'icon-glyph-plus-sign' }
    ];
    var _ruleTypeItems = [
        { value: 1, text: '回调函数(CallBackFn)', icon: 'icon-compact-event' },
        { value: 2, text: '动作(Action)', icon: 'icon-compact-method' },
        { value: 4, text: '属性(Attribute)', icon: 'icon-compact-attr' }
    ];
    var _rFCAry = [
        { title: '规则名', name: 'nodeName', comType: 'Input', req: true },
        { title: '键值', name: 'itemKey', comType: 'Input', req: true },
        { title: '规则类型', items: _ruleTypeItems, name: 'type', popWidth:180, comType: 'Select', req: true },
        { title: '扩展JSON', name: 'ext', comType: 'Json', text: {}, ifEdit: true, onClick: onJsonClick, req: true },
        { title: '备注', name: 'note', comType: 'TextArea', req: true }
    ];
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 220, dir: 'we', dirLock: 1 },
            'ruleToolBar': { html: '<input class="fl b_17 m5 p3" style="width:130px;" type="text" />', css: 'border-top:1px solid #ccc;' },
            'structTips': { head_h: 38, foot_h: 33, icon: 'icon-glyph-list', title: '流程节点规则模版列表', cn: 'b0' },
            'infoTips': { head_h: 38, icon: 'icon-glyph-align-justify', title: '规则字段信息', cn: 'b0', onToolBarClick: onToolBarClick, toolBarAry: [{ name: 'newRuleItem', text: '新建规则项', icon: 'icon-compact-add-bold', cn: 'mr10 p3 mt3'}] },
            'mainList': { loadApi: 'm=SYS_CM_WF&action=getWFRuleTemplate', onTDClick: onListClick }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'rootLayout',
            eHead: {
                type: 'Tips',
                name: 'structTips',
                body: { type: 'List', name: 'mainList' },
                foot: { type: 'Container', name: 'ruleToolBar' }
            },
            eFoot: { type: 'Tips', name: 'infoTips' }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        mainList = coms['mainList']; eRule = coms['infoTips'].body.ac('ListMenu');
        new $.UI.ButtonSet({ p: coms['ruleToolBar'], items: _ruleTBAry, onClick: onToolBarClick, itemAlign: 'right', itemSkin: 'Button-toolbar-icon' });
    }
    function _event() { }
    function _override() { }
    function onJsonClick(fiObj) {
        var _form, _editTips = new $.UI.Tips({ p: formTips.base, head_h: 30, icon: 'icon-glyph-edit', title: '编辑扩展属性', ifFixedHeight: false, onClose: function (obj) { return onEditTipsClose(fiObj, _form); }, comMode: 'x-auto', width: 320, y: 80, ifMask: true, ifClose: true });
        _form = new $.UI.Form({
            p: _editTips.body, foot_h: 0, ifFixedHeight: false,
            items: [
                { title: '表单项类型', gtID: 27, ifShowIcon: true, name: 'comType', comType: 'Select' },
                { title: '默认值', name: 'value', comType: 'Input' },
                { title: '加载数据API', name: 'loadApi', comType: 'Input' },
                { title: '全局对照表ID', name: 'gtID', comType: 'Input' },
                { title: '静态数组', name: 'items', comType: 'TextArea' }
            ]
        });
        var _jVal = fiObj.Json.getValue();
        for (var k in _jVal) { var _tVal = _jVal[k], _item = _form.items[k]; if (_item) { _item.setData(_tVal, _tVal); } }
    }

    function onEditTipsClose(obj, form) {
        var _data = form.check(true), _value = $.JSON.encode(_data[1].IText);
        obj.FormItem.setData(_value, _value);
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'addRule':
                var _eInput = obj.ButtonSet.get('p').fc(), _val = _eInput.value;
                if (_val.length > 1) {
                    _eInput.dc('b_1').ac('b_17').attr('MTips', '');
                    $.Util.ajax({
                        args: { m: 'SYS_TABLE_TREE', table: args.table, action: 'addTreeNode', json: '{"nodeName":"' + _val + '", "pid":1}' },
                        onSuccess: function () { mainList.refresh().scrollTo(-1); _eInput.value = ''; _eInput.focus(); MTips.show('规则模版添加成功!', 'ok'); }
                    });
                } else {
                    _eInput.dc('b_17').ac('b_1').attr('MTips', '不能为空!').focus();
                }
                break;
            case 'delRule':
                var _selId = mainList.getAttr('selID');
                if (_selId) {
                    MConfirm.show('确定删除该规则模版?').setWidth(220).evt('onOk', function () {
                        $.Util.ajax({
                            args: { m: 'SYS_TABLE_TREE', table: args.table, action: 'delTreeNode', id: _selId },
                            onSuccess: function () { mainList.refresh(function (obj) { obj.List.fireClick(0); }); MTips.show('规则模版删除成功!', 'ok'); }
                        });
                    });
                } else {
                    MTips.show('请先选择要删除的规则模版!', 'warn');
                }
                break;
            case 'newRuleItem':
                var _selId = mainList.getAttr('selID');
                if (_selId) {
                    formTips = new $.UI.Tips({ head_h: 30, icon: 'icon-compact-add-bold', title: '新建规则项', ifFixedHeight: false, comMode: 'x-auto', width: 320, y: 120, ifMask: true, ifClose: true });
                    new $.UI.Form({
                        p: formTips.body,
                        ifFixedHeight: false,
                        items: _rFCAry,
                        submitApi: 'm=SYS_TABLE_TREE&action=addTreeNodeByPid&table=SYS_WF_RULE&pid=' + _selId,
                        onSubmitSuccess: function () { mainList.fireClick(_selId, 'ID'); MTips.show('新建成功!', 'ok'); formTips.remove(); formTips = null; },
                        onSubmitError: function (d) { MTips.show('新建失败：' + d.data, 'error'); }
                    });
                } else {
                    MTips.show('请先选择规则模版!', 'warn');
                }
                break;
        }
    }

    function onListClick(obj) {
        var _tg = obj.Target, _id = _tg.getAttr('id');
        $.Util.ajax({
            args: { m: 'SYS_TABLE_TREE', table: args.table, action: 'getTreeListByCondition', jsonCondition: '{ pid: '+_id+', oid: -1 }', dataType: 'json' },
            onSuccess: function (obj) {
                var _sData = obj.get(0); eRule.h('');
                if (_sData) {
                    var _dAry = eval(_sData), _dLen = _dAry.length;
                    for (var i = 0; i < _dLen; i++) { addRule(_dAry[i]); }
                }
            },
            onError: function () { MTips.show('加载失败', 'error'); }
        });
    }
    function addRule(obj) {
        var _eLi = eRule.adElm('', 'li').cn('fl wa').h('<div>' + obj.nodeName + '</div><a _rID="' + obj.id + '" class="icon-compact-del fr" style="margin-top:-50px;" title="删除规则"></a>');

    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}