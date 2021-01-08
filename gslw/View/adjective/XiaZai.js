$.NameSpace('$View.adjective');
$View.adjective.XiaZai = function (j) {
    var me = this, _fn = function () { };
    var args = { p: $DB };
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var owner = args.p.adElm('', 'div');
        var comArgs = { 'view': { url: 'View/oa/Library.js', rootID: 46, gbsID: 53, title: '下载管理'} };
        var struct = { p: owner, type: 'View', name: 'view' }
        $.Util.initUI({ args: comArgs, struct: struct });
    }
    me.init = function (j) { setDefault(j); layout(); return me; }
    if (arguments.length) { me.init(j); }
    return me;
}