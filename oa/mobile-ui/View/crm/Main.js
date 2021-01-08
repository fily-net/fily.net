$.namespace('$View.crm');
$View.crm.Main = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms = {}, infoView;
    var toolAry = [
        { name: 'exit', text: '退出' }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootDiv': { head_h: 45, foot_h: 45, title: '<img src="images/logo.png" style="width:180px; margin-top:5px;">', toolBarAry: toolAry, onToolBarClick: onToolBarClick },
            'infoTab': { ifAutoClick: false, items: [{ text: '我的信息', name: 'myInfo', url: 'View/crm/MyInfo.js' }, { text: '公告', name: 'news', url: 'View/crm/MsgList.js' }, { text: '商户', name: 'merchant', url: 'View/crm/Merchant.js' }, { text: '渠道', name: 'channel', url: 'View/crm/Channel.js'}], onClick: onTabClick },
            'infoView': {}
        }
        var struct = {
            p: owner,
            type: 'Panel',
            name: 'rootDiv',
            body: { name: 'infoView', type: 'View' },
            foot: { name: 'infoTab', type: 'Tab' }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        infoView = coms.infoView; coms.infoTab.fireClick(0);
    }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'exit':
                $.Util.ajax({ args: 'm=SYS_CM_USERS&action=logout', onSuccess: function () { $.ck.clear(); setTimeout(function () { window.location.href = 'index.html'; }, 1000); }, onError: function () { } });
                break;
        }
    }
    function onTabClick(obj) { infoView.loadView({ url: obj.url }); }
    me.init = function (j) { setDefault(j); layout(); return me; }
    if (arguments.length) { me.init(j); }
    return me;
}