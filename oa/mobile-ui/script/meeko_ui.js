"use strict";
$.UI = {};
$.View = {};
$.global = {};
$.NameSpace = function (S) {
    var A = S.split('.'), A1 = A[0], obj = window[A1]
    if (!obj) { obj = {}; window[A1] = obj; }
    for (var i = 1, _iLen = A.length; i < _iLen; i++) { var T = A[i]; if (!obj[T]) { obj[T] = {}; obj = obj[T]; } }
}
$(function () {
    /*
        if (!window.MConfirm) { window.MConfirm = new $.UI.PopTips({ type: 'confirm', y: 120, icon: 'icon-glyph-question-sign', ifShow: false, ifMask: true }); }
        if (!window.MTips) { window.MTips = new $.UI.PopTips({ type: 'tips', ifShow: false }); }
        if (!window.MiniTips) { window.MiniTips = new $.UI.MiniTips({ ifShow: false, dir: 'top', css: 'padding:3px 5px;border:1px solid #FFC97C;background-color:#FFFEC9;z-index:25;max-width:320px;' }); }
        if (!window.ValidateTips) { window.ValidateTips = new $.UI.MiniTips({ ifShow: false, css: 'padding:3px 5px;border:1px solid #FFC97C;color:#E52C01;background-color:#FFFEC9;z-index:25;' }); }
    */
});
$.setCookie = function (key, value) {
    $.ck.set(key, value);
    if (window.localStorage) { window.localStorage[key] = value; }
}

$.getCookie = function (key) {
    var _val = $.ck.get(key);
    if (!_val && window.localStorage) { _val = window.localStorage[key]; }
    return _val;
}
$.showMask = function (ifShow) {
    if (ifShow) {
        $.global.mask = new $.UI.Mask({ p: $DB, alpha: 12 });
        $.global.mask.eContent.cn('tac pa').css('width:100%;padding:20px 0px;z-index:20;top:100px;').h('<img src="images/loading51.gif" />');
    } else {
        if ($.global.mask) { $.global.mask.remove(); $.global.mask.eContent.r(); $.global.mask = null; }
    }
}

$.UI.BaseDiv = function (j) {
    var me = this, _fn = function () { };
    var args = { p: $DB, head_h: 0, foot_h: 0, cn: '', css: '', skin: 'BaseDiv-Gray', onChange: _fn };
    var _hh, _fh, ver = $('').split(','), _ver1 = ver[0], _ver2 = +ver[1];
    var htmlTemp = '<div class="BaseDiv-Head" style="{0}"></div><div class="BaseDiv-Body scroll-webkit" style="{1}"></div><div class="BaseDiv-Foot" style="{2}"></div>';
    function setDefault(j) {
        for (var i in args) { var _n = j[i]; if (_n != null) { if (i == 'p') { _n = $(_n); } args[i] = _n; } }
        _hh = args.head_h; _fh = args.foot_h;
        htmlTemp = htmlTemp.format('height:' + _hh + 'px;line-height:' + _hh + 'px;', 'top:' + _hh + 'px;bottom:' + _fh + 'px;', 'height:' + _fh + 'px;line-height:' + _fh + 'px;');
    }
    function layout() {
        me.base = args.p.adElm('', 'div').cn('BaseDiv-Base ' + args.skin + ' ' + args.cn).css(args.css).h(htmlTemp);
        me.head = me.base.fc(); me._body = me.head.ns(); me.foot = me._body.ns(); me.body = me._body;
    }
    me.setHead = function (v) {
        me.head.css("height:" + v + "px;");
        me.body.css("top:" + v + "px;");
        if (_ver1 == 'msie' && _ver2 < 7) { me._body.css("bottom:" + (_fh + v) + "px;"); }
        args.onChange(me, v, 'head');
    }
    me.setFoot = function (v) {
        me.foot.css('height:' + v + 'px;'); me.body.css('bottom:' + v + 'px;');
        if (_ver1 == 'msie' && _ver2 < 7) { me._body.css('bottom:' + (v + _hh) + 'px;'); }
        body.css('bottom:' + v + 'px;');
        args.onChange(me, v, 'foot');
    }
    me.setBody = function (v, slip, cbFn) {
        var _h = head_h + v, _s = slip || 0, _f = cbFn || function () { };
        if (_s) { _base.ease(['height'], [_h], 600, 1, {}); } else { ; _base.css('height:' + _h + 'px;'); }
        _f(me, _base);
        args.onChange(me, v, 'body');
    }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.init = function (j) { setDefault(j); layout(); return me; }
    me.show = function () { owner.show(); return me; }
    me.hide = function () { owner.hide(); return me; }
    me.remove = function () { owner.r(); me = null; }
    if (arguments.length) { me.init(j); }
    return me;
}

$.UI.List = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = {
        p: $DB, items: [], loadApi: null,
        onMouseDown: _fn, onClick: _fn, onClose: _fn, onPress: _fn, onItemClick: _fn
    };
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', "ul").cn('List');
        for (var i = 0, _len = args.items.length; i < _len; i++) { me.addItem(args.items[i]); }
        me.loadAjax(args.loadApi, false);
    }
    me.addItem = function (obj) {
        var eLi = owner.adElm('', 'li').h('<div class="title"><div class="_title">' + obj.title + '</div><div class="_info"><span style="margin-right:15px;color:#E44636;">跟单人：' + obj.oPerson + '</span><span style="margin-right:15px;">创建人：' + obj.cPerson + '</span><span>创建时间：' + obj.cTime + '</span></div></div>').attr('vid', obj.id);
        eLi.evt('click', function (e) { args.onItemClick(obj); });
    }
    me.loadAjax = function (api, ifReset) {
        $.Util.ajax({
            args: api,
            onSuccess: function (d) {
                var _infos = eval(d.get(0) || '[]');
                if (ifReset != false) { owner.h(''); }
                for (var i = 0, _len = _infos.length; i < _len; i++) { me.addItem(_infos[i]); }
            },
            onError: function (d) { MTips.show(d.data || '加载失败', 'error'); }
        });
    }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.init = function (j) { setDefault(j); layout(); return me; }
    me.show = function () { owner.show(); return me; }
    me.hide = function () { owner.hide(); return me; }
    me.remove = function () { owner.r(); me = null; }
    if (arguments.length) { me.init(j); }
    return me;
}


/******$.UI组件 begin******/
$.UI.MiniTips = function (j) {
    var me = this, _fn = function () { };
    var args = {
        p: $DB, dir: 'top', pos: 10, x: 20, y: 20, minWidth: 25, minHeight: 18, ifShow: true, ifClose: false, text: '', comMode: 'border',
        arrowSize: 13, cn: 'r3 fs12', css: 'padding:3px 5px;border:1px solid #FFC97C;background-color:#FFFEC9;'
    };
    var p, dir, pos, minW, minH, arrSize;
    var owner, eDir, body;
    function setDefault(j) {
        args = $.Util.initArgs(j, args);
        dir = args.dir; pos = args.pos; minW = args.minWidth; minH = args.minHeight; arrSize = args.arrowSize;
    }
    function layout() {
        owner = args.p.adElm('', 'div').cn('pa z10 ' + args.cn).css(args.css);
        if (pos < 0) { pos = 0; }
        if (pos > minH) { pos = minH - arrSize; }
        if (pos > minW) { pos = minW - arrSize; }
        if (args.ifClose) {
            owner.css('padding:18px;')
            owner.adElm('', 'div').cn('w15 h15 fr cp').css('margin-top:-15px;margin-right:-15px;' + $.UI.ico24_xy(13, 0)).attr('title', '关闭')
            .evt('click', function () { me.remove(); })
        }
        body = owner.adElm('', 'div').cn('oh tac hp').css('min-width:' + minW + 'px;min-height:' + minH + 'px;line-height:18px;');
        me.body = body;
        var _dirCss = 'width:' + arrSize + 'px;height:' + arrSize + 'px;', _dirH = '';
        switch (dir) {
            case 'top':
                _dirCss += 'top:-' + arrSize + 'px;left:' + pos + 'px;';
                break;
            case 'bottom':
                _dirCss += 'bottom:-' + arrSize + 'px;left:' + pos + 'px;';
                break;
            case 'right':
                _dirCss += 'right:-' + arrSize + 'px;top:' + pos + 'px;';
                break;
            case 'left':
                _dirCss += 'left:-' + arrSize + 'px;top:' + pos + 'px;';
                break;
        }
        eDir = owner.adElm('', 'div').cn('pa oh').css(_dirCss);
        var _aBC = $S(owner).borderColor, _aBGC = $S(owner).backgroundColor;
        if (!_aBC) { _aBC = owner.cs('border-color'); }
        if (!_aBGC) { _aBGC = owner.cs('borderground-color'); }
        new $.UI.Arrow({ p: eDir, diff: 1, comMode: args.comMode, borderColor: _aBC, backgroundColor: _aBGC, cn: 'cp', css: args.css, dir: dir });
        me.setText(args.text); me.setPos(args.x, args.y);
        if (!args.ifShow) { me.hide(); }
    }
    me.setPos = function (x, y) { args.x = x; args.y = y; owner.css('left:' + x + 'px;top:' + y + 'px;'); return me; }
    me.setText = function (txt) { body.h(txt); return me; }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.init = function (j) { setDefault(j); layout(); return me; }
    me.show = function () { owner.show(); return me; }
    me.hide = function () { owner.hide(); return me; }
    me.remove = function () { owner.r(); me = null; }
    if (arguments.length) { me.init(j); }
    return me;
}

$.UI.Tab = function (j) {
    var me = this, _fn = function () { }, count = new $.nCount();
    var args = { p: $DB, items: [], skin: 'default', cn: '', css: '', ifAutoClick: true, onClick: _fn, onSuccess: _fn, onError: _fn };
    var owner, licss = '';
    me.items = {};
    me.aItem = [];
    me.selObj = null
    function setDefault(j) { args = $.Util.initArgs(j, args); licss = 'width:' + (100 / args.items.length) + '%;'; }
    function layout() {
        owner = args.p.adElm('', 'ul').cn('Tab ' + args.cn + ' ' + args.skin).css(args.css);
        if (args.ifAutoClick) { me.reLoadItems(args.items); } else { me.loadItems(args.items); }
    }
    me.addItem = function (obj, ifReturn) {
        var _obj = obj || {}, _ifR = ifReturn || false, _idx = count.getN(), _key = _obj.name || _idx;
        _obj.eLi = owner.adElm('', 'li').css(licss).attr('key', _key).h(obj.text).evt('click', function (e) { me.fireClick(_key); });
        _obj.Self = me;
        me.items[_key] = me.items[_idx] = _obj;
        me.aItem.push(_obj);
        if (_ifR) { return _btn; }
        return me;
    }

    me.fireClick = function (v) {
        var _obj = me.items[v];
        if (!_obj) { return me; }
        if (_obj == me.selObj) { return me; }
        if (me.selObj) { me.selObj.eLi.dc('sel'); }
        me.selObj = _obj; _obj.eLi.ac('sel');
        args.onClick(_obj);
        return me;
    }

    me.loadApi = function (api, onSucc, fields) {
        if (!api) { return me; }
        $.Util.ajax({
            args: api + '&dataType=json&keyFields=' + (fields || 'nodeName as text, id as name'),
            onSuccess: function (data) {
                var _iAry = eval(data.get(0) || '[]'), _onSucc = onSucc || args.onSuccess;
                me.reLoadItems(_iAry);
                _onSucc({ Self: me, items: _iAry });
            }
        });
        return me;
    }
    me.loadItems = function (items) { for (var i = 0, _iLen = items.length; i < _iLen; i++) { me.addItem(items[i]); }; return me; }
    me.reLoadItems = function (items) { me.clear(); me.loadItems(items); me.fireClick(0); return me; }
    me.clear = function () { owner.h(''); me.selObj = null; me.items = {}; me.aItem = []; count.setN(-1); return me; }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.init = function (j) { setDefault(j); layout(); return me; }
    me.show = function () { owner.show(); args.visibled = true; return me; }
    me.hide = function () { owner.hide(); args.visibled = false; return me; }
    me.remove = function () { owner.r(); me = null; }
    if (arguments.length) { me.init(j); }
    return me;
}

$.UI.Button = function (j) {
    var me = this, _fn = function () { };
    var css, cn, _skin;
    var owner, eIcon, eText;
    var args = {
        p: $DB, name: 'Btn', type: 'normal', text: '', skin: 'default', title: '', align: 'left',
        width: null, visibled: true, enabled: true, tab: 1, icon: '', cn: '', css: '',
        ifPress: false, ifClose: false, ifFocus: false, isMenu: false, ifVertical: false,
        onMouseDown: _fn, onClick: _fn, onClose: _fn, onPress: _fn, onMenuClick: _fn
    };
    function setDefault(j) {
        args = $.Util.initArgs(j, args);
        css = args.css; cn = args.cn;
        if (args.width) { css += ';width:' + args.width + 'px;'; }
        if (args.align == 'right') { cn += ' fr'; } else { cn += ' fl'; }
    }
    function layout() {
        owner = args.p.adElm('', "button").cn('base ' + cn + ' ' + args.skin).h(args.text);
        owner.onselectstart = function () { return false; }
        me.setFocus(args.ifFocus);
        me.setPress(args.ifPress);
        me.setEnabled(args.enabled);
        me.setVisibled(args.visibled);
    }

    function bindEvent() {
        owner.evt('click', function (e) {
            if (!args.enabled) { return; }
            var e = $.e.fix(e), _e = e.t;
            var cbArgs = { Button: me, Args: args, Name: args.name, Text: args.text, E: e, _E: _e, Owner: owner };
            args.onClick(cbArgs);
            e.stop();
        });
    }

    function clickMenu(eLi) {
        if ($.global.popTips) { $.global.popTips.remove(); }
        $.global.popTips = new $.UI.PopDialog({ p: $DB });
        var _mArgs = args.MArgs || {}, _pTips = $.global.popTips;
        _mArgs.type = 'Menu';
        _mArgs.items = args.items;
        _mArgs.checkedValue = me.get('value');
        _pTips.set('ePop', eLi).show().init(_mArgs, true)
            .evt('onClick', function (obj) {
                obj.Button = me; obj.BtnName = args.name; obj.BtnArgs = args; obj.PopTips = _pTips;
                if (args.onMenuClick(obj) != false) { _pTips.hide(); }
            });
    }

    me.fireClick = function (cbFn, ifPress) {
        var _f = cbFn || args.onClick, _ifPress = ifPress == null ? true : ifPress;
        if (!args.enabled) { return me; }
        if (args.type == 'toggle') { _ifPress = !args.ifPress; }
        if (args.type == 'normal') { _ifPress = false; }
        me.setPress(_ifPress);
        _f({ Button: me, Args: args, Name: args.name, Text: args.text });
        return me;
    }

    me.setEnabled = function (v) {
        if (v != null) {
            args.enabled = v;
            if (v) { owner.dc('disabled'); } else { owner.ac('disabled'); }
        }
        return me;
    }
    me.getEnabled = function () { return args.enabled; }
    me.setVisibled = function (v) {
        if (v != null && args.enabled) {
            if (v) { me.show(); } else { me.hide(); }
        }
        return me;
    }
    me.getVisibled = function () { return args.visibled; }
    me.setText = function (v) {
        if (v != null && args.enabled) { args.text = v; owner.h(v); }
        return me;
    }
    me.getText = function () { return args.text; }
    me.setFocus = function (v) {
        if (v != null && args.enabled) {
            args.ifFocus = v;
            if (v) { owner.ac('focus'); } else { owner.dc('focus'); }
        }
        return me;
    }
    me.setPress = function (v) {
        if (v != null && args.enabled) {
            args.ifPress = v;
            if (v) { owner.ac('press'); } else { owner.dc('press'); }
        }
        return me;
    }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.init = function (j) { setDefault(j); layout(); bindEvent(); return me; }
    me.show = function () { owner.show(); args.visibled = true; return me; }
    me.hide = function () { owner.hide(); args.visibled = false; return me; }
    me.remove = function () { owner.r(); me = null; }
    if (arguments.length) { me.init(j); }
    return me;
}



$.UI.ButtonSet = function (j) {
    var me = this, _fn = function () { }, count = new $.nCount();
    var args = { p: $DB, items: [], ifRights: false, itemSkin: null, itemAlign: 'left', cn: '', css: '', onClick: _fn };
    var owner;
    me.items = {};
    me.aItem = [];
    me.selTabItem = {};
    me.focusItem = null;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'ul').cn('fr '+args.cn).css(args.css);
        me.loadItems(args.items);
    }
    me.getItem = function (v) {
        if (v == null) { return; }
        if ($.getType(v) == 'object') { return v; }
        return me.items[v];
    }
    me.addItem = function (j, ifReturn) {
        var _j = j || {}, _ifR = ifReturn || false, _onClick = _j.onClick || _fn;
        _j.p = owner;
        _j.onClick = function (obj) { obj.ButtonSet = me; if (obj.Args.type == 'tab') { me.setSelTabItem(obj.Button); }; _onClick(obj); args.onClick(obj); }
        if (!_j.skin) { _j.skin = args.itemSkin; }
        if (!_j.align) { _j.align = args.itemAlign; }
        var _btn = new $.UI.Button(_j);
        _btn.evt('onClose', function (obj) { obj.ButtonSet = me; return args.onClose(obj); })
        me.items[_btn.get('name')] = me.items[count.getN()] = _btn;
        me.aItem.push(_btn);
        if (_ifR) { return _btn; }
        return me;
    }
    me.deleteItem = function (v) {
        var _item = me.getItem(v);
        if (_item) { _item.remove(); _item = null; }
    }

    me.setAllEnabled = function (v) {
        if (v == undefined) { v = true; }
        for (var i = 0, _len = me.aItem.length; i < _len; i++) { me.aItem[i].setEnabled(v); }
    }

    me.setSelTabItem = function (v) {
        var _item = me.getItem(v);
        if (_item) {
            var _tab = _item.getArgs().tab, _selItem = me.selTabItem[_tab];
            if (_selItem == _item) { return me; }
            if (_selItem) { _selItem.setPress(false); }
            _item.setPress(true);
            me.selTabItem[_tab] = _item;
        }
        return me;
    }

    me.setChecked = function (k, v) {
        if (v == null) { return me; }
        var _item = me.getItem(k);
        if (_item) { _item.setPress(v); }
        return me;
    }

    me.setVisibled = function (k, v) {
        if (v == null) { return me; }
        var _item = me.getItem(k);
        if (_item) { _item.setVisibled(v); }
        return me;
    }
    me.loadApi = function (api, ifReLoad, type, onSucc, fields) {
        if (!api) { return me; }
        if (args.ifRights) { api += '&ifRights=1'; }
        $.Util.ajax({
            args: api + '&dataType=json&keyFields=' + (fields || 'nodeName as text, nodeName as nn, id as name'),
            onSuccess: function (data) {
                var _sAry = data.get(0), _iAry = [], _onSucc = onSucc || args.onSuccess;
                if (_sAry) { _iAry = eval(_sAry); }
                if (ifReLoad != false) { me.clear(); }
                me.loadItems(_iAry, type);
                _onSucc({ ButtonSet: me, items: _iAry });
            }
        });
        return me;
    }

    me.fireClick = function (k, f, ifPress) {
        var _item = me.getItem(k);
        if (_item) { _item.fireClick(f, ifPress); }
        return me;
    }

    me.loadItems = function (items, type) { for (var i = 0, _iLen = items.length; i < _iLen; i++) { var _iObj = items[i]; _iObj.type = type || _iObj.type; me.addItem(_iObj); }; return me; }
    me.reLoadItems = function (items) { me.clear(); return me.loadItems(items); }
    me.setIcon = function (k, v) { var _item = me.getItem(k); if (_item) { _item.setIcon(v); } return me; }
    me.getText = function (v) { var _item = me.getItem(v); if (_item) { return _item.getText(); } }
    me.setText = function (k, v) { var _item = me.getItem(k); if (_item) { _item.setText(v); } return me; }
    me.setAllEnabled = function (v) { for (var i = 0, _iLen = me.aItem.length; i < _iLen; i++) { me.aItem[i].setEnabled(v); } return me; }
    me.setEnabled = function (k, v) { var _item = me.getItem(k); if (_item) { _item.setEnabled(v); } return me; }
    me.clear = function () { owner.h(''); me.selTabItem = {}; me.focusItem = null; me.items = {}; me.aItem = []; count.setN(-1); }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.init = function (j) { setDefault(j); layout(); return me; }
    me.show = function () { owner.show(); args.visibled = true; return me; }
    me.hide = function () { owner.hide(); args.visibled = false; return me; }
    me.remove = function () { owner.r(); me = null; }
    if (arguments.length) { me.init(j); }
    return me;
}

$.UI.Menu = function (j) {
    var me = this, _fn = function () { };
    var args = { p: $DB, items: [], skin: '', loadApi: '', checkedValue: null, hidden: {}, css: '', cn: '', textKey: 'nodeName', valueKey: 'id', ifShowIcon: false, onAjax: _fn, onClick: _fn, onSuccess: _fn, onError: _fn }
    var iArgs = { text: '', name: '', value: '', type: 'item', icon: '', disabled: false }
    var owner, count = new $.nCount();
    me.items = {};
    me.aItem = [];
    me.selLi;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'ul').cn('Menu ' + args.cn).css(args.css);
        owner.onselectstart = function () { return false; }
        for (var i = 0, _iLen = args.items.length; i < _iLen; i++) { addItem(args.items[i]); }
        if (args.gtID) { args.loadApi = 'm=SYS_TABLE_TREE&table=SYS_CM_GLOBAL_TABLE&action=getNodesByPid&pid=' + args.gtID; }
        if (args.loadApi) { me.loadAjax({ args: args.loadApi }); } else { if (args.checkedValue) { me.setSelected(args.checkedValue); }; args.onSuccess({Menu:me}); }
    }
    function addItem(j) {
        var _obj = $.Util.initArgs(j, iArgs), _idx = count.getN(), _name = _obj.name || 'MENU_' + _idx;
        var _eLI = owner.adElm('', 'li'), _iType = (_obj.type || 'item').trim();
        if (_iType == 'item') {
            _eLI.attr('_name', _name).attr('_value', _obj.value).h('<a class="checked"></a><span class="icon ' + _obj.icon + '"></span><span>' + _obj.text + '</span>');
        } else {
            _eLI.cn(_iType);
        }
        var _item = { eLi: _eLI, Args: _obj };
        me.items[_name] = me.items[_idx] = _item;
        me.aItem.push(_item);
        return _item;
    }

    function bindEvent() {
        owner.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t;
            var _tag = _e.tagName, _eLi;
            if (_tag == 'LI') { _eLi = _e; }
            if (_tag == 'SPAN' || _tag == 'A') { _eLi = _e.pn(); }
            if (_eLi) {
                var _val = _eLi.attr('_value'), _txt = _eLi.chn(2).h(), _name = _eLi.attr('_name');
                if (me.selLi) { me.selLi.dc('selected'); }
                _eLi.ac('selected');
                me.selLi = _eLi;
                args.onClick({ Menu: me, Item: me.items[_name], Value: _val, Name: _name, Text: _txt });
            }
            e.stop();
        });
    }

    function getItem(key) { return me.items[key]; }
    me.loadAjax = function (obj) {
        var _obj = obj || {}, _args = _obj.args || '', _f = _obj.cbFn || {};
        if (_args && args.onAjax({ Menu: me, Args: _args }) != false) {
            var _onSuc = _f.onSuccess || args.onSuccess, _onErr = _f.onError || args.onError;
            var _tK = args.textKey, _vK = args.valueKey, _kv = _vK + ',' + _tK;
            if (args.ifShowIcon) { _kv += ',icon'; }
            $.Util.ajax({
                args: $.Util.toArgsString(_args) + '&dataType=json&keyFields=' + _kv + '&' + $.Util.toArgsString(args.hidden),
                onSuccess: function (d) {
                    var _sData = d.get(0);
                    if (_sData) {
                        var _dAry = eval(_sData), _dLen = _dAry.length;
                        for (var i = 0; i < _dLen; i++) {
                            var _dObj = _dAry[i];
                            addItem({ text: _dObj[_tK], name: _dObj[_vK], icon: _dObj['icon'], value: _dObj[_vK], type: 'item' });
                        }
                        if (args.checkedValue) { me.setSelected(args.checkedValue); }
                        _onSuc({ Menu: me });
                    }
                },
                onError: function (d) { _onErr(d); }
            });
        }
    }

    me.loadAjaxForTree = function () {

    }
    me.setSelected = function (key) {
        var _item = getItem(key);
        if (_item) {
            var _eLi = _item.eLi;
            if (me.selLi) { me.selLi.dc('selected'); }
            _eLi.ac('selected');
            me.selLi = _eLi;
        }
        return me;
    }
    me.fireClick = function (key) {
        me.setSelected(key);
        if (me.selLi) {
            var _iItem = getItem(key), _iArgs = _iItem.Args;
            args.onClick({ Menu: me, Item: _iItem, Value: _iArgs.value, Name: _iArgs.name, Text: _iArgs.text });
        }
    }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.init = function (j) { setDefault(j); layout(); bindEvent(); return me; }
    me.show = function () { owner.show(); return me; }
    me.hide = function () { owner.hide(); return me; }
    me.remove = function () { owner.r(); me = null; }
    if (arguments.length) { me.init(j); }
    return me;
}







$.UI.Arrow=function(j){
    //border:1px solid #FFC97C;background-color:#FFFEC9;
    var j = j || {}, cn = j.cn || '', css = j.css || '', comMode = j.comMode || 'normal', diff = j.diff || 3;
    var p = $(j.p||$DB), dir = j.dir||'bottom';  //top, left, right, bottom
    var bc = j.borderColor||'#bbbbbb', bgc = j.backgroundColor||'#ffffff', _w = j.w||10;
	var box=j.box||{blw:_w,btw:_w,brw:_w,bbw:_w,blc:'#999999',btc:'#999999',brc:'#999999',bbc:'#999999'};
	var _blw = box.blw||box.w1, _btw = box.btw||box.w2, _brw = box.brw||box.w3, _bbw = box.bbw||box.w4;
	var _blc = box.blc||box.c1, _btc = box.btc||box.c2, _brc = box.brc||box.c3, _bbc = box.bbc||box.c4;
	var _bls = _blc?'solid':'dashed', _bts = _btc?'solid':'dashed';
	var _brs = _brc?'solid':'dashed', _bbs = _bbc?'solid':'dashed';
	var html = '';
	switch(comMode){
	    case 'normal':
	        var _blCss = ';border-left:'+(_blw||0)+'px '+(_blc||'transparent')+' '+_bls+';';
	        var _btCss = 'border-top:'+(_btw||0)+'px '+(_btc||'transparent')+' '+_bts+';';
	        var _brCss = 'border-right:'+(_brw||0)+'px '+(_brc||'transparent')+' '+_brs+';';
	        var _bbCss = 'border-bottom:'+(_bbw||0)+'px '+(_bbc||'transparent')+' '+_bbs+';';
	        var _bCss = _blCss+_btCss+_brCss+_bbCss;
	        html='<div class="arrow '+cn+'" style="'+css+_bCss+';+overflow:hidden;"></div>';
	        break;
	    case 'border':
	        var bw = 0;
	        if(dir=='bottom'||dir=='top'){bw = $.m.p(p.csn('width')/2);}
	        if(dir=='left'||dir=='right'){bw = $.m.p(p.csn('height')/2);}
	        var _cCss = ';+overflow:hidden;border-width:'+bw+'px;', _s1 = '', _s2 = '';
	        switch(dir){
	            case 'bottom':
	                _cCss += 'border-style:solid dashed dashed dashed;border-color:'+bc+' transparent transparent transparent;';
	                _s2 += 'top:-'+diff+'px;border-color:'+bgc+' transparent transparent transparent;';
	                break;
	            case 'top':
	                _cCss += 'border-style:dashed dashed solid dashed;border-color:transparent transparent '+bc+' transparent;';
	                _s2 += 'bottom:-'+diff+'px;border-color:transparent transparent '+bgc+' transparent;';
	                break;
	            case 'right':
	                _cCss += 'border-style:dashed dashed dashed solid;border-color:transparent transparent transparent '+bc+';';
	                _s2 += 'top:0px;right:'+diff+'px;border-color:transparent transparent transparent '+bgc+';';
	                break;
	            case 'left':
	                _cCss += 'border-style:dashed solid dashed dashed;border-color:transparent '+bc+' transparent transparent;';
	                _s2 += 'top:0px;left:'+diff+'px;border-color:transparent '+bgc+' transparent transparent';
	                break;
	        }
	        html = '<div class="arrow" style="'+_cCss+'" ></div><div class="pa arrow" style="'+_cCss+_s2+';" ></div>';
	        break;
	}
	p.h(html);
}

$.UI.ArrowTips = function (j){
    var me = this;
    var p, dir, pos, x, y, w, h, comMode, arrowBC, arrSize, cn, css, ifClose;
    var owner, eClose, eDir;
    me.body;
    me.onClose;
    function setDef(j){
        p = $(j.p||$DB);
        dir = j.dir||'top';
        pos = j.pos||10;
        x = j.x||50;
        y = j.y||50;
        w = j.w||100;
        h = j.h||80;
        arrowBC = j.arrowBC||'#BBBBBB';
        arrSize = j.arrSize||20;
        cn = j.cn||'';
        css = j.css||'';
        comMode = j.comMode||'border';
        ifClose = j.ifClose;
        if(ifClose==null){ifClose = true;}
        me.onClose = j.onClose||function (){};
    }

    function layout(){
        owner = p.adElm('','div').cn('pa z10 r5 b_15 '+cn).css('left:'+x+'px;top:'+y+'px;padding:8px 20px 8px 8px;width:'+w+'px;height:'+h+'px;'+css);
        if(ifClose){
            eClose = owner.adElm('','div').cn('pa w15 h15 cp')
                             .css($.UI.ico16_xy(5,8)+';right:3px;top:2px;').attr('title','关闭');
        }
        if(pos<0){pos = 0;}
        if(pos>h){pos = h-arrSize;}
        if(pos>w){pos = w-arrSize;}
        me.body = owner.adElm('','div').cn('oa hp');
        var _dirCss='width:'+arrSize+'px;height:'+arrSize+'px;', _dirH = '';
        switch (dir){
            case 'top':
                _dirCss += 'top:-'+arrSize+'px;left:'+pos+'px;';
                break;
            case 'bottom':
                _dirCss += 'bottom:-'+arrSize+'px;left:'+pos+'px;';
                break;
            case 'right':
                _dirCss += 'right:-'+arrSize+'px;top:'+pos+'px;';
                break;
            case 'left':
                _dirCss += 'left:-'+arrSize+'px;top:'+pos+'px;';
                break;
        }
        eDir = owner.adElm('','div').cn('pa oh ').css(_dirCss);
        var _aBC = $S(owner).borderColor, _aBGC = $S(owner).backgroundColor;
        if(!_aBC){_aBC = owner.cs('border-color');}
        if(_aBGC){_aBGC = owner.cs('borderground-color');}
        new $.UI.Arrow({
            p:eDir,
            diff:2,
            comMode:comMode,
            borderColor:_aBC,
            backgroundColor:_aBGC,
            cn:'cp',
            css:css,
            dir:dir
        });
    }
    function bindEvent(){
        if(eClose){
            eClose.evt('click',function (e){var e = $.e.fix(e);e.stop();me.onClose();me.remove();});
        }
    }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.init = function (j) { setDefault(j); layout(); bindEvent(); me.resize(1); return me; }
    me.show = function () { owner.show(); return me; }
    me.hide = function () { owner.hide(); return me; }
    me.remove = function () { owner.r(); me = null;  }
    if (arguments.length) { me.init(j); }
    return me;
}


$.UI.Panel = function (j) {
    var me = this, _fn = function () { };
    var args = {
        p: $DB, x: 0, y: 0, width: 0, height: 0, title: '', icon: '', css: '', cn: 'bc_7 z4', comMode: 0, skin: 'Tips-default', toolBarSkin: 'Button-toolbar-icon', lifeTime: 0, toolBarAry: [],
        ifFixedHeight: true, head_h: 0, foot_h: 0, content: '', icon_h: 14,
        onToolBarMouseDown: _fn, onToolBarMenuClick: _fn, onClose: _fn, onClick: _fn, onResize: _fn, onResizeEnd: _fn, onDrag: _fn, onDragEnd: _fn, onToolBarClick: _fn
    }
    var owner, eTitle;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var eHead, eFoot, eBody;
        if (args.ifFixedHeight) {
            var _bd = new $.UI.BaseDiv({ p: args.p, head_h: args.head_h, foot_h: args.foot_h, cn: args.skin + ' ' + args.cn });
            owner = _bd.base; eHead = _bd.head; eBody = _bd.body; eFoot = _bd.foot;
            eHead.ac('Tips-head'); eBody.ac('Tips-body'); eFoot.ac('Tips-foot');
        } else {
            var _sCss = 'height:{0}px;line-height:{0}px;', _sHtml = '<div class="Tips-head oh" style="{0}"></div><div class="Tips-body"></div><div class="Tips-foot" style="{1}"></div>';
            owner = args.p.adElm('', 'div').cn('pa ' + args.skin + ' ' + args.cn).h(_sHtml.format(_sCss.format(args.head_h), _sCss.format(args.foot_h)));
            eHead = owner.fc(); eBody = eHead.ns(); eFoot = eBody.ns();
        }
        var _sCss = args.css;
        if (args.width) { _sCss += 'width:' + args.width + 'px;'; }
        if (_sCss) { owner.css(_sCss); }
        me.base = owner; me.body = eBody; me.head = eHead; me.foot = eFoot; eTitle = eHead.h('<span></span>').fc();
        me.setTitle(args.title);
        toolBarLayout(eHead);
    }
    function toolBarLayout(p) {
        me.toolBar = new $.UI.ButtonSet({ p: p, items: args.toolBarAry, onClick: function (obj) { obj.Panel = me; args.onToolBarClick(obj); } });
    }
    me.setTitle = function (v) { eTitle.h(v); return me; }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.hide = function (key) { owner.hide(); return me; }
    me.init = function (j) { setDefault(j); layout(); return me; }
    if (arguments.length) { me.init(j); }
    return me;
}

$.UI.PopTips = function (j) {
    return;
    var me = this, _fn = function () { };
    var args = { p: $DB, ifShow: true, ifClose: true, width: 150, ifFixedHeight: false, height: 120, comMode: 'auto', type: 'alert', content: '', onOk: _fn, onCancle: _fn };
    var tips;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        switch (args.type) {
            case 'alert':
                tips = new $.UI.Tips({ ifFixedHeight: args.ifFixedHeight, width: args.width, content: args.content });
                break;
            case 'tips':
                tips = new $.UI.Tips({ ifFixedHeight: args.ifFixedHeight, ifMask: args.ifMask, comMode: 'x-auto', y: 10, css: 'border: 1px solid #ccc;color: #fff;padding:6px;text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.2);' });
                break;
            case 'confirm':
                args.head_h = 30; args.foot_h = 32; args.css = 'z-index:25;'; args.title = '确认对话框'; args.comMode = 'x-auto'; args.y = 250;
                args.content = '<div class="fl wp fs12 hh" style="height:54px;line-height:54px;" ><div class="fl hp wa quest_40 m5" style="width:40px;"></div><div style="width:' + (args.width - 64) + 'px;" class="fl p5 hp">' + args.content + '</div></div>';
                args.onClose = function () { me.hide(); return false; }
                tips = new $.UI.Panel(args);
                me.button = new $.UI.ButtonSet({ p: tips.foot, itemAlign: 'right', items: [{ text: '取消', name: 'cancle', icon: 'icon-glyph-remove', cn: 'mr10' }, { text: '确定', name: 'confirm', icon: 'icon-glyph-ok'}], onClick: onBtnClick });
                break;
            case 'arrow':

                break;
        }
        if (!args.ifShow) { me.hide(); }
    }
    function onBtnClick(obj) {
        obj.PopTips = me;
        switch (obj.name) {
            case 'confirm': args.onOk(obj); break;
            case 'cancle': args.onCancle(obj); break;
        }
        me.remove();
    }
    function setTipsContent(text, state) {
        tips.setContent(text);
        var _sCss = '';
        switch (state) {
            case 'ok': case 'pass': _sCss = 'background-color: #00cc33;'; break;
            case 'error': _sCss = 'background-color: #f00;'; break;
            case 'warn': _sCss = 'background-color: #ff7800;'; break;
            case 'loading': _sCss = 'background-color: #3EABFF'; break;
            default: _sCss = 'background-color: #3EABFF'; break;
        }
        if (_sCss) { tips.base.css(_sCss); }
    }

    me.setWidth = function (width) {
        if (width != null) {
            tips.base.css('width:' + width + 'px;');
            tips.body.fc().chn(1).css('width:' + (width - 64) + 'px;');
        }
        return me;
    }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.init = function (j) { setDefault(j); layout(); return me; }
    me.show = function (text, state) {
        args.ifShow = true;
        if (text != null) {
            switch (args.type) {
                case 'alert':

                    break;
                case 'tips':
                    setTipsContent(text, state); tips.show(); setTimeout(function () { me.hide(); }, 1000); break;
                case 'confirm':
                    tips.body.fc().chn(1).h(text); tips.base.css('z-index:20;'); tips.base.ns().css('z-index:19;'); tips.show(); break;
            }
        }
        return me;
    }
    me.hide = function () { args.ifShow = false; tips.hide(); return me; }
    me.remove = function () { return me.hide(); }
    if (arguments.length) { me.init(j); }
    return me;
}



$.UI.Mask = function (j) {
    var me = this, _owner;
    var args = { p: $DB, alpha: 50, cn: '', css: '', onClick: function () { } };
    function setDefault(j) { args = $.Util.initArgs(j, args); args.p = args.p || $DB; }
    function layout() {
        _owner = args.p.adElm('', 'div').cn('Mask ' + args.cn).css(args.css).alpha(args.alpha);
        _owner.evt('click', function (e) { var e = $.e.fix(e); e.stop(); args.onClick(me); $.UI.DestroyPopElm('Mask--Click'); });
        if (isIE) { _owner.h('<iframe frameBorder=0 frameBorder="no" allowTransparency="true" border="0" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" style="border-style: none" class="pa bc_0 z-1 dn" srclayout="blank.html"></iframe>'); }
        me.maskDiv = _owner;
        me.eContent = args.p.adElm('', 'div');
    }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.init = function (j) { setDefault(j); layout(); return me; }
    me.show = function () { _owner.show(); return me; }
    me.hide = function () { _owner.hide(); return me; }
    me.remove = function () { _owner.r(); me = null; }
    if (arguments.length) { me.init(j); }
    return me;
}

$.UI.ProgressBar = function (j) {
    var me = this, _fn = function () { };
    var args = { p: $DB, barHeight: 18, defValue: 0, cn:'', css:'', skin:'' };
    var owner, eBar, val;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _barH = args.barHeight;
        if (_barH > 14) { _barH = 14; }
        owner = args.p.adElm('', 'div').cn('ProgressBar '+args.skin+' '+args.cn).css('height:' + _barH + 'px;'+args.css);
        eBar = owner.adElm('', 'div').css('line-height:' + _barH + 'px;');
        me.setVal(args.defValue);
    }
    me.setVal = function (v, ease) {
        if (v == undefined || v == null) { return; }
        v = +v;
        if (v > 100) { v = 100; }
        if (v < 0) { v = 0; }
        args.defValue = v;
        eBar.attr('title', v + '%');
        if (eBar.ease) {
            eBar.ease(['width'], [v], 1000, 1, {}, 1, '%');
        } else {
            eBar.css('width:' + v + '%;');
        }
    }
    me.getVal = function () { return args.defValue; }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.init = function (j) { setDefault(j); layout(); return me; }
    me.show = function () { owner.show(); return me; }
    me.hide = function () { owner.hide(); return me; }
    me.remove = function () { owner.r(); me = null;  }
    if (arguments.length) { me.init(j); }
    return me;
}

$.UI.Accordion = function (j) {
    var me = this, _fn = function () { };
    var args = { p: $DB, width: null, height: null, ifFixedHeight: true, titleHeight: 26, skin: '', cn: '', css: '', items: [], onItemExpand: _fn, onItemToolBarClick: _fn }, iArgs;
    var owner, count, ifInit = true, curr, sumHeight = 0;
    me.items = {};
    me.aItem = [];
    me.selItem = null;
    function setDefault(j) {
        args = $.Util.initArgs(j, args); count = new $.nCount();
        if (args.width != null) { args.css += ';width:' + w + 'px;'; } else { args.cn += ' wp'; }
        if (args.height != null) { args.css += ';height:' + h + 'px;'; } else { args.cn += ' hp'; }
        if (args.ifFixedHeight) { args.cn += ' oh'; }
    }
    function layout() {
        owner = args.p.adElm('', 'div').cn(args.cn).css(args.css);
        iArgs = { p: owner, name: '', title: '', icon: '', ifClose: false };
        for (var i = 0, _iLen = args.items.length; i < _iLen; i++) { me.addItem(args.items[i]); }
        me.setSelItem(0);
        $(window).evt('resize', function () { var _val = args.p.csn('height') - sumHeight; for (var i = 0, _len = me.aItem.length; i < _len; i++) { me.aItem[i].owner.css('height:' + _val + 'px;'); } });
    }
    function onItemExpand(obj) {
        if (args.ifFixedHeight) {
            if (ifInit) { me.resize(); ifInit = false; }
            if (me.selItem && me.selItem != obj) { me.selItem.setFold(false, null, false); }
            me.selItem = obj;
        }
        args.onItemExpand({ Accordion: me, AttrPanel: obj });
    }
    function onItemToolBarClick(obj) { obj.Accordion = me; args.onItemToolBarClick(obj); }
    me.addItem = function (j) {
        var _iArgs = $.Util.initArgs(j, iArgs), _name = _iArgs.name; _iArgs.ifUnfold = false; _iArgs.titleHeight = args.titleHeight; sumHeight += (args.titleHeight || 0) + 2;
        var _item = new $.UI.AttrPanel(_iArgs), _idx = count.getN();
        _item.evt('onExpand', function (obj) { onItemExpand(obj.AttrPanel); }).evt('onToolBarClick', onItemToolBarClick);
        me.items[_name] = me.items[_idx] = _item;
        me.aItem.push(_item);
        return _item;
    }
    me.setSelItem = function (v) {
        var _item;
        if (typeof v == 'object') { _item = v; } else { _item = me.items[v]; }
        if (_item) { curr = _item; _item.setFold(true); }
        return me;
    }
    me.resize = function () {
        var _allH = owner.csn('height'), _itemH = _allH - (me.aItem.length * (args.titleHeight + 1.5));
        for (var i = 0, _iLen = me.aItem.length; i < _iLen; i++) { me.aItem[i].owner.css('height:' + _itemH + 'px;'); }
        return me;
    }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.init = function (j) { setDefault(j); layout(); return me; }
    me.show = function () { owner.show(); return me; }
    me.hide = function () { owner.hide(); return me; }
    me.remove = function () { owner.r(); me = null; }
    if (arguments.length) { me.init(j); }
    return me;
}

$.UI.View = function (j) {
    var me = this, _fn = function () { };
    var args = { p: $DB, url: '', onLoad: _fn }, view;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function urlToNS(URL) {
        var _ary = URL.toString().split('/'), _iLen = _ary.length, _ns;
        _ary[_iLen - 1] = _ary[_iLen - 1].split('.')[0];
        for (var i = 0; i < _iLen; i++) { var _name = _ary[i]; if (_name.toLow() == 'view') { _ns = $View; } else { if ($.getType(_ns) == 'object') { _ns = _ns[_name]; } else { continue; } } }
        return _ns;
    }
    function init(j) { setDefault(j); me.loadView(args); }
    me.loadView = function (_args) {
        //if (!$.ck.get('SESSIONID')) { MTips.show('您已经很长时间未操作了哦，请重新登录！', 'warn'); window.location.href = 'index.html'; return; }
        var _args = _args || {}, _url = _args.url || '', _f = args.onLoad || args.onLoad, _comArgs = _args || _args.args;
        if (!_url) { return; }
        if (!_comArgs) { _comArgs = args; }
        for (var k in args) { _comArgs[k] = args[k]; }
        args.p.h('<div class="loading32" style="width:320px;height:240px;margin:60px auto;"></div>');
        $.Util.loadJS(_url, function () { args.p.h(''); var _ns = urlToNS(_url); _comArgs.p = args.p; if (!_ns) { alert('路径：' + _url + '不存在'); return; }; view = new _ns(_comArgs); _f(view, me); });
    }
    init(j);
    return me;
}

$.UI.DestroyPopElm = function (pos) {
    if ($.global.popTips) { $.global.popTips.hide(); }
    if ($.global.popMYTips) { $.global.popMYTips.hide(); }
}