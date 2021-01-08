$.namespace('$View.oa');
$View.oa.Meeting = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, gtRootID: 145 }, eCal;
    var _now = new Date(), _year = _now.getFullYear(), _month = _now.getMonth() + 1, _day = _now.getDate(), _popTips, cal;
    var highCn = 'bc_20', selCn = 'bc_22', currSelCn = 'b_1', normalRCn = 'bc_33 b_23', selDate = getNow();
    var eDate, curr;
    function _default() { _month = _month < 10 ? '0' + _month : _month; _day = _day < 10 ? '0' + _day : _day; }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = { 'root': { head_h: 37, foot_h: 0, cn: 'b0', title: '会议设置(<font color="red">提示：添加会议默认是添加当天会议</font>)', icon: 'icon-glyph-tasks', gbsID: 11, onToolBarClick: onToolBarClick} }
        var struct = { p: owner, type: 'Tips', name: 'root' }
        coms = $.layout({ args: comArgs, struct: struct }); eCal = coms.root.body;
        loadByMonth();
    }
    function _event() { }
    function _override() { }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            case '12':
                var infoAry = [
                    { name: 'title', comType: 'Input', title: '标题', req: true, group: { name: 'g1', width: 320} },
                    { name: 'address', comType: 'Input', title: '地点', req: true, group: 'g1' },
                    { name: 'room', comType: 'Select', title: '会议室', gtID: 150, req: true, group: 'g1' },
                    { name: 'rate', comType: 'Select', title: '会议等级', gtID: 146, req: true, group: { name: 'g2', width: 350} },
                    { name: 'sTime', comType: 'Timer', title: '开始时间', lockDate: selDate, req: true, group: 'g2' },
                    { name: 'eTime', comType: 'Timer', matchItem: 'sTime', title: '结束时间', lockDate: selDate, req: true, group: 'g2' },
                    { name: 'note', comType: 'RichText', title: '备注', group: { name: 'g3', width: 620 }, width: 480 },
                    { name: 'observers', comType: 'UserSelector', title: '密送', group: 'g3' },
                    { name: 'link', comType: 'FileUploader', title: '附件', group: 'g3' }
                ];
                _popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建会议', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 700, ifFixedHeight: false });
                _popTips.Form = new $.UI.Form({ p: _popTips.body, submitApi: 'm=SYS_CM_OA&action=newMeeting', extSubmitVal: { year: _year, month: _month, day: _day }, hidden: { wfIdx: 71 }, items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { _popTips.remove(); _popTips = null; loadByMonth(); } });
                break;
            case '13':
                if (!curr) { MTips.show('请先选择要删除的会议记录', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除<a style="color:red;">' + curr.lastChild.innerHTML + '</a>?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_CM_OA&action=deleteMeetingByID&id=' + curr.attr('mid'),
                        onSuccess: function () { MTips.show('删除成功', 'ok'); loadByMonth(); },
                        onError: function () { MTips.show('删除失败', 'error'); }
                    });
                });
                break;
            case '14':
                _popTips = new $.UI.Tips({ width: 700, height: 500, icon: 'icon-glyph-list-alt', comMode: 'auto', title: '功能模块对照表管理', head_h: 25, ifMask: true, ifDrag: false, ifClose: true });
                new $.UI.View({ p: _popTips.body, url: 'View/common/TreeList.js', table: 'SYS_CM_GLOBAL_TABLE', rootID: args.gtRootID });
                break;
            case '15':
                loadByMonth();
                break;
        }
    }
    function loadByMonth(year, month) {
        var _y = year || _year, _m = month || _month;
        eCal.h('');
        cal = new $.UI.Calendar({ p: eCal, hStyle: ["日", "一", "二", "三", "四", "五", "六"], hType: 'arrow', selCn: selCn, skin: 'Calendar-container', onClick: function (obj) { onCalClick(obj); } });
        $.Util.ajax({
            args: 'm=SYS_CM_OA&action=loadMeetingByYear&keyFields=id,title,dateAll&dataType=json&year=' + _y + '&month=' + _m,
            onSuccess: function (d) {
                var _sAry = eval(d.get(0) || '[]'), _sLen = _sAry.length;
                for (var i = 0; i < _sLen; i++) { addMeetingRecord(_sAry[i]); }
            },
            onError: function () { MTips.show('加载数据失败!', 'error'); }
        });
    }

    function getNow() {
        var _now = new Date(), _y = _now.getFullYear(), _m = _now.getMonth() + 1, _d = _now.getDate(), _hh = _now.getHours(), _mm = _now.getMinutes();
        if (_m < 10) { _m = '0' + _m; }
        if (_d < 10) { _d = '0' + _d; }
        return _y + '-' + _m + '-' + _d;
    }

    function addMeetingRecord(obj) {
        var _eTD = cal.getTDByDate(obj.dateAll);
        if (_eTD) {
            _eTD.chn(1).adElm('', 'LI').attr('mid', obj.id).h('<i class="ico_square bc_20"></i><p class="event_msg">' + obj.title + '</p>');
            _eTD.evt('dblclick', function (e) {
                var e = $.e.fix(e), _e = e.t;
                if (_e.pn().tagName == 'LI') { _e = _e.pn(); }
                if (_e.tagName == 'LI') { new $.UI.View({ p: args.p, url: 'View/oa/MeetingInfo.js', mid: _e.attr('mid') }); }
            }).evt('click', function (e) {
                var e = $.e.fix(e), _e = e.t;
                if (_e.pn().tagName == 'LI') { _e = _e.pn(); }
                if (_e.tagName == 'LI' && _e != curr) { if (curr) { curr.dc('curr'); }; _e.ac('curr'); curr = _e; }
            });
        }
    }

    function onCalClick(obj) { selDate = obj.Value; var _vAry = selDate.split('-'); _year = _vAry[0]; _month = _vAry[1]; _day = _vAry[2]; }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}