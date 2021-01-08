﻿$.NameSpace('$View.officems');
$View.officems.OutStock = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, tid: 'OFFICEMS_OUT' };
    var coms = {}, taskInfo, tkId, taskList, currObj, msList, msInfos = {}, toolBar, popTips;
    var msIDAry = [];
    var _msAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: '操作', name: 'o', type: 'operate', width: 60, items: [{ name: 'delete', text: '删除'}] },
        { title: '商品编号', name: 'msCode', type: 'none', width: 160 },
        { title: '名称', name: 'nodeName', type: 'none', width: 200 },
        { title: '类型', name: 'typeName', type: 'none', width: 200 },
        { title: '<font color="red">实领数量</font>', name: 'number', type: 'none', width: 100, comType: 'KeyInput', ifEdit: true }
    ];
    var _msDetailAry = [
        { title: '物资编号', name: 'mscode', type: 'none', width: 180 },
        { title: '物资名称', name: 'nodeName', type: 'none', width: 200 },
        { title: '规格', name: 'ms.guige', type: 'none', width: 150 },
        { title: '单位', name: 'ms.danwei', type: 'none', width: 80 },
        { title: '<font color="red">实领数量</font>', name: 'isnull(detail.number, 0)', type: 'none', width: 100 }
    ];
    var _taskAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: 'wfId', name: 'wfId', type: 'attr' },
        { title: '申领单号', name: 'code', type: 'none', width: 150, ifFilter: true, filterItems: ['like'] },
        { title: '申领人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'select', textKey: 'uid', ifFilter: true, loadApi: 'm=SYS_CM_USERS&action=getAllUsers', filterItems: ['equal'], width: 100 },
        { title: '开单时间', name: 'cTime', type: 'date', width: 145 },
        { title: '<font color="red">当前任务状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}'}], width: 150 },
        { title: '用途', name: 'note', key: 'note', type: 'none', width: 220, ifEnabledTips: true }
    ];
    var _fiAry = [
        { name: 'code', title: '申领单据号', comType: 'Label' },
        { name: 'note', title: '用途', comType: 'TextArea' }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 35, title: '办公用品 - 申领', icon: 'icon-glyph-gift', cn: 'b0', toolBarSkin: 'mr10 Button-default', gbsID: 162, onToolBarClick: onToolBarClick },
            'layout': { min: 244, max: 500, isRoot: 1, start: 450, dir: 'ns', dirLock: 2 },
            'taskInfo': { url: 'View/workflow/WorkFlowInfo.js', onLoadComplete: onWFLoad, onComplete: onWFComplete, onNextSuccess: onWFNextSucc, onLoad: function (view) { taskInfo = view; } },
            'taskList': { aHeader: _taskAry, loadApi: 'm=SYS_TABLE_BASE&table=' + args.tid + '&action=pagingForRightsWFList', ifBindID: false, ifEnabledFilter: true, onSuccess: function (obj) { if (obj.Length) { obj.List.fireClick(0); } else { toolBar.fireClick(0); } }, onTDClick: onTaskClick, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1}} }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: {
                type: 'Layout',
                name: 'layout',
                eHead: { type: 'List', name: 'taskList' },
                eFoot: { type: 'View', name: 'taskInfo' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        taskList = coms.taskList; toolBar = coms.root.toolBar;
    }

    function onWFNextSucc(obj) {
        $.Util.ajax({
            args: 'm=SYS_TABLE_BASE&table=' + args.tid + '&action=updateRights&users=' + obj.Node.owner + '&id=' + tkId,
            onSuccess: function () { taskList.refresh({ onSuccess: function (obj) { obj.List.fireClick(0); } }, false, false); }
        });
    }

    function onToolBarClick(obj) {
        switch (+obj.Name) {
            case 165:
                if (!taskInfo) { return; }
                taskInfo.setInstanceId(-1); taskInfo.setTitle('<font color="red">新建办公物资申领任务</font>'); msInfos = {};
                var _eExt = taskInfo.addPanel({ title: '申领单' }).css('min-height:385px;position: relative;border:1px dashed #e0e0e0;');
                var _tempL = new $.UI.Layout({ p: _eExt, dir: 'we', start: 300, isRoot: true, ifDrag: false, barWidth: 1 });
                var _form = new $.UI.Form({
                    p: _tempL.eHead, submitApi: 'm=SYS_CM_WH&action=create&type=officeOut&wfIdx=134',
                    items: _fiAry, foot_h: 35,
                    btnItems: [
                        { name: 'FORM-SYS-SUBMIT', text: '新建单据', icon: 'icon-glyph-plus-sign', css: 'margin-left:102px;' },
                        { name: 'selectms', text: '选择商品', icon: 'icon-glyph-shopping-cart', css: 'margin-left:8px;' }
                    ], onClick: onFormClick
                });
                if (_form.items['scanCode']) { var _scanCodeValue = $.Util.code.FullDate(); _form.items['scanCode'].setData(_scanCodeValue, _scanCodeValue); }
                if (_form.items['code']) { var _code = 'SL' + $.Util.code.FullDate(); _form.items['code'].setData(_code, _code); }
                _form.evt('onSubmit', function (obj) {
                    var _sAry = [];
                    for (var key in msInfos) {
                        var _ms = msInfos[key];
                        if (! +_ms.number) {
                            MTips.show('数量不能为空', 'warn'); return false;
                        };
                        _sAry.push($.JSON.encode(_ms));
                    }
                    _form.setHidden('MSInfos', _sAry.join('^'));
                }).evt('onSubmitSuccess', function (data) {
                    taskList.refresh({
                        onSuccess: function () {
                            taskList.fireClick(0);
                        }
                    });
                });
                msList = new $.UI.List({ p: _tempL.eFoot, dataSource: [], aHeader: _msAry, ifEnabledFilter: false, ifBindID: false, colControls: { header: { height: 30} }, onTDUpdate: onMAUpdate, onOperateClick: onOperateClick });
                break;
        }
    }

    function onOperateClick(obj) {
        var _id = obj.RowId;
        if (obj.Name == 'delete') { msInfos[_id] = null; delete msInfos[_id]; obj.eTr.r(); }
    }

    function onMAUpdate(obj, j, editTips) {
        var _key = j.name, _data = j.Data, _id = j.id, _val = _data.UValue[_key];
        msInfos[_id][_key] = +_val;
        obj.set('text', _data.UText[_key]).set('value', _val);
        msList.calculateCols(obj.eTd);
        editTips.hide(); return false;
    }

    function onFormClick(obj) {
        if (obj.Name == 'selectms') {
            if (popTips) { popTips.remove(); popTips = null; }
            popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-plus', title: '选择商品', comMode: 'x-auto', y: 40, ifMask: true, ifClose: true, width: 960, height: 720, ifFixedHeight: false });
            new $.UI.View({
                url: 'View/ms/MSView.js',
                p: popTips.body,
                value: msIDAry,
                onMSSelected: function (ids) {
                    msIDAry = ids;
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_TREE&action=getNodeByIDS&table=SYS_WH_MS_DETAIL&dataType=json&ids=' + ids.join(','),
                        onSuccess: function (data) {
                            var _items = JSON.parse(data.get(0)), ms;
                            msInfos = {};
                            msList.clearContent();
                            for (var i = 0, _len = _items.length; i < _len; i++) {
                                ms = _items[i];
                                var _id = ms.id;
                                msInfos[_id] = { msId: _id, number: 0 };
                                msList.insertRow(ms);
                            }
                           // console.log(_items);
                        }
                    });
                },
                onMSClick: function (ms) {
                    return;
                    console.log(ms);
                    var _id = ms.id;
                    msInfos[_id] = { msId: _id, number: 0 };
                    msList.insertRow(ms);
                }
            });
        }
    }

    function onWFComplete(obj) {
        /*
        MConfirm.setWidth(250).show('流程完成将会修改仓库库存信息！').evt('onOk', function () {
            $.Util.ajax({ args: 'm=SYS_CM_WH&action=onGLReceiveComplete&tkId=' + tkId });
        });*/
    }
   
    function onWFLoad() {
        var _eMS = taskInfo.addPanel({ title: '物资详情' }).css('position: relative;border-left:1px solid #e0e0e0;');
        new $.UI.List({ p: _eMS, ifFixedHeight: false, ifBindID: false, ifEnabledFilter: false, aHeader: _msDetailAry, loadApi: 'm=SYS_CM_WH&action=getOfficeMSDetailForTK&tkId=' + tkId + '&type=' + args.tid, colControls: { header: {} } });
    }
    function onTaskClick(obj) { var _tg = obj.Target; tkId = _tg.getAttr('id'); delayShowInfo(_tg.getAttr('wfId')); }
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