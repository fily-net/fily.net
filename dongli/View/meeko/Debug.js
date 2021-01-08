$.NameSpace('$View.common');
$View.common.Debug = function () {
    var me = this, _fn = function () { };
    var args = { p: $DB }, owner, _super = this.constructor.SuperClass;
    //console.log(_super.getOwner());
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div');
        owner.h('<div style="top:100px;left:100px;width:100px;height:100px;" class="b_1"><div>');
        _super.setOwner(owner);
        console.log(_super);
        //--**--Codeing here--**--//
    }
    function bindEvent() {
        //--**--Codeing here--**--//
    }
    me.init = function (j) { setDefault(j); layout(); bindEvent(); return me; }
    return me;
} .extend($.UI.ViewClass);