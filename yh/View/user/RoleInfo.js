$.NameSpace('$View.user');
$View.user.RoleInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB }, coms, _api = 'm=SYS_CM_USERS', infoView, popTips, addBtn, mainList, currID;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _roleTBAry = [{ text: '添加选中组子项', cn: 'mt5 mr10', name: 'addItem', icon: 'icon-glyph-plus-sign'}];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'mainLayout': { min: 200, max: 500, isRoot: 1, start: 220, dir: 'we', dirLock: 1 },
            'roleTips': { head_h: 33, title: '角色列表', icon: 'icon-glyph-user', cn: 'b0', onToolBarClick: onToolBarClick, toolBarSkin: 'Button-default', toolBarAry: _roleTBAry },
            'roleList': { style: 'tree:nodeName', loadApi: _api + '&action=getAllDepts&jsonCondition={"pid":1}', updateApi: _api + '&action=updateDept', onTDClick: onRoleClick, onSuccess: function (obj) { obj.List.fireClick(0); } },
            'infoView': { url: 'View/user/RoleDetail.js', onLoad: function (view, self) { infoView = view; } }
        }
        var viewStruct = {
            p: owner,
            type: 'Tips',
            name: 'roleTips',
            body: {
                type: 'Layout', name: 'mainLayout',
                eHead: { type: 'List', name: 'roleList' },
                eFoot: { type: 'View', name: 'infoView' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
        addBtn = coms.roleTips.toolBar.items[0]; mainList = coms.roleList;
    }

    function onRoleClick(obj) {
        var _tg = obj.Target, _type = +_tg.getAttr('pid'), _id = _tg.getAttr('id'), _items = [];
        if (_type == 1||_type == 6) { addBtn.setText('添加选中组子项').show(); } else { addBtn.hide(); }
        switch (_type) {
            case 6:
            case 1:
                _items = [
                    { name: 'cPerson', title: '创建者', trans: 'SYS_TRANS_USER', comType: 'Label' },
                    { name: 'cTime', title: '创建时间', comType: 'Label' },
                    { name: 'note', title: '备注', comType: 'TextArea' }
                ];
                break;
            case 2:
                _items = [
                    { name: 'nodeName', title: '组名称', comType: 'Input', req: true },
                    { name: 'uids', title: '组成员', comType: 'UserSelector' },
                    { name: 'link', title: '组负责人', trans: 'SYS_TRANS_USERS', comType: 'MultiSelect', onClickBefore: onMSelect },
                    { name: 'cPerson', title: '创建者', trans: 'SYS_TRANS_USER', comType: 'Label' },
                    { name: 'cTime', title: '创建时间', comType: 'Label' },
                    { name: 'note', title: '备注', comType: 'TextArea' }
                ];
                break;
            case 3:
                _items = [
                    { name: 'nodeName', title: '部门名称', comType: 'Input', req: true },
                    { name: 'uids', title: '部门成员', trans: 'SYS_TRANS_USERS', comType: 'UserSelector' },
                    { name: 'link', title: '部门负责人', trans: 'SYS_TRANS_USERS', comType: 'MultiSelect', onClickBefore: onMSelect },
                    { name: 'cPerson', title: '创建者', trans: 'SYS_TRANS_USER', comType: 'Label' },
                    { name: 'cTime', title: '创建时间', comType: 'Label' },
                    { name: 'room', title: '办公室', comType: 'Select', ifTrans: true, gtID: 144 },
                    { name: 'note', title: '备注', comType: 'TextArea' }
                ];
                addBtn.setText('添加职位').show();
                break;
            case 4:
                _items = [
                    { name: 'nodeName', title: '组名称', comType: 'Input', req: true },
                    { name: 'uids', title: '组成员', comType: 'UserSelector' },
                    { name: 'link', title: '组负责人', trans: 'SYS_TRANS_USERS', comType: 'MultiSelect', onClickBefore: onMSelect },
                    { name: 'cPerson', title: '创建者', trans: 'SYS_TRANS_USER', comType: 'Label' },
                    { name: 'cTime', title: '创建时间', comType: 'Label' },
                    { name: 'note', title: '备注', comType: 'TextArea' }
                ];
                break;
            case 5:
                _items = [
                    { name: 'nodeName', title: '名称', comType: 'Input', req: true },
                    { name: 'link', title: '子部门', trans: 'SYS_TRANS_ROLES', comType: 'MultiSelect', loadApi: 'm=SYS_CM_USERS&action=getAllDepts&keyFields=id,nodeName&jsonCondition={"pid,in":"2,3,4"}' },
                    { name: 'cPerson', title: '创建者', trans: 'SYS_TRANS_USER', comType: 'Label' },
                    { name: 'cTime', title: '创建时间', comType: 'Label' },
                    { name: 'note', title: '备注', comType: 'TextArea' }
                ];
                break;
            default:
                return;
        }
        if (_type == 1 || _type == 3 || _type == 6) { currID = _id; } else { currID = null; }
        delayShowInfo(obj, _items);
    }

    function onMSelect(obj) {
        var _self = obj.Self, _uids = _self.pre.getValue();
        _self.set('loadApi', 'm=SYS_CM_USERS&action=loadUserByUIDS&keyFields=id,uid&uids=' + _uids);
    }

    function delayShowInfo(obj, items) {
        if (!infoView) { setTimeout(function () { delayShowInfo(obj, items); }, 200); return; }
        infoView.loadInfo(obj, items);
    }

    function onToolBarClick(obj) {
        if (!currID) { MTips.show('请选择第一层组类型'); return; }
        switch (obj.Name) {
            case 'addItem':
                popTips = new $.UI.PopDialog({ p: $DB, ifClose: true, css: 'max-width:165px;padding:10px;' });
                popTips.clearHTML(false).set('ePop', obj.Owner).init({
                    type: 'Form', ifFixedHeight: false, state: 'Insert',
                    btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '新建(Add)', icon: 'icon-glyph-plus', align: 'right'}],
                    items: [{ name: 'nodeName', comType: 'TextArea', ifHead: false, req: true}],
                    insertApi: 'm=SYS_TABLE_TREE&action=addTreeNodeByPid&table=SYS_CM_ROLE&pid=' + currID
                }).show().evt('onSubmitSuccess', function (j) { popTips.hide(); MTips.show('新建成功', 'ok'); mainList.reExpandTR(currID, 'ID'); });
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