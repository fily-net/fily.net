$.NameSpace('$View.project');
$View.project.SupplierApplyWF = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, sid: null, wfId: null, onSubmitSuccess: _fn };
    var coms = {}, wfInfo;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div');
        var comArgs = {
            'root': { 
                head_h: 0, 
                foot_h: 0, 
                cn: 'b0'
            },
            'wfInfo': { 
                url: 'View/workflow/WorkFlowInfo.js',
                instanceId: args.wfId,
                ifFixedHeight: false,
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
            args: 'm=SYS_CM_PRO&action=onSupplierApplyComplete&sid=' + args.sid,
            onSuccess: function () {
                args.onSubmitSuccess();
            }
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