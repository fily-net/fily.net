$.namespace('$View.adjective');
$View.adjective.XiaZai = function (args) {
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB };
    function _default() { }
    function _layout() {
        var owner = args.p.adElm('', 'div');
        var comArgs = { 'view': { url: 'View/oa/Library.js', rootID: 46, gbsID: 53, title: '下载管理' } };
        var struct = { p: owner, type: 'View', name: 'view' }
        $.layout({ args: comArgs, struct: struct });
    }
    function _event() { }
    function _override() { }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}