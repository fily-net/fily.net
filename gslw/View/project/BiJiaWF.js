$.NameSpace('$View.project');
$View.project.BiJiaWF = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, info: null };
    var coms = {}, wfInfo;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div');
        var comArgs = {
            'root': { 
                head_h: 0, 
                foot_h: 0, 
                cn: 'b0', 
                title: '物资比价会签', 
                icon: 'fa fa-ioxhost'
            },
            'wfInfo': { 
                url: 'View/workflow/WorkFlowInfo.js', 
                onNextSuccess: onWFNextSucc, 
                instanceId: args.info.biJiaWfId,
                ifFixedHeight: false, 
                onLoad: function (self, view) { 
                    wfInfo = self;
                    initForm(self);
                } 
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
        MConfirm.setWidth(250).show('比价会签流程完成将进入开工阶段！').evt('onOk', function () {
            $.Util.ajax({
                args: 'm=SYS_CM_PRO&action=onBiJiaComplete&proId=' + args.info.id,
                onSuccess: function () {

                }
            });
        });
    }

    function onWFNextSucc(obj) {
        /*
        var _node = obj.Node, _users = _node.users;
        if (_users.length > 2) {
            $.Util.ajax({ args: 'm=SYS_CM_OA&action=updateMeetingRights&users=' + _users + '&mid=' + args.mid });
        }*/
    }

    function initForm(wfInfo) {
        wfInfo.ifHasRight = true;
        if (wfInfo.ifHasRight) {
            new $.UI.Button({
                p: wfInfo.addPanel({ title: '当前操作' }),
                text: '上传供应商比价文档',
                skin: 'Button-blue',
                icon: 'fa-upload',
                click: onClick
            });
        }
    }

    function onClick(){
        
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