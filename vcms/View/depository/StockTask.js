$.NameSpace('$View.depository');
$View.depository.StockTask = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, rootID: 4 };
    var coms = {}, eTaskList, toolBar, currWHID;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { name: 'id', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'depth', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'type', type: 'attr' },
            { name: 'ifReceipt', type: 'attr' },
            { name: 'nodeName', type: 'none' }
        ];
        var comArgs = {
            'rootTips': { head_h: 33, foot_h: 0, cn: 'b0', title: '仓库任务详情', icon: 'icon-glyph-align-left', toolBarSkin: 'Button-default', onToolBarClick: onSelectType },
            'rootLayout': { min: 180, max: 300, isRoot: 1, start: 220, dir: 'we', dirLock: 1 },
            'whTreeList': { aHeader: _mHeaderAry, style: 'tree:nodeName', ifShowIcon: 'type', rootID: args.rootID, table: 'SYS_WH_INDEX', onTDClick: onWHListClick, onTDClickBefore: onWHClickBefore, onSuccess: function (obj) { obj.List.fireClick(0); } }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootTips',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'List', name: 'whTreeList' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        toolBar = coms.rootTips.toolBar; eTaskList = coms.rootLayout.eFoot;
    }

    function onSelectType(obj) {
        var _msAry, _taskAry, _type = obj.Name;
        switch (_type) {
            case 'TK_WH_ALLOCATE':
                _msAry = [
                    { title: '扫描码', name: 'ms.scanCode', type: 'none', width: 120 },
                    { title: '物资编号', name: 'ms.code', type: 'none', width: 100 },
                    { title: '物资名称', name: 'ms.nodeName', type: 'none', width: 120 },
                    { title: '规格', name: 'ms.guige', type: 'none', width: 50 },
                    { title: '单位', name: 'ms.danwei', type: 'none', ifTrans: true, width: 50 },
                    { title: '<font color="red">调拨数量</font>', name: 'isnull(detail.number, 0)', type: 'none', width: 100 }
                ];
                _taskAry = [
                    { title: 'ID', name: 'id', type: 'attr' },
                    { title: 'wfId', name: 'wfId', type: 'attr' },
                    { title: '扫描码', name: 'scanCode', width: 120 },
                    { title: '单据号', name: 'code', type: 'none', width: 100 },
                    { title: '源仓库', name: 'whId', ifTrans: true, trans: 'SYS_TRANS_WH', type: 'none', width: 100 },
                    { title: '目标仓库', name: 'destinationWH', ifTrans: true, trans: 'SYS_TRANS_WH', type: 'none', width: 100 },
                    { title: '流程发起者', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 100 },
                    { title: '发起时间', name: 'cTime', type: 'date', width: 100 },
                    { title: '<font color="red">当前调拨状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}'}], width: 150 },
                    { title: '备注', name: 'note', key: 'note', type: 'none', width: 200 }
                ];
                break;
            case 'TK_WH_BACK':

                break;
            case 'TK_WH_RECEIVE':
                _msAry = [
                    { title: '扫描码', name: 'ms.scanCode', type: 'none', width: 120 },
                    { title: '物资编号', name: 'ms.code', type: 'none', width: 100 },
                    { title: '物资名称', name: 'ms.nodeName', type: 'none', width: 120 },
                    { title: '规格', name: 'ms.guige', type: 'none', width: 50 },
                    { title: '单位', name: 'ms.danwei', type: 'none', ifTrans: true, width: 50 },
                    { title: '计划价', name: 'ms.planPrice', type: 'none', width: 80 },
                    { title: '最高价', name: 'ms.highPrice', type: 'none', width: 80 },
                    { title: '平均价', name: 'ms.avgPrice', type: 'none', width: 80 },
                    { title: '<font color="red">进价</font>', name: 'isnull(detail.price, 0)', type: 'none', width: 80 },
                    { title: '<font color="red">收料数量</font>', name: 'isnull(detail.number, 0)', type: 'none', width: 100 }
                ];
                _taskAry = [
                    { title: 'ID', name: 'id', type: 'attr' },
                    { title: 'wfId', name: 'wfId', type: 'attr' },
                    { title: '扫描码', name: 'scanCode', width: 120 },
                    { title: '单据号', name: 'code', type: 'none', width: 100 },
                    { title: '发票号', name: 'faPiaoHao', type: 'none', width: 100 },
                    { title: '结算方法', name: 'jieSuanMethod', ifTrans: true, type: 'none', width: 100 },
                    { title: '供应商', name: 'gongYingShang', type: 'none', width: 100 },
                    { title: '流程发起者', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 100 },
                    { title: '发起时间', name: 'cTime', type: 'date', width: 100 },
                    { title: '<font color="red">当前调拨状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}'}], width: 150 },
                    { title: '备注', name: 'note', key: 'note', type: 'none', width: 200 }
                ];
                break;
        }
        new $.UI.View({ p: eTaskList, url: 'View/depository/TaskList.js', msAry: _msAry, taskAry: _taskAry, whId: currWHID, type: _type, onComplete: onTicketComplete });
    }

    function onTicketComplete(WFInfo, tkId, type) {
        var _action;
        switch (type.trim()) {
            case 'TK_WH_ALLOCATE':
                _action = 'onAllocateComplete';
                break;
            case 'TK_WH_BACK':
                _action = 'onBackComplete';
                break;
            case 'TK_WH_RECEIVE':
                _action = 'onReceiveComplete';
                break;
        }
        $.Util.ajax({
            args: 'm=SYS_CM_WH&action=' + _action + '&tkId=' + tkId,
            onSuccess: function () { }
        });
    }

    function onWHListClick(obj) {
        var _tg = obj.Target; currWHID = _tg.getAttr('rowId');
        var _bAry = [
        //{ name: 'TK_WH_BACK', type: 'tab', text: '退料任务', css: 'margin-right:10px;', icon: 'icon-glyph-share-alt' },
            {name: 'TK_WH_RECEIVE', type: 'tab', text: '收料任务', css: 'margin-right:10px;', icon: 'icon-glyph-gift' }
        ];
        /*var _bAry = [
        { name: 'TK_WH_ALLOCATE', type: 'tab', text: '调拨任务', css: 'margin-right:10px;', icon: 'icon-glyph-retweet' },
        { name: 'TK_WH_BACK', type: 'tab', text: '退料任务', css: 'margin-right:10px;', icon: 'icon-glyph-share-alt' },
        ];
        if (+_tg.getAttr('ifReceipt')) { _bAry.push({ name: 'TK_WH_RECEIVE', type: 'tab', text: '收料任务', css: 'margin-right:10px;', icon: 'icon-glyph-gift' }); }*/
        toolBar.reLoadItems(_bAry).fireClick(0);
    }
    function onWHClickBefore(obj) { if (obj.eTr && +obj.eTr.attr('type') != 2) { return false; }; }
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