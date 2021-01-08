$Util = {};
$Util.ajax = function (args) {
    var _args = args || {}, _fn = function () { };
    var _now = new Date(), _rand = _now.getHours() + _now.getMinutes() + _now.getSeconds();
    var _cb = 'meeko_' + _rand + '_' + Math.random().toString().replace('.', '');
    var _url = _args['url'] || 'http://192.168.0.20:8080',
    	_controller = _args['controller'] || '',
    	_action = _args['action'] || '',
    	_method = _args['method'] || 'POST',
    	_ifcc = _args['ifCheckCookie'] || false,
        _dataType = _args['dataType'] || 'jsonp',
    	_data = _args['args'] || {},
    	_onSuc = _args['onSuccess'] || _fn,
    	_onErr = _args['onError'] || _fn;
    var _params = {
        code: '1000', //消息通讯或者业务请求
        controller: _controller,
        action: _action,
        reqData: (_args['args'] || {}),
        id: 'xyy-pc-id', //请求发起者ID
        token: 'xyy-pc-token', //token
        linkType: 'HTTP-AJAX', //连接类型
        equipType: 'PC', //设备类型
        dataType: _dataType  //返回的数据类型,  json jsonp xml html
    };
    if (_controller) { _url += '/' + _controller + '/' + _action; } else { if (_action) { _url += '/' + _action; } }
    if (!_url || !_data) { MTips.show('请求URL或参数为空', 'error'); return; }
    _params = 'dataParams=' + JSON.stringify(_params) + '&clienttime=' + _rand;
    switch(_dataType.toLocaleLowerCase()){
        case 'jsonp':
            window[_cb] = function (data) { if (data.rs) { _onSuc(data.respData); } else { _onErr(data); } };
            $Util.loadJS(_url + '?callback=' + _cb + '&' + _params);
            break;
        case 'html':
            window[_cb] = function (data) { console.log(data); };
            $Util.loadJS(_url + '?callback=' + _cb + '&' + _params);
            break;
        case 'json':
            if (!$Util.ajaxObjPool) { $Util.ajaxObjPool = new $Util.XHRObjPool(); }
            $Util.ajaxObjPool.getXHR().request(_url, _params, {
                onSuccess: function (data) { var _rJson = $.JSON.decode(data); _onSuc(_rJson.respData, _rJson); },
                onError: function (d) { _onErr(d); }
            }, _method);
            break;
    }
};

$Util.XHRObjPool = function (j) {
    var me = this, _j = j || {};
    var _ary = [], _max = _j.max || 5;
    function addXHR() {
        var _xhr = new $Util.XHR();
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
    };
    me.getLength = function () { return _ary.length; };
};

$Util.XHR = function (url, args, cbFn, method) {
    var me = this, XHR, ifRun = false;
    me.getR = function () {
        if (!window.ActiveXObject) return new XMLHttpRequest();
        var e = "MSXML2.XMLHTTP", t = ["Microsoft.XMLHTTP", e, e + ".3.0", e + ".4.0", e + ".5.0", e + ".6.0"], _len = t.length;
        for (var n = _len - 1; n > -1; n--) {
            try { return new ActiveXObject(t[n]); } catch (r) { continue; }
        }
    };
    XHR = me.getR();
    me.bindFn = function (f, args) { return function () { return f.apply(me, args); }; };
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
        };
    };
    me.getState = function () { return ifRun; };
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
        };
    };
    if (arguments.length) { me.request(url, args, cbFn, method); }
    return me;
};
$Util.Q = function (j) {
    var me = this, _j = j || {}, _fn = function () {};
    var a = [], sat = 0, delay = _j.delay;
    var _onFinish = _j.onFinish || function () { console.log('end'); };
    var ifStop = false;
    if (delay == null) { delay = 2000; }
    function exec(cbFn) {
        var obj = a.shift(), _cf = cbFn || _fn;
        if (!obj) { return; }
        var _f = obj.f || _fn, _args = obj.args || [];
        _f.apply(_f, _args);
        if (_cf() != false) { me.next(); };
    };
    me.push = function (o) { a.push(o); return me; };
    me.go = function (cbFn) {
        if (sat == 1 || !a.length) { return me; }
        sat = 1; exec(cbFn); return me;
    };
    me.remove = function (v) { a.re(v); return me; };
    me.next = function (cbFn, ifRestart) {
        var _irs = ifRestart || false;
        if (_irs) { sat = 1; }
        if (ifStop || !sat) { return me; }
        if (!a.length) { sat = 0; _onFinish(me); return me; }
        if (delay) { setTimeout(function () { exec(cbFn); }, delay); } else { exec(cbFn); }
        return me;
    };
    me.stop = function () { ifStop = true; return me; };
    me.start = function () { ifStop = false; me.next(); return me; };
    me.len = function () { return a.length; };
    me.clear = function () { a.clear(); return me; };
    return me;
};

$Util.loadJS = function (url, callback, part) {
    var _part = part || 'body', _fn = callback || function () { };
    var _stAry = document.getElementsByTagName('script');
    for (var i = 0, _sLen = _stAry.length; i < _sLen; i++) { if (_stAry[i].src == url) { _fn(); return; } }
    var eDom = document.getElementsByTagName(_part).item(0);
    var script = document.createElement('script');
    script.onload = script.onreadystatechange = script.onerror = function () {
        if (script && script.readyState && /^(?!(?:loaded|complete)$)/.test(script.readyState)) { return; }
        script.onload = script.onreadystatechange = script.onerror = null;
        script.src = '';
        if (script) { script.parentNode.removeChild(script); }
        script = null;
        _fn();
    }
    script.type = 'text/javascript';
    script.charset = "utf-8";
    script.src = url;
    try { eDom.appendChild(script); } catch (e) { }
}

$Util.loadCSS = function (url, fn) {
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

$Util.namespace = function () {
    var A = arguments, E = null, C, B, D;
    for (C = 0; C < A.length; C = C + 1) {
        D = A[C].split(".");
        E = {};
        for (B = 0; B < D.length; B = B + 1) {
            E[D[B]] = E[D[B]] || {};
            E = E[D[B]];
        };
    }
    return E;
};