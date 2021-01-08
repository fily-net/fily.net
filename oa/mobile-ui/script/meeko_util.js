$.Util = {};
$.Util.ajax = function (v) {
    var _args = v, _df = function () { };
    //$.global.imgPath = '';
    var _u = _args['url'] || 'http://www.rui10.com/crm/meeko.aspx',
        _p = _args['args'],
        _c = _args['ifCache'] || false,
        _m = _args['method'] || 'POST',
        _dt = (_args['dataType'] || 'jsonp').toLocaleLowerCase(),
        _ifcc = _args['ifCheckCookie'],
        _onSuc = _args['onSuccess'] || _df,
        _onErr = _args['onError'] || _df;
    _ifcc = (_ifcc == null ? true : _ifcc);
    if (_ifcc && !$.getCookie('SESSIONID')) { MTips.show('操作超时, 请重新登陆!', 'warn'); setTimeout(function () { window.location.href = 'index.html'; }, 2000); return; }
    _p = $.Util.toArgsString(_p);
    if (!_p) { return; }
    var url = _u, p = _p, _cu = _u + _p, _v = $.aCache.get(_cu);   //_ct: 缓存时间, 默认是0不缓存; _cu: 缓存地址值
    var _info = { 'url': _u, 'param': _p, 'method': _m, 'cacheKey': _cu, 'cacheTime': _c, 'cacheUrl': _cu, 'startTime': $.time() };
    if (_v) { _onSuc({ data: _v, info: _info }); return; }
    var _now = new Date(), _rand = _now.date8() + _now.getHours() + _now.getMinutes() + _now.getSeconds();
    p += '&clienttime=' + _rand + '&clientkey=' + $.getCookie('SESSIONID') || '';
    switch (_dt) {
        case 'jsonp':
            var _cb = 'meeko_' + _rand + '_' + Math.random().toString().replace('.', '');
            window[_cb] = function (data) {
                data = data.replaceAll('\u0000', '&');
                var _dataAry = data.split('@&@'), _rStr = _dataAry[0];
                _info['endTime'] = $.time();
                if (_rStr.toLow() == "errorinfo=0") {
                    _dataAry.shift();
                    if (_c) { _info['cacheData'] = _dataAry; $.aCache.push(_cu, _dataAry, _c); }
                    _onSuc({ data: _dataAry, info: _info, get: function (idx) { return _dataAry[idx]; } });
                } else {
                    _onErr({ data: data.split('=')[1], info: _info });
                }
            };
            $.Util.loadJS(url + '?callback=' + _cb + '&' + p);
            break;
        default:
            if (!$.global.ajaxObjPool) { $.global.ajaxObjPool = new $.Util.XHRObjPool(); }
            $.global.ajaxObjPool.getXHR().request(url, p, {
                onSuccess: function (data) {
                    data = data.replaceAll('\u0000', '&');
                    var _dataAry = data.split('@&@'), _rStr = _dataAry[0];
                    _info['endTime'] = $.time();
                    if (_rStr.toLow() == "errorinfo=0") {
                        _dataAry.shift();
                        if (_c) { _info['cacheData'] = _dataAry; $.aCache.push(_cu, _dataAry, _c); }
                        _onSuc({ data: _dataAry, info: _info, get: function (idx) { return _dataAry[idx]; } });
                    } else {
                        _onErr({ data: data.split('=')[1], info: _info });
                    }
                },
                onError: function (d) { _onErr({ data: d, info: _info }); }
            }, _m);
            break;
    }
}

$.Util.XHRObjPool = function (j) {
    var me = this, _j = j || {};
    var _ary = [], _max = _j.max || 5;
    function addXHR() {
        var _xhr = new $.Util.XHR();
        _ary.push(_xhr);
        return _xhr;
    }
    me.getXHR = function () {
        var _xhr = null;
        for (var i = 0; i < _ary.length; i++) {
            var _xhrTemp = _ary[i], _ifRun = _xhrTemp.getState();
            if (!_ifRun) { _xhr = _xhrTemp; break; }
        }
        if (!_xhr) { _xhr = addXHR(); }
        return _xhr;
    }
    me.getLength = function () { return _ary.length; }
}

$.Util.XHR = function (url, args, cbFn, method) {
    var me = this, XHR, ifRun = false;
    me.getR = function () {
        if (!window.ActiveXObject) return new XMLHttpRequest;
        var e = "MSXML2.XMLHTTP", t = ["Microsoft.XMLHTTP", e, e + ".3.0", e + ".4.0", e + ".5.0", e + ".6.0"], _len = t.length;
        for (var n = _len - 1; n > -1; n--) {
            try { return new ActiveXObject(t[n]); } catch (r) { continue; }
        }
    }
    XHR = me.getR();
    me.bindFn = function (f, args) { return function () { return f.apply(me, args); }; }
    me.stateChange = function () {
        if (XHR.readyState == 4) {
            var e = XHR.status, t = XHR.responseText;
            var _onSucc = arguments[0], _onErr = arguments[1], _timeoutID = arguments[2];
            if (e >= 400 && e < 500) { _onErr("Clinet Error," + e); return; }
            if (e >= 500) { _onErr("Server Error," + e); return; }
            if (e == 200) { _onSucc(t); } else { _onErr(t); }
            clearInterval(_timeoutID);
            ifRun = false;
            return t;
        }
    }
    me.getState = function () { return ifRun; }
    me.request = function (url, args, cbFn, method) {
        if (ifRun) { return; }
        ifRun = true;
        var _url = url || '', _args = args || '', _f = cbFn || {}, _m = method || 'POST';
        var _onSucc = _f.onSuccess || function () { }, _onErr = _f.onError || function () { }, _onTO = _f.onTimeout || function () { };
        var _timeoutFn = setTimeout(function () { XHR.abort(); clearInterval(_timeoutFn); _onErr("Timeout"); _onTO(); }, 2e4);
        if (_m == 'POST') {
            XHR.open("POST", _url, 1);
            XHR.onreadystatechange = me.bindFn(me.stateChange, [_onSucc, _onErr, _timeoutFn]);
            XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            XHR.send(_args);
        } else {
            XHR.open("GET", _url + "?" + _args, 1);
            XHR.onreadystatechange = me.bindFn(me.stateChange, [_onSucc, _onErr, _timeoutFn]);
            XHR.send(null);
        }
    }
    if (arguments.length) { me.request(url, args, cbFn, method); }
    return me;
}

$.Util.initArgs = function (oArgs, nArgs) {
    var _args = oArgs || {};
    for (var i in nArgs) { if (_args[i] == null) { _args[i] = nArgs[i]; } else { if (i == 'p' || i == 'pBody') { _args[i] = $(_args[i]); } } }
    return _args;
}

$.layout = function (j) {
    var _sObj = $.Util.initArgs(j, { args: {}, struct: {} }), _coms = {}, _args = _sObj.args, _p = j.p || _sObj.struct.p;
    var _initCom = function (p, obj) {
        obj = obj || {};
        var _name = obj.name, _cArgs = _args[_name], _comType = obj.type;
        if (!_name || !_cArgs || !_comType) { return; }
        if (_comType == 'Container') { _coms[_name] = p.adElm('', 'div').cn(_cArgs.cn || '').css(_cArgs.css || '').h(_cArgs.html || ''); return; }
        _cArgs.p = p;
        var _com = new $.UI[_comType](_cArgs);
        _coms[_name] = _com;
        switch (_comType) {
            case 'Tab':
                if (obj.items) {
                    var _items = obj.items, _iLen = _items.length;
                    for (var _ii = 0; _ii < _iLen; _ii++) { _initCom(_com.items[_ii].Body, _items[_ii]); }
                }
                break;
            case 'Accordion':
                if (obj.items) {
                    var _items = obj.items, _iLen = _items.length;
                    for (var _ii = 0; _ii < _iLen; _ii++) { _initCom(_com.items[_ii].owner, _items[_ii]); }
                }
                break;
            default:
                for (var k in obj) {
                    var _val = obj[k], _vType = $.getType(_val), _pTemp = _com[k];
                    if (_vType == 'object' && !_val.h) { _initCom(_pTemp, _val); }
                    if (_vType == 'array') { for (var _ci = 0, _cLen = _val.length; _ci < _cLen; _ci++) { _initCom(_pTemp, _val[_ci]); } }
                }
                break;
        }
    }
    _initCom(_p, _sObj.struct);
    return _coms;
}

$.Util.filter = function (str, filterObj) {
    var _specialChar = [
        //['"', '&quot;'],
        ['\r\n', '<br>'],
        ['&', '\u0000'],
        ['\r', '<br>'],
        ['\n', '<br>']
    ]
    var _fObj = filterObj || _specialChar, _str = str;
    if (_str==null) { return ''; }
    if (!_str.replaceAll) { return _str; }
    if ($.getType(_fObj) == 'array') {
        for (var i = 0, _iLen = _fObj.length; i < _iLen; i++) {
            var _char = _fObj[i];
            _str = _str.replaceAll(_char[0], _char[1]);
        }
    } else {
        for (var i in _fObj) { _str = _str.replaceAll(i, _fObj[i]); }
    }
    return _str;
}

$.Util.objClone = function (source) {
    if ($.getType(source) == 'object' && source.h == null) { 
        return $.JSON.decode($.JSON.encode(source));
    }
}

$.Util.toArgsObj = function (argsStr) {
    if (typeof argsStr == 'object') { return argsStr; }
    var _kvAry = argsStr.split('&'), _len = _kvAry.length, _kv = {};
    for (var i = 0; i < _len; i++) { var _sAry = _kvAry[i].split('='); _kv[_sAry[0]] = _sAry[1]; }
    return _kv;
}

$.Util.toArgsString = function (argsObj) {
    var _type = $.getType(argsObj), _kvAry = [], _sArgs = '';
    switch (_type) {
        case 'string':
            _sArgs = argsObj; 
            break;
        case 'object':
            for (var k in argsObj) { _kvAry.push(k + '=' + argsObj[k]); };
            _sArgs = _kvAry.join('&'); 
            break;
        case 'array':
            _sArgs = argsObj.join('&'); 
            break;
    }
    return _sArgs;
}

$.Util.url2Obj = function () {
    var _location = window.location, _obj = {};
    _obj['host'] = _location.host;
    _obj['hostName'] = _location.hostname;

}

$.Util.uniqueArray = function (ary) {
    var _a = [], _b = {}, _l = ary.length, i, _c = 0;
    for (i = 0; i < _l; i++) { var _d = ary[i]; if (_d) { _b[_d] = 1; } }
    for (var e in _b) { _a[_c] = e; _c++; }
    return _a;
}

$.Util.Q = function (j) {
    var me = this, _j = j || {}, _fn = function () { };
    var a = [], sat = 0, delay = _j.delay;
    var _onFinish = _j.onFinish || function () { console.log('end'); };
    var ifStop = false;
    if (delay == null) { delay = 2000; }
    function exec(cbFn) {
        var obj = a.shift(), _cf = cbFn || _fn;
        if (!obj) { return; }
        var _f = obj.f || _fn, _args = obj.args || [];
        _f.apply(_f, _args);
        if (_cf() != false) { me.next(); }
    }
    me.push = function (o) { a.push(o); return me; }
    me.go = function (cbFn) {
        if (sat == 1 || !a.length) { return me; }
        sat = 1; exec(cbFn); return me;
    }
    me.remove = function (v) { a.re(v); return me; }
    me.next = function (cbFn, ifRestart) {
        var _irs = ifRestart || false;
        if (_irs) { sat = 1; }
        if (ifStop || !sat) { return me; }
        if (!a.length) { sat = 0; _onFinish(me); return me; }
        if (delay) { setTimeout(function () { exec(cbFn); }, delay); } else { exec(cbFn); }
        return me;
    }
    me.stop = function () { ifStop = true; return me; }
    me.start = function () { ifStop = false; me.next(); return me; }
    me.len = function () { return a.length; }
    me.clear = function () { a.clear(); return me; }
    return me;
}

$.Util.formatImage = function (img, w, h){
    var image = new Image();
    image.src = img.src;
    var _width = image.width, _height = image.height;
    image.width = w;
    image.height = h;
    return;
    if(_width>0&&_height>0){
        var _r1 = _width/_height, _r2 = w/h;
        console.log([_r1, _r2])
        if(_r1>=_r2){
            if(_width>w){
                img.width = w;
                img.height = (_height*w)/_width;
            }
        }else {
            img.width = _width;
            img.height = _height;
        }
    }else {
        if(_height>h){
            img.height = h;
            img.width = (_width*h)/_height;
        }else {
            img.width = _width;
            img.height = _height;
        }
    }
}

$.Util.loadJS = function (url, callback, part) {
    var _part = part || 'body', _fn = callback || function () { };
    var _stAry = document.getElementsByTagName('script');
    for (var i = 0, _sLen = _stAry.length; i < _sLen; i++) { if (_stAry[i].src == url) { _fn(); return; } }
    var eDom = document.getElementsByTagName(_part).item(0);
    var script = document.createElement('script');
    script.onload = script.onreadystatechange = script.onerror = function () {
        if (script && script.readyState && /^(?!(?:loaded|complete)$)/.test(script.readyState)) { return; }
        script.onload = script.onreadystatechange = script.onerror = null;
        script.src = '';
        //if (script) { script.parentNode.removeChild(script); }
        script = null;
        _fn();
    }
    /*
    if (script.readyState) {
        script.onreadystatechange = function () { if (script.readyState == "loaded" || script.readyState == "complete") { script.onreadystatechange = null; _fn(); } };
    } else {
        script.onload = _fn;
    }*/
    script.type = 'text/javascript';
    script.charset = "utf-8";
    script.src = url;
    try { eDom.appendChild(script); } catch (e) { }
}

$.Util.include = function (url, callback) {
    if (!url) { return; }
    var _fn = callback || function () { };
    switch ($.getType(url)) {
        case 'array':
            var _suc = 0, _len = url.length;
            for (var i = 0; i < _len; i++) { $.Util.loadJS(url[i], function () { _suc++; if (_suc == _len) { try { _fn(); } catch (e) { }; } }); }
            break;
        case 'string':
            $.Util.loadJS(url, _fn);
            break;
    }
}



$.Util.loadCSS = function (url, fn) {
    var eDom = document.getElementsByTagName('head').item(0), _fn = fn || function () { };
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'Stylesheet';
    link.href = url;
    if (link.readyState) {
        link.onreadystatechange = function () {
            if (link.readyState == "loaded" || link.readyState == "complete") { link.onreadystatechange = null; _fn(); }
        };
    } else {
        link.onload = _fn;
    }
    eDom.appendChild(link);
}

$.Util.HashTree = function (j) {
    var me = this, hash = {};
    var rootAry = [];
    var key;
    var STATE = {
        'not_exist': '不存在',
        'exist': '已经存在',
        'key_error': 'key数据类型错误',
        'args_error': '参数类型错误',
        'delete_error': '删除未知错误',
        'delete_succ': '删除成功',
        'append_args_error': '追加对象方法参数错误'
    };
    me.hashObjs = hash;
    me.rootAry = rootAry;
    me.id_name = {};
    function init(j) {
        var _j = j || {}, _ds = _j.dataSrc || [];
        key = _j.key;
        if (_ds.length) { me.arrayToTree(_ds, key); }
    }
    me.isExist = function (o) {  // 返回值: 存在 object, 不存在  not_exist  参数错误  args_error
        var d, _type = typeof o;
        if (_type == 'string') {
            d = hash[o];
            if (d) { return d; } else { return STATE.not_exist; }
        }
        if (_type == 'object') {
            var _name = o[key];
            d = hash[_name];
            if (d) { return d; } else { return STATE.not_exist; }
        }
        debug.error('$.Util.HashTree -- args_error');
        return STATE.args_error;
    }
    me.push = function (o) {
        var d = me.isExist(o);
        if (d == STATE.not_exist) {
            var _name = o[key];
            hash[_name] = { pre: '', next: '', obj: o, key: _name };
            return hash[_name];
        }
        return d;
    }
    
    me.arrayToTree = function (dataSrc, KEY) {
        var _ds = dataSrc || [], _len = _ds.length, _k = KEY || 'name', rootID;
        if (!_len) { return; }
        me.reset();
        key = _k;
        for (var i = 0; i < _len; i++) {
            var obj = _ds[i];
            if (!rootID) { rootID = obj.pid; }
            if (obj.pid < rootID) { rootID = obj.pid; }
            me.push(obj);
            me.id_name[obj.id] = obj[_k];
        }
        for (var i = 0; i < _len; i++) { var obj = _ds[i]; if (rootID == obj.pid) { rootAry.push(obj[_k]); } }
        for (var h in hash) {
            var hObj = hash[h], _obj = hObj.obj, _pid = +_obj.pid;
            var _name = me.id_name[_pid];
            if (_name) {
                hash[h].pre = _name.trim();
                hash[_name].next = hash[_name].next.trim().ac(_obj[_k]);
            }
        }
        return { hashObjs: hash, rootAry: rootAry };
    }

    me.hashObjToTree = function (rootAry, hashObj) {
        var _rAry = rootAry || [], _hash = hashObj || {};
        var _treeObj = {};
        var traveTree = function (obj, preObj) {
            var _next = obj.next;
            if (_next) {
                var _nextAry = _next.split(' '), _len = _nextAry.length;
                for (var ii = 0; ii < _len; ii++) {
                    var _strNext = _nextAry[ii], _nextObj = _hash[_strNext];
                    if (!_nextObj) { continue; }
                    if (_nextObj.next) {
                        preObj[_strNext] = { obj: _nextObj, next: {} };
                        traveTree(_nextObj, preObj[_strNext].next);
                    } else {
                        preObj[_strNext] = _nextObj;
                    }
                }
            }
        }
        for (var i = 0; i < _rAry.length; i++) {
            var _idx = _rAry[i], _obj = _hash[_idx];
            _treeObj[_idx] = { obj: _obj, next: {} };
            traveTree(_obj, _treeObj[_idx].next);
        }
        return _treeObj;
    }

    me.reset = function () {
        me.hashObjs = hash = {};
        me.rootAry = rootAry = [];
        me.id_name = {};
    }

    me.appendTo = function (o1, o2) {
        var d1 = me.push(o1);
        switch (d1) {
            case STATE.exist:
                var _d2 = me.isExist(o2); //树形操作
                if (_d2 != STATE.not_exist && _d2 != args_error) {
                    var _name1 = o1.obj[key], _name2 = _d2[key];
                    hash[_name1].pre = _name2;
                    hash[_name2].next = hash[_name2].next.ac(_name1);
                }
                break;
            case STATE.args_error:
                break;
            default:
                var _d2 = me.isExist(o2);
                if (_d2 != STATE.not_exist && _d2 != args_error) {
                    var _name2 = _d2[key];
                    d1.pre = _name2;
                    hash[_name2].next = hash[_name2].next.ac(d1.obj[key]);
                }
                break;
        }
        return d1;
    }

    me.remove = function (o) {
        var b = me.isExist(o);
        if (b == STATE.not_exist) {
            return '删除项' + STATE.not_exist;
        } else {
            var _obj = b.obj, _name = _obj[key], _pre = b.pre, _next = b.next;
            if (_pre) {
                var _aPre = _pre.split(' '), _preLen = _aPre.length;
                for (var i = 0; i < _preLen; i++) {
                    var _preName = _aPre[i], _hObj = hash[_preName];
                    if (_hObj) {
                        _hObj.next = _hObj.next.dc(_preName).toString();
                    }
                }
            }
            if (_next) {
                console.log(_next + ' :next');
            }
            hash[_name] = null;
            return STATE.delete_succ;
        }
        return b;
    }
    init(j);
    return me;
}

$.Util.namespace = function () {
    var A = arguments, E = null, C, B, D;
    for (C = 0; C < A.length; C = C + 1) {
        D = A[C].split(".");
        E = {};
        for (B = 0; B < D.length; B = B + 1) {
            E[D[B]] = E[D[B]] || {};
            E = E[D[B]];
        }
    }
    return E
}