﻿$.namespace('$View.adjective');
$View.adjective.DangWu = function (args) {
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB };
    function _default() {}
    function _layout() {
        var owner = args.p.adElm('', 'div');
        var comArgs = { 'view': { url: 'View/oa/Library.js', rootID: 43, gbsID: 50, title: '党务文档管理' } };
        var struct = { p: owner, type: 'View', name: 'view' }
        $.layout({ args: comArgs, struct: struct });
    }
    function _event() { }
    function _override() {}
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}