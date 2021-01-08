$.namespace('$View.oa');
$View.oa.Email = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var view, navMenu;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        $.Util.ajax({
            args: 'm=SYS_CM_EMAIL&action=getPersonalMailInfo',
            onSuccess: function (d) {
                if (+d.get(0) == 11) {
                    __layout();
                    navMenu.items['receipt'].eLi.lastChild.innerHTML = '收信<strong style="color:red;">('+d.get(1)+')</strong>';
                } else {
                    owner.h('<div class="tac c_6 fs12 lh30">您的邮件服务还未开通哦，请先联系系统管理员帮您开通相关服务!</div>');
                }
            }
        });
    }
    function _event() { }
    function _override() { }
    function __layout() {
        var _navAry = [
            { text: '写信', name: 'write', icon: 'icon-glyph-pencil' },
            { text: '收信', name: 'receipt', icon: 'icon-compact-email-read' },
            { text: '草稿箱', name: 'saveAsCopy', icon: 'icon-glyph-gift' },
            { text: '已发送', name: 'send', icon: 'icon-glyph-ok-circle' },
            { text: '已删除', name: 'del', icon: 'icon-glyph-trash' }
        ];
        var comArgs = {
            'root': { head_h: 30, icon: 'icon-glyph-envelope', title: '系统站内邮件', cn: 'b0' },
            'rootLayout': { min: 150, max: 500, isRoot: 1, start: 200, dir: 'we', dirLock: 1 },
            'navMenu': { css: '', items: _navAry, onClick: onMenuClick },
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
                    { type: 'Menu', name: 'navMenu' },
                    { type: 'List', name: 'folder' }
                ],
                eFoot: { type: 'View', name: 'emailView' }
            }
        }
        coms = $.layout({ args: comArgs, struct: viewStruct });
        view = coms.emailView; navMenu = coms.navMenu; navMenu.fireClick(0);
    }
    me.fireClick = function (name) { navMenu.fireClick(name); }
    me.setSelected = function (name) { navMenu.setSelected(name); }
    function onMenuClick(obj) {
        switch (obj.Name) {
            case 'write':
                view.loadView({ url: 'View/oa/EmailEditor.js' });
                break;
            case 'receipt':
                view.loadView({ url: 'View/oa/EmailReceived.js' });
                break;
            case 'saveAsCopy':
                view.loadView({ url: 'View/oa/EmailDrafts.js' });
                break;
            case 'send':
                view.loadView({ url: 'View/oa/EmailSended.js' });
                break;
            case 'del':
                view.loadView({ url: 'View/oa/EmailDeled.js' });
                break;
        }
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}