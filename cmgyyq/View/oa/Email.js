$.NameSpace('$View.oa');
$View.oa.Email = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB }, coms, view, navMenu;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        $.Util.ajax({
            args: 'm=SYS_CM_EMAIL&action=getPersonalMailInfo',
            onSuccess: function (d) {
                if (+d.get(0) == 11) {
                    _layout();
                    navMenu.items['receipt'].eLi.lastChild.innerHTML = '收信<strong class="tag-red">' + d.get(1) + '</strong>';
                } else {
                    owner.h('<div class="tac c_6 fs12 lh30">您的邮件服务还未开通哦，请先联系系统管理员帮您开通相关服务!</div>');
                }
            }
        });
    }
    function _layout() {
        var _navAry = [
            { text: '写信', name: 'write', icon: 'fa fa-pencil-square-o', url: 'View/oa/EmailEditor.js' },
            { text: '收信', name: 'receipt', icon: 'fa fa-envelope', url: 'View/oa/EmailReceived.js' },
            { text: '草稿箱', name: 'saveAsCopy', icon: 'fa fa-envelope-square', url: 'View/oa/EmailDrafts.js' },
            { text: '已发送', name: 'send', icon: 'fa fa-check-circle-o', url: 'View/oa/EmailSended.js' },
            { text: '已删除', name: 'del', icon: 'fa fa-trash-o', url: 'View/oa/EmailDeled.js' }
        ];
        var comArgs = {
            'root': { head_h: 30, icon: 'fa-envelope', title: '系统站内邮件', cn: 'b0' },
            'rootLayout': { min: 150, max: 500, isRoot: 1, ifDrag: false, ifCover: false, start: 200, dir: 'we', dirLock: 1 },
            'navMenu': { skin: 'EmailList', css: '', items: _navAry, onClick: onMenuClick },
            'folder': { style: 'tree:nodeName', loadApi: 'm=SYS_CM_EMAIL&action=getEmailListByCondition&jsonCondition={"pid":0,"type":0}', css: 'margin-top:5px;' },
            'emailView': { email: me }
        }
        var viewStruct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: [
                    { type: 'Menu', name: 'navMenu' }
                    //{ type: 'List', name: 'folder' }
                ],
                eFoot: { type: 'View', name: 'emailView' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
        view = coms.emailView;
        navMenu = coms.navMenu;
        me.fireClick(0);
    }
    me.fireClick = function (name) { navMenu.fireClick(name); }
    me.setSelected = function (name) { navMenu.setSelected(name); }
    function onMenuClick(obj) {
        if (!obj.Item.Args.url) { return false; }
        view.loadView({ url: obj.Item.Args.url, mainView: me });
    }
    me.fireClick = function (name) {
        navMenu.fireClick(name);
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