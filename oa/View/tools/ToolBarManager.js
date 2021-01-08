$.namespace('$View.tools');
$View.tools.ToolBarManager = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB }, infoF;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _fiAry = [
            { name: 'nodeName', title: '节点名称', comType: 'Input' },
            { name: 'url', title: '连接地址', comType: 'Input' },
            { name: 'ifShortcuts', title: '标记为快捷方式', comType: 'Radios', gtID: 7, value: 9 },
            { name: 'icon', title: '图标', comType: 'IconSelector', icon: 'icon-glyph-picture' },
            { name: 'users', title: '权限用户', comType: 'UserSelector' },
            { name: 'roles', title: '权限角色', comType: 'MultiSelect', loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid,include":"2,3"}' },
            { name: 'note', title: '备注', comType: 'TextArea' }
        ];
        var comArgs = {
            'root': { head_h: 38, title: '系统功能模块管理', icon: 'icon-glyph-th-list', cn: 'b0' },
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 290, dir: 'we', dirLock: 2 },
            'infoForm': { title: '基本信息', icon: 'icon-vector-info-card', loadApi: 'm=SYS_TABLE_BASE&table=SYS_CM_FN_TREE&action=getByID', updateApi: 'm=SYS_TABLE_BASE&table=SYS_CM_FN_TREE&action=updateByID', ifFixedHeight: false, head_h: 30, items: _fiAry },
            'gtList': { url: 'View/common/TreeList.js', table: 'SYS_CM_FN_TREE', rootID: 1, onLoad: onGTLoad }
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
    function onGTLoad(view, self) {
        view.evt('onTDClick', function (obj) { infoF.loadDataByID(obj.Target.getAttr('id')); });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}