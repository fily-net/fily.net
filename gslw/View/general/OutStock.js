$.NameSpace('$View.general');
$View.general.OutStock = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, tid: 'GENERAL_SEND' };
    var coms = {}, taskInfo, tkId, taskList, currObj, msList, msInfos = {}, toolBar;
    var _msAry = [
        { name: 'id', type: 'attr' },
        { name: 'stockNumber', type: 'attr' },
        { title: '操作', name: 'o', type: 'operate', width: 120, items: [{ name: 'delete', text: '删除'}] },
        { title: '扫描码', name: 'scanCode', type: 'none', width: 120 },
        { title: '物资名称', name: 'nodeName', type: 'none', width: 100 },
        { title: '规格', name: 'guige', type: 'none', width: 80 },
        { title: '单位', name: 'danwei', type: 'none', width: 50 },
        { title: '最高价(￥)', name: 'highPrice', type: 'none', width: 100 },
        { title: '计划价(￥)', name: 'planPrice', type: 'none', width: 100, comType: 'KeyInput' },
        { title: '<font color="red">申领数量</font>', name: 'planNum', type: 'none', width: 100, comType: 'KeyInput', ifEdit: true },
        { title: '<font color="red">实领数量</font>', name: 'number', type: 'none', width: 100, comType: 'KeyInput', ifEdit: true },
        { title: '<font class="fw c_1 bc_3 p5">当前库存量</font>', name: 'stockNumber', type: 'none', width: 100 },
        { title: '申领总值(￥)', name: 'planSum', union: '$planPrice*$planNum', type: 'none', width: 100 },
        { title: '实领总值(￥)', name: 'totalSum', union: '$planPrice*$number', type: 'none', width: 100 }
    ];
    var _msDetailAry = [
        { name: 'detail.id', type: 'attr', key: 'id' },
        { name: 'detail.sons', type: 'attr', key: 'sons' },
        { name: 'detail.depth', type: 'attr', key: 'depth' },
        { name: 'detail.pid', type: 'attr', key: 'pid' },
        { title: '扫描码', name: 'ms.scanCode', type: 'none', width: 150 },
        { title: '物资编号', name: 'ms.code', type: 'none', width: 100 },
        { title: '物资名称', name: 'ms.nodeName', type: 'none', width: 120 },
        { title: '规格', name: 'ms.guige', type: 'none', width: 50 },
        { title: '单位', name: 'ms.danwei', type: 'none', ifTrans: true, width: 50 },
        { title: '计划价', name: 'ms.planPrice', type: 'none', width: 80 },
        { title: '最高价', name: 'ms.highPrice', type: 'none', width: 80 },
        { title: '平均价', name: 'ms.avgPrice', type: 'none', width: 80 },
        { title: '批次号', name: 'detail.batchCode', type: 'none', width: 130 },
        { title: '<font color="red">批次价</font>', name: 'isnull(detail.batchPrice, 0)', type: 'none', width: 80 },
        { title: '<font color="red">批次总量</font>', name: 'isnull(detail.batchTotal, 0)', type: 'none', width: 80 },
        { title: '<font color="red">批次余量</font>', name: 'isnull(detail.batchRemain, 0)', type: 'none', width: 80 },
        { title: '<font color="red">实际申领数</font>', name: 'isnull(detail.number, 0)', type: 'none', width: 120 },
        { title: '<font color="red">计划申领数</font>', name: 'isnull(detail.planNum, 0)', type: 'none', width: 120 }
    ];
    var _taskAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: 'wfId', name: 'wfId', type: 'attr' },
        { title: '领料单', name: 'code', type: 'none', width: 150, ifFilter: true, filterItems: ['like'] },
        { title: '部门', name: 'dept', ifTrans: true, trans: 'SYS_TRANS_ROLE', type: 'select', width: 80, ifFilter: true, filterItems: ['equal'], loadApi: 'm=SYS_CM_USERS&action=getAllDepts' },
        { title: '申请人', name: 'oPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'select', textKey: 'uid', ifFilter: true, loadApi: 'm=SYS_CM_USERS&action=getAllUsers', filterItems: ['equal'], width: 80 },
        { title: '开单人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'select', textKey: 'uid', ifFilter: true, loadApi: 'm=SYS_CM_USERS&action=getAllUsers', filterItems: ['equal'], width: 80 },
        { title: '开单时间', name: 'cTime', type: 'date', width: 130 },
        { title: '<font color="red">当前任务状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}'}], width: 150 },
        { title: '任务状态', name: 'state', ifTrans: true, type: 'select', width: 120, ifFilter: true, filterItems: ['equal'], gtID: 448  },
        { title: '物资用途', name: 'note', key: 'note', type: 'none', width: 120, ifEnabledTips: true }
    ];
    var _fiAry = [
        { name: 'code', title: '领料单', comType: 'Label' },
        { name: 'dept', title: '部门', dataType: 'int', comType: 'Select', loadApi: 'm=SYS_CM_USERS&action=getAllDepts', req: true },
        { name: 'oPerson', title: '申领人', comType: 'Select', loadApi: 'm=SYS_CM_USERS&action=getAllUsers', textKey: 'uid', req: true },
        { name: 'cTime', title: '申领时间', comType: 'Date', req: true },
        { name: 'note', title: '物资用途', comType: 'TextArea' }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 35, title: '总务领料管理', icon: 'icon-glyph-gift', cn: 'b0', toolBarSkin: 'mr10 Button-default', gbsID: 106, onToolBarClick: onToolBarClick },
            'layout': { min: 244, max: 500, isRoot: 1, start: 380, dir: 'ns', dirLock: 2 },
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
            onSuccess: function () { taskList.refresh(); }
        });
    }

    function onToolBarClick(obj) {
        switch (+obj.Name) {
            case 109:
                if (!taskInfo) { return; };
                taskInfo.setInstanceId(-1); taskInfo.setTitle('<font color="red">新建无工程领料任务</font>'); msInfos = {};
                var _eExt = taskInfo.addPanel({ title: '领料单' }).css('min-height:315px;position: relative;border:1px dashed #e0e0e0;');
                var _tempL = new $.UI.Layout({ p: _eExt, dir: 'we', start: 300, isRoot: true, ifDrag: false, barWidth: 1 });
                var _form = new $.UI.Form({ p: _tempL.eHead, submitApi: 'm=SYS_CM_WH&action=create&type=glSend&wfIdx=77', items: _fiAry, foot_h: 35, btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '新建单据', icon: 'icon-glyph-plus-sign', css: 'margin-left:102px;' }, { name: 'selectms', text: '选择物资', icon: 'icon-glyph-shopping-cart', css: 'margin-left:8px;'}], onClick: onFormClick });
                if (_form.items['scanCode']) { var _scanCodeValue = $.Util.code.FullDate(); _form.items['scanCode'].setData(_scanCodeValue, _scanCodeValue); }
                if (_form.items['code']) { var _code = 'LL' + $.Util.code.FullDate(); _form.items['code'].setData(_code, _code); }
                _form.evt('onSubmit', function (obj) {
                    var _sAry = [], _count = 0;
                    for (var key in msInfos) { var _ms = msInfos[key]; if (! +_ms.number) { MTips.show('数量不能为空', 'warn'); return false; }; _count += (+_ms.number) * (+_ms.price); _sAry.push($.JSON.encode(_ms)); }
                    _form.setHidden('MSInfos', _sAry.join('^'));
                }).evt('onSubmitSuccess', function (data) { taskList.refresh({ onSuccess: function () { taskList.fireClick(0); } }); });
                msList = new $.UI.List({ p: _tempL.eFoot, dataSource: [], aHeader: _msAry, ifEnabledFilter: false, ifBindID: false, colControls: { header: { height: 30} }, onTDUpdate: onMAUpdate, onOperateClick: function (obj) { onOperateClick(obj, _form); } });
                break;
        }
    }

    function onOperateClick(obj, form) {
        var _id = obj.RowId;
        switch (obj.Name) {
            case 'delete':
                infoObj[_id] = null; delete infoObj[_id];
                obj.eTr.r();
                break;
        }
    }

    function onMAUpdate(obj, j, editTips) {
        var _key = j.name, _data = j.Data, _id = j.id, _val = +_data.UValue[_key];
        if (_key == 'number') { if (+obj.eTr.attr('stocknumber') < _val) { MTips.show('实领数量必须少于当前库存量', 'warn'); return false; }; }
        msInfos[_id][_key] = _val;
        obj.set('text', _data.UText[_key]).set('value', _val);
        msList.calculateCols(obj.eTd);
        editTips.hide(); return false;
    }

    function onFormClick(obj) {
        if (obj.Name == 'selectms') {
            var _tlArgs = {
                type: 'TreeList', lockLevel: 3, style: 'bingxing',
                loadApi: 'm=SYS_TABLE_TREE&action=getNodesByPid&table=GENERAL_MS&pid=1',
                aHeader: [
                    { name: 'id', type: 'attr' },
                    { name: 'pid', type: 'attr' },
                    { name: 'depth', type: 'attr' },
                    { name: 'sons', type: 'attr' },
                    { name: 'nodeName{1}{0}\t</font color="red">{0}{1}guige{1}{0}</font>{0}', type: 'none', width: 200 }
                ],
                onTDDoubleClick: onMSDoubleClick
            };
            if ($.global.popTips) { $.global.popTips.remove(); }
            $.global.popTips = new $.UI.PopDialog({ p: $DB, ePop: obj.Owner });
            $.global.popTips.css('width:600px;height:350px;').init(_tlArgs).show().evt('onSuccess', function () { $.global.popTips.resize(); });
        }
    }

    function onMSDoubleClick(obj) {
        var _depth = +obj.eTr.attr('depth'), _id = +obj.eTr.attr('id');
        if (_depth != 3) { return; }
        if (msInfos[_id]) { msList.fireClick(_id, 'ID'); return; }
        $.Util.ajax({
            args: 'm=SYS_TABLE_TREE&action=getNodeByID&table=GENERAL_MS&dataType=json&id=' + _id + '&keyFields=id,nodeName,scanCode,code,guige,dbo.SYS_TRANS_GT(danwei) as danwei,price,planPrice,avgPrice,lowPrice,highPrice,(select number from dbo.GENERAL_MS_STOCK where msId=' + _id + ') as stockNumber',
            onSuccess: function (data) {
                var _ms = eval(data.get(0) || '[]')[0] || {};
                if (! +_ms.stockNumber) { MTips.show('仓库库存量不足, 请联系管理员!', 'warn'); return; }
                msInfos[_id] = { msId: _id, planNum: 0, number: 0 };
                msList.insertRow(_ms);
            }
        });
    }
    function onWFComplete(obj) {
        MConfirm.setWidth(250).show('流程完成将会修改仓库库存信息！').evt('onOk', function () {
            $.Util.ajax({ args: 'm=SYS_CM_WH&action=onGLSendComplete&tkId=' + tkId });
        });
    }
    function onWFLoad() {
        var _eMS = taskInfo.addPanel({ title: '物资详情' }).css('position: relative;border-left:1px solid #e0e0e0;');
        new $.UI.List({ p: _eMS, ifFixedHeight: false, ifBindID: false, sonsKey: 'detail.sons', pidKey: 'detail.pid', style: 'tree:ms.scanCode', ifEnabledFilter: false, aHeader: _msDetailAry, loadApi: 'm=SYS_CM_WH&action=getGLMSDetailForTK&tkId=' + tkId + '&type=' + args.tid + '&jsonCondition={"detail.pid":0}', colControls: { header: {}} });
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