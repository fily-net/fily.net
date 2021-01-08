$.NameSpace('$View.yh');
$View.yh.OtherTask = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() { new $.UI.View({ p: args.p, url: 'View/yh/YHTask.js', proType: 0, proId: 0, status: 349 }); }
    me.init = function (j) { setDefault(j); layout(); return me; }
    if (arguments.length) { me.init(j); }
    return me;
}