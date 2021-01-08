$.namespace('$View.tools');
$View.tools.ListEditor = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, id: 0 };
    var nCom = new $.nCount(), rootID;
    var fcAry = [
        { name: 'type', title: '组件类型', comType: 'Select', gtID: 53 },
        { name: 'name', title: '变量名', comType: 'Input' }
    ];
    var toolAry = [
        { name: 'newGroup', text: '新建FormGroup', icon: 'icon-glyph-plus-sign' },
        { name: 'save', text: '保存(Save)', icon: 'icon-compact-save' },
        { name: 'debug', text: '调式(Debug)', icon: 'icon-compact-play' }
    ];
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 30, foot_h: 0 },
            'toolBar': { items: toolAry, onClick: onToolBarClick },
            'rootLayout': { min: 200, max: 500, isRoot: true, start: 320, dir: 'we', dirLock: 2 },
            'attrLayout': { min: 200, max: 500, start: 320, dir: 'ns', dirLock: 2 },
            'fiTips': { head_h:30, cn: 'b0', title: '表单控件列表', icon: 'icon-glyph-align-justify', ifFixedHeigh: false },
            'fiList': { loadApi: 'm=SYS_TABLE_TREE&action=getTreeListByPid&pid=147&table=SYS_CM_GLOBAL_TABLE', ifShowIcon: true }
        }
        var struct = {
            p: owner,
            type: 'BaseDiv',
            name: 'root',
            head: { type: 'ButtonSet', name: 'toolBar' },
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: {
                    type: 'Layout',
                    name: 'attrLayout',
                },
                eFoot: {
                    type: 'Tips',
                    name: 'fiTips',
                    body: [
                        {name:'fiList', type:'List'}
                    ]
                }
            }
        }
        coms = $.layout({ args: comArgs, struct: struct });
    }
    function _event() { }
    function _override() { }
    function onToolBarClick(obj) {
        switch (obj.Name) {

        }
    }
    me.loadById = function (id) {
        if (id == null || id == args.id) { return; }
        $.Util.ajax({
            args: { m: 'SYS_CM_UI', action: 'getById', id: id, dataType: 'json', keyFields: 'id,nodeName,initArgs,structArgs,comArgs,chartArgs,varArgs' },
            onSuccess: function (d) {
                var _str = d.get(0), _vObj = {}, _dAry = [];
                args.id = id;
                if (_str) {
                    _vObj = eval(_str)[0]; _dAry = eval(_vObj.chartArgs);
                    var _var = $(_vObj.varArgs);
                    comSet = _var.comSet || {};
                    argsSet = _var.argsSet || {};
                    args.nodeName = _vObj.nodeName;
                    newBtn.setEnabled(false);
                } else {
                    newBtn.setEnabled(true);
                }
                flowChart.reLoad(_dAry);
                flowChart.firePointClick();
                if (flowChart.firstPoint) { rootID = flowChart.firstPoint.id; }
            }
        });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}