$.NameSpace('$View.project');
$View.project.KaiGongBengFangWF = function (j) {
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
                title: '泵房开工报告会签', 
                icon: 'fa fa-ioxhost'
            },
            'wfInfo': { 
                url: 'View/workflow/WorkFlowInfo.js', 
                onNextSuccess: onWFNextSucc, 
                instanceId: args.info.kaiGongWfId,
                ifFixedHeight: false,
                ifAttach: true,
                onLoadComplete: function (self) {
                    initForm(self);
                },
                onRoleChange: onRoleChange,
                onUserChange: onUserChange,
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

    function onRoleChange(obj) {
        var _roles = obj.Value.split(',');
        if (_roles.length > 1) {
            //console.log(_roles[1]);
            $.Util.ajax({
                args: 'm=SYS_TABLE_BASE&action=updateByID&table=PRO_MG&id=' + args.info.id+'&json={"execDept": '+_roles[1]+'}',
                onSuccess: function () {
                    MTips.show('保存成功', 'ok');
                }
            });
        }
    }

    function onUserChange(obj) {
        var _roles = obj.Value.split(',');
        if (_roles.length > 1) {
            //console.log(_roles[1]);
            $.Util.ajax({
                args: 'm=SYS_TABLE_BASE&action=updateByID&table=PRO_MG&id=' + args.info.id + '&json={"execPerson": ' + _roles[1] + '}',
                onSuccess: function () {
                    MTips.show('保存成功', 'ok');
                }
            });
        }
    }

    function onWFComplete(obj) {

        $.Util.ajax({
            args: 'm=SYS_CM_PRO&action=onKaiGongComplete&proId=' + args.info.id + '&proCode=' + args.info.proCode,
            onSuccess: function () {
                args.onSubmitSuccess();
            }
        });

        /*
        MConfirm.setWidth(350).show('开工报告会签流程完成将会进入开工状态！').evt('onOk', function () {
            
        });*/
    }

    function onWFNextSucc(obj) {
        
        /*var _node = obj.Node, _users = _node.users;
        console.log(_node);
        if (_users.length > 2) {
            $.Util.ajax({ args: 'm=SYS_CM_OA&action=updateMeetingRights&users=' + _users + '&mid=' + args.mid });
        }*/
    }

    function initForm(obj) {
        var wfInfo = obj.WorkFlowInfo;
        if (wfInfo.attach) {
            /*
            console.log(obj.currNode.type);
            console.log(wfInfo.ifHasRight);
            console.log(args.info.ifSelf);
            console.log(obj.currNode.type);*/
            wfInfo.attach.setEnabled(false);
            //console.log(obj.currNode);
            if (+obj.currNode.type == 12 && +obj.currNode.treeOrder == 2 && wfInfo.ifHasRight) {
                wfInfo.attach.setEnabled(true);
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