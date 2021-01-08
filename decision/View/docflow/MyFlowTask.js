$.NameSpace('$View.docflow');
$View.docflow.MyFlowTask = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms = {}, taskInfo, currID, taskList, fileList;
    var _taskAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { name: 'url', type: 'attr' },
        { title: '任务', name: 'nodeName', width: 600 },
        /*
        { title: '上流程转发人', name: 'mPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 100 },
        { title: '上流程转发时间', name: 'mTime', type: 'date', width: 130 },
        { title: '流程发起者', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 100 },*/
        { title: '发起时间', name: 'cTime', type: 'date', width: 130 },
        { title: '上一次操作时间', name: 'cTime', type: 'date', width: 150 },
        { title: '<font color="red">当前状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(id){1}{0}', name: '{0}{1}cast(id as varchar(15)){1}{0}'}], width: 150 },
        { title: '备注', name: 'note', key: 'note', type: 'none', width: 200 }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 33, title: '我的公文任务', icon: 'fa fa-file-word-o', cn: 'b0' },
            'layout': { min: 244, max: 500, isRoot: 1, start: 389, dir: 'ns', dirLock: 2 },
            'taskInfo': {
                url: 'View/workflow/WorkFlowInfo.js',
                onNextSuccess: onWFNextSucc,
                ifAttach: false,
                onLoad: function (view) { taskInfo = view; }
            },
            'infoLayout': { ifDrag: false, start: 300, dir: 'we', dirLock: 2 },
            'taskList': {
                aHeader: _taskAry,
                loadApi: 'm=SYS_CM_WF&action=pagingForRightsWFList',
                ifBindID: false,
                ifEnabledFilter: false,
                onSuccess: function (obj) { obj.List.fireClick(0); },
                //onTDClick: onTaskClick,
                onTDDoubleClick: onTaskDoubleClick,
                colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } }
            }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: {
                type: 'List', name: 'taskList'
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        taskList = coms.taskList; fileList = coms.fileList;
    }

    function onWFNextSucc(obj) {
        $.Util.ajax({
            args: 'm=SYS_TABLE_BASE&table=DOC_WF&action=updateWFRights&users=' + obj.Node.owner + '&id=' + currID,
            onSuccess: function () { taskList.refresh(); }
        });
    }

    function onTaskDoubleClick(obj) {
        var _urlString = obj.getAttr('url'), _urlAry = _urlString.split('?');
        var _url = _urlAry[0], _id = _urlAry[1];
        switch (_url) {
            case 'View/project/PMInfo.js':
                /*
                $.Util.ajax({
                    args: 'm=SYS_TABLE_BASE&action=getByID&table=PRO_MG&dataType=json&id=' + _id,
                    onSuccess: function (data) {
                        var _info = eval(data.get(0)||'[]')[0];
                        new $.UI.View({ info: _info, p: args.p, url: _url, proId: _id });
                    }
                });*/
                new $.UI.View({ p: args.p, url: _url, proId: _id });
                break;
            case 'View/project/InTask.js':
                var _dAry = _id.split('&'), _taskId = _dAry[1].split('=')[1];
                _id = _dAry[0]
                var _fields = 'id,duiWuApplyWfId,heTongWfId,kaiGongWfId,jieSuanWfId,tuiLiaoWfId,msPlanCost,msRealCost,proCode,state,proType,dbo.SYS_TRANS_GT(proType) as proType_trans,proNature as proNature,dbo.SYS_TRANS_GT(proNature) as proNature_trans,proArea as proArea,dbo.SYS_TRANS_GT(proArea) as proArea_trans,address as address,customer as customer,contact as contact,proSource as proSource,dbo.SYS_TRANS_GT(proSource) as proSource_trans,acreage as acreage,outPutValue as outPutValue,dbo.SYS_FORMAT_TIME(collectTime) as collectTime,dbo.SYS_FORMAT_TIME(issuedTime) as issuedTime,feedBack as feedBack,dbo.SYS_TRANS_GT(feedBack) as feedBack_trans,execDept as execDept,dbo.SYS_TRANS_GT(execDept) as execDept_trans,execTeam as execTeam,dbo.SYS_TRANS_CPN(execTeam) as execTeam_trans,dbo.SYS_FORMAT_TIME(deadline) as deadline,execTeamLeader as execTeamLeader,dbo.SYS_FORMAT_TIME(bTime) as bTime,dbo.SYS_FORMAT_TIME(shuiTestTime) as shuiTestTime,dbo.SYS_FORMAT_TIME(xiaoDuTime) as xiaoDuTime,dbo.SYS_FORMAT_TIME(eTime) as eTime,qingZhao as qingZhao,dbo.SYS_TRANS_GT(qingZhao) as qingZhao_trans,dbo.SYS_FORMAT_TIME(handleTime) as handleTime,dbo.SYS_FORMAT_TIME(allowTime) as allowTime,payCost as payCost,note as note,dbo.SYS_TRANS_RIGHTS(' + $.ck.get('SESSIONID') + ', users,roles,0) as ifRights,state,proCode,biJiaWfId,planCost,realCost,cPerson';
                var _args = 'm=SYS_TABLE_BASE&action=getByID&table=PRO_MG&dataType=json&id=' + _id + '&keyFields=' + _fields;
                $.Util.ajax({
                    args: _args,
                    onSuccess: function (data) {
                        var _info = eval(data.get(0) || '[]')[0];
                        new $.UI.View({ info: _info, p: args.p, url: _url, proId: _id, taskId: _taskId });
                    }
                });
                break;
        }
    }

    function onTaskClick(obj) {
        var _tg = obj.Target; currID = _tg.getAttr('id'); delayShowInfo(_tg.getAttr('id'));
    }

    function delayShowInfo(wfId) {
        if (!taskInfo) { setTimeout(function () { delayShowInfo(wfId); }, 200); return; }
        taskInfo.setInstanceId(wfId);
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