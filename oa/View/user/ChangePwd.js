$.namespace('$View.user');
$View.user.ChangePwd = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var views = [];
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _fiAry = [
            { name: 'old_pwd', title: '原密码', comType: 'Pwd', req: true, group: { width: 320 } },
            { name: 'new_pwd', title: '新密码', comType: 'Pwd', req: true },
            { name: 're_new_pwd', title: '重复新密码', comType: 'RePwd', matchItem: 'new_pwd', req: true }
        ];
        var comArgs = { 'infoForm': { head_h: 22, foot_h: 30, extSubmitVal: { id: $.ck.get('SESSIONID') }, onSubmitSuccess: onFormSubmitSuccess, updateApi: 'm=SYS_CM_USERS&action=changePwd', state: 'Update', btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '修改密码', icon: 'icon-glyph-edit', css: 'margin-left:102px;' }], ifFixedHeight: false, title: '修改密码', icon: 'icon-glyph-lock', items: _fiAry } }
        var struct = { p: owner, type: 'Form', name: 'infoForm' }
        coms = $.layout({ args: comArgs, struct: struct });
    }
    function _event() { }
    function _override() { }
    function onFormSubmitSuccess() { MTips.show('密码修改成功', 'ok'); setTimeout(function () { window.location.reload(); }, 1000); }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}