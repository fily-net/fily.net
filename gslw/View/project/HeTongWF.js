$.NameSpace('$View.project');
$View.project.HeTongWF = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, info: null, onSubmitSuccess: _fn };
    var coms = {}, wfInfo;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div');
        var comArgs = {
            'root': { 
                head_h: 0, 
                foot_h: 0, 
                cn: 'b0', 
                title: '施工合同会签', 
                icon: 'fa fa-ioxhost'
            },
            'wfInfo': { 
                url: 'View/workflow/WorkFlowInfo.js', 
                onNextSuccess: onWFNextSucc, 
                instanceId: args.info.heTongWfId,
                ifFixedHeight: false,
                ifAttach: true,
                onLoadComplete: function (self) {
                    initForm(self);
                },
                onComplete: onWFComplete
            }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: { name: 'wfInfo', type: 'View' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
    }

    function onWFComplete(obj) {
        $.Util.ajax({
            args: 'm=SYS_CM_PRO&action=onHeTongComplete&proId=' + args.info.id + '&proCode=' + args.info.proCode,
            onSuccess: function () {
                args.onSubmitSuccess();
            }
        });
        /*
        MConfirm.setWidth(350).show('施工合同会签流程完成将会发起开工报告会签！').evt('onOk', function () {
            $.Util.ajax({
                args: 'm=SYS_CM_PRO&action=onHeTongComplete&proId=' + args.info.id,
                onSuccess: function () {
                    args.onSubmitSuccess();
                }
            });
        });*/
    }

    function onWFNextSucc(obj) {
        /*
        var _node = obj.Node, _users = _node.users;
        if (_users.length > 2) {
            $.Util.ajax({ args: 'm=SYS_CM_OA&action=updateMeetingRights&users=' + _users + '&mid=' + args.mid });
        }*/
    }

    function initForm(obj) {
        var wfInfo = obj.WorkFlowInfo;
        if (wfInfo.attach) {
            if (+obj.currNode.type == 10 && wfInfo.ifHasRight) {
                wfInfo.attach.setEnabled(true);
            } else {
                wfInfo.attach.setEnabled(false);
            }
        }
    }

    function onClick() {
        args.pmInfo.fireTabClick('files');
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