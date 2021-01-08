$.NameSpace('$View.main');
$View.main.ModuleView = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, moduleId: 156 };
    var coms = {}, mainLayout;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp module-view');
        var comArgs = {
            'rootLayout': { min: 180, max: 320, isRoot: 1, start: 200, dir: 'we', dirLock: 1 }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'rootLayout'
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        mainLayout = coms.rootLayout;
        loadMenu();
    }

    function loadMenu() {
        $.Util.ajax({
            args: 'm=SYS_CM_HOME&action=getMenuByPid&dataType=json&pid=' + args.moduleId,
            onSuccess: function (d) {
                var _sAry = eval(d.get(0)||'[]');
                var _dTree = new $.Util.HashTree({ dataSrc: _sAry, key: 'id' });
                mainLayout.eHead.h(getMenuString(_dTree));
            },
            onError: function (d) {
                MTips.show(d.data, 'warn');
            }
        });
    }

    function getMenuString(_dTree) {
        var _rootAry = _dTree.rootAry, _str = '<ul class="nav-menu-level2">', _dc = _dTree.hashObjs;
        for (var i = 0, _len = _rootAry.length; i < _len; i++) {
            var _node = _dc[_rootAry[i]], _nextAry = _node.next.split(' ');
            _str += '<li><i></i><div>' + _node.obj.nodeName + '</div>';
            if (_nextAry.length) {
                _str += '<ul class="nav-menu-level3">'
                for (var j = 0, _jLen = _nextAry.length; j < _jLen; j++) {
                    if (_nextAry[j]) {
                        var _obj = _dc[_nextAry[j]];
                        _str += '<li>' + _obj.obj.nodeName + '</li>';
                    }
                }
                _str += '</ul>';
            }
            _str += '</li>';
        }
        _str += '</ul>';
        return _str;
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