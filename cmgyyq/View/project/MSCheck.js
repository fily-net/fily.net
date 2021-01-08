$.NameSpace('$View.project');
$View.project.MSCheck = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, proId: 1, onSubmitSuccess: _fn }, popTips;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _receiveHAry = [
            { title: 'ID', name: 'id', type: 'attr' },
            { title: 'wfId', name: 'wfId', type: 'attr' },
            { title: 'ID', name: 'id', type: 'none', width: 50, ifFilter: true, filterItems: ['like'] },
            { title: '领料单据号', name: 'code', type: 'none', width: 130, ifFilter: true, filterItems: ['like'] },
            //{ title: '收料库', name: 'whId', ifTrans: true, trans: 'SYS_TRANS_WH', ifFilter: true, type: 'select', loadApi: 'm=SYS_TABLE_TREE&action=getNodesByPid&table=SYS_WH_INDEX&pid=4', filterItems: ['equal'], width: 120 },
            //{ title: '发票号', name: 'faPiaoHao', type: 'none', width: 100, ifFilter: true, filterItems: ['like'] },
            //{ title: '结算方法', name: 'jieSuanMethod', ifTrans: true, type: 'select', width: 80, ifFilter: true, filterItems: ['equal'], gtID: 275 },
            //{ title: '总金额(￥)', name: 'cost', type: 'none', width: 100 },
            { title: '供应商', name: 'gongYingShang', ifTrans: true, trans: 'SYS_TRANS_CPN', type: 'none', width: 130, ifEnabledTips: true },
            { title: '开单人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'select', textKey: 'uid', ifFilter: true, loadApi: 'm=SYS_CM_USERS&action=getAllUsers', filterItems: ['equal'], width: 80 },
            //{ title: '发料时间', name: 'mTime', type: 'date', width: 130 },
            { title: '开单时间', name: 'cTime', type: 'date', width: 130 },
            //{ title: '<font color="red">当前任务状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}' }], width: 150 },
            { title: '备注', name: 'note', key: 'note', type: 'none', width: 100, ifEnabledTips: true }
        ];
        var _receiveMSHAry = [
            { key: 'detailid', name: 'cast(detail.id as varchar(10))', type: 'attr' },
            { key: 'used', name: 'cast(detail.used as varchar(10))', type: 'attr' },
            { key: 'number', name: 'cast(detail.number as varchar(10))', type: 'attr' },
            { key: 'price', name: 'cast(detail.price as varchar(10))', type: 'attr' },
            { title: '编号', name: 'code', type: 'none', width: 80 },
            { title: '类别', name: 'ms.id', ifTrans: true, trans: 'SYS_TRANS_MS_CATEGORY', type: 'none', width: 160, ifEnabledTips: true },
            { title: '名称', name: 'nodeName', type: 'none', width: 120 },
            { title: '规格', name: 'ms.guige', type: 'none', width: 60 },
            { title: '状态', name: 'detail.state', type: 'none', ifTrans: true, width: 60 },
            //{ title: '最高价', name: 'ms.highPrice', type: 'none', width: 80 },
            //{ title: '平均价', name: 'ms.avgPrice', type: 'none', width: 80 },
            //{ title: '<font color="red">进价(￥)</font>', name: 'isnull(detail.price, 0)', type: 'none', width: 80 },
            { title: '<font color="#E49E0D">总数</font>', name: 'isnull(detail.number, 0)', type: 'none', width: 60 },
            { title: '<font color="#21b384">已用</font>', name: 'isnull(detail.used, 0)', type: 'none', width: 60 },
            { title: '<font color="red">未用</font>', name: 'isnull(detail.notUsed, 0)', type: 'none', width: 60 },
            { title: '单位', name: 'ms.danwei', type: 'none', ifTrans: true, width: 50 }
            //{ title: '<font color="red">总价(￥)</font>', name: 'isnull(detail.sum, 0)', type: 'none', width: 100 }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _tbAry = [
            { name: 'query', text: '查询退料物资详情', icon: 'fa fa-search', skin: 'Button-blue' }
        ];
        if (+args.info.ifRights) {
            _tbAry = [
                { name: 'save', text: '物资结算完成', icon: 'fa fa-save', skin: 'Button-danger' },
                { name: 'query', text: '查询退料物资详情', icon: 'fa fa-search', skin: 'Button-blue' }
            ];
        }
        if (+args.info.msRealCost) {
            _tbAry = [];
        }
        var comArgs = {
            'mainTips': { head_h: 30, title: '工程物资清算', icon: 'fa fa-pencil-square-o', cn: 'b0', toolBarAry: _tbAry, onToolBarClick: onToolBarClick },
            'rootLayout': { min: 400, max: 950, isRoot: 1, start: 710, dir: 'we', dirLock: 1 },
            'receiveList': { aHeader: _receiveHAry, loadApi: 'm=SYS_TABLE_BASE&table=PRO_MS_RECEIVE&action=pagingForList&jsonCondition={"proId":'+args.proId+'}', ifBindID: false, ifEnabledFilter: true, onSuccess: function (obj) { if (obj.Length) { obj.List.fireClick(0); } }, onTDClick: onTaskClick, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } } },
            'receiveDetailList': {
                ifBindID: false, ifFixedHeight: true,
                ifEnabledFilter: false,
                aHeader: _receiveMSHAry,
                colControls: { header: {} },
                onTDDoubleClick: onDetailDoubleClick
            }
        }
        var viewStruct = {
            p: owner,
            type: 'Tips', 
            name: 'mainTips', 
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'List', name: 'receiveList' },
                eFoot: { type: 'List', name: 'receiveDetailList' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
    }

    function onToolBarClick(obj) {
        switch (obj.name) {
            case 'query':
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
                    { title: '<font color="#E49E0D">总数</font>', name: 'isnull(detail.number, 0)', type: 'none', width: 60 },
                    { title: '<font color="#21b384">实用</font>', name: 'isnull(detail.used, 0)', type: 'none', width: 60 },
                    { title: '<font color="red">未用</font>', name: 'isnull(detail.notUsed, 0)', type: 'none', width: 60 },
                    { title: '单位', name: 'ms.danwei', type: 'none', ifTrans: true, width: 50 }
                    //{ title: '<font color="red">总价(￥)</font>', name: 'isnull(detail.sum, 0)', type: 'none', width: 100 }
                ];
                if (popTips) { popTips.remove(); popTips = null; }
                popTips = new $.UI.Tips({ head_h: 30, title: '工程退料物资详情', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 800, ifFixedHeight: true, height: 500 });
                new $.UI.List({ p: popTips.body, ifBindID: false, ifFixedHeight: false, aHeader: _backMSHAry, loadApi: 'm=SYS_CM_WH&action=getBackMSDetailForProject&type=PRO_MS_RECEIVE&proId=' + args.proId, colControls: { header: {} } });
                break;
            case 'save':
                $.Util.ajax({
                    args: 'm=SYS_CM_PRO&action=getBackMSCount&proId=' + args.proId,
                    onSuccess: function (data) {
                        var _count = +data.get(0);
                        if (_count) {
                            MConfirm.setWidth(550).show('发现还有未使用物资(可查询退料物资详情), 点击确认将发起退料流程!').evt('onOk', function () {
                                $.Util.ajax({
                                    args: 'm=SYS_CM_PRO&action=saveReciveResult&proId=' + args.proId + '&proCode=' + args.info.proCode + '&backCount=' + _count,
                                    onSuccess: function () {
                                        MTips.show('提交成功', 'ok');
                                        args.onSubmitSuccess();
                                    }
                                });
                            });
                        } else {
                            MConfirm.setWidth(350).show('确认保存结算？').evt('onOk', function () {
                                $.Util.ajax({
                                    args: 'm=SYS_CM_PRO&action=saveReciveResult&proId=' + args.proId + '&proCode=' + args.info.proCode,
                                    onSuccess: function () {
                                        MTips.show('保存成功', 'ok');
                                        args.onSubmitSuccess();
                                    }
                                });
                            });
                        }
                    }
                });
                break;
        }
    }

    function onDetailDoubleClick(obj) {
        if (+args.info.msRealCost || !+args.info.ifRights) {
            return false;
        }
        var _used = obj.eTr.attr('used'),
            _number = obj.eTr.attr('number'),
            _price = +obj.eTr.attr('price'),
            _detailid = obj.eTr.attr('detailid');
        var _fiAry = [
            { name: 'number', title: '总数', comType: 'Label', ifSubmit: false, text: _number,  group: { name: 'g1', width: 280 } },
            { name: 'used', title: '已使用', comType: 'Input', value: _used, dataType: 'double', group: 'g1', req: true }
        ];
        if (popTips) { popTips.remove(); popTips = null; }
        popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-edit', title: '更新物资已使用数量', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 320, ifFixedHeight: false });
        (new $.UI.Form({
            p: popTips.body, 
            items: _fiAry, ifFixedHeight: false,
            onSubmit: function (obj) {
                var _value = obj.Data.IValue;
                if (_value.used > +_number) {
                    MTips.show('已使用数量不能超过总数！','error');
                    return false;
                }
                _value.notUsed = +_number - _value.used;
                _value.usedSum = _value.used * _price;
                _value.notUsedSum = _value.notUsed * _price;
                $.Util.ajax({
                    args: 'm=SYS_TABLE_BASE&table=PRO_MS_RECEIVE_DETAIL&action=updateByID&id=' + _detailid + '&json=' + JSON.stringify(_value),
                    onSuccess: function () {
                        popTips.remove(); popTips = null;
                        coms['receiveDetailList'].refresh({}, true, false);
                    }
                });
                return false;
            }
        })).focus();
    }

    function onTaskClick(obj) {
        var _tkId = obj.Target.getAttr('id');
        coms['receiveDetailList'].loadAjax({ args: 'm=SYS_CM_WH&action=getMSDetailForTK&tkId=' + _tkId + '&type=PRO_MS_RECEIVE&jsonCondition={"state":741}' });
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