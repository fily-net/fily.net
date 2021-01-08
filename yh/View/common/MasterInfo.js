$.NameSpace('$View.common');
$View.common.MasterInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, key: 'title', loadApi: '', fiAry: [], table: '' };
    var coms = {}, infoF, formBtn, mainList;
    var _tbAry = [
        { name: 'add', text: '新建', icon: 'icon-glyph-plus-sign' },
        { name: 'trash', text: '存档', icon: 'icon-glyph-trash' },
        { name: 'queryTrashList', text: '查询存档记录', align: 'right', cn: 'mr10', icon: 'icon-glyph-list', type: 'toggle' }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        args.fiAry[0].group = { width: 600 };
        var comArgs = {
            'rootBase': { head_h: 33 },
            'toolBar': { items: _tbAry, onClick: onToolBarClick },
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 320, dir: 'we', dirLock: 1 },
            'mainList': { aHeader: [{ name: args.key, type: 'none'}], onTDClick: onMainListClick, loadApi: args.loadApi, onSuccess: function (obj) { obj.List.fireClick(0); }, colControls: { paging: {}} },
            'infoForm': { head_h: 22, ifFixedHeight: false, title: '基本信息', icon: 'icon-glyph-list', items: args.fiAry, loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=' + args.table, updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=' + args.table, insertApi: 'm=SYS_TABLE_BASE&action=addRowWithAttachment&table=' + args.table, onSubmitSuccess: onFormSuccess }
        }
        var struct = {
            p: owner,
            type: 'BaseDiv',
            name: 'rootBase',
            head: { type: 'ButtonSet', name: 'toolBar' },
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'List', name: 'mainList' },
                eFoot: { type: 'Form', name: 'infoForm' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        infoF = coms['infoForm']; formBtn = infoF.getButton('FORM-SYS-SUBMIT'); mainList = coms['mainList'];
    }

    function onFormSuccess(obj) {
        if (obj.Form.get('state') == 'Insert') { mainList.refresh(null, true, true); }
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'add':
                infoF.set('state', 'Insert').reset().focus();
                formBtn.setIcon('icon-glyph-plus').setText('新建提交');
                break;
            case 'trash':
                var _id = mainList.getAttr('selID');
                if (_id) {
                    MConfirm.setWidth(250).show('确定存档此项?').evt('onOk', function () {
                        $.Util.ajax({
                            args: 'm=SYS_TABLE_BASE&action=deleteByID&table=' + args.table + '&id=' + _id,
                            onSuccess: function () { mainList.refresh({ onSuccess: function () { mainList.fireClick(0); } }); MTips.show('存档成功!', 'ok'); },
                            onError: function (d) { MTips.show('存档失败!', 'error'); }
                        });
                    });
                } else {
                    MTips.show('请选择记录', 'warn');
                }
                break;
            case 'queryTrashList':
                var _url = args.loadApi;
                if (obj.Args.ifPress) { _url += '&delFlag=1'; }
                mainList.loadAjax({ args: _url, cbFn: { onSuccess: function () { mainList.fireClick(0); } } });
                break;
        }
    }

    function onMainListClick(obj) {
        var _id = obj.Target.getAttr('rowId');
        if (!infoF) { return; }
        infoF.items['link'].set('instanceId', _id);
        infoF.loadDataByID(_id, function () { formBtn.setIcon('icon-glyph-edit').setText('修改'); });
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