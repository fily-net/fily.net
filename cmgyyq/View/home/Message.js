$.NameSpace('$View.home');
$View.home.Message = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, data: [] };
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.h('<ul class="msg-list"></ul>').fc();
        var _str = '', _len = args.data.length, _item = null;
        for (var i = 0; i < _len; i++) {
            _item = args.data[i];
            _str += '<li url="' + _item.url + '" class="idx'+i+'"><div class="icon"><a class="fa ' + _item.icon + '"></a></div><div class="text"><span>' + _item.text + '</span><span class="count">'+_item.count+'</span></div></li>';
        }
        owner.h(_str).evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t; e.stop();
            var _eLi = findLi(_e), _url = _eLi.attr('url');
            if (_url) {
                new $.UI.View({ p: $('main-body-center'), url: _url });
            }
        });
        
    }

    function findLi(_e) {
        if (_e.tagName == 'LI') {
            return _e;
        } else {
            return findLi(_e.pn());
        }
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


