$.NameSpace('$View.user');
$View.user.UserList = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms, _api = 'm=SYS_TABLE_BASE&table=SYS_CM_USER&action=pagingForList&delFlag=0&jsonCondition={"id,!":1}', formBtn, infoF, toolBar, uList;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _userHAry = [
            { name: 'uid', type: 'none', title: '登陆名', width: 100, ifFilter: true, filterItems: ['like'] },
            { name: 'cName', type: 'none', title: '姓名', width: 100 },
            { name: 'icCard', type: 'none', title: '人员编号', width: 80 },
            { name: 'department', type: 'select', ifTrans: true, trans: 'SYS_TRANS_ROLE', title: '部门', width: 110, ifFilter: true, filterItems: ['equal'], loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid":3}' },
            { name: 'titles', type: 'select', ifTrans: true, title: '人员状态', width: 100, ifFilter: true, filterItems: ['equal'], gtID: 143 },
            { name: 'sex', type: 'select', ifTrans: true, title: '性别', width: 60, ifFilter: true, filterItems: ['equal'], gtID: 131 },
            { name: 'birthday', type: 'date', title: '出生年月', width: 130 },
            { name: 'fixedPhoneNum', type: 'none', title: '座机电话', width: 120 },
            { name: 'mobilePhoneNum', type: 'none', title: '移动电话', width: 120 },
            { name: 'email', type: 'none', title: '邮件', width: 150 },
            { name: 'address', type: 'none', title: '常住地址', width: 150 },
            { name: 'note', type: 'none', title: '备注', width: 150 }
        ];
    
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'userTips': { head_h: 33, title: '员工花名册', icon: 'icon-glyph-user', cn: 'b0'},
            'userList': { aHeader: _userHAry, ifEnabledFilter: true, deleteApi: _api + '&action=delUsers', loadApi: _api, updateApi: _api + '&action=updateUser', colControls: { header: {}, paging: {} } }
        }
        var viewStruct = { p: owner, type: 'Tips', name: 'userTips', body: { type: 'List', name: 'userList'} };
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
        toolBar = coms.userTips.toolBar; infoF = coms.userForm; uList = coms.userList;
    }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            
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