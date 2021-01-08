$.NameSpace('$View.general');
$View.general.InStock = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, tid: 'GENERAL_RECEIVE' };
    var coms = {}, taskInfo, tkId, taskList, currObj, msList, msInfos = {}, toolBar;
    var _msAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: '操作', name: 'o', type: 'operate', width: 80, items: [{ name: 'delete', text: '删除'}] },
        { title: '扫描码', name: 'scanCode', type: 'none', width: 120 },
        { title: '物资名称', name: 'nodeName', type: 'none', width: 100 },
        { title: '最高价(￥)', name: 'highPrice', type: 'none', width: 100 },
        { title: '<font color="red">实际价(￥)</font>', name: 'price', type: 'none', width: 100, comType: 'KeyInput', ifEdit: true },
        { title: '<font color="red">实收数量</font>', name: 'number', type: 'none', width: 100, comType: 'KeyInput', ifEdit: true },
        { title: '实际总值(￥)', name: 'totalSum', union: '$price*$number', type: 'none', width: 100 },
        { title: '计划价(￥)', name: 'planPrice', type: 'none', width: 100 },
        { title: '计划总值(￥)', name: 'planSum', union: '$planPrice*$number', type: 'none', width: 100 }
    ];
    var _msDetailAry = [
        { title: '扫描码', name: 'scanCode', type: 'none', width: 120 },
        { title: '物资编号', name: 'code', type: 'none', width: 100 },
        { title: '物资名称', name: 'nodeName', type: 'none', width: 120 },
        { title: '规格', name: 'ms.guige', type: 'none', width: 50 },
        { title: '单位', name: 'ms.danwei', type: 'none', ifTrans: true, width: 50 },
        { title: '计划价', name: 'ms.planPrice', type: 'none', width: 80 },
        { title: '最高价', name: 'ms.highPrice', type: 'none', width: 80 },
        { title: '平均价', name: 'ms.avgPrice', type: 'none', width: 80 },
        { title: '<font color="red">进价(￥)</font>', name: 'isnull(detail.price, 0)', type: 'none', width: 80 },
        { title: '<font color="red">实收量</font>', name: 'isnull(detail.number, 0)', type: 'none', width: 100 },
        { title: '<font color="red">实总价(￥)</font>', name: 'isnull(detail.sum, 0)', type: 'none', width: 100 }
    ];
    var _taskAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: 'wfId', name: 'wfId', type: 'attr' },
        { title: '收料单据号', name: 'code', type: 'none', width: 150, ifFilter: true, filterItems: ['like'] },
        { title: '发票号', name: 'faPiaoHao', type: 'none', width: 100, ifFilter: true, filterItems: ['like'] },
        { title: '结算方法', name: 'jieSuanMethod', ifTrans: true, type: 'select', width: 80, ifFilter: true, filterItems: ['equal'], gtID: 275 },
        { title: '总金额(￥)', name: 'cost', type: 'none', width: 100 },
        { title: '供应商', name: 'gongYingShang', type: 'none', width: 130 },
        { title: '收料人', name: 'shenQingPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'select', textKey: 'uid', ifFilter: true, loadApi: 'm=SYS_CM_USERS&action=getAllUsers', filterItems: ['equal'], width: 80 },
        { title: '收料时间', name: 'shenQingTime', type: 'date', width: 130 },
        { title: '开单人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'select', textKey: 'uid', ifFilter: true, loadApi: 'm=SYS_CM_USERS&action=getAllUsers', filterItems: ['equal'], width: 80 },
        { title: '开单时间', name: 'cTime', type: 'date', width: 130 },
        { title: '<font color="red">当前任务状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}'}], width: 150 },
        { title: '备注', name: 'note', key: 'note', type: 'none', width: 120, ifEnabledTips: true }
    ];
    var _fiAry = [
        { name: 'code', title: '收料单据号', comType: 'Label' },
        { name: 'cost', title: '金额', comType: 'KeyInput', dataType: 'double', req: true },
        { name: 'faPiaoHao', title: '发票号', comType: 'Input', req: true },
        { name: 'gongYingShang', title: '供应商', comType: 'Input' },
        { name: 'jieSuanMethod', title: '结算方式', gtID: 275, comType: 'Select' },
        { name: 'shenQingPerson', title: '收料人', comType: 'Select', loadApi: 'm=SYS_CM_USERS&action=getAllUsers', textKey: 'uid', req: true },
        { name: 'shenQingTime', title: '收料时间', comType: 'Date', req: true },
        { name: 'note', title: '物资用途', comType: 'TextArea' }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 35, title: '总务收料管理', icon: 'icon-glyph-gift', cn: 'b0', toolBarSkin: 'mr10 Button-default', gbsID: 105, onToolBarClick: onToolBarClick },
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
            case 108:
                if (!taskInfo) { return; }
                taskInfo.setInstanceId(-1); taskInfo.setTitle('<font color="red">新建收料任务</font>'); msInfos = {};
                var _eExt = taskInfo.addPanel({ title: '收料单' }).css('min-height:385px;position: relative;border:1px dashed #e0e0e0;');
                var _tempL = new $.UI.Layout({ p: _eExt, dir: 'we', start: 300, isRoot: true, ifDrag: false, barWidth: 1 });
                var _form = new $.UI.Form({ p: _tempL.eHead, submitApi: 'm=SYS_CM_WH&action=create&type=glReceive&wfIdx=78', items: _fiAry, foot_h: 35, btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '新建单据', icon: 'icon-glyph-plus-sign', css: 'margin-left:102px;' }, { name: 'selectms', text: '选择物资', icon: 'icon-glyph-shopping-cart', css: 'margin-left:8px;'}], onClick: onFormClick });
                if (_form.items['scanCode']) { var _scanCodeValue = $.Util.code.FullDate(); _form.items['scanCode'].setData(_scanCodeValue, _scanCodeValue); }
                if (_form.items['code']) { var _code = 'SL' + $.Util.code.FullDate(); _form.items['code'].setData(_code, _code); }
                _form.evt('onSubmit', function (obj) {
                    var _sAry = [], _count = 0, _costVal = +_form.items['cost'].getValue();
                    if (!_costVal) { MTips.show('单据金额必填', 'warn'); return false; }
                    for (var key in msInfos) { var _ms = msInfos[key]; if (! +_ms.number) { MTips.show('数量不能为空', 'warn'); return false; }; _count += (+_ms.number) * (+_ms.price); _ms.sum = (+_ms.price) * (+_ms.number); _sAry.push($.JSON.encode(_ms)); }
                    if (_costVal != _count.toFixed(2)) { MTips.show('选择物料金额(<font class="fw">' + _count.toFixed(2) + '</font>)和实际单据金额(<font class="fw">' + _costVal + '</font>)不一致，请核对后再提交', 'warn'); return false; }
                    _form.setHidden('MSInfos', _sAry.join('^'));
                }).evt('onSubmitSuccess', function (data) { taskList.refresh({ onSuccess: function () { taskList.fireClick(0); } }); });
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
            args: 'm=SYS_TABLE_TREE&action=getNodeByID&table=GENERAL_MS&dataType=json&id=' + _id + '&keyFields=id,nodeName,scanCode,code,guige,danwei,price,planPrice,avgPrice,lowPrice,highPrice',
            onSuccess: function (data) {
                var _ms = eval(data.get(0) || '[]')[0] || {};
                msInfos[_id] = { msId: _id, number: 0, price: +((+_ms.price).toFixed(2)) };
                msList.insertRow(_ms);
            }
        });
    }
    function onWFComplete(obj) {
        MConfirm.setWidth(250).show('流程完成将会修改仓库库存信息！').evt('onOk', function () {
            $.Util.ajax({ args: 'm=SYS_CM_WH&action=onGLReceiveComplete&tkId=' + tkId });
        });
    }
    function onWFLoad() {
        var _eMS = taskInfo.addPanel({ title: '物资详情' }).css('position: relative;border-left:1px solid #e0e0e0;');
        new $.UI.List({ p: _eMS, ifFixedHeight: false, ifBindID: false, ifEnabledFilter: false, aHeader: _msDetailAry, loadApi: 'm=SYS_CM_WH&action=getGLMSDetailForTK&tkId=' + tkId + '&type=' + args.tid, colControls: { header: {}} });
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