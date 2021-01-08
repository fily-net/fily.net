$.namespace('$View.yh');
$View.yh.OtherTask = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    function _default() { }
    function _layout() {
        new $.UI.View({ p: args.p, url: 'View/yh/YHTask.js', proType: 0, proId: 0, status: 349 });
    }
    function _event() { }
    function _override() { }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}