$.NameSpace('$View.project');
$View.project.DuiWuApplyWF = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, info: null, onSubmitSuccess: _fn };
    var coms = {}, wfInfo, ifCommitForm = false, popTips;
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
            args: 'm=SYS_CM_PRO&action=onDuiWuApplyComplete&proId=' + args.info.id + '&proCode=' + args.info.proCode,
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
                loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=PRO_SUPPLIER',
                items: [
                    { title: '施工队名称：', name: 'companyName', comType: 'Label', enabled: false, width: 400, group: { width: 700 } },
                    { title: '资质证书编号：', name: 'QCN', comType: 'Label', enable: false, width: 400 },
                    { title: '资质等级：', name: 'QL', comType: 'Label', width: 400 },
                    { title: '法定代表人：', name: 'legalPerson', comType: 'Label', width: 400 },
                    { title: '负责人：', name: 'responsePerson', comType: 'Label', width: 400 },
                    { title: '联系人：', name: 'contact', comType: 'Label', width: 400 },
                    { title: '联系人电话：', name: 'mobilphone', comType: 'Label', width: 400 },
                    //{ title: '附件', name: 'link', comType: 'FileUploader', width: 400, specialFiles: [{ ext: 'jpg', name: '营业执照_' + _fid }, { ext: 'jpg', name: '税务登记_' + _fid }, { ext: 'doc', name: '开户证明_' + _fid }, { ext: 'jpg', name: '法人身份证复印件_' + _fid }, { ext: 'jpg', name: '资质证书_' + _fid }, { ext: 'jpg', name: '安全生产许可证_' + _fid }] },
                    { title: '经营范围：', name: 'business', comType: 'Label', enable: false, width: 400, height: 200 }
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
                        { name: 'execTeam', title: '施工队伍', comType: 'Select', onClick: onExecTeamClick, textKey: 'companyName' }
                    ],
                    foot_h: 0,
                    ifFixedHeight: false
                });
            }
        }
    }

    function onExecTeamClick(obj) {
        var _loadApi = 'm=SYS_TABLE_BASE&action=getByCondition&orderCol=cTime&table=PRO_SUPPLIER&jsonCondition={"type":746,"state":748}';
        popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-list', title: '选择施工队伍', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 840, height: 600 });
        new $.UI.View({
            p: popTips.body,
            url: 'View/project/SupplierQueryList.js',
            type: '746',
            dbclick: function (id, company) {
                obj.self.setValue(id);
                obj.self.setText(company);
                $.Util.ajax({
                    args: 'm=SYS_TABLE_BASE&action=updateByID&table=PRO_MG&id=' + args.info.id + '&json={"execTeam":' + id + '}',
                    onSuccess: function () {
                        MTips.show('保存成功', 'ok');
                        popTips.remove(); popTips = null;
                        ifCommitForm = true;
                    }
                });
            }
        });
        return false;
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