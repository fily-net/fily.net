$.NameSpace('$View.adjective');
$View.adjective.TuanZhiBu = function (j) {
    var me = this, _fn = function () { };
    var args = { p: $DB };
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var owner = args.p.adElm('', 'div');
        var comArgs = { 'view': { url: 'View/oa/Library.js', rootID: 45, gbsID: 52, title: '团支部文档管理'} };
        var struct = { p: owner, type: 'View', name: 'view' }
        $.Util.initUI({ args: comArgs, struct: struct });
    }
    me.init = function (j) { setDefault(j); layout(); return me; }
    if (arguments.length) { me.init(j); }
    return me;
}