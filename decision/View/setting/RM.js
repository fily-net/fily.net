$.NameSpace('$View.setting');
$View.setting.RM = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms, formBtn, infoF, toolBar, uList;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _userHAry = [
            { name: 'cb', type: 'checkbox', width: 50 },
            { name: 'id', type: 'attr' },
            { name: 'nodeName', type: 'none', title: '名称', width: 120 },
            { name: 'location', type: 'none', title: 'Location', width: 120 },
            { name: 'latitude', type: 'none', title: 'Latitude', width: 120 },
            { name: 'longitude', type: 'none', title: 'Longitude', width: 120 },
            { name: 'count', type: 'none', title: '总图片张数', width: 150 },
            { name: 'confirmCount', type: 'none', title: '已确认图片张数', width: 150 },
            { name: 'mTime', type: 'date', title: '修改时间', width: 130 },
            { name: 'note', type: 'none', title: '备注', width: 150 }
        ];
        var _userInfo = [
            { title: '名称', name: 'nodeName', comType: 'Input', req: true, group: { width: 320 } },
            { title: 'Location', name: 'location', comType: 'Input', },
            { title: 'Latitude', name: 'latitude', comType: 'Input' },
            { title: 'Longitude', name: 'longitude', comType: 'Input' },
            { title: '备注', name: 'note', comType: 'TextArea' }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'userTips': {
                head_h: 33,
                title: '上海区县管理',
                icon: 'fa-list', cn: 'b0',
                onToolBarClick: onToolBarClick,
                toolBarSkin: 'mr5 Button-default',
                toolBarAry: [
                    { name: 'add', skin: 'Button-s1', text: '添加区县' },
                    { name: 'delete', skin: 'Button-danger', text: '删除区县' },
                ]
            },
            'userList': {
                aHeader: _userHAry, ifEnabledFilter: true,
                loadApi: 'm=SYS_TABLE_BASE&table=TJ_REGION&action=pagingForList&pageSize=1',
                colControls: { header: {}, paging: {} },
                onTDClick: onUserClick,
                onSuccess: function (obj) {
                    if (obj.Length) {
                        obj.List.fireClick(0);
                    }
                }
            },
            'userForm': {
                loadApi: 'm=SYS_TABLE_BASE&table=TJ_REGION&action=getByID',
                insertApi: 'm=SYS_TABLE_BASE&table=TJ_REGION&action=addRow',
                updateApi: 'm=SYS_TABLE_BASE&table=TJ_REGION&action=updateByID',
                items: _userInfo,
                onSubmitSuccess: onFormSubmitSuccess
            },
            'userLayout': { min: 200, max: 500, start: 320, dir: 'ns', dirLock: 2, isRoot: true }
        }
        var viewStruct = {
            p: owner,
            type: 'Layout',
            name: 'userLayout',
            eHead: {
                type: 'Tips',
                name: 'userTips',
                body: { type: 'List', name: 'userList' }
            },
            eFoot: { type: 'Form', name: 'userForm' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
        toolBar = coms.userTips.toolBar;
        infoF = coms.userForm;
        uList = coms.userList;
        formBtn = infoF.getButton('FORM-SYS-SUBMIT');
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'add':
                infoF.set('state', 'Insert').reset().focus();
                formBtn.setIcon('fa fa-plus').setText('添加区县信息');
                break;
            case 'delete':
                var _ids = uList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择人', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除该' + _ids.length + '项记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=MYSQL_BASE&table=tj_region&action=deleteByIDs&ids=' + _ids.join(','),
                        onSuccess: function () { uList.refresh() }
                    });
                });
                break;
        }
    }

    function onFormSubmitSuccess(obj) {
        switch (obj.Form.get('state').trim()) {
            case 'Update':
                MTips.show('修改信息成功', 'ok'); uList.refresh(); 
                break;
            case 'Insert':
                MTips.show('添加信息成功', 'ok'); uList.refresh();
                obj.Form.reset().set('state', 'Insert').focus();
                break;
        }
    }

    
    function onUserClick(obj) { delayShowInfo(obj.Target.getAttr('rowId')); }
    function delayShowInfo(id) {
        if (!infoF) { setTimeout(function () { delayShowInfo(id); }, 200); return; }
        infoF.loadDataByID(id, function () { formBtn.setIcon('fa fa-edit').setText('修改区县信息'); });
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