$.NameSpace('$View.depository');
$View.depository.StockInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, whID: 0, msID: 0 };
    var coms = {}, sList, sView, fLayout, maList, infoObj = {}, _type;
    var _slHeaderAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: '操作', name: 'o', type: 'operate', width: 80, items: [{ name: 'delete', text: '删除'}] },
        { title: '扫描码', name: 'scanCode', type: 'none', width: 120 },
        { title: '物资名称', name: 'nodeName', type: 'none', width: 100 },
        { title: '最高价(￥)', name: 'highPrice', type: 'none', width: 100 },
        { title: '实际价(￥)', name: 'price', type: 'none', width: 100, comType: 'KeyInput', ifEdit: true },
        { title: '实收数量', name: 'number', type: 'none', width: 100, comType: 'KeyInput', ifEdit: true },
        { title: '实际总值(￥)', name: 'totalSum', union: '$price*$number', type: 'none', width: 100 },
        { title: '计划价(￥)', name: 'planPrice', type: 'none', width: 100 },
        { title: '计划总值(￥)', name: 'planSum', union: '$planPrice*$number', type: 'none', width: 100 },
        { title: '<font color="red">库存</font>', name: 'currStock', type: 'none', width: 80 },
        { title: '库存金额(￥)', name: 'totalSum', type: 'none', width: 100 }
    ];
    var _tbHeaderAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: '操作', name: 'o', type: 'operate', width: 120, items: [{ name: 'delete', text: '删除' }, { name: 'detail', text: '批次详情'}] },
        { title: '扫描码', name: 'scanCode', type: 'none', width: 120 },
        { title: '物资名称', name: 'nodeName', type: 'none', width: 100 },
        { title: '调拨数量', name: 'number', type: 'none', width: 100, comType: 'KeyInput', ifEdit: true },
        { title: '计划价(￥)', name: 'planPrice', type: 'none', width: 100 },
        { title: '计划总值(￥)', name: 'planSum', union: '$planPrice*$number', type: 'none', width: 100 },
        { title: '<font color="red">库存</font>', name: 'currStock', type: 'none', width: 80 },
        { title: '库存金额(￥)', name: 'totalSum', type: 'none', width: 100 }
    ];
    var _htemp = '<div style="float:left;width:25%;">{0}</div><div style="float:left;width:25%;">{1}</div><div style="float:left;width:25%;">{2}</div><div style="float:left;width:25%;">{3}</div>';
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { title: 'ID', name: 'ms.id', key: 'id', type: 'attr' },
            { title: '扫描码', name: 'ms.scanCode', key: 'scanCode', type: 'none', width: 120 },
            { title: '物资编号', name: 'ms.code', key: 'code', type: 'none', width: 100 },
            { title: '物资名称', name: 'ms.nodeName', key: 'nodeName', type: 'none', width: 120 },
            { title: '<font color="red">当前库存</font>', name: 'isnull(stock.number, 0)', key: 'number', type: 'none', width: 100 },
            { title: '<font color="red">当前总值(￥)</font>', name: 'isnull(stock.totalSum, 0)', key: 'totalSum', type: 'none', width: 100 },
            { title: '规格', name: 'ms.guige', key: 'guige', type: 'none', width: 50 },
            { title: '单位', name: 'ms.danwei', key: 'danwei', type: 'none', ifTrans: true, width: 50 },
            { title: '计划价(￥)', name: 'ms.planPrice', key: 'planPrice', type: 'none', width: 100 },
            { title: '平均价(￥)', name: 'ms.avgPrice', key: 'avgPrice', type: 'none', width: 100 },
            { title: '最高价(￥)', name: 'ms.highPrice', key: 'highPrice', type: 'none', width: 100 },
            { title: '商品备注', name: 'ms.note', key: 'note', type: 'none', width: 200 }
        ];
        var comArgs = {
            'layout': { min: 244, max: 500, isRoot: 1, start: 340, dir: 'ns', dirLock: 2 },
            'rootLayout': { min: 244, max: 500, start: 420, dir: 'we', dirLock: 1 },
            'sView': { url: 'View/common/TreeList.js', table: 'SYS_WH_MS', ifShowToolBar: false, rootID: 1, ifShowID: false, lockLevel: 2, ifExpandAll: true, onTDClick: onStructClick, onLoad: function (view) { sView = view; } },
            'sList': { aHeader: _mHeaderAry, ifBindID: false, ifEnabledFilter: false, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onTDDoubleClick: onStockTDDoubleClick }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'layout',
            eHead: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'View', name: 'sView' },
                eFoot: { type: 'List', name: 'sList' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        sList = coms.sList;
        //--**--Codeing here--**--//
    }

    function onStructClick(obj) {
        var _level = obj.TreeList.get('currLevel'), _rowId = -1, _whID = args.whID;
        if (!_whID) { return; };
        if (_level == 2) {
            _rowId = obj.Attr.selID;
            sList.setAttr('ifAjax', false).loadAjax({ args: 'm=SYS_CM_WH&action=getStockNumByWH&msPid=' + _rowId + '&whId=' + _whID });
        } else {
            if (! +obj.Target.getAttr('sons')) {
                sList.setAttr('ifAjax', false).loadAjax({ args: 'm=SYS_CM_WH&action=getStockNumByWH&msPid=-1&whId=-1' });
            }
        }
    }

    function onStockTDDoubleClick(obj) {
        var _data = sList.getRowDataByTR(obj.eTr), _id = _data.id, _pPrice = _data.planPrice;
        _data.currStock = _data.number;
        _data.number = 0;
        if (infoObj[_id]) { maList.fireClick(_id, 'ID'); return; }
        infoObj[_id] = { msId: _id, number: 0 };
        switch (_type) {
            case 'receive':
                _data.price = _pPrice;
                infoObj[_id].price = _pPrice * 1;
                break;
            case 'allocate':
                if (! +_data.currStock) { MTips.show('当前库存不足', 'warn'); return; }
                break;
        }
        maList.insertRow(_data);
    }

    function onWHSelectBefore(obj, self) {
        var _type = +obj.getAttr('type');
        var _val = obj.getAttr('rowId'), _txt = obj.get('text');
        if (_type == 2) { self.setData(_val, _txt); } else { MTips.show('请选择仓库', 'warn'); return false; }
    }


    me.loadStock = function (whID) { args.whID = whID; sView.treeList.List.refresh(null, true, true); }
    me.action = function (action) {
        if (!fLayout) { fLayout = new $.UI.Layout({ p: coms.layout.eFoot, start: 300, isRoot: true, dir: 'we', ifCover: false, barWidth: 2, ifDrag: false }); };
        fLayout.eHead.h(''); fLayout.eFoot.h(''); infoObj = {}; _type = action.trim();
        var _fAry = [], _title = '<font color="red">调拨</font>表单信息', _sIcon = 'icon-glyph-retweet', _wfIdx, _head, _prefix = 'TB';
        switch (_type) {
            case 'allocate':
                _fAry = [
                    { name: 'code', title: '调拨编号', comType: 'Label' },
                    { name: 'destinationWH', title: '调拨至库', dataType: 'int', comType: 'Select', loadApi: 'm=SYS_TABLE_TREE&action=getNodesByPid&table=SYS_WH_INDEX&pid=4', onListTDClickBefore: onWHSelectBefore }
                ];
                _wfIdx = 64; _head = _tbHeaderAry;
                break;
            case 'receive':
                _title = '<font color="red">收料</font>表单信息';
                _sIcon = 'icon-glyph-gift';
                _fAry = [
                    { name: 'code', title: '收料单据号', comType: 'Label' },
                    { name: 'faPiaoHao', title: '发票号', comType: 'Input' },
                    { name: 'gongYingShang', title: '供应商', comType: 'Input' },
                    { name: 'jieSuanMethod', title: '结算方式', gtID: 275, comType: 'Select' },
                    { name: 'shenQingPerson', title: '申请人', comType: 'Select', loadApi: 'm=SYS_CM_USERS&action=getAllUsers', textKey: 'uid' },
                    { name: 'shenQingTime', title: '申请时间', comType: 'Date' },
                    { name: 'note', title: '物资用途', comType: 'TextArea' }
                ];
                _wfIdx = 78; _head = _slHeaderAry; _prefix = 'SL';
                break;
        }
        maList = new $.UI.List({ p: fLayout.eFoot, dataSource: [], aHeader: _head, ifEnabledFilter: false, ifBindID: false, colControls: { header: { height: 25} }, onTDUpdate: onMAUpdate, onOperateClick: onOperateClick });
        var _form = new $.UI.Form({ p: fLayout.eHead, ifFocus: false, ifFixedHeight: false, submitApi: 'm=SYS_CM_WH&action=create&type=' + _type + '&wfIdx=' + _wfIdx, head_h: 25, extSubmitVal: { whId: args.whID }, title: _title, icon: _sIcon, items: _fAry });
        var _code = _prefix + $.Util.code.FullDate();
        _form.items['code'].setData(_code, _code);
        _form.evt('onSubmit', function (obj) {
            var _sAry = [];
            for (var key in infoObj) { _sAry.push($.JSON.encode(infoObj[key])); }
            _form.setHidden('MSInfos', _sAry.join('^'));
        }).evt('onSubmitSuccess', function () { me.action(action); });
    }

    function onOperateClick(obj) {
        var _id = obj.RowId;
        switch (obj.Name) {
            case 'detail':
                $.Util.ajax({
                    args: 'm=SYS_CM_WH&action=getMSBatchDetail&msId=' + _id + '&totalNum=' + infoObj[_id].number,
                    onSuccess: function (data) {
                        var _batchAry = eval(data.get(0)), _bLen = _batchAry.length, _sHtml = '<li class="fwb" style="height:25px;line-height:25px;"><div style="float:left;width:120px;">批次号</div><div style="float:left;width:120px;">进格</div><div style="float:left;width:120px;">剩余数</div><div style="float:left;width:120px;">总数</div><div style="float:left;width:120px;">采购人</div><div style="float:left;width:120px;">创建时间</div><li>';
                        for (var i = 0; i < _bLen; i++) {
                            var _bObj = _batchAry[i];
                            _sHtml += '<li style="height:20px;line-height:20px;"><div style="float:left;width:120px;">' + _bObj.batchCode + '</div><div style="float:left;width:120px;">' + _bObj.price + '</div><div style="float:left;width:120px;">' + _bObj.remainNum + '</div><div style="float:left;width:120px;">' + _bObj.totalNum + '</div><div style="float:left;width:120px;">' + _bObj.cPerson + '</div><div style="float:left;width:120px;">' + _bObj.cTime + '</div><li>';
                        }
                        if ($.global.popTips) { $.global.popTips.remove(); }
                        $.global.popTips = (new $.UI.PopDialog({ p: $DB, ePop: obj.E, css: 'max-height:180px;padding:10px;', cn: 'fs12' })).html(_sHtml);
                    }
                });
                break;
            case 'delete':
                infoObj[_id] = null; delete infoObj[_id];
                obj.eTr.r();
                break;
        }
    }

    function onMAUpdate(obj, j, editTips) {
        var _key = j.name, _data = j.Data, _id = j.id, _val = _data.UValue[_key];
        infoObj[_id][_key] = +_val;
        obj.set('text', _data.UText[_key]).set('value', _val);
        maList.calculateCols(obj.eTd);
        editTips.hide(); return false;
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