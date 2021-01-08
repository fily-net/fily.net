$.namespace('$View.user');
$View.user.UserList = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var _api = 'm=SYS_CM_USERS&action=getUsers', formBtn, infoF, toolBar, uList;
    function _default() { }
    function _layout() {
        var _userHAry = [
            { name: 'uid', type: 'none', title: '用户名', width: 120 },
            { name: 'cName', type: 'none', title: '中文名', width: 120 },
            { name: 'eName', type: 'none', title: '英文名', width: 80 },
            { name: 'sex', type: 'none', ifTrans: true, title: '性别', width: 60 },
            { name: 'birthday', type: 'date', title: '出生年月', width: 140 },
            { name: 'fixedPhoneNum', type: 'none', title: '座机电话', width: 120 },
            { name: 'mobilePhoneNum', type: 'none', title: '移动电话', width: 120 },
            { name: 'email', type: 'none', title: '邮件地址', width: 150 },
            { name: 'address', type: 'none', title: '常住地址', width: 150 },
            { name: 'department', ifTrans: true, trans: 'SYS_TRANS_ROLE', title: '部门', width: 110 },
            { name: 'note', type: 'none', title: '备注', width: 150 }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'userTips': { head_h: 37, title: '员工花名册', icon: 'icon-glyph-user', cn: 'b0'},
            'userList': { aHeader: _userHAry, deleteApi: _api + '&action=delUsers', loadApi: _api, updateApi: _api + '&action=updateUser', colControls: { header: {}, paging: {} } }
        }
        var viewStruct = { p: owner, type: 'Tips', name: 'userTips', body: { type: 'List', name: 'userList'} };
        coms = $.layout({ args: comArgs, struct: viewStruct });
        toolBar = coms.userTips.toolBar; infoF = coms.userForm; uList = coms.userList;
    }
    function _event() { }
    function _override() { }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            
        }
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}