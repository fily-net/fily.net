$.NameSpace('$View.home');
$View.home.Index = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB }, container;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var mainTips = new $.UI.Tips({
            p: args.p,
            title: '我的工作台',
            icon: 'fa-tachometer',
            cn: 'b0',
            head_h: 30
        });
        container = mainTips.body.h('<ul class="home"></ul>').fc();
        $.Util.ajax({
            args: 'm=SYS_CM_HOME&action=init&dataType=json',
            onSuccess: function (obj) {
                var _newAry = eval(obj.get(0) || '[]'), _noticeAry = eval(obj.get(2) || '[]');
                var _meetingCount = eval(obj.get(4))[0].count, _emailCount = eval(obj.get(5))[0].count, _taskCount = eval(obj.get(6))[0].count;
                var _messageAry = [
                    { icon: 'fa-calendar', url: 'View/oa/Meeting.js', text: '我的会议', count: _meetingCount },
                    { icon: 'fa-envelope-o', url: 'View/oa/Email.js', text: '我的邮件', count: _emailCount },
                    { icon: 'fa-tasks', url: 'View/docflow/MyFlowTask.js', text: '我的待办任务', count: _taskCount }
                ];
                me.addPanel({ url: 'View/home/Message.js', data: _messageAry });
                me.addPanel({ url: 'View/home/Notices.js', data: _noticeAry, count: eval(obj.get(3))[0].count });
                me.addPanel({ url: 'View/home/News.js', data: _newAry, count: eval(obj.get(1))[0].count });
            }
        });
    }

    me.addPanel = function (value) {
        new $.UI.View({ p: container.adElm('', 'li'), url: value.url, data: value.data, allCount: value.count });
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


