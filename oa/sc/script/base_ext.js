$.UI = {};
$.initArgs = function (oArgs, nArgs) {
    var _args = oArgs || {};
    for (var i in nArgs) { if (_args[i] == null) { _args[i] = nArgs[i]; } else { if (i == 'p' || i == 'pBody') { _args[i] = $(_args[i]); } } }
    return _args;
}
$.MouseScroll = new function () {
    var me = this, _fn = function () { };
    me.getWheelValue = function (e) {
        e = e || window.event;
        return (e.wheelDelta ? e.wheelDelta / 120 : -(e.detail % 3 == 0 ? e.detail / 3 : e.detail));
    }
    me.stop = function (e) {
        e = e || window.event;
        if (e.preventDefault) { e.preventDefault(); }
        e.returnValue = false;
    }
    //绑定事件,这里对mousewheel做了判断,注册时统一使用mousewheel 
    me.evt = function (obj, type, fn) {
        var isFirefox = typeof document.body.style.MozUserSelect != 'undefined';
        if (obj.addEventListener){
            obj.addEventListener(isFirefox ? 'DOMMouseScroll' : type, fn, false);
        }else{
            obj.attachEvent('on' + type, fn);
        }
        return me;
    }

    //移除事件,这里对mousewheel做了兼容,移除时统一使用mousewheel 
    me.removeEvt = function (obj, type, fn) {
        var isFirefox = typeof document.body.style.MozUserSelect != 'undefined';
        if (obj.removeEventListener){
            obj.removeEventListener(isFirefox ? 'DOMMouseScroll' : type, fn, false);
        }else{
            obj.detachEvent('on' + type, fn);
        }
        return me;
    }
    /*限制范围函数, 参数是三个数字,如果num 大于 max, 则返回max， 如果小于min，则返回min,如果在max和min之间，则返回num */
    me.range = function (num, max, min) { return Math.min(max, Math.max(num, min)); }
}

$.Scroll = new function () {
    var me = this, _fn = function () { };
    me.getScroll = function (key) {
        var t, l, w, h, _elm = document.body;
        if (document.documentElement && document.documentElement.scrollTop) { _elm = document.documentElement; } 
        t = _elm.scrollTop; l = _elm.scrollLeft; w = _elm.scrollWidth; h = _elm.scrollHeight;
        var _val = { top: t, left: l, width: w, height: h };
        if (key) { return _val[key]; } else { return _val; }
    }
    me.setScroll = function (key, value, fn) {
        var _elm = document.body, _val = value || 0, _k = 'scrollTop';
        if (document.documentElement && document.documentElement.scrollTop) { _elm = document.documentElement; }
        switch (key) {
            case 'top':
                //$(_elm).css('scroll-top:'+_val+'px;');
                _elm.scrollTop = _val; fn(me);
                _k = 'scroll-top'; break;
            case 'left':
                _k = 'scroll-left'; break;
            case 'width':
                _k = 'scroll-width'; break;
            case 'height':
                _k = 'scroll-height'; break;
        }
        //$(_elm).ease([_k], [_val], 600, 'easeOutQuart', { e: function (a) { fn(me); }, f: function (b) { console.log(b); } });
        return me;
    }
}

$.UI.Tab = function (j) {
    var me = this, _fn = function () { }, owner;
    var args = { p: $DB }, items = {}, _curr, _currIdx = 0;
    function setDefault(j) { args = $.initArgs(j, args);  }
    function bindEvent() {
        owner = $(args.p);
        var _temp = owner.chr(0), _eLeft = _temp.chr(0), _eRight = _temp.chr(1);
        var _eH = _temp.chr(2).chr(1), _eB = _temp.chr(3), _th, _tb, _tempIdx = 0;
        var _hAry = _eH.childNodes, _bAry = _eB.childNodes, _len = Math.min(_hAry.length, _bAry.length);
        for (var i = 0; i < _len; i++) {
            if ($(_hAry[i]).tagName == 'LI') {
                _th = $(_hAry[i]).attr('idx', _tempIdx); _tb = $(_bAry[i]).hide();
                items[_tempIdx] = { head: _th, body: _tb }; _tempIdx++;
                if (!_curr) { _curr = { head: _th, body: _tb }; }
            }
        }
        if (_curr) { _curr.head.ac('curr'); _curr.body.show();}
        _eH.evt('click', function (e){
            var e = $.e.fix(e), _e = e.t;      
            if (_e.tagName == 'LI') {
                var _idx = _e.attr('idx'), _val = items[_idx];
                _currIdx = _idx;
                if (_curr) { _curr.head.dc('curr'); _curr.body.hide(); }
                if (_val) { _curr = _val; _curr.head.ac('curr'); _curr.body.show(); }
            }
        });
        _eLeft.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t;
            _currIdx--;
            if (_currIdx < 0) { _currIdx = 0; }
            var _val = items[_currIdx];
            if (_curr) { _curr.head.dc('curr'); _curr.body.hide(); }
            if (_val) { _curr = _val; _curr.head.ac('curr'); _curr.body.show(); }
            e.stop();
        });
        _eRight.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t;
            _currIdx++;
            if (_currIdx > _tempIdx - 1) { _currIdx = _tempIdx - 1; }
            var _val = items[_currIdx];
            if (_curr) { _curr.head.dc('curr'); _curr.body.hide(); }
            if (_val) { _curr = _val; _curr.head.ac('curr'); _curr.body.show(); }
            e.stop();
        });
    }
    me.init = function (j) { setDefault(j); bindEvent(); return me; }
    if (arguments.length) { me.init(j); }
    return me;
}

$.UI.NavMenu = function (j) {
    var me = this, _fn = function () { }, owner;
    var args = { p: $DB, onClick: _fn }, items = {}, _curr;
    function setDefault(j) { args = $.initArgs(j, args); }
    function bindEvent() {
        owner = $(args.p);
        var _hAry = owner.childNodes, _len = _hAry.length, _idx = 0;
        for (var i = 0; i < _len; i++) {
            if ($(_hAry[i]).tagName == 'LI') {
                _th = $(_hAry[i]).attr('index', _idx);
                items[_idx] = _th; _idx++;
                if (!_curr) { _curr = _th; }
            }
        }
        if (_curr) { _curr.ac('curr'); }
        owner.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t;
            if (_e.tagName == 'A') { _e = _e.pn(); }
            if (_e.tagName == 'LI') { me.fireClick(_e.attr('index')); }
        });
    }
    me.init = function (j) { setDefault(j); bindEvent(); return me; }
    me.fireClick = function (k) {
        if (me.setSel(k)) { args.onClick({ Self: me, Index: k, Dom: _curr }); }; return me;
    };
    me.setSel = function (k) {
        var _val = items[k];
        if (_val) {
            if (_curr) { _curr.dc('curr'); }
            if (_val) { _curr = _val; _curr.ac('curr'); }
        }
        return _val;
    }
    if (arguments.length) { me.init(j); }
    return me;
}