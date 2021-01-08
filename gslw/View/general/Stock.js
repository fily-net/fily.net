$.NameSpace('$View.general');
$View.general.Stock = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, table: 'GENERAL_MS' };
    var coms = {}, dList, _pPath;
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
            { title: '批次详情', type: 'operate', width: 60, items: [{ name: 'detail', text: '查看', key: 'ms.id'}] },
            { title: '规格', name: 'ms.guige', key: 'guige', type: 'none', width: 50 },
            { title: '单位', name: 'ms.danwei', key: 'danwei', type: 'none', ifTrans: true, width: 50 },
            { title: '计划价(￥)', name: 'ms.planPrice', key: 'planPrice', type: 'none', width: 100 },
            { title: '平均价(￥)', name: 'ms.avgPrice', key: 'avgPrice', type: 'none', width: 100 },
            { title: '最高价(￥)', name: 'ms.highPrice', key: 'highPrice', type: 'none', width: 100 },
            { title: '商品备注', name: 'ms.note', key: 'note', type: 'none', width: 100, ifEnabledTips: true }
        ];
        var _mItemAry = [
            { title: '扫描码', name: 'scanCode', comType: 'ScanCode', group: { name: 'g1', width: 300} },
            { title: '物资编号', name: 'code', comType: 'Input', group: 'g1' },
            { title: '物资名称', name: 'nodeName', comType: 'Input', group: 'g1' },
            { title: '单位', name: 'danwei', comType: 'Select', gtID: 252, group: 'g1' },
            { title: '计划价', name: 'planPrice', comType: 'KeyInput', dataType: 'double', group: { name: 'g2', width: 300} },
            { title: '最高价', name: 'highPrice', comType: 'KeyInput', dataType: 'double', group: 'g2' },
            { title: '规格', name: 'guige', comType: 'Input', group: 'g2' },
            { title: '备注', name: 'note', comType: 'TextArea', group: 'g2' }
        ];
        var _hAry = [
            { name: 'id', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'parentPath', type: 'attr' },
            { name: 'nodeName', type: 'none', width: 200, ifEdit: true }
        ];
        var _batchHeaderAry = [
            { title: '批次号', name: 'batchCode', type: 'none', width: 150 },
            { title: '批次类型', name: 'type', ifTrans: true, type: 'none', width: 80 },
            { title: '进价', name: 'price', type: 'none', width: 90 },
            { title: '总量', name: 'totalNum', type: 'none', width: 80 },
            { title: '批次库存量', name: 'remainNum', type: 'none', width: 80 },
            { title: '生成时间', name: 'cTime', type: 'date', width: 130 },
            { title: '操作人', name: 'cPerson', type: 'none', ifTrans: true, trans: 'SYS_TRANS_USER', width: 100 }
        ];
        var comArgs = {
            'rootTips': { head_h: 30, title: '总务物资管理', cn: 'b0', icon: 'icon-glyph-th-large' },
            'rootLayout': { min: 244, max: 500, isRoot: 1, start: 483, dir: 'we', dirLock: 1 },
            'sView': { url: 'View/common/TreeList.js', headAry: _hAry, table: args.table, ifShowID: false, lockLevel: 2, rootID: 1, ifExpandAll: true, onTDClick: onStructClick },
            'infoView': {
                url: 'View/common/MasterSlave.js',
                gtRootID: 175,
                table: args.table, ifLoadData: false,
                listArgs: { aHeader: _mHeaderAry, ifBindID: false, onOperateClick: function (obj) { onOperateClick(obj); } },
                toolBarAry: [
                    { name: 'sys_add', text: '添加物资', title: '添加物资', icon: 'icon-glyph-plus-sign' },
                    { name: 'sys_delete', text: '删除物资', title: '删除物资', icon: 'icon-glyph-remove-sign' },
                    { name: 'sys_managerTables', text: '管理对照表', title: '管理对照表', icon: 'icon-glyph-th-list', rootId: 160 }
                ],
                childs: [
                    { name: 'base', type: 'Form', ifPress: true, text: '物资基本信息', insertApi: '', icon: 'icon-glyph-list-alt', items: _mItemAry }
                ],
                onLoad: function (view, b) { dList = view; }
            }
        }
        var struct = {
            p: owner,
            name: 'rootTips',
            type: 'Tips',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'View', name: 'sView' },
                eFoot: { type: 'View', name: 'infoView' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
    }

    function onOperateClick(obj) {
        var _id = obj.RowId;
        switch (obj.Name) {
            case 'detail':
                $.Util.ajax({
                    args: 'm=SYS_CM_WH&action=getAllGLMSBatchDetail&dataType=json&msId=' + _id,
                    onSuccess: function (data) {
                        var _batchAry = eval(data.get(0)||'[]'), _bLen = _batchAry.length, _sHtml = '<li class="fwb" style="height:25px;line-height:25px;"><div style="float:left;width:120px;">批次号</div><div style="float:left;width:120px;">进格</div><div style="float:left;width:120px;">剩余数</div><div style="float:left;width:120px;">总数</div><div style="float:left;width:120px;">采购人</div><div style="float:left;width:120px;">创建时间</div><li>';
                        if (_bLen) {
                            for (var i = 0; i < _bLen; i++) {
                                var _bObj = _batchAry[i];
                                _sHtml += '<li style="height:20px;line-height:20px;"><div style="float:left;width:120px;">' + _bObj.batchCode + '</div><div style="float:left;width:120px;">' + _bObj.price + '</div><div style="float:left;width:120px;">' + _bObj.remainNum + '</div><div style="float:left;width:120px;">' + _bObj.totalNum + '</div><div style="float:left;width:120px;">' + _bObj.cPerson + '</div><div style="float:left;width:120px;">' + _bObj.cTime + '</div><li>';
                            }
                            if ($.global.popTips) { $.global.popTips.remove(); }
                            $.global.popTips = (new $.UI.PopDialog({ p: $DB, ePop: obj.E, css: 'max-height:180px;padding:10px;', cn: 'fs12' })).html(_sHtml);
                        } else {
                            MTips.show('暂无批次', 'warn');
                        }
                    }
                });
                break;
        }
    }

    function onStructClick(obj) {
        var _level = obj.TreeList.get('currLevel'), _rowId = -1; _pPath = obj.Target.getAttr('parentPath');
        if (_level == 2) {
            _rowId = obj.Attr.selID; delayShowInfo(_rowId);
        } else {
            if (! +obj.Target.getAttr('sons')) { delayShowInfo(-1); }
        }
    }

    function delayShowInfo(pid) {
        if (!dList) { setTimeout(function () { delayShowInfo(pid); }, 200); return; }
        dList.loadByPid('m=SYS_CM_WH&action=getGLStockNumByWH', pid);
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