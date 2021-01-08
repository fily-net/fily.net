$.namespace('$View.crm');
$View.crm.MyInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'ul').cn('List');
        loadPersonInfo();
    }
    function loadPersonInfo() {
        $.Util.ajax({
            args: 'm=SYS_CM_USERS&action=getUserInfo&keyFields=uid as "用户名", dbo.SYS_TRANS_GT(sex) as "性别", dbo.SYS_TRANS_ROLE(department) as "部门", email as "邮箱", fixedPhoneNum as "座机", mobilePhoneNum as "手机"&dataType=json&id=' + $.ck.get('SESSIONID') || 2,
            onSuccess: function (d) {
                var _infoObj = eval(d.get(0) || '[]')[0];
                for (var k in _infoObj) {
                    owner.adElm('', 'li').h('<div><strong>' + k + '：</strong>' + _infoObj[k] + '</div>');
                }
            },
            onError: function (d) { MTips.show(d.data || '加载失败', 'error'); }
        });
    }
    me.init = function (j) { setDefault(j); layout(); return me; }
    if (arguments.length) { me.init(j); }
    return me;
}