$.namespace('$View.oa');
$View.oa.Holiday = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, startYear: null, endYear: null };
    var _now = new Date(), _year = _now.getFullYear();
    var highCn = 'bc_c6 cp', selCn = 'bc_19', nowCn = 'bc_c5', eDate;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _s = args.startYear || (_year - 5), _e = args.endYear || (_year + 5), _yItems = [];
        for (var i = _s; i < _e; i++) { _yItems.push({ name: i, value: i, text: i }); }
        var comArgs = { 'root': { head_h: 37, foot_h: 0, cn: 'b0', title: '节假日设定', icon: 'icon-glyph-calendar', toolBarSkin: 'Button-default', toolBarAry: [{ text: _year + '年', value: _year, name: 'year', items: _yItems, type: 'menu', skin:'btn-primary', icon: 'icon-compact-line-tb', css: 'margin-top:3px;', cn: 'mr10'}], onToolBarMenuClick: onToolBarMenuClick} }
        var struct = { p: owner, type: 'Tips', name: 'root' }
        coms = $.layout({ args: comArgs, struct: struct });
        eDate = coms.root.body; loadByYear();
    }
    function _event() { }
    function _override() { }
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
                        ifLockYM: true, dStyleAry: _dsa,
                        onClickBefore: function (obj) { onCalClick(obj); return false; }
                    });
                }
            },
            onError: function () { MTips.show('加载数据失败!', 'error'); }
        });
    }

    function onCalClick(obj) {
        var _valAry = obj.Value.split('-'), _e = obj._E;
        $.Util.ajax({
            args: 'm=SYS_CM_OA&action=setHoliday&json={"year":"' + _valAry[0] + '","month":"' + _valAry[1] + '","day":"' + _valAry[2] + '"}',
            onSuccess: function () {
                var _cn = _e.className;
                if (_cn.ec(selCn)) { _e.dc(selCn); }
                if (_cn.ec(highCn)) { _e.ac(selCn).dc(highCn); } else { _e.ac(highCn); }

            },
            onError: function () { MTips.show('操作失败!', 'error'); }
        });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}