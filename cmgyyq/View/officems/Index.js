$.NameSpace('$View.officems');
$View.officems.Index = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB }, container;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var mainTips = new $.UI.Tips({
            p: args.p,
            title: '办公用品',
            icon: 'fa-briefcase',
            cn: 'b0',
            head_h: 34
        });
        container = mainTips.body.h('<ul class="msg-list" style="border:none;"></ul>').fc();
        var _typeAry = [
            { icon: 'fa-google-wallet', url: 'View/officems/OutStock.js', text: '办公用品申领' },
            { icon: 'fa-paypal', url: 'View/officems/InStock.js', text: '办公用品申购' }
        ];
        var _str = '', _len = _typeAry.length, _item = null;
        for (var i = 0; i < _len; i++) {
            _item = _typeAry[i];
            _str += '<li style="margin:5px;" class="idx' + i + '" url="'+_item.url+'"><div class="icon"><a class="fa ' + _item.icon + '"></a></div><div class="text"><span>' + _item.text + '</span></div></li>';
        }

        container.h(_str).evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t; e.stop();
            var _eLi = findLi(_e), _idx = _eLi.attr('url');
            if (_idx) {
                new $.UI.View({ p: $('main-body-center'), url: _idx });
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


