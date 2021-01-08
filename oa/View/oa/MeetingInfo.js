$.namespace('$View.oa');
$View.oa.MeetingInfo = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, mid: null };
    var eForm, eWF, wfInfo, eUsers;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div');
        var comArgs = {
            'root': { head_h: 30, foot_h: 0, cn: 'b0', title: '会议信息', icon: 'icon-glyph-file', toolBarSkin: 'Button-default', toolBarAry: [{ text: '返回', name: 'back', icon: 'icon-glyph-arrow-left', css: 'margin-top:3px;', cn: 'mr10'}], onToolBarClick: onToolBarClick },
            'formInfo': { cn: 'meeting-detail' },
            'wfInfo': { url: 'View/workflow/WorkFlowInfo.js', onNextSuccess: onWFNextSucc, instanceId: null, onLoad: function (self, view) { wfInfo = self; } }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: { name: 'formInfo', type: 'Container' }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        var _body = coms.formInfo;
        eForm = _body.adElm('', 'li'); eWF = _body.adElm('', 'li'); loadMID(args.mid);
    }
    function _event() { }
    function _override() { }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'back':
                new $.UI.View({ p: args.p, url: 'View/oa/Meeting.js' });
                break;
        }
    }

    function loadMID(id) {
        if (!id) { return; }
        $.Util.ajax({
            args: 'm=SYS_CM_OA&action=loadMeetingByID&keyFields=title,wfId,dbo.SYS_TRANS_USER(cPerson) as cPerson, address, dbo.SYS_TRANS_GT(room) as room, dbo.SYS_TRANS_GT(rate) as rate, dbo.SYS_TRANS_GT(state) as state, convert(varchar(20), sTime, 120) as sTime, convert(varchar(20), eTime, 120) as eTime,  convert(varchar(20), cTime, 120) as cTime, dbo.SYS_TRANS_USERS(users) as users, note&dataType=json&id=' + id,
            onSuccess: function (d) {
                var _info = eval(d.get(0) || '[]')[0], _wfId = +_info.wfId, _files = eval(d.get(1) || '[]'); args.mid = id; initInfo(_info, _files);
                if (_wfId) { new $.UI.View({ p: eWF, url: 'View/workflow/WorkFlowInfo.js', onNextSuccess: onWFNextSucc, ifFixedHeight: false, instanceId: _wfId, onLoad: function () { eWF.fc().css('').dc('pa'); } }); }
            }
        });
    }

    function onWFNextSucc(obj) {
        var _node = obj.Node, _users = _node.users;
        if (_users.length > 2) {
            $.Util.ajax({ args: 'm=SYS_CM_OA&action=updateMeetingRights&users=' + _users + '&mid=' + args.mid });
            eUsers.h('参与人：' + _node.t_users);
        }
    }

    function initInfo(obj, files) {
        var _fStr = '<a>没有附件</a>', _fLen = files.length;
        if (_fLen) { _fStr = ''; }
        for (var i = 0; i < _fLen; i++) { var _f = files[i]; _fStr += '<a href="Module/SYS_CM_FILES.aspx?action=downloadFile&id=' + _f.id + '">' + _f.nodeName + '</a>'; }
        var _html1 = '<div class="title"><div class="_title">{0}</div><div class="_info"><span>发布人：{1}</span><span>发布于：{2}</span></div><div class="_info"><span>会议地点：{3}</span><span>会议室：{4}</span><span>会议等级：{5}</span><span>会议状态：{6}</span></div><div class="_info"><span>开始时间：{7}</span><span>结束时间：{8}</span></div><div class="_info"><span>参与人：{9}</span></div></div><div class="content">{10}</div><div class="attach"><span>附件：</span><div class="files">' + _fStr + '</div></div>';
        eUsers = $(eForm.h(_html1.format(obj.title, obj.cPerson, obj.cTime, obj.address, obj.room, obj.rate, obj.state, obj.sTime, obj.eTime, obj.users, obj.note)).fc().lastChild).fc();
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}