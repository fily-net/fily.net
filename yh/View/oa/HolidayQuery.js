$.NameSpace('$View.oa');
$View.oa.HolidayQuery = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, startYear: null, endYear: null };
    var coms = {}, _now = new Date(), _year = _now.getFullYear();
    var highCn = 'bc_c6 cp', selCn = 'bc_19', nowCn = 'bc_c5';
    var eDate;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _s = args.startYear || (_year - 5), _e = args.endYear || (_year + 5), _yItems = [];
        for (var i = _s; i < _e; i++) { _yItems.push({ name: i, value: i, text: i }); }
        var comArgs = { 'root': { head_h: 30, foot_h: 0, cn: 'b0', title: '节假日设定', icon: 'icon-glyph-calendar', toolBarSkin: 'Button-default', toolBarAry: [{ text: _year + '年', value: _year, name: 'year', items: _yItems, type: 'menu', icon: 'icon-compact-line-tb', css: 'margin-top:3px;', cn: 'mr10'}], onToolBarMenuClick: onToolBarMenuClick} }
        var struct = { p: owner, type: 'Tips', name: 'root' }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        eDate = coms.root.body; loadByYear();
    }

    function onToolBarMenuClick(obj) {
        var _btn = obj.Button, _val = obj.Value;
        _btn.setText(_val + '年').set('value', _val); loadByYear(_val);
    }

    function loadByYear(year) {
        var _val = year || _year;
        $.Util.ajax({
            args: 'm=SYS_CM_OA&action=loadHolidayByYear&keyFields=month,dateAll&dataType=json&year=' + _val,
            onSuccess: function (d) {
                var _sAry = d.get(0), _dAry = [], _yData = [];
                eDate.h('');
                if (_sAry) { _dAry = eval(_sAry); }
                for (var _d = 0, _dLen = _dAry.length; _d < _dLen; _d++) {
                    var _obj = _dAry[_d], _m = +_obj.month;
                    if (!_yData[_m]) { _yData[_m] = {}; }
                    _yData[_m][_obj.dateAll] = highCn;
                }
                for (var i = 1; i < 13; i++) {
                    var _temp = i, _dsa = _yData[i] || {};
                    if (i < 10) { _temp = '0' + i; }
                    var _nowD = _val + '-' + _temp;
                    var cal = new $.UI.Calendar({
                        p: eDate.adElm('', 'div').cn('pr fl r5 b_17 m5').css('width:23%;height:31%;'),
                        hStyle: ["日", "一", "二", "三", "四", "五", "六"], hType: 'arrow',
                        nowD: _nowD, nowCn: nowCn, selCn: selCn,
                        ifLockYM: true, dStyleAry: _dsa
                    });
                }
            },
            onError: function () { MTips.show('加载数据失败!', 'error'); }
        });
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