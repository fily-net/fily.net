$.namespace('$View.tools');
$View.tools.FormEditor = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, id: 0 };
    var rootID, _overElm, gAry = [], fiAry = [], initForm, nCom = new $.nCount();
    var toolAry = [
        { name: 'newGroup', text: '新建FormGroup', icon: 'icon-glyph-plus-sign' },
        { name: 'save', text: '保存(Save)', icon: 'icon-compact-save' },
        { name: 'debug', text: '调式(Debug)', icon: 'icon-compact-play' }
    ];
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp FormEditor');
        var comArgs = {
            'root': { head_h: 30, foot_h: 0 },
            'toolBar': { items: toolAry, onClick: onToolBarClick },
            'rootLayout': { min: 200, max: 500, isRoot: true, start: 320, dir: 'we', dirLock: 2 },
            'attrLayout': { min: 200, max: 500, start: 320, dir: 'ns', dirLock: 2 },
            'fiTips': { head_h: 30, cn: 'b0', title: '表单控件列表', icon: 'icon-glyph-align-justify', ifFixedHeigh: false },
            'initForm': { head_h: 22, title: '表单控件标题', icon: 'icon-glyph-align-justify', ifFixedHeigh: false },
            'fiList': { loadApi: 'm=SYS_TABLE_TREE&action=getTreeListByPid&pid=27&table=SYS_CM_GLOBAL_TABLE', ifShowIcon: true, onTDMouseDown: onFIMouseDown }
        }
        var struct = {
            p: owner,
            type: 'BaseDiv',
            name: 'root',
            head: { type: 'ButtonSet', name: 'toolBar' },
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'Layout', name: 'attrLayout', eHead: { name: 'initForm', type: 'Form'} },
                eFoot: {
                    type: 'Tips',
                    name: 'fiTips',
                    body: [{ name: 'fiList', type: 'List'}]
                }
            }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        initForm = coms.initForm; addGroup();
    }
    function _event() { }
    function _override() { }
    function onFIMouseDown(obj, list) {
        var _type = obj.get('text'), _icon = obj.get('icon'), e = obj.e, _x = e.x + 2, _y = e.y + 2;
        var _dargDiv = $DB.adElm('', 'div').cn('pa PopTips-default fs12').css('left:' + _x + 'px;top:' + _y + 'px;padding:5px;max-width:250px;').h('<span class="' + _icon + '"></span><span class="ml5">' + _type + '</span>');
        $.drag.init(_dargDiv);
        _dargDiv.onDragStart = function () { }
        _dargDiv.onDrag = function (x, y) {
            var _gd = findGroupDom($D.elementFromPoint(x + 2, y - 2));
            if (_gd) {
                if (_overElm) { _overElm.dc('group_over'); }
                _gd.ac('group_over'); _overElm = _gd;
            }
        }
        _dargDiv.onDragEnd = function (x, y) {
            var _gd = findGroupDom($D.elementFromPoint(x, y));
            if (_gd) {
                new $.UI.FormItem({ p: _gd, comType: _type, name: 'text', title: 'title' });
            }
            _dargDiv.r(); _dargDiv = null; delete _dargDiv;
            if (_overElm) { _overElm.dc('group_over'); }

        }
        $.drag.start(obj.e, _dargDiv);
    }

    function findGroupDom(elm) {
        if (elm && elm.tagName == 'DIV' && elm.className.indexOf('group') != -1) { return elm; }
        return null;
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'newGroup':
                addGroup();
                break;
        }
    }

    function addGroup(name) {
        var _n = name || Math.random(5);
        initForm.addGroup({ name: _n, cn: 'group' });
    }


    me.loadById = function (id) {
        if (id == null || id == args.id) { return; }
        $.Util.ajax({
            args: { m: 'SYS_CM_UI', action: 'getById', id: id, dataType: 'json', keyFields: 'initArgs,structArgs,comArgs,chartArgs,varArgs' },
            onSuccess: function (d) {
                var _str = d.get(0), _vObj = {}, _dAry = [];
                args.id = id;

                return;
                if (_str) {
                    _vObj = eval(_str)[0]; _dAry = eval(_vObj.chartArgs);
                    var _var = $(_vObj.varArgs);
                }
            }
        });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}