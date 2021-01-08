$.namespace('$View.depository');
$View.depository.Index = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _itemAry = [
            { name: 'mM', text: '物资管理', js: 'View/depository/MaterialManager.js' },
            { name: 'whM', text: '仓库结构管理', js: 'View/depository/WHManager.js' },
            { name: 'stockM', text: '仓库管理', js: 'View/depository/Stock.js' },
            { name: 'stockwfM', text: '任务管理', js: 'View/depository/StockTask.js' }
        ];
        var comArgs = { 'root': { head_h: 30, items: _itemAry, loadMode: 'click' } };
        var struct = { p: owner, type: 'Tab', name: 'root' };
        coms = $.layout({ args: comArgs, struct: struct });
    }
    function _event() {}
    function _override() {}
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}