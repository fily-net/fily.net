$.NameSpace('$View.project');
$View.project.Index = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB }, container;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var mainTips = new $.UI.Tips({
            p: args.p,
            title: '工程管理平台',
            icon: 'fa-briefcase',
            cn: 'b0',
            head_h: 34
        });
        container = mainTips.body.h('<ul class="msg-list" style="border:none;"></ul>').fc();
        var _typeAry = [
            { icon: 'fa-google-wallet', type: '457', text: '道路排管' },
            { icon: 'fa-paypal', type: '768', text: '街坊排管' },
            { icon: 'fa-bank', type: '458', text: '住房配套' },
            { icon: 'fa-ship', type: '760', text: '居民接水' },
            { icon: 'fa-exchange', type: '463', text: '旧管网改困' },
            { icon: 'fa-building-o', type: '464', text: '总表分装' },
            { icon: 'fa-try', type: '465', text: '中心市政代办' },
            { icon: 'fa-rub', type: '769', text: '管理所代办' },
            { icon: 'fa-inr', type: '770', text: '泵房代办' },
            { icon: 'fa-truck', type: '467', text: '其他' },
            { icon: 'fa-tasks', type: '0', text: '全部工程' }
        ];
        var _str = '', _len = _typeAry.length, _item = null;
        for (var i = 0; i < _len; i++) {
            _item = _typeAry[i];
            _str += '<li style="margin:5px;" class="idx' + i + '" idx="'+_item.type+'"><div class="icon"><a class="fa ' + _item.icon + '"></a></div><div class="text"><span>' + _item.text + '</span></div></li>';
        }

        container.h(_str).evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t; e.stop();
            var _eLi = findLi(_e), _idx = _eLi.attr('idx');
            if (_idx) {
                new $.UI.View({ p: $('main-body-center'), url: 'View/project/PMFullScreen.js', typeId: _idx });
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


