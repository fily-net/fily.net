var $=(function(){
    "use strict";
    var u = navigator.userAgent.toLowerCase(), isIE = (u.indexOf('msie') > 0), isFF = (u.indexOf('firefox') > 0), bsVer = (u.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],//获得版本
        $D = document, $DB = document.body, $LS = window.localStorage, $W = window, $M = Math, $DE = $D.documentElement, isPad = ("createTouch" in $D), _fn = function () { },
        $ = function (s) { if (s === '') { return $.getType(); }; if (!s) { return; }; var t = typeof (s); if (t == 'function') { $.onReady(s); } else { return (t == 'string' ? (s.charAt(0) == '{' ? (eval('(' + s + ')')) : $.ext($D.getElementById(s), _x)) : $.ext(s, _x)); }; };
    var _s = {
        toLow: function () { return this.toLowerCase(); },
        toUp: function () { return this.toUpperCase(); },
        cn2css: function () { var a = this.replace(/\s{2,}/g, ' ').split(" "), cssAry = []; for (var i = 0; i < a.length; i++) cssAry[i] = $.skin.classObj[a[i]]; return cssAry.join(';') + ';'; },
        esHtml: function () { return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); },
        toHtml: function () { return this.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'); },
        reHtml: function () { return this.replace(/<\/?[^>]+>/gi, ''); },
        times: function (n) { return n ? new Array(n + 1).join(this) : ''; },
        parseHtml: function (a) {
            var _ss = this.toString().split('<script');
            $(a).h(_ss.shift());
            for (var i = 0, _len = _ss.length; i < _len; i++) {
                if (_ss[i].indexOf('src') != -1) {
                    var _attrAry = _ss[i].trim().match(/([^\x00]+)\><\/script>$/i)[1].split(' ')
                    for (var idx = 0; idx < _attrAry.length; idx++) { var _kv = _attrAry[idx].split('='); if (_kv[0] == 'src') { _load.loadjs(_kv[1].replaceAll('"', '').trim()); }; }
                } else {
                    if (_ss[i] && ('<script' + _ss[i]).match(/<script[^>]*>([^\x00]+)<\/script>$/i)) { eval(('<script' + _ss[i]).match(/<script[^>]*>([^\x00]+)<\/script>$/i)[1].trim()); }
                }
            };
        },
        format: function () { var s = this, a = []; for (var i = 0, l = arguments.length; i < l; i++) a.push(arguments[i]); return s.replace(/\{(\d+)\}/g, function (m, i) { return a[i] }); },
        len: function () { return this.replace(/[^\x00-\xff]/g, '**').length; },
        toInt: function () { return parseInt(this, 10); },
        toElm: function (s) { var o = $(s); o.h(this); return o; },
        isDate: function () { var r = this.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/); if (r == null) return false; var d = new Date(r[1], r[3] - 1, r[4]); return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]); },
        isTime: function () {
            var r = this.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
            if (r == null) return false;
            var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
            return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7]);
        },
        replaceAll: function (s1, s2) { var a = this.split(s1); return a.join(s2); },
        test: function (r) { return r.test(this); },
        trim: function () { return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); },
        camelize: function () { return this.replace(/(-[a-z])/g, function (s) { return s.substring(1).toUpperCase(); }); },
        ec: function (s) { return (new RegExp('(^' + s + '\\s)|(\\s' + s + '$)|(\\s' + s + '\\s)|(^' + s + '$)', 'g')).test(this); },
        tc: function (s) { if (this.ec(s)) { return this.dc(s) } else { return this.ac(s); }; },
        dc: function (s) { if (this.ec(s)) { return this.replace(new RegExp('(^' + s + '\\s)|(\\s' + s + '$)|(\\s' + s + '\\s)|(^' + s + '$)', 'g'), '').replace(/\s{2,}/g, ' '); } else return this; },
        //dc:function(s){if (this.ec(s)){return this.trim().split(s).join('').replace(/\s{2,}/g,' ')}else return this},
        //ac:function(s){if (this.ec(s)){return this}else return this+' '+s}},
        ac: function (s) { return this.dc(s) + ' ' + s; }
    }, //---end---string
    _ajax = {
        XHR: function () {
            var me = this, XHR = getR(), ifRun = false;
            function getR() {
                if (!window.ActiveXObject) { return new XMLHttpRequest(); }
                var e = "MSXML2.XMLHTTP", t = ["Microsoft.XMLHTTP", e, e + ".3.0", e + ".4.0", e + ".5.0", e + ".6.0"], _len = t.length;
                for (var n = _len - 1; n > -1; n--) { try { return new ActiveXObject(t[n]); } catch (r) { continue; }; };
            }
            function exec(f, args) { return function () { return f.apply(me, args); }; };
            function onStateChange() {
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
            };
            me.getState = function () { return ifRun; };
            me.request = function (url, args, cbFn, method, async) {
                if (ifRun) { return; }; ifRun = true;
                var _url = url || '', _args = args || '', _f = cbFn || {}, _m = method || 'POST', _async = async !== null ? async : true;
                var _onSucc = _f.onSuccess || _fn, _onErr = _f.onError || _fn, _onTO = _f.onTimeout || _fn;
                var _timeoutFn = setTimeout(function () { XHR.abort(); clearInterval(_timeoutFn); _onErr("Timeout"); _onTO(); }, 2e4);
                if (_m == 'POST') {
                    XHR.open("POST", _url, _async);
                    XHR.onreadystatechange = exec(onStateChange, [_onSucc, _onErr, _timeoutFn]);
                    XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                    XHR.send(_args);
                } else {
                    XHR.open("GET", _url + "?" + _args, _async);
                    XHR.onreadystatechange = exec(onStateChange, [_onSucc, _onErr, _timeoutFn]);
                    XHR.send(null);
                }
            }
            if (arguments.length) { me.request(arguments[0], arguments[1], arguments[2], arguments[3]); };
            return me;
        },
        XHRPool: function (j) {
            var me = this, _j = j || {};
            var _ary = [], _max = _j.max || 5;
            function addXHR() { var _xhr = new _ajax.XHR(); _ary.push(_xhr); return _xhr; };
            me.getXHR = function () { for (var i = 0; i < _ary.length; i++) { if (!_ary[i].getState()) { return _ary[i]; }; }; return addXHR(); };
            me.getLength = function () { return _ary.length; };
        }
    },//---end---ajax
    _a = {
        max: function () { return $M.max.apply({}, this); },
        min: function () { return $M.min.apply({}, this); },
        copy: function () { return [].concat(this); },
        clear: function () { this.length = 0; return this; },
        re: function (v) { while (1) { var n = this.idxOf(v); if (n >= 0) this.reAt(n); else return this; }; },
        reAt: function (n) { this.splice(n, 1); return this; },
        unique: function () { var a = {}; for (var i = 0, l = this.length; i < l;) a[this[i++]] = 1; this.length = 0; for (i in a) this[this.length] = i; return this; },
        combine: function () { return [].concat.apply(this, arguments).unique(); },
        ec: function (fn) { try { for (var i = 0, l = this.length; i < l;) { fn.call(this, i++); } } catch (e) { return this; }; return this; },
        filter: function (fn) { var a = []; this.ec(function (i) { if (fn(this[i])) { a.push(this[i]); }; }); return a; },
        idxOf: function (v) { var me = this; if ([].indexOf) { return me.indexOf(v); } else { for (var i = 0, l = me.length; i < l; i++) { if (me[i] === v) { return i; } } return -1; }; }
    },//---end---array
    _d = {
        date8: function (s) { var m = this.getMonth() + 1, d = this.getDate(), m = m <= 9 ? ("0" + m) : m, d = d <= 9 ? ("0" + d) : d, s = s || ''; return [this.getFullYear(), m, d].join(s); },
        date2Str: function () { return (this.getFullYear() + '-' + (this.getMonth() + 1) + '-' + this.getDate() + ' ' + this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds()); },
        str2Date: function (str) { if (!str) { return false; }; var a = str.match(/[0-9]+/g); this.setFullYear($.m.p(a[0] || 1900), $.m.p(a[1] || 1) - 1, $.m.p(a[2] || 1)); this.setHours($.m.p(a[3] || 0)); this.setMinutes($.m.p(a[4] || 0)); this.setSeconds($.m.p(a[5] || 0)); return this; },
        format: function (format) {
            //{ M+: month, d+: day, h+: hour, m+: minute, q+: quarter, S: millisecond }
            var o = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S": this.getMilliseconds() };
            if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); }
            for (var k in o) { if (new RegExp("(" + k + ")").test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)); }; }
            return format;
        }
    },//---end---date
    _f = {
        help: function (s, e) { var l = "" + this; var s = s || "/*", e = e || "*/"; l = l.substring(l.indexOf(s) + 3, l.lastIndexOf(e)); return l.trim(); }
    },//---end---function
    _x = {
        alpha: function (a) {
            if (a || a == '') {
                if (isIE && +bsVer < 10) {
                    this.alp = a / 100; $S(this).filter = 'alpha(opacity=' + a + ')'
                } else { $S(this).opacity = a / 100; }
                return this;
            } else {
                if (isIE) {
                    if ($S(this).filter == '') { return 0; }
                    return $.m.p(this.filters.alpha.opacity);
                } else {
                    if ($S(this).opacity == '') { return 0; }
                    return $.m.p($S(this).opacity * 100);
                }
            };
        },
        ease: function (propArray, endProp, during, type, backFun, ifQ, ifPx) {
            var ifPx = ifPx || "px";
            if (ifPx == "") { ifPx = 0; };
            type = (type == 1 || (_tween[type] === undefined)) ? 'easeNone' : type;
            var me = this, dt = [], pAry = [], bAry = [], eAry = [], sAry = [], l = propArray.length;
            for (var i = 0; i < l; i++) {
                pAry.push(propArray[i].camelize()); eAry.push(endProp[i]);
                var _s = $S(me)[pAry[i]] || "0";
                if (pAry[i] == 'alpha') { _s = me.alpha() };
                _s = $.m.p(_s); sAry.push(_s); dt.push(eAry[i] - _s); bAry.push(_s);
            };
            var n = 0; var step = 16; var time = setTimeout(anitime, step); timeIntervalArray.push(time);
            function anitime() {
                var tAdjust = during - step; var t = n / tAdjust; n += 2 * step;
                if (n >= during) {
                    for (var k = 0; k < l; k++) { if (pAry[k] == 'alpha') { me.alpha(eAry[k]) } else { $S(me)[pAry[k]] = eAry[k] + ifPx }; };
                    var fun = backFun.e || ''; if (typeof (fun) == 'string') { eval(fun) } else { fun() }; clearTimeout(time); return
                };
                for (var i = 0; i < l; i++) {
                    sAry[i] = _tween[type](n, bAry[i], dt[i], during);
                    if (pAry[i] == 'alpha') { me.alpha(sAry[i]); } else { $S(me)[pAry[i]] = $M.ceil(sAry[i]) + ifPx; }
                }
                var t = setTimeout(anitime, step); var ff = backFun.f || '';
                if (typeof (ff) == 'string') { eval(ff); } else { ff(); }
            };
            return this;
        },
        animate: function (a) {

        },
        load: function (url) { if (!url) { return this; }; var _suffix = (/\.[^\.]+$/.exec(url)[0]).toLow(), _self = this; if (_suffix == '.js') { new $.UI.View({ p: _self, url: url }); } else { $.ajax({ url: url, dataType: 'html', onSuccess: function (rt) { rt.toString().parseHtml(_self); } }); }; return _self;},
        adElm: function (a, b) { var e = $C(a, b); this.appendChild(e); return $(e); },//可解决先$C再innerHTML的内存泄露问题
        appendTo: function (o) { o.appendChild(this); return this; },
        scrollTo: function (a) { var _args = $.init(a, { onScroll: _fn, onComplete: _fn }), _kv = { 'left': 'scrollLeft', 'top': 'scrollTop', 'width': 'scrollWidth', 'height': 'scrollHeight' }, _self = this, _k;for (var i in _args) { if ($.getType(_args[i]) == 'function') { continue; }; _k = _kv[i.toLow()]; $.animate({ begin: _self[_k], end: _args[i], step: 16, easing: 'easeNone', interval: 500, onComplete: _args.onComplete, onRunning: function (obj) { _self[_k] = obj.value; _args.onScroll(obj); } }); }; return _self; },
        bbElm: function (a, b) { var e = $C(a, b); this.insertAdjacentElement("beforeBegin", e); return $(e); },
        abElm: function (a, b) { var e = $C(a, b); this.insertAdjacentElement("afterBegin", e); return $(e); },
        aeElm: function (a, b) { var e = $C(a, b); this.insertAdjacentElement("afterEnd", e); return $(e); },
        beElm: function (a, b) { var e = $C(a, b); this.insertAdjacentElement("beforeEnd", e); return $(e); },
        attr: function (a, s) {
            if (a == undefined) { return this; };
            if (arguments.length == 1) {
                return this.getAttribute(a);
            } else {
                if (isIE && this.tagName == "INPUT" && a == "type") {
                    var t = this.outerHTML.split(a + "=" + this.attr(a)); if (t.length > 1) this.outerHTML = t.join(a + "=" + s); else this.outerHTML = this.outerHTML.replace(">", " " + a + "=" + s + ">")
                } else {
                    this.setAttribute(a, s); return this.id == '' ? this : $(this.id);
                }
            }
        },
        ac: function (s) { this.cn(this.cn().ac(s)); return this; },
        //dc:function(s){var me=this,c=this.cn(),a=s.split(" ");a.ec(function(i){c=c.dc(this[i])});me.cn(c);return me},
        dc: function (s) { var me = this, c = this.cn(); me.cn(c.dc(s)); return me; },
        tc: function (s) { this.cn(this.cn().tc(s)); return this; },
        chn: function (n) { return $(this.childNodes[n]); },
        chr: function (n) { return $(this.children[n]); },
        cn: function (s) { if (s || s == '') { this.className = s; return this; } else return this.className },
        cs: function (s) { if (isIE) { if (s == "top") { return this.offsetTop; }; if (s == "left") { return this.offsetLeft; }; if (s == "width") { return this.offsetWidth; }; if (s == "height") { return this.offsetHeight; }; if (s == "background-position" && +$('').split(',')[1] < 9) { return this.currentStyle["backgroundPositionX"] + " " + this.currentStyle["backgroundPositionY"]; }; return this.currentStyle[s.camelize()]; } else { return window.getComputedStyle(this, null).getPropertyValue(s); }; },
        csn: function (s) { return $.m.p(this.cs(s)); },
        css: function (s) { var me = this, l = s.split(';'); l.ec(function (i) { var t = this[i].split(':'), s; if (t[2]) { s = t[1] + ":" + t[2]; } else { s = t[1]; }; if (t[0] == 'float') { if (isIE) { t[0] = 'style-float'; } else { t[0] = 'css-float'; } }; if (t[0]) { $S(me)[t[0].camelize()] = s; }; }); return me; },
        evt: function (s, f, c) { if (c == undefined) { c = false; }; if (isFF && s == "mousewheel") { s = 'DOMMouseScroll'; }; isIE ? this.attachEvent('on' + s, f, c) : this.addEventListener(s, f, c); return this; },
        revt: function (s, f, c) { if (c == undefined) { c = false; }; isIE ? this.detachEvent('on' + s, f, c) : this.removeEventListener(s, f, c); return this; },
        fevt: function (s) { if ($D.createEventObject) { var e = $D.createEventObject(); this.fireEvent('on' + s, e); } else { var e = $D.createEvent("HTMLEvents"); e.initEvent(s, true, true); this.dispatchEvent(e); }; return this; },
        fc: function () { return $(this.firstChild); },
        insertA: function (o) { return o.insertAdjacentElement("afterEnd", this.cloneNode(true)); },
        insertB: function (o) { return o.insertAdjacentElement("beforeBegin", this.cloneNode(true)); },
        moveA: function (o) { var a = this.insertA(o); this.r(); return a; },
        moveB: function (o) { var a = this.insertB(o); this.r(); return a; },
        ps: function () { return $(this.previousSibling); },
        ns: function () { return $(this.nextSibling); },
        fcs: function () { this.focus(); return this; },
        find: function (s, c) {
            return (function f(s, o, c) {
                var r = RegExp, o = o || $D, s = !s || s == '.' ? '*' : s;
                if (o.length === 0) return [];
                if (/^(\w+|\*)$/.test(s)) return o.getElementsByTagName(s);
                if (/^#(\w+)(?:[\s>]?(.*))?$/.test(s)) return r.$2 ? f(r.$2, o.getElementById(r.$1)) : o.getElementById(r.$1);
                if (/^\.(.*)$/.test(s)) {
                    c = (c ? r.$1 : 'class=' + r.$1).split('=');
                    for (var t, i = 0, ci, a = [], o = o.length ? o : o.getElementsByTagName('*') ; ci = o[i++];) (t = ci.getAttributeNode(c[0])) && (c[1] ? t.value == c[1] : 1) && a.push(ci); return a;
                };
                if (/^(\w+)(\..*)$/.test(s)) return f(r.$2, f(r.$1, o));
                if (/^(\w+):(.*)$/.test(s)) return f("." + r.$2, f(r.$1, o), 1);
                return [];
            })(s, this, c);
        },
        replaceHtml: function (s) { var e = this.cloneNode(false), d = this.parentNode ? this.parentNode : $D; e.innerHTML = s; d.replaceChild(e, this); return this; },
        h: function (s) { if (s || s == '') { this.innerHTML = s; return this } else return this.innerHTML; },
        ht: function (s) { if (this.innerText) { if (s || s == '') { this.innerText = s; return this; } else { return this.innerText || ''; }; } else { if (s || s == '') { this.textContent = s; return this } else { return this.textContent || ''; }; }; },
        hide: function () { return this.css('display:none'); },
        pos: function (p) { var x = 0, y = 0, w = 0, h = 0; p = p || $DB; if (this.getBoundingClientRect) { var box = this.getBoundingClientRect(); x = box.left + Math.max($DE.scrollLeft, $DB.scrollLeft) - $DE.clientLeft; y = box.top + Math.max($DE.scrollTop, $DB.scrollTop) - $DE.clientTop; } else { for (; obj != p; x += obj.offsetLeft, y += obj.offsetTop, obj = obj.offsetParent) { }; }; w = this.offsetWidth; h = this.offsetHeight; return { x: x, y: y, w: w, h: h }; },
        posFix: function () { return { x: this.getBoundingClientRect().left, y: this.getBoundingClientRect().top, w: this.offsetWidth, h: this.offsetHeight }; },//getBoundingClientRect 来替换pos方法
        pn: function (n) { if (!n) { return $(this.parentNode) }; var p = this; while (n) { p = p.parentNode; n--; }; return $(p); },
        r: function () { if (this && this.parentNode) this.parentNode.removeChild(this); },
        val: function (s) { if (s || s == '') { this.value = s; return this; } else { return this.value; } },
        show: function () { return this.css('display:block'); }
    },//---end---dom
    _number = {
        round: function (p) { p = $M.pow(10, p || 0); return $M.round(this * p) / p; }
    },//---end---number
    _tween = {
        easeNone: function (t, b, c, d) { return c * t / d + b; },
        easeInQuad: function (t, b, c, d) { return c * (t /= d) * t + b; },
        easeOutQuad: function (t, b, c, d) { return -c * (t /= d) * (t - 2) + b; },
        easeInOutQuad: function (t, b, c, d) { if ((t /= d / 2) < 1) { return c / 2 * t * t + b; }; return -c / 2 * ((--t) * (t - 2) - 1) + b; },
        easeInCubic: function (t, b, c, d) { return c * (t /= d) * t * t + b; },
        easeOutCubic: function (t, b, c, d) { return c * ((t = t / d - 1) * t * t + 1) + b; },
        easeInOutCubic: function (t, b, c, d) { if ((t /= d / 2) < 1) { return c / 2 * t * t * t + b; }; return c / 2 * ((t -= 2) * t * t + 2) + b; },
        easeOutInCubic: function (t, b, c, d) { if (t < d / 2) { return _tween.easeOutCubic(t * 2, b, c / 2, d); }; return _tween.easeInCubic((t * 2) - d, b + c / 2, c / 2, d); },
        easeInQuart: function (t, b, c, d) { return c * (t /= d) * t * t * t + b; },
        easeOutQuart: function (t, b, c, d) { return -c * ((t = t / d - 1) * t * t * t - 1) + b; },
        easeInOutQuart: function (t, b, c, d) { if ((t /= d / 2) < 1) { return c / 2 * t * t * t * t + b; }; return -c / 2 * ((t -= 2) * t * t * t - 2) + b; },
        easeOutInQuart: function (t, b, c, d) { if (t < d / 2) { return _tween.easeOutQuart(t * 2, b, c / 2, d); }; return _tween.easeInQuart((t * 2) - d, b + c / 2, c / 2, d); },
        easeInQuint: function (t, b, c, d) { return c * (t /= d) * t * t * t * t + b; },
        easeOutQuint: function (t, b, c, d) { return c * ((t = t / d - 1) * t * t * t * t + 1) + b; },
        easeInOutQuint: function (t, b, c, d) { if ((t /= d / 2) < 1) { return c / 2 * t * t * t * t * t + b; }; return c / 2 * ((t -= 2) * t * t * t * t + 2) + b; },
        easeOutInQuint: function (t, b, c, d) { if (t < d / 2) { return _tween.easeOutQuint(t * 2, b, c / 2, d); }; return _tween.easeInQuint((t * 2) - d, b + c / 2, c / 2, d); },
        easeInSine: function (t, b, c, d) { return -c * Math.cos(t / d * (Math.PI / 2)) + c + b; },
        easeOutSine: function (t, b, c, d) { return c * Math.sin(t / d * (Math.PI / 2)) + b; },
        easeInOutSine: function (t, b, c, d) { return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b; },
        easeOutInSine: function (t, b, c, d) { if (t < d / 2) { return _tween.easeOutSine(t * 2, b, c / 2, d); }; return _tween.easeInSine((t * 2) - d, b + c / 2, c / 2, d); },
        easeInExpo: function (t, b, c, d) { return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001; },
        easeOutExpo: function (t, b, c, d) { return (t == d) ? b + c : c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b; },
        easeInOutExpo: function (t, b, c, d) { if (t == 0) { return b; }; if (t == d) { return b + c; }; if ((t /= d / 2) < 1) { return c / 2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005; }; return c / 2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b; },
        easeOutInExpo: function (t, b, c, d) { if (t < d / 2) { return _tween.easeOutExpo(t * 2, b, c / 2, d); }; return _tween.easeInExpo((t * 2) - d, b + c / 2, c / 2, d); },
        easeInCirc: function (t, b, c, d) { return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b; },
        easeOutCirc: function (t, b, c, d) { return c * Math.sqrt(1 - (t = t / d - 1) * t) + b; },
        easeInOutCirc: function (t, b, c, d) { if ((t /= d / 2) < 1) { return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b; }; return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b; },
        easeOutInCirc: function (t, b, c, d) { if (t < d / 2) { return _tween.easeOutCirc(t * 2, b, c / 2, d); }; return _tween.easeInCirc((t * 2) - d, b + c / 2, c / 2, d); },
        easeInElastic: function (t, b, c, d, a, p) { var s; if (t == 0) { return b; }; if ((t /= d) == 1) { return b + c; }; if (!p) { p = d * .3; }; if (!a || a < Math.abs(c)) { a = c; s = p / 4; } else { s = p / (2 * Math.PI) * Math.asin(c / a); }; return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b; },
        easeOutElastic: function (t, b, c, d, a, p) { var s; if (t == 0) { return b; }; if ((t /= d) == 1) { return b + c; }; if (!p) { p = d * .3; }; if (!a || a < Math.abs(c)) { a = c; s = p / 4; } else { s = p / (2 * Math.PI) * Math.asin(c / a); }; return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b); },
        easeInOutElastic: function (t, b, c, d, a, p) { var s; if (t == 0) { return b; }; if ((t /= d / 2) == 2) { return b + c; }; if (!p) { p = d * (.3 * 1.5); }; if (!a || a < Math.abs(c)) { a = c; s = p / 4; } else { s = p / (2 * Math.PI) * Math.asin(c / a); }; if (t < 1) { return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b; }; return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b; },
        easeOutInElastic: function (t, b, c, d, a, p) { if (t < d / 2) { return _tween.easeOutElastic(t * 2, b, c / 2, d, a, p); }; return _tween.easeInElastic((t * 2) - d, b + c / 2, c / 2, d, a, p); },
        easeInBack: function (t, b, c, d, s) { if (s == undefined) { s = 1.70158; }; return c * (t /= d) * t * ((s + 1) * t - s) + b; },
        easeOutBack: function (t, b, c, d, s) { if (s == undefined) { s = 1.70158; }; return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b; },
        easeInOutBack: function (t, b, c, d, s) { if (s == undefined) { s = 1.70158; }; if ((t /= d / 2) < 1) { return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b; }; return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b; },
        easeOutInBack: function (t, b, c, d, s) { if (t < d / 2) { return _tween.easeOutBack(t * 2, b, c / 2, d, s); }; return _tween.easeInBack((t * 2) - d, b + c / 2, c / 2, d, s); },
        easeInBounce: function (t, b, c, d) { return c - _tween.easeOutBounce(d - t, 0, c, d) + b; },
        easeOutBounce: function (t, b, c, d) { if ((t /= d) < (1 / 2.75)) { return c * (7.5625 * t * t) + b; } else if (t < (2 / 2.75)) { return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b; } else if (t < (2.5 / 2.75)) { return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b; } else { return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b; }; },
        easeInOutBounce: function (t, b, c, d) { if (t < d / 2) { return _tween.easeInBounce(t * 2, 0, c, d) * .5 + b; } else { return _tween.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b; }; },
        easeOutInBounce: function (t, b, c, d) { if (t < d / 2) { return _tween.easeOutBounce(t * 2, b, c / 2, d); }; return _tween.easeInBounce((t * 2) - d, b + c / 2, c / 2, d); }
    },//---end---tween
    _load = {
        loadjs: function (url, callback, part) {
            if (!url) { return false; };
            var _stAry = document.getElementsByTagName('script'), _cbfn = callback || _fn;
            for (var i = 0, _sLen = _stAry.length; i < _sLen; i++) { if (_stAry[i].src == url) { _cbfn(_stAry[i]); return; } }
            var eDom = document.getElementsByTagName(part || 'body').item(0), script = document.createElement('script');
            script.onload = script.onreadystatechange = script.onerror = function () { if (script && script.readyState && /^(?!(?:loaded|complete)$)/.test(script.readyState)) { return; }; script.onload = script.onreadystatechange = script.onerror = null; _cbfn(script); if (script) { script.src = ''; script.parentNode.removeChild(script); script = null; }; };
            script.type = 'text/javascript'; script.charset = "utf-8"; script.src = url;
            try { eDom.appendChild(script); } catch (e) { };
        },
        loadcss: function (url, callback, part) {
            if (!url) { return false; };
            var _stAry = document.getElementsByTagName('link'), _cbfn = callback || _fn;
            for (var i = 0, _sLen = _stAry.length; i < _sLen; i++) { if (_stAry[i].href == url) { _cbfn(_stAry[i]); return; } }
            var eDom = document.getElementsByTagName(part || 'body').item(0), link = document.createElement('link');
            link.onload = link.onreadystatechange = link.onerror = function () { if (link && link.readyState && /^(?!(?:loaded|complete)$)/.test(link.readyState)) { return; }; link.onload = link.onreadystatechange = link.onerror = null; _cbfn(link); };
            link.type = 'text/css'; link.rel = 'Stylesheet'; link.charset = "utf-8"; link.href = url;
            try { eDom.appendChild(script); } catch (e) { };
        }
    },//---end---load
    _w = {
        timeIntervalArray: [],
        isIE: isIE,
        isPad: isPad,
        qWait: function (t) { var q = _q(this, t); if (q.qType == "_QB") { return q } return this },
        $D: $D,
        $DB: $DB,
        $B: $DB,
        $Ef: function (s) { return $(s); },
        $DBf: function () { return $DB; },
        $Fg: function () { return $($D.createDocumentFragment()); },
        $C: function (id, tag) { if (arguments.length == 1) { return $($D.createElement(arguments[0])); } else { return $($D.createElement(arguments[1])).attr('id', arguments[0]); }; },
        $$: function () { return this.$A(Sizzle(str)); },
        $A: function (o, b) { if (!o) { return []; }; if (o.toArray) { return o.toArray(); }; var l = o.length || 0, r = new Array(l); while (l--) { r[l] = o[l]; }; return r; },
        $S: function (s) { if (!s) return null; return (typeof (s) == 'string' ? $(s).style : s.style); }
    };//---end---windows;
    $.namespace = function (S) { var A = S.split('.'), A1 = A[0], obj = window[A1]; if (!obj) { obj = {}; window[A1] = obj; }; for (var i = 1, _iLen = A.length; i < _iLen; i++) { var T = A[i]; if (!obj[T]) { obj[T] = {}; obj = obj[T]; }; }; return obj;}
    $.ext = function (e, o) { if (e === null || o === null) { return; }; for (var i in o) { if (!e[i]) { e[i] = o[i] }; }; return e; };
    $.init = function (o, n) { var _o = o || {}, _n = n || {}; for (var i in n) { if (_o[i] == null) { _o[i] = _n[i]; } else { if (i == 'p') { _o[i] = $(_o[i]); }; }; }; return _o; };
    $.ajax = function (a) {
        var _fn = function () { }, _args = { url: '', data: '', args: '', method: 'POST', async: true, dataType: '', onStart: _fn, onSuccess: _fn, onError: _fn, onTimeOut: _fn, onComplete: _fn };
        _args = $.init(a, _args);
        var _now = new Date(), _rand = _now.date8() + _now.getHours() + _now.getMinutes() + _now.getSeconds();
        var _cb = 'meeko_' + _rand + '_' + Math.random().toString().replace('.', '');
        switch (_args.dataType.toLow()) {
            case 'html':
                _args.method = 'GET'; _args.data = 'cb';
            case 'json':
                if (!window.ajaxObjPool) { window.ajaxObjPool = new _ajax.XHRPool({ max: 5 }); };
                window.ajaxObjPool.getXHR().request(_args.url, (_args.data || _args.args), _args, _args.method, _args.async);
                break;
            case 'jsonp':
                window[_cb] = function (data) { };
                _load.loadjs(_url + '?callback=' + _cb + '&' + (_args.data || _args.args));
                break;
        }
        return $;
    };
    $.animate = function (a) {
        var _args = $.init(a, { begin: 0, end: 100, speed: 16, easing: 'easeInQuad', interval: 500, onRunning: _fn, onComplete: _fn });
        if (_args.begin == _args.end) { return $;}
        var n = 0, _during = _args.interval, _start = setTimeout(exce, _args.speed);
        function exce() { n += _args.speed * 2; if (n >= _during) { _args.onRunning({ value: _args.end }); _args.onComplete({ value: _args.end }); clearTimeout(_start); } else { var _val = _tween[_args.easing](n, _args.begin, (_args.end - _args.begin), _during); _args.onRunning({ value: _val }); setTimeout(exce, _args.speed); }; }; return $;
    };
    $.Q = function () {
        var me = this, rValue = null;//函数运行的返回对象 or 值
        me.q = [];
        me.sat = 0;//0未运行 1正在运行队列
        me.qType = "_QB";
        me.push = function (j) {//o对象 f函数指针 p函数参数 t延时方式 0 立即执行
            if ($.getType(j) == "array") {
                for (var i = 0; i < j.length; i++) { var oj = j[i]; me.q.push({ qType: oj.o, fn: oj.f, arg: oj.p, delay: oj.t }); }
            }
            else me.q.push({ qType: j.o, fn: j.f, arg: j.p, delay: j.t }); return me;
        };
        me.wait = function (n) { me.q.push({ qType: '_QB', fn: (function () { }), arg: null, delay: n }); return me; };
        me.getLen = function () { return me.q.length; };
        me.getRefObj = function () { return rValue; };
        me.go = function () {
            me.sat = 1; var qObj = me.q[0]; if (!qObj) { return };
            var rObj = qObj.qType; qObj.arg = $A(qObj.arg || []);
            var dTime = qObj.delay;
            if (dTime == -1) { qObj.arg.push(me) }; if (rObj) { if (rObj == "_QB") rObj = rValue; rValue = qObj.fn.apply(rObj, qObj.arg) } else { rValue = qObj.fn.apply(null, qObj.arg); }
            if (dTime > 0) {
                setTimeout(function () { me.q.shift(); me.go() }, dTime)
            } else {
                me.q.shift();
                if (me.getLen() === 0 || dTime == -1) {//-1停止执行队列
                    me.sat = 0; return me;
                };
                me.go();
            }
        };
        return me
    };
    $.q = function (j) {
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
        me.go = function (cbFn) { if (sat == 1 || !a.length) { return me; };sat = 1; exec(cbFn); return me; }
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
    $.m = {
        p: function (a) { return parseInt(a, 10);},
        pf: parseFloat,
        toDecimal: function (x) { return isNaN(parseFloat(x)) ? false : Math.round(x * 100) / 100; }, //功能：保留两位小数 -- 将浮点数四舍五入，取小数点后2位
        toDecimal2: function (x) { if (isNaN(parseFloat(x))) { return false; }; var s = (Math.round(x * 100) / 100).toString(); var rs = s.indexOf('.'); if (rs < 0) { rs = s.length; s += '.'; }; while (s.length <= rs + 2) { s += '0'; }; return s; },//制保留2位小数，如：2，会在2后面补上00.即2.00  
        fomatFloat: function (src, pos) { return Math.round(+src * Math.pow(10, pos)) / Math.pow(10, pos); }
    };
    $.e = {
        fix: function (e) {
            var e = e || $W.event;
            e.code = e.keyCode || e.which || e.charCode || e.button;
            e.stop = function () { if (isIE) e.cancelBubble = true; else e.stopPropagation(); e.pDefault(); };
            e.pDefault = function () { if (isIE) e.returnValue = false; else e.preventDefault(); };
            if (isIE) { e.target = e.srcElement };
            if (e.target.nodeType == 3) { e.target = e.target.parentNode };
            if (!e.relatedTarget && e.fromElement) { e.relatedTarget = e.fromElement == e.target ? e.toElement : e.fromElement; }
            if (!e.pageX && e.clientX) {
                var b = $DE;
                e.pageX = e.clientX + (b && b.scrollLeft || $DB && $DB.scrollLeft || 0) - (b.clientLeft || 0);
                e.pageY = e.clientY + (b && b.scrollTop || ($DB && $DB.scrollTop) || 0) - (b.clientTop || 0);
            };
            /*if(!e.x) e.x=e.pageX;if(!e.y)e.y=e.pageY;*/
            if (isFF) { e.wheelDelta = -e.detail * 40; } //统一FF下滚轮偏离
            e.t = $(e.target);
            return e;
        },
        setInterval: function (f, t) { var args = [].slice.call(arguments, 2), fn = f; if (args.length > 0) { fn = function () { f.apply(this, args) } }; return $W.setInterval(fn, t); },
        setTimeout: function (f, t) { var args = [].slice.call(arguments, 2), fn = f; if (args.length > 0) { fn = function () { f.apply(this, args) } }; return $W.setTimeout(fn, t); }
    };
    $.drag={
        init: function (o, or, minX, maxX, minY, maxY, h, v, xFn, yFn) {
            o.onmousedown = $.drag.start;
            o.ih = h ? false : true;
            o.v = v ? false : true;
            o.rt = or && or != null ? or : o;
            o.s = o.rt.style;
            o.minX = minX || 0;
            o.minY = minY || 0;
            o.maxX = maxX || null;
            o.maxY = maxY || null;
            o.xFn = xFn ? xFn : null;
            o.yFn = yFn ? yFn : null;
            o.p = $.m.p;
            o.rt.onDragStart = o.rt.onDragEnd = o.rt.onDrag = _fn;
            return o;
        },
        start: function (e, o) {
            var o = $.drag.obj = o || this, y = o.p(o.v ? o.s.top : o.s.bottom), x = o.p(o.ih ? o.s.left : o.s.right);
            o.s.display = "block";
            e = e || $W.event;
            o.rt.onDragStart(x, y, e);
            o.lx = e.clientX;
            o.ly = e.clientY;
            if (o.ih) {
                o.iMX = o.lx - x + o.minX; if (o.maxX) { o.xMX = o.iMX + o.maxX - o.minX; }
            } else {
                o.xMX = -o.minX + o.lx + x; if (o.maxX) { o.iMX = -o.maxX + o.lx + x; }
            };
            if (o.v) {
                o.iMY = o.ly - y + o.minY; if (o.maxY) { o.xMY = o.iMY + o.maxY - o.minY; }
            } else {
                o.xMY = -o.minY + o.ly + y; if (o.maxY) { o.iMY = -o.maxY + o.ly + y; }
            };
            $D.onmousemove = $.drag.drag;
            $D.onmouseup = $.drag.end;
            return false;
        },
        drag:function(e){
            var e=$.e.fix(e);e.stop();
            var o = $.drag.obj, ey = e.clientY, ex = e.clientX, mi = $M.min, mx = $M.max, y = o.p(o.v ? o.s.top : o.s.bottom), x = o.p(o.ih ? o.s.left : o.s.right);
            if(o.dragable==false) return;
            ex = o.ih ? mx(ex, o.iMX) : mi(ex, o.xMX);
            if (o.maxX) ex = o.ih ? mi(ex, o.xMX) : mx(ex, o.iMX); ey = o.v ? mx(ey, o.iMY) : mi(ey, o.xMY);
            if (o.maxY) ey = o.v ? mi(ey, o.xMY) : mx(ey, o.iMY);
            var nx = x + ((ex - o.lx) * (o.ih ? 1 : -1)), ny = y + ((ey - o.ly) * (o.v ? 1 : -1));
            if (o.xFn) nx = o.xFn(y); else if (o.yFn) ny = o.yFn(x);
            o.s['left'] = (nx || 0) + 'px';
            o.s[o.v ? 'top' : 'bottom'] = (ny || 0) + 'px';
            o.lx = ex; o.ly = ey; o.rt.onDrag(nx, ny);
            return false;
        },
        end: function () {
            var o = $.drag.obj;
            $D.onmousemove = $D.onmouseup = null;
            o.rt.onDragEnd(o.p(o.s[o.ih ? "left" : "right"]), o.p(o.s[o.v ? "top" : "bottom"]));
            o = null;
        }
    };
    $.ck = {
        set: function (n, v, h) {
            var sc = n + '=' + encodeURIComponent(v);
            if (h) { var exp = new Date($.time() + h * 36E5); sc += '; expires=' + exp.toGMTString(); };
            document.cookie = sc;
        },
        get: function (n) {
            var oRE = new RegExp('(?:; )?' + n + '=([^;]*);?');
            if (oRE.test($D.cookie)) { return decodeURIComponent(RegExp['$1']); } else { return null; }
        },
        remove: function (n) { this.set(n, null, -9999); },
        clear: function () { $D.cookie = null; }
    };
    $.getType = function () {
        if (arguments.length > 0) {
            var t, o = arguments[0];
            return ((t = typeof (o)) == "object" ? o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : t).toLow();
        } else {
            var u = navigator.userAgent.toLow(), v = (u.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1];
            if (u.indexOf('applewebkit/') > -1) {
                return 'safari,' + v;
            } else if (!!$W.opera) {
                return 'opera,' + v;
            } else if (u.indexOf('msie') > -1) {
                return 'msie,' + v;
            } else if (u.indexOf('firefox') !== -1) {
                return 'mozilla,' + v;
            } else if (u.indexOf('chrome') !== -1) {
                return 'chrome,' + v;
            }
        }
    };
    $.ls={
        set: function (k, v) { if (this.get(k) !== null) this.remove(k); $LS.setItem(k, v);},
        get: function (k) { var v = $LS.getItem(k); return v === undefined ? null : v;	},
        remove: function (k) { $LS.removeItem(k); },
        clear: function () { $LS.clear(); },
        each: function (fn) { var n = $LS.length, i = 0, fn = fn || _fn, k; for (; i < n; i++) { k = $LS.key(i); if (fn.call(this, k, this.get(k)) === false) { break; }; if ($LS.length < n) { n--; i--; }; }; }  //如果内容被删除，则总长度和索引都同步减少
    };
    $.JSON = new (function () { var _1 = {}.hasOwnProperty ? true : false; var m = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", "\"": "\\\"", "\\": "\\\\" }; var _5 = function (s) { if (/["\\\x00-\x1f]/.test(s)) { return "\"" + s.replace(/([\x00-\x1f\\"])/g, function (a, b) { var c = m[b]; if (c) { return c; } c = b.charCodeAt(); return "\\u00" + $M.floor(c / 16).toString(16) + (c % 16).toString(16); }) + "\""; } return "\"" + s + "\""; }; var _a = function (o) { var a = ["["], b, i, l = o.length, v; for (i = 0; i < l; i += 1) { v = o[i]; switch (typeof v) { case "undefined": case "function": case "unknown": break; default: if (b) { a.push(","); } a.push(v === null ? "null" : $.JSON.encode(v)); b = true; } } a.push("]"); return a.join(""); }; this.encode = function (o) { if (typeof o == "undefined" || o === null) { return "null"; } else { if (o instanceof Array) { return _a(o); } else { if (o instanceof Date) { return o.date2Str(); } else { if (typeof o == "string") { return _5(o); } else { if (typeof o == "number") { return isFinite(o) ? String(o) : "null"; } else { if (typeof o == "boolean") { return String(o); } else { var a = ["{"], b, i, v; for (i in o) { if (!_1 || o.hasOwnProperty(i)) { v = o[i]; switch (typeof v) { case "undefined": case "function": case "unknown": break; default: if (b) { a.push(","); } a.push(this.encode(i), ":", v === null ? "null" : this.encode(v)); b = true; } } } a.push("}"); return a.join(""); } } } } } } }; this.decode = function (_18) { return eval("(" + _18 + ")"); }; })();
    $.onReady = function (f) { if (!isIE) { _x.evt.call($D, 'DOMContentLoaded', f, false); } else { var t = setInterval(function () { try { $DB.doScroll('left'); clearInterval(t); setTimeout(f, 48); } catch (e) { } }, 48) }; };
    $.noSel=function(){if($D.selection){if($D.selection.empty)$D.selection.empty();else{$D.selection = null;}}else if(getSelection){try{getSelection().removeAllRanges()}catch(e){}}};
    $.time = function () { return +(new Date) || Date.now;};
    $.rnd = function (a, b) { return $M.round($M.random($.time) * (b - a)) + a;};
    $.clone = function (a) { var me = this; var b = {}; for (var i in a) { var copy = a[i]; if (b === copy) { continue; }; if (typeof copy == "object") { b[i] = $.clone(copy || {}); } else { b[i] = copy; }; }; return b; };
    $.nCount = function () { var me = this; me.i = -1; me.getN = function () { me.i++; return me.i; }; me.setN = function (n) { me.i = n; };};
    $.wh = function () {
        var _w, _h = 0;
        if (typeof ($W.innerWidth) == 'number') {
            _w = $W.innerWidth; _h = $W.innerHeight;
        } else if ($DE && ($DE.clientWidth || $DE.clientHeight)) {
            _w = $DE.clientWidth; _h = $DE.clientHeight;
        } else if ($DB && ($DB.clientWidth || $DB.clientHeight)) {
            _w = $DB.clientWidth; _h = $DB.clientHeight;
        };
        return [_w / 2 + ($DE.scrollLeft || $DB.scrollLeft), _h / 2 + ($DE.scrollTop || $DB.scrollTop)];
    };
    $.box = function (a) { var a = a.split(','); return (a[0].length ? 'left:' + a[0] + 'px;' : '') + (a[1].length ? 'top:' + a[1] + 'px;' : '') + (a[2].length ? 'width:' + a[2] + 'px;' : '') + (a[3].length ? 'height:' + a[3] + 'px;' : '');};
    $.setAtomStyle = function (o) { classObj = o; };
    $.skin={
        classObj: {},
        setAtomStyle: function (o) { this.classObj = o;},
        getStyle: function () {
            var css = null;
            try {
                css = $D.styleSheets[0];
                if (!css) {
                    var head = $D.getElementsByTagName("head").item(0);
                    head.appendChild($C("style"));
                    css = $D.styleSheets[0];
                };
            } catch (ex) {
                css = $D.createStyleSheet("styles.css");
            };
            return css;
        },
        setStyle:function(css, selector, rule) {
            if (css.insertRule) { // ff
                css.insertRule(""+selector+" { "+rule+" }", css.cssRules.length);
            } else if(css.addRule) { // ie
                try{ css.addRule(selector, rule); }catch(e){};
            }
        },
        setCssItem: function (s1, s2) { this.setStyle(this.getStyle(), s1, s2); return this;},
        setCss: function (o) {
            if ($.getType(o) == 'object') {
                var css = this.getStyle();
                for (i in o) { this.setStyle(css, i, o[i]); };
            };
            return css;
        }
    };
    $.key = {
        stat: [],
        kd: function (e) { var e = $.e.fix(e); $.key.stat[e.code] = 1; },
        ku: function (e) { var e = $.e.fix(e); $.key.stat[e.code] = 0; },
        bind: function (o) {
            var me = this;
            me.o = o || $D;
            me.o.revt('keydown', $.key.kd);
            me.o.revt('keyup', $.key.ku);
            me.o.evt('keydown', $.key.kd);
            me.o.evt('keyup', $.key.ku);
            me.addKey = function (aKey, key, pressStat, cbFn) {
                var _f = function (e) {
                    var e = $.e.fix(e);
                    if (e.shiftKey) { $.key.stat[16] = 1; } else { $.key.stat[16] = 0; }
                    if (e.ctrlKey) { $.key.stat[17] = 1; } else { $.key.stat[17] = 0; }
                    if (e.altKey) { $.key.stat[18] = 1; } else { $.key.stat[18] = 0; }
                    if (e.code != key) { return; }
                    var _n = 1;
                    for (var i = 0; i < aKey.length; i++) { if (aKey[i] == key) { continue; }; _n = _n * $.key.stat[aKey[i]]; };
                    if (_n == 1) { cbFn(); }
                }
                me.o.evt(pressStat ? 'keydown' : 'keyup', _f);
            }
            return me;
        }
    };
    $.aCache={
        num:0,size:0, hash:[],
        get: function (s) { var _o = this.hash[s]; if (!_o||(_o.t+_o.e)<$.time()) { return null; }; return _o.d; },
        set:function(s,d,t){ var h=this.hash; if (!h[s]) { return -1; }; h[s].d = d; h[s].t = t; },
        push:function(s,d,e){ this.hash[s] = { d: d, t: $.time(), e: e * 1000 || 10000 }; this.size+=d.length; this.num++; },
        diff: function (s) { var h = this.hash; if (!h[s]) { return -1; }; var b = $.time() - h[s].t; if (b > h[s].e) { this.size -= h[s].d.length; this.num--; h[s] = null; return -1; }; return b;}
    };
    //IE10修正
    $.draw = function (req, option, cbFn) {
        var me = this;
        var p = req.p || $DB;
        var init = function () {
            var mc = p.adElm('', 'canvas').cn('pa').css($.box('0,0,0,0'));
            mc.height = 0; mc.width = 0;
            if (!mc.getContext) { mc = $W.G_vmlCanvasManager.initElement(mc); }//直接调用是excanvas在IE下支持动态建立canvas
            me.mc2d = mc.getContext("2d");
            mc.setPos = function (x, y, w, h) { this.dc('pa'); this.css($.box(x + ',' + y + ',' + w + ',' + h)); this.width = 0; this.height = 0; this.width = w; this.height = h; return this;};
            mc.beginPath = function () { me.mc2d.beginPath(); return this; };
            mc.stroke = function () { me.mc2d.stroke(); return this; };
            mc.mTo = function (x, y) { me.mc2d.moveTo(x, y); mc.nowX = x; mc.nowY = y; return this; };
            mc.lineStyle = function (w, c, lj) { me.mc2d.strokeStyle = c || "#000"; me.mc2d.lineWidth = w || 1; me.mc2d.lineJoin = lj || "round"; return this;};
            mc.lTo = function (x, y) { me.mc2d.lineTo(x, y); mc.nowX = x; mc.nowY = y; return this;};
            mc.dTo = function (x1, y1, dl, sl) {
                dl = dl || 2; sl = sl || 2;
                var x = x1 - this.nowX;
                var y = y1 - this.nowY;
                var h = $M.sqrt((x) * (x) + (y) * (y));
                var u = h / (dl + sl);
                var dashSpaceRatio = dl / (dl + sl);
                var dashX = (x / u) * dashSpaceRatio;
                var spaceX = (x / u) - dashX;
                var dashY = (y / u) * dashSpaceRatio;
                var spaceY = (y / u) - dashY;
                this.mTo(this.nowX, this.nowY);
                while (h > 0) {
                    this.nowX += dashX;
                    this.nowY += dashY;
                    h -= dl;
                    if (h < 0) { this.nowX = x1; this.nowY = y1; }
                    this.lTo(this.nowX, this.nowY);
                    this.nowX += spaceX;
                    this.nowY += spaceY;
                    this.mTo(this.nowX, this.nowY);
                    h -= sl;
                }
                this.mTo(x1, y1);
                return this;
            };
            mc.aTo = function (x, y, r, bs, es) { me.mc2d.arc(x, y, r, bs, es); return this;};
            mc.bTo = function (cx1, cy1, cx2, cy2, x, y) { me.mc2d.bezierCurveTo(cx1, cy1, cx2, cy2, x, y); mc.nowX = x; mc.nowY = y; return this;};
            mc.cTo = function (cx1, cy1, x, y) { me.mc2d.quadraticCurveTo(cx1, cy1, x, y); mc.nowX = x; mc.nowY = y; return this; };
            mc.fillStyle = function (col) { me.mc2d.fillStyle = col; return this;};
            mc.fill = function () { me.mc2d.fill(); return this; };
            mc.fillText = function (txt, x, y, maxW) { /*if(+$("").split(',')[1]<9) return this;*/me.mc2d.fillText(txt, x, y, maxW); return this;};
            mc.textStyle = function (font, align) { me.mc2d.font = font || '12px sans-serif'; return this; };
            mc.clearRect = function (x, y, w, h) { me.mc2d.clearRect(x, y, w, h); return this; };
            mc.clear = function () { me.mc2d.clearRect(0, 0, this.width, this.height); return this; };
            mc.save = function () { me.mc2d.save(); return this; };
            mc.restore = function () { me.mc2d.restore(); return this;};
            mc.drawImage = function (img, x, y) { me.mc2d.drawImage(img, x, y); return this; };
            mc.getImageData = function (x, y, w, h) { return me.mc2d.getImageData(x, y, w, h); }
            mc.drawRect = function (x, y, w, h, cr, col, ifPure, a) {
                var gradient = me.mc2d.createLinearGradient(0, 0, 0, h);
                gradient.addColorStop(0, 'rgba(255,255,255,' + (a || 1) + ')');
                gradient.addColorStop(1, col);
                me.mc2d.fillStyle = ifPure ? col : gradient;
                if (cr > 0) {
                    var _t1;
                    var _t2;
                    var _t3;
                    var _t4;
                    var _t5;
                    var _t6;
                    if (cr > $M.min(w, h) / 2) { cr = $M.min(w, h) / 2; }
                    _t1 = 7.853982E-001;
                    mc.beginPath();
                    mc.mTo(x + cr, y);
                    mc.lTo(x + w - cr, y);
                    _t2 = -1.570796E+000;
                    _t3 = x + w - cr + $M.cos(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t4 = y + cr + $M.sin(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t5 = x + w - cr + $M.cos(_t2 + _t1) * cr;
                    _t6 = y + cr + $M.sin(_t2 + _t1) * cr;
                    mc.cTo(_t3, _t4, _t5, _t6);
                    _t2 = _t2 + _t1;
                    _t3 = x + w - cr + $M.cos(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t4 = y + cr + $M.sin(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t5 = x + w - cr + $M.cos(_t2 + _t1) * cr;
                    _t6 = y + cr + $M.sin(_t2 + _t1) * cr;
                    mc.cTo(_t3, _t4, _t5, _t6);
                    mc.lTo(x + w, y + h - cr);
                    _t2 = _t2 + _t1;
                    _t3 = x + w - cr + $M.cos(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t4 = y + h - cr + $M.sin(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t5 = x + w - cr + $M.cos(_t2 + _t1) * cr;
                    _t6 = y + h - cr + $M.sin(_t2 + _t1) * cr;
                    mc.cTo(_t3, _t4, _t5, _t6);
                    _t2 = _t2 + _t1;
                    _t3 = x + w - cr + $M.cos(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t4 = y + h - cr + $M.sin(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t5 = x + w - cr + $M.cos(_t2 + _t1) * cr;
                    _t6 = y + h - cr + $M.sin(_t2 + _t1) * cr;
                    mc.cTo(_t3, _t4, _t5, _t6);
                    mc.lTo(x + cr, y + h);
                    _t2 = _t2 + _t1;
                    _t3 = x + cr + $M.cos(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t4 = y + h - cr + $M.sin(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t5 = x + cr + $M.cos(_t2 + _t1) * cr;
                    _t6 = y + h - cr + $M.sin(_t2 + _t1) * cr;
                    mc.cTo(_t3, _t4, _t5, _t6);
                    _t2 = _t2 + _t1;
                    _t3 = x + cr + $M.cos(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t4 = y + h - cr + $M.sin(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t5 = x + cr + $M.cos(_t2 + _t1) * cr;
                    _t6 = y + h - cr + $M.sin(_t2 + _t1) * cr;
                    mc.cTo(_t3, _t4, _t5, _t6);
                    mc.lTo(x, y + cr);
                    _t2 = _t2 + _t1;
                    _t3 = x + cr + $M.cos(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t4 = y + cr + $M.sin(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t5 = x + cr + $M.cos(_t2 + _t1) * cr;
                    _t6 = y + cr + $M.sin(_t2 + _t1) * cr;
                    mc.cTo(_t3, _t4, _t5, _t6);
                    _t2 = _t2 + _t1;
                    _t3 = x + cr + $M.cos(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t4 = y + cr + $M.sin(_t2 + _t1 / 2) * cr / $M.cos(_t1 / 2);
                    _t5 = x + cr + $M.cos(_t2 + _t1) * cr;
                    _t6 = y + cr + $M.sin(_t2 + _t1) * cr;
                    mc.cTo(_t3, _t4, _t5, _t6);
                    me.mc2d.fill();
                    mc.stroke();
                }else {
                    mc.beginPath().mTo(x, y).lTo(x + w, y).lTo(x + w, y + h).lTo(x, y + h).lTo(x, y).fill().stroke();
                }
                return this;
            };
            mc.beginPath().mTo(0, 0).stroke();
            me.mc = mc;
            return mc;
        }
        return init();
    };
    //if(isIE&&+$('').split(',')[1]>9) $W.isIE=false;
    //alert([isIE,+$('').split(',')[1]>9])
    //$W[_]=$;
    if (isIE) {
        try { $D.execCommand('BackgroundImageCache', false, true) } catch (e) { };
        if (+$('').split(',')[1] < 8) {
            var UserData = function (file_name) {
                if (!file_name) { file_name = "user_data_default"; }
                var dom = $D.createElement('input');
                dom.type = "hidden";
                dom.addBehavior("#default#userData");
                $DB.appendChild(dom);
                dom.save(file_name);
                this.file_name = file_name;
                this.dom = dom;
                return this;
            };
            UserData.prototype = {
                set: function (k, v) { this.dom.setAttribute(k, v); this.dom.save(this.file_name); },
                get: function (k) { this.dom.load(this.file_name); return this.dom.getAttribute(k); },
                remove: function (k) { this.dom.removeAttribute(k); this.dom.save(this.file_name); },
                clear: function () { this.dom.load(this.file_name); var now = new Date(); now = new Date(now.getTime() - 1); this.dom.expires = now.toUTCString(); this.dom.save(this.file_name); }
            };
            $.ls = UserData("rui10");
        }
    } else {
        HTMLElement.prototype.insertAdjacentElement = function (w, p) {
            switch (w) {
                case 'beforeBegin': return $(this.parentNode.insertBefore(p, this)); break;
                case 'afterBegin': return $(this.insertBefore(p, this.firstChild)); break;
                case 'beforeEnd': return $(this.appendChild(p)); break;
                case 'afterEnd': if (this.nextSibling) { return $(this.parentNode.insertBefore(p, this.nextSibling)); } else { return $(this.parentNode.appendChild(p)); }; break;
            };
        };
    }
    $.ext(_w, { $ajax: $.ajax, $Q: $.Q });
    $.ext(Number.prototype, _number);
    $.ext(String.prototype, _s);
    $.ext(Array.prototype, _a);
    $.ext(Date.prototype, _d);
    $.ext(Function.prototype, _f);
    $.ext($W, _w);
    $.ext($D, _x);
    $.ext($DB, _x);
    $.ext($.Q.prototype, _s);
    $.ext($.Q.prototype, _w);
    $.ext($.Q.prototype, _x);
    return $;
})();