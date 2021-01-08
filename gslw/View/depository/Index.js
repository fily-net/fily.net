$.NameSpace('$View.depository');
$View.depository.Index = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms = {};
    var views = [];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _itemAry = [
            { name: 'mM', text: '物资管理', js: 'View/depository/MaterialManager.js' },
            { name: 'whM', text: '仓库结构管理', js: 'View/depository/WHManager.js' },
            { name: 'stockM', text: '仓库管理', js: 'View/depository/Stock.js' },
            { name: 'stockwfM', text: '任务管理', js: 'View/depository/StockTask.js' }
        ];
        var comArgs = {
            'root': { head_h: 30, items: _itemAry, loadMode: 'click' }
        }
        var struct = { p: owner, type: 'Tab', name: 'root' }
        coms = $.Util.initUI({ args: comArgs, struct: struct });

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