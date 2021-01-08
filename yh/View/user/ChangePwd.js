$.NameSpace('$View.user');
$View.user.ChangePwd = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms = {};
    var views = [];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _fiAry = [
            { name: 'old_pwd', title: '原密码', comType: 'Pwd', req: true, group: {width :320} },
            { name: 'new_pwd', title: '新密码', comType: 'Pwd', req: true },
            { name: 're_new_pwd', title: '重复新密码', comType: 'RePwd', matchItem: 'new_pwd', req: true }
        ];
        var comArgs = { 'infoForm': { head_h: 22, foot_h: 30, extSubmitVal: { id: $.ck.get('SESSIONID') }, onSubmitSuccess: onFormSubmitSuccess, updateApi: 'm=SYS_CM_USERS&action=changePwd', state: 'Update', btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '修改密码', icon: 'icon-glyph-edit', css: 'margin-left:102px;'}], ifFixedHeight: false, title: '修改密码', icon: 'icon-glyph-lock', items: _fiAry} }
        var struct = { p: owner, type: 'Form', name: 'infoForm' }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
    }

    function onFormSubmitSuccess() { MTips.show('密码修改成功', 'ok'); setTimeout(function () { window.location.reload(); }, 1000); }

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