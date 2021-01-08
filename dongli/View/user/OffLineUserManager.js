$.NameSpace('$View.user');
$View.user.OffLineUserManager = function (j) {
    var me = this, _fn = function () { };
    var owner, coms, uList;
    var args = { p: $DB };
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _userHAry = [
            { name: 'cb', type: 'checkbox', width: 50 },
            { name: 'uid', type: 'none', title: '用户名', width: 80, ifFilter: true, filterItems: ['like'] },
            { name: 'cName', type: 'none', title: '中文名', width: 80 },
            { name: 'icCard', type: 'none', title: 'IC卡号', width: 90 },
            { name: 'eName', type: 'none', title: '英文名', width: 80 },
            { name: 'sex', type: 'select', ifTrans: true, title: '性别', width: 60, ifFilter: true, filterItems: ['equal'], gtID: 131 },
            { name: 'birthday', type: 'date', title: '出生年月', width: 140 },
            { name: 'fixedPhoneNum', type: 'none', title: '座机电话', width: 120, ifEnabledTips: true },
            { name: 'mobilePhoneNum', type: 'none', title: '移动电话', width: 120, ifEnabledTips: true },
            { name: 'email', type: 'none', title: '邮件地址', width: 150, ifEnabledTips: true },
            { name: 'address', type: 'none', title: '常住地址', width: 150, ifEnabledTips: true },
            { name: 'ifEnableEmail', type: 'select', title: '是否启用邮件', width: 90, ifFilter: true, filterItems: ['equal'], gtID: 10 },
            { name: 'titles', type: 'select', title: '原职称', width: 80, ifFilter: true, filterItems: ['equal'], gtID: 143 },
            { name: 'department', type: 'select', ifTrans: true, trans: 'SYS_TRANS_ROLE', title: '原部门', width: 90, ifFilter: true, filterItems: ['equal'], loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid":3}' },
            { name: 'note', type: 'none', title: '备注', width: 120, ifEnabledTips: true }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'userTips': { head_h: 30, title: '离职员工管理', icon: 'icon-glyph-user', cn: 'b0', onToolBarClick: onToolBarClick, toolBarSkin: 'mr5 Button-default', gbsID: 124 },
            'userList': { aHeader: _userHAry, ifEnabledFilter: true, loadApi: 'm=SYS_TABLE_BASE&table=SYS_CM_USER&action=pagingForList&delFlag=1', colControls: { header: {}, paging: { pageIndex: 1, pageSize: 20}} }
        }
        var viewStruct = { p: owner, type: 'Tips', name: 'userTips', body: { type: 'List', name: 'userList'} }
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct }); uList = coms.userList;
    }
    function onToolBarClick(obj) {
        switch (+obj.Name) {
            case 125:
                var _ids = uList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择人', 'warn'); return; }
                MConfirm.setWidth(250).show('确定恢复该' + _ids.length + '人?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_BASE&table=SYS_CM_USER&action=reStoreByIds&ids=' + _ids.join(','),
                        onSuccess: function () { uList.refresh(); }
                    });
                });
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