$.NameSpace('$View.generate');
$View.generate.$fileName$ = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms = {};
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = $comArgs$;
        var struct = $structArgs$;
        coms = $.Util.initUI({ args: comArgs, struct: struct, p: owner });

        //--**--Codeing here--**--//
    }

    function bindEvent() {
        //--**--Codeing here--**--//
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