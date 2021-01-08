﻿$.NameSpace('$View.user');
$View.user.UserInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, userId: null }, coms, infoF, popTips;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _userInfo = [
            { name: 'avatar', title: '', ifEdit: true, comType: 'Label', onClick: onImageClick, type: 'image' },
            { name: 'uid', title: '用户名', comType: 'Label' },
            { name: 'icCard', title: 'IC卡号', comType: 'Label' },
            { name: 'sex', title: '性别', comType: 'Label', ifTrans: true },
            { name: 'department', title: '部门', comType: 'Label', trans: 'SYS_TRANS_ROLE' },
            { name: 'post', title: '职位', comType: 'Label', trans: 'SYS_TRANS_ROLE' },
            { name: 'titles', title: '职称', comType: 'Label', ifTrans: true },
            { name: 'ifEnableEmail', title: '是否启用邮件', comType: 'Label', ifTrans: true },
            { name: 'fixedPhoneNum', title: '座机电话', comType: 'Label' },
            { name: 'birthday', title: '出生年月', comType: 'Label' },
            { name: 'mobilePhoneNum', title: '移动电话', comType: 'Label' },
            { name: 'address', title: '常住地址', comType: 'Label' },
            { name: 'email', title: '邮件', comType: 'Label' },
            { name: 'note', title: '备注', comType: 'Label' }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = { 'userForm': { head_h: 30, foot_h: 0, ifFixedHeight: false, loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=SYS_CM_USER', updateApi: 'm=SYS_CM_USERS&action=updateUser', title: '我的信息', icon: 'icon-vector-info-card', items: _userInfo} }
        var viewStruct = { p: owner, type: 'Form', name: 'userForm' };
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
        infoF = coms.userForm; me.setInfo(args.userId || $.ck.get('SESSIONID'));
    }
    function onImageClick(obj) {
        popTips = new $.UI.Tips({ comMode: 'x-auto', width: 500, height: 300, y: 100, head_h: 30, ifMask: true, ifClose: true, title: '上传头像', icon: 'icon-vector-man' });
        new $.UI.FileUploader({ p: popTips.body, uploadApi: 'm=SYS_CM_FILES&action=uploadAvatar&id=' + $.ck.get('SESSIONID'), onSuccess: function (cb) { var _nSrc = 'images/avatar/' + cb.File.fileName; obj._E.src = _nSrc; $($('info').lastChild).fc().src = _nSrc; } });
    }
    me.setInfo = function (id) { if (!id) { return me; } infoF.loadDataByID(id); return me; }
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