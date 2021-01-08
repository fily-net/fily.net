$.NameSpace('$View.project');
$View.project.InTask = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, proId: 1, taskId: null };
    var coms = {}, taskInfo, tkId, taskList, currObj, msList, msInfos = {}, toolBar, popTips;
    var gongYingShang;
    var _msAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: '操作', name: 'o', type: 'operate', width: 80, items: [{ name: 'delete', text: '删除'}] },
        //{ title: '扫描码', name: 'scanCode', type: 'none', width: 120 },
        { title: '物资名称', name: 'nodeName', type: 'none', width: 100 },
        { title: '规格', name: 'guige', type: 'none', width: 100 },
        { title: '<font color="red">数量</font>', name: 'number', type: 'none', width: 80, comType: 'KeyInput', ifEdit: true },
        { title: '单位', name: 'danwei', type: 'none', width: 60 }
    ];
    var _msDetailAry = [
        //{ title: '扫描码', name: 'scanCode', type: 'none', width: 120 },
        { title: '编号', name: 'code', type: 'none', width: 100 },
        { title: '类别', name: 'ms.id', ifTrans: true, trans: 'SYS_TRANS_MS_CATEGORY', type: 'none', width: 180, ifEnabledTips: true },
        { title: '名称', name: 'nodeName', type: 'none', width: 120 },
        { title: '规格', name: 'ms.guige', type: 'none', width: 60 },
        { title: '单位', name: 'ms.danwei', type: 'none', ifTrans: true, width: 60 },
        { title: '状态', name: 'detail.state', type: 'none', ifTrans: true, width: 80 },
        //{ title: '最高价', name: 'ms.highPrice', type: 'none', width: 80 },
        //{ title: '平均价', name: 'ms.avgPrice', type: 'none', width: 80 },
        //{ title: '<font color="red">进价(￥)</font>', name: 'isnull(detail.price, 0)', type: 'none', width: 80 },
        { title: '<font color="red">数量</font>', name: 'isnull(detail.number, 0)', type: 'none', width: 100 }
        //{ title: '<font color="red">总价(￥)</font>', name: 'isnull(detail.sum, 0)', type: 'none', width: 100 }
    ];
    var _taskAry = [
        { title: 'ID', name: 'id', type: 'attr' },
        { title: 'wfId', name: 'wfId', type: 'attr' },
        { name: 'gongYingShang', type: 'attr' },
        { title: '领料单据号', name: 'code', type: 'none', width: 130, ifFilter: true, filterItems: ['like'] },
        //{ title: '收料库', name: 'whId', ifTrans: true, trans: 'SYS_TRANS_WH', ifFilter: true, type: 'select', loadApi: 'm=SYS_TABLE_TREE&action=getNodesByPid&table=SYS_WH_INDEX&pid=4', filterItems: ['equal'], width: 120 },
        //{ title: '发票号', name: 'faPiaoHao', type: 'none', width: 100, ifFilter: true, filterItems: ['like'] },
        //{ title: '结算方法', name: 'jieSuanMethod', ifTrans: true, type: 'select', width: 80, ifFilter: true, filterItems: ['equal'], gtID: 275 },
        //{ title: '总金额(￥)', name: 'cost', type: 'none', width: 100 },
        { title: '供应商', name: 'gongYingShang', ifTrans: true, trans: 'SYS_TRANS_CPN', type: 'none', width: 200, ifEnabledTips: true },
        //{ title: '收料人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'select', textKey: 'uid', ifFilter: true, loadApi: 'm=SYS_CM_USERS&action=getAllUsers', filterItems: ['equal'], width: 80 },
        //{ title: '发料时间', name: 'mTime', type: 'date', width: 130 },
        { title: '开单时间', name: 'cTime', type: 'date', width: 130 },
        { title: '<font color="red">当前任务状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}'}], width: 150 },
        { title: '备注', name: 'note', key: 'note', type: 'none', width: 100, ifEnabledTips: true }
    ];
    var _fiAry = [
        { name: 'code', title: '领料单据号', comType: 'Label', group: { width: 320, name: 'g1' } },
        { name: 'note', title: '备注', comType: 'TextArea', group: 'g1' }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _toolAry = [];
        if (+args.info.ifRights) {
            _toolAry = [
                { name: 'add', text: '发起工程领料单', skin: 'Button-s1', icon: 'fa-edit' }
            ];
        }
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 30, title: '工程领料/发料管理', icon: 'fa fa-file-text-o', cn: 'b0', toolBarSkin: 'mr5 Button-default', toolBarAry: _toolAry, onToolBarClick: onToolBarClick },
            'layout': { min: 560, max: 900, isRoot: 1, start: 710, dir: 'we', dirLock: 1 },
            'taskInfo': {
                url: 'View/workflow/WorkFlowInfo.js',
                onLoadComplete: onWFLoad,
                onComplete: onWFComplete,
                onNextSuccess: onWFNextSucc,
                onRights: onWFRights,
                ifAttach: true,
                onLoad: function (view) {
                    taskInfo = view;
                }
            },
            'taskList': {
                aHeader: _taskAry,
                loadApi: 'm=SYS_TABLE_BASE&table=PRO_MS_RECEIVE&action=pagingForList&jsonCondition={"proId": ' + args.proId + '}',
                ifBindID: false,
                ifEnabledFilter: true, onSuccess: function (obj) {
                    if (obj.Length) {
                        if (args.taskId) {
                            obj.List.fireClick(args.taskId, "ID");
                        } else {
                            obj.List.fireClick(0);
                        }
                    }
                },
                onTDClick: onTaskClick,
                colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } }
            }
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

    function onWFRights(wfInfo, toolBar, dData, rData) {
        if (+dData.treeOrder == 2) {
            new $.UI.Form({
                p: wfInfo.addPanel({ title: '选择物资供应商' }),
                items: [
                    { name: 'msSupplierId', title: '供应商', comType: 'Select', onClick: onExecTeamClick, textKey: 'companyName' }
                ],
                foot_h: 0,
                ifFixedHeight: false
            });
        }
    }

    function onExecTeamClick(obj) {
        var _loadApi = 'm=SYS_TABLE_BASE&action=getByCondition&orderCol=cTime&table=PRO_SUPPLIER&jsonCondition={"type":746,"state":748}';
        popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-list', title: '选择物资供应商', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 840, height: 600 });
        new $.UI.View({
            p: popTips.body,
            url: 'View/project/SupplierQueryList.js',
            type: '745',
            dbclick: function (id, company) {
                obj.self.setValue(id);
                obj.self.setText(company);
                $.Util.ajax({
                    args: 'm=SYS_CM_PRO&action=setSupplier&proId=' + args.info.id + '&sid=' + id + '&rid=' + tkId,
                    onSuccess: function () {
                        ifCommitForm = true;
                        MTips.show('保存成功', 'ok');
                        popTips.remove(); popTips = null;
                    }
                });
            }
        });
        return false;
    }

    function onWFNextSucc(obj) {
        /*
        $.Util.ajax({
            args: 'm=SYS_TABLE_BASE&table=TK_WH_RECEIVE&action=updateRights&users=' + obj.Node.owner + '&id=' + tkId,
            onSuccess: function () { taskList.refresh({ onSuccess: function (obj) { obj.List.fireClick(0); } }, false, false); }
        });*/
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'add':
                if (!taskInfo) { return; }
                taskInfo.setInstanceId(-1); taskInfo.setTitle('<font color="red">新建施工领料单</font>'); msInfos = {};
                var _eExt = taskInfo.addPanel({ title: '领料表单' }).css('min-height:240px;position: relative;border:1px dashed #e0e0e0;');
                _eExt.h('<div style="border:1px solid #e0e0e0;margin:5px;"></div><div style="border:1px solid #e0e0e0;margin:5px;"></div>');
                var _eForm = _eExt.fc(), _eList = _eForm.ns();
                var _fiAry = [
                    { name: 'code', title: '领料单据号', comType: 'Label', group: { width: 320, name: 'g1' } },
                    { name: 'note', title: '备注', comType: 'TextArea', group: 'g1' }
                ];
                var _form = new $.UI.Form({
                    p: _eForm,
                    submitApi: 'm=SYS_CM_PRO&action=addReciveTask&proCode=' + args.info.proCode,
                    items: _fiAry,
                    extSubmitVal: {
                        proId: args.proId
                    },
                    foot_h: 35,
                    ifFixedHeight: false,
                    btnItems: [
                        { name: 'FORM-SYS-SUBMIT', text: '新建单据', icon: 'fa fa-plus', skin: 'Button-blue', css: 'margin-left:94px;' },
                        { name: 'selectms', text: '选择物资', icon: 'fa fa-cart-plus', skin: 'Button-danger', css: 'margin-left:8px;' }
                    ],
                    onClick: onFormClick
                });
                if (_form.items['scanCode']) { var _scanCodeValue = $.Util.code.FullDate(); _form.items['scanCode'].setData(_scanCodeValue, _scanCodeValue); }
                if (_form.items['code']) { var _code = 'SL' + $.Util.code.FullDate(); _form.items['code'].setData(_code, _code); }
                _form.evt('onSubmit', function (obj) {
                    var _sAry = [], _count = 0;
                    for (var key in msInfos) {
                        var _ms = msInfos[key];
                        if (! +_ms.number) {
                            MTips.show('数量不能为空', 'warn'); return false;
                        };
                        _ms.sum = (+_ms.price) * (+_ms.number);
                        _count += _ms.sum;
                        _sAry.push($.JSON.encode(_ms));
                    }
                    _form.setExt('cost', _count);
                    _form.setHidden('MSInfos', _sAry.join('\u0002'));
                }).evt('onSubmitSuccess', function (data) {
                    taskList.refresh({
                        onSuccess: function () {
                            taskList.fireClick(0);
                        }
                    });
                });
                msList = new $.UI.List({ p: _eList, dataSource: [], aHeader: _msAry, ifEnabledFilter: false, ifFixedHeight: false, ifBindID: false, colControls: { header: { height: 30 } }, onTDUpdate: onMAUpdate, onOperateClick: onOperateClick });
                break;
        }
    }

    function onOperateClick(obj) {
        var _id = obj.RowId;
        if (obj.Name == 'delete') {
            MConfirm.setWidth(250).show('确定删除该记录！').evt('onOk', function () {
                msInfos[_id] = null; delete msInfos[_id]; obj.eTr.r();
            });
        }
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
            if (popTips) { popTips.remove(); }
            popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-list', title: '选择物资', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 840, height: 600 });
            new $.UI.TreeList({
                p: popTips.body,
                lockLevel: 3, style: 'bingxing',
                loadApi: 'm=SYS_TABLE_TREE&action=getNodesByPid&table=SYS_WH_MS&pid=1',
                aHeader: [
                    { name: 'id', type: 'attr' },
                    { name: 'pid', type: 'attr' },
                    { name: 'depth', type: 'attr' },
                    { name: 'sons', type: 'attr' },
                    { name: 'nodeName{1}{0}\t</font color="red">{0}{1}guige{1}{0}</font>{0}', type: 'none', width: 200 }
                ],
                onTDDoubleClick: onMSDoubleClick
            });
        }
    }

    function onMSDoubleClick(obj) {
        var _depth = +obj.eTr.attr('depth'), _id = +obj.eTr.attr('id');
        if (_depth != 3) { return; }
        if (msInfos[_id]) { msList.fireClick(_id, 'ID'); return; }
        $.Util.ajax({
            args: 'm=SYS_TABLE_TREE&action=getNodeByID&table=SYS_WH_MS&dataType=json&id=' + _id + '&keyFields=id,nodeName,scanCode,code,guige,dbo.SYS_TRANS_GT(danwei) as danwei,price,planPrice,avgPrice,lowPrice,highPrice',
            onSuccess: function (data) {
                var _ms = eval(data.get(0) || '[]')[0] || {};
                msInfos[_id] = { msId: _id, number: 0, price: +((+_ms.price).toFixed(2)) };
                msList.insertRow(_ms);
            }
        });
    }
    function onWFComplete(obj) {
        $.Util.ajax({
            args: 'm=SYS_CM_PRO&action=onReciveTaskComplete&tkId=' + tkId,
            onSuccess: function () {
                taskList.refresh({
                    onSuccess: function (obj) { taskList.fireClick(0); }
                });
            }
        });
        /*
        MConfirm.setWidth(250).show('流程完成将会修改仓库库存信息！').evt('onOk', function () {
            $.Util.ajax({ args: 'm=SYS_CM_WH&action=onReceiveComplete&tkId=' + tkId });
        });*/
    }
    function onWFLoad(obj) {
        var _ifEdit = false,
            _title = '物资详情',
            _order = +obj.currNode.treeOrder,
            _attach = obj.WorkFlowInfo.attach;
        if (_attach) {
            _attach.setEnabled(false);
        }
        console.log(obj.WorkFlowInfo);
        if (_order == 2 && obj.WorkFlowInfo.ifHasRight) {
            _msDetailAry = [
                { key: 'detailid', name: 'cast(detail.id as varchar(10))', type: 'attr' },
                { key: 'number', name: 'cast(detail.number as varchar(10))', type: 'attr' },
                { key: 'price', name: 'cast(detail.price as varchar(10))', type: 'attr' },
                { key: 'highPrice', name: 'cast(ms.highPrice as varchar(10))', type: 'attr' },
                { key: 'lowPrice', name: 'cast(ms.lowPrice as varchar(10))', type: 'attr' },
                { title: '编号', name: 'code', type: 'none', width: 80 },
                { title: '类别', name: 'ms.id', ifTrans: true, trans: 'SYS_TRANS_MS_CATEGORY', type: 'none', width: 180, ifEnabledTips: true },
                { title: '名称', name: 'nodeName', type: 'none', width: 80, ifEnabledTips: true },
                { title: '规格', name: 'ms.guige', type: 'none', width: 60 },
                { title: '单位', name: 'ms.danwei', type: 'none', ifTrans: true, width: 50 },
                { title: '状态', name: 'detail.state', type: 'none', ifTrans: true, width: 80 },
                { title: '<font color="red">默认进价(可编辑)</font>', name: 'isnull(detail.price, 0)', type: 'none', width: 100 },
                { title: '<font color="red">数量</font>', name: 'isnull(detail.number, 0)', type: 'none', width: 100 },
                { title: '<font color="red">总价(￥)</font>', name: 'isnull(detail.sum, 0)', type: 'none', width: 100 }
            ];
            _ifEdit = true;
            _title = '物资详情<font color="red">(双击条目可进行修改默认进价)</font>';
            if (_attach) {
                _attach.setEnabled(true);
            }
        }
        var _eMS = taskInfo.addPanel({ title: _title }).css('position: relative;border-left:1px solid #e0e0e0;');
        var list = new $.UI.List({
            p: _eMS,
            ifBindID: false,
            ifFixedHeight: false,
            ifEnabledFilter: false,
            aHeader: _msDetailAry,
            loadApi: 'm=SYS_CM_WH&action=getMSDetailForTK&tkId=' + tkId + '&type=PRO_MS_RECEIVE',
            colControls: { header: { css: 'border-top:1px solid #e0e0e0;border-bottom:1px solid #e0e0e0;' } }
        });
        if (_ifEdit) {
            list.evt('onTDDoubleClick', function (obj) { onMSTDDoubleClick(obj, list); });
        }
        if (_order > 2 && gongYingShang) {
            ifCommitForm = true;
            new $.UI.Form({
                p: taskInfo.addPanel({ title: '物资供应商信息' }),
                loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=PRO_SUPPLIER',
                items: [
                    { title: '施工队名称：', name: 'companyName', comType: 'Label', enabled: false, width: 400, group: { width: 700 } },
                    { title: '资质证书编号：', name: 'QCN', comType: 'Label', enable: false, width: 400 },
                    { title: '资质等级：', name: 'QL', comType: 'Label', width: 400 },
                    { title: '法定代表人：', name: 'legalPerson', comType: 'Label', width: 400 },
                    { title: '负责人：', name: 'responsePerson', comType: 'Label', width: 400 },
                    { title: '联系人：', name: 'contact', comType: 'Label', width: 400 },
                    { title: '联系人电话：', name: 'mobilphone', comType: 'Label', width: 400 },
                    //{ title: '附件', name: 'link', comType: 'FileUploader', width: 400, specialFiles: [{ ext: 'jpg', name: '营业执照_' + _fid }, { ext: 'jpg', name: '税务登记_' + _fid }, { ext: 'doc', name: '开户证明_' + _fid }, { ext: 'jpg', name: '法人身份证复印件_' + _fid }, { ext: 'jpg', name: '资质证书_' + _fid }, { ext: 'jpg', name: '安全生产许可证_' + _fid }] },
                    { title: '经营范围：', name: 'business', comType: 'Label', enable: false, width: 400, height: 200 }
                ],
                ifFixedHeight: false,
                foot_h: 0
            }).loadDataByID(gongYingShang);
        }
    }
    function onMSTDDoubleClick(obj, list) {
        var _number = obj.eTr.attr('number'),
            _price = +obj.eTr.attr('price'),
            _detailid = obj.eTr.attr('detailid'),
            _highPrice = obj.eTr.attr('highPrice'),
            _lowPrice = obj.eTr.attr('lowPrice');
        var _fiAry = [
            { name: 'h', title: '最高价', comType: 'Label', ifSubmit: false, text: _highPrice + '￥', group: { name: 'g1', width: 280 } },
            { name: 'l', title: '最低价', comType: 'Label', ifSubmit: false, text: _lowPrice + '￥', group: 'g1' },
            { name: 'price', title: '进价', comType: 'Input', value: _price, dataType: 'double', group: 'g1', req: true }
        ];
        if (popTips) { popTips.remove(); popTips = null; }
        popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-edit', title: '更新物资价格', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 320, ifFixedHeight: false });
        (new $.UI.Form({
            p: popTips.body,
            items: _fiAry, ifFixedHeight: false,
            onSubmit: function (obj) {
                var _value = obj.Data.IValue;
                _value.sum = _value.price * (+_number);
                if (_value.price > +_highPrice) {
                    MConfirm.setWidth(300).show('注意：价格已经超过最高价!').evt('onOk', function () {
                        $.Util.ajax({
                            args: 'm=SYS_TABLE_BASE&table=PRO_MS_RECEIVE_DETAIL&action=updateByID&id=' + _detailid + '&json=' + JSON.stringify(_value),
                            onSuccess: function () {
                                popTips.remove(); popTips = null;
                                list.refresh({}, false, false);
                            }
                        });
                    });
                } else {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_BASE&table=PRO_MS_RECEIVE_DETAIL&action=updateByID&id=' + _detailid + '&json=' + JSON.stringify(_value),
                        onSuccess: function () {
                            popTips.remove(); popTips = null;
                            list.refresh({}, false, false);
                        }
                    });
                }
                return false;
            }
        })).focus();
    }
    function onTaskClick(obj) { 
        var _tg = obj.Target; 
        tkId = _tg.getAttr('id'); 
        gongYingShang = +_tg.getAttr('gongYingShang');
        delayShowInfo(_tg.getAttr('wfId')); 
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