$.NameSpace('$View.fily');
$View.fily.IconSelector = function (j) {
    var me = this, _fn = function () { };
    var owner, args = { p: $DB, cn: '', onItemClick: _fn }, pObj = {}, clipBoard;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = new $.UI.Tips({ p: args.p, head_h: 0, title: '图标选择器', cn: 'IconSelector' });
        $.Util.ajax({
            args: { m: 'SYS_CM_UI', action: 'getAllFAIcon' },
            cbFn: {
                onSuccess: function (data) {
                    var _iAry = data.get(0).split('^');
                    for (var i = 0, _iLen = _iAry.length; i < _iLen; i++) { addIcon(_iAry[i]); }
                }
            }
        });
    }

    function addIcon(val) {
        var _eT = owner.body;
        var _eLi = _eT.adElm('', 'li').cn('icon-item').h('<a class="fa ' + val + '"></a><a>' + val + '</a><a class="copy" title="复制"></a>');
        _eLi.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t; e.stop();
            var _val = '';
            if (_e.tagName == 'LI') {
                _e = _e.fc();
            }
            if (_e.tagName == 'A'&&!_e.className) {
                _e = _e.pn().fc();
            }
            if (_e&&_e.tagName == 'A' && _e.className) { _val = _e.className; }
            args.onItemClick({ Self: me, Value: _val, Li: _e });
        });
    }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.show = function () { owner.show(); return me; }
    me.hide = function () { owner.hide(); return me; }
    me.remove = function () { owner.remove(); me = null; delete me; }
    me.init = function (j) { setDefault(j); layout(); return me; }
    if (arguments.length) { me.init(j); }
    return me;
}