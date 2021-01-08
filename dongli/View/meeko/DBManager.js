$.NameSpace('$View.meeko');
$View.meeko.DBManager = function (j) {
    var me = this, _fn = function () { };
    var owner, eFields;
    var args = { p: $DB };
    var coms = {}, doms = {};
    var views = [];
    var actionForDBAry = [
        { name: 'state', text: '停止数据库', value: 'stop', icon: 'icon-glyph-pause' },
        { name: 'upload', text: '上传数据库文件', value: 'upload', icon: 'icon-glyph-upload' }
    ];
    var actionForTableAry = [
        { name: 'newTable', text: '新建表', value: 'newTable', icon: 'icon-glyph-plus' },
        { name: 'copyTable', text: '复制表', value: 'copyTable', icon: 'icon-vector-placard' }
    ];
    var toolAry = [
        { name: 'db_action', text: '数据库操作', icon: 'icon-vector-barrel', type: 'menu', items: actionForDBAry },
        { name: 'table_action', text: '表操作', icon: 'icon-compact-table', type: 'menu', items: actionForTableAry }
    ];
    var fieldInfoAry = [
        { name: '{index}', text: '序号', type: 'none', width: 30 },
        { name: '{name}', text: '字段名', type: 'none', width: 100 },
        { name: '{ifMark}', text: '是否是标识', type: 'none', width: 70 },
        { name: '{ifPrimaryKey}', text: '是否是主键', type: 'none', width: 70 },
        { name: '{defaultValue}', text: '默认值', type: 'none', width: 80 },
        { name: '{type}', text: '数据类型', type: 'none', width: 80 },
        { name: '{byte}', text: '占用字节数', type: 'none', width: 80 },
        { name: '{length}', text: '长度', type: 'none', width: 50 },
        { name: '{decimalSize}', text: '小数位数', type: 'none', width: 70 },
        { name: '{ifNull}', text: '能否为空', type: 'none', width: 70 },
        { name: '{comment}', text: '字段说明', type: 'none', width: 200 }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 30, foot_h: 30 },
            'toolBar': { items: toolAry, onMenuClick: onToolBarClick },
            'infoText': { cn:'ti_5 lh30 cp fs12', css:'color:red;border-top:1px solid #ccc;', html:'数据库基本信息'},
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 320, dir: 'we', dirLock: 1 },
            'viewTab': { head_h: 30, btnSkin: 'Button-default', items: [{ name: 'table-field-info', text: '表字段信息', icon: 'icon-compact-info-card' }, { name: 'table-data', text: '表数据', icon: 'icon-compact-form'}], onClose: function (obj) { views[obj.Name] = null; delete views[obj.Name]; } },
            'table-data': { aHeader: [], colControls: { header: {}, paging: {}} },
            'viewStruct': { head_h: 30, title: 'DataBase', icon: 'icon-glyph-list', cn: 'bc_7', toolBarAry: [{ name: 'help', icon: 'icon-glyph-question-sign', title: '帮助' }, { name: 'add-table', icon: 'icon-glyph-plus', title: '新建表'}] },
            'tableMenu': { loadApi: 'm=SYS_DBHELPER&action=getAllTables', textKey: 'Name', valueKey: 'Name', onClick: onTableClick }
        }
        var struct = {
            p: owner,
            type: 'BaseDiv',
            name: 'root',
            head: { type: 'ButtonSet', name: 'toolBar' },
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'Tips', name: 'viewStruct', body: { type: 'Menu', name: 'tableMenu'} },
                eFoot: {
                    type: 'Tab',
                    name: 'viewTab',
                    items: [{ name: 'table-data', type: 'List'}]
                }
            },
            foot: { type: 'Container', name: 'infoText' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        eFields = coms['viewTab'].items['table-field-info'].Body;
        //--**--Codeing here--**--//
    }

    function onToolBarClick(obj) {
        var _name = obj.Name, _tab = coms['viewTab'].items[_name];
        if (_tab) { coms['viewTab'].setSelTab(_name); return; }
        _tab = coms['viewTab'].addTabItem({ name: _name, text: obj.Text, ifClose: true }, true);
        switch (_name) {
            case 'copyTable':
                copyTable(_tab.Body); break;
            case 'newTable':
                newTable(_tab.Body); break;
        }
    }

    function onTableClick(obj) {
        var t_data_list = coms['table-data'], _table = obj.Text;
        $.Util.ajax({
            args: 'm=sys_dbHelper&action=getAllFields&dataType=json&table=' + _table,
            onSuccess: function (d) {
                var _fObj = eval(d.get(0));
                var _hAry = [{ name: "cb", text: 'cb', type: 'checkbox', width: 40}];
                var _api = "pagingForList";
                eFields.h('');
                t_data_list.setAttr('expandCol', null);
                for (var i = 0, _len = _fObj.length; i < _len; i++) {
                    var _field = _fObj[i], _name = _field.name;
                    if (_name == 'pid') {
                        t_data_list.setAttr('expandCol', '[id]');
                        _api = "pagingForTreeList";
                        _hAry.push({ name: "pid", title: 'pid', type: 'attr' });
                        _hAry.push({ name: "depth", title: 'depth', type: 'attr' });
                        _hAry.push({ name: "sons", title: 'sons', type: 'attr' });
                    }
                    _hAry.push({ name: '[' + _name + ']', title: _name, type: 'none', width: 130 });
                    addFieldInfo(_field);
                }
                t_data_list.reCreate(_hAry, 'm=SYS_TABLE_BASE&action=' + _api + '&table=' + _table);
            }
        });
    }

    function addFieldInfo(obj) {
        var _sAry = [];
        for (var k in obj) { _sAry.push('<li class="p5"><span class="fwb w100">' + k + '</span>：<span>' + obj[k] + '</span></li>'); }
        new $.UI.Panel({ p: eFields, title: obj['name'], ifClose: false, content: _sAry.join('') });
    }

    function copyTable(p) {
        var form = new $.UI.Form({
            p: p, foot_h: 0, ifFixedHeight: false,
            items: [
                { title: '服务器类型(<font color="red">源</font>)', itemCn: 'mt3', name: 'server_type', comType: 'Radios', sons: [{ text: '本地服务器', value: 'local', checked: true }, { text: '远程服务器', value: 'remote'}] },
                { title: '地址(或IP)', comType: 'Input', name: 'server', group: { name: 'remote', visibled: false }, regTemplate: 'ip', req: true, sErr: '格式不正确(如：<font color="red">125.125.126.11</font>)' },
                { title: '用户名', comType: 'Input', icon: 'icon-glyph-user', name: 'uid', group: 'remote', regTemplate: 'default', req: true, sErr: '必填' },
                { title: '密码', comType: 'Pwd', name: 'pwd', group: 'remote', regTemplate: 'default', req: true, sErr: '必填' },
                { title: '数据库名', comType: 'Select', textKey: 'Name', valueKey: 'Name', readonly: false, name: 'dbName', group: { name: 'dbName'} }
            ]
        }).evt('onChange', function (obj) {
            switch (obj.Name) {
                case 'server_type':
                    form.items['dbName'].reset().set('loadApi', null);
                    var _tGroup = obj.Form.aGroup[1];
                    if (obj.Value == 'local') { _tGroup.hide(); } else { _tGroup.show(); }
                    break;
                case 'dbName':

                    break;
            }
        }).evt('onSubmit', function (obj) {
            var _val = obj.Data.IValue, _type = _val.server_type, _api = { m: 'sys_dbHelper', action: 'getAllTables' };
            _api.dbName = _val.dbName;
            if (_type == 'remote') { _api.server = _val.server; _api.uid = _val.uid; _api.pwd = _val.pwd; };
            $.Util.ajax({
                args: _api,
                onSuccess: function (data) {
                    var _sAry = data.get(0).split('$'), _bAry = [];
                    for (var i = 0, _tLen = _sAry.length; i < _tLen; i++) {
                        var _name = _sAry[i];
                        _bAry.push({ name: _name, text: _name, type: 'toggle' });
                    }
                    eBtnSet.h('');
                    new $.UI.ButtonSet({ p: eBtnSet, items: _bAry });
                }
            });
        }).evt('onItemClickBefore', function (obj) {
            var _cData = obj.Form.check(true), _data = _cData[1];
            if (_cData[0] != false) {
                var _value = _data.IValue;
                _value.m = 'SYS_DB'; _value.action = 'getAllDBs';
                obj.FormItem.set('loadApi', $.Util.toArgsString(_value));
            }
        });
        var eBtnSet = p.adElm('', 'div').cn('wp');
    }

    function newTable(p) {
        var _newBase = new $.UI.BaseDiv({ p: p, head_h: 33 });
        var _newToolBar = new $.UI.ButtonSet({
            p: _newBase.head,
            items: [
                { name: 'newField', text: '新建字段', icon: 'icon-vector-new' },
                { name: 'save', text: '保存', icon: 'icon-vector-save' }
            ]
        });
        var _eFC = _newBase.head.adElm('', 'div').cn('fr hp w200');
        var _tempFC = new $.UI.FormItem({ p: _eFC, text: '表模版', comType: 'Select', cn: 'm5', loadApi: 'm=SYS_DBHELPER&API=getTableTemplate', textKey: 'Name', valueKey: 'Name' });
        var _eFields = _newBase.body.adElm('', 'div').cn('wp hp');
        _tempFC.evt('onChange', function (obj) {
            $.Util.ajax({
                args: 'm=sys_dbHelper&action=getAllFields&dataType=json&table=' + obj.Value,
                onSuccess: function (d) {
                    var _dAry = eval(d.get(0)), _dLen = _dAry.length;
                    _eFields.h('');
                    for (var i = 0; i < _dLen; i++) { addNewField(_dAry[i], false); }
                }
            });
        });
        function addNewField(obj, ifDel) {
            var _sAry = [];
            for (var k in obj) { _sAry.push('<li class="p5"><span class="fwb w100">' + k + '</span>：<span>' + obj[k] + '</span></li>'); }
            new $.UI.Panel({ p: _eFields, title: obj['name'], ifFold: true, ifClose: ifDel, content: _sAry.join('') });
        }
    }



    function bindEvent() {
        //--**--Codeing here--**--//
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