﻿$.namespace('$View.tz');
$View.tz.MeasureFlow = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, currID: null };
    var mainList, popTips, infoView, typeTab, currID, currState, currFireId, currWFType, ifDone = false;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var headAry = [
            { name: 'id', type: 'attr' },
            { name: 'wfId', type: 'attr' },
            { name: 'state', type: 'attr' },
            { name: 'wareId', type: 'attr' },
            { name: 'wfTypeId', type: 'attr' },
            { name: 'wareId', title: '器具ID', width: 50 },
            { name: 'scanCode', title: '条形码', width: 120 },
            { name: 'wfTypeId', title: '类型', ifTrans: true, trans: 'SYS_TRANS_WFIDX', width: 120 },
            { name: 'code', title: '编码', width: 120 },
            { name: 'title', title: '标题', width: 120 },
            { title: '<font color="red">流程状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}'}], width: 200 },
            { name: 'state', title: '<font color="red">处理状态</font>', ifTrans: true, width: 120 },
            { name: 'cTime', type: 'date', title: '提交时间', width: 140 },
            { name: 'cPerson', type: 'none', title: '操作人', ifTrans: true, trans: 'SYS_TRANS_USER', width: 120 },
            { name: 'note', title: '备注', width: 150 }
        ];
        var comArgs = {
            'rootLayout': { min: 300, max: 500, isRoot: 1, start: 375, dir: 'ns', dirLock: 2 },
            'rootDiv': { head_h: 34 },
            'typeTab': { items: [{ name: 'all', text: '所有任务', type: 'tab'}], loadApi: 'm=SYS_CM_WF&action=getWFIndex&jsonCondition={"pid":75}', btnType: 'tab', skin: 'ButtonSet-tab fl', itemSkin: 'Button-tab', onClick: onTypeClick, onSuccess: onLoadTabSuccess },
            'toolBar': { gbsID: 72, ifRights: true, itemAlign: 'right', skin: 'ButtonSet-default mr10', onClick: onToolBarClick },
            'mainList': { aHeader: headAry, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onTDClick: onListClick },
            'infoView': { url: 'View/workflow/WorkFlowInfo.js', onNextSuccess: onWFNextSucc, onLoad: function (view, self) { infoView = view; }, onRights: onWFRights, onConfirmBefore: onConfirmBefore /*, onComplete: function () { changeWFState(194, function () { }); }, onLoadComplete: onWFComplete*/ }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'rootLayout',
            eHead: {
                type: 'BaseDiv',
                name: 'rootDiv',
                head: [
                    { name: 'typeTab', type: 'ButtonSet' },
                    { name: 'toolBar', type: 'ButtonSet' }
                ],
                body: { type: 'List', name: 'mainList' }
            },
            eFoot: { name: 'infoView', type: 'View' }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        typeTab = coms.typeTab; mainList = coms.mainList; typeTab.fireClick(0);
        if (!args.currID) { coms.toolBar.hide(); }
    }
    function _event() { }
    function _override() { }
    function onToolBarClick(obj) {
        switch (+obj.Name) {
            case 73:
                if (!args.currID) { return; }
                var infoAry = [
                    { name: 'scanCode', comType: 'ScanCode', title: '扫描码', group: { width: 300} },
                    { name: 'code', comType: 'Input', title: '流水号', req: true, sErr: '流水号必填' },
                    { name: 'title', comType: 'Input', title: '标题', req: true, sErr: '标题必填' },
                    { name: 'wfTypeId', comType: 'Select', title: '任务类型', req: true, sErr: '类型必填', loadApi: 'm=SYS_CM_WF&action=getWFIndex&jsonCondition={"pid":75}' },
                    { name: 'note', comType: 'TextArea', title: '备注' }
                ], _sCode = getBarCodeString();
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建任务', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 300, ifFixedHeight: false });
                popTips.Form = new $.UI.Form({ p: popTips.body, insertApi: 'm=SYS_CM_TZ&action=NEWFIREWF&tid=TZ_MEASURE_WF', extSubmitVal: { wareId: args.currID, state: 333 }, items: infoAry, ifFixedHeight: false, onSubmitSuccess: function (obj) { popTips.remove(); popTips = null; typeTab.fireClick(obj.Data.IValue.wfTypeId); } });
                popTips.Form.items[0].setData(_sCode, _sCode);
                break;
        }
    }
    function onWFRights(wf, toolBar) {
        if (currState != 333) { return; }
        toolBar.evt('onClick', function (obj) {
            if (currWFType == 87) {
                MConfirm.setWidth(250).show('确定处理该任务?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_CM_TZ&action=updateValid&rId=' + currFireId + '&tId=' + currID + '&RT=TZ_MEASURE&TT=TZ_MEASURE_WF',
                        onSuccess: function () { MTips.show('处理成功', 'warn'); obj.Button.hide(); ifDone = true; mainList.refresh(); }
                    });
                });
            } else {
                MTips.show('处理成功', 'warn'); ifDone = true;
            }
        }).addItem({ text: '处理任务', name: 'doTask', css: 'margin-right:10px;' });
    }
    function onTypeClick(obj) {
        var _name = obj.Name, _jcObj = {}, _jc = '';
        if (!isNaN(+_name)) { _jcObj.wfTypeId = _name; }
        if (args.currID) { _jcObj.wareId = args.currID; }
        _jc = $.JSON.encode(_jcObj);
        if (_jc != '{}') { _jc = '&jsonCondition=' + _jc; } else { _jc = ''; }
        mainList.loadAjax({ args: 'm=SYS_TABLE_BASE&table=TZ_MEASURE_WF&action=pagingForRightsWFList' + _jc, cbFn: { onSuccess: function (obj) { if (obj.Length) { mainList.fireClick(0); } else { delayShowInfo(-1); } } } });
    }
    function onWFNextSucc(obj) {
        $.Util.ajax({
            args: 'm=SYS_CM_TZ&action=updateTaskState&tid=TZ_MEASURE_WF&users=' + obj.Node.owner + '&id=' + currID,
            onSuccess: function () { mainList.refresh(); }
        });
    }
    function onConfirmBefore(obj) { if (!ifDone) { MTips.show('请先处理任务', 'warn'); return false; } }
    function onLoadTabSuccess(obj) { }
    function onListClick(obj) {
        var _tg = obj.Target;
        currID = _tg.getAttr('id'); currState = _tg.getAttr('state'); currFireId = +_tg.getAttr('wareId'); currWFType = +_tg.getAttr('wfTypeId');
        if (currState != 333) { ifDone = true; } else { ifDone = false; }
        delayShowInfo(_tg.getAttr('wfId'));
    }
    function delayShowInfo(proId) {
        if (!infoView) { setTimeout(function () { delayShowInfo(proId); }, 200); return; }
        infoView.setInstanceId(proId);
    }
    function getBarCodeString() {
        var _val = '', _now = new Date(), _h = _now.getHours(), _m = _now.getMinutes(), _s = _now.getSeconds();
        _h = _h < 10 ? ('0' + _h) : _h;
        _m = _m < 10 ? ('0' + _m) : _m;
        _s = _s < 10 ? ('0' + _s) : _s;
        _val = _now.date8() + _h + _m + _s;
        return _val;
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}