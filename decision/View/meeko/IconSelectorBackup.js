$.NameSpace('$View.meeko');
$View.meeko.IconSelectorBackup = function (j) {
    var me = this, _fn = function () { };
    var owner, args = { p: $DB, cn: '', onItemClick: _fn }, pObj = {}, clipBoard;
    var tItems = [
        { name: 'glyph', text: 'Glyph(14*14)', ifPress: true },
        { name: 'compact', text: 'Compact(14*14)' },
        { name: 'newsmall', text: 'Newsmall' },
        { name: 'symbols', text: 'Symbols' },
        { name: 'vector', text: 'Vector(18*18)' },
        { name: 'filetype', text: 'FileType(52*54)' },
        { name: 'filter', text: 'Filter(16*16)' },
        { name: 'navmenu', text: 'NavMenu(16*16)' }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = new $.UI.Tab({ p: args.p, items: tItems, cn: 'IconSelector' });
        for (var i in owner.items) { var _obj = owner.items[i]; pObj[_obj.Name] = _obj.Body; }
        $.Util.ajax({
            args: { m: 'SYS_CM_UI', action: 'getAllIcon' },
            cbFn: {
                onSuccess: function (data) {
                    var _iAry = data.get(0).split('^');
                    for (var i = 0, _iLen = _iAry.length; i < _iLen; i++) { addIcon(_iAry[i]); }
                }
            }
        });
    }

    function addIcon(val) {
        var _eT = pObj[val.split('-')[1]];
        var _eLi = _eT.adElm('', 'li').cn('icon-item').h('<a class="icon ' + val + '"></a><a>' + val + '</a><a class="copy" title="复制"></a>');
        _eLi.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t; e.stop();
            if (_e.tagName) { _e = _e.pn(); }
            args.onItemClick({ Self: me, Value: _e.chn(1).h(), Li: _e });
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