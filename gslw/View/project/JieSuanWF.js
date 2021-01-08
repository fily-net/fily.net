$.NameSpace('$View.project');
$View.project.JieSuanWF = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, info: null, onSubmitSuccess: _fn };
    var coms = {}, wfInfo, _msCost = 0, _rgCost = 0, popTips;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div');
        var comArgs = {
            'root': { 
                head_h: 0, 
                foot_h: 0, 
                cn: 'b0', 
                title: '工程费用结算审核', 
                icon: 'fa fa-ioxhost'
            },
            'wfInfo': { 
                url: 'View/workflow/WorkFlowInfo.js', 
                onNextSuccess: onWFNextSucc, 
                instanceId: args.info.jieSuanWfId,
                ifFixedHeight: false,
                ifAttach: false,
                onLoadComplete: function (self) {
                    //initForm(self);
                },
                onRights: onRights,
                onComplete: onWFComplete
            }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: { name: 'wfInfo', type: 'View' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
    }

    function onRights(wfInfo, toolBar, currNode, parentNode) {
        var _order = +currNode.treeOrder;
        $.Util.ajax({
            args: 'm=SYS_CM_PRO_REPORT&action=getProjectMSDetail&dataType=json&proId=' + args.info.id,
            onSuccess: function (obj) {
                var _costParent = wfInfo.addPanel({ title: '工程总费用' }).css('height:auto;position: relative;background-color: #fff;');
                var _msparent = wfInfo.addPanel({ title: '物资费用结算详情' }).css('height:auto;position: relative;background-color: #fff;');
                var _jiesuanparent = wfInfo.addPanel({ title: '人工费用结算详情' }).css('height:auto;position: relative;background-color: #fff;');
                for (var i = 1, _len = obj.data.length; i < _len; i = i + 2) {
                    var _dataAry = eval(obj.data[i] || '[]'), _count = eval(obj.data[i + 1] || '[]')[0];
                    if (_count) {
                        addGongYingShang(_msparent, _dataAry, _count);
                    }
                }
                //addProjectMeta(_jiesuanparent, 0);
                addProjectMeta(_jiesuanparent, _order, eval(obj.data[obj.data.length - 1] || '[]')[0]);
                _msCost = (+_msCost).toFixed(2);
                _rgCost = (+_rgCost).toFixed(2);
                var _allCost = _msCost + _rgCost;
                _costParent.h('<span class="tag">工程总费用（' + _allCost + '￥）</span> <span class="tag">=</span> <span class="tag">物资总费用（' + _msCost + '￥）</span>  <span class="tag">\+</span> <span class="tag">人工总费用（' + _rgCost + '￥）</span>');
            }
        });
    }

    function addProjectMeta(parent, order, cost) {
        _rgCost = cost.cost;
        var _title = '<div class="info-title">工程量'+(order===1?'【双击可以编辑单价】':'')+'</div><span class="info-tag">【实际人工费用：' + cost.cost + '￥】</span><span class="info-tag">【设计量费用：' + cost.planCost + '￥】</span>';
        var _taskAry = [
            { name: 'id', type: 'attr' },
            { key: 'price', name: 'cast(price as varchar(10))', type: 'attr' },
            { key: 'planNum', name: 'cast(planNum as varchar(10))', type: 'attr' },
            { key: 'realNum', name: 'cast(realNum as varchar(10))', type: 'attr' },
            { title: '结算项目', name: 'jiSuanId', ifTrans: true, type: 'none', width: 120 },
            { title: '管材', name: 'guanCaiId', ifTrans: true, type: 'none', width: 150 },
            { title: '口径', name: 'guiGeId', ifTrans: true, type: 'none', width: 100 },
            { title: '单位', name: 'danWeiId', ifTrans: true, type: 'none', width: 100 },
            { title: '路面', name: 'luMianId', ifTrans: true, type: 'none', width: 80 },
            { title: '单价', name: 'price', type: 'none', width: 80 },
            { title: '<font color="red">设计量</font>', name: 'planNum', type: 'none', width: 100 },
            { title: '<font color="red">设计量</font>', name: 'realNum', type: 'none', width: 100 },
            { title: '设计量小计(￥)', name: 'planCost', type: 'none', width: 100 },
            { title: '实际量小计(￥)', name: 'cost', type: 'none', width: 100 },
            { title: '备注', name: 'note', ifEnabledTips: true, type: 'none', width: 200 }
        ];
        var _div = parent.adElm('', 'div').h('<div class="panel-head">' + _title + '</div><div class="panel-body"><div style="border-top: 1px solid #DDDDDD;border-left: 1px solid #DDDDDD;"></div></div>').cn('info-panel').css('margin: 10px 0px;');
        var _eDetail = $(_div.lastChild.firstChild);
        var list = new $.UI.List({
            p: _eDetail,
            ifBindID: false,
            ifFixedHeight: false,
            ifEnabledFilter: false,
            aHeader: _taskAry,
            loadApi: 'm=SYS_TABLE_BASE&action=getByCondition&table=PRO_SC_COST&jsonCondition={"proId": ' + args.info.id + ', "type": 0}',
            colControls: { header: { css: 'border-bottom:1px solid #e0e0e0;' } }
        });
        if (order === 1) {
            list.evt('onTDDoubleClick', function (obj) { onMSTDDoubleClick(obj, list); });
        }
    }

    var _msDetailAry = [
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
        { title: '<font color="red">进价(￥)</font>', name: 'isnull(detail.price, 0)', type: 'none', width: 80 },
        { title: '<font color="#21b384">实用</font>', name: 'isnull(detail.used, 0)', type: 'none', width: 60 },
        { title: '<font color="#21b384">实用总价(￥)</font>', name: 'isnull(detail.usedSum, 0)', type: 'none', width: 100 },
        { title: '<font color="red">退料</font>', name: 'isnull(detail.notUsed, 0)', type: 'none', width: 60 },
        { title: '<font color="red">退料总价(￥)</font>', name: 'isnull(detail.notUsedSum, 0)', type: 'none', width: 100 },
        { title: '<font color="#E49E0D">领料</font>', name: 'isnull(detail.number, 0)', type: 'none', width: 60 },
        { title: '<font color="#E49E0D">领料总价(￥)</font>', name: 'isnull(detail.sum, 0)', type: 'none', width: 100 }
    ];

    function addGongYingShang(parent, dataAry, count) {
        var _cpn = dataAry[0], _bodyHtml = '';
        _msCost += +count.cost;
        var _div = parent.adElm('', 'div').h('<div class="panel-head"><div class="info-title">物资供应商：' + _cpn.gys + '</div><span class="info-tag">【计划费用：' + count.cost + '￥】</span><span class="info-tag">【实际费用(计划-退料)：' + count.realCost + '￥】</span></div><div class="panel-body"><ul></ul></div>').cn('info-panel').css('margin: 10px 0px;');
        var _eDetail = $(_div.lastChild.firstChild);
        for (var i = 0, _len = dataAry.length; i < _len; i++) {
            var _item = dataAry[i], _backCost = (+_item.cost - +_item.realCost).toFixed(2);
            var _liHtml = '<div class="i-head"><img class="avatar" src="api.aspx?m=SYS_CM_USERS&action=getAvatar&uid=' + _item.cPerson + '" /><span class="avatar-text">领料申请人/时间：' + _item.createPerson + '   ' + _item.createTIme + '</span><div class="item">领料单号：' + _item.code + '</div><div class="item">领料金额(' + _item.cost + '￥) = 实用金额(' + _item.realCost + ')￥ \+ 退料金额(' + _backCost + '￥)</div></div><div class="i-body"></div>';
            var _eList = _eDetail.adElm('', 'li').cn('item-detail').h(_liHtml).fc().ns();
            var list = new $.UI.List({
                p: _eList,
                ifBindID: false,
                ifFixedHeight: false,
                ifEnabledFilter: false,
                aHeader: _msDetailAry,
                loadApi: 'm=SYS_CM_WH&action=getMSDetailForTK&tkId=' + _item.id + '&type=PRO_MS_RECEIVE',
                colControls: { header: { css: 'border-bottom:1px solid #e0e0e0;' } }
            });
        }
    }

    function onWFComplete(obj) {
        $.Util.ajax({
            args: 'm=SYS_CM_PRO&action=onJieSuanComplete&proId=' + args.info.id,
            onSuccess: function () {
                args.onSubmitSuccess();
            }
        });
        /*
        MConfirm.setWidth(350).show('工程结算审批流程完成将进入已结！').evt('onOk', function () {
            
        });*/
    }

    function onWFNextSucc(obj) {
        /*
        var _node = obj.Node, _users = _node.users;
        if (_users.length > 2) {
            $.Util.ajax({ args: 'm=SYS_CM_OA&action=updateMeetingRights&users=' + _users + '&mid=' + args.mid });
        }*/
    }

    function onMSTDDoubleClick(obj, list) {
        var _detailid = +obj.eTr.attr('id'),
            _price = +obj.eTr.attr('price'),
            _realNum = +obj.eTr.attr('realNum'),
            _planNum = +obj.eTr.attr('planNum');
        var _fiAry = [
            { name: 'planNum', title: '设计量', comType: 'Label', ifSubmit: false, text: _planNum, group: { name: 'g1', width: 280 } },
            { name: 'realNum', title: '实际量', comType: 'Label', ifSubmit: false, text: _realNum, group: 'g1' },
            { name: 'price', title: '结算单价', comType: 'Input', value: _price, dataType: 'double', group: 'g1', req: true, sErr: '结算单价是必填字段!' }
        ];
        if (popTips) { popTips.remove(); popTips = null; }
        popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-edit', title: '更新结算单价', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 320, ifFixedHeight: false });
        (new $.UI.Form({
            p: popTips.body,
            items: _fiAry, ifFixedHeight: false,
            onSubmit: function (obj) {
                var _value = obj.Data.IValue;
                _value.planCost = _value.price * _planNum;
                _value.cost = _value.price * _realNum;

                $.Util.ajax({
                    args: 'm=SYS_TABLE_BASE&table=PRO_SC_COST&action=updateByID&id=' + _detailid + '&json=' + JSON.stringify(_value),
                    onSuccess: function () {
                        popTips.remove(); popTips = null;
                        list.refresh({}, false, false);
                    }
                });

                return false;
            }
        })).focus();
    }

    function initForm(obj) {
        var wfInfo = obj.WorkFlowInfo;
        if (wfInfo.attach) {
            if (+obj.currNode.type == 10 && wfInfo.ifHasRight) {
                wfInfo.attach.setEnabled(true);
            } else {
                wfInfo.attach.setEnabled(false);
            }
        }
        if (+obj.currNode.treeOrder > 2) {
            var _fiAry = [
                    { name: 'inCost', title: '对内结算费', comType: 'Label', group: { width: 280, name: 'g1' } },
                    { name: 'faZhanCost', title: '业务发展中心结算费', comType: 'Label', group: 'g1' },
                    { name: 'yinYeCost', title: '营业所结算费', comType: 'Label', group: 'g1' },
                    { name: 'bateOneCost', title: '按40%结算费', comType: 'Label', group: 'g1' },
                    { name: 'bateTwoCost', title: '按8.3结算费', comType: 'Label', group: 'g1' },
                    { name: 'proFitCost', title: '利润', comType: 'Label', group: 'g1' },
                    { name: 'area', title: '配套面积', comType: 'Label', group: 'g1' },
                    { name: 'personCost', title: '外包人工费', comType: 'Label', group: 'g1' },
                    { name: 'preCaiLiaoCost', title: '预决算材料费', comType: 'Label', group: { width: 280, name: 'g2' } },
                    { name: 'realCaiLiaoCost', title: '实际领用材料费', comType: 'Label', group: 'g2' },
                    { name: 'repairCost', title: '路面修理费', comType: 'Label', group: 'g2' },
                    { name: 'duJianCost', title: '桥管土建费', comType: 'Label', group: 'g2' },
                    { name: 'heTongCost', title: '合同金额', comType: 'Label', group: 'g2' },
                    { name: 'prePayCost', title: '预付款', comType: 'Label', group: 'g2' },
                    { name: 'backUpOneCost', title: '备用一', comType: 'Label', group: 'g2' },
                    { name: 'backUpTwoCost', title: '备用二', comType: 'Label', group: 'g2' },
                    { name: 'backUpThreeCost', title: '备用三', comType: 'Label', group: 'g2' }
            ];
            var _planP = wfInfo.addPanel({ title: '工程结算费用' }).css('height:auto;position: relative;background-color: #fff;border: 1px solid #ededed;border-bottom-color: #d5d5d5;box-shadow: 0 1px 2px #eee;');
            var _form = (new $.UI.Form({
                p: _planP,
                foot_h: 0,
                items: _fiAry,
                ifFixedHeight: false
            }));
            _form.loadDataByWhereCondition('m=SYS_TABLE_BASE&action=getByCondition&table=PRO_SC_ACCOUNT_INFO&jsonCondition={"proId":' + args.proId + '}', function (obj) {

            });
        }
    }

    function onClick() {
        args.pmInfo.fireTabClick('files');
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