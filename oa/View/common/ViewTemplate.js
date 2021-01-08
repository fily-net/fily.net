$.namespace('$View.common');
$View.common.ViewTemplate = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    function _default() {

    }
    function _layout() {
        
    }
    function _event() {

    }
    function _override() {

    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;





    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    function _default() { }
    function _layout() {
        
    }
    function _event() { }
    function _override() { }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;

}