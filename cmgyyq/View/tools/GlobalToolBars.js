﻿$.NameSpace('$View.tools');
$View.tools.GlobalToolBars = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, rootID: 1 };
    var coms = {}, infoF;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _fiAry = [
            { name: 'id', title: 'ID', comType: 'Label', ifSubmit: false },
            { name: 'nodeName', title: '节点名称', comType: 'Input' },
            { name: 'skin', title: '样式', comType: 'Input' },
            { name: 'ifRights', title: '是否有权限', comType: 'Select', items: [{ value: 0, text: '不启用', icon: 'fa fa-ban' }, { value: 1, icon: 'fa fa-check-circle-o', text: '启用'}], onChange: onIfRightsChange },
            { name: 'icon', title: '图标', comType: 'IconSelector', text: 'fa-picture-o', value: 'fa-picture-o' },
            { name: 'users', trans: 'SYS_TRANS_USERS', title: '权限用户', comType: 'UserSelector' },
            { name: 'roles', trans: 'SYS_TRANS_ROLES', title: '权限角色', comType: 'MultiSelect', loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid,include":"2,3"}' },
            { name: 'ext', title: '扩展信息', comType: 'TextArea' }
        ];
        var comArgs = {
            'root': { head_h: 30, title: '系统全局工具栏管理', icon: 'fa fa-wrench', cn: 'b0' },
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 320, dir: 'we', dirLock: 2 },
            'infoForm': { title: '基本信息', updateApi: 'm=SYS_TABLE_TREE&table=SYS_CM_GLOBAL_BTNSET&action=updateNodeByID', loadApi: 'm=SYS_TABLE_TREE&table=SYS_CM_GLOBAL_BTNSET&action=getNodeByID', ifFixedHeight: false, head_h: 30, items: _fiAry },
            'gtList': { url: 'View/common/TreeList.js', table: 'SYS_CM_GLOBAL_BTNSET', rootID: args.rootID, onLoad: onGTLoad }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'View', name: 'gtList' },
                eFoot: { type: 'Form', name: 'infoForm' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        infoF = coms.infoForm;
    }
    function onIfRightsChange(obj) { var _uFI = obj.FormItem.next.next; if (+obj.Value) { _uFI.show(); _uFI.next.show(); } else { _uFI.hide(); _uFI.next.hide(); } }
    function onGTLoad(view, self) { view.evt('onTDClickBefore', function (obj) { infoF.loadDataByID(+obj.getAttr('rowid'), null, true); }); }
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