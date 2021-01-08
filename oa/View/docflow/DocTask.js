﻿$.namespace('$View.docflow');
$View.docflow.DocTask = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var taskInfo, currID, taskList, fileList;
    var _taskAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { name: 'wfId', type: 'attr' },
        { title: '应用名称', name: 'nodeName', width: 150 },
        { title: '上流程转发人', name: 'mPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 100 },
        { title: '上流程转发时间', name: 'mTime', type: 'date', width: 130 },
        { title: '流程发起者', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 100 },
        { title: '发起时间', name: 'cTime', type: 'date', width: 130 },
        { title: '<font color="red">当前状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}' }], width: 150 },
        { title: '备注', name: 'note', key: 'note', type: 'none', width: 200 }
    ];
    var _infoAry = [
        { title: '应用名称', name: 'nodeName', comType: 'Input', req: true },
        { title: '公文附件', name: 'link', comType: 'FileUploader', req: true },
        { title: '备注', name: 'note', comType: 'TextArea' }
    ];
    var _fileAry = [
        { title: '文件名', name: 'nodeName', type: 'none', width: 120, ifEnabledTips: true },
        { title: '格式', name: 'extName', type: 'none', width: 40 },
        { title: '大小', name: 'size', type: 'none', ifTrans: true, trans: 'SYS_TRANS_FILE_SIZE', width: 60 },
        { title: '<font color="red">操作</font>', type: 'operate', items: [{ icon: 'icon-glyph-download', name: 'download', href: 'Module/SYS_CM_FILES.aspx?action=downloadFile%26id={0}{1}cast(id as varchar(10)){1}{0}' }], width: 60 }
    ];
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 33, title: '我的公文任务', icon: 'icon-glyph-tasks', cn: 'b0', toolBarSkin: 'mr5 Button-default', gbsID: 75, onToolBarClick: onToolBarClick },
            'layout': { min: 244, max: 500, isRoot: 1, start: 389, dir: 'ns', dirLock: 2 },
            'taskInfo': { url: 'View/workflow/WorkFlowInfo.js', onNextSuccess: onWFNextSucc, ifAttach: false, onLoad: function (view) { taskInfo = view; } },
            'infoLayout': { ifDrag: false, start: 280, dir: 'we', dirLock: 2 },
            'fileList': { aHeader: _fileAry, colControls: { header: {} } },
            'taskList': { aHeader: _taskAry, loadApi: 'm=SYS_TABLE_BASE&action=pagingForRightsWFList&table=DOC_WF', ifBindID: false, ifEnabledFilter: false, onSuccess: function (obj) { obj.List.fireClick(0); }, onTDClick: onTaskClick, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } } }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: {
                type: 'Layout',
                name: 'layout',
                eHead: { type: 'List', name: 'taskList' },
                eFoot: {
                    type: 'Layout', name: 'infoLayout',
                    eHead: { type: 'View', name: 'taskInfo' },
                    eFoot: { type: 'List', name: 'fileList' }
                }
            }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        taskList = coms.taskList; fileList = coms.fileList;
    }
    function _event() { }
    function _override() { }
    function onToolBarClick(obj) {
        switch (+obj.Name) {
            case 76:
                taskInfo.setInstanceId(-1); taskInfo.setTitle('<font color="red">新建公文流程</font>'); msInfos = {};
                var _eExt = taskInfo.addPanel({ title: '公文表单' }).css('position: relative;border:1px dashed #e0e0e0;');
                var _form = new $.UI.Form({ p: _eExt, ifFixedHeight: false, items: _infoAry, foot_h: 35, hidden: { wfIndexId: 101 }, insertApi: 'm=SYS_TABLE_BASE&action=addWorkFlowRow&table=DOC_WF', extSubmitVal: { type: args.type } });
                _form.evt('onSubmitSuccess', function (data) { taskList.refresh({ onSuccess: function (obj) { obj.List.fireClick(0); } }, true, true); });
                fileList.loadAjax({ args: 'm=SYS_TABLE_BASE&table=DOC_WF&action=getFilesById&id=0' });
                break;
            case 77:

                break;
        }
    }
    function onWFNextSucc(obj) {
        $.Util.ajax({
            args: 'm=SYS_TABLE_BASE&table=DOC_WF&action=updateWFRights&users=' + obj.Node.owner + '&id=' + currID,
            onSuccess: function () { taskList.refresh(); }
        });
    }
    function onTaskClick(obj) {
        var _tg = obj.Target; currID = _tg.getAttr('id'); delayShowInfo(_tg.getAttr('wfId'));
        fileList.loadAjax({ args: 'm=SYS_TABLE_BASE&table=DOC_WF&action=getFilesById&id=' + currID });
    }
    function delayShowInfo(wfId) {
        if (!taskInfo) { setTimeout(function () { delayShowInfo(wfId); }, 200); return; }
        taskInfo.setInstanceId(wfId);
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}