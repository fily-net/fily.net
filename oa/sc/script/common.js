$(function () {
    var _curr = 0, _pos = { 0: 0, 1: 1529, 2: 3104, 3: 5863 }, _ifRun = false;
    new $.UI.Tab({ p: $('yiDongAdv') }); new $.UI.Tab({ p: $('weiYingXiao') });
    var _navMenu = new $.UI.NavMenu({
        p: $('topMenu'), onClick: function (obj) {
            console.log($DB);
            $DB.scrollTo({ top: _pos[+obj.Index], onComplete: function () { _ifRun = false; } });
        }
    });
    $.MouseScroll.evt(document.body, 'mousewheel', function (e) {
        $.MouseScroll.stop(e);
        if (!_ifRun) {
            var delta = $.MouseScroll.getWheelValue(e);
            _curr += delta;
            if (_curr < 0) { _curr = 0; };
            if (_curr > 3) { _curr = 3; };
            _ifRun = true;
            _navMenu.fireClick(_curr);
        }
    });
    $(window).evt('scroll', function (e) {
        return;
        var e = $.e.fix(e), _e = e.t;
        var _st = document.body.scrollTop;
        console.log(_st);
        return;
        console.log('xxx');
        //console.log(_st);
        if (_st > 1882) {
            _navMenu.setSel(2);
        } else if (_st > 1062) {
            _navMenu.setSel(1);
        } else {
            _navMenu.setSel(0);
        }
    });
});
