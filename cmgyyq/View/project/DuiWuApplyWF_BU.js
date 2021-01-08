$.NameSpace('$View.project');
$View.project.DuiWuApplyWF = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, info: null, onSubmitSuccess: _fn };
    var coms = {}, wfInfo, ifCommitForm = false;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div');
        var comArgs = {
            'root': { 
                head_h: 0, 
                foot_h: 0, 
                cn: 'b0', 
                title: '施工队会签', 
                icon: 'fa fa-ioxhost'
            },
            'wfInfo': { 
                url: 'View/workflow/WorkFlowInfo.js', 
                onNextSuccess: onWFNextSucc, 
                instanceId: args.info.duiWuApplyWfId, 
                ifFixedHeight: false, 
                onRights: function (self, toolBar) {
                    wfInfo = self;
                    initForm(self);
                },
                onLoad: function (self) {
                    loadExecTeamInfo(self);
                },
                onNextClick: onNextClick,
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
            args: 'm=SYS_CM_PRO&action=onDuiWuApplyComplete&proId=' + args.info.id,
            onSuccess: function () {
                args.onSubmitSuccess();
            }
        });
    }

    function onNextClick(obj) {
        if (obj.name == 'cancle' || obj.name == 'deny' || obj.name == 'confirm') {
            if (!ifCommitForm) {
                MTips.show('在确认之前请先选择施工队伍，谢谢！', 'warn'); return false;
            }
        }
    }

    function onWFNextSucc(obj) {
        /*
        var _node = obj.Node, _users = _node.users;
        if (_users.length > 2) {
            $.Util.ajax({ args: 'm=SYS_CM_OA&action=updateMeetingRights&users=' + _users + '&mid=' + args.mid });
        }*/
    }

    function loadExecTeamInfo(wfInfo) {
        console.log(args.info.execTeam);
        if (+args.info.execTeam) {
            ifCommitForm = true;
            var _fid = args.info.execTeam;
            new $.UI.Form({
                p: wfInfo.addPanel({ title: '施工队伍信息' }),
                loadApi: 'm=SYS_CM_USERS&action=getDept',
                items: [
                    { name: 'nodeName', title: '项目组名称', comType: 'Label', group: {name:'g1',width: 300} },
                    { name: 'uids', title: '成员', trans: 'SYS_TRANS_USERS', comType: 'UserSelector' },
                    { name: 'link', title: '负责人', trans: 'SYS_TRANS_USERS', comType: 'MultiSelect' },
                    { name: 'cPerson', title: '创建者', trans: 'SYS_TRANS_USER', comType: 'Label' },
                    { name: 'cTime', title: '创建时间', comType: 'Label' },
                    { name: 'address', title: '地址', comType: 'Label' },
                    { name: 'phone', title: '电话', comType: 'Label' },
                    { name: 'note', title: '备注', comType: 'Label' }
                ],
                ifFixedHeight: false,
                foot_h: 0
            }).loadDataByID(+args.info.execTeam);
        }
    }

    function initForm(wfInfo) {
        //wfInfo.ifHasRight = true;
        if (wfInfo.ifHasRight) {
            if (!+args.info.execTeam) {
                new $.UI.Form({
                    p: wfInfo.addPanel({ title: '选择施工队伍' }),
                    items: [
                        { name: 'execTeam', title: '施工队伍', comType: 'Select', textKey: 'nodeName', loadApi: 'm=SYS_CM_USERS&action=getProjectDepts' }
                    ],
                    btnItems: [
                        { name: 'FORM-SYS-SUBMIT', css: 'margin-left:100px;', text: '确认选择施工队', skin: 'Button-blue', icon: 'fa fa-check' }
                    ],
                    updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=PRO_MG&id=' + args.info.id,
                    state: 'Update',
                    onSubmitSuccess: function (){
                        ifCommitForm = true;
                    },
                    ifFixedHeight: false
                });
            }
        }
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