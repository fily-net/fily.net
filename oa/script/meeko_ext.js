$.Util = {};
$.Util.ajax = function (args) {  //使用发送ajax请求来获取数据
    var _args = { url: 'meeko.aspx', args: '', data: '', dataType: 'text', ifCheckCookie: false, method: 'POST', onSuccess: function () { }, onError: function () { } };
    $.init(args, _args);
    if (!(args.ifCheckCookie ? $.session.check() : true)) { return; }
    var _onSuc = args.onSuccess, _onErr = args.onError;
    args.data = $.toArgsString(args.data || args.args) + '&clientkey=' + $.ck.get('SESSIONID') || '';
    args.onError = function (data) { _onErr({ data: data }); };
    args.onSuccess = function (data) {
        switch (args.dataType.toLow()) {
            case 'json':
            case 'text':
                var _responseText = data.replaceAll('\u0000', '&').replaceAll('"[', '[').replaceAll(']"', ']'), _dataAry = _responseText.split($.g.RESULT_S);
                if (_dataAry[0].toLow() == "errorinfo=0") {
                    _dataAry.shift();
                    _onSuc({ data: _dataAry, get: function (idx) { return _dataAry[idx]; } });
                } else {
                    _onErr({ data: data.split('=')[1] });
                }
                break;
            case 'jsonp':

                break;
            case 'html':
                _onSuc({ data: data });
                break;
        }
    };
    $.ajax(args);
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


$.Util.code = {
    intval: function (val) {
        var type = typeof (val);
        if (type == 'string') {
            val = val.replace(/[^0-9-.]/g, "");
            val = parseInt(val * 1, 10);
            return isNaN(val) || !isFinite(val) ? 0 : val
        }
        return type == 'number' && isFinite(val) ? Math.floor(val) : 0
    },
    code128: {
        encoding: ["11011001100", "11001101100", "11001100110", "10010011000", "10010001100", "10001001100", "10011001000", "10011000100", "10001100100", "11001001000", "11001000100", "11000100100", "10110011100", "10011011100", "10011001110", "10111001100", "10011101100", "10011100110", "11001110010", "11001011100", "11001001110", "11011100100", "11001110100", "11101101110", "11101001100", "11100101100", "11100100110", "11101100100", "11100110100", "11100110010", "11011011000", "11011000110", "11000110110", "10100011000", "10001011000", "10001000110", "10110001000", "10001101000", "10001100010", "11010001000", "11000101000", "11000100010", "10110111000", "10110001110", "10001101110", "10111011000", "10111000110", "10001110110", "11101110110", "11010001110", "11000101110", "11011101000", "11011100010", "11011101110", "11101011000", "11101000110", "11100010110", "11101101000", "11101100010", "11100011010", "11101111010", "11001000010", "11110001010", "10100110000", "10100001100", "10010110000", "10010000110", "10000101100", "10000100110", "10110010000", "10110000100", "10011010000", "10011000010", "10000110100", "10000110010", "11000010010", "11001010000", "11110111010", "11000010100", "10001111010", "10100111100", "10010111100", "10010011110", "10111100100", "10011110100", "10011110010", "11110100100", "11110010100", "11110010010", "11011011110", "11011110110", "11110110110", "10101111000", "10100011110", "10001011110", "10111101000", "10111100010", "11110101000", "11110100010", "10111011110", "10111101110", "11101011110", "11110101110", "11010000100", "11010010000", "11010011100", "11000111010"],
        getDigit: function (code) {
            var tableB = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
            var result = "";
            var sum = 0;
            var isum = 0;
            var i = 0;
            var j = 0;
            var value = 0;
            for (i = 0; i < code.length; i++) {
                if (tableB.indexOf(code.charAt(i)) == -1) return ("")
            }
            var tableCActivated = code.length > 1;
            var c = '';
            for (i = 0; i < 3 && i < code.length; i++) {
                c = code.charAt(i);
                tableCActivated &= c >= '0' && c <= '9'
            }
            sum = tableCActivated ? 105 : 104;
            result = this.encoding[sum];
            i = 0;
            while (i < code.length) {
                if (!tableCActivated) {
                    j = 0;
                    while ((i + j < code.length) && (code.charAt(i + j) >= '0') && (code.charAt(i + j) <= '9')) j++;
                    tableCActivated = (j > 5) || ((i + j - 1 == code.length) && (j > 3));
                    if (tableCActivated) {
                        result += this.encoding[99];
                        sum += ++isum * 99
                    }
                } else if ((i == code.length) || (code.charAt(i) < '0') || (code.charAt(i) > '9') || (code.charAt(i + 1) < '0') || (code.charAt(i + 1) > '9')) {
                    tableCActivated = false;
                    result += this.encoding[100];
                    sum += ++isum * 100
                }
                if (tableCActivated) {
                    value = $.Util.code.intval(code.charAt(i) + code.charAt(i + 1));
                    i += 2
                } else {
                    value = tableB.indexOf(code.charAt(i));
                    i += 1
                }
                result += this.encoding[value];
                sum += ++isum * value
            }
            result += this.encoding[sum % 103];
            result += this.encoding[106];
            result += "11";
            return (result)
        }
    },
    FullDate: function () {
        var _val = '', _now = new Date(), _h = _now.getHours(), _m = _now.getMinutes(), _s = _now.getSeconds();
        _h = _h < 10 ? ('0' + _h) : _h;
        _m = _m < 10 ? ('0' + _m) : _m;
        _s = _s < 10 ? ('0' + _s) : _s;
        _val = _now.date8() + _h + _m + _s;
        return _val;
    }
};

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