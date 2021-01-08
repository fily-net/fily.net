$.NameSpace('$View.project');
$View.project.BackTask = function (j) {
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
                title: '工程物资退料流程', 
                icon: 'fa fa-ioxhost'
            },
            'wfInfo': { 
                url: 'View/workflow/WorkFlowInfo.js', 
                onNextSuccess: onWFNextSucc, 
                instanceId: args.info.tuiLiaoWfId,
                ifFixedHeight: false, 
                onRights: function (self, toolBar) {
                    wfInfo = self;
                },
                onLoad: function (self) {
                    loadMSDetail(self);
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
        /*

        $.Util.ajax({
            args: 'm=SYS_CM_PRO&action=onDuiWuApplyComplete&proId=' + args.info.id,
            onSuccess: function () {
                args.onSubmitSuccess();
            }
        });*/


        /*
        MConfirm.setWidth(350).show('施工队伍会签流程完成将会发起施工合同会签！').evt('onOk', function () {
            $.Util.ajax({
                args: 'm=SYS_CM_PRO&action=onDuiWuApplyComplete&proId=' + args.info.id,
                onSuccess: function () {
                    args.onSubmitSuccess();
                }
            });
        });*/
    }

    function onNextClick(obj) {
        
    }

    function onWFNextSucc(obj) {
        /*
        var _node = obj.Node, _users = _node.users;
        if (_users.length > 2) {
            $.Util.ajax({ args: 'm=SYS_CM_OA&action=updateMeetingRights&users=' + _users + '&mid=' + args.mid });
        }*/
    }

    function loadMSDetail(wfInfo) {
        var _backMSHAry = [
            { title: '领料单ID', name: 'detail.oid', type: 'none', width: 80 },
            { title: '编号', name: 'code', type: 'none', width: 80 },
            { title: '类别', name: 'ms.id', ifTrans: true, trans: 'SYS_TRANS_MS_CATEGORY', type: 'none', width: 160, ifEnabledTips: true },
            { title: '名称', name: 'nodeName', type: 'none', width: 120 },
            { title: '规格', name: 'ms.guige', type: 'none', width: 60 },
            { title: '状态', name: 'detail.state', type: 'none', ifTrans: true, width: 60 },
            //{ title: '最高价', name: 'ms.highPrice', type: 'none', width: 80 },
            //{ title: '平均价', name: 'ms.avgPrice', type: 'none', width: 80 },
            //{ title: '<font color="red">进价(￥)</font>', name: 'isnull(detail.price, 0)', type: 'none', width: 80 },
            { title: '<font color="#21b384">实用</font>', name: 'isnull(detail.used, 0)', type: 'none', width: 60 },
            { title: '<font color="#E49E0D">未用</font>', name: 'isnull(detail.notUsed, 0)', type: 'none', width: 60 },
            { title: '<font color="red">总数</font>', name: 'isnull(detail.number, 0)', type: 'none', width: 60 },
            { title: '单位', name: 'ms.danwei', type: 'none', ifTrans: true, width: 50 }
            //{ title: '<font color="red">总价(￥)</font>', name: 'isnull(detail.sum, 0)', type: 'none', width: 100 }
        ];
        var _eMS = wfInfo.addPanel({ title: "工程退料物资详情" }).css('position: relative;border-left:1px solid #e0e0e0;border-top:1px solid #e0e0e0;');
        new $.UI.List({ p: _eMS, ifBindID: false, ifFixedHeight: false, aHeader: _backMSHAry, loadApi: 'm=SYS_CM_WH&action=getBackMSDetailForProject&type=PRO_MS_RECEIVE&proId=' + args.proId, colControls: { header: {} } });
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