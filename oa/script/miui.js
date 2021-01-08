"use strict";
$.UI = {};
$.UI.EventHandler = {};
$.UI.SuperView = function (args) {
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB };
    function _default() {
        
    }
    function _layout() {
        
    }
    function _event() {

    }
    function _override() {

    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
};

$.UI.Select = function (args) {
    /* 
    { 
        type: "Select", 
        desc: "选择项组件, 分单选(Radio)和多选(CheckBox)", 
        args: { 
            name: { desc: '在Select组中唯一标识的名称', defVal: '', dataType:'string' },
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            enabled: { desc: '是否启用', defVal: true, dataType: 'bool' },
            checked: { desc: '是否选中', defVal: false, dataType: 'bool' },
            type: { desc: 'Select类型: CheckBox, Radio', defVal: 'CheckBox', dataType: 'string', comType: 'Radios', sons: [{ value: 'CheckBox', text: 'CheckBox' },{ value: 'Radio', text: 'Radio' }] },
            text: { desc: '显示文本', defVal:'', dataType: 'string' },
            value: { desc: '真正的Value值', defVal: '', dataType: 'string' },
            cn: { desc:'Select结构最外一层的类名(Class-Name)',defVal: '', dataType: 'string' },
            css: { desc:'Select结构最外一层的样式(Style)',defVal: '', dataType: 'string' },
            onCheck:{ desc: '回调选中事件', defVal: function (){}, dataType: 'function' },
            onClick:{ desc: '回调单机事件', defVal: function (){}, dataType: 'function' }
        } 
    } 
    */
    var me = this, owner, _fn = function () { };
    var eText, eImg, eCheck;
    var _args = { p: $DB, name: 'select', enabled: true, cn: '', css: '', type: 'CheckBox', text: '', value: '', checked: false, onCheck: _fn, onClick: _fn };
    function _default() { if (args.type != 'CheckBox' && args.type != 'Radio') { args.type = 'CheckBox'; }; }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('Select ' + args.type + ' ' + args.cn).css(args.css).h('<a><span class="normal"></span></a><span></span>');
        owner.onselectstart = function () { return false }
        eCheck = owner.fc(); eText = eCheck.ns(); eImg = eCheck.fc();
        me.setEnabled(args.enabled);
        me.setText(args.text);
        me.setValue(args.value);
        if (args.checked) { me.setChecked(args.checked); }
    }
    function _event() {
        owner.evt('mousedown', function (e) {
            var e = $.e.fix(e), _e = e.t; e.stop();
            eCheck.dc('select-checked select-normal select-disabled').ac('select-focus');
        }).evt('mouseup', function (e) {
            var e = $.e.fix(e), _e = e.t; e.stop();
            if (!me.getEnabled()) { return; }
            if (args.type == 'CheckBox') { me.setChecked(!me.getChecked()); }
            args.onClick(me);
        });
    }
    me.getText = function () { return args.text; }
    me.setText = function (v) { eText.h(v); args.text = v; return me; }
    me.getValue = function () { return args.value; }
    me.setValue = function (v) { args.value = v; return me; }
    me.getEnabled = function () { return args.enabled; }
    me.setEnabled = function (v) {
        if (v == null) { v = true; }
        if (v) { eImg.dc('select-disabled').ac('select-normal'); } else { eImg.dc('select-normal').ac('select-disabled'); }
        eCheck.dc('select-focus select-checked');
        args.enabled = v;
    }
    me.getChecked = function () { return args.checked; }
    me.setChecked = function (v, ifExec) {
        if (!args.enabled) { return; }
        if (v == null) { v = true; }
        if (v) { eImg.dc('select-normal').ac('select-checked'); } else { eImg.dc('select-checked').ac('select-normal'); }
        eCheck.dc('select-focus select-disabled');
        args.checked = v;
        if (ifExec != false) { args.onCheck({ Self: me, IfChecked: v, Type: args.type, Text: args.text, Value: args.value }); }
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
};

$.UI.RoleSelector = function (args) {
    /* 
    { 
        type: "RoleSelector", 
        desc: "用户选择组件", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            ids: { desc: '当前角色的id数组集合', defVal: [], dataType:'array' },
            uids: { desc: '当前角色的角色名数组集合', defVal: [], dataType: 'array' }
        }
    } 
    */
    var me = this, _fn = function () { };
    var _args = { p: $DB, ids: [], pid: 3, whereSql: null };
    var owner, roles = [], ids = [], rids = [], _selAll;
    function _default() { ids = args.ids; }
    function _layout() { owner = args.p.adElm('', 'div'); loadRoles(owner); }
    function _event() { };
    function loadRoles(p) {
        var _wSql = args.whereSql || '';
        if (!_wSql) { _wSql = '{"pid": ' + args.pid + '}'; }
        $.Util.ajax({
            args: 'm=SYS_CM_USERS&action=getAllDepts&dataType=json&keyFields=id as value,nodeName as text&jsonCondition=' + _wSql,
            onSuccess: function (obj) {
                var _dAry = eval(obj.get(0) || '[]');
                p.h(''); roles = [];
                _selAll = new $.UI.Select({ p: p, text: '全选', value: 0, type: 'CheckBox', cn: 'ml3', onCheck: onAllCheck })
                for (var i = 0, _dLen = _dAry.length; i < _dLen; i++) {
                    var _d = _dAry[i]; _d.p = p; _d.type = 'CheckBox'; _d.cn = 'ml3'; _d.onCheck = onAllCheck;
                    roles.push(new $.UI.Select(_d));
                }
                me.setRoles(ids);
            }
        });
    }
    function onAllCheck(obj) {
        var _ifChecked = obj.IfChecked;
        if (+obj.Value) {
            if (_ifChecked) { ids.push(obj.Value); rids.push(obj.Text); } else { ids.re(obj.Value); rids.re(obj.Text); }
        } else {
            ids = []; rids = [];
            for (var i = 0, _len = roles.length; i < _len; i++) {
                var _r = roles[i]; _r.setChecked(_ifChecked, false);
                if (_ifChecked) { ids.push(_r.getValue()); rids.push(_r.getText()); }
            }
        }
    }
    me.setRoles = function (roleids) {
        var _ids = {}, _count = 0, _rLen = roles.length;
        ids = []; rids = [];
        for (var i = 0, _len = roleids.length; i < _len; i++) { if (roleids[i]) { _ids[roleids[i]] = true; } }
        for (var i = 0; i < _rLen; i++) {
            var _r = roles[i], _val = _r.getValue();
            if (_ids[_val]) { _r.setChecked(true); _count++ } else { _r.setChecked(false); }
        }
        if (!_selAll) { return; }
        if (_count && _count == _rLen) { _selAll.setChecked(true, false); } else { _selAll.setChecked(false, false); }
    }
    me.getRoles = function () { return [ids, rids]; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.SingleUserSelector = function (args) {
    var me = this, _fn = function () { };
    var _args = { p: $DB, id: null, onSelect: _fn };
    var owner, currA;
    var _tHtml = '<div class="fl wp ha"></div><div class="SingleUserPanel"></div>';
    var _iAry = [
        { name: 'letter', text: '按字母', icon: 'icon-glyph-font', content: _tHtml },
        { name: 'dept', text: '按部门', icon: 'icon-glyph-inbox', content: _tHtml }
    ];
    var _letAry = ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], _LBtnAry = [];
    function _default() { for (var i = 0, _lLen = _letAry.length; i < _lLen; i++) { var _l = _letAry[i]; _LBtnAry.push({ name: _l, text: _l, type: 'tab' }); };}
    function _layout() {
        owner = new $.UI.Tab({ p: args.p, items: _iAry, ifFixedBodyHeight: false });
        var _eLet = owner.items['letter'].Body, _eDept = owner.items['dept'].Body;
        var _eLBtn = _eLet.fc(), _eLUser = _eLBtn.ns();
        var _eDBtn = _eDept.fc(), _eDUser = _eDBtn.ns();
        loadBtn(_eLBtn, _eLUser, _LBtnAry, 'letter'); loadDept(_eDBtn, _eDUser);
    }
    function _event() {

    }
    function loadDept(_eDBtn, _eDUser) {
        $.Util.ajax({
            args: 'm=SYS_CM_USERS&action=getAllDepts&keyFields=id as name,nodeName as text,uids as uids, \'tab\' as type&dataType=json',
            onSuccess: function (data) {
                var _dAry = eval(data.get(0) || '[]');
                loadBtn(_eDBtn, _eDUser, _dAry, 'dept');
            }
        });
    }
    function loadBtn(_eBtn, _eUser, _items, _tab) {
        var _bs = new $.UI.ButtonSet({ p: _eBtn, items: _items, itemSkin: 'Button-letter', onClick: function (obj) { onBtnClick(obj, _eUser, _tab); } });
        if (_tab == 'letter') { _bs.fireClick(0); }
    }
    function onBtnClick(obj, eUser, tab) {
        var _name = obj.Name, _args = 'm=SYS_CM_USERS&action=getUsersNoPaging&keyFields=id,uid&dataType=json', _sWhere = '';
        if (isNaN(+_name)) {
            if (_name == 'selAll') {
                var _tAry, _ifCheck = obj.Button.get('ifPress');
                if (tab == 'dept') { _tAry = _uDept; } else { _tAry = _uLetter; }
                for (var _u = 0, _uLen = _tAry.length; _u < _uLen; _u++) { _tAry[_u].setChecked(_ifCheck); }
                return;
            }
            if (_name != 'ALL') { _sWhere = '&jsonCondition={"pinYin":"' + _name + '"}'; }
        } else {
            _sWhere = '&jsonCondition={"id,in":"0' + obj.Button.get('uids') + '0"}';
        }
        $.Util.ajax({
            args: _args += _sWhere,
            onSuccess: function (data) {
                var _dAry = eval(data.get(0) || '[]'), _dLen = _dAry.length, _u, _eU;
                eUser.h('');
                for (var i = 0; i < _dLen; i++) {
                    _u = _dAry[i];
                    _eU = eUser.adElm('', 'A').h(_u.uid).attr('v', _u.id).attr('t', _u.uid);
                    _eU.evt('click', function (e) {
                        var e = $.e.fix(e), _e = e.t;
                        if (currA == _e) { return; }
                        if (currA) { currA.dc('sel'); }
                        currA = _e; _e.ac('sel');
                        args.id = _e.attr('v');
                        args.onSelect({ Self: me, Value: _e.attr('v'), Text: _e.attr('t') });
                        e.stop();
                    });
                    if (args.id && +args.id == +_u.id) {
                        if (currA) { currA.dc('sel'); }
                        currA = _eU; _eU.ac('sel');
                        args.onSelect({ Self: me, Value: _u.id, Text: _u.uid });
                    }
                }
            }
        });
    }
    me.getUser = function () { return args.id; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.ColorSelector = function (args) {
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, value: '#76f317', onChange: _fn };
    var eventListeners = [], rgb, hsv;
    var preP, inputP, allP, allColorImg, allSelectorImg, satP, satValImg, crossImg;
    function _default() {
        myAddEventListener(window, 'unload', cleanupEventListeners);
        owner = args.p.adElm('', 'div').cn('ColorSelector');
        owner.h('<div class="scolor1"><img class="img1" src="images/color/sv.png" /><img class="img2" src="images/color/crosshairs.png" /></div><div class="scolor2"><img class="img1" src="images/color/h.png" /><img class="img2" src="images/color/position.png" /></div><div class="scolor3"><span></span><input type="text" class="color-value" value="#FFFF00" /></div>');
        satP = owner.fc(); satValImg = satP.fc(); crossImg = satValImg.ns();
        allP = satP.ns(); allColorImg = allP.fc(); allSelectorImg = allColorImg.ns();
        preP = allP.ns().fc(); inputP = preP.ns();
        trackDrag(satP, satValDragged); trackDrag(allP, allDragged);
        me.setValue(args.value);
    }
    function _layout() {

    }
    function _event() {

    }
    function _override() {

    }
    function colorChanged() {
        var hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        var hueRgb = hsvToRgb(hsv.h, 1, 1);
        var hueHex = rgbToHex(hueRgb.r, hueRgb.g, hueRgb.b);
        preP.css('background-color:' + hex + ';');
        inputP.value = hex;
        satP.css('background-color:' + hex + ';');
        crossImg.css('left:' + ((hsv.v * 199) - 10).toString() + 'px;top:' + (((1 - hsv.s) * 199) - 10).toString() + 'px;');
        allSelectorImg.css('top:' + ((hsv.h * 199) - 5).toString() + 'px;');
        args.onChange({ ColorSelector: me, value: hex });
    }
    function rgbChanged() { hsv = rgbToHsv(rgb.r, rgb.g, rgb.b); colorChanged(); }
    function hsvChanged() { rgb = hsvToRgb(hsv.h, hsv.s, hsv.v); colorChanged(); }
    function satValDragged(x, y) { hsv.s = 1 - (y / 199); hsv.v = (x / 199); hsvChanged(); }
    function allDragged(x, y) { hsv.h = y / 199; hsvChanged(); }
    me.setValue = function (value) { rgb = hexToRgb(value, { r: 0, g: 0, b: 0 }); rgbChanged(); }
    function hexToRgb(hex_string, default_) {
        if (default_ == undefined) { default_ = null; };
        if (hex_string.substr(0, 1) == '#') { hex_string = hex_string.substr(1); };
        var r, g, b;
        if (hex_string.length == 3) {
            r = hex_string.substr(0, 1); r += r;
            g = hex_string.substr(1, 1); g += g;
            b = hex_string.substr(2, 1); b += b;
        }
        else if (hex_string.length == 6) {
            r = hex_string.substr(0, 2);
            g = hex_string.substr(2, 2);
            b = hex_string.substr(4, 2);
        }
        else {
            return default_;
        }
        r = parseInt(r, 16); g = parseInt(g, 16); b = parseInt(b, 16);
        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return default_;
        }
        else {
            return { r: r / 255, g: g / 255, b: b / 255 };
        }
    }

    function rgbToHex(r, g, b, includeHash) {
        if (includeHash == undefined) { includeHash = true; }
        r = Math.round(r * 255).toString(16);
        g = Math.round(g * 255).toString(16);
        b = Math.round(b * 255).toString(16);
        if (r.length == 1) { r = '0' + r; }
        if (g.length == 1) { g = '0' + g; }
        if (b.length == 1) { b = '0' + b; }
        return ((includeHash ? '#' : '') + r + g + b).toUpperCase();
    }

    function hsvToRgb(hue, saturation, value) {
        var red, green, blue;
        if (value == 0.0) {
            red = 0; green = 0; blue = 0;
        } else {
            var i = Math.floor(hue * 6);
            var f = (hue * 6) - i;
            var p = value * (1 - saturation);
            var q = value * (1 - (saturation * f));
            var t = value * (1 - (saturation * (1 - f)));
            switch (i) {
                case 1: red = q; green = value; blue = p; break;
                case 2: red = p; green = value; blue = t; break;
                case 3: red = p; green = q; blue = value; break;
                case 4: red = t; green = p; blue = value; break;
                case 5: red = value; green = p; blue = q; break;
                case 6: // fall through
                case 0: red = value; green = t; blue = p; break;
            }
        }
        return { r: red, g: green, b: blue };
    }

    function rgbToHsv(red, green, blue) {
        var max = Math.max(Math.max(red, green), blue);
        var min = Math.min(Math.min(red, green), blue);
        var hue;
        var saturation;
        var value = max;
        if (min == max) {
            hue = 0; saturation = 0;
        } else {
            var delta = (max - min);
            saturation = delta / max;
            if (red == max) {
                hue = (green - blue) / delta;
            }
            else if (green == max) {
                hue = 2 + ((blue - red) / delta);
            }
            else {
                hue = 4 + ((red - green) / delta);
            }
            hue /= 6;
            if (hue < 0) { hue += 1; }
            if (hue > 1) { hue -= 1; }
        }
        return { h: hue, s: saturation, v: value };
    }

    function fixPNG(myImage) {
        var arVersion = navigator.appVersion.split("MSIE");
        var version = parseFloat(arVersion[1]);
        if ((version >= 5.5) && (version < 7) && (document.body.filters)) {
            var _css = myImage.style.cssText + ';fontSize:0;width:' + myImage.width.toString() + 'px;height:' + myImage.height.toString() + 'px;display:inline-block'
            return $DB.adElm(myImage.id, 'span').cn(myImage.className).attr('title', myImage.title).css().attr('filter', "progid:DXImageTransform.Microsoft.AlphaImageLoader"
                                        + "(src=\'" + myImage.src + "\', sizingMethod='scale')");
        }
        else {
            return myImage.cloneNode(false);
        }
    }

    function pageCoords(node) {
        var x = node.offsetLeft;
        var y = node.offsetTop;
        var parent = node.offsetParent;
        while (parent != null) {
            x += parent.offsetLeft;
            y += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return { x: x, y: y };
    }

    function trackDrag(node, handler) {
        function fixCoords(x, y) {
            var nodePageCoords = pageCoords(node);
            x = (x - nodePageCoords.x) + document.documentElement.scrollLeft;
            y = (y - nodePageCoords.y) + document.documentElement.scrollTop;
            if (x < 0) x = 0;
            if (y < 0) y = 0;
            if (x > node.offsetWidth - 1) x = node.offsetWidth - 1;
            if (y > node.offsetHeight - 1) y = node.offsetHeight - 1;
            return { x: x, y: y };
        }
        function mouseDown(ev) {
            var coords = fixCoords(ev.clientX, ev.clientY);
            var lastX = coords.x;
            var lastY = coords.y;
            handler(coords.x, coords.y);

            function moveHandler(ev) {
                var coords = fixCoords(ev.clientX, ev.clientY);
                if (coords.x != lastX || coords.y != lastY) {
                    lastX = coords.x;
                    lastY = coords.y;
                    handler(coords.x, coords.y);
                }
            }
            function upHandler(ev) {
                myRemoveEventListener(document, 'mouseup', upHandler);
                myRemoveEventListener(document, 'mousemove', moveHandler);
                myAddEventListener(node, 'mousedown', mouseDown);
            }
            myAddEventListener(document, 'mouseup', upHandler);
            myAddEventListener(document, 'mousemove', moveHandler);
            myRemoveEventListener(node, 'mousedown', mouseDown);
            if (ev.preventDefault) ev.preventDefault();
        }
        myAddEventListener(node, 'mousedown', mouseDown);
        node.onmousedown = function (e) { return false; };
        node.onselectstart = function (e) { return false; };
        node.ondragstart = function (e) { return false; };
    }
    function findEventListener(node, event, handler) {
        var i;
        for (i in eventListeners) {
            if (eventListeners[i].node == node && eventListeners[i].event == event
         && eventListeners[i].handler == handler) {
                return i;
            }
        }
        return null;
    }
    function myAddEventListener(node, event, handler) {
        if (findEventListener(node, event, handler) != null) {
            return;
        }

        if (!node.addEventListener) {
            node.attachEvent('on' + event, handler);
        }
        else {
            node.addEventListener(event, handler, false);
        }

        eventListeners.push({ node: node, event: event, handler: handler });
    }

    function removeEventListenerIndex(index) {
        var eventListener = eventListeners[index];
        delete eventListeners[index];

        if (!eventListener.node.removeEventListener) {
            eventListener.node.detachEvent('on' + eventListener.event,
                                       eventListener.handler);
        }
        else {
            eventListener.node.removeEventListener(eventListener.event,
                                               eventListener.handler, false);
        }
    }

    function myRemoveEventListener(node, event, handler) {
        removeEventListenerIndex(findEventListener(node, event, handler));
    }

    function cleanupEventListeners() {
        var i;
        for (i = eventListeners.length; i > 0; i--) {
            if (eventListeners[i] != undefined) {
                removeEventListenerIndex(i);
            }
        }
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}

$.UI.UserSelector = function (args) {
    /* 
    {
        type: "UserSelector", 
        desc: "用户选择组件", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            ids: { desc: '当前用户的id数组集合', defVal: [], dataType:'array' }
        } 
    }
    */
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, ids: [] };
    var _tHtml = '<div class="fl wp ha"></div><div class="fl wp ha"></div>';
    var _iAry = [
        { name: 'letter', text: '按字母', icon: 'icon-glyph-font', content: _tHtml },
        { name: 'dept', text: '按部门', icon: 'icon-glyph-inbox', content: _tHtml }
    ];
    var _letAry = ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var _LBtnAry = [], users = [], currBtnSet, ids = [], uids = [], _uLetter = [], _uDept = [];
    function _default() {
        for (var i = 0, _lLen = _letAry.length; i < _lLen; i++) { var _l = _letAry[i]; _LBtnAry.push({ name: _l, text: _l, type: 'tab' }); }
        _LBtnAry.push({ name: 'selAll', text: '全选', type: 'toggle' });
    }
    function _layout() {
        owner = new $.UI.Tab({ p: args.p, items: _iAry, ifFixedBodyHeight: false });
        var _eLet = owner.items['letter'].Body, _eDept = owner.items['dept'].Body;
        var _eLBtn = _eLet.fc(), _eLUser = _eLBtn.ns();
        var _eDBtn = _eDept.fc(), _eDUser = _eDBtn.ns();
        loadBtn(_eLBtn, _eLUser, _LBtnAry, 'letter'); loadDept(_eDBtn, _eDUser);
    }
    function _event() {

    }
    function loadDept(_eDBtn, _eDUser) {
        $.Util.ajax({
            args: 'm=SYS_CM_USERS&action=getAllDepts&keyFields=id as name,nodeName as text,uids as uids, \'tab\' as type&dataType=json',
            onSuccess: function (data) {
                var _dAry = eval(data.get(0) || '[]');
                _dAry.push({ name: 'selAll', text: '全选', type: 'toggle' });
                loadBtn(_eDBtn, _eDUser, _dAry, 'dept');
            }
        });
    }
    function loadBtn(_eBtn, _eUser, _items, _tab) {
        var _bs = new $.UI.ButtonGroup({ p: _eBtn, items: _items, itemSkin: 'Button-letter', onClick: function (obj) { onBtnClick(obj, _eUser, _tab); } });
        if (_tab == 'letter') { _bs.fireClick(0); }
    }
    function onBtnClick(obj, eUser, tab) {
        var _name = obj.Name, _args = 'm=SYS_CM_USERS&action=getUsersNoPaging&keyFields=id,uid&dataType=json', _sWhere = '';
        if (isNaN(+_name)) {
            if (_name == 'selAll') {
                var _tAry, _ifCheck = obj.Button.get('ifPress');
                if (tab == 'dept') { _tAry = _uDept; } else { _tAry = _uLetter; }
                for (var _u = 0, _uLen = _tAry.length; _u < _uLen; _u++) { _tAry[_u].setChecked(_ifCheck); }
                return;
            }
            if (_name != 'ALL') { _sWhere = '&jsonCondition={"pinYin":"' + _name + '"}'; }
        } else {
            _sWhere = '&jsonCondition={"id,in":"0' + obj.Button.get('uids') + '0"}';
        }
        $.Util.ajax({
            args: _args += _sWhere,
            onSuccess: function (data) {
                var _dAry = eval(data.get(0) || '[]'), _dLen = _dAry.length;
                users = []; eUser.h(''); currBtnSet = obj.ButtonSet;
                for (var i = 0; i < _dLen; i++) {
                    var _user = _dAry[i];
                    users.push(new $.UI.Select({ p: eUser, type: 'CheckBox', cn: 'ml3', css: 'min-width:75px;', text: _user.uid, value: _user.id, onCheck: onCheckBoxClick }));
                }
                if (tab == 'dept') { _uDept = users; } else { _uLetter = users; }
                me.setUsers(ids);
            }
        });
    }
    function onCheckBoxClick(o) {
        var _check = o.IfChecked, _cId = o.Value, _cUid = o.Text;
        if (_check) { ids.push(_cId); uids.push(_cUid); } else { ids.re(_cId); uids.re(_cUid); }
    }
    me.setUsers = function (ids) {
        var _ids = {}, _count = 0, _uLen = users.length;
        for (var i = 0, _len = ids.length; i < _len; i++) { if (ids[i]) { _ids[ids[i]] = true; } }
        for (var l = 0; l < _uLen; l++) {
            var _u = users[l], _val = +_u.getValue();
            if (_ids[_val]) { _u.setChecked(true); _count++ } else { _u.setChecked(false); }
        }
        if (!currBtnSet) { return me; }
        if (_count && _count == _uLen) { currBtnSet.setChecked('selAll', true); } else { currBtnSet.setChecked('selAll', false); }
    }
    me.getUsers = function () { return [ids, uids]; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.KeyPanel = function (args) {
    /* 
    { 
        type: "KeyPanel", 
        desc: "键盘面板", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            keys: { desc: '键值', defVal: '1,2,3,C,4,5,6,←,7,8,9,-,0,.', dataType:'string' },
            disabledKeys: { desc: '不启用的键', defVal: '', dataType: 'DOM' },
            onKeyClick: { desc: '回调每个键的Click事件', defVal: function (){}, dataType: 'function' }
        } 
    } 
    */
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, keys: '1,2,3,C,4,5,6,←,7,8,9,-,0,.', disabledKeys: '', onKeyClick: _fn };
    function _default() {}
    function _layout() {
        owner = args.p.adElm('', 'div').cn('KeyPanel');
        owner.appendChild(toHtml());
        owner.evt('mousedown', function (e) { var e = $.e.fix(e), _e = e.t; e.stop(); if (!_e.attr('title')) { args.onKeyClick({ KeyPanel: me, _e: _e }); } });
        owner.onselectstart = function () { return false; }
    }
    function _event() {}
    function toHtml() {
        var aNum = args.keys.split(','), _nNum = $.m.p(Math.sqrt(aNum.length) + 1);
        var sObj = {}, _dKeys = args.disabledKeys.split(',');
        for (var i = 0, _len = _dKeys.length; i < _len; i++) { sObj[_dKeys[i]] = 1; }
        var _w = args.p.csn('width') / _nNum - 10, _h = args.p.csn('height') / _nNum - 5;
        var fg = $Fg(), _css = 'height:{0}px;line-height:{0}px;width:{1}px;';
        aNum.ec(function (i) {
            var _v = this[i];
            var _key = fg.adElm('', 'a').h(_v).css(_css.format(_h, _w));
            if (sObj[_v]) { _key.ac('disabled').attr('title', 'disabled'); }
        });
        return fg;
    }
    me.resize = function () { owner.h('').appendChild(toHtml()); return me; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.FormItem = function (args) {
    var me = this, owner, evtHandler, eInput, eHead, eBody, _f = function () { };
    var _args = _getArgs(args.comType);
    me.next = null; me.pre = null;
    function _default() { args.self = me; me.type = args.comType; me.name = args.name; }
    function _layout() {
        var _h = _getHtml(args), _p = args.p, _domType = 'div';
        var _idx = (args.index == null ? -1 : args.index);
        switch (_idx) {
            case -1:
                owner = _p.adElm('', _domType);
                break;
            case 0:
                owner = _p.abElm('', _domType);
                break;
            default:
                var _et = _p.chn(_idx);
                if (_et) { owner = _et.bbElm('', _domType); } else { owner = _p.adElm('', _domType); }
        }
        owner.cn('FormItem ' + args.cn).css(args.css).h(_h); args.owner = owner;
        evtHandler = new $.UI.EventHandler.FormItem(args);
        eHead = args.eHead; eBody = args.eBody; eInput = args.eInput;
        me.setVisibled(args.visibled);
        me.setEnabled(args.enabled);
        setValue(args.value); setText(args.text);
        me.setTitle(args.title);
        me.setIfReq(args.req);
    }
    function _getArgs(type) {
        var _t = type || 'Input', _imgPath = $.g.getImgPath() + 'images/';
        var _aHeader = [{ text: 'id', name: 'id', type: 'attr' }, { text: 'nodeNode', name: 'nodeName', type: 'none'}];
        var _attrs = {
            AutoComplete: { ifAutoPopHeight: true, table: null, key: null, readonly: false, ifSpecial: true, onSelect: _f },
            Date: { popHeight: 200, popWidth: 220, titleSkin: 'arrow', arrowBBC: '#f5f6f7', ifLockDay: 0, ifHMS: 1, ifMark: true, readonly: true },
            EndDate: { popHeight: 200, popWidth: 220, titleSkin: 'arrow', arrowBBC: '#f5f6f7', ifLockDay: 0, ifHMS: 0, ifMark: true, matchItem: '', readonly: true, onMatchVal: _f, onKeyUp: _f },
            Timer: { noInput: true, popWidth: 250, popHeight: 165, ifAutoPopHeight: false },
            Label: { path: _imgPath, ifEdit: false, ifShowAll: false, size: 'fixed', type: 'text', value: '', suffix: 'png', title: null, splitChar: '/', imgWidth: 96, imgHeight: 96, readonly: true, noInput: true },
            NumUpDown: { ifFillZero: 0, step: 1, max: 100, min: 0, ifMark: true, ifLoop: false, readonly: true, onUpDown: _f },
            KeyInput: { popHeight: 150, keys: '-,←,C,.,0,1,2,3,4,5,6,7,8,9', ifMark: true, disabledKeys: '', readonly: true, onKeyClick: _f },
            PopTips: { src: '', popWidth: 320, popHeight: 240, ifMark: true, readonly: true, onClose: _f },
            FileUploader: { noInput: true, readonly: true, mId: 4, catelogId: 0, catelog: '', uploadApi: null, specialFiles: [], onClose: _f, onComplete: _f, onError: _f, onSuccess: _f },
            Input: { readonly: false },
            ScanCode: { readonly: true, type: 'BarCode', noInput: true },
            CheckBoxs: { sons: [], defValue: 0, itemCn: 'mt3', itemCss: '', readonly: false, noInput: true },
            Radios: { sons: [], defValue: 0, itemCn: 'mt3', itemCss: '', readonly: false, noInput: true },
            RichText: { keObj: {}, height: 250, width: 300, readonly: false},
            TextArea: { height: 60, width: 160, limit: 500, readonly: false },
            Search: { key: '', ifMark: true, readonly: false, onSearch: _f },
            Button: { text:'Btn', icon:'', type:'normal', name:'Btn', readonly: true, noInput: true, onClick: _f },
            ButtonSet: { items: [{ text: '提交', type: 'normal', name: 'button', icon: ''}], readonly: true, noInput: true, onClick: _f },
            RePwd: { readonly: false, sTips: '', ifMark: true, matchItem: '', onMatchVal: _f },
            Pwd: { readonly: false, ifMark: true, sTips: '' },
            Json: { readonly: false, noInput: true, ifEdit: false },
            IconSelector: { value: '', readonly: true, noInput: true },
            UserSelector: { value: '', readonly: true, noInput: true },
            SingleUserSelector: { value: '', readonly: true, noInput: true },
            Select: { ifAutoPopHeight: true, ifShowIcon: false, items: [], loadApi: '', textKey: 'nodeName', ifMark: true, valueKey: 'id', extFields: [], hidden: {}, ifSpecial: true, readonly: true, onSelect: _f },
            MultiSelect: { ifAutoPopHeight: true, items: [], loadApi:'', ifSpecial: true, readonly: true, noInput: true, onSelect: _f },
            Tree: {
                table: null, rootID: 0, ifSpecial: true, ifMark: true, readonly: true, style:'tree:nodeName',
                onListTDClickBefore: _f, onListCheckBoxClick: _f, onListTDClick: _f
            },
            TreeList: {
                dataSource: null, aHeader: _aHeader, hasHead: 0, style: 'abreast', ifSpecial: true, ifMark: true, 
                lockLevel: null, searchKey: null, key: '', ifCache: 1, readonly: true,
                onSelect: _f, onListTDClickBefore: _f, onListCheckBoxClick: _f, onListTDClick: _f
            },
            common: {
                p: $DB, popOwner: $DB, comType: 'Input', skin: '', isChange: false, alias: '',
                name: 'FormItem', title: '', defText: '', value: null, text: null, icon: '',
                width: 160, height: 16, css: '', cn: '', dyAttr: [],
                popWidth: null, popHeight: 200, dataType: 'string', labelAlign: 'right',   // Auto, left, center, right, top
                req: false, sReg: '', sOk: '', sErr: '', regTemplate: '',placeholder: '',
                ifEnterSubmit: false, ifSubmit: true, ifHead: true, ifFoot: false,
                group: null, enabled: true, visibled: true, onEnterSubmit: _f,
                onChange: _f, onCheck: _f, onClickBefore: _f, onClick: _f
            },
            event: { onKeyUp: _f, onKeyDown: _f, onFocus: _f, onBlur: _f, onEnterPress: _f }
        };
        var _c = _attrs.common, _e = _attrs.event, _s = _attrs[_t];
        if(!_s){ console.log('comType类型是' + _t + '的组件不存在!'); return; }
        return $.init(_s, _c), _s.noInput!=true ? $.init(_s, _e) : void (0), _s;
    }
    function _getHtml(m) {
        var _type = m.comType, _w = +m.width, _h = +m.height, _sBody = '', _sMark = '', _bcss = '';
        if (m.ifMark) { _sMark = '<div class="mark">{1}</div>'; _w -= 20; }
        var _sInput = '<input _comType="'+_type+'" autocomplete="off" name="' + m.name + '" placeholder="' + m.placeholder + '" class="input-normal" type="{0}" style="width:' + _w + 'px;height:' + _h + 'px;" />' + _sMark;
        var _markHtml = '<a title="' + _type + '" class="FI-' + _type + ' ' + m.icon + '"></a>';
        switch (_type) {
            case 'NumUpDown':
                var _numH = _h / 2 + 4;
                _sBody = _sInput.format('text', '<div class="FI-NumUpDown-Up"></div><div class="FI-NumUpDown-Down"></div>');
                break;
            case 'RichText':
            case 'TextArea':
                _sBody = '<textarea limit="' + m.limit + '" style="width:' + _w + 'px;height:' + _h + 'px;" class="input-normal"></textarea><span class="textarea-info"><em class="c_6">0</em>/<em>' + m.limit + '</em></span>';
                break;
            case 'Pwd':
            case 'RePwd':
                _sBody = _sInput.format('password', _markHtml);
                break;
            case 'Label':
                if (m.type == 'image') {
                    var _whCss = 'style="width:' + m.imgWidth + 'px;height:' + m.imgHeight + 'px;"', _mtips = '';
                    if (m.size == 'auto') { _whCss = ''; }
                    if (m.ifEdit) { _mtips = '单击图片可以上传图片'; }
                    _sBody = '<img MTips="' + _mtips + '" class="r5" onerror="javascript:this.src=\'images/avatar/default.jpg\'" src="images/avatar/default.jpg" ' + _whCss + ' >';
                }
                break;
            case 'IconSelector':
                _sBody = '<a class="icon-glyph-picture FI-IconSelector" title="单击可以重新选择图标"></a>';
                break;
            case 'UserSelector':
                _sBody = '<div class="MultiSelect-body" MTips="1"></div><a class="MultiSelect-user"></a>';
                break;
            case 'SingleUserSelector':
                _sBody = '<div class="MultiSelect-body" MTips="1"></div><a class="MultiSelect-user"></a>';
                break;
            case 'MultiSelect':
                _sBody = '<div class="MultiSelect-body" MTips="1"></div><a class="MultiSelect-select"></a>';
                break;
            case 'ScanCode':
            case 'Json':
                return '';
            case 'Timer':
                var _now = new Date(), _y = _now.getFullYear(), _m = _now.getMonth() + 1, _d = _now.getDate(), _hh = _now.getHours(), _mm = _now.getMinutes();
                if (_m < 10) { _m = '0' + _m; }
                if (_d < 10) { _d = '0' + _d; }
                var _currDate = m.lockDate || (_y + '-' + _m + '-' + _d);
                _sBody = '<span class="mutil_input set_time_hm input_l" value="' + _currDate + '">' + _currDate + '</span><span class="mutil_input set_time_hm" hh="' + _hh + '" mm="' + _mm + '"><input class="input_text set_time_h" pk="h" value="' + _hh + '" />：<input class="input_text set_time_m" pk="m" value="' + _mm + '"/></span>';
                break;
            default:
                if (m.noInput) { _sBody = ''; } else { if (m.iconText) { _markHtml = m.iconText; }; _sBody = _sInput.format('input', _markHtml); };
                break;
        }
        if (m.noInput && m.width) { _bcss = 'style="width:' + (m.width + 9) + 'px;"'; }
        var _html = '<div class="body" ' + _bcss + '>' + _sBody + '</div>';
        if (m.ifHead) { _html = '<div class="head"></div>' + _html; }
        if (m.ifFoot) { _html += '<div class="foot"><a></a><span></span></div>'; }
        return _html;
    }
    function _event() { }
    function setValue(v) {
        if (v == null) { return me; }
        args.value = v;
        if (eInput) { eInput.value = v; eInput.attr('_v', v); }
        if (!v) { v = args.defValue; }
        switch (me.type) {
            case 'Radios':
                for (var i = 0, _rLen = args.RadioAry.length; i < _rLen; i++) {
                    var _radio = args.RadioAry[i], _rVal = _radio.getValue();
                    if (_rVal == v || +_rVal == +v) { evtHandler.fireClickRadio(_radio, false); break; }
                }
                break;
            case 'CheckBox':
                var _sAry = v.split(',');
                for (var i = 0, _cLen = _sAry.length; i < _cLen; i++) {
                    var _sVal = _sAry[i];
                    if (_sVal) { args.CheckBoxs[_sVal].setChecked(true); }
                }
                break;
        }
        return me;
    }
    function setText(v) {
        if (v == null) { return me; }
        args.text = v;
        switch (me.type) {
            case 'Label':
                switch (args.type) {
                    case 'image':
                        var _eImg = eBody.fc();
                        if (v.indexOf('/') == -1 && v.indexOf('/') == -1) { v = 'images/avatar/' + v; }
                        _eImg.src = v;
                        _eImg.attr('alt', v);
                        break;
                    case 'text':
                        if (args.ifShowAll) { eBody.h('<div class="label">' + v + '</div>'); return me; }
                        if (v.len() > 20) {
                            var _sAry = v.split(args.splitChar);
                            for (var _s = 0, _sLen = _sAry.length; _s < _sLen; _s++) { _sAry[_s] = _sAry[_s] + '\n'; }
                            v = v.substr(0, 20).trim() + '...<span class="label-help" title="' + _sAry.join('') + '"></span>';
                        }
                        eBody.h('<div class="label">' + v + '</div>');
                        break;
                }
                break;
            case 'SingleUserSelector':
            case 'UserSelector':
            case 'MultiSelect':
                eBody.fc().h(v);
                break;
            case 'IconSelector':
                eBody.fc().cn(v + ' FI-IconSelector');
                break;
            case 'RichText':
                args.RichText.html(v);
                break;
            case 'Json':
                args.Json.load(v);
                break;
            case 'ScanCode':
                args.ScanCode.setValue(v);
                break;
            case 'FileUploader':
                args.instanceId = v;
                var _eFiles = args.eFiles; _eFiles.h('');
                $.Util.ajax({
                    args: { m: 'SYS_CM_FILES', action: 'getFilesByLink', link: v, dataType: 'json', jsonCondition: '{"type": 1}' },
                    onSuccess: function (obj) {
                        var _aVal = eval(obj.get(0) || '[]'), _aLen = _aVal.length;
                        for (var i = 0; i < _aLen; i++) {
                            var _fObj = _aVal[i], _fName = _fObj.nodeName, _txt = _fName;
                            if (_txt.length > 25) { _txt = _txt.substr(0, 25) + '...'; }
                            var _eFile = _eFiles.adElm('', 'a').h('<span class="download"></span><span MTips=' + _fName + '>' + _txt + '</span><span class="del" MTips="删除文件" fid="' + _fObj.id + '"></span>').attr('target', '_self').attr('href', 'Module/SYS_CM_FILES.aspx?action=downloadFile&id=' + _fObj.id);
                            $(_eFile.lastChild).evt('click', function (e) { var e = $.e.fix(e), _e = e.t; e.stop(); if (_e.tagName == 'SPAN' && _e.className == 'del') { me.delFile(_e); } });
                        }
                    }
                });
                break;
            case 'Radios':
                for (var i = 0, _rLen = args.RadioAry.length; i < _rLen; i++) {
                    var _radio = args.RadioAry[i], _rVal = _radio.getText();
                    if (_rVal == v || +_rVal == +v) { evtHandler.fireClickRadio(_radio, false); break; }
                }
                break;
            default:
                if (eInput) { eInput.value = v.toString(); }
                break;
        }
    }
    me.error = function (error) { VTips.setSkin('error').setText(error).setTarget(args.eBody, 'left'); return me; }
    me.focus = function () {
        if (me.type == 'RichText') { args.RichText.focus(); }
        if (eInput && !args.readonly) { eInput.focus(); } else { evtHandler.fireClick(); }
        return me;
    }
    me.blur = function () {
        if (me.type == 'RichText') { args.RichText.blur(); };
        if (eInput) { eInput.blur(); }
        return me;
    }
    me.select = function (start, end) {
        if (!eInput) { return me; }
        var _len = eInput.value.length;
        if (start == null) { start = 0 };
        if (end == null) { end = _len; }
        if (isIE) {
            var range = document.selection.createRange();
            range.moveStart('character', start);
            range.moveEnd('character', end);
            range.select();
        } else {
            eInput.selectionStart = start;
            eInput.selectionEnd = end;
        }
        return me;
    }
    me.check = function () { return evtHandler.checkItem(); }
    me.reset = function (b) {
        var _dT = args.defText;
        switch (me.type) {
            case 'RichText': me.setData(_dT, _dT); break;
            case 'Label': me.setData(_dT, _dT); break;
            case 'FileUploader': args.eFiles.h(''); args.text = ','; args.value = ','; break;
            case 'MultiSelect':
            case 'UserSelector': eBody.fc().h(','); break;
            case 'SingleUserSelector': eBody.fc().h(''); break;
            case 'Select': me.setValue(_dT); break;
            case 'Radios':
            case 'CheckBox': me.setValue(_dT); break;
            case 'ScanCode': args.ScanCode.setValue(_dT); break;
        }
        if (eInput) { eInput.dc('input-error input-ok input-disabled').ac('input-normal'); eInput.value = args.defText; }
        return me;
    }
    me.setTitle = function (v) { if (eHead) { var _v = v; if (v.length > 6) { v = v.substr(0, 4) + '<span class="help" _title="' + _v + '"></span>'; }; eHead.h(v).attr('title', _v);; } };
    me.setEnabled = function (v) {
        if (v != null && v == args.enabled) { return me; }
        args.enabled = v;
    }
    me.getEnabled = function () { return args.enabled; }
    me.getVisibled = function () { return args.visibled; }
    me.setVisibled = function (v) {
        if (v == null) { v = true; }
        if (v) { owner.show(); } else { owner.hide(); }
        args.visibled = v;
        return me;
    }
    me.setIfReq = function (v) {
        if (eHead) { if (v) { eHead.abElm('', 'span').cn('req').attr('title', '必填').h('*'); } else { eHead.dc('c_6').css(''); } }
        args.req = v;
    }
    me.delFile = function (_e) { MConfirm.setWidth(350).show('确定删除该文件?').evt('onOk', function () { args.value = args.value.replaceAll(_e.attr('fid') + ',', ''); _e.pn().r(); me.set('isChange', true); }); }
    me.setData = function (value, text, ifSetChange) {
        setValue(value); setText(text);
        if (ifSetChange != false) {
            if (args.readonly && eInput) {
                var _eDel = eBody.chn(2);
                if (!_eDel) { _eDel = eBody.adElm('', 'a').attr('title', '清空').cn('select-clear').evt('click', function () { setValue(''); setText(''); _eDel.hide(); }); }
                _eDel.show();
            }
            ifSetChange = true;
            args.onChange({ FormItem: me, Value: value, Text: text, Args: args, Name: args.name });
        }
        me.set('isChange', ifSetChange);
        return me;
    }
    me.getValue = function () {
        switch (me.type) {
            case 'RichText':
                return args.RichText.html().replaceAll('\\', '\\\\');
            case 'Json':
                return $.JSON.encode(args.Json.getValue());
            case 'Timer':
                var _eLast = $(eBody.lastChild);
                return _eLast.ps().attr('value') + ' ' + _eLast.attr('hh') + ':' + _eLast.attr('mm') + ':00';
            default:
                if (args.ifSpecial || !eInput) { return (args.value == null ? '' : args.value); } else { return eInput.value; }
        }
    }
    me.getText = function () {
        switch (me.type) {
            case 'RichText':
                return args.RichText.html().replaceAll('\\', '\\\\');
            case 'Json':
                return $.JSON.encode(args.Json.getValue());
            case 'Timer':
                var _eLast = $(eBody.lastChild);
                return _eLast.ps().value + ' ' + _eLast.attr('hh') + ':' + _eLast.attr('mm') + ':00';
            default:
                if (eInput) { return eInput.value; } else { return args.text || ''; }
        }
    }
    me.setValue = setValue; me.setText = setText;
    return $.extendView(this, args, _args).main(_default, _layout).setOwner(owner), this;
}

$.UI.EventHandler.BindInputClick = function (args){
    var _fcf = { 'EndDate': clickDate, 'Date': clickDate, 'KeyInput': clickKeyInput, 'PopTips': clickPopTips, 'Select': clickSelect, 'TreeList': clickTreeList, 'Tree': clickTree, 'AutoComplete': onAutoCompleteKeyUp };
    var eInput = args.eInput, _onValueChange = args.onValueChange||function (){}, _tips;
    function getPopTips() {
        var _w = args.popWidth||0, _h = args.popHeight||0, _whCss = '', _bW = eInput.pn().csn('width'), _pdArgs = { ifFixedHeight: false };
        if (_w) { _bW = _w; }
        if (_h) {
            if (args.ifAutoPopHeight) { _whCss += 'max-height:' + _h + 'px;overflow:hidden;'; } else { _pdArgs.ifFixedHeight = true; _whCss += 'height:' + _h + 'px;'; }
        } else {
            _whCss += 'height:auto;';
        }
        _whCss += 'width:' + (_bW - 2) + 'px;';
        _pdArgs.ePop = eInput; _pdArgs.css = _whCss; _pdArgs.arrowBBC = args.arrowBBC||'#FFF';
        return _tips = $.Dialog.get(_pdArgs).hide(), _tips;
    }
    function clickDate() { getPopTips().init({ type: 'Calendar', nowD: eInput.value }).evt('onClick', function (obj) { var _val = obj.Value; _setData(_val, _val); _tips.remove(); }).show(); }
    function clickKeyInput() {
        getPopTips().init({ type: 'KeyPanel' }).evt('onKeyClick', function (obj) {
            var _e = obj._e, _key = _e.h(), _val = eInput.value, _newVal;
            if (_e.tagName != 'A') { return; }
            switch (_key) {
                case '-':
                    if (_val.indexOf('-') != -1) { _newVal = _val.substring(1); } else { _newVal = '-' + _val; }
                    break;
                case '←':
                    _newVal = _val.substring(0, _val.length - 1); break;
                case 'C':
                    _newVal = ''; break;
                case '.':
                    if (_val.indexOf('.') != -1) { _key = ''; }
                    _newVal = _val + _key; break;
                default:
                    _newVal = _val + _key; break;
            }
            _setData(_newVal, _newVal);
        }).show();
    }
    function clickPopTips() {

    }
    function clickSelect() {
        if (!args.gtID && !args.loadApi && !args.items.length) { MTips.show('数据为空', 'warn'); return; }
        getPopTips().init({
            type: 'Menu', gtID: args.gtID, items: args.items, checkedValue: eInput.attr('_v'), loadApi: args.loadApi, textKey: args.textKey, valueKey: args.valueKey, extFields: args.extFields, hidden: args.hidden, ifShowIcon: args.ifShowIcon,
            onSuccess: function () { _tips.show(); },
            onLoadOver: function () { _tips.show(); },
            onClick: function (obj) { if (obj.Style) { eInput.css(obj.Style); }; _tips.hide(); _setData(obj.Value, obj.Text); args.self?args.self.set('MenuArgs', obj.Item.Args):void(0);  }
        });
    }
    function clickTreeList() {
        args.type = 'TreeList'; 
        args.onSuccess = function () { _tips.resize().show(); };
        args.onClick = function (obj) { _setData(obj.Value, obj.Text); _tips.hide(); };
        getPopTips().init(args).show();
    }
    function clickTree() {
        var _tlArgs = args;
        _tlArgs.type = 'List'; _tlArgs.cn = null; _tlArgs.css = null;
        _tlArgs.onSuccess = function () { _tips.resize().show(); };
        _tlArgs.onExpandNodeSuccess = function () { _tips.resize(); }
        _tlArgs.onTDClickBefore = function (obj) { return args.onListTDClickBefore(obj, self); }
        getPopTips().init(_tlArgs);
    }
    function onAutoCompleteKeyUp() {
        var _val = eInput.value;
        if (!args.key || !args.table || _val.length < 2) { return; }
        var _api = 'm=SYS_TABLE_BASE&table=' + args.table + '&action=likeQueryKey&key=' + args.key + '&value=' + _val + '&keyFields=id,' + args.key;
        getPopTips().init({
            type: 'Menu', loadApi: _api, textKey: args.key, valueKey: 'id', ifShowIcon: false,
            onSuccess: function () { _tips.show(); },
            onClick: function (obj) { _setData(obj.Text, obj.Text); _tips.hide(); }
        });
    }
    function _setData(value, text) { eInput.attr('_v', value); _onValueChange({ Value: value, Text: text, eInput: eInput }); }
    function _init (){ var _fn = _fcf[args.eInput.attr('_comType')]; _fn?_fn():void(0); };
    return _init(), this;
}

$.UI.EventHandler.FormItem = function (args) {
    var me = this, attr = {};
    var type, self, isNonN, popTips, _tips;
    var owner, eInput, eBody, eMark, eCheckIcon, eCheckText;
    var regTemplateObj = {
        'default': '^[a-zA-Z]{1,20}([a-zA-Z0-9]|[._]){1,20}$', //5-20个字符
        'normal': '^[a-zA-Z]{5,20}([a-zA-Z0-9]|[._]){5,19}$', //5-20个字符
        'email': '^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+',  //邮箱
        'integer': '^[0-9]*$',  //整数
        'decimal': '^\d*\.?\d{0,2}$',  //小数
        'chinese': '[\u4E00-\u9FA5\uf900-\ufa2d]',   //中文
        'string': '',
        'month': '',  //月份
        'ip': '^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$',  //IP
        'startNow': '\.\d{1,3}$',  //起始时间必须大于现在时间
        'price': '^(\d*\.\d{0,2}|\d+).*$',  //价格
        'IDCard': '^(\d{14}|\d{17})(\d|[xX])$',   //身份证     ^(\d{18,18}|\d{15,15}|\d{17,17}x)$
        'date': '^\d{4}-\d{1,2}-\d{1,2}$', //日期
        'link': '<a href=".+?">.+?<\/a>',  //链接
        'fullWidthChar': '[^\uFF00-\uFFFF]]',  //全角字符
        'EnglishAddress': '^[a-zA-Z][\.a-zA-Z\s,0-9]*?[a-zA-Z]+$',  //英文地址
        'username': '^[\u4E00-\u9FA5\uf900-\ufa2d\w]{4,16}$',  //用户名只 能用 中文、英文、数字、下划线、4-16个字符
        'mobileNumber': '^0*(13|15)\d{9}$',
        'phoneNumber': '^\d{3,4}-\d{7,8}(-\d{3,4})?$',
        'creditCard': '^[1-9][0-9]{3} [0-9]{4} [0-9]{4} [0-9]{4}$'   //信用卡
    };
    function _default(args) { owner = args.owner; type = args.comType; isNonN = args.noInput; self = args.self; }
    function _get_doms() {
        var _o = owner, _eH, _eB, _eF;
        if (!_o.fc()) { return {}; }
        if (args.ifHead) { _eH = _o.fc(); _eB = _eH.ns(); }
        if (args.ifFoot) { _eF = $(_o.lastChild); if (!_eB) { _eB = _eF.ps(); }; eCheckIcon = _eF.fc(); eCheckText = _eCI.ns(); }
        if (!_eB) { _eB = _o.fc(); }
        if (!isNonN) { eInput = _eB.fc(); eMark = eInput.ns(); }
        eBody = _eB;
        return { eHead: _eH, eBody: _eB, eFoot: _eF, eInput: eInput, eMark: eMark, eCheckIcon: eCheckIcon, eCheckText: eCheckText };
    }
    function _layout(){
        $.init(args, _get_doms());
        switch (type) {
            case 'IconSelector':
                eBody.fc().evt('click', function () {
                    popTips = new $.UI.Tips({ comMode: 'x-auto', width: 1024, height: 560, y: 100, head_h: 30, ifMask: true, ifClose: true, title: '图标选择器', icon: 'icon-glyph-picture' });
                    new $.UI.View({ p: popTips.body, url: 'View/meeko/IconSelector.js', onItemClick: function (obj) { var _val = obj.Value; self.setData(_val, _val); popTips.remove(); popTips = null; } });
                });
                break;
            case 'FileUploader':
                args.Button = new $.UI.Button({ p: eBody, text: '上传文件', css: 'margin-left: 0px;margin-top: 0px;', icon: 'icon-glyph-upload', onClick: onFileUploaderClick });
                args.eFiles = eBody.adElm('', 'div').cn('file-list');
                break;
            case 'TextArea':
                eInput.evt('focus', function (e) {
                    var e = $.e.fix(e), _e = e.t;
                    _e.ns().css('height:24px;'); _e.removeAttribute('readonly');
                }).evt('blur', function (e) {
                    var e = $.e.fix(e), _e = e.t;
                    _e.ns().css('height:0px;');
                }).evt('keyup', function (e) {
                    var e = $.e.fix(e), _e = e.t, _len = _e.value.length, _val = args.limit - _len;
                    if (_val < 0) { _e.attr('readonly', 'readonly'); e.preventDefault(); return false; }
                    _e.ns().fc().h(_val);
                }).evt('scroll', function (e) {
                    var e = $.e.fix(e), _e = e.t;
                    _e.css('height:' + (+_e.csn('height') + 30) + 'px;');
                });
                break;
            case 'Button':
            case 'ButtonSet':
                args.p = eBody;
                args.Button = new $.UI.Button(args);
                break;
            case 'ScanCode':
                args.ScanCode = new $.UI.BarCode({ p: owner });
                break;
            case 'Json':
                args.Json = new $.UI.Json({ p: owner, title: args.title, ifEdit: args.ifEdit, onClick: function (obj) { obj.FormItem = self; args.onClick(obj); } });
                break;
            case 'RichText':
                var _dArgs = {
                    resizeType: 1,
                    basePath: $.global.imgPath + 'script/kindEditor/',
                    allowPreviewEmoticons: false,
                    allowImageUpload: false,
                    afterChange: function (obj) { if (!args.RichText) { return; }; var _val = args.RichText.html(); self.set('isChange', true); args.onChange({ FormItem: self, Text: _val, Value: _val, Args: args, Name: args.name }); },
                    items: [
				        'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
				        'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist', 'insertunorderedlist', '|', 'emoticons', 'image', 'link'
                    ]
                };
                args.RichText = KindEditor.create(eInput, $.init(args.args||{}, _dArgs));
                break;
            case 'CheckBoxs':
                var _sons = args.sons, _len = _sons.length, _cbAry = [], _cb, _cbObj = {};
                for (var i = 0; i < _len; i++) {
                    var _obj = _sons[i];
                    if (args.itemCn) { _obj.cn = args.itemCn; }
                    if (args.itemCss) { _obj.css = args.itemCss; }
                    _obj.p = eBody;
                    _obj.type = 'CheckBox';
                    _obj.value = (_obj.value == null) ? i : _obj.value;
                    _obj.onClick = function (radio) { clickCheckBoxs(_cbAry); }
                    _cb = new $.UI.Select(_obj);
                    _cbObj[_obj.value] = _cb;
                    _cbAry.push(_cb);
                }
                args.CheckBoxAry = _cbAry; args.CheckBoxs = _cbObj;
                if (args.value) { clickCheckBoxs(_cbAry); }
                break;
            case 'Radios':
                var _sons = args.sons, _len = _sons.length, _radioAry = [], _radio, _cItem;
                for (var i = 0; i < _len; i++) {
                    var _obj = _sons[i], _ifc = _obj.checked;
                    if (args.itemCn) { _obj.cn = args.itemCn; }
                    if (args.itemCss) { _obj.css = args.itemCss; }
                    _obj.p = eBody;
                    _obj.type = 'Radio';
                    _obj.value = (_obj.value == null) ? i : _obj.value;
                    _obj.onClick = function (radio) { me.fireClickRadio(radio); }
                    _radio = new $.UI.Select(_obj);
                    if (_ifc) { _cItem = _radio; }
                    _radioAry.push(_radio);
                }
                args.RadioAry = _radioAry;
                me.fireClickRadio(_cItem);
                break;
            case 'SingleUserSelector':
                eBody.evt('click', function (e) {
                    var e = $.e.fix(e), _e = e.t;
                    if (_e.tagName != 'A') { return; }
                    if (args.onClickBefore({ Self: self }) == false) { return; }
                    popTips = new $.UI.Tips({ comMode: 'x-auto', width: 500, height: 400, y: 100, head_h: 30, ifMask: true, ifClose: true, title: '人员选择', icon: 'icon-glyph-user' });
                    popTips.SingleUserSelector = new $.UI.SingleUserSelector({ p: popTips.body, id: self.getValue(), onSelect: function (obj) { self.setData(obj.Value, obj.Text); } });
                    e.stop();
                });
                break;
            case 'UserSelector':
            case 'MultiSelect':
                eBody.evt('click', function (e) {
                    var e = $.e.fix(e), _e = e.t;
                    if (_e.tagName != 'A') { return; }
                    if (args.onClickBefore({ Self: self }) == false) { return; }
                    switch (_e.className.trim()) {
                        case 'MultiSelect-select':
                            _e.cn('MultiSelect-loading');
                            if (args.loadApi.indexOf('keyFields') == -1) { args.loadApi += '&keyFields=id,nodeName'; }
                            $.Util.ajax({
                                args: args.loadApi + '&dataType=json',
                                onSuccess: function (data) {
                                    var _dAry = eval(data.get(0) || '[]'), _dLen = _dAry.length, _allAry = [];
                                    if (!_dLen) { _e.cn('MultiSelect-select'); MTips.show('数据为空', 'error'); return; }
                                    var _tips = getPopTips(), _son, _vAry = self.getValue().split(','), _vLen = _vAry.length, _count = 0;
                                    args.JIDS = {}; args.IDS = []; args.TXTS = [];
                                    args.SelAll = _tips.init({ type: 'Select', cn: 'ml3', text: '全选', value: 'selAll', onCheck: function (obj) { clickMulitSelectCheckBox(obj, _allAry, _dLen); } }, true);
                                    for (var v = 0; v < _vLen; v++) { if (_vAry[v]) { args.JIDS[_vAry[v]] = true; } }
                                    for (var i = 0; i < _dLen; i++) {
                                        var _dObj = _dAry[i], _id = _dObj.id, _txt = _dObj.nodeName || _dObj.uid, _checked = false;
                                        if (args.JIDS[_id]) { _checked = true; args.IDS.push(_id); args.TXTS.push(_txt); _count++; }
                                        _allAry.push(_tips.init({ type: 'Select', cn: 'ml3', checked: _checked, text: _txt, value: _id, onCheck: function (obj) { clickMulitSelectCheckBox(obj, _allAry, _dLen); } }, true));
                                    }
                                    if (_count == _dLen) { args.SelAll.setChecked(true, false); }
                                    _e.cn('MultiSelect-select');
                                    _tips.show();
                                }
                            });
                            break;
                        case 'MultiSelect-user':
                            popTips = new $.UI.Tips({
                                comMode: 'x-auto',
                                width: 500,
                                height: 400,
                                y: 100,
                                head_h: 30,
                                ifMask: true,
                                ifClose: true,
                                title: '人员选择',
                                icon: 'icon-glyph-user',
                                onClose: function (obj) {
                                    var users = popTips.UserSelector.getUsers(), _val = users[0].unique(true).join(','), _txt = users[1].unique(true).join(',');
                                    if (_val.length) { _val = ',' + _val + ','; } else { _val = ','; }
                                    if (_txt.length) { _txt = ',' + _txt + ','; } else { _txt = ','; }
                                    self.setData(_val, _txt);
                                }
                            });
                            popTips.UserSelector = new $.UI.UserSelector({ p: popTips.body, ids: self.getValue().split(',') });
                            break;
                    }
                })
                break;
            case 'Timer':
                eBody.evt('click', function (e) {
                    var e = $.e.fix(e), _e = e.t;
                    if (_e.className.indexOf('_select_s') != -1) { _e = _e.pn(); }
                    if (_e.tagName == 'DIV' && _e.className == 'mac_select') {
                        var _iAry = [{ name: 'same', text: '同一天' }, { name: 'custom', text: '指定日期'}];
                        popMYTips(_e, _iAry, _e.attr('cval'), function (obj) {
                            if (obj.Name == 'custom') { _e.ns().dc('dn'); } else { _e.ns().ac('dn'); }
                            _e.fc().h(obj.Text); _e.attr('cVal', obj.Name);
                        }, 120);
                    }
                    if (!args.lockDate && _e.tagName == 'SPAN' && _e.attr('value')) {
                        var _tips = getPopTips();
                        _tips.set('ePop', _e).init({ type: 'Calendar', nowD: _e.attr('value') }).evt('onClick', function (obj) { var _val = obj.Value; _e.attr('value', _val); _e.h(_val); self.set('isChange', true); _tips.hide(); }).show();
                    }
                    if (_e.tagName == 'INPUT') {
                        switch (_e.attr('pk')) {
                            case 'date':
                                var _tips = getPopTips();
                                _tips.set('ePop', _e).init({ type: 'Calendar', nowD: _e.value }).evt('onClick', function (obj) { var _val = obj.Value; _e.value = _val; self.set('isChange', true); _tips.hide(); }).show();
                                break;
                            case 'h':
                                var _iAry = [];
                                for (var i = 0; i < 24; i++) { _iAry.push({ name: i, text: i }); }
                                var _tips = getPopTips(40);
                                _tips.set('ePop', _e).init({ type: 'Menu', items: _iAry, checkedValue: _e.value }).evt('onClick', function (obj) { var _val = +obj.Text; if (_val < 10) { _val = '0' + _val; }; _e.value = _val; _e.pn().attr('hh', obj.Text); self.set('isChange', true); _tips.hide(); }).show();
                                break;
                                break;
                            case 'm':
                                var _iAry = [];
                                for (var i = 0; i < 6; i++) { _iAry.push({ name: i + '0', text: i + '0' }); }
                                var _tips = getPopTips(40);
                                _tips.set('ePop', _e).init({ type: 'Menu', items: _iAry, checkedValue: _e.value }).evt('onClick', function (obj) { var _val = +obj.Text; if (_val < 10) { _val = '0' + _val; }; _e.value = _val; _e.pn().attr('mm', obj.Text); self.set('isChange', true); _tips.hide(); }).show();
                                break;
                        }
                    }
                    e.stop();
                });
                break;
        }
    }
    function _event() {
        if (isNonN) {
            if (type == 'Label' && args.type == 'image') {
                eBody.evt('click', function (e) { var e = $.e.fix(e), _e = e.t; if (_e.tagName == 'IMG') { args.onClick({ FormItem: self, _E: _e }); }; });
            }
            return;
        }
        eInput.evt('click', function (e) { if (args.readonly) { var e = $.e.fix(e); e.stop(); }; me.fireClick(); })
        .evt('focus', function (e) { if (args.readonly) { eInput.blur(); return false; } })
        .evt("blur", function (e) {
            var e = $.e.fix(e), _e = e.t, _r = true, _val = _e.value;
            if (_val == args.defText) { onReset(); } else { _r = me.checkItem(); }
            args.onBlur({ FormItem: self, eInput: _e, Value: _val });
            e.stop();
        }).evt('keyup', function (e) {
            var e = $.e.fix(e), _e = e.t, _val = _e.value;
            self.set('isChange', true).set('value', _val).set('text', _val);
            var _cVal = me.checkItem();
            args.onKeyUp({ FormItem: self, eInput: _e, Value: _val, CheckValue: _cVal });
            if (e.code == 13 && self.get('ifEnterSubmit')) {
                args.onEnterPress({ FormItem: self, eInput: _e, Value: _val });
                $.Dialog.destroy();
            }
            if (args.comType.trim() == 'AutoComplete') { onAutoCompleteKeyUp(); };
            args.onChange({ FormItem: self, Value: _val, Text: _val, Args: args, Name: args.name });
            e.stop();
        });
        if (eMark) { 
            eMark.evt('click', function (e) {
                if (args.readonly) { return; }
                var e = $.e.fix(e); e.stop(); 
                self.get('onClickBefore')({ FormItem: self, Args: args }); 
                if (type == 'NumUpDown') { clickNumUpDown(e.t); } else { me.fireClick(); }; 
                return; self.get('onClick')({ FormItem: self, Args: args }); 
            });
        }
    }
    function clickNumUpDown(_e) {
        var _cn = _e.className, _origVal = +eInput.value || 1, _newVal = '';
        if (isNaN(_origVal)) { onCheckErr('Illegal Default Value'); return; }
        var _s = +args.step, _min = +args.min, _max = +args.max, _ifLoop = args.ifLoop;
        switch (_cn) {
            case 'FI-NumUpDown-Up':
                _newVal = _origVal + _s;
                if (_newVal > _max) {
                    if (_ifLoop) { _newVal = _min; } else { _newVal = _max; }
                }
                break;
            case 'FI-NumUpDown-Down':
                _newVal = _origVal - _s;
                if (_newVal < _min) {
                    if (_ifLoop) { _newVal = _max; } else { _newVal = _min; }
                }
                break;
        }
        onCheckSucc();
        if (args.ifFillZero && _newVal < 10) { _newVal = '0' + _newVal; }
        self.setData(_newVal, _newVal);
        args.onUpDown(args.self, _newVal, _e);
    }
    function clickCheckBoxs(cbAry) {
        var _tAry = [], _vAry = [];
        for (var i = 0, _len = cbAry.length; i < _len; i++) {
            var _cb = cbAry[i];
            if (_cb.getChecked()) { _tAry.push(_cb.getText()); _vAry.push(_cb.getValue()); }
        }
        self.setData(_vAry.join(','), _tAry.join(',')); me.checkItem(true);
    }
    function clickMulitSelectCheckBox(obj, allAry, count) {
        var _value = obj.Value, _txt = obj.Text, _ifCheck = obj.IfChecked;
        if (_value == 'selAll') {
            for (var i = 0; i < count; i++) { allAry[i].setChecked(_ifCheck); }
        } else {
            if (_ifCheck) {
                if (!args.JIDS[_value]) { args.IDS.push(_value); args.TXTS.push(_txt); }
                args.JIDS[_value] = true;
            } else {
                if (args.JIDS[_value]) { args.IDS.re(_value); args.TXTS.re(_txt); }
                args.JIDS[_value] = false;
            }
            var _val = args.IDS.join(','), _txt = args.TXTS.join(',');
            if (_val.length) { _val = ',' + _val + ','; } else { _val = ','; }
            if (_txt.length) { _txt = ',' + _txt + ','; } else { _txt = ','; }
            if (args.IDS.length == count) { args.SelAll.setChecked(true, false); } else { args.SelAll.setChecked(false, false); }
            self.setData(_val, _txt);
            args.JIDS[_value] = _ifCheck;
        }
    }
    function onFileUploaderClick(obj) {
        popTips = new $.UI.Tips({ comMode: 'x-auto', width: 500, height: 400, y: 100, head_h: 30, ifMask: true, ifClose: true, title: '文件上传', icon: 'icon-glyph-arrow-up' });
        new $.UI.FileUploader({ p: popTips.body, specialFiles: args.specialFiles, mId: args.mId, catelogId: args.catelogId, catelog: args.catelog, uploadApi: args.uploadApi, onSuccess: onUploadSuccess, onComplete: function (objs) { args.onComplete({ FormItem: self, Objs: objs }); } });
    }
    function onUploadSuccess(obj) {
        var _fObj = obj.File, _fName = _fObj.nodeName || _fObj.title, _txt = _fName, _val = self.getValue() || ',';
        self.set('value', _val + _fObj.id + ',').set('text', _val + _fObj.id + ',').set('isChange', true);
        if (_txt.length > 25) { _txt = _txt.substr(0, 15) + '...'; }
        if (obj.State.ifSpecial && obj.State.fid) { args.onSuccess({ FormItem: self, File: _fObj, ValueObject: obj }); return; }
        var _eFile = args.eFiles.adElm('', 'a').h('<span class="download"></span><span MTips=' + _fName + '>' + _txt + '</span><span class="del" MTips="删除文件" fid="' + _fObj.id + '"></span>').attr('target', '_self').attr('href', 'Module/SYS_CM_FILES.aspx?action=downloadFile&id=' + _fObj.id);
        $(_eFile.lastChild).evt('click', function (e) { var e = $.e.fix(e), _e = e.t; e.stop(); if (_e.tagName == 'SPAN' && _e.className == 'del') { self.delFile(_e); } });
        args.onSuccess({ FormItem: self, File: _fObj, ValueObject: obj });
    }
    function onReset() {
        var _eF = args.eFoot;
        if (_eF) { _eF.ac('dn').dc('checkSucc checkErr'); }
        if (eInput) { eInput.ac('input-normal').dc('input-ok input-focus input-error'); }
        VTips.hide();
    }
    function onCheckSucc(sOK) {
        var _eF = args.eFoot;
        if (_eF) { _eF.ac('checkSucc').dc('dn checkErr'); eCheckText.h(sOK); } else { VTips.hide(); }
        if (eInput) {
            eInput.dc('input-error').ac('input-ok');
            setTimeout(function () { eInput.dc('input-ok').ac('input-normal'); }, 10);
        } else {

        }
    }
    function onCheckErr(sErr) {
        var _eF = args.eFoot, _sErr = sErr || '非法数据';
        if (_eF) {
            _eF.ac('checkErr').dc('dn checkSucc');
            eCheckText.h(_sErr);
        } else {
            VTips.setSkin('error').setText(_sErr).setTarget(eBody, 'left').show();
        }
        if (eInput) { eInput.ac('input-error').dc('input-normal input-focus input-ok'); } 
    }
    function check() {
        var _val = self.getValue(), _req = args.req, _sR = args.sReg, _rTemp = regTemplateObj[args.regTemplate] || '';
        if (!_req && _val.length == 0) { return true; }
        if (type == 'RePwd' || type == 'EndDate') {
            var _matItem = self.form.items[args.matchItem];
            if (!_matItem) { args.sErr = '要进行匹配的FormItem项不存在'; return false; }
            var _matVal = _matItem.getValue();
            if (args.onMatchVal({ FormItem: self, MatchValue: _matVal, Value: _val }) != false) {
                if (_matVal == '') { return true; }
                switch (type) {
                    case 'RePwd':
                        if (_val == _matVal) { return true; } else { args.sErr = '密码不匹配'; return false; }
                        break;
                    case 'EndDate':
                        var _d1 = new Date().str2Date(_matVal);
                        var _d2 = new Date().str2Date(_val), _dv = _d2 - _d1;
                        if (_dv > 1) { return true; } else { args.sErr = '结束时间必须大于开始时间'; return false; }
                        break;
                }
            }
        }
        if (!_sR) { if (_rTemp) { _sR = _rTemp; } else { if (_val) { return true; } else { return false; } } }
        if (!_val || _val == args.defText) { return false; }
        if ((new RegExp(_sR)).test(_val)) { return true; } else { return false; }
    }
    me.checkItem = function (ifExecSucc) {
        var _enabled = self.getEnabled(), _iec = ifExecSucc == null ? true : ifExecSucc;
        if (!_enabled) { return true; }
        var _val = check();
        if (_val) { if (_iec) { onCheckSucc(args.sOk); } } else { onCheckErr(args.sErr); }
        return _val;
    }
    me.fireClickRadio = function (radio, ifExecChange) {
        if (!radio) { return; }
        var _cItem = args.checkedItem;
        if (_cItem) { if (_cItem == radio) { return; } _cItem.setChecked(false); }
        args.checkedItem = radio; radio.setChecked(true);
        if (ifExecChange != false) { self.setData(radio.getValue(), radio.getText()); }
        me.checkItem(true);
    }
    me.fireClick = function () {
        args.onValueChange = function (obj) { self.setData(obj.Value, obj.Text);  };
        $.UI.EventHandler.BindInputClick(args);
    }
    function _init(args){ _default(args); _layout(); _event();  }
    return _init(args), me;
}

$.UI.FormGroup = function (args) {
    /* 
    { 
        type: "FormGroup", 
        desc: "Form中以组形式存在的一组FormItem的集合", 
        args: { 
            name: { desc: 'FormGroup在Form中唯一标识的名称', defVal: '', dataType:'string' },
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            width: { desc: 'FormGroup的宽度, 如果为null表示FormGroup的宽度将100%填充父容器', defVal: null, dataType: 'int' },
            items: { desc: 'FormItem项集合的数组', defVal: [], dataType: 'array' },
            idx: { desc: '在Form中FormGroup项的索引值', defVal: 0, dataType: 'int' },
            visibled: { desc: 'FormGroup是否可见', defVal: true, dataType: 'bool' },
            ifShowHead: { desc: '是否显示标题', defVal: true, dataType: 'bool' },
            skin: { desc: '皮肤样式class名', defVal:'FormGroup-gray', dataType: 'string' },
            icon: { desc: '标题上的图片名(对应icon.css中的图片样式类名-ClassName)', defVal: 'icon-glyph-list', dataType: 'string', comType:'IconSelector' },
            title:{ desc: '标题上的文字', defVal: 'FormGroup-Title', dataType: 'string' },
            cn: { desc:'FormGroup结构最外一层的类名(Class-Name)',defVal: '', dataType: 'string' },
            css: { desc:'FormGroup结构最外一层的样式(Style)',defVal: '', dataType: 'string' }
        } 
    } 
    */
    var me = this, owner, _fn = function () { };
    var eTitle, eFI, count = new $.nCount();
    var _args = { p: $DB, width: null, items: [], name: '', idx: 0, visibled: true, ifShowHead: false, skin: 'FormGroup-gray', icon: '', title: 'FormGroup-Title', cn: '', css: '' };
    me.items = {};
    me.aItem = [];
    function _default() { me.name = args.name; me.idx = args.idx; }
    function _layout() {
        var _html = '<fieldset class="{0}"><legend><a class="{1} m3"></a><span class="fs12">{2}</span><a class="icon-glyph-chevron-down" expand="meeko" style="float:right; padding-right:5px;cursor:pointer;"></a></legend><div></div></fieldset>';
        _html = _html.format(args.skin, args.icon, args.title);  //<a class="FG-icon-expand"></a>
        if (args.width) { args.css += 'width:' + args.width + 'px;'; } else { args.css += 'width:100%;' }
        owner = args.p.adElm('', 'div').cn('FormGroup fl ' + args.cn).css(args.css).h(_html);
        eTitle = owner.fc().fc(); eFI = eTitle.ns();
        me.showHead(args.ifShowHead);
        me.setVisibled(args.visibled);
        for (var i = 0, _len = args.items.length; i < _len; i++) { me.addItem(args.items[i]); }
    }
    function _event() {
        eTitle.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t;
            if (_e.tagName == 'A' && _e.attr('expand')) {
                if (_e.className.trim() == 'icon-glyph-chevron-down') { _e.cn('icon-glyph-chevron-right'); eFI.hide(); } else { _e.cn('icon-glyph-chevron-down'); eFI.show(); }
            }
        });
    }
    me.addItem = function (j) {
        var _obj = j || {}, _item, _idx = count.getN();
        _obj.p = eFI;
        if (_obj.comType == 'Select' && _obj.items) {
            var _v_t = {}, _iLen = _obj.items.length, _vObj;
            for (var i = 0; i < _iLen; i++) { _vObj = _obj.items[i] || {}; _v_t[_vObj.value] = _vObj.text; }
            _obj.VT = _v_t;
        }
        _item = new $.UI.FormItem(_obj);
        _item.group = me;
        me.items[_obj.name] = me.items[_idx] = _item;
        me.aItem.push(_item);
        return _item;
    }
    me.reLoad = function (ary) { me.items = {}; me.aItem = []; var i, _iLen = ary.length; for (i = 0; i < _iLen; i++) { me.addItem(ary[i]); }; }
    me.collapse = function () { }
    me.expand = function () { }
    me.getVisibled = function () { return args.visibled; }
    me.setVisibled = function (v) { if (v != null) { if (v) { owner.show(); } else { owner.hide(); }; args.visibled = v; } return me; }
    me.showHead = function (v) { if (v) { eTitle.show(); } else { eTitle.hide(); } return me; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.Form = function (args) {
    /* 
    { 
        type: "Form", 
        desc: "From表单对象", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            icon: { desc: '标题上的图片名(对应icon.css中的图片样式类名-ClassName)', defVal: 'icon-glyph-list', dataType: 'string', comType:'IconSelector' },
            title:{ desc: '标题上的文字', defVal: 'FormGroup-Title', dataType: 'string' },
            items: { desc: 'FormItem项集合的数组', defVal: [], dataType: 'array' },
            enabled: { desc: 'From是否可用', defVal: true, dataType: 'bool' },
            head_h: { desc: 'Form标题部分的高度', defVal: 0, dataType: 'int' },
            foot_h: { desc: 'Form提交按钮部分的高度', defVal: 0, dataType: 'int' },
            skin: { desc: '皮肤样式class名', defVal:'', dataType: 'string' },
            cn: { desc:'Form结构最外一层的类名(Class-Name)',defVal: '', dataType: 'string' },
            css: { desc:'Form结构最外一层的样式(Style)',defVal: '', dataType: 'string' },
            submitApi: { desc: 'Form提交Api接口', defVal: '', dataType:'string' },
            insertApi: { desc: 'Form执行Insert插入Api接口', defVal: '', dataType:'string' },
            updateApi: { desc: 'Form执行Update更行Api接口', defVal: '', dataType:'string' },
            loadApi: { desc: 'Form执行加载数据Api接口', defVal: '', dataType:'string' },
            loadFormApi: { desc: '执行加载FromItems的API接口', defVal: '', dataType:'string' },
            state: { desc: 'Form当前操作的状态--Update:执行更新操作, Insert:执行插入操作', defVal: 'Insert', dataType:'string', comType:'Radios', sons:[{text:'插入',value:'Insert'},{text:'更新',value:'Update'}] },
            btnItems: { desc: '一组Button定义JSON对象的数组', defVal: [{ name: 'FORM-SYS-SUBMIT', text: '提交', icon: 'icon-glyph-ok', css: 'margin-left:102px;'}], dataType: 'array' },
            ifSubmitOriVal: { desc: '是否提交表单原始值(如: key=value&key1=value1), 如果false则是提交json字符串', defVal: false, dataType: 'bool' },
            ifFixedHeight: { desc: '是否固定表单体Body的高度(经典三分结构)', defVal: true, dataType: 'bool' },
            extSubmitVal: { desc: '表单扩展提交的key-value形式的JSON对象', defVal: {}, dataType: 'json', comType: 'Json' },
            hidden: { desc: '表单提交的Hidden对象', defVal: {}, dataType: 'json' },
            onItemClick: { desc: '回调每个FormItem触发Click的事件', defVal: function (){}, dataType: 'function' },
            onItemClickBefore: { desc: '回调每个FormItem触发Click之前的事件', defVal: function (){}, dataType: 'function' },
            onClick: { desc: '回调Form触发操作按钮的Click事件', defVal: function (){}, dataType: 'function' },
            onFinishInit: { desc: '回调Form加载完所有FormItem的事件', defVal: function (){}, dataType: 'function' },
            onClose: { desc: '回调Form关闭时间', defVal: function (){}, dataType: 'function' },
            onChange: { desc: '回调每个FormItem触发Change事件', defVal: function (){}, dataType: 'function' },
            onCheck: { desc: '回调每个FormItem触发Check的事件', defVal: function (){}, dataType: 'function' },
            onSubmit: { desc: '回调Form提交之前的事件', defVal: function (){}, dataType: 'function' },
            onAjax: { desc: '回调Form提交时进行Ajax请求时的事件', defVal: function (){}, dataType: 'function' },
            onSubmitSuccess: { desc: '回调Form提交成功时的事件', defVal: function (){}, dataType: 'function' },
            onSubmitError: { desc: '回调Form提交失败的事件', defVal: function (){}, dataType: 'function' },
            onLoadFormError: { desc: '回调Form加载Form失败时的事件', defVal: function (){}, dataType: 'function' },
            onLoadFormSuccess: { desc: '回调Form加载Form成功时的事件', defVal: function (){}, dataType: 'function' }
        } 
    } 
    */
    var me = this, owner, data, _fn = function () { };
    var FICount = new $.nCount(), FGCount = new $.nCount();
    me.aItem = [];
    me.items = {};
    me.groups = {};
    me.aGroup = [];
    me.btnSet = null;
    var firstFI, lastFI;
    var eIcon, eText, eBody;
    var _args = {
        p: $DB, icon: '', title: '', items: [], enabled: true, head_h: 0, foot_h: 38, skin: '', css: '', cn: '',
        submitApi: '', insertApi: '', updateApi: '', loadApi: '', loadFormApi: '', state: 'Insert', extLoadFields: [],
        btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '提交', skin: 'btn-info', css: 'margin-left:100px;' }],
        ifSubmitOriVal: false, ifFixedHeight: true, ifFocus: false, extSubmitVal: {}, hidden: {}, onItemClick: _fn, onItemClickBefore: _fn,
        onClick: _fn, onFinishInit: _fn, onClose: _fn, onChange: _fn, onCheck: _fn, onSubmit: _fn, onAjax: _fn, onEnterSubmit: _fn,
        onSubmitSuccess: _fn, onSubmitError: _fn, onLoadFormError: _fn, onLoadFormSuccess: _fn
    }
    function _default() { }
    function _layout() {
        var eHead, eFoot;
        owner = args.p.adElm('', 'div').cn('Form ' + args.skin + ' ' + args.cn).css(args.css);
        if (args.ifFixedHeight) {
            var _bd = new $.UI.BaseDiv({ p: owner, head_h: args.head_h, foot_h: args.foot_h });
            eHead = _bd.head; eBody = _bd.body; eFoot = _bd.foot;
            eHead.h('<a></a><span style="line-height:37px;"></span>');
        } else {
            var _hCss = 'height:' + args.head_h + 'px;line-height:' + args.head_h + 'px;';
            var _fCss = 'height:' + args.foot_h + 'px;line-height:' + args.foot_h + 'px;';
            owner.h('<div class="Form-head"  style="' + _hCss + '"><a></a><span class="fl"></span></div><div class="Form-body"></div><div class="Form-foot" style="' + _fCss + '"></div>');
            eHead = owner.fc(); eBody = eHead.ns(); eFoot = eBody.ns();
        }
        eIcon = eHead.fc(); eText = eIcon.ns();
        me.setIcon(args.icon).setTitle(args.title); args.owner = owner;
        me.btnSet = new $.UI.ButtonSet({ p: eFoot, items: args.btnItems, onClick: onClick });
        me.reLoadItems(args.items, { onSuccess: function () { _event(); } });
    }
    function _event() { }
    function onClick(obj) {
        if (obj.Name == 'FORM-SYS-SUBMIT') { if (me.check() != false) { me.submit(); } }
        obj.Form = me;
        args.onClick(obj);
    }
    function checkItem(beginFI) {
        if (beginFI) {
            if (beginFI.get('ifSubmit') == '0') { return checkItem(beginFI.next); }
            if (beginFI.get('ifSubmit') && beginFI.getVisibled() && beginFI.group.getVisibled()) {
                var _cVal = beginFI.check();
                if (_cVal) {
                    var _name = beginFI.name, _text = beginFI.getText().toString().trim(), _value = beginFI.getValue();
                    var _origVal = _name + '=' + _text, _dType = beginFI.get('dataType');
                    switch (_dType) {
                        case 'int':
                            _value = parseInt(_value);
                            if (isNaN(_value)) { _value = 0; }
                            break;
                        case 'double':
                            _value = parseFloat(_value);
                            if (isNaN(_value)) { _value = 0.00; }
                            break;
                        case 'string':
                            _value = _value.toString().trim();
                            _value = $.Util.filter(_value);
                            break;
                    }
                    _text = $.Util.filter(_text);
                    data.IText[_name] = _text;
                    data.IValue[_name] = _value;
                    data.IOrigVal.push(_origVal);
                    if (beginFI.get('isChange')) { data.UText[_name] = _text; data.UValue[_name] = _value; data.UOrigVal.push(_origVal); }
                    return checkItem(beginFI.next);
                } else {
                    beginFI.focus();
                    return _cVal;
                }
                args.onCheck({ Form: me, FormItem: beginFI, CheckResult: _cVal });
            } else {
                return checkItem(beginFI.next);
            }
        }
    }
    function getKeyFields() {
        var _items = me.aItem, _iLen = _items.length, _kAry = [];
        for (var i = 0; i < _iLen; i++) {
            var _args = _items[i].getArgs(), _name = _args.name, _trans = _args.trans, _alias = _args.alias || _name;
            if (_args.comType == 'Date' || _args.comType == 'EndDate') { _alias = 'dbo.SYS_FORMAT_TIME(' + _name + ')'; }
            if (_args.comType == 'UserSelector') { _trans = 'SYS_TRANS_USERS'; }
            if (_args.comType == 'SingleUserSelector') { _trans = 'SYS_TRANS_USER'; }
            _kAry.push(_alias + ' as ' + _name);
            if (_args.gtID || _args.ifTrans) { _trans = 'SYS_TRANS_GT'; }
            _trans = args.trans || _trans;
            if (_trans) { _kAry.push('dbo.' + _trans + '(' + _name + ') as ' + _name + '_trans'); }
        }
        _kAry = _kAry.concat(args.extLoadFields);
        return _kAry.join(',');
    }
    function loadApi(api, onSucc, ifChange) {
        var _succ = onSucc || _fn, _ifChange = ifChange || false;
        $.Util.ajax({
            args: api + '&dataType=json&keyFields=id,' + getKeyFields(),
            onSuccess: function (d) {
                var _jVal = eval(d.get(0) || '[]')[0];
                var _items = me.aItem, _iLen = _items.length;
                for (var i = 0; i < _iLen; i++) {
                    var _item = _items[i], _name = _item.get('name'), _tKey = _name + '_trans';
                    var _val = _jVal[_name], _txt = _val, _vt = _item.get('VT');
                    if (_jVal[_tKey] != null) { _txt = _jVal[_tKey]; }
                    if (_vt) { _txt = _vt[+_val]; }
                    _item.reset().setData(_val, _txt, _ifChange);
                }
                me.setHidden('id', _jVal.id);
                _succ({ Form: me, Value: _jVal });
            }
        });
        me.set('state', 'Update');
        return me;
    }
    function initItems(items) { for (var i = 0, _len = items.length; i < _len; i++) { me.addItem(items[i]); }; if (args.ifFocus) { me.focus(); }; args.onFinishInit({ Form: me }); }
    me.check = function (ifReturn) {
        data = { IText: {}, IValue: {}, IOrigVal: [], UText: {}, UValue: {}, UOrigVal: [] };
        var _checkValue = checkItem(firstFI), _rValue = _checkValue;
        if (ifReturn) { _rValue = [_checkValue, data]; }
        return _rValue;
    }
    me.getButton = function (v) { return me.btnSet.items[v]; }
    me.submit = function () {
        if (args.onSubmit({ Form: me, Data: data }) == false) { return; }
        var _val, _action = args.submitApi, _aAry = [], _hVal = $.toArgsString(args.hidden), _sArgs = '', _infoText = '添加';
        switch (args.state) {
            case 'Insert':
                if (args.insertApi) { _action = args.insertApi; }
                if (args.ifSubmitOriVal) { _val = data.IOrigVal.join('&'); } else { _val = data.IValue; }
                break;
            case 'Update':
                _infoText = '修改';
                if (args.updateApi) { _action = args.updateApi; }
                if (args.ifSubmitOriVal) { _val = data.UOrigVal.join('&'); } else { _val = data.UValue; }
                break;
        }
        if (!_action) { MTips.show('Form提交的请求API为空', 'warn'); return; } else { _action = $.toArgsString(_action); _aAry.push(_action); }
        if (_hVal) { _aAry.push(_hVal); }
        if (typeof _val == 'object') {
            for (var k in args.extSubmitVal) { _val[k] = args.extSubmitVal[k]; }
            var _sVal = $.JSON.encode(_val);
            if (_sVal == '{}') { args.onSubmitSuccess({ Form: me, Data: data }); return; }
            _val = 'json=' + _sVal;
        }
        _aAry.push(_val);
        _sArgs = _aAry.join('&');
        if (args.onAjax({ Form: me, Data: data, Args: _sArgs }) == false) { return; }
        $.Util.ajax({
            args: _sArgs,
            onSuccess: function (obj) { if (args.onSubmitSuccess({ Form: me, Data: data, Args: _sArgs, ReturnValue: obj }) != false) { MTips.show(_infoText + '成功', 'ok'); } },
            onError: function (obj) { if (args.onSubmitError({ Form: me, Data: data, Args: _sArgs, ReturnValue: obj }) != false) { MTips.show(obj.data.split('=')[1] || (_infoText + '失败'), 'error'); } }
        });
    }
    me.loadDataByID = function (id, onSucc, ifChange) { if (!id || !args.loadApi) { return; }; return loadApi(args.loadApi + '&id=' + id, onSucc, ifChange); }
    me.loadDataByWhereCondition = function (api, onSucc, ifChange) { return loadApi(api, onSucc, ifChange); }
    me.addItem = function (j) {
        var _obj = j || {}, _item, _idx = FICount.getN(), _group = _obj.group || {}, _name = _obj.name;
        if (typeof _group == 'string') { _group = { name: _group }; }
        if (!_name) { _name = 'FormItem_' + _idx; _obj.name = _name; }
        var _gn = _group.name || 'FORM-SYS-GROUP-DEFAULT', _fg = me.groups[_gn];
        var _onCG = _obj.onChange || _fn, _onCK = _obj.onClick || _fn;
        var _onCB = _obj.onClickBefore || _fn, _onEP = _obj.onEnterPress || _fn;
        if (!_fg) { _fg = me.addGroup(_group); }
        _obj.group = _fg;
        _item = _fg.addItem(_obj);
        _item.evt('onChange', function (obj) { obj.Form = me; _onCG(obj); args.onChange(obj); })
            .evt('onClick', function (obj) { obj.Form = me; _onCK(obj); args.onItemClick(obj); })
            .evt('onClickBefore', function (obj) { obj.Form = me; _onCB(obj); args.onItemClickBefore(obj); })
            .evt('onEnterPress', function (obj) { obj.Form = me; _onEP(obj); if (me.check() != false) { me.submit(); args.onEnterSubmit(obj); } });
        _item.form = me;
        if (lastFI) { lastFI.next = _item; _item.pre = lastFI; }
        if (!firstFI) { firstFI = _item; }
        lastFI = _item;
        me.items[_name] = me.items[_idx] = _item;
        me.aItem.push(_item);
        return _item;
    }
    me.addGroup = function (group) {
        var _g = group || {}, _gn = _g.name;
        var _fg = me.groups[_gn];
        if (!_fg) {
            var _gIdx = FGCount.getN();
            _g.p = eBody;
            _g.name = _gn;
            _g.idx = _gIdx;
            _fg = new $.UI.FormGroup(_g);
            me.groups[_gn] = me.groups[_gIdx] = _fg;
            me.aGroup.push(_fg);
        }
        return _fg;
    }
    me.reLoadItems = function (items, cbFn) {
        eBody.h(''); me.aItem = []; me.items = {}; me.groups = {}; me.aGroup = []; firstFI = null; lastFI = null; data = null;
        var _len = items.length, _ids = [], _idx = [], _f = cbFn || {}, _onSucc = _f.onSuccess || _fn, _onErr = _f.onError || args.onLoadFormError;
        for (var i = 0; i < _len; i++) {
            var _obj = items[i] || {}, _type = _obj.comType, _gtID = _obj.gtID;
            if (_type == 'CheckBox' || _type == 'Radios') { if (_gtID) { _ids.push(_gtID); _idx.push(i); } }
        }
        if (!_ids.length) { initItems(items); _onSucc(); return; }
        $.Util.ajax({
            args: 'm=SYS_TABLE_TREE&table=SYS_CM_GLOBAL_TABLE&action=getNodesByPids&dataType=json&keyFields=id as name, id as value, nodeName as text&pids=' + _ids.join(','),
            onSuccess: function (obj) {
                for (var i = 0; i < _ids.length; i++) {
                    var _sVal = obj.get(i), _sAry = [];
                    if (_sVal) { _sAry = eval(_sVal); }
                    items[_idx[i]]['sons'] = _sAry;
                }
                var _cbObj = { Items: items, Form: me };
                initItems(items); _onSucc(_cbObj); args.onLoadFormSuccess(_cbObj);
            },
            onError: function (d) { MTips.show('加载CheckBox或Radios中的数据出错!', 'error'); _onErr(); }
        });
        return me;
    }
    me.focus = function (FormItem) {
        var _fi = FormItem || firstFI;
        if (_fi) { if (!_fi.get('noInput')) { _fi.focus(); } else { if (_fi.next) { me.focus(_fi.next); } } }
        return me;
    }
    me.reset = function () { return me.aItem.ec(function (i){ this[i].reset(); }), me; }
    me.setIcon = function (v) { eIcon.css('margin:7px 3px;').cn(v + ' fl'); return me; }
    me.setTitle = function (v) { eText.h(v); return me; }
    me.setHidden = function (k, v) { return args.hidden[k] = v, me; }
    me.getHidden = function (k) { return args.hidden[k]; }
    me.setExt = function (k, v) { return args.extSubmitVal[k] = v, me; }
    me.getExt = function (k) { return args.extSubmitVal[k]; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.Paging = function (args) {
    /* 
    { 
        type: "Paging", 
        desc: "数据分页组件", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            skin: { desc: '皮肤样式class名', defVal:'Paging-default', dataType: 'string' },
            buttonSkin: { desc: '组件的Button样式class名', defVal:'Button-paging', dataType: 'string' },
            cn: { desc:'Paging结构最外一层的类名(Class-Name)',defVal: '', dataType: 'string' },
            css: { desc:'Paging结构最外一层的样式(Style)',defVal: '', dataType: 'string' },
            pageSizeAry: { desc: '每页大小定义数组', defVal: [5, 10, 20, 30, 40], dataType: 'array' },
            pageSize: { desc: '当前每页条数', defVal: 10, dataType: 'int' },
            pageIndex: { desc: '当前第几页', defVal: 1, dataType: 'int' },
            totalCount: { desc: '所有记录条数', defVal: 0, dataType: 'int' },
            pages: { desc: '初始化Paging的Button数', defVal: 5, dataType: 'int'},
            onClick:{ desc: '回调Button的Click事件', defVal: function (){}, dataType: 'function' },
            onSelect:{ desc: '回调选择PageSize时的时间', defVal: function (){}, dataType: 'function' }
        } 
    } 
    */
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, buttonSkin: 'Button-paging', skin: 'Paging-default', cn: '', css: '', pageSizeAry: [5, 10, 20, 30, 40], pageSize: 20, pageIndex: 1, totalCount: 250, pages: 5, onClick: _fn, onSelect: _fn };
    var btnAry = [], attr = {}, btn, _pLen, _dAry = [], btnIdx = 1;
    function _default() {
        _pLen = args.pages + 1;
        var _bSkin = args.buttonSkin, _psa = args.pageSizeAry;
        for (var j = 0, _jLen = _psa.length; j < _jLen; j++) { var _d = _psa[j]; _dAry.push({ name: _d, value: _d, text: _d }); }
        btnAry.push({ name: 'First', title: '首页', icon: 'icon-glyph-fast-backward', skin: _bSkin });
        btnAry.push({ name: 'Pre', title: '上一页', icon: 'icon-glyph-backward', skin: _bSkin });
        for (var i = 1; i < _pLen; i++) { btnAry.push({ type: 'tab', visibled: false, name: i + '_btn', skin: _bSkin }); }
        btnAry.push({ name: 'Next', title: '下一页', icon: 'icon-glyph-forward', skin: _bSkin });
        btnAry.push({ name: 'Last', title: '尾页', icon: 'icon-glyph-fast-forward', skin: _bSkin });
        btnAry.push({ name: 'Refresh', title: '刷新', icon: 'icon-glyph-refresh', skin: _bSkin });
    }
    function _layout() {
        owner = args.p.adElm('', 'div').cn(args.skin + ' fl ' + args.cn).css(args.css);
        var _eBtn = owner.adElm('', 'div').cn('fl wa hp');
        btn = new $.UI.ButtonGroup({ p: _eBtn, items: btnAry, onClick: onBtnClick });
        var _eExt = owner.adElm('', 'div').cn('ext').h('<input type="text" ><span></span><input type="text" readonly="true" ><a class="change-record"></a><span></span>');
        var _d1 = _eExt.fc(), _d2 = _d1.ns(), _d3 = _d2.ns(), _d4 = _d3.ns(), _d5 = _d4.ns();
        _d4.evt('click', function (e) { onChangeClick(e); });
        _d1.evt('keyup', function (e) { var e = $.e.fix(e), _e = e.t; if (e.code == 13) { me.forwardPage(_e.value); }; });
        attr.eInputIdx = _d1; attr.eIdx = _d2; attr.eInputSize = _d3; attr.eSize = _d5;
    }
    function _event() { }
    function _override() { }
    function getPageIdx() { return args.pageIndex; }
    function setPageIdx(v) {
        var _tIdx = v % args.pages;
        if (!_tIdx) { _tIdx = args.pages; }
        btnIdx = _tIdx;
        btn.setSelTabItem(_tIdx + '_btn');
        attr.eInputIdx.value = v; args.pageIndex = v;
        return me;
    }
    function setBtnText(dVal, _rSize) {
        var _dVal = dVal * args.pages;
        for (var i = 1; i < _pLen; i++) {
            var _name = i + '_btn';
            btn.setText(_name, _dVal + i);
            if (i < _rSize + 1) { btn.setVisibled(_name, true); } else { btn.setVisibled(_name, false); }
        }
    }
    function getPageSize() { return args.pageSize; }
    function setPageSize(v) { attr.eInputSize.value = v; args.pageSize = v; return me; }
    function onChangeClick(e) {
        var e = $.e.fix(e), _e = e.t; e.stop();
        $.Dialog.get({ ePop: _e }).init({ type: 'Menu', checkedValue: _e.ps().value, items: _dAry }).evt('onClick', function (obj) { var _size = +obj.Value; setPageSize(_size); $.Dialog.destroy(); args.onSelect({ Paging: me, Attr: attr, Size: _size }); }).show();
    }
    function onBtnClick(obj) {
        var _name = obj.Name, _txt, _pIdx;
        switch (_name) {
            case 'First':
                attr.ifChange = true;
                _pIdx = 0;
                break;
            case 'Pre':
                args.pageIndex--;
                if (args.pageIndex < 1) { args.pageIndex++; return; }
                _pIdx = args.pageIndex;
                if (btnIdx == 1) { btnIdx = args.pages; attr.ifChange = true; } else { btnIdx--; }
                break;
            case 'Next':
                args.pageIndex++;
                if (args.pageIndex > attr.pageCount) { args.pageIndex--; return; }
                _pIdx = args.pageIndex;
                if (btnIdx == args.pages) { attr.ifChange = true; btnIdx = 1; } else { btnIdx++; }
                break;
            case 'Last':
                attr.ifChange = true;
                _pIdx = attr.pageCount;
                break;
            case 'Refresh':
                _pIdx = args.pageIndex;
                break;
            default:
                _pIdx = obj.Button.getText();
                break;
        }
        me.forwardPage(_pIdx);
    }
    me.forwardPage = function (v, ifExecFn) {
        var _ifexec = (ifExecFn == null ? true : ifExecFn);
        if (v == null) { return; }
        if (v > attr.pageCount) { v = attr.pageCount; }
        if (v < 1) { v = 1; }
        if (attr.ifChange) {
            var _dVal = $.m.p((v - 1) / args.pages), _tVal = (_dVal + 1) * args.pages, _rSize = args.pages;
            if (_tVal > attr.pageCount) { _rSize = attr.pageCount - _dVal * args.pages; }
            setBtnText(_dVal, _rSize);
            attr.ifChange = false;
        }
        setPageIdx(v);
        if (_ifexec) { args.onClick({ Paging: me, Attr: attr }); }
    }
    me.setTotal = function (v) {
        if (v == null) { return; }
        var _pSize = args.pageSize, _pCount = Math.ceil(v / _pSize);
        attr.eIdx.h('/' + _pCount + '页'); attr.eSize.h('/' + v + '条');
        attr.pageCount = _pCount; attr.total = v;
        setPageSize(_pSize); attr.ifChange = true;
        me.forwardPage(args.pageIndex, false);
        return me;
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}

$.UI.Button = function (args) {
    /* 
    { 
        type: "Button", 
        desc: "Button-最常用的组件", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            name: { desc: '在ButtonSet中name可以作为每个Button的唯一性的标识', defVal:'Btn', dataType: 'string' },
            type: { desc: 'Button的类型', defVal:'normal', dataType: 'string', comType:'Radios', sons: [{text:'Normal',value:'normal'},{text:'Toggle',value:'toggle'},{text:'Separator',value:'separator'},{text:'Container',value:'container'},{text:'Tab',value:'tab'},{text:'Menu',value:'menu'}] },
            text: { desc: '显示的文本', defVal:'', dataType: 'string' },
            skin: { desc: '皮肤样式class名', defVal:'Button-default', dataType: 'string' },
            title: { desc: '提示文字', defVal:'', dataType: 'string' },
            width: { desc: '整体宽度, 如果为null, Button的宽度则是根据文字的多少进行撑开', defVal:null, dataType: 'int' },
            visibled: { desc: '是否显示', defVal: true, dataType: 'bool' },
            enabled: { desc: '是否启用', defVal: true, dataType: 'bool' },
            cn: { desc:'Button结构最外一层的类名(Class-Name)',defVal: '', dataType: 'string' },
            css: { desc:'Button结构最外一层的样式(Style)',defVal: '', dataType: 'string' },
            onClick:{ desc: '回调Button的Click事件', defVal: function (){}, dataType: 'function' },
            onMouseDown:{ desc: '回调Button的mousedown事件', defVal: function (){}, dataType: 'function' }
        } 
    } 
    */
    var me = this, owner, _fn = function () { };
    var eText, eIcon;
    var _args = {
        p: $DB, name: 'Btn', type: 'normal', text: '', skin: 'btn-primary', title: '', align: 'left', iconSkin: 'white',
        width: null, visibled: true, enabled: true, tab: 1, icon: '', cn: '', css: '',
        ifPress: false, ifClose: false, ifFocus: false, isMenu: false, ifVertical: false,
        onMouseDown: _fn, onClick: _fn
    };
    function _default() { }
    function _layout() {
        cn = args.skin + ' ' + args.cn; css = args.css;
        if (args.width) { css += ';width:' + args.width + 'px;'; }
        args.align != 'center' ? (css += 'float:' + args.align) : void (0);
        owner = args.p.adElm('', "buttom").cn('btn ' + cn).css(css).attr('_title', args.title).h('<i class="skin-glyph-'+args.iconSkin+' ' + args.icon + '"></i><span>' + args.text + '</span>');
        eIcon = owner.fc(); eText = eIcon.ns();
    }
    function _event() {
        owner.evt('click', function (e) { var e = $.e.fix(e); me.fireClick(); e.stop(); }).evt('mousedown', function (e) { args.onMouseDown({ Button: me, Args: args, name: args.name, text: args.text, Name: args.name, Text: args.text, E: $.e.fix(e) }); });
    }
    me.fireClick = function () {
        if (!args.enabled) { return; }
        args.onClick({ Button: me, Args: args, name: args.name, text: args.text, Name: args.name, Text: args.text, Owner: owner });
        return me;
    }
    me.setEnabled = function (v) { if (v != null) { args.enabled = v; v ? owner.dc('disabled') : owner.ac('disabled'); }; return me; }
    me.setVisibled = function (v) { if (v != null && args.enabled) { v ? me.show() : me.hide(); }; return me; }
    me.setText = function (v) { if (v != null && args.enabled) { args.text = v; eText.h(v); }; return me; }
    me.setIcon = function (v) { if (v != null && args.enabled) { args.icon = v; eIcon.cn('icon ' + v); }; return me; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.ButtonSet = function (args) {
    /* 
    { 
        type: "ButtonSet", 
        desc: "一组Button的集合", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            items: { desc: 'ButtonJSON对象的一组集合数组', defVal:[], dataType: 'array' },
            skin: { desc: '皮肤样式class名', defVal:'ButtonSet-default', dataType: 'string' },
            itemSkin: { desc: '每一个ButtonItem的皮肤样式class名', defVal:'Button-default', dataType: 'string' },
            itemAlign: { desc: 'Button的对齐方式', defVal:'left', dataType: 'string', comType:'Radios', sons: [{text:'左对齐',value:'left'},{text:'右对齐',value:'right'}] },
            cn: { desc:'ButtonSet结构最外一层的类名(Class-Name)',defVal: '', dataType: 'string' },
            css: { desc:'ButtonSet结构最外一层的样式(Style)',defVal: '', dataType: 'string' },
            onClick:{ desc: '回调Button的Click事件', defVal: function (){}, dataType: 'function' },
            onMouseDown:{ desc: '回调Button的mousedown事件', defVal: function (){}, dataType: 'function' },
            onClose:{ desc: '回调Button的Close(关闭)事件', defVal: function (){}, dataType: 'function' },
            onSuccess:{ desc: '回调Button的Close(关闭)事件', defVal: function (){}, dataType: 'function' },
            onMenuClick:{ desc: '回调类型是Menu的Button中Menu的Click事件', defVal: function (){}, dataType: 'function' }
        } 
    } 
    */
    var me = this, owner, _fn = function () { }, count = new $.nCount();
    var _args = { p: $DB, items: [], skin: '', gtID: null, gtType: 'normal', gbsID: null, gbsType: 'normal', ifRights: false, loadApi: '', btnType: 'normal', itemSkin: '', itemAlign: 'left', cn: '', css: '', onClick: _fn, onClose: _fn, onMouseDown: _fn, onMenuClick: _fn, onSuccess: _fn };
    me.items = {};
    me.aItem = [];
    me.selTabItem = {};
    me.focusItem = null;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn(args.skin + ' ' + args.cn).css(args.css);
        me.loadItems(args.items);
        loadApi(function () { loadGT(function () { loadGBS(null); }); });
    }
    function _event() { }
    function loadApi(succ) { if (args.loadApi) { me.loadApi(args.loadApi, false, args.btnType, succ); } else { succ(); }; }
    function loadGT(succ) { if (args.gtID != null) { me.loadApi('m=SYS_TABLE_BASE&table=SYS_CM_GLOBAL_TABLE&action=getRightsListByPid&pid=' + args.gtID, false, args.gtType, succ, 'nodeName as text, nodeName as nn, id as name, icon'); } else { succ(); } }
    function loadGBS(succ) { if (args.gbsID != null) { me.loadApi('m=SYS_CM_USERS&action=getRightsToolBars&pid=' + args.gbsID, false, args.gbsType, succ, 'nodeName as text, nodeName as nn, id as name, icon, btnType as type'); } else { var _succ = succ || args.onSuccess; _succ({ ButtonSet: me, items: me.aItem }); } }
    me.getItem = function (v) {
        if (v == null) { return; }
        if ($.getType(v) == 'object') { return v; }
        return me.items[v];
    }
    me.addItem = function (j, ifReturn) {
        var _j = j || {}, _ifR = ifReturn || false, _onClick = _j.onClick || _fn;
        _j.p = owner;
        _j.onClick = function (obj) { obj.ButtonSet = me; if (obj.Args.type == 'tab') { me.setSelTabItem(obj.Button); }; _onClick(obj); args.onClick(obj); }
        _j.onMenuClick = function (obj) { obj.ButtonSet = me; return args.onMenuClick(obj); }
        _j.onMouseDown = function (obj) { obj.ButtonSet = me; return args.onMouseDown(obj); }
        if (!_j.skin) { _j.skin = args.itemSkin||'btn-primary'; }
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
                var _dAry = eval(data.get(0) || '[]'), _onSucc = onSucc || args.onSuccess;
                if (ifReLoad != false) { me.clear(); }
                me.loadItems(_dAry);
                _onSucc({ ButtonSet: me, items: _dAry });
            }
        });
        return me;
    }
    me.fireClick = function (k) { var _item = me.getItem(k); if (_item) { _item.fireClick(); }; return me; };
    me.loadItems = function (items) { for (var i = 0, _iLen = items.length; i < _iLen; i++) { me.addItem(items[i]); }; return me; }
    me.reLoadItems = function (items) { me.clear(); return me.loadItems(items); }
    me.getText = function (v) { var _item = me.getItem(v); if (_item) { return _item.getText(); } }
    me.setText = function (k, v) { var _item = me.getItem(k); if (_item) { _item.setText(v); } return me; }
    me.setAllEnabled = function (v) { for (var i = 0, _iLen = me.aItem.length; i < _iLen; i++) { me.aItem[i].setEnabled(v); } return me; }
    me.setEnabled = function (k, v) { var _item = me.getItem(k); if (_item) { _item.setEnabled(v); } return me; }
    me.clear = function () { owner.h(''); me.items = {}; me.aItem = []; count.setN(-1); return me; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.SignleButton = function (args) {
    /* 
    { 
        type: "Button", 
        desc: "Button-最常用的组件", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            name: { desc: '在ButtonSet中name可以作为每个Button的唯一性的标识', defVal:'Btn', dataType: 'string' },
            type: { desc: 'Button的类型', defVal:'normal', dataType: 'string', comType:'Radios', sons: [{text:'Normal',value:'normal'},{text:'Toggle',value:'toggle'},{text:'Separator',value:'separator'},{text:'Container',value:'container'},{text:'Tab',value:'tab'},{text:'Menu',value:'menu'}] },
            text: { desc: '显示的文本', defVal:'', dataType: 'string' },
            skin: { desc: '皮肤样式class名', defVal:'Button-default', dataType: 'string' },
            title: { desc: '提示文字', defVal:'', dataType: 'string' },
            align: { desc: 'Button的对齐方式', defVal:'left', dataType: 'string', comType:'Radios', sons: [{text:'左对齐',value:'left'},{text:'右对齐',value:'right'}] },
            width: { desc: '整体宽度, 如果为null, Button的宽度则是根据文字的多少进行撑开', defVal:null, dataType: 'int' },
            visibled: { desc: '是否显示', defVal: true, dataType: 'bool' },
            enabled: { desc: '是否启用', defVal: true, dataType: 'bool' },
            tab: { desc:'Paging结构最外一层的类名(Class-Name)',defVal: '0', dataType: 'string' },
            icon: { desc:'Button上的图标, 对应icon.css中的class名',defVal: '', dataType: 'string' },
            cn: { desc:'Button结构最外一层的类名(Class-Name)',defVal: '', dataType: 'string' },
            css: { desc:'Button结构最外一层的样式(Style)',defVal: '', dataType: 'string' },
            ifPress: { desc: '是否被按下', defVal: false, dataType: 'bool' },
            ifClose: { desc: '是否有关闭', defVal: false, dataType: 'bool' },
            ifFocus: { desc: '是否获得焦点', defVal: false, dataType: 'bool'},
            onClick:{ desc: '回调Button的Click事件', defVal: function (){}, dataType: 'function' },
            onMouseDown:{ desc: '回调Button的mousedown事件', defVal: function (){}, dataType: 'function' },
            onClose:{ desc: '回调Button的Close(关闭)事件', defVal: function (){}, dataType: 'function' },
            onPress:{ desc: '回调Button的按下事件', defVal: function (){}, dataType: 'function' },
            onMenuClick:{ desc: '回调类型是Menu的Button中Menu的Click事件', defVal: function (){}, dataType: 'function' }
        } 
    } 
    */
    var me = this, owner, _fn = function () { };
    var css, cn, _skin, eIcon, eText;
    var _args = {
        p: $DB, name: 'Btn', type: 'normal', text: '', skin: 'Button-default', title: '', align: 'left',
        width: null, visibled: true, enabled: true, tab: 1, icon: '', cn: '', css: '',
        ifPress: false, ifClose: false, ifFocus: false, isMenu: false, ifVertical: false,
        onMouseDown: _fn, onClick: _fn, onClose: _fn, onPress: _fn, onMenuClick: _fn
    };
    function _default() {
        _skin = args.skin;
        cn = _skin + ' ' + _skin + '-normal  ' + args.cn; css = args.css;
        if (args.type == 'menu' || args.isMenu) { args.ifClose = false; }
        if (args.width) { css += ';width:' + args.width + 'px;'; }
        if (args.align == 'right') { cn += ' fr'; } else { cn += ' fl'; }
    }
    function _layout() {
        var _html = '<a class="detail"><span class="' + (args.icon?args.icon:'') + '" ></span><span class="text">' + args.text + '</span></a>';
        if (args.type == 'menu' || args.isMenu) { _html += '<a class="menu"><span></span></a>'; }
        if (args.ifClose) { _html += '<a class="close" title="关闭"></a>'; }
        owner = args.p.adElm('', "LI").cn('Button ' + cn).css(css).attr('title', args.title).h(_html);
        owner.onselectstart = function () { return false; }
        eIcon = owner.fc().fc(); eText = eIcon.ns(); me.owner = owner;
        if (args.ifVertical) { eText.css('width: 16px;word-wrap: break-word;'); }
        me.setFocus(args.ifFocus);
        me.setPress(args.ifPress);
        me.setEnabled(args.enabled);
        me.setVisibled(args.visibled);
    }
    function _event() {
        owner.evt('click', function (e) {
            if (!args.enabled) { return; }
            var e = $.e.fix(e), _e = e.t, _type = args.type;
            var _obj = findTarget(_e), cbArgs = { Button: me, Args: args, name: args.name, text: args.text, Name: args.name, Text: args.text, E: e, _E: _e, Owner: owner };
            if (!_obj) { return; }
            switch (_obj.target) {
                case 'close':
                    args.onClose(cbArgs);
                    me.remove();
                    break;
                default:
                    if (_type == _obj.target) { clickMenu(_obj.eLi); } else { $.Dialog.destroyAll(); }
                    if (_type == 'toggle') { var _ifPress = !args.ifPress; me.setPress(_ifPress); }
                    args.onClick(cbArgs);
                    break;
            }
            e.stop();
        }).evt('mousedown', function (e) { var e = $.e.fix(e), _e = e.t; args.onMouseDown({ Button: me, Args: args, name: args.name, text: args.text, Name: args.name, Text: args.text, E: e }); });
    }
    function findTarget(_e) {
        if (!_e) { return; }
        if (_e.tagName == 'FONT') { _e = _e.pn(); }
        var _t = _e.className.trim(), _eLi, _tn = _e.tagName;
        if (_tn == 'SPAN') { return findTarget(_e.pn()); }
        if (_tn == 'A') { return { target: _t, eLi: _e.pn() }; }
        if (_tn == 'LI') { return findTarget(_e.fc()); }
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
        _f({ Button: me, Args: args, name: args.name, text: args.text, Name: args.name, Text: args.text });
        return me;
    }
    me.setIcon = function (v) { if (v != null && args.enabled) { args.icon = v; eIcon.cn('icon ' + v); }; return me; }
    me.setEnabled = function (v) { if (v != null) { args.enabled = v; v ? owner.dc('disabled') : owner.ac('disabled'); }; return me; }
    me.getEnabled = function () { return args.enabled; }
    me.setVisibled = function (v) { if (v != null && args.enabled) { v ? me.show() : me.hide(); };return me; }
    me.getVisibled = function () { return args.visibled; }
    me.setText = function (v) { if (v != null && args.enabled) { args.text = v; eText.h(v); }; return me; }
    me.getText = function () { return args.text; }
    me.setFocus = function (v) { if (v != null && args.enabled) { args.ifFocus = v; v ? owner.dc(_skin + '-normal').ac(_skin + '-focus') : owner.dc(_skin + '-press btn-focus').ac(_skin + '-normal'); }; return me; }
    me.setPress = function (v) { if (v != null && args.enabled) { args.ifPress = v; v ? (owner.dc(_skin + '-normal').ac(_skin + '-press'), args.onPress({ Button: me })) : owner.dc(_skin + '-press').ac(_skin + '-normal'); }; return me; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.ButtonGroup = function (args) {
    /* 
    { 
        type: "ButtonSet", 
        desc: "一组Button的集合", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            items: { desc: 'ButtonJSON对象的一组集合数组', defVal:[], dataType: 'array' },
            skin: { desc: '皮肤样式class名', defVal:'ButtonSet-default', dataType: 'string' },
            itemSkin: { desc: '每一个ButtonItem的皮肤样式class名', defVal:'Button-default', dataType: 'string' },
            itemAlign: { desc: 'Button的对齐方式', defVal:'left', dataType: 'string', comType:'Radios', sons: [{text:'左对齐',value:'left'},{text:'右对齐',value:'right'}] },
            cn: { desc:'ButtonSet结构最外一层的类名(Class-Name)',defVal: '', dataType: 'string' },
            css: { desc:'ButtonSet结构最外一层的样式(Style)',defVal: '', dataType: 'string' },
            onClick:{ desc: '回调Button的Click事件', defVal: function (){}, dataType: 'function' },
            onMouseDown:{ desc: '回调Button的mousedown事件', defVal: function (){}, dataType: 'function' },
            onClose:{ desc: '回调Button的Close(关闭)事件', defVal: function (){}, dataType: 'function' },
            onSuccess:{ desc: '回调Button的Close(关闭)事件', defVal: function (){}, dataType: 'function' },
            onMenuClick:{ desc: '回调类型是Menu的Button中Menu的Click事件', defVal: function (){}, dataType: 'function' }
        } 
    } 
    */
    var me = this, owner, _fn = function () { }, count = new $.nCount();
    var _args = { p: $DB, items: [], skin: 'ButtonSet-default', gtID: null, gtType: 'normal', gbsID: null, gbsType: 'normal', ifRights: false, loadApi: '', btnType: 'normal', itemSkin: 'Button-default', itemAlign: 'left', cn: '', css: '', onClick: _fn, onClose: _fn, onMouseDown: _fn, onMenuClick: _fn, onSuccess: _fn };
    me.items = {};
    me.aItem = [];
    me.selTabItem = {};
    me.focusItem = null;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'UL').cn(args.skin + ' ' + args.cn).css(args.css);
        me.loadItems(args.items);
        loadApi(function () { loadGT(function () { loadGBS(null); }); });
    }
    function _event() { }
    function loadApi(succ) { if (args.loadApi) { me.loadApi(args.loadApi, false, args.btnType, succ); } else { succ(); }; }
    function loadGT(succ) { if (args.gtID != null) { me.loadApi('m=SYS_TABLE_BASE&table=SYS_CM_GLOBAL_TABLE&action=getRightsListByPid&pid=' + args.gtID, false, args.gtType, succ, 'nodeName as text, nodeName as nn, id as name, icon'); } else { succ(); } }
    function loadGBS(succ) { if (args.gbsID != null) { me.loadApi('m=SYS_CM_USERS&action=getRightsToolBars&pid=' + args.gbsID, false, args.gbsType, succ, 'nodeName as text, nodeName as nn, id as name, icon, btnType as type'); } else { var _succ = succ || args.onSuccess; _succ({ ButtonSet: me, items: me.aItem }); } }
    me.getItem = function (v) {
        if (v == null) { return; }
        if ($.getType(v) == 'object') { return v; }
        return me.items[v];
    }
    me.addItem = function (j, ifReturn) {
        var _j = j || {}, _ifR = ifReturn || false, _onClick = _j.onClick || _fn;
        _j.p = owner;
        _j.onClick = function (obj) { obj.ButtonSet = me; if (obj.Args.type == 'tab') { me.setSelTabItem(obj.Button); }; _onClick(obj); args.onClick(obj); }
        _j.onMenuClick = function (obj) { obj.ButtonSet = me; return args.onMenuClick(obj); }
        _j.onMouseDown = function (obj) { obj.ButtonSet = me; return args.onMouseDown(obj); }
        if (!_j.skin) { _j.skin = args.itemSkin; }
        if (!_j.align) { _j.align = args.itemAlign; }
        var _btn = new $.UI.SignleButton(_j);
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
                var _dAry = eval(data.get(0)||'[]'), _onSucc = onSucc || args.onSuccess;
                if (ifReLoad != false) { me.clear(); }
                me.loadItems(_dAry, type);
                _onSucc({ ButtonSet: me, items: _dAry });
            }
        });
        return me;
    }
    me.fireClick = function (k, f, ifPress) { var _item = me.getItem(k); if (_item) { _item.fireClick(f, ifPress); }; return me; };
    me.loadItems = function (items, type) { for (var i = 0, _iLen = items.length; i < _iLen; i++) { var _iObj = items[i]; _iObj.type = type || _iObj.type; me.addItem(_iObj); }; return me; }
    me.reLoadItems = function (items) { me.clear(); return me.loadItems(items); }
    me.setIcon = function (k, v) { var _item = me.getItem(k); if (_item) { _item.setIcon(v); } return me; }
    me.getText = function (v) { var _item = me.getItem(v); if (_item) { return _item.getText(); } }
    me.setText = function (k, v) { var _item = me.getItem(k); if (_item) { _item.setText(v); } return me; }
    me.setAllEnabled = function (v) { for (var i = 0, _iLen = me.aItem.length; i < _iLen; i++) { me.aItem[i].setEnabled(v); } return me; }
    me.setEnabled = function (k, v) { var _item = me.getItem(k); if (_item) { _item.setEnabled(v); } return me; }
    me.clear = function () { owner.h(''); me.selTabItem = {}; me.focusItem = null; me.items = {}; me.aItem = []; count.setN(-1); return me; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.Menu = function (args) {
    /* 
    { 
        type: "Menu", 
        desc: "用于单列数据的承载", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            items: { desc: '静态数据源', defVal:[], dataType: 'array' },
            skin: { desc: '皮肤样式class名', defVal:'Button-default', dataType: 'string' },
            loadApi: { desc: '加载数据的API接口', defVal:'', dataType: 'string' },
            hidden: { desc: 'ajax请求附加的隐藏JSON对象', defVal:{}, dataType: 'json', comType:'Json' },
            cn: { desc:'Menu结构最外一层的类名(Class-Name)',defVal: '', dataType: 'string' },
            css: { desc:'Menu结构最外一层的样式(Style)',defVal: '', dataType: 'string' },
            textKey: { desc:'对应数据库的字段值作为显示值',defVal: 'nodeName', dataType: 'string' },
            valueKey: { desc:'对应数据库的字段值作为value值',defVal: 'id', dataType: 'string' },
            onClick:{ desc: '回调MenuItem的Click事件', defVal: function (){}, dataType: 'function' },
            onAjax:{ desc: '回调ajax请求的事件', defVal: function (){}, dataType: 'function' },
            onSuccess:{ desc: '回调加载成功的事件', defVal: function (){}, dataType: 'function' },
            onError:{ desc: '回调加载失败的事件', defVal: function (){}, dataType: 'function' }
        },
        itemArgs: {
            text: { desc: '显示的文本', defVal:'', dataType: 'string' },
            name: { desc: '可作为items中唯一标识', defVal:'', dataType: 'string' },
            value: { desc: '真正的Value值', defVal:'', dataType: 'string' },
            type: { desc: 'MenuItem的类型', defVal:'item', dataType: 'string', comType: 'Radios', sons: [{ value: 'item', text: '基本类型' },{ value: 'delimiter', text:'分隔符' }] },
            icon: { desc:'Button上的图标, 对应icon.css中的class名',defVal: '', dataType: 'string' },
            disabled: { desc: '是否启用', defVal:false, dataType: 'bool' }
        }
    } 
    */
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, items: [], skin: '', loadApi: '', checkedValue: null, hidden: {}, extFields: [], css: '', cn: '', textKey: 'nodeName', valueKey: 'id', ifShowIcon: false, onAjax: _fn, onClick: _fn, onSuccess: _fn, onLoadOver: _fn, onError: _fn };
    var iArgs = { text: '', name: '', value: '', type: 'item', icon: '', disabled: false }
    var count = new $.nCount(), itemsObj = {};
    me.items = {};
    me.aItem = [];
    me.selLi;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'ul').cn('Menu ' + args.cn).css(args.css);
        owner.onselectstart = function () { return false; }
        args.items.ec(function (i) { addItem(this[i]); });
        if (args.gtID) { args.loadApi = 'm=SYS_TABLE_BASE&table=SYS_CM_GLOBAL_TABLE&action=getRightsListByPid&pid=' + args.gtID; }
        if (args.loadApi) { me.loadAjax({ args: args.loadApi }); } else { onLoadOver(); }
    }
    function _event() {
        owner.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t;
            var _tag = _e.tagName, _eLi;
            if (_tag == 'LI') { _eLi = _e; }
            if (_tag == 'FONT' || _tag == 'COLOR') { _eLi = _e.pn().pn(); }
            if (_tag == 'SPAN' || _tag == 'A') { _eLi = _e.pn(); }
            if (_eLi) {
                var _val = _eLi.attr('_value'), _eTxt = _eLi.chn(2), _txt = _eTxt.ht(), _name = _eLi.attr('_name'), _style = '', _temp = _eTxt.fc();
                if (me.selLi) { me.selLi.dc('selected'); }
                _eLi.ac('selected');
                me.selLi = _eLi;
                if (_temp.tagName == 'FONT' || _temp.tagName == 'COLOR') {
                    if (_temp.attr('color')) { _style += 'color:' + _temp.attr('color') + ';'; };
                    if (_temp.attr('style')) { _style += _temp.attr('style'); };
                }
                args.onClick({ Menu: me, Item: me.items[_name], Value: _val, Name: _name, Text: _txt, Style: _style });
            }
            e.stop();
        });
    }
    function addItem(j) {
        var _obj = $.init(j, iArgs), _idx = count.getN(), _name = _obj.name || 'MENU_' + _idx;
        var _eLI = owner.adElm('', 'li'), _iType = (_obj.type || 'item').trim();
        if (_iType == 'item') {
            _eLI.attr('_name', _name).attr('_value', _obj.value).h('<a class="checked"></a><span class="icon ' + _obj.icon + '"></span><span>' + _obj.text + '</span>');
        } else {
            _eLI.cn(_iType);
        }
        var _item = { eLi: _eLI, Args: _obj };
        me.items[_name] = me.items[_idx] = _item;
        itemsObj[_name] = _item;
        me.aItem.push(_item);
        return _item;
    }
    function getItem(key) { if (typeof key == 'object') { return key; } else { return me.items[key]; } }
    me.loadAjax = function (obj) {
        var _obj = obj || {}, _args = _obj.args || '';
        if (_args && args.onAjax({ Menu: me, Args: _args }) != false) {
            var _onSuc = _obj.onSuccess || args.onSuccess, _onErr = _obj.onError || args.onError;
            var _tK = args.textKey, _vK = args.valueKey, _kv = _vK + ' as value, ' + _tK + ' as text';
            if (args.extFields.length) { _kv += ',' + args.extFields.join(','); }
            if (args.ifShowIcon) { _kv += ',icon'; }
            $.Util.ajax({
                args: $.toArgsString(_args) + '&dataType=json&keyFields=' + _kv + '&' + $.toArgsString(args.hidden),
                onSuccess: function (d) {
                    var _sData = d.get(0);
                    if (_sData) {
                        var _dAry = eval(_sData), _dLen = _dAry.length;
                        for (var i = 0; i < _dLen; i++) {
                            var _dObj = _dAry[i];
                            addItem({ text: _dObj['text'], name: _dObj['value'], icon: _dObj['icon'], value: _dObj['value'], type: 'item', data: _dObj });
                        }
                        _onSuc({ Menu: me }); onLoadOver();
                    }
                },
                onError: function (d) { _onErr(d); }
            });
        }
    }
    function onLoadOver() {
        if (args.checkedValue) { var sel = itemsObj[args.checkedValue]; if (sel) { me.setSelected(sel); } }
        args.onLoadOver({ Menu: me });
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
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
};

$.UI.TreeList = function (args) {
    /* 
    { 
        type: "TreeList", 
        desc: "用于树状表结构的展开和操作", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            dataSource: { desc: '数据源', defVal:null, dataType: 'array' },
            lockLevel: { desc: '要锁住的层', defVal:0, dataType: 'int' },
            currLevel: { desc: '当前层', defVal:1, dataType: 'int' },
            aHeader: { desc: 'TreeList中List的aHeader参数值', defVal:[], dataType: 'array' },
            x: { desc: '相对于父容器x坐标', defVal:0, dataType: 'int' },
            y: { desc: '相对于父容器y坐标', defVal:0, dataType: 'int' },
            depth: { desc: '深度', defVal:0, dataType: 'int' },
            updateApi: { desc: '修改的API', defVal:'', dataType: 'string' },
            loadApi: { desc: '加载数据的API', defVal:'', dataType: 'string' },
            skin: { desc: '皮肤样式class名', defVal:'', dataType: 'string' },
            cn: { desc:'TreeList结构最外一层的类名(Class-Name)',defVal: '', dataType: 'string' },
            css: { desc:'TreeList结构最外一层的样式(Style)',defVal: '', dataType: 'string' },
            style: { desc:'展现数据的样式类型',defVal: 'menu', dataType: 'string', comType:'Radios', sons: [{value:'menu',text:'菜单模式'},{value:'tree',text:'树状模式'},{value:'bingxing',text:'并行模式'}] },
            onTDClick:{ desc: '回调TreeList中List的TDClick事件', defVal: function (){}, dataType: 'function' },
            onCheckBoxClick:{ desc: '回调TreeList中List的CheckBoxClick事件', defVal: function (){}, dataType: 'function' },
            onTDClickBefore:{ desc: '回调TreeList中List的TDClickBefore事件', defVal: function (){}, dataType: 'function' },
            onSuccess:{ desc: '回调加载成功的事件', defVal: function (){}, dataType: 'function' },
            onError:{ desc: '回调加载失败的事件', defVal: function (){}, dataType: 'function' }
        }
    } 
    */
    var me = this, owner, _fn = function () { }, attr = {};
    var _args = {
        p: $DB, dataSource: null, lockLevel: 0, currLevel: 1, ifExpandAll: false, aHeader: [], x: 0, y: 0, depth: 0, loadApi: '', updateApi: '',
        css: 'border-top:1px solid #E4E2E2;', cn: '', skin: '', style: 'tree:nodeName',
        onSuccess: _fn, onError: _fn, onTDClick: _fn, onCheckBoxClick: _fn, onTDClickBefore: _fn
    };
    function _default() {
        me.pre = args.pre;
    }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('pa ' + args.cn).css('left:' + args.x + 'px;top:' + args.y + 'px;' + args.css);
        owner.onselectstart = function () { return false; }
        me.owner = owner;
        attr.loadApi = $.toArgsObj(args.loadApi);
        var _lArgs = $.init({ p: owner, loadApi: attr.loadApi, onSuccess: onListSuccess }, args);
        _lArgs.css = null; _lArgs.cn = null;
        me.List = new $.UI.List(_lArgs);
    }
    function _event() {
        me.List.evt('onTDClick', function (obj) {
            obj.TreeList = me;
            disposeChild(me.next); if (me.next) { me.next.remove(); me.next = null; }
            if (args.lockLevel == args.currLevel) { args.onTDClick(obj); return; }
            if (args.style.indexOf('tree') == -1) {
                var _eTR = obj.Target.eTr, _pid = _eTR.attr('rowId') || _eTR.attr('id'), _sons = +_eTR.attr('sons');
                if (!_sons) { args.onTDClick(obj); return; }
                var _pPos = args.p.pos(), _trPos = _eTR.pos();
                var _x = _trPos.x - _pPos.x + _trPos.w, _y = 0, _loadApi = $.JSON.decode($.JSON.encode(attr.loadApi));
                if (args.style == 'menu') { _y = _trPos.y - args.p.pos().y; }
                _loadApi.pid = _pid;
                var _nArgs = $.init({ loadApi: _loadApi, x: _x, y: _y, currLevel: args.currLevel + 1 }, args);
                var _child = new $.UI.TreeList(_nArgs);
                me.next = _child;
                _child.pre = me;
            }
            args.onTDClick(obj);
        }).evt('onTDClickBefore', function (obj) { if (args.onTDClickBefore(obj) == false) { return false; } });
    }
    function onListSuccess(obj) {
        obj.TreeList = me; obj.List = me.List;
        if (args.ifExpandAll) { obj.List.fireClick(0); }
        args.onSuccess(obj);
    }
    function disposeChild(child) { if (child) { var _n = child.next; child.owner.r(); child = null; disposeChild(_n); } }
    me.getChild = function (v) {
        var currList = me, n = 0;
        while (currList.next) { n++; currList = currList.next; if (n == v) { return currList; } }
        return currList;
    }
    me.insertRow = function () { }
    me.deleteRow = function () { }
    me.refresh = function (cbFn, ifCheckSel, idc) { if (!ifCheckSel) { ifCheckSel = false; }; me.List.refresh(cbFn, ifCheckSel); if (idc) { disposeChild(me.next); } }  //idc: ifDisposeChilds的简称
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.Layout = function (args) {
    /* 
    { 
        type: "Layout", 
        desc: "布局组件, 可以通过组合可以组成任何形式的高级布局组件", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            barWidth: { desc: 'bar的宽度值', defVal:5, dataType: 'int' },
            start: { desc: 'bar初始化值', defVal:200, dataType: 'int' },
            min: { desc: 'bar能拖动的最小值', defVal:20, dataType: 'int' },
            max: { desc: 'bar能拖动的最大值', defVal:300, dataType: 'int' },
            cn: { desc:'Layout结构最外一层的类名(Class-Name)',defVal: '', dataType: 'string' },
            css: { desc:'Layout结构最外一层的样式(Style)',defVal: '', dataType: 'string' },
            dirLock: { desc: '要固定的方向, 1表示上和左, 2表示下和右', defVal:1, dataType: 'int', comType: 'Radios', sons: [{value:1,text:'上, 左'},{value:2,text:'下, 右'}] },
            dir: { desc: 'Layout方向, we表示上下方向, ns表示左右方向', defVal:'we', dataType: 'string', comType: 'Radios', sons: [{value:'we',text:'上下'},{value:'ns',text:'左右'}] },
            ifDrag: { desc:'Bar是否可拖动',defVal: true, dataType: 'bool' },
            isRoot: { desc:'是否是最外层的布局器',defVal: false, dataType: 'bool' },
            ifCover: { desc:'是否有方向箭头',defVal: true, dataType: 'bool' },
            onDrag:{ desc: '回调Layout的Bar拖动事件', defVal: function (){}, dataType: 'function' },
            onResize:{ desc: '回调组件的Resize事件', defVal: function (){}, dataType: 'function' }
        },
        containerAry: ['eHead','eFoot']
    } 
    */

    var me = this, owner, _fn = function () { };
    var eHead, eBar, eFoot, eDirFlag, barDragFlag, barVal, p, start, barW, dirLock, dir, max, min, ifDrag, _ddir;
    var _args = { p: $DB, barWidth: 3, start: 200, min: 20, max: 300, cn: '', css: '', dir: 'we', dirLock: 1, ifDrag: true, isRoot: false, ifCover: true, onDrag: _fn, onResize: _fn };
    var _html = '<div class="layout-head scroll-webkit"></div><div class="layout-bar"><a state="0" class="cover dn"></a></div><div class="layout-foot scroll-webkit"></div>';
    function _default() {
        p = args.p;
        start = +args.start;
        barW = +args.barWidth;
        dirLock = args.dirLock;
        dir = args.dir;
        max = +args.max;
        min = +args.min;
        ifDrag = args.ifDrag;
    }
    function _layout() {
        owner = p.adElm('', 'div').cn('Layout-' + dir).attr('mType', dir.toUpperCase()).h(_html);
        owner.onselectstart = function () { return false; }
        eHead = owner.fc(); eBar = eHead.ns(); eDirFlag = eBar.fc(); eFoot = eBar.ns();
        me.eHead = eHead; me.eFoot = eFoot;
        if (dir == 'ns') {
            var pH = $.m.p(p.offsetHeight);
            if (dirLock == 1) {
                _ddir = 'n';
                eHead.css($.box(',,,' + start));
                eBar.css($.box(',' + start + ',,' + barW));
                eFoot.css($.box(',' + (start + barW) + ',,' + (pH - start - barW)));
                if (ifDrag) { $.drag.init(eBar, null, null, null, min, max, 1); }
            } else {
                _ddir = 's';
                eHead.css($.box(',,,' + (pH - start - barW)))
                eBar.css($.box(',' + (pH - start - barW) + ',,' + barW))
                eFoot.css($.box(',' + (pH - start) + ',,' + start));
                if (ifDrag) { $.drag.init(eBar, null, null, null, pH - max, pH - min, 1); }
            }
        } else {
            var pW = $.m.p(p.offsetWidth);
            if (dirLock == 1) {
                _ddir = 'w';
                eHead.css($.box(',,' + start + ','));
                eBar.css($.box(start + ',0,' + barW + ','));
                eFoot.css($.box((start + barW) + ',0,' + (pW - start - barW) + ','));
                if (ifDrag) { $.drag.init(eBar, null, min, max, null, null, null, 1); }
            } else {
                _ddir = 'e';
                eHead.css($.box('0,0,' + (pW - start - barW) + ','))
                eBar.css($.box((pW - start - barW) + ',0,' + barW + ','))
                eFoot.css($.box((pW - start) + ',0,' + start + ','));
                if (ifDrag) { $.drag.init(eBar, null, pW - max, pW - min, null, null, null, 1); }
            }
        }
        if (args.ifCover) { eDirFlag.dc('dn').ac('dir-' + _ddir).attr('dir', _ddir); }
    }
    function _event() {
        if (args.isRoot) { $(window).evt('resize', function () { me.resize(0); }, true); }
        if (ifDrag) {
            var _mask = null;
            eBar.onDragStart = function () { };
            eBar.onDrag = function () {
                if (_mask == null) {
                    barDragFlag = true;
                    var _dir = 'ce';
                    if (dir == 'ns') { _dir = 'cn'; }
                    _mask = new $.UI.Mask({ alpha: 2, cn: _dir });
                    $S(this).zIndex = 10000;
                    $.Dialog.destroyAll();
                }
                me.resize(true);
                //setTimeout(function(){me.resize(1);},16);
            };
            eBar.onDragEnd = function () {
                barDragFlag = false;
                $S(this).zIndex = "";
                if (_mask) { _mask.remove(); _mask = null; };
                me.resize(1);
            };
            eBar.resize = function () { me.resize(1); };
            eBar.evt('click', function (e) {
                var e = $.e.fix(e), _e = e.t; e.stop();
                var _barDir = _e.attr('dir');
                if (_barDir) { me.cover4Dir(_barDir, +_e.attr('state')); }
            });
        }
    }
    function resizeScrollBar(p) {
        var owner = p.fc(), hRate, vRate;
        var eHBar = owner.ns(), eVBar = eHBar.ns(), hBar = eHBar.fc(), vBar = eVBar.fc();
        if (!owner.h()) { return; }
        hRate = $.m.p(p.csn('width') / owner.csn('width') * 100);
        vRate = $.m.p(p.csn('height') / owner.csn('height') * 100);
        if (hRate < 100) { hBar.css('width:' + hRate + '%;'); eHBar.dc('dn'); } else { eHBar.ac('dn'); }
        if (vRate < 100) { vBar.css('height:' + vRate + '%;'); eVBar.dc('dn'); } else { eVBar.ac('dn'); }
    }
    // type: n, s, w, e 四个值， v：0,1   0--表示展开,  1--表示收缩
    me.cover4Dir = function (dir, v) {
        var _ph = $.m.p(p.offsetHeight), _pw = $.m.p(p.offsetWidth);
        switch (dir) {
            case 'n':
                if (v) {
                    eHead.css('height:' + barVal + 'px;').show();
                    eBar.css('top:' + barVal + 'px;');
                    eBar.dragable = true;
                    eFoot.css('top:' + (barVal + barW) + 'px;height:' + (_ph - barVal - barW) + 'px;');
                    eDirFlag.dc('dir-s').ac('dir-n').attr('state', '0');
                } else {
                    barVal = eBar.csn('top');
                    eHead.css('height:0px;').hide();
                    eBar.dragable = false;
                    eBar.css('top:0px;');
                    eFoot.css('top:' + barW + 'px;height:' + (_ph - barW) + 'px;');
                    eDirFlag.dc('dir-n').ac('dir-s').attr('state', '1');
                }
                break;
            case 's':
                if (v) {
                    eHead.css('height:' + barVal + 'px;');
                    eBar.css('top:' + barVal + 'px;');
                    eFoot.css('top:' + (barVal + barW) + 'px;height:' + (_ph - barVal - barW) + 'px;');
                    eDirFlag.dc('dir-n').ac('dir-s').attr('state', '0');
                } else {
                    barVal = eBar.csn('top');
                    eHead.css('height:' + (_ph - barW) + 'px;');
                    eBar.css('top:' + (_ph - barW) + 'px;');
                    eFoot.css('top:' + _ph + 'px;height:0px;');
                    eDirFlag.dc('dir-s').ac('dir-n').attr('state', '1');
                }
                break;
            case 'w':
                if (v) {
                    eHead.css('width:' + barVal + 'px;').show();
                    eBar.dragable = true;
                    eBar.css('left:' + barVal + 'px;');
                    eFoot.css('left:' + (barVal + barW) + 'px;width:' + (_pw - barVal - barW) + 'px;');
                    eDirFlag.dc('dir-e').ac('dir-w').attr('state', '0');
                } else {
                    barVal = eBar.csn('left');
                    eHead.css('width:0px;').hide();
                    eBar.dragable = false;
                    eBar.css('left:0px;');
                    eFoot.css('left:' + barW + 'px;width:' + (_pw - barW) + 'px;');
                    eDirFlag.dc('dir-w').ac('dir-e').attr('state', '1');
                }
                break;
            case 'e':
                if (v) {
                    eHead.css('width:' + barVal + 'px;');
                    eBar.css('left:' + barVal + 'px;');
                    eFoot.css('left:' + (barVal + barW) + 'px;width:' + (_pw - barVal - barW) + 'px;').show();
                    eDirFlag.dc('dir-w').ac('dir-e').attr('state', '0');
                } else {
                    barVal = eBar.csn('left');
                    eHead.css('width:' + (_pw - barW) + 'px;');
                    eBar.css('left:' + (_pw - barW) + 'px;');
                    eFoot.css('width:0px;left:' + _pw + 'px;').hide();
                    eDirFlag.dc('dir-e').ac('dir-w').attr('state', '1');
                }
                break;
        }
        me.resize();
    }
    me.setValue = function (v) {
        if (dir == 'ns') {
            if (dirLock == 1) {
                eBar.css('top:' + v + 'px;');
            } else {
                eBar.css('top:' + (owner.offsetHeight - barW - v) + 'px;');
            }
        } else {
            if (dirLock == 1) {
                eBar.css('left:' + v + 'px;');
            } else {
                eBar.css('left:' + (owner.offsetWidth - v - barW) + 'px;');
            }
        }
        barDragFlag = true;
        me.resize();
    }
    me.setBarWidth = function (v) {
        if (dir == 'ns') { eBar.css('height:' + v + 'px;'); } else { eBar.css('width:' + v + 'px;'); }
        barDragFlag = true;
        me.resize();
    }
    me.resize = function (f) {
        var _pH = $.m.p(p.offsetHeight), _pW = $.m.p(p.offsetWidth);
        if (dir == 'ns') {
            if (dirLock == 2 && !barDragFlag) {
                //底部固定
                var _h = eFoot.csn('height');
                if (_h < start && barDragFlag) { return; }
                eHead.css('height:' + (_pH - barW - _h) + 'px');
                //eHead.style.height = (_pH - barW - _h) + 'px';
                eBar.css('top:' + (_pH - barW - _h) + 'px;');
                eFoot.css('top:' + (_pH - _h) + 'px;');
                eBar.minY = _pH - max;
                eBar.maxY = _pH - min;
            } else {
                //上部固定
                var t = +eBar.csn("top"), _h = _pH - t - barW - 1;
                eHead.style.height = t + 'px';
                eFoot.style.top = (t + barW) + "px";
                eFoot.style.height = (_h <= 0 ? 0 : _h) + "px";
            }
            me.resizeInter(eHead, f);
            me.resizeInter(eFoot, f);
        } else {
            if (dirLock == 2 && !barDragFlag) {
                //右部固定
                var _w = eFoot.csn('width');
                if (_w < start && barDragFlag) { return; }
                eHead.css($.box('0,0,' + (_pW - _w - barW) + ','))
                eBar.css($.box((_pW - _w - barW) + ',0,' + barW + ','))
                eFoot.css($.box((_pW - _w) + ',0,' + _w + ','));
                eBar.minX = _pW - max;
                eBar.maxX = _pW - min;
            } else {
                //左部固定
                var t = +eBar.csn('left'), _w = _pW - t - barW;
                eHead.style.width = t + 'px';
                eFoot.css('left:' + (t + barW) + 'px;width:' + (_w < 0 ? min : _w) + 'px;');
            }
            me.resizeInter(eHead, f);
            me.resizeInter(eFoot, f);
        }
        var _hAry = eHead.find('div:com=ScrollBar'), _fAry = eFoot.find('div:com=ScrollBar');
        for (var i = 0, _len = _hAry.length; i < _len; i++) { resizeScrollBar(_hAry[i]); }
        for (var i = 0, _len = _fAry.length; i < _len; i++) { resizeScrollBar(_fAry[i]); }
    }
    me.resizeInter = function (s, f) {
        var _nsAry = $(s).find('div:mType=NS'), _weAry = $(s).find('div:mType=WE');
        for (var i = 0, _len = _nsAry.length; i < _len; i++) {
            try {
                var _ns = _nsAry[i], _nsP = _ns.pn();
                _ns.style.height = _nsP.offsetHeight + "px";
                _ns.chn(1).resize(f);
            } catch (e) { }

        }
        for (var i = 0, _len = _weAry.length; i < _len; i++) {
            try {
                var _we = _weAry[i], _weP = _we.pn();
                _we.style.width = _weP.offsetWidth + "px";
                _we.chn(1).resize(f);
            } catch (e) { }
        }
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.BaseDiv = function (args) {
    /* 
    { 
        type: "BaseDiv", 
        desc: "经典上下三分结构, head-body-foot", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            head_h: { desc: 'head的高度', defVal:0, dataType: 'int' },
            foot_h: { desc: 'foot的高度', defVal:0, dataType: 'int' },
            skin: { desc: '皮肤样式的class-name', defVal:'BaseDiv-Gray', dataType: 'string' },
            cn: { desc:'BaseDiv结构最外一层的类名(Class-Name)',defVal: '', dataType: 'string' },
            css: { desc:'BaseDiv结构最外一层的样式(Style)',defVal: '', dataType: 'string' },
            onChange:{ desc: '回调组件的Change事件', defVal: function (){}, dataType: 'function' }
        },
        containerAry: ['head','body','foot']
    } 
    */
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, head_h: 0, foot_h: 0, ifFixedHeight: true, cn: '', css: '', skin: 'BaseDiv-Gray', onChange: _fn };
    var _hh, _fh, ver = $('').split(','), _ver1 = ver[0], _ver2 = +ver[1];
    function _default() { _hh = args.head_h; _fh = args.foot_h; }
    function _layout() {
        var htmlTemp;
        if (args.ifFixedHeight) {
            htmlTemp = '<div class="BaseDiv-Head" style="{0}"></div><div class="BaseDiv-Body scroll-webkit" style="{1}"><div></div></div><div class="BaseDiv-Foot" style="{2}"></div>';
            htmlTemp = htmlTemp.format('height:' + _hh + 'px;', 'top:' + _hh + 'px;bottom:' + _fh + 'px;', 'height:' + _fh + 'px;line-height:' + _fh + 'px;');
        } else {
            htmlTemp = '<div style="{0}"></div><div class="scroll-webkit" style="{1}"></div><div style="{2}"></div>';
            htmlTemp = htmlTemp.format('height:' + _hh + 'px;line-height:' + _hh + 'px;', 'height:auto;', 'height:' + _fh + 'px;line-height:' + _fh + 'px;');
        }
        owner = me.base = args.p.adElm('', 'div').cn('BaseDiv-Base ' + args.skin + ' ' + args.cn).css(args.css).h(htmlTemp);
        me.head = me.base.fc(); me._body = me.head.ns(); me.foot = me._body.ns();
        if (args.ifFixedHeight) { me.body = me._body.fc(); } else { me.body = me._body; me.base.dc('BaseDiv-Base'); }
    }
    function _event() {

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
        if (_s) { _base.ease(['height'], [_h], 600, 1, {}); } else {; _base.css('height:' + _h + 'px;'); }
        _f(me, _base);
        args.onChange(me, v, 'body');
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.BaseDivH = function (args) {
    /* 
    { 
        type: "BaseDivH", 
        desc: "经典左中右三分结构, head-body-foot", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            head_h: { desc: 'head的高度', defVal:0, dataType: 'int' },
            foot_h: { desc: 'foot的高度', defVal:0, dataType: 'int' },
            skin: { desc: '皮肤样式的class-name', defVal:'BaseDiv-Gray', dataType: 'string' },
            cn: { desc:'BaseDivH结构最外一层的类名(Class-Name)',defVal: '', dataType: 'string' },
            css: { desc:'BaseDivH结构最外一层的样式(Style)',defVal: '', dataType: 'string' },
            onChange:{ desc: '回调组件的Change事件', defVal: function (){}, dataType: 'function' }
        },
        containerAry: ['head','body','foot']
    } 
    */
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, head_h: 0, foot_h: 0, cn: '', css: '', skin: { base: { cn: 'wp hp', css: '' }, head: { cn: '', css: '' }, body: { cn: '', css: '' }, foot: { cn: '', css: '' } }, onChange: _fn };
    function _default() {}
    function _layout() {
        var _oBase = args.skin.base, _oHead = args.skin.head, _oBody = args.skin.body, _oFoot = args.skin.foot;
        var baseCn = _oBase.cn || '', baseCss = _oBase.css || '',
	    headCn = _oHead.cn, headCss = $.box(',,' + args.head_h + ',') + _oHead.css,
	    bodyCn = _oBody.cn, bodyCss = _oBody.css,
	    footCn = _oFoot.cn, footCss = $.box(',,' + args.foot_h + ',') + _oFoot.css;
        var base = args.p.adElm('', 'div').cn(baseCn).css(baseCss);
        me.base = base;
        me.head = base.adElm('', 'div').cn('pa hp ' + headCn).css('top:0px;left:0px;' + headCss);
        me.body = base.adElm('', 'div').cn('pr hp ' + bodyCn).css('margin-right:' + args.foot_h + 'px;margin-left:' + args.head_h + 'px;');
        me.foot = base.adElm('', 'div').cn('pa hp ' + footCn).css('top:0px;right:0px;' + footCss);
    }
    function _event() {}
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.ResizeTool = function (p) {
    var me = this;
    var dragFlag;
    var p_e_mouseover = function () {
        if ($.global.resizeToolDiv) { return; }
        var _pos = p.pos();
        var pDx = _pos.x + _pos.w;
        var pDy = _pos.y + _pos.h;
        dragFlag = $DB.adElm('', 'div').cn('pa cnw b_1')
            .css($.box((pDx - 16) + ',' + (pDy - 16) + ',15,15') + $.UI.ico16_xy(4, 14))
            .evt('mousedown', resizeDiv_e_mousedown);
        $.global.resizeToolDiv = dragFlag;
    }
    var resizeDiv_e_mousedown = function (e) {
        var e = $.e.fix(e), _e = e.t; e.stop();
        var _pPos = p.pos(), _pX = _pPos.x, _pY = _pPos.y;
        $.drag.init(dragFlag);
        dragFlag.onDragStart = function () { }
        dragFlag.onDrag = function (a) {
            var _newPos = dragFlag.pos();
            var _newW = _newPos.x - _pX + 12, _newH = _newPos.y - _pY + 12;
            p.css('width:' + _newW + 'px;height:' + _newH + 'px;');
        }
        dragFlag.onDragEnd = function () { }
        $.drag.start(e, dragFlag);
    }
    p.evt('mouseover', p_e_mouseover).evt('mousemove', p_e_mousemove);
    return me;
}

$.UI.Resizer = function (args) {
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, skin: 'Resizer-default', icon: '', minWidth: 50, minHeight: 50, onDragStart: _fn, onDrag: _fn, onDragEnd: _fn };
    var p = args.p, _ePn = p.pn(), _w = p.csn('width'), _h = p.csn('height'), _z_index, _selfMask;
    var minW = args.minWidth, minH = args.minHeight;
    function _default() {

    }
    function _layout() {
        owner = p.adElm('', 'div').cn('Resizer ' + args.skin).css('left:' + (_w - 14) + 'px;top:' + (_h - 14) + 'px;');
    }
    function _event() {
        owner.evt('mousedown', function (e) {
            var e = $.e.fix(e), _e = e.t; e.stop();
            var _pp = p.pos(), _pnp = _ePn.pos();
            me.x = _pp.x - _pnp.x;
            me.y = _pp.y - _pnp.y;
            me.w = _pp.w - 2;
            me.h = _pp.h - 2;
            $.drag.init(owner, null, minW, null, minH, null, null, null);
            owner.onDragStart = function () {
                _z_index = $S(p).zIndex;
                $S(p).zIndex = 10000;
                if (!_selfMask) { _selfMask = new $.UI.Mask({ p: p, alpha: 0, cn: 'cnw' }); }
                args.onDragStart(me);
            }
            owner.onDrag = function (a) {
                if (!$.global.dragMask) { $.global.dragMask = new $.UI.Mask({ p: $DB, alpha: 0, cn: 'cnw' }); } else { $.global.dragMask.show(); }
                var _flagPos = owner.pos(), _pPos = p.pos();
                var _newW = _flagPos.x - _pPos.x + 14, _newH = _flagPos.y - _pPos.y + 14;
                if (_newW < minW) { _newW = minW; }
                if (_newH < minH) { _newH = minH; }
                p.css($.box(me.x + ',' + me.y + ',' + _newW + ',' + _newH));
                args.onDrag(me, _newW, _newH);
            }
            owner.onDragEnd = function () {
                $S(p).zIndex = _z_index;
                if ($.global.dragMask != null) { $.global.dragMask.hide(); }
                if (_selfMask) { _selfMask.remove(); _selfMask = null; }
                args.onDragEnd(me);
            }
            $.drag.start(e, owner);
        });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.Tips = function (args) {
    /* 
    { 
        type: "Tips", 
        desc: "经典左中右三分结构, head-body-foot", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            maskOwner: { desc: 'mask父容器', defVal: 'body', dataType: 'DOM', comType:'Label' },
            maskAlpha: { desc: 'mask的透明度', defVal: 10, dataType: 'int' },
            head_h: { desc: 'head高度', defVal:0, dataType: 'int' },
            foot_h: { desc: 'foot高度', defVal:0, dataType: 'int' },
            icon_h: { desc: 'head图片的高度', defVal:14, dataType: 'int' },
            x: { desc: '相对于父容器的横坐标', defVal:0, dataType: 'int' },
            y: { desc: '相对于父容器的纵坐标', defVal:0, dataType: 'int' },
            lifeTime: { desc: '生命周期, 过了这个时间tips自动消失', defVal:0, dataType: 'int' },
            width: { desc: '组件的宽度', defVal:0, dataType: 'int' },
            height: { desc: '组件的高度', defVal:0, dataType: 'int' },
            comMode: { desc: '组件的模式', defVal:0, dataType: 'int' },
            title: { desc: 'head上的标题文字', defVal:'', dataType: 'string' },
            content: { desc: 'body部分的内容', defVal:'', dataType: 'string' },
            icon: { desc: 'head上的标题图标', defVal:'', dataType: 'string' },
            skin: { desc: '皮肤样式的class-name', defVal:'Tips-default', dataType: 'string' },
            cn: { desc:'BaseDivH结构最外一层的类名(Class-Name)',defVal: 'b_16 bc_7 z4', dataType: 'string' },
            css: { desc:'BaseDivH结构最外一层的样式(Style)',defVal: '', dataType: 'string' },
            toolBarSkin: { desc: 'head的ToolBar的皮肤', defVal:'Button-toolbar-icon', dataType: 'string' },
            toolBarAry:  { desc:'toolBar子项对象集合数组',defVal: [], dataType: 'array' },
            ifDrag: { desc: '是否可拖动', defVal:false, dataType: 'bool' },
            ifFixedHeight: { desc: '是否固定body部分的高度', defVal:true, dataType: 'bool' },
            ifMask: { desc: '是否有遮罩阴影', defVal:false, dataType: 'bool' },
            ifClose: { desc: '是否有关闭按钮', defVal:false, dataType: 'bool' },
            ifExpand: { desc: '是否有展开按钮', defVal:false, dataType: 'bool' },
            ifResize: { desc: '是否可以Resize', defVal:false, dataType: 'bool' },
            ifMax: { desc: '是否有最大化按钮', defVal:false, dataType: 'bool' },
            ifMin: { desc: '是否有最小化按钮', defVal:false, dataType: 'bool' },
            ifFullScreen: { desc: '是否有全屏按钮', defVal:false, dataType: 'bool' },
            onToolBarMouseDown:{ desc: '回调ToolBar鼠标按下的事件', defVal: function (){}, dataType: 'function' },
            onToolBarMenuClick:{ desc: '回调ToolBar菜单点击事件', defVal: function (){}, dataType: 'function' },
            onToolBarClick:{ desc: '回调ToolBar点击事件', defVal: function (){}, dataType: 'function' },
            onClose:{ desc: '回调组件的关闭事件', defVal: function (){}, dataType: 'function' },
            onClick:{ desc: '回调组件的点击事件', defVal: function (){}, dataType: 'function' },
            onResize:{ desc: '回调组件的Resize事件', defVal: function (){}, dataType: 'function' },
            onResizeEnd:{ desc: '回调组件的Resize结束的事件', defVal: function (){}, dataType: 'function' },
            onDrag:{ desc: '回调组件的拖动事件', defVal: function (){}, dataType: 'function' },
            onDragEnd:{ desc: '回调组拖动结束的事件', defVal: function (){}, dataType: 'function' }
        },
        containerAry: ['head','body','foot']
    } 
    */
    var me = this, owner, _fn = function () { };
    var _args = {
        p: $DB, x: 0, y: 0, width: 0, height: 0, title: '', icon: '', css: '', cn: '', comMode: 0, skin: 'Tips-default', toolBarSkin: 'btn-primary', lifeTime: 0, toolBarAry: [],
        ifDrag: false, ifFixedHeight: true, ifMask: false, ifClose: false, ifExpand: false, ifResize: false, ifMax: false, ifMin: false, ifFullScreen: false, head_h: 0, foot_h: 0, content: '', icon_h: 14, maskOwner: null, maskAlpha: 10,
        onToolBarMouseDown: _fn, onToolBarMenuClick: _fn, onClose: _fn, onClick: _fn, onResize: _fn, onResizeEnd: _fn, onDrag: _fn, onDragEnd: _fn, onToolBarClick: _fn, onLoadToolBarSuccess: _fn
    };
    var mask, eBody, eIcon, eTitle;
    function _default() {
        if (!args.maskOwner) { args.maskOwner = args.p; };
        if (args.ifMask) {
            if (args.maskOwner == $DB) {
                args.p = $.Layer.get(true);
            } else {
                mask = new $.UI.Mask({ p: args.maskOwner, alpha: args.maskAlpha, onClick: onMaskClick }); owner.css('z-index:11;');
            }
        }
    }
    function _layout() {
        var eHead, eFoot, _pos = getXY(args.comMode), _hHtml = '<i style="float:left;margin:11px 3px;"></i><span style="float:left;line-height:37px;"></span>';
        if (args.ifFixedHeight) {
            var _bd = new $.UI.BaseDiv({ p: args.p, head_h: args.head_h, foot_h: args.foot_h, cn: args.skin + ' ' + args.cn });
            owner = _bd.base; eHead = _bd.head; eBody = _bd.body; eFoot = _bd.foot;
            eHead.ac('Tips-head').h(_hHtml); eBody.ac('Tips-body'); eFoot.ac('Tips-foot');
        } else {
            var _sCss = 'height:{0}px;line-height:{0}px;', _sHtml = '<div class="Tips-head oh" style="{0}">{1}</div><div class="Tips-body"></div><div class="Tips-foot" style="{2}"></div>';
            owner = args.p.adElm('', 'div').cn('pa ' + args.skin + ' ' + args.cn).h(_sHtml.format(_sCss.format(args.head_h), _hHtml, _sCss.format(args.foot_h)));
            eHead = owner.fc(); eBody = eHead.ns(); eFoot = eBody.ns();
        }
        if (args.p.attr('idx') != undefined) { owner = args.p; }
        var _sCss = args.css;
        if (args.width) { _sCss += 'width:' + args.width + 'px;'; }
        if (_sCss) { owner.css(_sCss); }
        me.base = owner; me.body = eBody; me.head = eHead; me.foot = eFoot;
        eIcon = eHead.fc(); eTitle = eIcon.ns();
        toolBarLayout(eHead);
        me.setTitle(args.title);
        me.setIcon(args.icon);
        me.setWH(args.width, args.height);
        me.setPos(_pos[0], _pos[1]);
        me.setContent(args.content);
        if (args.ifDrag) {
            eHead.ac('cm');
            var _z_index;
            $.drag.init(eHead, owner, null, null, null, null, null);
            owner.onDragStart = function () {
                _z_index = $S(this).zIndex;
                $S(this).zIndex = 10000;
            }
            owner.onDrag = function () { args.onDrag(me); }
            owner.onDragEnd = function () {
                $S(this).zIndex = _z_index;
                owner.alpha(10000);
                owner.style.filter = '';
                args.onDragEnd(me);
            }
        }
        if (args.ifResize) { resizeDiv = new $.UI.Resizer({ p: owner, onDrag: function () { args.onResize({ Tips: me }); }, onDragEnd: function (_m, _a, _b) { args.onResizeEnd(me, _m, _a, _b); } }); };
        owner.onselectstart = function () { return false; }
        if (args.lifeTime > 0) { setTimeout(function () { if (me) { me.removeAni(); } }, args.lifeTime); }
        if (args.ifClose) { owner.abElm('', 'a').cn('tips-close').attr('title', '关闭').evt('click', function () { if (args.onClose(me) != false) { me.removeAni(); }; }); }
    }
    function _event() {
        $(window).evt('resize', function () {

        });
    }
    function _override() {}
    function setRotateVal(val) {
        switch (val % 4) {
            case 0:
                owner.css('-webkit-transform: rotate(-1deg);');
                break;
            case 1:
                owner.css('-webkit-transform: rotate(0deg);');
                break;
            case 2:
                owner.css('-webkit-transform: rotate(1deg);');
                break;
            case 3:
                owner.css('-webkit-transform: rotate(0deg);');
                break;
        }
    }
    function onMaskClick() {
        if ($('').split(',')[0].toLow() == 'safari') {
            var _nC = new $.nCount();
            var _a = setInterval(function () { setRotateVal(_nC.getN()); }, 10);

            setTimeout(function () { clearInterval(_a); }, 400);
        } else {
            var _a = setInterval(function () { if (me && me.base) { me.base.ac('tips_focus'); } }, 10);
            setTimeout(function () { clearInterval(_a); if (me && me.base) { me.base.dc('tips_focus'); } }, 400);
        }
    }
    function toolBarLayout(p) {
        var _ary = [];
        if (args.ifExpand) { _ary.push({ name: 'TIPS-SYS-EXPAND', icon: 'icon-compact-bold-b', title: '展开' }); }
        if (args.ifFullScreen) { _ary.push({ name: 'TIPS-SYS-FULLSCREEN', icon: 'icon-glyph-zoom-in', title: '全屏' }); }
        _ary = _ary.concat(args.toolBarAry);
        me.toolBar = new $.UI.ButtonSet({ p: p, loadApi: args.toolBarLoadApi, gtID: args.gtID, gtType: args.gtType, gbsID: args.gbsID, gbsType: args.gbsType, ifRights: args.ifRights, items: _ary, onClick: onToolBarClick, onSuccess: args.onLoadToolBarSuccess, onMouseDown: args.onToolBarMouseDown, onMenuClick: args.onToolBarMenuClick, itemAlign: 'right', itemSkin: args.toolBarSkin, skin: args.btnSetSkin });
    }

    function onToolBarClick(obj) {
        obj.Tips = me;
        args.onToolBarClick(obj);
    }

    function getXY(comMode) {
        var x, y, w = args.width, h = args.height;
        switch (comMode) {
            case 1:
                x = $.wh()[0] - w / 2; y = 120; break;
            case 2:
                var _eMO = args.maskOwner, _mW = _eMO.csn('width') / 2, _mH = _eMO.csn('height') / 2;
                x = _mW - w / 2; y = $.m.p(_mH - h / 1.5);
                break;
            case 3:
                var _wh = $.wh();
                x = $.m.p(_wh[0] - w / 2); y = $.m.p(_wh[1] - h / 2);
                break;
            case 4:
                x = $.wh()[0] - w / 2; y = 30; break;
            case 'auto':
                x = 'auto'; y = 'auto'; break;
            case 'x-auto':
                x = 'auto'; y = args.y; break;
            case 'y-auto':
                x = args.x; y = 'auto'; break;
            default:
                x = args.x; y = args.y; break;
        }
        return [x, y];
    }
    me.setWH = function (width, height) { if (width && height) { args.width = width; args.height = height; owner.css('width:' + width + 'px;height:' + height + 'px;border:1px solid #cccccc;'); } return me; }
    me.setPos = function (x, y) {
        var _pos = '';
        if (x == 'auto') { _pos += 'left:50%;margin-left:-' + args.width / 2 + 'px;'; } else { _pos += 'left:' + x + 'px;'; }
        if (y == 'auto') { _pos += 'top:50%;margin-top:-' + args.height / 2 + 'px;'; } else { _pos += 'top:' + y + 'px;'; }
        owner.css(_pos);
        return me;
    }
    me.setTitle = function (v) { eTitle.h(v); return me; }
    me.setIcon = function (v) { eIcon.cn(v); return me; }
    me.setContent = function (v) { eBody.h(v); if (!args.width && v) { owner.css('margin-left:-' + (eBody.csn('width') / 2) + 'px;'); } return me; }
    me.setZIndex = function (v) { if (v != null || v) { owner.css('z-index:' + v); } return me; }
    me.setFullScreen = function () { }
    me.reStoreScreen = function () { }
    me.removeAni = function (t) { owner.alpha(100).ease(["alpha", 'top'], [0, owner.csn('top') - 20], t || 400, 1, { e: function () { $.Layer.next(owner); if (me && me.remove) { me.remove(); }; } }); }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}

$.UI.Json = function (args) {
    /* 
    { 
        type: "Json", 
        desc: "Json视图和编辑器的整合", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            title: { desc: '标题', defVal:'', dataType: 'string' },
            value: { desc: 'json值', defVal:{}, dataType: 'json' },
            ifClose: { desc: '是否可以关闭', defVal: false, dataType: 'bool' },
            ifEdit: { desc: '是否可以编辑', defVal: false, dataType: 'bool' },
            onClick:{ desc: '回调Click事件', defVal: function (){}, dataType: 'function' }
        }
    } 
    */
    var me = this, owner, eContent, jValue, _fn = function () { };
    var _args = { p: $DB, title: '', value: {}, ifClose: false, ifEdit: false, onClick: _fn };
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp ha');
        var panel = new $.UI.Panel({ p: owner, title: args.title, ifClose: args.ifClose, ifEdit: args.ifEdit, onClick: function (obj) { obj.Json = me; args.onClick(obj); } });
        eContent = panel.eContent;
        me.load(args.value);
    }
    function _event() { }
    me.load = function (value) {
        var _val = value || {}; eContent.h('');
        jValue = _val;
        switch ($.getType(_val)) {
            case 'string':
                _val = $(_val); return me.load(_val);
            case 'object':
                for (var k in _val) {
                    var _v = _val[k], _eI = eContent.adElm('', 'div').cn('fl wp');
                    switch (typeof _v) {
                        case 'object':
                            new $.UI.Json({ p: _eI, title: k, value: _v });
                            break;
                        default:
                            _eI.h('<li class="h20 lh20 fs13"><div class="fl hp" style="width:21px;"></div><span class="fl fwb" style="max-width:120px;">' + k + ':</span><span class="fl ml5" MTips="1">' + _v + '</span></li>');
                            break;
                    }
                }
                break;
            case 'array':
                for (var i = 0; i < _val.length; i++) {
                    var _v = _val[i], _eI = eContent.adElm('', 'div').cn('fl wp');
                    switch (typeof _v) {
                        case 'object':
                            new $.UI.Json({ p: _eI, title: i, value: _v });
                            break;
                        default:
                            _eI.h('<li class="h20 lh20 fs13"><div class="fl hp" style="width:21px;"></div><span class="fl fwb" MTips="1">' + _v + '</span></li>');
                            break;
                    }
                }
                break;
        }
        return me;
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.Panel = function (args) {
    /* 
    { 
        type: "Panel", 
        desc: "面板组件", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            width: { desc: '宽度, 默认是null, 表示100%填充父容器', defVal:null, dataType: 'int' },
            height: { desc: '高度, 默认是null, 表示100%填充父容器', defVal:null, dataType: 'int' },
            ifFold: { desc: '是否可以关闭', defVal: false, dataType: 'bool' },
            ifFixedHeight: { desc: '是否可以编辑', defVal: false, dataType: 'bool' },
            ifEdit: { desc: '是否可以编辑', defVal: false, dataType: 'bool' },
            ifClose: { desc: '是否可以编辑', defVal: false, dataType: 'bool' },
            cn: { desc: 'classname样式', defVal: '', dataType: 'string' },
            css: { desc: 'css样式', defVal: '', dataType: 'string' },
            skin: { desc: '皮肤样式', defVal: 'Panel-json', dataType: 'string' },
            fieldSetCn: { desc: 'fieldset元素的样式', defVal: '', dataType: 'string' },
            title: { desc: '标题', defVal: '', dataType: 'string' },
            content: { desc: '显示的内容', defVal: '', dataType: 'string' },
            onExpand:{ desc: '回调展开(Expand)事件', defVal: function (){}, dataType: 'function' },
            onClose:{ desc: '回调关闭(Close)事件', defVal: function (){}, dataType: 'function' },
            onClick:{ desc: '回调Click事件', defVal: function (){}, dataType: 'function' }
        }
    } 
    */
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, width: null, height: null, ifFold: false, ifFixedHeight: false, ifEdit: false, ifClose: false, cn: '', css: '', skin: 'Panel-json', fieldSetCn: '', title: '', content: '', onExpand: _fn, onClose: _fn, onClick: _fn };
    var eIcon, eTitle, eContent, sHtml = '<fieldset><legend><a class="expand unfold"></a><span class="fwb"></span><a title="close" class="close"></a><a title="edit" class="edit"></a></legend><div></div></fieldset>';
    function _default() { }
    function _layout() {
        var _cn = args.skin + ' ' + args.cn, _css = args.css;
        if (args.width) { _css += 'width:' + args.width + 'px;'; }
        if (args.height) { _css += 'height:' + args.height + 'px;'; }
        if (args.ifFixedHeight) { _cn += ' hp'; } else { _cn += ' ha'; }
        owner = args.p.adElm('', 'div').cn('wp ' + _cn).css(_css).h(sHtml);
        var _eLeg = owner.fc().fc();
        eIcon = _eLeg.fc(); eTitle = eIcon.ns(); eContent = _eLeg.ns(); me.eContent = me.body = eContent;
        me.setTitle(args.title);
        me.setContent(args.content);
        if (args.ifFold) { me.expand(); }
        _eLeg.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t;
            switch (_e.className) {
                case 'close':
                    if (args.onClose({ Panel: me }) != false) { me.remove(); }; break;
                case 'edit':
                    args.onClick({ Panel: me }); break;
                default:
                    me.expand(); break;
            }
        });
        if (!args.ifEdit) { $(_eLeg.lastChild).r(); }
        if (!args.ifClose) { eTitle.ns().r(); }
    }
    function _event() { }
    me.expand = function () {
        var _cs = eIcon.className.trim();
        if (_cs.indexOf('unfold') != -1) { eIcon.dc('unfold').ac('fold'); eContent.hide(); } else { eIcon.dc('fold').ac('unfold'); eContent.show(); }
        args.onExpand(me, _cs);
        return me;
    }
    me.setTitle = function (v) { eTitle.h(v); return me; }
    me.setContent = function (v) { eContent.h(v); return me; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.AttrPanel = function (args) {
    /* 
    { 
        type: "AttrPanel", 
        desc: "属性面板组件", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            width: { desc: '宽度, 默认是null, 表示100%填充父容器', defVal:null, dataType: 'int' },
            height: { desc: '高度, 默认是null, 表示100%填充父容器', defVal:null, dataType: 'int' },
            titleHeight: { desc: '标题高度', defVal: 25, dataType: 'int' },
            ifFold: { desc: '是否可以关闭', defVal: false, dataType: 'bool' },
            ifFixedHeight: { desc: '是否可以编辑', defVal: false, dataType: 'bool' },
            ifEdit: { desc: '是否可以编辑', defVal: false, dataType: 'bool' },
            ifClose: { desc: '是否可以关闭', defVal: false, dataType: 'bool' },
            icon: { desc: '标题上的图标', defVal: '', dataType: 'string' },
            cn: { desc: 'classname样式', defVal: '', dataType: 'string' },
            css: { desc: 'css样式', defVal: '', dataType: 'string' },
            skin: { desc: '皮肤样式', defVal: 'AttrPanel-default', dataType: 'string' },
            title: { desc: '标题', defVal: '', dataType: 'string' },
            toolBarAry: { desc: '工具栏的Button数组', defVal: '', dataType: 'string' },
            onExpand:{ desc: '回调展开(Expand)事件', defVal: function (){}, dataType: 'function' },
            onToolBarClick:{ desc: '回调工具栏上的Click事件', defVal: function (){}, dataType: 'function' }
        }
    } 
    */
    var me = this, owner, eIcon, eTitle, eContent, _fn = function () { };
    var _args = { p: $DB, width: null, height: null, titleHeight: 25, skin: 'AttrPanel-default', ifFold: true, ifClose: false, ifExpand: true, ifFixedHeight: false, cn: '', css: '', title: '', icon: '', toolBarAry: [], onToolBarClick: _fn, onExpand: _fn };
    var sI = '<a class="ToolBar {0}" title="{1}" key="{2}" ></a>';
    var sHtml = '<fieldset><legend><a></a><span></span>{0}</legend><div></div></fieldset>';
    var scrollBar, _expandIdx = 1;
    function _default() { }
    function _layout() {
        var _cn = args.skin + ' ' + args.cn, _css = args.css, _iAry = args.toolBarAry, _siAry = [];
        if (args.width) { _css += 'width:' + args.width + 'px;'; }
        if (args.height) { _css += 'height:' + args.height + 'px;'; }
        if (args.ifFixedHeight) { _cn += ' hp'; }
        if (args.ifExpand) { _expandIdx++; _iAry.unshift({ name: 'ATTRPANEL-SYS-EXPAND', icon: 'icon-glyph-chevron-right', title: '收起' }); }
        if (args.ifClose) { _expandIdx++; _iAry.unshift({ name: 'ATTRPANEL-SYS-CLOSE', icon: 'icon-glyph-remove', title: '关闭' }); }
        for (var i = 0, _len = _iAry.length; i < _len; i++) {
            var _iObj = _iAry[i] || {};
            _siAry.push(sI.format(_iObj.icon, _iObj.title, _iObj.name));
        }
        owner = args.p.adElm('', 'div').cn('AttrPanel ' + _cn).css(_css).h(sHtml.format(_siAry.join('')));
        var _eLeg = owner.fc().fc().css('height: ' + args.titleHeight + 'px;line-height: ' + args.titleHeight + 'px;').evt('click', function (e) { clickHead(e); });
        eIcon = _eLeg.fc(); eTitle = eIcon.ns(); eContent = _eLeg.ns();
        me.owner = me.eBody = eContent;
        me.setTitle(args.title);
        me.setIcon(args.icon);
        me.setFold(args.ifFold);
    }
    function _event() { }
    function clickHead(e) {
        var e = $.e.fix(e), _e = e.t;
        var _key = _e.attr('key');
        if (!_key) { return; }
        switch (_key) {
            case 'ATTRPANEL-SYS-EXPAND': me.setFold(+_e.attr('state'), _e); break;
            case 'ATTRPANEL-SYS-CLOSE': me.hide(); break;
        }
        args.onToolBarClick({ AttrPanel: me, Key: _key, E: e, _E: _e, Args: args });
        e.stop();
    }

    me.html = function (v) {
        if (!scrollBar) { scrollBar = new $.UI.ScrollBar({ p: me.owner }); }
        scrollBar.html(v); return me;
    }
    me.setFold = function (v, _e, ifExec) {
        if (!_e) { if (_expandIdx != 1) { _e = eIcon.pn().chn(_expandIdx); } else { return me; } }
        if (v) {
            _e.dc('icon-glyph-chevron-down').ac('icon-glyph-chevron-right').attr('state', 0); eContent.show();
        } else {
            _e.dc('icon-glyph-chevron-right').ac('icon-glyph-chevron-down').attr('state', 1); eContent.hide();
        }
        if (ifExec != false) { args.onExpand({ AttrPanel: me, _E: _e, Args: args }); }
        return me;
    }
    me.setTitle = function (title) { eTitle.h(title); return me; };
    me.setIcon = function (icon) { eIcon.cn(icon); return me; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.Mask = function (args) {
    /* 
    { 
        type: "Mask", 
        desc: "遮罩层", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            alpha: { desc: '透明度(百分百%)', defVal: 50, dataType: 'int' },
            cn: { desc: 'classname样式', defVal: '', dataType: 'string' },
            css: { desc: 'css样式', defVal: '', dataType: 'string' },
            onClick:{ desc: '回调Mask上Click事件', defVal: function (){}, dataType: 'function' }
        }
    } 
    */
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, alpha: 20, cn: '', css: '', onClick: function () { } };
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('Mask ' + args.cn).css(args.css).alpha(args.alpha);
        if (isIE) { owner.h('<iframe frameBorder=0 frameBorder="no" allowTransparency="true" border="0" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" style="border-style: none" class="pa bc_0 z-1 dn" srclayout="blank.html"></iframe>'); }
    }
    function _event() { owner.evt('click', function (e) { var e = $.e.fix(e); e.stop(); args.onClick(me); }); };
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.Calendar = function (args) {
    /* 
    { 
        type: "Calendar", 
        desc: "日历组件", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            head_h: { desc: 'head的高度', defVal: 26, dataType: 'int' },
            foot_h: { desc: 'foot的高度', defVal: 30, dataType: 'int' },
            dStyleAry: { desc: '日期样式数组', defVal: [], dataType: 'array' },
            hStyle: { desc: '星期样式', defVal: ['S','M','T','W','T','F','S'], dataType: 'array' },
            disabledDate: { desc: '不启用的日期数组', defVal: [], dataType: 'array' },
            enabledDate: { desc: '启用的日期数组', defVal: [], dataType: 'array' },
            minYear: { desc: '最小年份', defVal: 1910, dataType: 'int' },
            maxYear: { desc: '最大年份', defVal: 2200, dataType: 'int' },
            skin: { desc: '皮肤样式', defVal: 'Calendar-default', dataType: 'string' },
            selCn: { desc: '日期选中样式', defVal: 'td-select', dataType: 'string' },
            nowCn: { desc: '当天选中样式', defVal: 'td-now', dataType: 'string' },
            disabledCn: { desc: '日期不能选的样式', defVal: 'td-disabled', dataType: 'string' },
            nowD: { desc: '当天时间', defVal: '', dataType: 'string' },
            selDate: { desc: '选中时间', defVal: '', dataType: 'string' },
            ifLockYM: { desc: '是否锁住年月', defVal: false, dataType: 'bool' },
            ifLockDay: { desc: '是否锁住日期', defVal: false, dataType: 'bool' },
            ifClose: { desc: '是否有关闭按钮', defVal: false, dataType: 'bool' },
            onClick:{ desc: '回调Click事件', defVal: function (){}, dataType: 'function' },
            onClickBefore:{ desc: '回调Click之前的事件', defVal: function (){}, dataType: 'function' },
            onClose:{ desc: '回调关闭的事件', defVal: function (){}, dataType: 'function' },
            onYMClick:{ desc: '回调年月的Click事件', defVal: function (){}, dataType: 'function' },
            onHMSClose:{ desc: '回调时分秒的Click事件', defVal: function (){}, dataType: 'function' },
            onBtnClick:{ desc: '回调Button的Click事件', defVal: function (){}, dataType: 'function' }
        }
    } 
    */
    var me = this, owner, _fn = function () { };
    var _args = {
        p: $DB, dStyleAry: [], hStyle: 'SMTWTFS'.split(''), head_h: 26, foot_h: 0, ifLockYM: false, ifLockDay: false, ifClose: false, disabledDate: [], enabledDate: [],
        minYear: 1910, maxYear: 2200, skin: 'Calendar-default', selCn: 'td-select', nowCn: 'td-now', disabledCn: 'td-disabled', nowD: '', selDate: '',
        onClick: _fn, onClickBefore: _fn, onClose: _fn, onYMClick: _fn, onHMSClose: _fn, onBtnClick: _fn
    };
    var eBody, eTable, _eY, _eM, selDate, attr = {}, tdIdxAry = [], _ifEnPart = false;
    me.eSelTD;
    function _default() {
        selDate = args.nowD; args.disabledObj = {}; args.abledObj = {};
        for (var di = 0, _diLen = args.disabledDate.length; di < _diLen; di++) { args.disabledObj[args.disabledDate[di]] = true; }
        for (var ai = 0, _aiLen = args.enabledDate.length; ai < _aiLen; ai++) { args.abledObj[args.enabledDate[ai]] = true; _ifEnPart = true; }
    }
    function _layout() {
        var _base = new $.UI.BaseDiv({ p: args.p, ifFixedHeight: true, head_h: args.head_h, foot_h: args.foot_h, skin: 'BaseDiv-Calendar' });
        owner = _base.base; eBody = _base.body; fillBody(args.nowD); fillHead(_base.head); fillFoot(_base.foot);
        if (args.ifLockDay) { eBody.adElm('', 'div').cn('lockDay').h('<span>日期已被锁定, 请选择时分秒!</span><div></div>'); }
    }
    function _event() {
        eBody.evt('click', function (e) {
            var e = $.e.fix(e), _e = findTD(e.t), _cn = _e.className;
            if (_cn.indexOf(args.disabledCn) == -1) {
                var _val = _e.attr('dvalue');
                if (args.onClickBefore({ Calendar: me, Value: _val, _E: _e }) == false) { return; }
                if (me.eSelTD) { me.eSelTD.dc(args.selCn); }
                _e.ac(args.selCn);
                me.eSelTD = _e; selDate = _val;
                args.onClick({ Calendar: me, Value: _val });
            }
        });
        args.p.evt('click', function (e) { var e = $.e.fix(e); hidePopMYTips(); e.stop(); })
    }
    function findTD(_e) { return _e.tagName == 'TD' ? _e : findTD(_e.pn()); }
    function getHtmlByDate(date) {
        var nowD = new Date(), nowM, dAry, fD = new Date(), sD = new Date(), _now_D = new Date(), fDWeek, i, d, s1 = [], s2 = [];
        var _initTDH = $.m.p((args.p.csn('height') - (args.head_h + args.foot_h + 35)) / 6), _initTDW = $.m.p((args.p.csn('width') / 7)), isC = false;
        var dStyleAry = args.dStyleAry;
        if (args.skin == 'Calendar-container') { isC = true; }
        nowD = date ? nowD.str2Date(date) : nowD;
        me.nowD = nowD;
        nowM = nowD.getMonth(); dAry = nowD.date2Str().split(' ')[0].split('-');
        dAry[2] = 1;
        fD.str2Date(dAry.join("-"));
        fDWeek = fD.getDay() + 1;
        sD = fD;
        sD.setDate(sD.getDate() - fDWeek);
        for (d = 0; d < 6; d++) {
            var colAry = [];
            for (i = 0; i < 7; i++) {
                sD.setDate(sD.getDate() + 1);
                var _d = sD.date8("-"), c = (dStyleAry[_d] ? dStyleAry[_d] : "cp"), cNowDStyle = '', cSelDStyle = '';
                if (sD.getMonth() != nowM) {
                    c = args.disabledCn + ' cna';
                } else {
                    if (selDate && sD.date8("-") == selDate) { cSelDStyle = ' ' + args.selCn; }
                }
                if (_ifEnPart) {
                    if (args.abledObj[_d]) { c = ''; } else { c = args.disabledCn + ' cna'; }
                } else {
                    if (args.disabledObj[_d]) { c = args.disabledCn + ' cna'; }
                }
                var _nowDate = _now_D.date2Str().split(' ');
                var _selectDate = sD.getFullYear() + "-" + ((+sD.getMonth()) + 1) + "-" + sD.getDate();
                if (_selectDate == _nowDate[0]) {
                    if (nowD.getMonth() == sD.getMonth()) { cNowDStyle = ' ' + args.nowCn + ' '; }
                }
                var _tdHtml = '<td style="' + (i == 6 ? '' : 'border-right:1px solid #cccccc;') + 'border-top:1px solid #cccccc;' + (isC ? 'height:' + _initTDH + 'px;width:' + _initTDW + 'px;' : '') + '" class=" ' + c + ' ' + cNowDStyle + cSelDStyle + ' fs12" dValue="' + _d + '">';
                if (isC) {
                    _tdHtml += '<div class="month-date">' + sD.getDate() + '</div><UL></UL><div></div>';
                } else {
                    _tdHtml += sD.getDate();
                }
                _tdHtml += '</td>';
                tdIdxAry[_d] = [d, i];
                colAry.push(_tdHtml);
            }
            s1.push(colAry.join(''));
        }
        for (i = 0; i < 7; i++) { s2.push('<tr>' + (i == 0 ? '<th>' + args.hStyle.join('</th><th>') + '</th>' : s1[i - 1]) + '</tr>'); }
        var st = '<div class="Calendar ' + args.skin + '"><table>' + s2.join('') + '</table></div>';
        return st;
    }
    function hidePopMYTips() { $.Dialog.destroy('calendar'); }
    function popMYTips(_e, items, fn) {
        var _pTips = $.Dialog.get({ ePop: _e, css: 'min-width:80px;max-height:150px;overflow: hidden;' }, 'calendar').hide(), _f = fn || _fn;
        _pTips.init({ type: 'Menu', items: items }).show().evt('onClick', function (obj) { _f(obj, _pTips); _pTips.hide(); });
    }
    function fillHead(eHead) {
        var _iconCn = 'cal-icon', _year = me.nowD.getFullYear(), _month = me.nowD.getMonth() + 1;
        if (args.ifLockYM) { _iconCn = 'cal-icon-hidden'; }
        eHead.h('<a class="yLeft {2}">&nbsp;&nbsp;&nbsp;&nbsp;</a><a class="yCenter cal-text" year="{0}">{0}年</a><a class="yRight {2}">&nbsp;&nbsp;&nbsp;&nbsp;</a><a class="mLeft {2}">&nbsp;&nbsp;&nbsp;&nbsp;</a><a class="mCenter cal-text" month="{1}">{1}月</a><a class="mRight {2}">&nbsp;&nbsp;&nbsp;&nbsp;</a>'.format(_year, _month, _iconCn));
        _eY = eHead.chn(1); _eM = eHead.chn(4);
        if (args.ifLockYM) { return false; }
        eHead.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t, _rCn = _e.className.split(' ')[0]; hidePopMYTips();
            if (_e.tagName != 'A') { return; }
            switch (_rCn.trim()) {
                case 'yLeft':
                    me.setYM((+_eY.attr('year')) - 1);
                    break;
                case 'yCenter':
                    if (!attr.yearItems) {
                        attr.yearItems = [];
                        for (var i = _year + 3; i > _year - 3; i--) { attr.yearItems.push({ name: i, text: i }); }
                    }
                    popMYTips(_e, attr.yearItems, function (obj) { me.setYM(obj.Name); });
                    break;
                case 'yRight':
                    me.setYM((+_eY.attr('year')) + 1);
                    break;
                case 'mLeft':
                    var _m = +_eM.attr('month') - 1, _y = +_eY.attr('year');
                    if (_m < 1) { _y = _y - 1; _m = 12; }
                    me.setYM(_y, _m);
                    break;
                case 'mCenter':
                    if (!attr.monthItems) {
                        attr.monthItems = [];
                        for (var i = 1; i < 13; i++) { attr.monthItems.push({ name: i, text: i }); }
                    }
                    popMYTips(_e, attr.monthItems, function (obj) { me.setYM(null, obj.Name); });
                    break;
                case 'mRight':
                    var _m = +_eM.attr('month') + 1, _y = +_eY.attr('year');
                    if (_m > 12) { _y = _y + 1; _m = 1; }
                    me.setYM(_y, _m);
                    break;
            }
            e.stop();
        });
    }
    function fillBody(date) { var _sData = date || me.nowD; eBody.h(getHtmlByDate(_sData)); eTable = eBody.fc().fc(); }
    function fillFoot(p) {
        p.css('overflow:hideen;').h('<a>12</a><a>12</a><a>12</a>');
    }
    me.setYM = function (year, month, day) {
        var _y = year || me.nowD.getFullYear(), _m = month || me.nowD.getMonth() + 1, _d = day || me.nowD.getDate();
        var _ymdStr = _y + '-' + _m + '-' + _d;
        _eY.attr('year', _y).h(_y + '&nbsp;年'); _eM.attr('month', _m).h(_m + '&nbsp;月');
        fillBody(_ymdStr);
        args.onYMClick(_ymdStr);
    }
    me.getCurrYM = function () { var _y = _eY.attr('year'), _m = _eM.attr('month'); return [_y, _m]; }
    me.resize = function () {
        var _pH = me.p.csn('height'), _tdH = $.m.p((_pH - _foot_h - 61) / 6);
        var _pW = me.p.csn('width'), _tdW = $.m.p(_pW / 7);
        var _tds = _body.find('td'), _len = _tds.length, i;
        for (i = 0; i < _len; i++) {
            var _eTD = _tds[i];
            if (_eTD && _eTD.tagName == 'TD') { $(_eTD).css('height:' + _tdH + 'px;width:' + _tdW + 'px;'); }
        }
    }
    me.getTDByDate = function (v) {
        var _idx = tdIdxAry[v];
        if (_idx) {
            var rId = _idx[0] + 1, cId = _idx[1];
            return $(eTable.rows[rId].cells[cId]);
        }
    }
    me.setToday = function () {
        var _nd = new Date, _y = _nd.getFullYear(), _m = _nd.getMonth() + 1;
        eYObj.innerHTML = _y; eMObj.innerHTML = _m; layout();
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.Tab = function (args) {
    /* 
    { 
        type: "Tab", 
        desc: "可以进行切换的Tab", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            head_h: { desc: 'head的高度', defVal: 35, dataType: 'int' },
            items: { desc: '每一个元素TabItemJSON对象的数组', defVal: [], dataType: 'array' },
            toolBarAry: { desc: '工具栏项数组', defVal: [], dataType: 'array' },
            skin: { desc: '皮肤样式', defVal: 'BaseDiv-Gray', dataType: 'string' },
            cn: { desc: 'classname样式', defVal: '', dataType: 'string' },
            css: { desc: 'css样式', defVal: '', dataType: 'string' },
            btnSkin: { desc: '工具栏的皮肤样式', defVal: 'Button-tab', dataType: 'string' },
            loadMode: { desc: '加载模式', defVal: 'auto', dataType: 'string', comType:'Radios', sons:[{value:'auto',text:'自动加载'},{value:'click',text:'单机加载'}] },
            ifFixedBodyHeight: { desc: '是否固定TabBody的高度', defVal: true, dataType: 'bool' },
            onClose:{ desc: '回调每个Item的关闭事件', defVal: function (){}, dataType: 'function' },
            onTabClick:{ desc: '回调Tab上Item的Click事件', defVal: function (){}, dataType: 'function' },
            onToolBarClick:{ desc: '回调工具栏上Click事件', defVal: function (){}, dataType: 'function' }
        },
        itemArgs:{
            name: { desc: '可作为items中唯一标示的名称', defVal: 'button', dataType: 'string' },
            type: { desc: 'item类型', defVal: 'tab', dataType: 'string' },
            text: { desc: '显示文字', defVal: 'auto', dataType: 'string' },
            content: { desc: 'body上显示的内容', defVal: 'auto', dataType: 'string' },
            icon: { desc: '显示的图标', defVal: 'auto', dataType: 'string' },
            visibled: { desc: '是否可见', defVal: true, dataType: 'bool' },
            disabled: { desc: '是否启用', defVal: false, dataType: 'bool' },
            ifPress: { desc: '是否选中', defVal: false, dataType: 'bool' },
            ifClose: { desc: '是否可关闭', defVal: false, dataType: 'bool' },
            onClick: { desc: '回调Click事件', defVal: function (){}, dataType: 'function' },
            onClose: { desc: '回调Close关闭事件', defVal: function (){}, dataType: 'function' }
        }
    } 
    */
    var me = this, owner, eHead, eBody, _fn = function () { };
    var _args = { p: $DB, items: [], head_h: 35, toolBarAry: [], skin: 'BaseDiv-tab', cn: '', css: '', ifFixedBodyHeight: true, btnSkin: 'Button-tab', loadMode: 'auto', onClose: _fn, onTabClick: _fn, onToolBarClick: _fn };
    var iArgs = { name: 'button', type: 'tab', text: '', js: '', url: '', visibled: true, disabled: false, content: '', icon: '', ifPress: false, ifClose: false, onClick: _fn, onClose: _fn }
    var btnSet, toolSet, nCounter = new $.nCount();
    me.items = {};
    me.aItems = [];
    me.selItem;
    function _default() {
        var _eBase;
        if (!args.pHead || !args.pBody) {
            if (args.ifFixedBodyHeight) {
                _eBase = new $.UI.BaseDiv({ p: args.p, head_h: args.head_h, foot_h: 0, skin: args.skin, cn: args.cn, css: args.css });
                eHead = _eBase.head; eBody = _eBase.body;
            } else {
                _eBase = args.p.adElm('', 'div').cn('Tab ' + args.skin + ' ' + args.cn).css(args.css).h('<div class="Tab-Head" style="height:' + args.head_h + 'px;line-height:' + args.head_h + 'px;"></div><div class="Tab-Body"></div>');
                eHead = _eBase.fc(); eBody = eHead.ns();
            }
        } else {
            eHead = args.pHead; eBody = args.pBody;
        }
    }
    function _layout() {
        btnSet = new $.UI.ButtonGroup({ p: eHead, skin: 'ButtonSet-tab', onClick: function (obj) { clickTab(obj.Name); }, onClose: function (obj) { me.closeTab(obj.Name); } });
        toolSet = new $.UI.ButtonSet({ p: eHead, itemAlign: 'right', items: args.toolBarAry, onClick: function (obj) { obj.Tab = me; args.onToolBarClick(obj); } });
        var _selName = 0;
        for (var i = 0, _len = args.items.length; i < _len; i++) {
            var _iObj = args.items[i];
            if (_iObj.ifPress) { _selName = _iObj.name; }
            _iObj.ifPress = false;
            me.addTabItem(_iObj, 0);
        }
        me.setSelTab(_selName); me.BtnSet = btnSet;
    }
    function _event() {
        btnSet.onClose = function (j) {
            var _jBtn = j.jAttr, _len = me.items.length, _name = _jBtn.name, _idx = _jBtn.idx;
            me.deleteTabItem(_name);
            while (_idx > 0 && _idx < _len) {
                var _item;
                if (_idx == 0) { _idx++; } else { _idx--; }
                _item = me.items[_idx];
                if (_item) {
                    me.setSelItem(_item);
                    break;
                } else {
                    _idx--;
                }
            }
        }
    }
    me.getItem = function (v) {
        if (v == null) { return; }
        if ($.getType(v) == 'object') { return v; }
        return me.items[v];
    }
    me.getLenth = function () { return me.aItems.length; }
    me.closeTab = function (v) {
        var _item = me.getItem(v);
        if (_item) { _item.Body.r(); args.onClose(_item); _item = null; }
        me.setSelTab(0);
        return me;
    }
    function clickTab(v) {
        var _item = me.getItem(v);
        if (_item) {
            var _name = _item.Name;
            if (me.selItem) { if (me.selItem.Name == _name) { } me.selItem.Body.hide(); }
            if (args.loadMode == 'click') {
                var _eBody = _item.Body, _cStr = _item.Args.content, _js = _item.Args.js, _url = _item.Args.url;
                if (_cStr) {
                    _eBody.h(_cStr);
                } else if (_js) {
                    new $.UI.View({ p: _eBody, url: _js, onLoad: function (view) { _item.View = view; } });
                } else if (_url) {

                }
            }
            _item.Body.show();
            me.selItem = _item;
            $.Dialog.destroyAll();
            _item.Tab = me;
            args.onTabClick(_item);
        }
        return _item;
    }
    me.getTabBtn = function (v) { return btnSet.getItem(v); }
    me.setSelTab = function (v) { btnSet.fireClick(v, null, true); return me; }
    me.clear = function () {
        for (var i = 0, _len = me.aItem.length; i < _len; i++) { me.closeTab(i); }
        me.items = {};
        me.aItems = [];
        me.selItem = null;
    }
    me.addTabItem = function (j, ifShow) {
        for (var i in iArgs) { if (j[i] == null) { j[i] = iArgs[i]; } }
        j.type = 'tab';
        if (!j.skin) { j.skin = args.btnSkin; }
        var _id = nCounter.getN(), _name = j.name, _content = j.content, _ifPress = j.ifPress;
        if (_ifPress) { j.ifPress = false; }
        var _btn = btnSet.addItem(j, true), _body = eBody.adElm('', 'div').hide();
        var _item = { Button: _btn, Body: _body, Args: j, Name: j.name, Idx: _id, set: _btn.set, get: _btn.get };
        if (args.ifFixedBodyHeight) { _body.ac('wp hp'); }
        if (args.loadMode == 'auto') {
            if (_content) {
                _body.h(_content);
            } else if (j.js) {
                new $.UI.View({ p: _body, url: j.js, onLoad: function (view) { _item.View = view; } });
            } else if (j.url) {

            }
        }
        me.items[_id] = me.items[_name] = _item;
        me.aItems.push(_item);
        if (_ifPress || ifShow) { me.setSelTab(_name); }
        return _item;
    }
    me.setTabText = function (k, v) { btnSet.setText(k, v); return me; }
    me.setTabIcon = function (k, v) { btnSet.setIcon(k, v); return me; }
    me.setTabContent = function () { };
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.ProgressBar = function (args) {
    /* 
    { 
        type: "ProgressBar", 
        desc: "自定义的进度条", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            barHeight: { desc: 'bar的高度', defVal: 18, dataType: 'int' },
            defValue: { desc: '初始化默认值', defVal: 0, dataType: 'int' },
            skin: { desc: '皮肤样式', defVal: '', dataType: 'string' },
            cn: { desc: 'cn样式', defVal: '', dataType: 'string' },
            css: { desc: 'css样式', defVal: '', dataType: 'string' }
        }
    } 
    */
    var me = this, owner, eBar, _fn = function () { };
    var _args = { p: $DB, barHeight: 18, value: 0, cn: '', css: '', skin: '' };
    function _default() { args.barHeight = args.barHeight>18?18:args.barHeight; }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('ProgressBar ' + args.skin + ' ' + args.cn).css('height:' + args.barHeight + 'px;' + args.css).h('<div></div>');
        eBar = owner.fc();
        me.setValue(args.value);
    }
    function _event() { }
    me.setValue = function (v, ease) {
        if (v == undefined || v == null) { return; }
        v = +v;
        if (v > 100) { v = 100; }
        if (v < 0) { v = 0; }
        args.value = v;
        eBar.attr('title', v + '%').h(v + '%');
        if (eBar.ease) {
            eBar.ease(['width'], [v], 1000, 1, {}, 1, '%');
        } else {
            eBar.css('width:' + v + '%;');
        }
    }
    me.getValue = function () { return args.value; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.Accordion = function (args) {
    /* 
    { 
        type: "ProgressBar", 
        desc: "自定义的进度条", 
        args: { 
            p: { desc: '父容器', defVal: '$DB', dataType: 'DOM' },
            width: { desc: '宽度, 默认是null, 表示100%填充父容器', defVal: null, dataType: 'int' },
            height: { desc: '高度, 默认是null, 表示100%填充父容器', defVal: null, dataType: 'int' },
            ifFixedHeight: { desc: '是否固定高度', defVal: true, dataType: 'bool' },
            titleHeight: { desc: '标题高度', defVal: 26, dataType: 'int' },
            skin: { desc: '皮肤样式', defVal: '', dataType: 'string' },
            cn: { desc: 'cn样式', defVal: '', dataType: 'string' },
            css: { desc: 'css样式', defVal: '', dataType: 'string' },
            items: { desc: 'item项数组', defVal: [], dataType: 'array' },
            onItemExpand: { desc: '回调每个Item的展开事件', defVal: function (){}, dataType: 'function' },
            onItemToolBarClick: { desc: '回调每个Item右上角工具栏的Click事件', defVal: function (){}, dataType: 'function' }
        },
        itemArgs: {
            name: { desc: '可通过name作为索引获取每个Item项', defVal: '', dataType: 'string' },
            title: { desc: '标题文字', defVal: '', dataType: 'string' },
            icon: { desc: '标题图片', defVal: '', dataType: 'string' },
            ifClose: { desc: '是否可以关闭', defVal: false, dataType: 'bool' }
        }
    } 
    */
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, width: null, height: null, ifFixedHeight: true, titleHeight: 26, skin: '', cn: '', css: '', items: [], onItemExpand: _fn, onItemToolBarClick: _fn }, iArgs;
    var count, ifInit = true, curr, sumHeight = 0;
    me.items = {};
    me.aItem = [];
    me.selItem = null;
    function _default() {
        count = new $.nCount();
        if (args.width != null) { args.css += ';width:' + w + 'px;'; } else { args.cn += ' wp'; }
        if (args.height != null) { args.css += ';height:' + h + 'px;'; } else { args.cn += ' hp'; }
        if (args.ifFixedHeight) { args.cn += ' oh'; }
    }
    function _layout() {
        owner = args.p.adElm('', 'div').cn(args.cn).css(args.css);
        iArgs = { p: owner, name: '', title: '', icon: '', ifClose: false };
        for (var i = 0, _iLen = args.items.length; i < _iLen; i++) { me.addItem(args.items[i]); }
        me.setSelItem(0);
    }
    function _event() {
        $(window).evt('resize', function () { curr.owner.css('height:' + (owner.csn('height') - sumHeight + curr.args.titleHeight + 1) + 'px;'); });
    }
    function onItemExpand(obj) {
        if (args.ifFixedHeight) {
            if (ifInit) { me.resize(); ifInit = false; }
            if (me.selItem && me.selItem != obj) { me.selItem.setFold(false, null, false); }
            me.selItem = obj;
        }
        args.onItemExpand({ Accordion: me, AttrPanel: obj });
    }
    function onItemToolBarClick(obj) {
        obj.Accordion = me;
        if (obj.AttrPanel == curr) { return false; }
        curr.owner.css('height:' + (curr.args.titleHeight + 1) + 'px;'); curr = obj.AttrPanel;
        curr.owner.css('height:' + (owner.csn('height') - sumHeight + curr.args.titleHeight + 1) + 'px;');
        args.onItemToolBarClick(obj);
    }
    me.addItem = function (j) {
        var _iArgs = $.init(j, iArgs), _name = _iArgs.name; _iArgs.ifUnfold = false; _iArgs.titleHeight = args.titleHeight; sumHeight += ((args.titleHeight || 0) + 1);
        var _item = new $.UI.AttrPanel(_iArgs), _idx = count.getN();
        _item.setFold(false).evt('onExpand', function (obj) { onItemExpand(obj.AttrPanel); }).evt('onToolBarClick', onItemToolBarClick);
        me.items[_name] = me.items[_idx] = _item;
        me.aItem.push(_item);
        return _item;
    }
    me.setSelItem = function (v) {
        var _item = (typeof v == 'object')?v:me.items[v];
        if (_item) { curr = _item; _item.setFold(true); _item.owner.css('height:' + (owner.csn('height') - sumHeight + _item.args.titleHeight + 1) + 'px;'); }
        return me;
    }
    me.resize = function () { curr.owner.css('height:' + (owner.csn('height') - sumHeight + curr.args.titleHeight + 1) + 'px;'); return me; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.BarCode = function (args) {
    /* 
    { 
        type: "BarCode", 
        desc: "条形码", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            itemHeight: { desc: '条形码每一帧的高度', defVal: 'FileBrowser-default', dataType: 'string' },
            itemWidth: { desc: '条形码每一帧的宽度', defVal: '', dataType: 'string' },
            code: { desc: '条形码字符串', defVal: '', dataType: 'string' },
            color0: { desc: '颜色0', defVal: '#fff', dataType: 'string' },
            color1: { desc: '颜色1', defVal: '#000', dataType: 'string' },
            onScan: { desc: '扫描枪扫描时执行的回调函数', defVal: function (){}, dataType: 'function' }
        },
        method: {
            setCode: { desc: '动态设置扫描码', args: { cArgs: '扫描码对象', ifSetDefault: '是否初始化扫描码对象' }, return: '$.UI.BarCode' },
            getHelper: { desc: "获取组件帮助信息", args: {}, return: "帮助对象" },
            evt: { desc: "给组件绑定该组件允许绑定的事件", args: { name: "事件名", fn: "事件" }, return: '$.UI.BarCode' },
            getAttr: { desc: "获取属性", args: { "key": "属性名" }, 'return': "属性值" },
            setAttr: { desc: "动态设置属性值", args: { key: "属性名", value: "属性值" }, return: '$.UI.BarCode' },
            init: { desc: "初始化组件", args: { "j": "组件对象" }, return: '$.UI.BarCode' }
        }
    } 
    */
    var me = this, owner, eGraph, eStr, _fn = function () { };
    var _args = { p: $DB, itemHeight: 50, itemWidth: 1, code: '', value: '', onScan: _fn, color0: '#fff', color1: '#000' };
    var itemHtml = '<a class="dib w0" style="height:{0}px;border-left:{1}px solid {2};"></a>';
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').h('<div class="ma wp tac" style="margin: 5px 0px;"></div><div class="tac"></div>');
        eGraph = owner.fc(); eStr = eGraph.ns();
        if (args.value != null) { me.setValue(args.value); } else { me.setCode(args); }
    }
    function _event() { }
    function toCodeHtml(cArgs, ifSetDefault) {
        if (ifSetDefault) { $.init(cArgs, _args); }
        var _str = cArgs.code;
        if (!_str) { return; }
        var _ary = _str.split(''), _len = _ary.length, _hAry = [];
        for (var i = 0; i < _len; i++) {
            var _val = +_ary[i], _bc = cArgs.color0;
            if (_val) { _bc = cArgs.color1; }
            _hAry.push(itemHtml.format(cArgs.itemHeight, cArgs.itemWidth, _bc));
        }
        return _hAry.join('');
    }
    me.setCode = function (cArgs, ifSetDefault) { var _str = cArgs.code; if (!_str) { return me; }; eGraph.h(toCodeHtml(cArgs, ifSetDefault)); return me; }
    me.setValue = function (value) { if (value == null) { return me; }; var _obj = { code: $.Util.code.code128.getDigit(value) }; eStr.h(value); return me.setCode(_obj, true); }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.FileBrowser = function (args) {
    /* 
    { 
        type: "FileBrowser", 
        desc: "web版的文件浏览器, 可以查看服务器中每个路径的文件", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            skin: { desc: '皮肤样式', defVal: 'FileBrowser-default', dataType: 'string' },
            cn: { desc: 'cn样式', defVal: '', dataType: 'string' },
            css: { desc: 'css样式', defVal: '', dataType: 'string' },
            fileType: { desc: '文件类型', defVal: '*', dataType: 'string' },
            dir: { desc: '相符服务器目录路径', defVal: 'View', dataType: 'string' },
            layout: { desc: '文件浏览布局形式', defVal: 'list', dataType: 'string', comType: 'Radios', sons: [{value:'list',text:'列表形式'},{value:'block',text:'块状形式'}] },
            onFileClick: { desc: '回调单机文件的事件', defVal: function (){}, dataType: 'function' },
            onFoldClick: { desc: '回调单机文件夹的事件', defVal: function (){}, dataType: 'function' },
            onClick: { desc: '回调单机事件', defVal: function (){}, dataType: 'function' },
            onExpand: { desc: '回调文件夹展开的事件', defVal: function (){}, dataType: 'function' }
        }
    } 
    */
    var me = this, owner, ePath, eBody, _fn = function () { };
    var _args = { p: $DB, skin: 'FileBrowser-default', fileType: '*', cn: '', css: '', dir: 'View', layout: 'list', onFileClick: _fn, onFoldClick: _fn, onClick: _fn, onExpand: _fn };
    function _default() { }
    function _layout() {
        var _temp = new $.UI.BaseDiv({ p: args.p, head_h: 30 });
        owner = _temp.base; ePath = _temp.head; eBody = _temp.body.cn(args.skin + ' ' + args.cn).css(args.css).h('<ul></ul>').fc();
        switch (args.layout) {
            case 'list':
                loadListDirFiles(args.dir, null);
                break;
            case 'block':
                loadBlockDirFiles(args.dir);
                break;
            case '':

                break;
        }
    }
    function _event() {
        eBody.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t;
            var _obj = findTarget(_e), _dir = _e.attr('_dir'), _eLi = _obj.eLi;
            _obj.FileBrowser = me;
            if (_obj.tag == 'flag' && _dir) {
                var _cn = _obj.cn, _eIcon = _e.ns();
                switch (_cn) {
                    case 'flag-close':
                        loadDirFiles(_dir, _eLi, function (len) { if (len) { _e.cn('flag-open'); } else { _e.cn(''); } _eIcon.cn('icon-open'); });
                        break;
                    case 'flag-open':
                        disposeChild(_eLi); _e.cn('flag-close'); _eIcon.cn('icon-close');
                }
                args.onExpand(_obj);
            } else {
                if (_eLi.className == 'dir') { args.onFoldClick(); } else { args.onFileClick(_obj); }
                args.onClick(_obj);
            }
            e.stop();
        });
    }
    function loadBlockDirFiles(dir, eStart, cbFn) {
        var _ePre = eStart, _fn = cbFn || function () { };
        loadData(dir, function (obj) {


        });
    }
    function loadListDirFiles(dir, eStart, cbFn) {
        var _ePre = eStart, _fn = cbFn || function () { };
        loadData(dir, function (obj) {
            var _sAry = obj.get(0), _len = 0;
            if (_sAry.length > 1) {
                var _oAry = eval(_sAry), _eLI, _spaces = '', _depth = 1;
                _len = _oAry.length;
                if (_ePre) {
                    _depth = +_ePre.attr('_depth');
                    for (var _d = 0; _d < _depth; _d++) { _spaces += '<a></a>'; }
                    _depth++;
                }
                for (var i = 0; i < _len; i++) {
                    var _file = _oAry[i], _type = _file.type, _dir = _file.currPath || '', _fcn = '';
                    if (+_file.count) { _fcn = 'flag-close'; }
                    if (_ePre) { _eLI = _ePre.aeElm('', 'li'); _ePre = _eLI; } else { _eLI = eBody.adElm('', 'li'); }
                    _eLI.cn(_type).h(_spaces + '<a class="' + _fcn + '" _dir="' + _dir + '" ></a><a class="icon-close"></a><span>' + _file.name + '</span><a class="update"></a><a class="del"></a>').attr('_depth', _depth).attr('name', _file.name).attr('fullName', _file.fullName || '');
                }
            }
            _fn(_len);
        });
    }
    function loadData(dir, cbFn) {
        var _fn = cbFn || function () { };
        $.Util.ajax({ args: { m: 'SYS_CM_FILES', action: 'getDirFiles', dir: dir, fileType: args.fileType }, onSuccess: function (obj) { _fn(obj); } });
    }
    function disposeChild(eStart) { if (eStart) { removeChild(eStart.ns(), eStart.attr('_depth')); } }
    function removeChild(child, depth) { if (child && child.attr('_depth') != depth) { removeChild(child.ns(), depth); child.r(); child = null; } }
    function findTarget(_e) {
        var _tn = _e.tagName, _tag = { _e: _e };
        switch (_tn) {
            case 'A':
                var _cn = _e.className;
                _tag['eLi'] = _e.pn(); _tag['tag'] = _cn.split('-')[0]; _tag['cn'] = _cn;
                break;
            case 'SPAN':
                _tag['eLi'] = _e.pn(); _tag['tag'] = 'text';
                break;
            case 'LI':
                _tag['eLi'] = _e; _tag['tag'] = 'li';
                break;
        }
        return _tag;
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.FileUploader = function (args) {
    /* 
    { 
        type: "FileUploader", 
        desc: "文件上传组件", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            skin: { desc: '皮肤样式', defVal: 'FileUploader-default', dataType: 'string' },
            cn: { desc: 'cn样式', defVal: '', dataType: 'string' },
            css: { desc: 'css样式', defVal: '', dataType: 'string' },
            dataType: { desc: '请求文件信息的格式', defVal: 'json', dataType: 'string', comType: 'Radios', sons: [{value:'json',text:'JSON'},{value:'html',text:'HTML'}] },
            timeout: { desc: '每个文件上传成功延迟的时间', defVal: 1000, dataType: 'int' },
            mId: { desc: '模块ID', defVal: 4, dataType: 'int' },
            catelogId: { desc: '上传文件目录ID', defVal: 0, dataType: 'int' },
            catelog: { desc: '应用实例ID', defVal: '', dataType: 'int' },
            maxSize: { desc: '文件最大值', defVal: 20 * 1024 * 1024, dataType: 'int' },
            denyFileFormat: { desc: '不允许上传文件格式列表', defVal: ['exe', 'bat'], dataType: 'array' },
            allowFileFormat: { desc: '允许上传文件格式列表', defVal: [], dataType: 'array' },
            specialFiles: { desc: '特殊文件列表', defVal: [], dataType: 'array' },
            onTimeout: { desc: '回调上传文件超时的事件', defVal: function (){}, dataType: 'function' },
            onComplete: { desc: '回调上传文件完成的事件', defVal: function (){}, dataType: 'function' },
            onSuccess: { desc: '回调上传成功的事件', defVal: function (){}, dataType: 'function' },
            onError: { desc: '回调上传失败的事件', defVal: function (){}, dataType: 'function' }
        }
    } 
    */
    var me = this, owner, _fn = function () { };
    var _args = {
        p: $DB, ifMultiFile: false, dataType: 'json', timeout: 1000, cn: '', css: '', skin: 'FileUploader-default', ifAddFile: true,
        denyFileFormat: ['bat'], specialFiles: [], allowFileFormat: [], maxSize: 20 * 1024 * 1024,
        onSuccess: _fn, onTimeout: _fn, onError: _fn, onComplete: _fn
    };
    var eIframe, eHead, eBody, eFileName;
    var counter = new $.nCount(), xml, htmlTemp, queue, toolBar;
    var _ifInit = true, currIdx = 0, currObj;
    var errorFnAry = [], denyFileAry = [], inputAry = {}, fileCount = 0;
    var currSuccFileAry = [], succFileAry = [], currIds = [];
    var _tAry = [{ name: 'start', text: '开始上传', state: 'stop', icon: 'icon-glyph-circle-arrow-up', css: 'width: 40%;', align: 'center', skin: 'btn-info' }];
    function _default() {
        queue = new $.q({ delay: 0, onFinish: onUploadFinish });
        htmlTemp = {
            chain: '<form target="upload" method="post" enctype="multipart/form-data" ><div class="detail" ></div><div><a class="close" _title="删除"></a><a><span>选择文件</span><input type="file" name="Uploader_{0}" /></a></div></form>',
            detail: '<div class="fl hp" style="width:60px;"><div class="{0}" style="margin:8px auto;width:54px;height:54px;display: block;" ></div></div><div  class="fl hp" ><p class="mt5 fwb">{1}</p><p>Size： {2}</p></div>',
            special: '<form target="upload" method="post" enctype="multipart/form-data" ><div class="detail" ></div><div><a><span>选择文件</span><input type="file" name="Uploader_{0}" /></a><a title="正在上传" class="state uploading dn"></a></div></form>',
            spDetail: '<div class="fl hp" style="width:60px;"><div class="{0}" style="margin:8px auto;width:54px;height:54px;display: block;" ></div></div><div  class="fl hp" ><p class="mt5 fwb">{1}</p><p>Size： </p><p>状态：<span title="检查中..." class="check-state checking"></span></p></div>'
        }
        args.ifAddFile?_tAry.push({ name: 'add', text: '添加文件', icon: 'icon-glyph-plus-sign', css: 'width: 40%;', align: 'center' }):void(0);
    }
    function _layout() {
        owner = args.p.adElm('', 'div').cn(args.skin + ' ' + args.cn).css(args.css).h('<iframe name="upload" style="display:none;"></iframe>');
        eIframe = owner.fc();
        eHead = owner.adElm('', 'div').cn('FU-head');
        eBody = owner.adElm('', 'div').cn('FU-body');
        toolBar = new $.UI.ButtonSet({ p: eHead, css: 'text-align: center;padding-bottom: 10px;border-bottom: 1px dashed rgb(235, 226, 226);', itemAlign: 'right', onClick: onOperClick, items: _tAry });
        var _spAry = args.specialFiles, _spLen = _spAry.length;
        if (_spLen) {
            var _fileAry = [], _eCheckObj = {}, _checkObj = {};
            for (var i = 0; i < _spLen; i++) {
                var _fAry = me.addSpecialFile(_spAry[i]), _name = _fAry[0], _fName = "'" + _name + "'";
                _eCheckObj[_name] = _fAry[2];
                _checkObj[_name] = false;
                _fileAry.push(_fName);
            }
            getSpeciFilesState(_fileAry, function (d) {
                var _data = d.data[0];
                if (_data) {
                    var _rAry = eval(_data), _rLen = _rAry.length;
                    for (var _r = 0; _r < _rLen; _r++) { var _rn = _rAry[_r]['origName']; _checkObj[_rn] = _rAry[_r]['id']; }
                }
                for (var _idx in _eCheckObj) {
                    var _eImg = _eCheckObj[_idx], _val = _checkObj[_idx] || 0;
                    _eImg.dc('checking').attr('fid', _val);
                    if (_val) {
                        _eImg.ac('check-exist').attr('title', '已经上传过了');
                        _eImg.bbElm('', 'a').cn('download').attr('title', '下载').attr('href', 'Module/SYS_CM_FILES.aspx?action=downloadFile&id=' + _val);
                    } else {
                        _eImg.ac('check-not-exist').attr('title', '还没上传哦');
                    }
                }
            });
        } else {
            me.addNormalFile();
        }
    }
    function _event() {
        if (window.attachEvent) {
            eIframe.attachEvent('onload', uploadCallback);
        } else {
            eIframe.addEventListener('load', uploadCallback, false);
        }
    }
    function onOperClick(obj) {
        switch (obj.Name) {
            case 'start':
                var _btn = obj.Button;
                if (_btn.get('state') == 'stop') {
                    if (me.submit() != false) {
                        _btn.set('state', 'run').setIcon('icon-glyph-pause').setText('暂停');
                        toolBar.items['add'].setEnabled(false);
                    } else {

                    }
                } else {
                    _btn.set('state', 'stop').setIcon('icon-glyph-upload').setText('续传');
                }
                break;
            case 'add':
                me.addNormalFile();
                break;
        }
    }
    function setUploadState(filename) {
        
    }
    function getUploadUrl() {
        var _url = '../Module/SYS_CM_FILES.aspx?', _api = args.uploadApi || ('action=uploadFile&mId=' + args.mId + '&catelogId=' + args.catelogId + '&catelog=' + args.catelog);
        return _url + _api;
    }
    function getSpeciFilesState(fileAry, onSucFn) {
        var _fn = onSucFn || function () { };
        $.Util.ajax({
            url: $.global.getImgPath() + 'Module/SYS_CM_FILES.aspx',
            args: { action: 'getFiles', fileNames: fileAry.join(','), dataType: 'json', ifSpecialFile: 1 },
            onSuccess: function (d) { _fn(d); }
        });
    }
    function checkFileType(type, extFile) {
        if (!type) { return false; }
        if (extFile == 'default') { return true; }
        if (!extFile) { extFile = args.denyFileFormat; }
        var _strReg = '', _type = $.getType(extFile);
        if (_type == 'string') { _strReg = extFile };
        if (_type == 'array') { _strReg = extFile.join('|'); }
        var _fTReg = new RegExp('(' + _strReg + ')$');
        if (_fTReg.test(type)) { return true; } else { return false; }
    }
    function uploadCallback(isTimeout) {
        var io = eIframe, status = isTimeout, _str;
        try {
            xml = {};
            if (io.contentWindow) {
                _str = xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
                xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;
            } else if (io.contentDocument) {
                _str = xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
                xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
            }
            if (status == 'timeout') { onTimeout(xml, status); } else { status = "success"; }
        } catch (e) {
            status = "error";
        }
        _str = _str.toHtml().replaceAll("\\", "\/");
        var _dAry = _str.split('\u0003'), _fObj;
        if (_dAry[0] == "errorInfo=0") {
            _dAry = eval(_dAry.pop());
            _fObj = _dAry[0];
            status = "success";
        } else {
            _str = _str.split('=')[1];
            status = "error";
        }
        if (currObj) {
            var _tipStr = '上传成功';
            if (status == 'error') { _tipStr = _str; }
            if (currObj['eDel']) { currObj['eDel'].r(); }
            currObj['eImg'].dc('uploading').ac(status).attr('title', _tipStr);
            if (status == "success") {
                setUploadState(currObj.fileName);
                if (currObj['eState']) { currObj['eState'].dc('error_16').dc('check-not-exist').ac('ok_16').attr('title', '已经上传过了'); }
                currSuccFileAry.push(_fObj); succFileAry.push(_fObj); currIds.push(_fObj.id);
                args.onSuccess({ FileUploader: me, File: _fObj, State: currObj });
            } else {
                args.onError({ FileUploader: me, Message: _str });
            }
        }
        queue.next(function () { return false; });
    }
    function urlToObj(_e) {
        if (!_e) { return; }
        var _name, _fileType, _fullName, _size, _location, _strSize = '';
        if (_e.files) {
            var _file = _e.files[0];
            _fullName = _file.name; _ary = _fullName.split('.');
            _name = _ary[0]; _fileType = _ary.pop(); _size = _file.size;
        } else {
            var url = _e.value;
            var _ary = url.split('\\'), _last = _ary.pop();
            var _dAry = _last.split('.');
            _name = _dAry[0]; _fullName = _last;
            _fileType = _dAry.pop(); _location = _ary.join('\\'); _size = _e.size;
        }
        if (isIE) {
            try {
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                _size = fso.GetFile(_e.value).size;
            } catch (e) {
                _size = '需要您手动降低IE浏览器的安全级别';
            }
        }
        if (_size > 1024 * 1024) {
            _size = (_size / (1024 * 1024)).toFixed(2) + 'M';
        } else if (_size > 1024) {
            _size = (_size / 1024).toFixed(2) + 'KB';
        } else {
            if (typeof _size == 'number') { _size = _size + '字节'; }
        }
        return { 'location': _location, 'fileType': _fileType, 'name': _name, 'fullName': _fullName, 'size': _size };
    }
    function fireClick(p) {
        if (!p) { return; }
        p = $(p);
        if (p.click) {
            p.click();
        } else {
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, true);
            p.dispatchEvent(evt);
        }
    }
    function onUploadFinish() {
        eFileName.h('');
        fileCount = currIdx = 0;
        for (var i = 0; i < errorFnAry.length; i++) { queue.push(errorFnAry[i]); }
        var _obj = {
            responseText: xml,
            status: status,
            allSuccFiles: succFileAry,
            currSuccFiles: currSuccFileAry,
            currIds: currIds
        };
        toolBar.items['start'].setText('开始').setIcon('icon-glyph-circle-arrow-up');
        toolBar.items['add'].setEnabled(true);
        args.onComplete(_obj);
        currSuccFileAry = []; currIds = [];
    }
    me.submit = function () {
        if (_ifInit) {
            if (denyFileAry.length || !fileCount) { return false; };
            proBar.setValue(0);
            queue.go(function () { return false; });
            _ifInit = false;
        } else {
            queue.go(function () { return false; });
        }
    }
    me.addSpecialFile = function (j) {
        var _name = counter.getN() + (new Date()).getTime(), _j = j || {};
        var _ext = _j.ext || '*', _name = _j.name || 'test', _file = _name + '.' + _ext;
        if (_ext == '*') { _ext = 'default'; }
        var _eItem = eBody.abElm('', 'li').cn('special-file').h(htmlTemp.special.format(counter.getN() + (new Date()).getTime()));
        var _eForm = _eItem.fc(), _eDetail = _eForm.fc().h(htmlTemp.spDetail.format('icon-filetype-' + _ext, _file)), _eOper = _eDetail.ns();
        var _eInput = _eOper.fc().chn(1).alpha(0), _eState = _eDetail.chn(1).chn(2).chn(1);
        var _obj = {
            f: function () {
                if (_eDetail.chn(1)) {
                    if (!_eInput.value) { errorFnAry.push(_obj); queue.next(function () { return false; }, true); return; }
                    var _eD = _eDetail.chn(1), _strFN = _eD.fc().h(), _fid = +_eState.attr('fid');
                    _eOper.fc().ac('dn'); $(_eOper.lastChild).dc('dn');
                    currObj = { eImg: $(_eOper.lastChild), eState: _eState, fileName: _strFN, ifSpecial: true, fid: _fid };
                    _eForm.action = getUploadUrl() + '&specialFileName=' + _file + '.' + _fid;
                    _eForm.submit();
                } else {
                    errorFnAry.push(_obj);
                    queue.next();
                }
            },
            args: []
        };
        queue.push(_obj);
        _eInput.evt('change', function (e) {
            var e = $.e.fix(e), _e = e.t; proBar.setValue(0, 1);
            var _obj = urlToObj(_e), _fType = _obj['fileType'].toLow();
            if (checkFileType(_fType, _ext)) {
                if (!inputAry[_name]) { fileCount++; inputAry[_name] = true; }
                if (_ext == 'default') { _eDetail.fc().fc().className = 'icon-filetype-' + _fType; }
                _eDetail.chn(1).chn(1).h('Size：' + _obj['size']);
                _eItem.dc('bc_c27');
                denyFileAry.re(_eItem);
                _eItem.attr('title', '当前特殊文件原始名：' + _obj['fullName']);
            } else {
                _eItem.ac('bc_c27');
                denyFileAry.push(_eItem);
                _eItem.attr('title', _obj['fullName'] + '的格式(只允许' + _ext + '文件)不对, 请重新选择文件!');
            }
            e.stop();
        });
        return [_name, _file, _eState];
    }
    me.addNormalFile = function () {
        var _name = counter.getN() + (new Date()).getTime();
        var _eItem = eBody.adElm('', 'li').h(htmlTemp.chain.format(_name));
        eBody.scrollTop = eBody.csn('height');
        var _eForm = _eItem.fc(), _eDetail = _eForm.fc(), _eOper = _eDetail.ns(), _eDel = _eOper.fc(), _eState = _eDel.ns(), _eInput = _eState.chn(1);
        var _obj = {
            f: function () {
                if (_eDetail.chn(1)) {
                    var _eD = _eDetail.chn(1), _strFN = _eD.fc().h();
                    _eState.hide();
                    _eOper.adElm('', 'div').cn('wp hp').h('<a title="正在上传" class="state uploading"></a>');
                    currObj = { eImg: _eState.ns().fc(), eDel: _eDel, fileName: _strFN };
                    _eForm.action = getUploadUrl();
                    _eForm.submit();
                } else {
                    errorFnAry.push(_obj);
                    queue.next();
                }
            },
            args: []
        };
        queue.push(_obj);
        _eInput.evt('change', function (e) {
            var e = $.e.fix(e), _e = e.t;
            var _obj = urlToObj(_e), _fType = _obj['fileType'].toLow();
            if (!checkFileType(_fType)) {
                if (!inputAry[_name]) { fileCount++; inputAry[_name] = true; }
                _eDetail.h(htmlTemp.detail.format('icon-filetype-' + _fType, _obj['fullName'], _obj['size']));
                _eItem.dc('bc_c27');
                denyFileAry.re(_eItem);
            } else {
                _eDetail.h('<div class="lh30 wp">文件名：' + _obj['fullName'] + '</div><div class="c_6 lh30">详细错误：' + _fType + '格式文件不允许上传，请重新选择文件!</div>');
                _eItem.ac('bc_c27');
                denyFileAry.push(_eItem);
            }
            e.stop();
        }).alpha(0);
        _eDel.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t, _n = _e.ns().chn(1).name;
            if (inputAry[_n]) { fileCount--; inputAry[_n] = null; }
            denyFileAry.re(_eItem); _eItem.r(); _eItem = null;
            queue.remove(_obj);
        });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.FlowChart = function (args) {
    /* 
    { 
        type: "FlowChart", 
        desc: "流程图工具", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            skin: { desc: '皮肤样式', defVal: 'FlowChart-default', dataType: 'string' },
            cn: { desc: 'cn样式', defVal: '', dataType: 'string' },
            css: { desc: 'css样式', defVal: '', dataType: 'string' },
            pointSize: { desc: '点的大小', defVal: 30, dataType: 'int' },
            ifDragCreate: { desc: '是否是通过拖动来创建节点', defVal: true, dataType: 'bool' },
            onPointClick: { desc: '回调点的Click事件', defVal: function (){}, dataType: 'function' },
            onPointDrag: { desc: '回调点的拖动事件', defVal: function (){}, dataType: 'function' },
            onLineClick: { desc: '回调线的Click事件', defVal: function (){}, dataType: 'function' },
            onOwnerClick: { desc: '回调容器的Click事件', defVal: function (){}, dataType: 'function' },
            onLinkEnd: { desc: '回调线结束的事件', defVal: function (){}, dataType: 'function' },
            onPressDrag: { desc: '回调按下拖动事件', defVal: function (){}, dataType: 'function' }
        }
    } 
    */
    var wf_me = this, owner, _fn = function () { };
    var _args = {
        p: $DB, skin: 'FlowChart-default', cn: '', css: '', ifDragCreate: true, pointSize: 30,
        onPointClick: _fn, onPointDrag: _fn, onLineClick: _fn, onOwnerClick: _fn, onLinkEnd: _fn, onPressDrag: _fn
    };
    //*************************全局变量*******************
    wf_me.hashPoint = []; 		//节点hash集合
    wf_me.selElm = null; 		//当前选中那个元素
    wf_me.nodeAry = []; 		//存放节点的数组
    wf_me.firstPoint; 		//第一个(开始)节点
    var nCount = new $.nCount(); //节点递增
    var downKey = 0; 			//按下的key是否是ctrl
    var downX, downY, downFlag; //按下的xy 是否按下标记
    var downMc, downPoint; 				//存储按下后产生的虚线
    var overElm; 				//当前over的元素
    var lineMask;
    function _default() {

    }
    function _layout() {
        owner = args.p.ac(args.skin + ' ' + args.cn).css(args.css);
    }
    function _event() {
        $D.evt('keydown', function (e) {
            var e = $.e.fix(e), _e = e.t;
            if (e.code == 17) { downKey = 17; $D.title = "ctrl press"; }
            if (e.code == 46 && wf_me.selElm) { deletePoint(wf_me.selElm.id); wf_me.selElm = null; wf_me.selPoint = null; }
        }).evt('keyup', function (e) {
            var e = $.e.fix(e), _e = e.t;
            downKey = 0; $D.title = "ctrl up";
            if (downMc) { downMc.clear(); downMc.r(); downMc = null; }
        }).evt('mousemove', function (e) {
            var e = $.e.fix(e), _e = e.t;
            if (downKey != 17) { return; }
            if (downFlag && downMc) {
                var x = downX, y = downY;
                var docX = $D.documentElement.scrollLeft + e.clientX;
                var docY = $D.documentElement.scrollTop + e.clientY;
                var dx = Math.abs(docX - x), dy = Math.abs(docY - y);
                var sx, sy, ddx, ddy, ex, ey;
                var size = 5
                switch (checkDir(downX, downY, docX, docY)) {
                    case 1:
                        sx = 0; sy = 0;
                        ddx = downX; ddy = downY;
                        ex = dx; ey = dy;
                        dx -= size; dy -= size;
                        break;
                    case 2:
                        sx = dx; sy = 0;
                        ddx = downX - dx; ddy = downY;
                        ex = 0; ey = dy;
                        ddx += size; ddy -= size;
                        break;
                    case 3:
                        sx = dx; sy = dy;
                        ddx = downX - dx; ddy = downY - dy;
                        ex = 0; ey = 0;
                        ddx += size; ddy += size;
                        break;
                    case 4:
                        sx = 0; sy = dy;
                        ddx = downX; ddy = downY - dy;
                        ex = dx; ey = 0;
                        ddx -= size; ddy += size;
                        break;
                }
                downMc.setPos(ddx - owner.pos().x, ddy - owner.pos().y, dx, dy).lineStyle(2, "#060", "round")
					.beginPath().mTo(sx, sy).dTo(ex, ey, 10, 3).stroke().css('zIndex:100').cn('pa');
                if (!lineMask) { lineMask = owner.adElm('', 'div').cn('pa bc_10 wp hp z3').alpha(0); }
                var elm = $($D.elementFromPoint(e.clientX, e.clientY));
                args.onPressDrag({ FlowChart: wf_me, CurrElm: elm, DownPoint: downPoint, DownMC: downMc, SX: sx, SY: sy, EX: ex, EY: ey });
            }
        });

        owner.evt('click', function (e) {
            if (downKey == 17) { return; }
            var e = $.e.fix(e), _e = e.t, _tn = _e.tagName;
            if (_e == owner) {
                if (wf_me.selElm) { wf_me.selElm.dc('node-sel').ac('node-normal'); }
                wf_me.selElm = null; wf_me.selPoint = null;
                args.onOwnerClick({ FlowChart: wf_me, _e: _e });
            } else {
                if (_tn == 'CANVAS' || _tn == 'A') { _e = _e.pn(); }
                if (wf_me.selElm && (wf_me.selElm.className.indexOf('node-normal') == -1)) { wf_me.selElm.dc('node-sel').ac('node-normal'); }
                var _node = wf_me.hashPoint[_e.id], _ecn = _e.className;
                var _cbReturn = { FlowChart: wf_me, _e: _e, eTxt: $(_e.lastChild) };
                if (_ecn == 'line') {
                    wf_me.selPoint = null;
                    _cbReturn.Line = _node; args.onLineClick(_cbReturn);
                } else {
                    wf_me.selElm = _e; wf_me.selPoint = _node;
                    if (_ecn.indexOf('node-sel') == -1) { _e.dc('node-normal').ac('node-sel'); }
                    _cbReturn.Point = _node; args.onPointClick(_cbReturn);
                }
            }
        }).evt('mouseup', function (e) {
            var e = $.e.fix(e), _e = e.t;
            if (downKey == 17 && downFlag == true) {
                if (downMc) { downMc.clear(); downMc.r(); downMc = null; }
                if (wf_me.selElm) {
                    var _selID = wf_me.selElm.id, _selPoint = wf_me.hashPoint[_selID];
                    if (overElm) {   //连接一个已经存在的节点
                        var _overPoint = wf_me.hashPoint[overElm.id];
                        if (_selPoint.next.indexOf(overElm.id) >= 0) { return; }
                        if (args.onLinkEnd({ FlowChart: wf_me, Start: _selPoint, End: _overPoint }) != false) {
                            var lineMc = new createLine({
                                id: _selID + "#" + overElm.id,
                                x: _selPoint.x,
                                y: _selPoint.y,
                                x1: _overPoint.x,
                                y1: _overPoint.y,
                                next: overElm.id,
                                pre: _selID,
                                type: 'line'
                            });
                        }
                    } else {  //连接未存在的节点
                        var _de = $D.documentElement, _oPos = owner.pos();
                        var sX = _selPoint.x, sY = _selPoint.y;
                        var eX = _de.scrollLeft + e.clientX - _oPos.x, eY = _de.scrollTop + e.clientY - _oPos.y;
                        if (args.ifDragCreate && args.onLinkEnd({ FlowChart: wf_me, Start: _selPoint, SX: sX, SY: sY, EX: eX, EY: eY }) != false) {
                            var mc = new createPoint({ x: eX, y: eY, type: 'point' });
                            var lineMc = new createLine({ id: _selID + "#" + mc.id, type: 'line', x: sX, y: sY, x1: eX, y1: eY, next: mc.id, pre: _selID });
                        }
                    }
                    if (lineMask) { lineMask.r(); lineMask = null; }
                }
            }
            downFlag = false;
        }).evt("mousemove", function () { $.noSel(); });
    }
    //返回鼠标象限方向标志
    function checkDir(x, y, x1, y1) {
        var flag = 0;
        var x = ((x - x1) <= 0) ? x : x1;
        var y = ((y - y1) <= 0) ? y : y1;
        if (x != x1 && y != y1) { flag = 1; }
        if (x == x1 && y != y1) { flag = 2; }
        if (x == x1 && y == y1) { flag = 3; }
        if (x != x1 && y == y1) { flag = 4; }
        return flag;
    }

    //画线+节点 方法	
    function drawLineNode(x, y, x1, y1, lineObj) {
        var pointSize = args.pointSize;
        x = x + pointSize / 2;
        y = y + pointSize / 2;
        x1 = x1 + pointSize / 2;
        y1 = y1 + pointSize / 2;
        var dx = Math.abs(x - x1) + 3, dy = Math.abs(y - y1) + 3;
        var flag = checkDir(x, y, x1, y1);
        switch (flag) {
            case 1:
                break;
            case 2:
                x = x - dx;
                break;
            case 3:
                x = x - dx;
                y = y - dy;
                break;
            case 4:
                y = y - dy;
                break;
        }
        if (lineObj.id) { $(lineObj.id).css($.box(x + ',' + y + ',' + dx + ',' + dy)); }
        var _l = 10;
        var cp = 0.55;
        var ct = Math.PI / 16;
        var x = ((x - x1) <= 0) ? x : x1;
        var y = ((y - y1) <= 0) ? y : y1;
        var _pxOld = dx / 2; 							//t=0.5的坐标
        var _pyOld = dy / 2;
        var _px = dx * (Math.pow(cp, 3) - 1.5 * Math.pow(cp, 2) + 1.5 * cp); 	//t=0.6时的坐标
        var _py = dy * (3 * Math.pow(cp, 2) - 2 * Math.pow(cp, 3));
        var _dpx = Math.abs(_px - _pxOld); 								//两点的x,y相差距离
        var _dpy = Math.abs(_py - _pyOld);
        var _deg = Math.atan(_dpy / _dpx); 							//两点连接的线段的角度（斜率）
        _deg = Math.PI - _deg;
        var _dx1 = _px + _l * Math.cos(_deg + ct); 							//箭头的一个方向点x,y坐标
        var _dy1 = _py - _l * Math.sin(_deg + ct);
        var cx = _px + _l * 2 * Math.cos(_deg);
        var cy = _py - _l * 2 * Math.sin(_deg);
        var _dx2 = _px + _l * Math.cos(_deg - ct); 							//箭头的另一个方向点坐标
        var _dy2 = _py - _l * Math.sin(_deg - ct);
        var sx, sy, ex, ey;
        switch (flag) {
            case 1:
                sx = 0; sy = 0; ex = dx; ey = dy;
                break;
            case 2:
                sx = dx; sy = 0; ex = 0; ey = dy;
                _px = dx - _px; _dx1 = dx - _dx1; _dx2 = dx - _dx2;
                cx = dx - cx;
                break;
            case 3:
                sx = 0; sy = 0; ex = dx; ey = dy; _px = dx - _px; _dx1 = dx - _dx1;
                _dx2 = dx - _dx2; _py = dy - _py; _dy1 = dy - _dy1; _dy2 = dy - _dy2;
                cx = dx - cx; cy = dy - cy;
                break;
            case 4:
                sx = dx; sy = 0; ex = 0; ey = dy; _py = dy - _py;
                _dy1 = dy - _dy1; _dy2 = dy - _dy2;
                cy = dy - cy;
                break;
        }
        lineObj.setPos(0, 0, dx < 10 ? 10 : dx, dy < 10 ? 10 : dy).ac('').lineStyle(1, "#ccc").beginPath().mTo(sx, sy).bTo(dx / 2, 0, dx / 2, dy, ex, ey).stroke().beginPath().lineStyle(1, "red", "round").mTo(_dx1, _dy1).lTo(_px, _py).mTo(_dx2, _dy2).lTo(_px, _py).lTo(cx, cy).stroke().ac('z1');
        return lineObj;
    }


    function joinNode(obj) {
        var _j = obj || {}, _pre = _j.pre, _next = _j.next;
        var _pNode = wf_me.hashPoint[_pre], _nNode = wf_me.hashPoint[_next];
        var mc = new createLine({
            id: _j.id,
            txt: _j.txt,
            x: _pNode.x,
            y: _pNode.y,
            x1: _nNode.x,
            y1: _nNode.y,
            lineObj: new $.draw({ p: owner })
        });
        mc.next = _next;
        mc.pre = _pre;
        wf_me.hashPoint[_pre].next = _pNode.next.ac(_next);
        wf_me.hashPoint[_next].pre = _nNode.pre.ac(_pre);
    }

    function createLine(j) {
        var line = this, pointSize = args.pointSize;
        var x = j.x || 0, y = j.y || 0;
        var x1 = j.x1 || 0, y1 = j.y1 || 0, _next = j.next || '', _pre = j.pre || '';
        var lineObj = j.lineObj || new $.draw({ p: owner });
        var _txt = j.txt || '', _id = j.id;
        var dx = Math.abs(x1 - x), dy = Math.abs(y1 - y);
        drawLineNode(x, y, x1, y1, lineObj);
        switch (checkDir(x, y, x1, y1)) {
            case 1:

                break;
            case 2:
                x = x - dx;
                break;
            case 3:
                x = x - dx;
                y = y - dy;
                break;
            case 4:
                y = y - dy;
                break;
        }
        var elm = owner.adElm(_id, 'div').cn('line').css($.box((x + pointSize / 2) + ',' + (y + pointSize / 2) + ',' + dx + ',' + dy));
        lineObj.appendTo(elm);
        var eTxt = elm.adElm('', 'A').cn('line-text').h(_txt);
        lineObj.id = _id;
        line.type = 'line';
        line.id = _id;
        line.mc = lineObj;
        line.elm = elm;
        line.next = _next;
        line.pre = _pre;
        line.txt = _txt;
        if (_next && _pre) {
            wf_me.hashPoint[_pre].next = wf_me.hashPoint[_pre].next.ac(_next);
            wf_me.hashPoint[_next].pre = wf_me.hashPoint[_next].pre.ac(_pre);
        }
        line.set = function (key, value) { if (!key) { return; } if (key == 'txt') { eTxt.h(value); } line[key] = value; return line; }
        line.remove = function () { elm.r(); line = null; }
        line.getJson = function () { return { id: line.id, type: line.type, next: line.next, pre: line.pre, txt: line.txt }; }
        wf_me.hashPoint[_id] = line;
        return line;
    }


    function createPoint(j) {
        var point = this, pointSize = args.pointSize;
        var x = j.x || 0, y = j.y || 0;
        var sTxt = "Node_" + nCount.getN();
        var _txt = j.txt || sTxt, _id = j.id || sTxt, _col = j.color || '#18f';
        x = x < 0 ? 0 : x;
        y = y < 0 ? 0 : y;
        var elm = owner.adElm(_id, 'div').cn('point node-normal').css($.box(x + ',' + y + ',' + pointSize + ',' + pointSize));
        var mc = new $.draw({ p: owner });
        mc.setPos(0, 0, pointSize, pointSize).lineStyle(1, "#999", "round").drawRect(0, 0, pointSize, pointSize, 6, _col).appendTo(elm);
        var eTxt = elm.adElm('', 'A').cn('point-text').css('left:' + (pointSize + 5) + 'px;top:0px;').h(_txt);
        $.drag.init(elm);
        mc.evt('mouseover', function (e) { overElm = elm; }).evt('mouseout', function (e) { overElm = null; });
        elm.onDragStart = function (x, y, e) {
            var e = $.e.fix(e), _e = e.t;
            if (_e.tagName == "CANVAS" || _e.tagName == 'shape') {
                if (wf_me.selElm) { wf_me.selElm.dc('node-sel').ac('node-normal'); }
                elm.dc('node-normal').ac('node-sel');
                if (downKey == 17) {
                    downX = elm.pos().x + pointSize / 2;
                    downY = elm.pos().y + pointSize / 2;
                    downFlag = true; downPoint = point;
                    downMc = new $.draw({ p: owner });
                }
            }
            wf_me.selElm = elm; wf_me.selPoint = point;
            if (downKey == 17) { elm.dragable = false; } else { elm.dragable = true; }
        }
        elm.onDragEnd = function () { }
        elm.onDrag = function () {
            var _x = this.csn('left'), _y = this.csn('top');
            resetLines(_x, _y);
            point.x = _x; point.y = _y;
            args.onPointDrag({ FlowChart: wf_me, Point: point, X: _x, Y: _y });
        }
        point.id = _id;
        point.type = 'point';
        point.ext = j.ext || {};
        point.mc = mc;
        point.elm = elm;
        point.next = '';
        point.pre = '';
        point.x = x;
        point.y = y;
        point.color = _col;
        point.txt = _txt;
        point.getJson = function () { return { id: point.id, type: 'point', next: point.next, pre: point.pre, txt: point.txt, x: point.x, y: point.y, color: point.color, ext: point.ext }; }
        point.getExtJson = function () { return point.ext; }
        point.set = function (key, value) {
            if (!key) { return; }
            switch (key) {
                case 'color':
                    mc.drawRect(0, 0, pointSize, pointSize, 6, value);
                    break;
                case 'txt':
                    eTxt.h(value);
                    break;
                case 'x':
                    val = +value;
                    elm.css('left:' + value + 'px;');
                    resetLines(value, point.y);
                    break;
                case 'y':
                    val = +value;
                    elm.css('top:' + value + 'px;');
                    resetLines(point.x, value);
                    break;
            }
            point[key] = value;
            return point;
        }
        point.setExt = function (key, value) { if (!key) { return; } point.ext[key] = value; return point; }
        point.getExt = function (key) { return point.ext[key]; }
        function resetLines(_x, _y) {
            var _preAry = point.pre.split(' '), _p_len = _preAry.length;
            var _nextAry = point.next.split(' '), _n_len = _nextAry.length;
            //父亲连线
            for (var i = 0; i < _p_len; i++) {
                var _pre = _preAry[i], _key = _pre + "#" + _id, _pNode = wf_me.hashPoint[_pre];
                if (!wf_me.hashPoint[_key]) { continue; }
                drawLineNode(_pNode.x, _pNode.y, _x, _y, wf_me.hashPoint[_key].mc);
            }
            //儿子连线
            for (var i = 0; i < _n_len; i++) {
                var _next = _nextAry[i], _key = _id + "#" + _next, _pNext = wf_me.hashPoint[_next];
                if (!wf_me.hashPoint[_key]) { continue; }
                drawLineNode(_x, _y, _pNext.x, _pNext.y, wf_me.hashPoint[_key].mc);
            }
        }
        if (!wf_me.firstPoint) { wf_me.firstPoint = point; }
        wf_me.hashPoint[_id] = point;
        return point;
    }

    function deletePoint(key) {
        var _point = wf_me.hashPoint[key], _type;
        if (!_point) { return; }
        _type = _point.type || '';
        switch (_type) {
            case "point":
                var aPre = _point.pre.split(" "), _p_len = aPre.length;
                var aNext = _point.next.split(" "), _n_len = aNext.length;
                for (var i = 0; i < _p_len; i++) {
                    var _pre = aPre[i], _prePoint = wf_me.hashPoint[_pre];
                    if (_prePoint) {
                        wf_me.hashPoint[_pre].next = _prePoint.next.dc(key);
                        $(_prePoint.id + "#" + key).r();
                        wf_me.hashPoint[_prePoint.id + "#" + key] = null;
                    }
                }
                for (var i = 0; i < _n_len; i++) {
                    var _next = aNext[i], _nextPoint = wf_me.hashPoint[_next];
                    if (_nextPoint) {
                        wf_me.hashPoint[aNext[i]].pre = _nextPoint.pre.dc(key);
                        $(wf_me.hashPoint[key + "#" + _next].id).r();
                        wf_me.hashPoint[wf_me.hashPoint[key + "#" + _next].id] = null;
                    }
                }
                $(key).r();
                wf_me.hashPoint[key] = null;
                break;
            case "line":
                var pre = _point.pre, next = _point.next;
                if (wf_me.hashPoint[pre]) {
                    wf_me.hashPoint[pre].next = wf_me.hashPoint[pre].next.dc(next);
                }
                if (wf_me.hashPoint[next]) {
                    wf_me.hashPoint[next].pre = wf_me.hashPoint[next].pre.dc(pre);
                }
                $(key).r();
                wf_me.hashPoint[key] = null;
                break;
        }
    }
    wf_me.load = function (obj) {
        if (!obj) { return wf_me; }
        var maxId = 0, _len = obj.length;
        for (var i = 0; i < _len; i++) {
            var _j = obj[i] || {}, _type = _j.type;
            switch (_type) {
                case "point":
                    var objId = _j.id, _currIdx = (+objId.split('_')[1]);
                    maxId = maxId < _currIdx ? _currIdx : maxId;
                    new createPoint(_j);
                    break;
                case "line":
                    var _pre = _j.pre, _next = _j.next;
                    var _pNode = wf_me.hashPoint[_pre], _nNode = wf_me.hashPoint[_next];
                    _j.x = _pNode.x; _j.y = _pNode.y; _j.x1 = _nNode.x; _j.y1 = _nNode.y;
                    new createLine(_j);
                    break;
            }

        }
        nCount.setN(maxId);
        return wf_me;
    }

    wf_me.firePointClick = function (id, fn) {
        var _point = wf_me.hashPoint[id], _f = fn || args.onPointClick;
        if (!_point) { _point = wf_me.firstPoint; }
        if (_point) {
            var elm = _point.elm;
            if (wf_me.selElm) { wf_me.selElm.dc('node-sel').ac('node-normal'); }
            elm.dc('node-normal').ac('node-sel');
            wf_me.selElm = elm; wf_me.selPoint = _point;
            _f({ FlowChart: wf_me, Point: _point });
        }
    }

    wf_me.reLoad = function (dataAry) {
        owner.h('');
        wf_me.hashPoint = []; 		//节点hash集合
        wf_me.selElm = null; 		//当前选中那个元素
        wf_me.nodeAry = []; 		//存放节点的数组
        wf_me.selPoint = null;
        wf_me.firstPoint = null;
        nCount.setN(0);
        wf_me.load(dataAry);
    }
    //对外公共方法
    wf_me.setNodeAttr = function (id, key, value) {
        var _node = hashPoint[id], _val = value || '';
        if (!_node || !key) { return; }
        _node.set(key, _val);
        return wf_me;
    }
    wf_me.getCurrIdx = function () { return nCount.getN(); }
    wf_me.addNode = function (j, ifReturn) { //创建一个节点
        var point;
        if (j.type == 'point') { point = new createPoint(j); } else { point = new createLine(j); }
        if (ifReturn) { return point; }
        return wf_me;
    }
    wf_me.joinNode = joinNode; 									//画线连接2个id
    wf_me.deleteNode = deletePoint; 								//删除一个节点			
    wf_me.getNode = function (key) { if (typeof key == 'string') { return wf_me.hashPoint[key]; } else { return key; } }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.Chat = function (args) {
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, cn: '', css: '', socketServer: 'http://127.0.0.1:8081' };
    var socket, _dialogs = {}, _userHash = {}, _currUserId = $.ck.get('SESSIONID'), _socketId, _socketHash = {};
    function _default() {
        //socket = io.connect(args.socketServer);
    }
    function _layout() {
        owner = args.p.adElm('', 'ul').cn('chat-user-list').css(args.css);
        loadUsers();
    }
    function _event() {
        owner.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t;
            if (_e.tagName == 'A' && _e.className == 'talk') {
                if (_e.pn().className.ec('gray')) { return; }
                var _uid = +_e.attr('uid');
                if (!_dialogs[_uid]) { _dialogs[_uid] = new $.UI.ChatDialog({ socket: socket, userName: _e.attr('uName'), userId: _uid }); }
                _dialogs[_uid].show();
            }
        });
        /*
        socket.on('connect', function (data, a, b) {
            console.log('socket-connect-success');
            _socketId = socket.socket.sessionid;
            _socketHash[_socketId] = socket.socket;
            socket.emit('login', { loginId: $.ck.get('SESSIONID'), socketId: _socketId });
        });
        socket.on('disconnect', function (data) {
            console.log('socket--disconnect');
            socket.emit('quit', { loginId: $.ck.get('SESSIONID'), socketId: _socketId });
        });
        socket.on('quit', function (data) {
            console.log('socket--quit');
            console.log(data);
        });
        socket.on('pushOnLineUsers', function (data) {
            console.log('pushOnLineUsers');
            var _hash = data.socketHash, _sId = socket.socket.sessionid;
            for (var k in _hash) {
                var _userObj = _userHash[+_hash[k].loginId];
                if (k != _sId && _userObj && _userObj.eLi) { _userObj.eLi.dc('gray'); }
            }
        });
        socket.on('notice', function (data) {
            var _cId = +_currUserId, _fId = +data.from, _tId = +data.to;
            data.fromValue = _userHash[_fId]; data.toValue = _userHash[_tId];
            if (_cId == _fId) { data.ifSelf = true; } else { data.ifSelf = false; }
            if (_cId == _fId || _cId == _tId) {
                var _dialog = _dialogs[_fId];
                if (_dialog) {
                    _dialog.show();
                } else {
                    _dialog = _dialogs[_fId] = new $.UI.ChatDialog({ socket: socket, userName: data.fromValue.uid, userId: data.from });
                }
                _dialog.addMsg(data);
            }
        });*/
    }
    function loadUsers() {
        $.Util.ajax({
            args: 'm=SYS_CM_USERS&action=getAllUsers&keyFields=id,uid,avatar&dataType=json',
            onSuccess: function (d) {
                var _uAry = eval(d.get(0) || '[]');
                for (var i = 0, _len = _uAry.length; i < _len; i++) {
                    var _user = _uAry[i], _id = _user.id;
                    _userHash[_id] = _user;
                    if (+_currUserId == +_user.id) { continue; }
                    _userHash[_id].eLi = owner.adElm('', 'li').cn('gray').h('<img class="avatar" src="images/avatar/' + _user.avatar + '" /><span>' + _user.uid + '</span><a class="talk" uName="' + _user.uid + '" uid="' + _id + '" title="单击聊天"></a>');
                }
            },
            onError: function (d) { MTips.show(d.data, '加载用户失败'); }
        });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.ChatDialog = function (args) {
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, socket: null, userName: '', userId: 0 };
    var dialog, eInput, eMsg, socket;
    function _default() { socket = args.socket; }
    function _layout() {
        dialog = new $.UI.Tips({ head_h: 30, icon: 'icon-vector-chats', x: 200, y: 200, ifDrag: true, width: 550, height: 500, onResize: function () { mainLayout.resize(); }, ifResize: true, title: args.userName, ifClose: true, onClose: function () { me.hide(); return false; } });
        var mainLayout = new $.UI.Layout({ p: dialog.body, min: 100, max: 200, isRoot: 1, ifCover: false, ifDrag: false, start: 150, dir: 'we', dirLock: 2, barWidth: 1 });
        var contentLayout = new $.UI.Layout({ p: mainLayout.eHead, min: 150, max: 250, ifCover: false, start: 150, dir: 'ns', dirLock: 2 });
        var baseDiv = new $.UI.Tips({ p: contentLayout.eFoot, cn: 'b0', head_h: 0, foot_h: 38 });
        new $.UI.ButtonSet({ p: baseDiv.foot, itemAlign: 'right', items: [{ text: '发送', name: 'sendMsg', tab: 'menu', skin: 'Button-blue', css: 'margin-top:5px;', cn: 'mr10' }, { text: '关闭', name: 'cancle', skin: 'Button-danger', css: 'margin-top:5px;', cn: 'mr10' }], onClick: onToolBarClick });
        baseDiv.body.h('<textarea placeholder="请输入..." style="width:100%;height:100%;border:none;padding:0px;resize:none;"></textarea>');
        eInput = baseDiv.body.fc(); eMsg = contentLayout.eHead.ac('Waterfall').css('overflow: auto;').h('<ul class="ListItem" style="margin: 10px 25px;"></ul>').fc(); loadUser(args.userId, mainLayout.eFoot.ac('chat-user-info'));
    }
    function _event() {
        eInput.evt('keyup', function (e) { var e = $.e.fix(e), _e = e.t; if (e.code == 13) { sendMsg(); } });
    }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'sendMsg':
                sendMsg();
                break;
            case 'cancle':
                me.hide();
                break;
        }
    }
    function sendMsg() {
        var _val = eInput.value.trim();
        if (!_val) { return; }
        eInput.value = ''; eInput.focus();
        socket.emit('say', { from: +$.ck.get('SESSIONID'), to: args.userId, msg: _val });
        addMsgItem({ ifSelf: true, name: args.userName, msg: _val });
    }
    function loadUser(uid, p) {
        $.Util.ajax({
            args: 'm=SYS_CM_USERS&action=getUserInfo&dataType=json&id=' + uid,
            onSuccess: function (data) {
                var _user = eval(data.get(0) || '[]')[0];
                p.h('<div class="avatar"><img src="images/avatar/' + _user.avatar + '" /></div><div class="info">' + _user.uid + '</div><div class="info">' + _user.email + '</div>');
            }
        });
    }
    function addMsgItem(obj) {
        var _dir = 'left', _bc = '#E2E2E2', _bbc = '#D9F0F7', _arrowH = '<div class="pa w16 h16 fl" style="margin-left:-16px;padding:0px;margin-top:5px;"></div>';
        if (obj.ifSelf) {
            _dir = 'right'; _arrowH = '<div class="pa w16 h16 fr" style="padding:0px;margin-top:5px;right:10px;"></div>'; _bbc = '#FFFFCA';
        }
        var _temp = eMsg.adElm('', 'li').h(_arrowH + '<div class="content" style="background-color:' + _bbc + ';">' + obj.msg + '</div><div>' + obj.name + '     ' + (new Date()).date2Str() + '</div>');
        if (obj.ifSelf) { _temp.css('text-align: right;'); }
        _temp.fc().h($.UI.Arrow({ diff: 1, comMode: 'border', borderColor: _bc, backgroundColor: _bbc, cn: 'cp', dir: _dir }));
        eMsg.scrollTop = eMsg.offsetHeight - eMsg.clientHeight; //Chrome
    }
    me.addMsg = function (obj) { addMsgItem({ ifSelf: false, name: obj.toValue.uid, msg: obj.msg }); }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.List = function (args) {
    /* 
    { 
        type: "List", 
        desc: "数据列表承载组件", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            dataSource: { desc: '数据源', defVal: null, dataType: 'array' },
            aHeader: { desc: '表头定义的json数组', defVal: [{ title: 'id', name: 'id', type: 'attr' }, { title: 'nodeName', name: 'nodeName', type: 'none'}], dataType: 'array' },
            loadApi: { desc: '加载数据API', defVal: '', dataType: 'string' },
            insertApi: { desc: '添加数据API', defVal: '', dataType: 'string' },
            updateApi: { desc: '更新数据API', defVal: '', dataType: 'string' },
            deleteApi: { desc: '删除数据API', defVal: '', dataType: 'string' },
            orderApi: { desc: '数据排序API', defVal: '', dataType: 'string' },
            ifProc: { desc: '是否是使用存储过程来加载数据', defVal: false, dataType: 'bool' },
            ifRowDargabled: { desc: 'List中的行是否可拖动', defVal: false, dataType: 'bool' },
            ifShowIcon: { desc: '是否显示当前记录的图标', defVal: false, dataType: 'bool' },
            varName: { desc: '声明的List变量', defVal: 'list', dataType: 'string' },
            style: { desc: 'List的结构样式', defVal: 'normal', dataType: 'string', comType: 'Radios', sons: [{value:'normal',text:'NormalList'},{value:'tree:nodeName',text:'TreeList'}] },
            css: { desc: 'css样式', defVal: '', dataType: 'string' },
            cn: { desc: 'cn样式', defVal: 'gridV2Table c_11 fs12', dataType: 'string' },
            skin: { desc: '皮肤样式', defVal: 'List-default', dataType: 'string' },
            initText: { desc: '初始化文本', defVal: '', dataType: 'string' },
            expandMode: { desc: 'TreeList展开模式', defVal: 'delete', dataType: 'string', comType: 'Radios', sons: [{value:'delete',text:'删除模式'},{value:'hidden',text:'隐藏模式'}] },
            selCn: { desc: '行选中样式', defVal: 'gridV2Table_selected', dataType: 'string' },
            onLoadFinish: { desc: '加载数据完成的事件', defVal: function (){}, dataType: 'function' },
            onLoadAjax: { desc: '请求ajax事件', defVal: function (){}, dataType: 'function' },
            onCheckBoxClick: { desc: 'CheckBox选中事件', defVal: function (){}, dataType: 'function' },
            onTableScoll: { desc: 'List鼠标轮滚动事件', defVal: function (){}, dataType: 'function' },
            onTRDrag: { desc: 'TR拖动事件', defVal: function (){}, dataType: 'function' },
            onOperateClick: { desc: '操作列的Click回调', defVal: function (){}, dataType: 'function' },
            onTDClick: { desc: '单机TD的回调', defVal: function (){}, dataType: 'function' },
            onTDClickBefore: { desc: '单机TD之前的回调', defVal: function (){}, dataType: 'function' },
            onTDDoubleClickBefore: { desc: '双击TD之前的回调', defVal: function (){}, dataType: 'function' },
            onTDDoubleClick: { desc: '双击TD的回调', defVal: function (){}, dataType: 'function' },
            onTDMouseDown: { desc: '在TD上鼠标按下的回调', defVal: function (){}, dataType: 'function' },
            onTDUpdate: { desc: '修改节点的回调', defVal: function (){}, dataType: 'function' },
            onTDUpdateSuccess: { desc: '修改节点成功的回调', defVal: function (){}, dataType: 'function' },
            onTDUpdateError: { desc: '修改节点失败的回调', defVal: function (){}, dataType: 'function' },
            onContextMenu: { desc: '节点邮件的回调', defVal: function (){}, dataType: 'function' },
            onExpandNodeSuccess: { desc: '展开节点成功的回调', defVal: function (){}, dataType: 'function' },
            onExpandNodeError: { desc: '展开节点失败的回调', defVal: function (){}, dataType: 'function' },
            onSuccess: { desc: '请求成功的回调', defVal: function (){}, dataType: 'function' },
            onError: { desc: '请求失败的回调', defVal: function (){}, dataType: 'function' }
        },
        headerArgs: {
            name: { desc: '对应数据库表字段的字段名', defVal: 'id', dataType: 'string' },
            type: { desc: '列的类型', defVal: 'none', dataType: 'string' },
            title: { desc: '显示当前列的标题文字', defVal: 'ID', dataType: 'string' },
            width: { desc: '列的宽度, 默认值是null, 表示该列100%填充容器', defVal: null, dataType: 'int' },
            ifEdit: { desc: '当前列是否可编辑', defVal: true, dataType: 'bool' },
            ifDrag: { desc: '当前列是否可拖动表头', defVal: false, dataType: 'bool' },
            ifSort: { desc: '当前列是否可排序', defVal: true, dataType: 'bool' },
            ifFilter: { desc: '当前列是否可过滤', defVal: true, dataType: 'bool' },
            ifTrans: { desc: '当前列是否可进行trans函数', defVal: false, dataType: 'bool' },
            isLocalAttr: { desc: '当前列是否是本地属性列', defVal: false, dataType: 'bool' },
            isLinkAttr: { desc: '当前列是否是链接属性列', defVal: false, dataType: 'bool' }
        }
    } 
    */
    var me = this, owner, _fn = function () { };
    var _args = {
        pBody: $DB, p: $DB, dataSource: null, aHeader: [{ title: 'id', name: 'id', type: 'attr' }, { title: 'nodeName', name: 'nodeName', type: 'none' }], table: null, rootID: null,
        loadApi: '', insertApi: '', updateApi: '', deleteApi: '', orderApi: '', ifProc: false, ifRowDargabled: false, ifShowIcon: false, ifFixedHeight: true, ifEnabledTips: false, ifBindID: true, ifEnabledFilter: false,
        varName: 'list', colControls: {}, style: 'normal', css: '', cn: 'gridV2Table c_11 fs12', skin: 'List-default', initText: '', expandMode: 'delete', selCn: 'gridV2Table_selected', filter: [],
        sonsKey: 'sons', pidKey: 'pid',
        onLoadFinish: _fn, onLoadAjax: _fn, onCheckBoxClick: _fn, onTableScoll: _fn, onTRDrag: _fn, onOperateClick: _fn,
        onTDClick: _fn, onTDClickBefore: _fn, onTDDoubleClickBefore: _fn, onTDDoubleClick: _fn, onTDMouseDown: _fn, onTDUpdate: _fn, onTDUpdateSuccess: _fn, onTDUpdateError: _fn,
        onContextMenu: _fn, onExpandNodeSuccess: _fn, onExpandNodeError: _fn, onSuccess: _fn, onError: _fn
    };
    var iArgs = { name: 'id', type: 'none', title: 'id', width: null, ifEdit: false, ifDrag: false, ifSort: false, ifFilter: false, ifTrans: false, isLocalAttr: false, isLinkAttr: false };
    var scrollBar, attr = {};
    var filter_table = {
        'clear-filter': { name: 'clear', value: 'clear', text: '清除过滤条件', icon: 'icon-filter-clear' },
        'equal': { name: 'equal', value: 'equal', text: '等于', icon: 'icon-filter-equal' },
        'not-equal': { name: 'not-equal', value: 'not-equal', text: '不等于', icon: 'icon-filter-not-equal' },
        'greater': { name: 'gt', value: 'gt', text: '大于', icon: 'icon-filter-greater' },
        'less': { name: 'less', value: 'less', text: '小于', icon: 'icon-filter-less' },
        'greater-equal': { name: 'gt-equal', value: 'gt-equal', text: '大于等于', icon: 'icon-filter-greater-equal' },
        'less-equal': { name: 'less-equal', value: 'less-equal', text: '小于等于', icon: 'icon-filter-less-equal' },
        'like': { name: 'like', text: '模糊匹配', value: 'like', icon: 'icon-filter-like' },
        'not-like': { name: 'not-like', value: 'not-like', text: 'Not Like', icon: 'icon-filter-not-like' },
        'contain': { name: 'contain', value: 'contain', text: '包含于', icon: 'icon-filter-contain' },
        'not-contain': { name: 'not-contain', value: 'not-contain', text: '不包含于', icon: 'icon-filter-not-contain' }
    };
    
    function _default() {
        if (!attr.childs) { attr.childs = {}; }
        if (args.table) {
            args.updateApi = 'm=SYS_TABLE_BASE&action=updateByID&table=' + args.table;
            if (args.rootID != null) { args.loadApi = 'm=SYS_TABLE_TREE&action=getNodesByPid&table=' + args.table + '&pid=' + args.rootID; }
        }
        var _sAry = args.style.split(':');
        if (_sAry.length == 2) {
            attr.expandCol = _sAry[1];
            if (args.aHeader.length == 2) {
                args.aHeader = [
                    { name: 'id', type: 'attr' },
                    { name: 'pid', type: 'attr' },
                    { name: 'type', type: 'attr' },
                    { name: 'sons', type: 'attr' },
                    { name: 'depth', type: 'attr' },
                    { name: 'nodeName', type: 'none' }
                ];
            }
        }
    }
    function _layout() {
        layout_colControls();
        owner = args.p.adElm('', 'div').cn('List FFsn ' + args.skin + ' ' + args.cn).css(args.css);
        owner.onselectstart = function () { return false; };
        if (args.initText) { owner.h('<div class="init-text" >' + args.initText + '</div>'); };
        if (args.dataSource) { me.loadArray(args.dataSource); } else { me.loadAjax({ args: args.loadApi }); }
    }
    function _event() {
        owner.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t; //e.stop();
            if (_e.tagName == 'FONT') { _e = _e.pn(); }
            if (_e.attr('state')) {
                expand(_e);
            } else {
                var _te = getTargetElm(_e);
                if (args.onTDClickBefore(_te) != false) { clickRow(_te); $.Dialog.destroyAll(); }
            }
        }).evt('dblclick', function (e) {
            var e = $.e.fix(e), _e = e.t; e.stop();
            if (_e.tagName == 'FONT') { _e = _e.pn(); }
            dblClickRow(getTargetElm(_e));
        }).evt('contextmenu', function (e) {
            var e = $.e.fix(e), _e = e.t;
            if (_e.tagName == 'FONT') { _e = _e.pn(); }
            if (args.onContextMenu({ List: me, E: e, Target: getTargetElm(_e) }) == false) {
                //阻止鼠标右键原有的事件
                if (document.all) {
                    window.event.returnValue = false; // for IE
                } else {
                    e.stop();
                }
            }
        }).evt('mousedown', function (e) {
            var e = $.e.fix(e), _e = e.t; e.stop();
            if (_e.tagName == 'FONT') { _e = _e.pn(); }
            var _te = getTargetElm(_e, false);
            if (_te) { _te.e = e; }
            args.onTDMouseDown(_te, me);
        });
        args.p.pn().evt('scroll', function (e) {
            var e = $.e.fix(e), _e = e.t;
            var sl = _e.scrollLeft;
            if (attr.eHeader) { attr.eHeader.scrollLeft = sl; }
            args.onTableScoll({ List: me, Value: sl });
        });
    }
    function layout_colControls() { initHeaderAry(); layout_header(); layout_paging(); }
    function initHeaderAry() {
        var _hAry = args.aHeader, _attrHead = [], _visHead = [], _allW = 0, _cIdx = 0, _colIdxObj = {}, _colWidth = {}, _colH = {}, _hObj;
        for (var i = 0, _hLen = _hAry.length; i < _hLen; i++) {
            _hObj = $.init(_hAry[i], iArgs);
            var _type = _hObj.type, _name = _hObj.name, _w = _hObj.width;
            if (_type == 'attr') {
                _attrHead.push(_hObj);
            } else {
                _colIdxObj[_name] = _cIdx;
                _colWidth[_cIdx] = _w;
                _colH[_cIdx] = _hObj;
                if (_type == 'checkbox') { attr.cbIdx = _cIdx; args.hasCheckBox = true; }
                _cIdx++;
                _allW += _w;
                _visHead.push(_hObj);
            }
        }
        attr.attrColAry = _attrHead;
        attr.visColAry = _visHead;
        attr.allWidth = _allW;
        attr.colIdxObj = _colIdxObj;
        attr.colWidth = _colWidth;
        attr.idxObj = _colH;
        initColHtml();
        return attr;
    }
    function _getColString() {
        var _sCol = '', _cw = attr.colWidth, _len = attr.visColAry.length;
        for (var _k in _cw) {
            var _w = _cw[_k];
            if (_len == 1) {
                if (_w == null) {
                    _sCol = '<col class="wp" />'; attr.allW = '100%;';
                } else {
                    if (_w) {
                        _sCol = '<col width="' + _w + 'px" />'
                    } else {
                        _sCol = '<col class="w0" />';
                    }
                }
            } else {
                if (_w == null) { _w = 30; }
                if (_w) { _sCol += '<col width="' + _w + 'px" />'; } else { _sCol += '<col class="w0" />'; }
            }
        }
        return '<colgroup>' + _sCol + '</colgroup>';
    }
    function initColHtml() {
        var _visCAry = attr.visColAry, _vLen = _visCAry.length; attr.allW = attr.allWidth + 'px;';
        var _sTRs = '', _sFilter = '';
        for (var i = 0; i < _vLen; i++) {
            var _vis = _visCAry[i], _type = _vis.type.toLow(), _w = _vis.width;
            var _sTd = '<div class="text" >' + _vis.title + '</div>', _sF = '<input dataType="' + (_vis.dataType || 'string') + '" _comType="{0}" {1} class="td-filter-input" name="' + _vis.name + '" /><a class="icon-filter-filter" MTips="选择过滤条件"></a>';
            var _std = '<td>';
            switch (_type) {
                case 'bar':
                case 'operate':
                case 'icon':
                    _sF = '';
                    break;
                case 'checkbox':
                    _sTd = '<div class="checkbox"></div>';
                    _sF = '<a class="td-filter-cancle"></a>';
                    break;
                default:
                    var _readonly = '';
                    if (_vis.ifReadonly) { _readonly = 'readonly="readonly"'; }
                    if (_vis.ifEdit) { _sTd += '<div class="edit"></div>'; }
                    if (_vis.ifDrag) { _sTd += '<div class="drag"></div>'; }
                    if (_vis.ifSort) { _sTd += '<div class="sort sort-normal"></div>'; _std = '<td orderBy="' + _vis.name + '">'; }
                    _sF = _sF.format(_type.firstToUp(), _readonly);
                    break;
            }
            if (!_vis.ifFilter) { _sF = ''; }
            _sTRs += _std + _sTd + '</td>';
            _sFilter += '<td>' + _sF + '</td>'
        }
        _sTRs = '<tr>' + _sTRs + '</tr>';
        if (args.ifEnabledFilter) { _sTRs += '<tr class="tr-filter">' + _sFilter + '</tr>'; }
        attr.headHtml = _getColString() + _sTRs;
    }
    function layout_header() {
        var _obj = args.colControls.header, _eSelCol;
        if (!_obj) { return; }
        var _css = _obj.css || '', _cn = _obj.cn || '';
        if (!_obj.p) {
            var _pH = 0, _fH = _obj.height || 30;
            if (args.ifEnabledFilter) { _fH += 30; }
            if (args.colControls.paging) { _pH = 30; }
            var _tBase = new $.UI.BaseDiv({ p: args.p, head_h: _fH, foot_h: _pH, ifFixedHeight: args.ifFixedHeight });
            _obj.p = _tBase.head; args.p = _tBase.body;
            if (_pH) { args.colControls.paging.p = _tBase.foot; }
            _css += ';line-height:' + (_obj.height || 30) + 'px;';
        }
        var _render = _obj.p, _dragCn = 'pr z4 ce hp';
        attr.eHeader = _render;
        _render.h('<table class="List-header ' + _cn + '" style="' + _css + '" width="' + attr.allW + '">' + attr.headHtml + '</table>');
        _render.evt("mousedown", function (e) {
            var e = $.e.fix(e), _e = e.t;
            if (!attr.eTable || _e.className != 'drag') { return; }
            var _eTd = _e.pn(), _idx = _eTd.cellIndex, _pos = _e.posFix(), _hX = _render.posFix().x;
            var _x = _pos.x - _hX + 5, _origW = attr.colWidth[_idx], _hMask, _startX = _pos.x, dx;
            var _dargDiv = _render.adElm('', 'div').cn(_dragCn).css($.box(_x + ',0,0,') + ';border: 1px solid #ddd;margin-top:-' + _eTd.csn('height') + 'px;');
            var _bodyDiv = args.p.adElm('', 'div').cn('pa z4 ce hp').css($.box(_x + ',0,0,') + ';border: 1px solid #ddd;');
            $.drag.init(_dargDiv, null, _x - _origW + 25, 0, null, 0, null, 1);
            _dargDiv.onDragStart = function () { }
            _dargDiv.onDrag = function () {
                var _dragMX = _dargDiv.posFix().x;
                dx = _dragMX - _startX;
                if (_bodyDiv) { _bodyDiv.css('left:' + (_dragMX - _hX) + 'px;'); }
                if (!_hMask) { _hMask = new $.UI.Mask({ p: _render, alpha: 1, cn: 'ce' }); }
            }
            _dargDiv.onDragEnd = function () {
                _dargDiv.r(); _dargDiv = null;
                if (_bodyDiv) { _bodyDiv.r(); _bodyDiv = null; }
                if (_hMask) { _hMask.remove(); _hMask = null; } else { return; }
                attr.colWidth[_idx] = (_origW + dx) < 25 ? 25 : (_origW + dx - 5);
                resetColWidth(_idx);
            }
            $.drag.start(e, _dargDiv);
        }).evt("click", function (e) {
            var e = $.e.fix(e), _e = e.t; e.stop(); $.Dialog.destroyAll();
            var _cn = _e.className, _eTd;
            switch (_cn) {
                case 'drag':
                    setColMaxWidth(_e.pn().cellIndex);
                    break;
                case 'td-filter-cancle':

                    break;
                default:
                    if (_cn.indexOf('-filter') != -1) {
                        var _cellIdx = _e.pn().cellIndex, _vObj = attr.idxObj[_cellIdx];
                        switch (_e.tagName) {
                            case 'INPUT':
                                if (!_e.attr('opt')) { _e.ns().ac('td-filter-error'); _e.blur(); return false; } else { _e.ns().dc('td-filter-error'); }
                                _vObj.eInput = _e; _vObj.ifAutoPopHeight = true; _vObj.po = true; _vObj.popHeight = 200;
                                _vObj.onValueChange = function (obj) { _e.value = obj.Text; onFilterChange(_e, obj.Value); };
                                $.UI.EventHandler.BindInputClick(_vObj);
                                break;
                            case 'A':
                                if (!attr.filterAry) { attr.filterAry = []; }
                                if (!attr.filterAry[_cellIdx]) {
                                    var _fA = _vObj.filterItems || ['clear-filter', 'like', 'equal', 'not-equal', 'greater', 'less', 'greater-equal'], _fALen = _fA.length, _fAry = [];
                                    for (var i = 0; i < _fALen; i++) { _fAry.push(filter_table[_fA[i]]); }
                                    attr.filterAry[_cellIdx] = _fAry;
                                }
                                $.Dialog.get({ ePop: _e, css: 'max-height:180px;' }).hide().init({ type: 'Menu', items: attr.filterAry[_cellIdx], checkedValue: _e.ps().attr('opt') }).show()
                                    .evt('onClick', function (obj) {
                                        var _icon = obj.Item.Args.icon, eInput = _e.ps();
                                        if (_icon == 'icon-filter-clear') {
                                            eInput.value = ''; eInput.focus();
                                        } else {
                                            _e.cn(_icon).attr('MTips', obj.Text); eInput.attr('opt', obj.Value);
                                        }
                                        $.Dialog.destroy();
                                    });
                                break;
                        }
                    } else {
                        if (_e.tagName == 'DIV') { _eTd = _e.pn(); } else { _eTd = _e; }
                        var _sN = _eTd.attr('orderby'), _argsObj = attr.loadArgsObj;
                        var _order = +(_eTd.attr('order') || '0');
                        if (_sN && _argsObj) {
                            var _eSort = $(_eTd.lastChild);
                            _argsObj.orderBy = _sN;
                            _argsObj.order = _order;
                            me.loadAjax({
                                args: _argsObj,
                                onSuccess: function () {
                                    if (_order) {
                                        _eTd.attr('order', 0);
                                        _eSort.dc('sort-normal sort-down').ac('sort-up');
                                    } else {
                                        _eTd.attr('order', 1);
                                        _eSort.dc('sort-normal sort-up').ac('sort-down');
                                    }
                                    if (_eSelCol && _eSelCol != _eTd) {
                                        _eSelCol.dc('td-selected');
                                        $(_eSelCol.lastChild).dc('sort-up sort-down').ac('sort-normal');
                                    }
                                    _eTd.ac('td-selected');
                                    _eSelCol = _eTd;
                                }
                            });
                        }
                    }
                    break;
            }
        }).evt('keyup', function (e) {
            var e = $.e.fix(e), _e = e.t;
            if (e.code == 13) { onFilterChange(_e, _e.value); }
            e.stop();
        });
        attr.hTable = _render.fc();
    }
    function dblClickRow(obj) {
        if (!obj || !obj.eTd) { return; }
        //if ((obj.eNode && obj.eNode.attr('state') != null) || !obj.eTd) { return; }
        var _eTd = obj.eTd, _pos = _eTd.pos(), _cIdx = _eTd.cellIndex, _hObj = attr.visColAry[_cIdx], _iAry = [], _name = _hObj.name;
        var _x = _pos.x, _y = _pos.y + _pos.h, _rowId = obj.getAttr('rowId') || obj.getAttr('id');
        _hObj.text = obj.get('text'); _hObj.comType = _hObj.comType || 'TextArea'; _hObj.value = obj.get('value'); _hObj.ifHead = false; _hObj.width = _hObj.inputWidth;
        obj.FormItemArgs = _hObj; obj.x = _x; obj.y = _y;
        if (args.onTDDoubleClickBefore(obj) != false && _hObj.ifEdit && args.updateApi) {
            _iAry.push(_hObj);
            $.Dialog.get({ css: 'max-height:200px;padding:10px;width:170px;', ePop: obj.eTxt, ifClose: true }, 'edit').init({
                type: 'Form', ifFixedHeight: false,
                btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '编辑(Edit)', icon: 'icon-glyph-edit', align: 'right', css:'margin-right:0px;' }], state: 'Update',
                hidden: { id: _rowId }, items: _iAry, submitApi: args.updateApi
            }).evt('onSubmit', function (j) {
                j.name = _name; j.id = _rowId; obj.List = me; return args.onTDUpdate(obj, j);
            }).evt('onSubmitSuccess', function (j) {
                obj.set('text', j.Data.UText[_name]).set('value', j.Data.UValue[_name]); $.Dialog.destroyAll();
            }).show();
        }
        args.onTDDoubleClick(obj);
    }
    function expand(_e) {
        if (!_e || !attr.expandCol) { return; }
        var _tag = _e.tagName, _eNode, _eTD, _eTR;
        switch (_tag) {
            case 'DIV':
                _eNode = _e; _eTD = _e.pn().pn();
                break;
            case 'TD':
                _eNode = _e.fc().fc(); _eTD = _e;
                break;
            case 'TR':
                _eTD = _e.chn(attr.colIdxObj[attr.expandCol]); _eNode = $(_eTD.lastChild).fc();
                break;
        }
        _eTR = _eTD.pn();
        var _sons = +_eNode.attr('sons'), _state = +_eNode.attr('state'), _id = _eTR.attr('rowId') || _eTR.attr('id');
        if (!_sons) { return; }
        if (_state) {
            if (args.expandMode == 'delete') { traversalTrs(_id, 'delete'); } else { traversalTrs(_id, 'hidden'); }
            _eNode.dc('td-unfold').ac('td-fold').attr('state', 0);
        } else {
            _eNode.dc('td-fold').ac('td-loading');
            if (args.expandMode == 'delete') {
                var _tApi = getTreeListApi(_id);
                if (_tApi) {
                    $.Util.ajax({
                        args: _tApi,
                        onSuccess: function (d) {
                            insertTreeNodesByString(_eTR, d.data[0]);
                            _eNode.dc('td-loading').dc('td-fold').ac('td-unfold').attr('state', 1);
                            args.onExpandNodeSuccess();
                        }
                    });
                } else {
                    MTips.show('请求API为空', 'warn');
                }
            } else {
                traversalTrs(_id, 'show');
                _eNode.dc('td-loading').ac('td-unfold').attr('state', 1);
            }
        }
    }
    function insertTreeNodesByString(_eTR, _sData) {
        if (!_sData) { return; }
        var _currIdx = _eTR.rowIndex, _depth = +_eTR.attr('depth') - args.initDepth + 1;
        var _pid = _eTR.attr('pid'), _id = _eTR.attr('rowId') || _eTR.attr('id');
        var _sSpace = '', _table = attr.eTable, _eNTr, _eNTd, _cName;
        for (var m = 0; m < _depth; m++) { _sSpace += '<div class="td-space"></div>'; }
        var _trAry = _sData.split('</td></tr>'), _insertAry = [];
        for (var i = 0, _iLen = _trAry.length; i < _iLen; i++) {
            var _tdAry = _trAry[i].split('</td><td>'), _newIdx = i + _currIdx + 1;
            _eNTr = $(_table.insertRow(_newIdx)).attr('pNodeName', 'xxx');
            var _sAttrVal, _aAttrVal;
            for (var j = 0, _jLen = _tdAry.length; j < _jLen; j++) {
                var _sTd = _tdAry[j];
                _cName = attr.visColAry[j].name;
                if (_sTd.indexOf('<tr') != -1) {
                    var _iid = _sTd.indexOf('><td>');
                    _sAttrVal = _sTd.substr(0, _iid);
                    _sTd = _sTd.substr(_iid + 5, _sTd.length);
                }
                if (_cName == attr.expandCol) { _sTd = _sSpace + _sTd; }
                _sTd = (_sTd == '') ? '<div class="td-detail"><div class="td-text" ></div><div class="td-value" ></div></div>' : _sTd;
                _eNTd = $(_eNTr.insertCell(j)).h(_sTd);
            }
            _aAttrVal = _sAttrVal.substr(4).split(' ');
            for (var j = 0; j < _aAttrVal.length - 1; j++) {
                var _attr = _aAttrVal[j].split('='), _val = _attr[1];
                _eNTr.attr(_attr[0], _val.substr(1, _val.length - 2));
            }
            _insertAry.push(_eNTr);
        }
        attr.childs[_id] = _insertAry;
        if (attr.childs[_pid]) { attr.childs[_pid].push(_id); }
        if (!attr.expandState) { attr.expandState = {}; }
        attr.expandState[_id] = 'open';
    }
    function addChild() { }
    function traversalTrs(id, action) {
        var trs = attr.childs[+id];
        if (trs == null) { return; }
        for (var i = trs.length - 1; i >= 0; i--) {
            var _tr = trs[i], _type = typeof _tr;
            if (_type == 'string') {
                if (attr.expandState[_tr] == 'open') { traversalTrs(_tr, action); }
            } else {
                switch (action) {
                    case 'show':
                        _tr.dc('dn'); break;
                    case 'hidden':
                        _tr.ac('dn'); break;
                    case 'delete':
                        attr.eTable.deleteRow(_tr.rowIndex); break;
                }
                if (+_tr.attr('sons')) { traversalTrs(_tr.attr('rowId'), action); }
            }
        }
        if (action == 'delete') { attr.childs[id] = null; }
        args.onExpandNodeSuccess();
    }//action: show, hidden, delete
    function insertNode() {

    }
    function onFilterChange(_e, value) {
        if (!attr.filterArgs) {
            attr.filterArgs = {};
            var _tdAry = _e.pn().pn().childNodes, _dLen = _tdAry.length, _eInput, _name, _val, _opt;
            for (var i = 0; i < _dLen; i++) {
                _eInput = $(_tdAry[i]).fc();
                if (_eInput && _eInput.tagName == 'INPUT') {
                    _name = _eInput.name; _val = _eInput.value;
                    if (_name && _val) { attr.filterArgs[_name] = { col: _name, value: _val, opt: _eInput.attr('opt'), dataType: _eInput.attr('dataType') }; }
                }
            }
        }
        var _sName = _e.name, _opt = _e.attr('opt') || 'equal', _fAry = [];
        if (_opt) {
            if (value) {
                attr.filterArgs[_sName] = { col: _sName, value: value, opt: _opt, dataType: _e.attr('dataType') };
            } else {
                attr.filterArgs[_sName] = null;
            }
        }
        attr.filter = [];
        for (var k in attr.filterArgs) { var _fObj = attr.filterArgs[k]; if (_fObj) { _fAry.push($.JSON.encode(_fObj)); attr.filter.push(_fObj); } }
        attr.loadArgsObj.filterCondition = _fAry.join('\u0001');
        ajax(attr.loadArgsObj, function (d) { }, function (d) { MTips.show(d.data, 'error'); });
    }
    function hideFilter() {

    }
    function getFilterString() {

    }
    function layout_paging() {
        var _obj = args.colControls.paging;
        if (!_obj) { return; }
        if (!_obj.p) {
            var _tBase = new $.UI.BaseDiv({ p: args.p, head_h: 0, foot_h: (_obj.height || 28) });
            args.p = _tBase.body; _obj.p = _tBase.foot;
        }
        _obj.onClick = function (j) { me.loadAjax({ args: attr.loadApi }); }
        _obj.onSelect = function (j) { me.loadAjax({ args: attr.loadApi }); }
        attr.Paging = new $.UI.Paging(_obj);
    }
    function sortByCol() {

    }
    function setBodyHtml(html) {
        //if (!html.trim()) { owner.h('<div class="no-data" ><img src="images/EmptyData.gif" ></div>'); return; }
        if (attr.loadApi) { html += '</td></tr>'; }
        var _html = '<table class="' + args.cn + '" style="' + args.css + '" width="' + attr.allW + '" >' + _getColString() + html + '</table>';
        owner.h(unescape(_html));
        attr.eTable = owner.fc();
        if (attr.eTable.rows.length) { args.initDepth = +$(attr.eTable.rows[0]).attr('depth'); }
        args.onLoadFinish({ List: me, Html: _html, Attr: attr });
    }
    function toArgsObj(argsStr) {
        var _kvAry = argsStr.split('&'), _len = _kvAry.length, _kv = {};
        for (var i = 0; i < _len; i++) { var _sAry = _kvAry[i].split('='); _kv[_sAry[0]] = _sAry[1]; }
        return _kv;
    }
    function toArgsString(argsObj) {
        var _kvAry = [];
        for (var k in argsObj) { _kvAry.push(k + '=' + argsObj[k]); }
        return _kvAry.join('&');
    }
    function getTreeListApi(pid) {
        if (attr.loadArgsObj) {
            var _obj = attr.loadArgsObj;
            if (_obj[args.pidKey]) {
                _obj[args.pidKey] = +pid;
            } else {
                var _jc = $.JSON.decode(_obj.jsonCondition || '{}');
                _jc[args.pidKey] = +pid;
                _obj.jsonCondition = $.JSON.encode(_jc);
            }
            return _obj;
        }
    }
    function ajax(args, onSucc, onErr) {
        var _onSucc = onSucc || _fn, _onErr = onErr || _fn;
        if (attr.ifLoading) { return; }
        if (!attr.oldApi) { attr.oldApi = args; }
        attr.refreshApi = args;
        attr.ifLoading = true;
        $.Util.ajax({
            args: args,
            onSuccess: function (d) {
                var _dAry = d.data, _html = _dAry[0], _count = _dAry[1];
                var _return = { List: me, Data: d, Attr: attr };
                attr.ifLoading = false;
                attr.ifAjax = true;
                if (!_html) { owner.h('<div class="no-data"><img src="images/EmptyData.gif" ></div>'); _return.Length = 0; _onSucc(_return); return; }
                if (_html.indexOf('<tr rowId=') != -1 || _html.indexOf('</td><td') != -1) {
                    _html = _html.replaceAll("<td></td>", "<td><div class='td-detail'><div class='td-text'></div><div class='td-value'></div></div></td>");
                    setBodyHtml(_html);
                } else if (_html.indexOf('[{') == 0) {
                    me.loadArray(eval(_html), _f);
                } else if (_html.indexOf('\u0002') != -1 && _html.indexOf('\u0001') != -1) {
                    var _cols = _html.split('\u0002'), _ary = [];
                    for (var i = 0; i < _cols.length; i++) {
                        var _col = _cols[i];
                        if (_col != '') {
                            var _aCol = _col.split('\u0001'); _ary.push(_aCol);
                        }
                    }
                    me.loadArray(_ary, _f);
                }
                if (!_count) { _count = 0; }
                if (attr.Paging) { attr.Paging.setTotal(+_count); }
                _return.Length = attr.eTable.rows.length;
                _onSucc(_return);
            },
            onError: function (j) {
                owner.h('<div class="no-data">' + j.data + '</div>');
                attr.ifLoading = false;
                _onErr({ List: me, Data: j, Attr: attr });
            }
        });
    }
    function getSql4MSSQL(aHeader) {
        var _spChar = "'", hyphen = '%2B';
        if (args.ifProc) { _spChar = "''"; }
        var _hAry = aHeader || args.aHeader, _name = '', sQ = '{0}<tr ';
        var sAttr = '', aCol = [], sCb = '', _firstNode, _name, _sName, _fVis, _ifSI = args.ifShowIcon;
        if (args.ifBindID) { sQ += 'rowId="{0}{1}cast(id as varchar(20)){1}{0}" '; }
        for (var i = 0, _hLen = _hAry.length; i < _hLen; i++) {
            var col = _hAry[i], _type = col.type || 'none', _sCol = '';
            _name = col.name; _sName = _name;
            if (_type.toLow() == 'select') { col.ifTrans = true; }
            if (col.ifTrans) { _sName = 'dbo.' + (col.trans || 'SYS_TRANS_GT') + '(' + _name + ')'; }
            if (_name == attr.expandCol) { _sCol += '<div sons="{0}{1}cast(isnull(' + args.sonsKey + ',{0}{0}) as varchar(10)){1}{0}" state="0" class="td-node {0}{1}dbo.SYS_SET_ICON_FOR_TREELIST(' + args.sonsKey + ',{0}td-fold{0}){1}{0}" ></div>'; }
            switch (_type.toLowerCase()) {
                case 'checkbox':
                    sCb += '<td><div val="0" class="td-checkbox"><div class="td-checkbox-icon dn"></div></div>';
                    break;
                case 'icon':
                    aCol.push('{0}<div class="td-detail" ><div class="image ' + (col.image || '') + '" ></div><div class="td-value" ></div></div>{0}');
                    break;
                case 'image':
                    aCol.push('{0}<div class="td-detail" ><img src="{0}{1}' + _name + '{1}{0}" /><div class="td-value" >{0}{1}' + _name + '{1}{0}</div></div>{0}');
                    break;
                case 'date':
                    aCol.push('{0}<div class="td-detail" ><div class="td-text" >{0}{1}dbo.SYS_FORMAT_TIME(' + _name + '){1}{0}</div><div class="td-value" >{0}{1}dbo.SYS_FORMAT_TIME(' + _name + '){1}{0}</div></div>{0}');
                    break;
                case 'normal':
                    return '&resultSplit=$';
                case 'operate':
                    var _items = col.items || [], _sAry = [], _sI = '';
                    var _oiArgs = { type: 'normal', target: '', title: '', text: '', icon: '', href: 'javascript:void(0);', css: '' };
                    for (var j = 0, _jLen = _items.length; j < _jLen; j++) {
                        var _item = $.init(_items[j], _oiArgs);
                        switch (_item.type.toLowerCase()) {
                            case 'normal':
                                _sI = '<A rowId="{0}{1}cast(' + (_item.key || 'id') + ' as varchar(20)){1}{0}" name="' + _item.name + '" href="' + _item.href + '" >';
                                if (_item.icon) { _sI += '<span class="A-icon ' + _item.icon + '" title="' + _item.title + '"></span>'; }
                                if (_item.text) { _sI += '<span class="A-text">' + _item.text + '</span>'; }
                                _sI += '</A>';
                                break;
                            case 'button':

                                break;
                        }
                        _sAry.push(_sI);
                    }
                    aCol.push('{0}<div class="td-detail" >' + _sAry.join('') + '</div>{0}');
                    break;
                case 'process':
                    _name = '{0}{1}cast(isnull(' + _name + ',0) as varchar(20)){1}{0}';
                    aCol.push('{0}<div class="td-detail" ><div class="td-process"><div class="td-process-value" style="width:' + _name + '%;">' + _name + '%</div></div><div class="td-value">' + _name + '</div></div>{0}');
                    break;
                case 'attr':
                    var _key = col.key || _name;
                    if (col.isLocalAttr) {
                        sAttr += _key + '="' + escape(col.value) + '" ';
                    } else if (col.isLinkAttr) {
                        //什么都不做
                    } else {
                        sAttr += _key + '="{0}{1}cast(replace(isnull(' + _name + ',{0}{0}),{0}"{0},{0}%24%24{0}) as varchar(100)){1}{0}" ';
                    }
                    break;
                default:
                    if (!_fVis && _ifSI) {
                        if (typeof _ifSI == 'string') {
                            _sCol += '<div class="td-icon icon-type-{0}{1}cast(' + _ifSI + ' as varchar(10)){1}{0}"></div>';
                        } else {
                            _sCol += '<div class="td-icon {0}{1}cast(icon as varchar(50)){1}{0}"></div>';
                        }
                        _fVis = _name;
                    }
                    var _sMT = '';
                    if (col.ifEnabledTips) { _sMT = ' MTips="1" '; }
                    _sName = col.sqlName || _sName;
                    _sCol += '<div class="td-text" ' + _sMT + '>{0}{1}cast(' + _sName + ' as varchar(500)){1}{0}</div><div class="td-value" >{0}{1}cast(' + _name + ' as varchar(500)){1}{0}</div>';
                    aCol.push('{0}<div class="td-detail" >' + _sCol + '</div>{0}');
                    break;
            }
        }
        if (args.hasCheckBox) {
            _firstNode = ">" + sCb + "{0},";
        } else {
            var _fNode = aCol[0];
            if (_fNode) {
                aCol.shift();
                _firstNode = '><td>{0}{1}cast(isnull(' + _fNode + ', {0}{0}) as varchar(500)),';
            } else {
                alert('必须要有可见列!'); return '';
            }
        }
        if (!aCol.length) { _firstNode = _firstNode.substr(0, _firstNode.length - 1); }
        sQ += sAttr + _firstNode + aCol.join(',');
        sQ = sQ.format(_spChar, hyphen);
        return sQ;
    }
    function getSql4MYSQL(aHeader) {
        var head = aHeader || me.aHeader, _len = head.length;
        var _aTRAttr = ["'<tr rowId=\"'", "id"], _fNode, _fNodeStr, _aNor, _sNor;
        var _sCB = '', _aCol = [], _aTreeCol = [];
        for (var i = 0; i < _len; i++) {
            var _col = head[i], _name = _col.name, _type = _col.type || 'none', _tDB = _col.transDB || '';
            if (_tDB) { _tDB += '.'; }
            if (_name == me.expandColName) {
                _aTreeCol = ["'<div sons=\"'", 'sons', "'\" part=\"expand\" state=\"close\" class=\"pa w16 h16 '", _tDB + "dbo.sonIcon(sons,''tree_fold'')", "'\" ></div><div class=\"pa nhh oh wp\" style=\"margin-left:16px;\" part=\"text\" class=\"wp hp\" >'", _name, "'</div><div class=\"dn\" part=\"val\" >'", _name, "'</div>'"];
            }
            if (_col.trans) { _name = _col.trans; }
            var _nameCopy = _name, _ifTrans = _col.ifTrans;
            if (_type != 'attr' && !_fNode) { _fNode = _col; }
            switch (_type) {
                case 'attr':
                    if (_col.isLocalAttr) {
                        _aTRAttr.push(_name, escape(_col.value));
                    } else if (_col.isLinkAttr) { }
                    else {
                        _aTRAttr.push("'\" " + _name + "=\"'", _name);
                    }
                    break;
                case 'icon':
                    _sNor = "'<div class=\"h20 lh20 oh\" ><div class=\"ma w16 h16\" part=\"icon\" style=\"" + $.UI.ico16(_col.icon) + ";\" ></div><div class=\"dn\" part=\"val\" ></div></div>'";
                    _aCol.push('concat(' + _sNor + ') as ' + _name);
                    break;
                case 'checkbox':
                    _sCB = "<td><div val=\"0\" part=\"checkbox\" class=\"ma r3 w11 h11 bc_19 b_6\"><div part=\"checkbox_icon\" class=\"w15 h15 checkBox_check dn\"></div></div>";
                    break;
                case 'date':
                case 'num':
                case 'select':
                case 'richText':
                case 'none':
                    _aNor = ["'<div class=\"pr h20 lh20 oh\" ><div part=\"text\" class=\"wp hp\" >'", _name, "'</div><div part=\"val\" class=\"dn\" >'", _name, "'</div></div>'"];
                    _sNor = _aNor.join(',');
                    _aCol.push('concat(' + _sNor + ') as ' + _name);
                    break;
                case 'process':
                    _aNor = ["'<div class=\"pr h20 lh20 oh\" ><div part=\"text\" class=\"ma oh r3 bc_15 h15 lh15 tac\" style=\"width:90%;margin-top:2px;\"><div part=\"processVal\" class=\"fl rl3 bc_20\" style=\"width:'", _name, "'%;\">'", _name, "'%</div></div><div class=\"dn\" part=\"val\">'", _name, "'</div></div>'"];
                    _sNor = _aNor.join(',');
                    _aCol.push('concat(' + _sNor + ') as ' + _name);
                    break;
                case 'normal':
                    return '&resultsplit=$';
                case 'operate':
                    var _items = _col.items, _sOper = '';
                    if (_items) {
                        var _itemsLen = _items.length;
                        for (var j = 0; j < _itemsLen; j++) {
                            var _item = _items[j], _ty = _item.type || 'normal', _target = _item.target || '_black';
                            var _title = _item.title || _item.text || '';
                            var _icon = _item.icon, _text = _item.text, _href = _item.href || 'javascript:void(0);';
                            switch (_ty) {
                                case 'normal':
                                    var _sCn = 'ml3';
                                    if (!j) { _sCn = ''; }
                                    if (!_text) { _sCn += ' mt2'; }
                                    _sOper += '<span class=\"dib\" name=\"' + _item.name + '\" part=\"operate\" >';
                                    if (_icon != null) {
                                        _sOper += '<span part="icon" class=\"w16 mr3 h16 ' + _sCn + ' dib\" title=\"' + _title + '\" style=\"' + $.UI.ico16(_item.icon) + '\" ></span>';
                                    }
                                    if (_text) {
                                        _sOper += '<a target="' + _target + '" part="val" href=\"' + _href + '\">' + _text + '</a>';
                                    }
                                    _sOper += '</span>';
                                    break;
                                case 'btn':
                                    break;
                            }
                        }
                    }
                    _sOper = '\'<span class=\"lh20 wp oh tac\" >' + _sOper + '</span>\'';
                    _aCol.push('concat(' + _sOper + ') as ' + _name);
                    break;
            }
            if (!_fNodeStr) { _fNodeStr = _sNor; }
        }
        if (_fNode) {
            var _sAttr = 'concat(' + _aTRAttr.join(',') + ',\'\" >{0}\') as ' + _fNode.name + '';
            if (hasCB) {
                _fNodeStr = _sCB;
            } else {
                _aCol.shift();
                _fNodeStr = _fNodeStr.substr(1, _fNodeStr.length - 2);
                _fNodeStr = "<td>" + _fNodeStr;
            }
            _sAttr = _sAttr.format(_fNodeStr);
        } else {
            alert('必须要有可见列!'); return '';
        }
        if (_aCol.length) { _sAttr += ',' + _aCol.join(','); }
        return _sAttr;
    }
    function resetColWidth(idx) {
        var _allW = getColAllWidth(); resetTableCol(attr.hTable, idx); resetTableCol(attr.eTable, idx);
    }
    function resetTableCol(eTable, idx) {
        if (!eTable) { return; }
        var _eCols = eTable.fc(), _eCol = _eCols.chn(idx);
        var _allW = attr.allWidth, _nW = attr.colWidth[idx];
        if (_nW) { _eCol.dc('w0').attr('width', _nW + 'px;'); } else { _eCol.ac('w0'); };
        if (_allW) { eTable.dc('w0').attr('width', _allW + 'px;'); } else { eTable.ac('w0'); }

    }
    function setColMaxWidth(idx) {
        var _table = attr.eTable;
        if (!_table) { return; }
        var maxVal = 0, newW = 0, rows = _table.rows, len = 0;
        for (var i = 0, _len = rows.length; i < _len; i++) {
            var _eTd = $(rows[i].cells[idx]);
            if (!_eTd) { return; }
            var _elmAry = _eTd.find('div:class=td-text');
            if (_elmAry.length) { len = $(_elmAry[0]).ht().len(); } else { return; }
            maxVal = maxVal < len ? len : maxVal;
        }
        //maxVal = maxVal < hWidth ? hWidth : maxVal;
        attr.colWidth[idx] = (maxVal == 0 ? 1 : maxVal) * 10 + 20;
        resetColWidth(idx);
    }
    function resetBarWidth() {
        return;
        if (bar_index != null) {
            var _pbw = pBody.csn('width'), _aw = me.nTotalW;
            var barCol = eCols.chn(bar_index), _nBarW = 0;
            if (_aw + 18 > _pbw) { _nBarW = 18; }
            if (_nBarW == 0) {
                barCol.ac("w0");
            } else {
                barCol.dc("w0").attr('width', _nBarW + "px");
            }
        }
    }
    function getColAllWidth() { var _allW = 0; for (var i in attr.colWidth) { _allW += attr.colWidth[i]; }; attr.allWidth = _allW; return _allW; }
    function getTargetElm(_e, ifExecEvent) {
        var _tag = _e.tagName, _cn = _e.className.trim(), _cIdx = _cn.indexOf('td');
        var _ifee = ifExecEvent == null ? true : ifExecEvent;
        var _eTR, _eTD, _eDetail, _eNode, _eIcon, _eTxt, _eVal;
        if (_tag == 'A' || _tag == 'SPAN') {
            if (_tag == 'SPAN') { _e = _e.pn(); }
            var _n = _e.attr('name'); _eTD = _e.pn().pn(); _eTR = _eTD.pn();
            var _rID = _eTR.attr('rowId') || _eTR.attr('id');
            if (_ifee) { args.onOperateClick({ List: me, Attr: attr, Name: _n, RowId: _rID, E: _e, eTd: _eTD, eTr: _eTR }); }
            return {};
        }
        if (_tag == 'TD') { _eTD = _e; _eDetail = _e.fc(); if (_e.cellIndex == attr.cbIdx) { if (_ifee) { clickCheckBox(_e.fc()); } return {}; } }
        if (_tag == 'DIV') {
            if (_cIdx) { return {}; }
            switch (_cn) {
                case 'td-space':
                    _eDetail = _e.ns(); break;
                case 'td-detail':
                    _eDetail = _e; break;
                case 'td-checkbox-icon':
                    clickCheckBox(_e.pn()); return;
                case 'td-checkbox':
                    clickCheckBox(_e); return;
                default:
                    _eDetail = _e.pn(); break;
            }
            _eTD = _eDetail.pn();
        }
        if (!_eDetail) { return {}; }
        _eVal = $(_eDetail.lastChild); if (!_eVal) { return {}; };
        _eTxt = $(_eVal.previousSibling); _eTR = _eTD.pn();
        if (args.ifShowIcon) { _eIcon = $(_eTxt.previousSibling); }
        if (attr.expandCol) { if (_eIcon) { _eNode = $(_eIcon.previousSibling); } else { _eNode = $(_eTxt.previousSibling); } }
        return getFullT({ eTr: _eTR, eTd: _eTD, eDetail: _eDetail, eNode: _eNode, eIcon: _eIcon, eTxt: _eTxt, eVal: _eVal });
    }
    function getFullT(obj) {
        var _eTR = obj.eTr, _eTxt = obj.eTxt, _eVal = obj.eVal;
        var _getAttr = function (key) { return _eTR.attr(key); };
        var _get = function (key, col) {
            switch (key) {
                case 'text':
                    return _eTxt.ht();
                case 'value':
                    return _eVal.h();
                case 'icon':
                    if (obj.eIcon) { return obj.eIcon.className.split(' ')[1]; }
            }
        }
        var _set = function (key, value, col) {
            switch (key) {
                case 'text':
                    _eTxt.h(value); break;
                case 'value':
                    _eVal.h(value); break;
            }
            return this;
        }
        obj.getAttr = _getAttr; obj.get = _get; obj.set = _set;
        return obj;
    }
    function clickCheckBox(_eCB) {
        if (!_eCB) { return {}; }
        setCheckBoxChecked(_eCB, ! +_eCB.attr('val'));
        args.onCheckBoxClick({ List: me, Attr: attr });
    }
    function clickRow(elms) {
        if (!elms) { return; }
        var _eTr = elms.eTr;
        if (!_eTr) { return; }
        setRowSel(_eTr);
        args.onTDClick({ List: me, Attr: attr, Target: elms });
    }
    function getCBElm(key, type) { var _eTr = getTR(key, type); if (!_eTr) { return; } return $(_eTr.cells[attr.cbIdx]).fc(); }
    function getTR(key, type) { var _eTr = (type == 'ID' ? me.getTRById(key) : me.getTRByIdx(key)); return _eTr; }
    function setCheckBoxChecked(_eCB, _val) {
        if (!_eCB) { return; }
        if (!attr.selIds) { attr.selIds = []; attr.selTrs = []; }
        if (+_eCB.attr('val') == _val) { return; }
        var _eCBI = _eCB.fc(), _tr = _eCB.pn().pn(), _id = _tr.attr('rowId') || _tr.attr('id');
        if (_val) {
            attr.selIds.push(_id);
            attr.selTrs.push(_tr);
            _eCBI.dc('dn'); _eCB.attr('val', 1);
        } else {
            _eCBI.ac('dn'); _eCB.attr('val', 0);
            attr.selIds.re(_id);
            attr.selTrs.re(_tr);
        }
    }
    function setRowSel(_eTr) {
        if (!_eTr) { return; }
        var _selTR = attr.eSelTR;
        if (_selTR) { setTRSelected(_selTR, false); }
        setTRSelected(_eTr, true); attr.eSelTR = _eTr; attr.selID = _eTr.attr('rowId') || _eTr.attr('id');
    }
    function setTRSelected(tr, ifSel, selCn) {
        var _table = attr.eTable, _selCn = selCn || args.selCn;
        if (!tr || !_table) { return; }
        if (typeof tr == 'number') {
            var _rLen = _table.rows.length;
            if (tr > _rLen - 1) { return; } else { tr = _table.rows[tr]; }
        }
        tr = $(tr);
        var _trs = tr.childNodes;
        for (var i = 0, _len = _trs.length; i < _len; i++) {
            var _td = $(_trs[i]);
            if (ifSel) { _td.ac(_selCn); } else { _td.dc(_selCn); }
        }
        return tr;
    }
    function getElmsByTd(_eTd) {
        if (!_eTd) { return; }
        var _eTD = _eTd, _eDetail = $(_eTD.lastChild);
        var _eVal = $(_eDetail.lastChild), _eTxt = $(_eVal.previousSibling), _eIcon, _eNode;
        if (args.ifShowIcon) { _eIcon = _eTxt.previousSibling; }
        if (attr.expandCol) { if (_eIcon) { _eNode = _eIcon.previousSibling; } else { _eNode = _eTxt.previousSibling; } }
        return getFullT({ eTr: _eTD.pn(), eTd: _eTD, eDetail: _eDetail, eNode: _eNode, eIcon: _eIcon, eTxt: _eTxt, eVal: _eVal });
    }
    function getElmsByTr(_eTr) {
        if (!_eTr) { return; }
        var _eTD;
        if (args.hasCheckBox) { _eTD = _eTr.chn(1); } else { _eTD = _eTr.fc(); }
        var _elms = getElmsByTd(_eTD); _elms.eTr = _eTr;
        return _elms;
    }
    function getTdByKey(key, rowKey, keyType) {
        var _kT = keyType || 'ID', _rK = rowKey, _k = key, _eTr, _eTd;
        if (!_k) { return; }
        if (_rK) { _eTr = getTR(rowKey, keyType); } else { _eTr = attr.eSelTR; }
        if (!_eTr) { return; }
        if (typeof key == 'string') { _eTd = _eTr.chn(attr.colIdxObj[key]); } else { _eTd = _eTr.chn(key); }
        return _eTd;
    }
    function getDeleteApi() {
        var _dApi = args.deleteApi, _t = args.table;
        if (!_dApi && _t) {
            if (attr.expandCol) { _dApi = 'm=SYS_TABLE_TREE&action=delTreeNode'; } else { _dApi = 'm=SYS_TABLE_BASE&action=deleteByID'; }
            _dApi += '&table=' + _t;
        }
        return _dApi;
    }
    function resetVar() {
        /*
        attr.childs = {};
        attr.expandState = {};
        attr.ifLoading = false;
        attr.selIds = [];
        attr.selTrs = [];
        attr.eSelTR = null;
        attr.selID = null;
        */
    }
    function getJsonDownload() {
        var _aHead = attr.visColAry, _len = _aHead.length, _kv = {}, _skv = '';
        for (var i = 0; i < _len; i++) {
            var _col = _aHead[i], _type = _col.type, _k = _col.name, _name = _k;
            if (_type == 'checkbox') { continue; }
            if (attr.colWidth[i]) {
                _kv[_name] = _col.title;
                if (_col.ifTrans) { _k = 'dbo.SYS_TRANS_GT(' + _name + ')'; }
                if (_col.trans) { _k = 'dbo.' + _col.trans + '(' + _name + ')'; }
                var _n = ',' + _k;
                if (!_skv) { _n = _k; };
                _skv += _n;
            }
        }
        return '&jsonDownload=' + $.JSON.encode(_kv) + '&keyFields=' + _skv;
    }
    function toOperateHtml(items) {
        var _items = items || [], _sAry = [], _sI = '';
        var _oiArgs = { type: 'normal', target: '', title: '', text: '', icon: '', href: 'javascript:void(0);', css: '' };
        for (var j = 0, _jLen = _items.length; j < _jLen; j++) {
            var _item = $.init(_items[j], _oiArgs);
            switch (_item.type.toLowerCase()) {
                case 'normal':
                    _sI = '<A name="' + _item.name + '" href="' + _item.href + '" >';
                    if (_item.icon) { _sI += '<span class="A-icon ' + _item.icon + '" title="' + _item.title + '"></span>'; }
                    if (_item.text) { _sI += '<span class="A-text">' + _item.text + '</span>'; }
                    _sI += '</A>';
                    break;
                case 'button':

                    break;
            }
            _sAry.push(_sI);
        }
        return '<div class="td-detail" >' + _sAry.join('') + '</div>';
    }
    me.loadAjax = function (j) {
        var _args = j.args || '', _onSucc = j.onSuccess || args.onSuccess, _onErr = j.onError || args.onError;
        
        args.loadApi = _args;
        if (attr.ifLoading) { return; }
        if (!_args || !$.toArgsString(_args)) { return; }
        if (typeof _args == 'string') { _args = toArgsObj(_args); }
        owner.h('<div class="ajax-loading"><div class="img"></div><div class="text" >Loading...</div></div>').fc();
        if (attr.Paging) { _args.ifCount = 1; _args.pageIndex = attr.Paging.get('pageIndex'); _args.pageSize = attr.Paging.get('pageSize'); }
        attr.loadApi = _args;
        if (args.onLoadAjax({ List: me, Args: _args }) != false) {
            var _filterAry = args.filter, _sFilterAry = [];
            if (_filterAry.length) {
                for (var i = 0, _len = _filterAry.length; i < _len; i++) { _sFilterAry.push($.JSON.encode(_filterAry[i])); }
                _args.filterCondition = _sFilterAry.join('\u0001');
                attr.filter = _filterAry;
            }
            _args.keyFields = me.getKeyFieldsByHeader();
            _args.cSplit = '</td><td>';
            _args.rsplit = '</td></tr>';
            attr.loadArgsObj = _args;
            ajax(_args, _onSucc, _onErr);
        }
    }
    me.forwardPage = function (v) { attr.Paging.forwardPage(v); }
    me.refresh = function (cbFn, ifCheckSel, ifClick) {
        var _f = cbFn || {}, _onSucc = _f.onSuccess || _fn, _ifCS = (ifCheckSel == null ? true : ifCheckSel);
        ajax(attr.refreshApi, function (obj) {
            if (_ifCS) {
                if (ifClick) { me.fireClick(attr.selID, 'ID'); } else { setRowSel(me.getTRById(attr.selID)); }
                if (!attr.selID) { me.fireClick(0); }
            }
            _onSucc(obj);
        }, _f.onError);
        return me;
    }
    me.scrollTo = function (v) {
        return;
        var _val = (+v || 0);
        if (_val == -1) { _val = owner.scrollHeight; }
        owner.scrollTop = _val;
    }
    me.formatData = function (data) {
        var _dAry = [];
        switch ($.getType(data[0])) {
            case 'array':
                _dAry = data;
                break;
            case 'object':

                break;
        }
        return _dAry
    }
    me.loadArray = function (data, cbFn) {   //使用从本地数据中来获取数据
        var _f = cbFn || {}, _onSuc = _f.onSuccess || args.onSuccess, _onErr = _f.onError || args.onError;
        var _dType = $.getType(data), _html = '';
        if (_dType != 'array') { _html = '<div class="no-data" >Error Data Format</div>'; _onErr({ List: me, data: _html }); setBodyHtml(_html); return; }
        var _dAry = me.formatData(data), _dLen = _dAry.length;
        if (_dLen) {
            args.expandMode = 'hidden';
            var _header = args.aHeader, _hLen = _header.length, _trAry = [], _cbCheckAry = [];
            for (var i = 0; i < _dLen; i++) {
                var _sTR = '', _sAttr = '';
                for (var j = 0; j < _hLen; j++) {
                    var col = _header[j], _hType = col.type || 'none', _val = _dAry[i][j] || '';
                    switch (_hType.toLowerCase()) {
                        case 'checkbox':
                            if (_val) { _cbCheckAry.push(i); }
                            _sTR += '<td><div val="0" class="td-checkbox"><div class="td-checkbox-icon dn"></div></div></td>';
                            break;
                        case 'icon':
                            _sTR += '<td><div class="td-detail" ><div class="image ' + (col.image || '') + '" ></div><div class="td-value" ></div></div></td>';
                            break;
                        case 'operate':
                            _sTR += '<td>' + toOperateHtml(col.items) + '</td>';
                            break;
                        case 'process':
                            _sTR += '<td><div class="td-detail" ><div class="td-process"><div class="td-process-value" style="width:' + _val + '%</div></div><div class="td-value">' + _val + '</div></div></td>';
                            break;
                        case 'attr':
                            if (col.isLocalAttr) {
                                _sAttr += col.name + '="' + escape(col.value) + '" ';
                            } else if (col.isLinkAttr) {
                                //什么都不做
                            } else {
                                _sAttr += col.name + '="' + escape(_val) + '" ';
                            }
                            break;
                        default:
                            _sTR += '<td><div class="td-detail"><div class="td-text" MTips="1">' + _val + '</div><div class="td-value">' + _val + '</div></div></td>';
                            break;
                    }
                }
                _trAry.push('<tr ' + _sAttr + '>' + _sTR + '</tr>');
            }
            setBodyHtml(_trAry.join(''));
            me.setChecked(_cbCheckAry, true, 'rowIndex');
        } else {
            _html = ''; _onErr({ List: me, data: _html }); setBodyHtml(_html); return;
        }
    }
    me.calculateCols = function (td) {
        var _val = '', _eTR;
        if (td) {
            _eTR = td.pn();
            var _tdAry = _eTR.childNodes, _name = attr.idxObj[td.cellIndex].name, _tdLen = _tdAry.length;
            for (var i = 0; i < _tdLen; i++) {
                var _HO = attr.visColAry[i], _union = _HO.union || '';
                if (_union && _union.indexOf('$' + _name) != -1) {
                    var _tTD = _tdAry[i], _eVal = $(_tTD.fc().lastChild), _eText = _eVal.ps(), _cVal;
                    for (var j = 0; j < _tdLen; j++) {
                        var _eTD = _tdAry[j], _key = attr.idxObj[_eTD.cellIndex].name;
                        var _val = $(_eTD.fc().lastChild).h();
                        if (!_val) { _val = 0; }
                        _union = _union.replace('$' + _key, _val);
                    }
                    _cVal = eval(_union);
                    _eVal.h(_cVal); _eText.h(_cVal);
                }
            }
        }
        return me;
    }
    me.insertRow = function (data, position) {
        if (!attr.eTable || !data) { return me; }
        var _pos = position || -1, _eTR = $(attr.eTable.insertRow(_pos)), _obj, _idx = 0, mtips = '';
        for (var i = 0, _len = args.aHeader.length; i < _len; i++) {
            _obj = args.aHeader[i];
            var _key = _obj.name, _val = data[i] || data[_key] || '', _type = _obj.type.toLow();
            if (_type == 'attr') {
                _eTR.attr(_key, _val);
            } else {
                if (_obj.ifEnabledTips) { mtips = ' MTips="1" '; }
                var _tdHtml = '<div class="td-detail"><div class="td-text" ' + mtips + ' >' + _val + '</div><div class="td-value" >' + _val + '</div></div>';
                switch (_type) {
                    case 'operate':
                        _tdHtml = toOperateHtml(_obj.items);
                        break;
                    case 'icon':

                        break;
                }
                $(_eTR.insertCell(_idx)).h(_tdHtml);
                _idx++;
            }
        }
        return me;
    }
    me.reExpandTR = function (tr, type, ifClickSelRow) {
        if (!attr.expandCol) { return me; }
        var _eTR = me.deleteTR(tr, type, false);
        if (!_eTR) { return me; }
        var _id = _eTR.attr('rowid') || _eTR.attr('id');
        var _tApi = getTreeListApi(_id);
        if (_tApi) {
            $.Util.ajax({
                args: _tApi,
                onSuccess: function (d) {
                    insertTreeNodesByString(_eTR, d.data[0]);
                    var _eTD = _eTR.chn(attr.colIdxObj[attr.expandCol]);
                    $(_eTD.lastChild).fc().dc('td-loading').dc('td-fold').ac('td-unfold').attr('state', 1);
                    if (ifClickSelRow != false) { me.fireClick(attr.selID, 'ID'); } else { setRowSel(me.getTRById(attr.selID)); }
                    if (!attr.selID) { me.fireClick(0); }
                }
            });
        } else {
            MTips.show('请求API为空', 'warn');
        }
    }
    me.deleteTR = function (tr, type, ifRemoveSelf) {
        var _delTR = function (_tr, depth) { if (_tr && (+_tr.attr('depth')) > depth) { _delTR(_tr.ns(), depth); _tr.r(); _tr = null; }; }
        if (typeof tr != 'object') { tr = getTR(tr, type); }
        if (!tr) { return; me; }
        _delTR(tr.ns(), +tr.attr('depth'));
        if (ifRemoveSelf != false) { tr.r(); tr = null; } else { return tr; }
        return me;
    }
    me.getKeyFieldsByHeader = function (aHeader, dbT) {
        var _dbt = dbT || 'MSSQL';
        if (_dbt == 'MSSQL') { return getSql4MSSQL(aHeader); }
        if (_dbt == 'MYSQL') { return getSql4MYSQL(aHeader); }
    }
    me.setAllChecked = function (ifChecked) {
        var _table = attr.eTable;
        if (!_table) { return me; }
        if (ifChecked == null) { ifChecked = true; }
        var _rows = _table.rows, _rLen = _rows.length;
        for (var i = 0; i < _rLen; i++) { var _eCB = $(_rows[i].cells[attr.cbIdx]).fc(); setCheckBoxChecked(_eCB, ifChecked); }
        return me;
    }
    me.saveAsExecl = function (fileName, api, ifDownAll) {
        if (!$.global.iframe) { $.global.iframe = $DB.adElm('', 'iframe').cn('w0 h0 b0'); }
        var _temp = attr.loadApi;
        if (ifDownAll) { _temp.pageSize = 1; _temp.pageSize = 1000000; }
        _temp.keyFields = null; delete _temp.keyFields;
        $.global.iframe.src = 'meeko.aspx?' + (api || $.toArgsString(_temp)) + getJsonDownload() + '&fileName=' + (fileName || 'table');
    }
    me.getRowData = function (key, rowKey, keyType) {
        var _elms = getElmsByTr(getTdByKey(key, rowKey, keyType));
        console.log(_elms);

    }
    me.getRowDataByTR = function (tr) {
        var _dObj = {};
        if (tr && tr.tagName == 'TR') {
            var _cells = tr.cells, _cLen = _cells.length;
            for (var i = 0; i < _cLen; i++) {
                var _td = $(_cells[i]), _cIdx = _td.cellIndex, _HO = attr.idxObj[_cIdx], _name = _HO.key || _HO.name, _tObj = getTargetElm(_td, false);
                if (!_tObj || !_tObj.get) { continue; }
                _dObj[_name] = _tObj.get('value');
                _dObj[_name + '_text'] = _tObj.get('text');
            }
            for (var _a = 0, _aLen = attr.attrColAry.length; _a < _aLen; _a++) {
                var _HO = attr.attrColAry[_a], _name = _HO.key || _HO.name;
                _dObj[_name] = $(tr).attr(_HO.name);
            }
        }
        return _dObj;
    }
    me.delSelRows = function (onSucc, ids) {
        if (typeof _ids == 'string') { _ids = _ids.split(','); }
        var _ids = ids || attr.selIds || [], _idLen = _ids.length, _onSucc = onSucc || _fn;
        if (_idLen > 1) {
            MConfirm.setWidth(250).show('确定删除<font color="red">' + _idLen + '</font>项记录?').evt('onOk', function () {
                var _dApi = getDeleteApi();
                if (!_dApi) { MTips.show('删除接口为空', 'warn'); return; }
                $.Util.ajax({
                    args: _dApi += '&ids=' + _ids.join(','),
                    onSuccess: function () { MTips.show('删除记录成功!', 'ok'); me.refresh(null, ifFireClick); attr.selIds = []; attr.selTrs = []; _onSucc(); },
                    onError: function (d) { MTips.show('删除记录失败!', 'error'); }
                });
            });
        } else {
            MTips.show('没有选中项', 'warn');
        }
        return me;
    }
    me.deleteSelRow = function (ifFireClick) {
        if (attr.selID) {
            MConfirm.setWidth(250).show('确定删除ID为<font color="red">' + attr.selID + '</font>的记录?').evt('onOk', function () {
                var _dApi = getDeleteApi();
                if (!_dApi) { MTips.show('删除接口为空', 'warn'); return; }
                $.Util.ajax({
                    args: _dApi += '&id=' + attr.selID,
                    onSuccess: function () { MTips.show('删除记录成功!', 'ok'); me.deleteTR(attr.eSelTR); attr.eSelTR = null; attr.selID = null; if (ifFireClick != false) { me.fireClick(0); } },
                    onError: function (d) { MTips.show('删除记录失败!', 'error'); }
                });
            });
        } else {
            MTips.show('请先选择要删除的记录', 'warn');
        }
    }
    me.orderSelNode = function (order, fn) {
        if (attr.selID != null && args.orderApi) {
            var _order = order || 'asc', _f = fn || _fn;
            if (_order.toLowerCase() == 'asc') { _order = '1'; } else { _order = '0'; }
            $.Util.ajax({
                args: $.toArgsString(args.orderApi) + '&id=' + attr.selID + '&order=' + _order,
                onSuccess: function () { me.refresh(null, true, true); _f({ List: me, Args: args, Attr: attr }); }
            });
        } else {
            MTips.show('没有选中项或排序API(orderApi)不存在', 'warn');
        }
        return me;
    }
    me.expandNode = function (key, keyType) { expand(getTR(key, keyType)); }
    me.reCreate = function (aHeader, api) {
        if (api) { me.set('loadApi', api); }
        me.set('aHeader', aHeader);
        for (var idx in attr) { var _attr = attr[idx]; if (_attr && _attr.remove && !_attr.tagName) { _attr.remove(); _attr = null; } }
        if (owner) { owner.h('').r(); };
        attr = {}; setDefault(args); layout(); return me;
    }
    me.setSelected = function (value, type) { setRowSel(value, type); return me; }
    me.setChecked = function (key, value, type) {
        if ($.getType(key) == 'array') {
            for (var i = 0, _iLen = key.length; i < _iLen; i++) { setCheckBoxChecked(getCBElm(key[i], type), value); }
        } else {
            setCheckBoxChecked(getCBElm(key, type), value);
        }
        return me;
    }
    me.fireChecked = function (key, type) { clickCheckBox(getCBElm(key, type)); return me; }
    me.fireClick = function (key, type) { clickRow(getElmsByTr(getTR(key, type))); return me; }
    me.getTRByIdx = function (v) { if (v == null || !attr.eTable) { return; }; return $(attr.eTable.rows[+v]); }
    me.getTRById = function (v) {
        var _table = attr.eTable, _tr = null;
        if (v == null || !_table) { return; };
        var _rows = _table.rows, _len = _rows.length;
        for (var i = 0; i < _len; i++) { var _eTr = _rows[i]; if (_eTr.getAttribute('rowId') == v || _eTr.getAttribute('id') == v) { _tr = $(_eTr); break; } }
        return _tr;
    }
    me.setAttr = function (k, v) { return attr[k] = v, me; }
    me.getAttr = function (k) { return attr[k]; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
};

$.UI.View = function (args) {
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, url: '', onLoad: _fn, ifCheckCookie: false }, view;
    function _getFunction(URL) { var _ary = URL.toString().replaceAll('.js', '').trim().split('/'), _ns; for (var i = 1, _len = _ary.length; i < _len; i++) { var _name = _ary[i]; _ns = (_ns ? _ns[_name] : $View[_name]); }; return _ns; };
    me.go = me.loadView = function (_args) {
        if (!(args.ifCheckCookie ? $.session.check() : true) || !_args) { return; }
        var _url = _args.url || '', _fn = _args.onLoad || args.onLoad; _args.p = _args.p || args.p
        if (!_url || !_args.p) { return; };
        _args.p.h('<div class="loading32" style="width:320px;height:240px;margin:60px auto;"></div>');
        $.loadjs(_url, function () { _args.p.h(''); var _ns = _getFunction(_url); if (!_ns) { me.loadView({ url: 'View/error/Error404.js', href: _url }); return; }; view = new _ns(_args); _fn(view, me); });
    };
    return $.extendView(this, args, _args), me.loadView(args), this;
}

$.Layer = new function () {
    var _c = 1, _m = (new $.UI.Mask({ p: $DB, alpha: 20 })).hide(), _idx = 0;
    this.get = function (ifMask) { _idx++; var _d = $DB.adElm('div').css('z-index:' + this.getZIndex(ifMask) + ';position:absolute;').attr('idx', _idx); return _d.attr('mask', (ifMask ? 1 : 0)), (ifMask ? _m.show() : _m.hide()), _d; }
    this.next = function (owner) { if (!owner) { return this; };  _c = _c - 2; if (owner && +owner.attr('mask')) { _m.owner.css('z-index:' + (_c - 1)); _m.hide(); }; return this; };
    this.showMask = function () { return _m.show(), this; }
    this.hideMask = function () { return _m.hide(), this; }
    this.getZIndex = function (ifMask) { return _c++, (ifMask ? _m.owner.css('z-index:' + _c) : void (0)), _c++, _c; }
    this.remove = function () {; var _t = this.next(); return _t ? _t.r() : void (0), this; }
    return this;
}

$.UI.ScrollBar = function (args) {
    /* 
    { 
        type: "ScrollBar", 
        desc: "自定义的滚动Bar", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            barWidth: { desc: 'bar的宽度', defVal: 5, dataType: 'int' },
            skin: { desc: '皮肤样式', defVal: 'ScrollBar-default', dataType: 'string' },
            ifFixedHeight: { desc: '是否固定高度', defVal: false, dataType: 'bool' },
            onResize:{ desc: '回调Resize事件', defVal: function (){}, dataType: 'function' },
            onDragStart:{ desc: '回调开始拖动事件', defVal: function (){}, dataType: 'function' },
            onDrag:{ desc: '回调正在拖动事件', defVal: function (){}, dataType: 'function' },
            onDragEnd:{ desc: '回调拖动结束时间', defVal: function (){}, dataType: 'function' }
        }
    } 
    */
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB, skin: 'ScrollBar-default', ifFixedHeight: false, barWidth: 5, onResize: _fn, onDragStart: _fn, onDrag: _fn, onDragEnd: _fn };
    var hRate, vRate, p, hBar, vBar;
    var sMoveDis = 100, _cH, _bH, _ppH, _ifHtml = false, _tempHtml;
    function _default() { p = args.p; }
    function _layout() {
        _ifHtml = (_tempHtml=p.h()) ? (p.h(''), true): false;
        owner = p.ac('scroll').dc('oa').adElm('', 'div').cn('scroll-body' + (args.ifFixedHeight ? '' : ' hp'));
        hBar = p.adElm('', 'div').cn('scroll-bar scroll-bar-bottom').adElm('', 'a').css('left:0px;');
        vBar = p.adElm('', 'div').cn('scroll-bar scroll-bar-right').adElm('', 'a').css('top:0px;;');
        if (_ifHtml) { me.html(_tempHtml); }
    }
    function _event() {
        /*
        { 
            e: 事件源,
            t: e元素的父节点,
            n: minX, 横坐标最小值, 如果没有默认是0,
            r: maxX, 横坐标最大值,
            i: minY, 纵坐标最小值, 如果没有默认是0,
            s: maxY, 纵坐标最大值,
            o: 如果不是null, 则是0, 如果是null  则是1, 如果是1则只能在纵坐标上拖 垂直拖
            u: 如果不是null, 则是0, 如果是null  则是1, 如果是1则只能在横坐标上拖 水平拖
            a: xFn,
            f: yFn
        }
        */
        hBar.evt('mousedown', function (e) {
            var e = $.e.fix(e), _e = e.t;
            $.drag.init(_e, null, 0, p.csn('width') - _e.csn('width'), null, 0, null, 1);
            _e.onDragStart = function () { args.onDragStart(); };
            _e.onDrag = function (diff, b) { owner.css("margin-left:-" + (diff / hRate * 100) + "px;"); args.onDrag(); }
            _e.onDragEnd = function () { args.onDragEnd(); }
            $.drag.start(e, _e);
            e.stop();
        });
        vBar.evt('mousedown', function (e) {
            var e = $.e.fix(e), _e = e.t;
            $.drag.init(_e, null, null, null, 0, p.csn('height') - _e.csn('height'), 1, 0);
            _e.onDragStart = function () { args.onDragStart(); };
            _e.onDrag = function (a, diff) { var _val = (diff / vRate * 100); if (_val > (_cH - _ppH)) { _val = _cH - _ppH; }; owner.css("margin-top:-" + _val + "px;"); args.onDrag(); };
            _e.onDragEnd = function () { args.onDragEnd(); }
            $.drag.start(e, _e);
            e.stop();
        });
        args.p.evt('mousewheel', function (e) {
            var e = $.e.fix(e);
            var wheelDelta = e.wheelDelta || e.detail; //鼠标滚动值，可由此判断鼠标滚动方向
            if (wheelDelta == -120 || wheelDelta == 3) {
                fnChangePos(owner.csn('margin-top') - sMoveDis);    //向上
            } else if (wheelDelta == 120 || wheelDelta == -3) {
                fnChangePos(owner.csn('margin-top') + sMoveDis);    //向下
            }
        });
    }
    function fnChangePos(data) {
        if (data > 0) { data = 0; }
        if (-data > (_cH - _ppH)) { data = _ppH - _cH; }
        owner.css('margin-top:' + data + 'px;');
        vBar.css('top:' + (-(data / _cH) * _ppH) + 'px;');
    }
    me.addElm = function (obj) {
        var _obj = obj || {}, _type = _obj.type, _onSuc = _obj.onSuccess || _fn;
        if (!_type) { return; }
        if (owner.h()) { owner.h('');}
        _obj.p = owner;
        _obj.onSuccess = function () { me.initBar(); _onSuc({ ScrollBar: me, Args: obj }); }
        var _elm = new $.UI[_type](_obj);
        return me.initBar(), _elm;
    }
    me.html = function (html) { return owner.h(html), me.initBar(), me; }
    me.load = function (url) { return owner.load(url), me.initBar(), me; }
    me.initBar = function () {
        var _pW = p.csn('width'), _pH = p.csn('height'), _pW1 = owner.csn('width'), _pH1 = owner.csn('height');
        hRate = $.m.p(_pW / _pW1 * 100); vRate = $.m.p(_pH / _pH1 * 100);
        if (hRate < 100) { hBar.css('width:' + hRate + '%;'); hBar.pn().dc('dn'); } else { hBar.pn().ac('dn'); }
        if (vRate < 100) { vBar.css('height:' + vRate + '%;'); vBar.pn().dc('dn'); } else { vBar.pn().ac('dn'); }
        _cH = _pH1; _ppH = _pH; _bH = vRate * _pH1 / 100;
        args.onResize({ ScrollBar: me, pW: _pW, pH: _pH });
    }
    me.scrollTopTo = function (v) { return fnChangePos(-v), me; }
    return $.extendView(this, args, _args).main(_default, _layout, _event).setOwner(owner), this;
}

$.UI.PopDialog = function (args) {
    /* 
    { 
        type: "PopDialog", 
        desc: "弹出对话框组件", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            ifFixedHeight: { desc: '弹出容器是否固定高度', defVal: false, dataType: 'bool' },
            skin: { desc: '皮肤样式(类名)', defVal: 'PopTips-default', dataType:'string' },
            ePop: { desc: '弹出框依附的元素', defVal: null, dataType: 'DOM' },
            ifClose: { desc: '是否可关闭', defVal: false, dataType: 'bool' },
            cn: { desc:'PopDialog结构最外一层的类名(Class-Name)',defVal: '', dataType: 'string' },
            css: { desc:'PopDialog结构最外一层的样式(Style)',defVal: '', dataType: 'string' }
        } 
    } 
    */
    var me = this, owner, _fn = function () { };
    var scrollBar, _com, temp, _dx = 16;
    var _args = { ifFixedHeight: false, skin: 'PopTips-default', arrowBC: '#CCC', ifMask: false, arrowBBC: '#FFF', ePop: null, cn: '', css: '', ifClose: false };
    function _default() { }
    function _layout() {
        owner = $.Layer.get(args.ifMask).cn(args.skin + ' ' + args.cn).css('left:0px;top:0px;' + args.css).evt('click', function (e) { var e = $.e.fix(e); e.stop(); });
        owner.onselectstart = function () { return false; };
        scrollBar = (new $.UI.ScrollBar({ p: owner, ifFixedHeight: args.ifFixedHeight })).evt('onResize', _onScrollBarResize);
    }
    function _event() { if (args.ifClose) { owner.adElm('', 'a').cn('pt-close').attr('title', '关闭').evt('click', _onClose); } }
    function _override() {
        me.remove = function () { $.Layer.next(owner); _removeArrow(); owner?owner.r():void(0); owner = null;}
        me.hide = function () { _removeArrow(); owner.ac('vh'); return me; }
        me.show = function () { owner.dc('vh'); return me; }
        me.evt = function (k, v) { return _com.evt(k, v), me; }
    }
    function _onScrollBarResize (obj){
        var _ePop = args.ePop, h = obj.pH, w = obj.pW;
        if (_ePop && h) {
            var _pos = _ePop.pos(), _x = _pos.x, _y = _pos.y, _h = _pos.h;
            var _newX = _x + 1, _newY = _y + _h;
            var _w_wh = $.wh(), _ww = _w_wh[0] * 2, _wh = _w_wh[1] * 2;
            var _aw = w + _x, _ah = h + _y + _h + 5;
            if (_ah > _wh) { _newY = _y - h - _h + 11; }
            if (_aw > _ww) { _newX = _x - w + _pos.w - 22; _dx = owner.csn('width') - 25; }
            if (_newY < 0) { _newY = 0; }
            if (_newX < 0) { _newX = 0; }
            me.setPos(_newX, _newY, _pos);
        }
    }
    function _onClose() { return me.remove(); }
    function _removeArrow() { if (temp) { temp.r(); temp = null; }; }
    function _clear() { scrollBar.html(''); owner.style.cssText = 'z-index:' + owner.cs('z-index') + ';left:0px;top:0px;'; owner.cn(args.skin + ' scroll'); _removeArrow(); return me; }
    me.setStyle = function (cn, css) { owner.style.cssText = 'z-index:' + owner.cs('z-index') + ';left:0px;top:0px;'; owner.cn(args.skin + ' scroll'); if (cn) { owner.ac(cn); }; if (css) { owner.css(css); }; return me; }
    me.init = function (obj, ifReturnCom) { _com = scrollBar.addElm(obj); args.ifMask ? $.Layer.showMask() : void (0); return ifReturnCom ? _com : me; }
    me.html = function (v) { scrollBar.html(v); return args.ifMask ? $.Layer.showMask() : void (0), me; }
    me.resetArgs = function (v) { for (var k in v) { args[k] = v[k]; }; return me; };
    me.resize = function () { _removeArrow(); scrollBar.initBar(); return me; }
    me.getPos = function () { return owner.pos(); }
    me.setPos = function (x, y, pos) {
        var _dir = 'top';
        if (!temp) { temp = $DB.adElm('', 'div').cn('w16 h16 pa').css('z-index:' + owner.cs('z-index') + ';'); }
        if (y > pos.y) {
            _dir = 'top';
            y += owner.csn('padding-top');
            temp.css('top:' + (y - 13) + 'px;left:' + (x + (+_dx)) + 'px;');
        } else {
            _dir = 'bottom';
            y -= owner.csn('padding-bottom');
            temp.css('top:' + (y + owner.csn('height') + 13) + 'px;left:' + (x + (+_dx)) + 'px;');
        }
        temp.h($.UI.Arrow({ p: temp, diff: 1, comMode: 'border', borderColor: args.arrowBC, backgroundColor: args.arrowBBC, cn: 'cp', css: 'padding:3px 5px;border:1px solid #FFC97C;background-color:#FFFEC9;z-index:25;max-width:320px;', dir: _dir }));
        owner.css('left:' + x + 'px;top:' + y + 'px;').show();
        return me;
    }
    me.destroy = function () { return me.remove(), me; }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}

$.Dialog = new function () {
    var _a = {}, _dk = 'nomask';
    function _d(k) { if (typeof k == 'string') { _d(_a[k]); } else { (k && k.remove) ? k.remove() : void (0); }; };
    this.get = function (obj, key) {
        var _obj = obj || {}, _k = key || _dk, _d = _a[_k];
        if (_d) { _a[_k].remove(); _a[_k] = null; delete _a[_k]; }
        return _a[_k] = new $.UI.PopDialog(_obj), _a[_k];
    };
    this.destroy = function (k) { return _d(_a[k || _dk]), this;}
    this.destroyAll = function () { for (var k in _a) { _d(_a[k]); }; return this; }
}

$.UI.PopTips = function (args) {
    /* 
    { 
        type: "PopTips", 
        desc: "弹出的提示框, 有文字提示类型, 确认类型, 模式提示类型", 
        args: { 
            p: { desc: '父容器', defVal: $DB, dataType: 'DOM' },
            width: { desc: '组件的宽度', defVal:150, dataType: 'int' },
            height: { desc: '组件的高度', defVal:120, dataType: 'int' },
            comMode: { desc: '组件的模式', defVal:'auto', dataType: 'int' },
            type: { desc: '类型', defVal:'alert', dataType: 'string' },
            content: { desc: 'body部分的内容', defVal:'', dataType: 'string' },
            ifClose: { desc: '是否有关闭按钮', defVal:true, dataType: 'bool' },
            ifShow: { desc: '是否显示', defVal:true, dataType: 'bool' },
            onOk:{ desc: '回调确认的事件', defVal: function (){}, dataType: 'function' },
            onCancle:{ desc: '回调取消的事件', defVal: function (){}, dataType: 'function' }
        }
    } 
    */
    var me = this, owner, _fn = function () { };
    var _args = { onOk: _fn, onCancle: _fn };
    var tips, _eC;
    function _default() { }
    function _layout() {
        tips = new $.UI.Tips({
            head_h: 38, foot_h: 40, css: 'z-index:1100;', title: '确认对话框', comMode: 'x-auto', y: 120, ifFixedHeight: true, width: 250, height:150, ifClose: true, ifMask: true,
            content: '<div class="fl wp fs12 hh" style="height:54px;line-height:54px;" ><div class="fl hp wa quest_40 m5" style="width:40px;"></div><div class="fl p5 hp"></div></div>',
            onClose: function () { tips.hide(); return false; }
        }).hide();
        _eC = tips.body.fc().chn(1);
        new $.UI.ButtonSet({ p: tips.foot, itemAlign: 'right', items: [{ text: '确定', name: 'confirm', skin: 'btn-primary', css: 'margin-top:7px;' }, { text: '取消', name: 'cancle', skin: 'btn-danger', css: 'margin-top:7px;' }], onClick: _onclick });
    }
    function _event() { }
    function _override() {
        me.show = function (text) { return text ? (_eC.h(text), tips.show()) : void (0), me; }
        me.hide = function () { return tips.hide(), me; }
    }
    function _onclick(obj) { obj.PopTips = me; switch (obj.name) { case 'confirm': args.onOk(obj); break; case 'cancle': args.onCancle(obj); break; } me.hide(); }
    me.setWidth = function (width) { if (!width) { return me; }; tips.base.css('width:' + width + 'px;margin-left:-' + (width / 2) + 'px;'); _eC.css('width:' + (width - 84) + 'px;'); return me; }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}

$.UI.Arrow = function (args) {
    var _args = { cn: '', css: '', comMode: 'normal', diff: 3, dir: 'bottom', borderColor: '#bbbbbb', backgroundColor: '#ffffff', w: 10 };
    var _a = $.init(args, _args), _b = { blw: _a.w, btw: _a.w, brw: _a.w, bbw: _a.w, blc: '#999999', btc: '#999999', brc: '#999999', bbc: '#999999' }, dir = _a.dir, diff = _a.diff, cn = _a.cn, css = _a.css;
    var bc = _a.borderColor, bgc = _a.backgroundColor;
    var _blw = _b.blw, _btw = _b.btw, _brw = _b.brw, _bbw = _b.bbw;
    var _blc = _b.blc, _btc = _b.btc, _brc = _b.brc, _bbc = _b.bbc;
    var _bls = _blc ? 'solid' : 'dashed', _bts = _btc ? 'solid' : 'dashed';
    var _brs = _brc ? 'solid' : 'dashed', _bbs = _bbc ? 'solid' : 'dashed';
    var html = '';
    switch (_a.comMode.toLowerCase()) {
        case 'normal':
            var _tcn = '', _tcss = '';
            switch (dir) {
                case 'bottom':
                    _tcn = 'TipsArrowB'; _tcss = 'border-right-color: ' + bc + ';';
                    break;
                case 'top':
                    _tcn = 'TipsArrowT'; _tcss = 'border-right-color: ' + bc + ';';
                    break;
                case 'right':
                    _tcn = 'TipsArrowR'; _tcss = 'border-bottom-color: ' + bc + ';';
                    break;
                case 'left':
                    _tcn = 'TipsArrowL'; _tcss = 'border-bottom-color: ' + bc + ';';
                    break;
            }
            html = '<i class="TipsArrow TipsArrowG ' + _tcn + '" style="' + css + _tcss + '"></i>';
            break;
        case 'border':
            var bw = 0;
            if (dir == 'bottom' || dir == 'top') { bw = $.m.p(_a.p.csn('width') / 2); }
            if (dir == 'left' || dir == 'right') { bw = $.m.p(_a.p.csn('height') / 2); }
            var _cCss = ';+overflow:hidden;border-width:' + bw + 'px;', _s1 = '', _s2 = '';
            switch (dir) {
                case 'bottom':
                    _cCss += 'border-style:solid dashed dashed dashed;border-color:' + bc + ' transparent transparent transparent;';
                    _s2 += 'top:-' + diff + 'px;border-color:' + bgc + ' transparent transparent transparent;';
                    break;
                case 'top':
                    _cCss += 'border-style:dashed dashed solid dashed;border-color:transparent transparent ' + bc + ' transparent;';
                    _s2 += 'bottom:-' + diff + 'px;border-color:transparent transparent ' + bgc + ' transparent;';
                    break;
                case 'right':
                    _cCss += 'border-style:dashed dashed dashed solid;border-color:transparent transparent transparent ' + bc + ';';
                    _s2 += 'top:0px;right:' + diff + 'px;border-color:transparent transparent transparent ' + bgc + ';';
                    break;
                case 'left':
                    _cCss += 'border-style:dashed solid dashed dashed;border-color:transparent ' + bc + ' transparent transparent;';
                    _s2 += 'top:0px;left:' + diff + 'px;border-color:transparent ' + bgc + ' transparent transparent';
                    break;
            }
            html = '<div class="TipsArrow" style="' + _cCss + '" ></div><div class="TipsArrow" style="' + _cCss + _s2 + ';" ></div>';
            break;
    }
    return html;
}

$.UI.MiniTips = function (args) {
    var me = this, owner, _fn = function () { };
    var _args = {
        pos: 0, minWidth: 25, minHeight: 18, ifShow: true, ifClose: false, mode: 'normal', ifCenter: false, ifMask: false,
        arrowSize: 16, cn: '', css: 'padding:3px 5px;border:1px solid #FFC97C;background-color:#FFFEC9;color:#E43734;'
    };
    var body, eArrow, _ePop;
    function _default() {  }
    function _layout() {
        owner = $.Layer.get(args.ifMask).cn('r3 ' + args.cn).css(args.css+';z-index:1000;').hide();
        if (args.ifClose) { owner.adElm('', 'div').cn('w15 h15 fr cp').css('margin-top:-15px;margin-right:-15px;').attr('title', '关闭').h('x').evt('click', function () { me.remove(); });}
        body = owner.adElm('', 'div').css('min-width:' + args.minWidth + 'px;min-height:' + args.minHeight + 'px;max-width:320px;line-height:18px;font-size: 12px;');
        eArrow = owner.adElm('', 'div').cn('pa oh');
    }
    function _event() { }
    function _overwrite() {
        me.show = function (text, type) {
            if (text) {
                me.setText(text).setSkin(type); owner.css('z-index:'+$.Layer.getZIndex(args.ifMask)+':top:50px;left:50%;margin-left:-' + (owner.csn('width') / 2) + 'px;').show(); _show();
            } else {
                owner.show();
            }
            return me;
        }
        function _show() { $.animate({ begin: -50, end: 50, step: 16, easing: 'easeNone', interval: 200, onRunning: function (obj) { owner.css('top:' + obj.value + 'px;'); setTimeout(_hide, 3000); } }); }
        function _hide() { $.animate({ begin: 50, end: -50, step: 16, easing: 'easeNone', interval: 200, onRunning: function (obj) { owner.css('top:' + obj.value + 'px;'); } }); }
    }
    me.setStyle = function (cn, css) { return owner.cn(cn).css(css), me; }
    me.setPos = function (x, y) { return owner.css('left:' + x + 'px;top:' + y + 'px;'), me; }
    me.setText = function (txt) { body.h(txt); owner.show(); return me; }
    me.setTarget = function (_e, _dir) {
        //if (_e == _ePop) { return me; }
        var _e = _e, _epos = _e.pos(), _ow = owner.csn('width'), _oh = owner.csn('height'), dir = (_dir || 'top').toLowerCase(), _ox = 100, _oy = 100; _ePop = _e;
        var _w_wh = $.wh(), _ww = _w_wh[0] * 2, _wh = _w_wh[1] * 2, _diff = 8, _ift = false;
        var _pl = owner.csn('padding-left'), _pr = owner.csn('padding-right'), _pt = owner.csn('padding-top'), _pb = owner.csn('padding-bottom');
        var pos = args.pos, minW = args.minWidth, minH = args.minHeight, arrSize = args.arrowSize;
        if (pos < 0) { pos = 0; }
        if (pos > minH) { pos = minH - arrSize; }
        if (pos > minW) { pos = minW - arrSize; }
        var _dirCss = 'width:' + arrSize + 'px;height:' + arrSize + 'px;', _dirH = '';
        if (args.ifCenter) { pos = ((_ow + _pl + _pr) / 2) - _diff - 2; };
        if (dir == 'top' && (_epos.y + _epos.h + _oh + _diff) > _wh) { dir = 'bottom'; _ift = true; };
        if (dir == 'bottom' && !_ift && _epos.y < _oh) { dir = 'top'; };
        if (dir == 'left' && (_epos.x + _epos.w + _ow + _diff) > _ww) { dir = 'right'; _ift = true; };
        if (dir == 'right' && _epos.x < _ow && !_ift) { dir = 'left'; };
        switch (dir) {
            case 'top':
                _dirCss += 'top:-' + arrSize + 'px;left:' + pos + 'px;';
                _ox = _epos.x-8; _oy = _epos.y + _epos.h + _diff;
                break;
            case 'bottom':
                _dirCss += 'bottom:-' + arrSize + 'px;left:' + pos + 'px;';
                _ox = _epos.x-8; _oy = _epos.y - _oh - _diff - _pt - _pb -2;
                break;
            case 'right':
                _dirCss += 'right:-' + arrSize + 'px;top:' + pos + 'px;';
                _ox = _epos.x - _ow - _diff - _pl - _pr - 2; _oy = _epos.y;
                break;
            case 'left':
                _dirCss += 'left:-' + arrSize + 'px;top:' + pos + 'px;';
                _ox = _epos.x + _epos.w + _diff; _oy = _epos.y;
                break;
        }
        _oy = _oy < 0 ? 0 : _oy; _ox = _ox < 0 ? 0 : _ox;
        var _aBC = $S(owner).borderColor, _aBGC = $S(owner).backgroundColor;
        _aBC = _aBC ? _aBC : owner.cs('border-color'); _aBGC = _aBGC ? _aBGC : owner.cs('borderground-color');
        eArrow.style.cssText = '';
        eArrow.css(_dirCss).h($.UI.Arrow({ p: eArrow, diff: 1, comMode: args.mode, borderColor: _aBC, backgroundColor: _aBGC, dir: dir }));
        return owner.css('left:' + _ox + 'px;top:' + _oy + 'px;'), me;
    }
    me.setSkin = function (skin) {
        //owner.style.cssText = '';
        switch (skin) {
            case 1:
                owner.css('border:1px solid #0FA6D8;background-color:#0FA6D8;color:#ffffff;'); break;
            case 2:
                owner.css('border:1px solid #F26C4F;background-color:#F26C4F;color:#ffffff;'); break;
            case 3:
                owner.css('border:1px solid #FF9900;background-color:#FF9900;color:#ffffff;'); break;
            case 4:
                owner.css('border:1px solid #CC0001;background-color:#CC0001;color:#ffffff;'); break;
            case 'ok':
            case 'pass':
                owner.css('border:1px solid #00CC33;background-color:#00cc33;color:#ffffff;'); break;
            case 'error':
                owner.css('background-color: #f00;border:1px solid #FC0808;color:#ffffff;'); break;
            case 'warn':
                owner.css('background-color: #ff7800;border:1px solid #FF7800;color:#ffffff;'); break;
            case 'loading':
                owner.css('background-color: #3EABFF;border:1px solid #3EABFF;color:#ffffff;'); break;
            case 'info':
                owner.css('background-color: #000000;border:1px solid #000000;color:#ffffff;'); break;
            default:
                owner.css('background-color: #000000;border:1px solid #3EABFF;color:#ffffff;'); break;
        }
        return me;
    };
    return $.extendView(this, args, _args).main(_default, _layout, _event, _overwrite).setOwner(owner.hide()),this;
}

$.toArgsObj = function (argsStr) {
    if (typeof argsStr == 'object') { return argsStr; }
    var _kvAry = argsStr.split('&'), _len = _kvAry.length, _kv = {};
    for (var i = 0; i < _len; i++) { var _sAry = _kvAry[i].split('='); _kv[_sAry[0]] = _sAry[1]; }
    return _kv;
}

$.toArgsString = function (argsObj) {
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

$.initArrowTips = function (obj, css) {
    var _css = css || 'width:915px;height:520px;padding:5px 10px 5px 10px;';
    return $.Dialog.get({ ePop: obj.Owner, ifClose: true, arrowBBC: '#FFF', css: _css }, 'tips');
}

/*初始化*/
$(function () {
    if (!window.MConfirm) { window.MConfirm = new $.UI.PopTips({ ifMask: true }); }
    if (!window.VTips) { window.VTips = new $.UI.MiniTips({}); }
    if (!window.MsgTips) { window.MsgTips = new $.UI.MiniTips({}); }
    if (!window.MTips) { window.MTips = new $.UI.MiniTips({}); }
    //VTips.setSkin('error').setText('张同志张').setTarget($DB, 'top');
    //MTips.show('加载中...', 'loading');
    //MConfirm.setWidth(250).show('xfsadfasdfas');
    $D.evt('click', function (e) {
        $.Dialog.destroy();
    }).evt('mousemove', function (e) {
        var e = $.e.fix(e), _e = e.t, _e = _getTarget(_e)
        if (!_e) { MsgTips.hide(); return; }
        var _title = _e.attr('_title'), _dir = _e.attr('_dir') || 'bottom';
        _title = (_title == '1' || _title == 'true') ? (_e.h() || _e.value) : _title;
        if (_title) {
            MsgTips.setSkin('info').setText(_title).setTarget(_e, _dir).show();
        } else {
            MsgTips.hide();
        }
    });
    function _getTarget(_e) { if (!_e||_e.tagName=='BODY') { return null; }; if (_e.attr('_title')) { return _e; } else { return _getTarget(_e.pn()); } }
});