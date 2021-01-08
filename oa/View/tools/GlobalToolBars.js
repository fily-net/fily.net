$.namespace('$View.tools');
$View.tools.GlobalToolBars = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, rootID: 1 }, infoF;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _fiAry = [
            { name: 'id', title: 'ID', comType: 'Label', ifSubmit: false },
            { name: 'nodeName', title: '节点名称', comType: 'Input' },
            { name: 'ifRights', title: '是否有权限', comType: 'Select', items: [{ value: 0, text: '不启用', icon: 'icon-glyph-ban-circle' }, { value: 1, icon: 'icon-glyph-ok-circle', text: '启用'}], onChange: onIfRightsChange },
            { name: 'icon', title: '图标', comType: 'IconSelector', text: 'icon-glyph-picture', value: 'icon-glyph-picture' },
            //{ name: 'skin', title: '样式皮肤', comType: 'Input' },
            { name: 'users', trans: 'SYS_TRANS_USERS', title: '权限用户', comType: 'UserSelector' },
            { name: 'roles', trans: 'SYS_TRANS_ROLES', title: '权限角色', comType: 'MultiSelect', loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid,include":"2,3"}' },
            { name: 'ext', title: '扩展信息', comType: 'TextArea' }
        ];
        var comArgs = {
            'root': { head_h: 38, title: '系统全局工具栏管理', icon: 'icon-glyph-wrench', cn: 'b0' },
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 320, dir: 'we', dirLock: 2 },
            'infoForm': { title: '基本信息', icon: 'icon-vector-info-card', updateApi: 'm=SYS_TABLE_TREE&table=SYS_CM_GLOBAL_BTNSET&action=updateNodeByID', loadApi: 'm=SYS_TABLE_TREE&table=SYS_CM_GLOBAL_BTNSET&action=getNodeByID', ifFixedHeight: false, head_h: 30, items: _fiAry },
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
        coms = $.layout({ args: comArgs, struct: struct });
        infoF = coms.infoForm;
    }
    function _event() { }
    function _override() { }
    function onIfRightsChange(obj) { var _uFI = obj.FormItem.next.next; if (+obj.Value) { _uFI.show(); _uFI.next.show(); } else { _uFI.hide(); _uFI.next.hide(); } }
    function onGTLoad(view, self) { view.evt('onTDClickBefore', function (obj) { infoF.loadDataByID(+obj.getAttr('rowid'), null, true); }); }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}