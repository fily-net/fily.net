$.namespace('$View.rights');
$View.rights.Public = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, table: 'SYS_CM_FN_TREE', rootID: 1 };
    var mainList, uSelector, rSelector, currID;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { name: 'id', type: 'attr' },
            { name: '{0}ifRights-{0}{1}cast(ifRights as varchar(2))', type: 'attr', key: 'class' },
            { name: 'sons', type: 'attr' },
            { name: 'depth', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'type', type: 'attr' },
            { name: 'nodeName', type: 'none' }
        ];
        var _fHeaderAry = [
            { name: 'sons', type: 'attr' },
            { title: '名称', name: 'title', type: 'none', width: 260 },
            { title: '修改日期', name: 'cTime', type: 'date', width: 150 },
            { title: '类型', name: 'extName', type: 'none', width: 120 },
            { title: '大小', name: 'size', type: 'none', width: 120 },
            { title: '上传者', name: 'cPerson', type: 'none', ifTrans: true, trans: 'SYS_TRANS_USER', width: 80 }
        ];
        var comArgs = {
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 320, dir: 'we', dirLock: 1 },
            'mainList': { ifShowIcon: true, aHeader: _mHeaderAry, style: 'tree:nodeName', loadApi: 'm=SYS_TABLE_TREE&action=getTreeListByPid&table=' + args.table + '&pid=' + args.rootID, onSuccess: function (obj) { obj.List.fireClick(0); }, onTDClick: onListClick },
            'userTips': { head_h: 30, title: '权限用户', icon: 'icon-glyph-user', ifFixedHeight: false },
            'roleTips': { head_h: 30, title: '权限角色', icon: 'icon-glyph-inbox', ifFixedHeight: false },
            'uSelector': {},
            'rSelector': { whereSql: '{"pid,in":"2,3"}' }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'rootLayout',
            eHead: { type: 'List', name: 'mainList' },
            eFoot: [
                { type: 'AttrPanel', name: 'userTips', owner: { name: 'uSelector', type: 'UserSelector' } },
                { type: 'AttrPanel', name: 'roleTips', owner: { name: 'rSelector', type: 'RoleSelector' } }
            ]
        }
        coms = $.layout({ args: comArgs, struct: struct });
        mainList = coms.dirList; uSelector = coms.uSelector; rSelector = coms.rSelector;
    }
    function _event() { }
    function _override() { }
    me.saveSetting = function () {
        if (!currID) { MTips.show('请先选择功能块!', 'warn'); return; }
        MConfirm.show('确定修改权限?').setWidth(220).evt('onOk', function () {
            var _uids = ',' + uSelector.getUsers()[0].join(',') + ',', _rids = ',' + rSelector.getRoles()[0].join(',') + ',';
            $.Util.ajax({
                args: {
                    m: 'SYS_TABLE_TREE',
                    table: args.table,
                    action: 'updateNodeByID',
                    id: currID,
                    json: '{"users":"' + _uids + '","roles":"' + _rids + '"}'
                },
                onSuccess: function () { MTips.show('保存成功!', 'ok'); }
            });
        });
    }
    function onListClick(obj) {
        currID = obj.Target.getAttr('id');
        $.Util.ajax({
            args: 'm=SYS_TABLE_TREE&action=getNodeByID&keyFields=users,roles&table=' + args.table + '&id=' + currID,
            onSuccess: function (data) {
                var _dAry = data.get(0).split('\u0001');
                uSelector.setUsers(_dAry[0].split(',')); rSelector.setRoles(_dAry[1].split(','));
            }
        });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}