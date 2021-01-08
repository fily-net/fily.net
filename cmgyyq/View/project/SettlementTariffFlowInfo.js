$.NameSpace('$View.project');
$View.project.SettlementTariffFlowInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, proId: 0, taskId: 0, wfId: 0, accountInfoId: 0, onNextSuccess: _fn };
    var coms = {}, taskInfo, popTips, _formHeadH = 0;
    var _realAry = [
        { name: 'id', type: 'attr' },
        { name: 'cast(cost as varchar(10))', type: 'attr', key: 'cost' },
        { name: 'cast(price as varchar(10))', type: 'attr', key: 'price' },
        { name: 'cast(num as varchar(10))', type: 'attr', key: 'num' },
        { title: '结算项目', name: 'jiSuanId', ifTrans: true, type: 'none', width: 80 },
        { title: '类别', name: 'typeId', ifTrans: true, type: 'none', width: 120 },
        { title: '规格', name: 'guiGeId', ifTrans: true, type: 'none', width: 80 },
        { title: '管材', name: 'guanCaiId', ifTrans: true, type: 'none', width: 130 },
        { title: '路面', name: 'luMianId', ifTrans: true, type: 'none', width: 80 },
        { title: '单价', name: 'price', type: 'none', width: 80 },
        { title: '<font color="red">数量</font>', name: 'num', type: 'none', width: 80, comType: 'KeyInput', dataType: 'double' },
        { title: '小计(￥)', name: 'cost', type: 'none', width: 100 },
        { title: '备注', name: 'note', ifEnabledTips: true, type: 'none', width: 100 }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _wfArgs = { p: owner, url: 'View/workflow/WorkFlowInfo.js', instanceId: args.wfId, onComplete: onWFComplete, onNextSuccess: onWFNextSucc, onLoadComplete: onWfLoadComplete, onRights: onWFRights, onLoad: function (view) { taskInfo = view; } };
        if (!args.taskId) { _wfArgs.ifEdit = false; }
        new $.UI.View(_wfArgs);
    }

    function onWFComplete(obj) {
        MConfirm.setWidth(250).show('流程完成将会修改工程的状态!').evt('onOk', function () {
            $.Util.ajax({ args: 'm=SYS_TABLE_BASE&table=PRO_MG&action=updateByID&json={ "state": 510 }&id=' + args.proId });
        });
    }

    function onWFNextSucc(obj) {
        $.Util.ajax({
            args: 'm=SYS_TABLE_BASE&table=PRO_SC_COST_COUNT&action=updateRights&users=' + obj.Node.owner + '&id=' + args.taskId,
            onSuccess: function () { args.onNextSuccess(); }
        });
    }

    function onWFRights(obj, btnSet, node) {
        _realAry.unshift({ title: '操作', name: 'o', type: 'operate', width: 60, items: [{ name: 'delete', text: '删除'}] });
        _realAry[11].ifEdit = true; _formHeadH = 40;
    }

    function onWfLoadComplete(obj) {
        if (+obj.currNode.treeOrder > 1 && +(args.taskId)) {
            $.Util.ajax({
                args: 'm=SYS_TABLE_BASE&action=getByID&table=PRO_MG&dataType=json&keyFields=proArea, realCost&id=' + args.proId,
                onSuccess: function (obj) {
                    var _vInfo = eval(obj.get(0) || '[]')[0];
                    var _fiAry = [
                        { name: 'inCost', title: '对内结算费', comType: 'KeyInput', dataType: 'double', group: { width: 280, name: 'g1'} },
                        { name: 'faZhanCost', title: '业务发展中心结算费', comType: 'KeyInput', dataType: 'double', group: 'g1' },
                        { name: 'yinYeCost', title: '营业所结算费', comType: 'KeyInput', dataType: 'double', group: 'g1' },
                        { name: 'bateOneCost', title: '按40%结算费', comType: 'KeyInput', dataType: 'double', group: 'g1' },
                        { name: 'bateTwoCost', title: '按8.3结算费', comType: 'KeyInput', dataType: 'double', group: 'g1' },
                        { name: 'proFitCost', title: '利润', comType: 'KeyInput', dataType: 'double', group: 'g1' },
                        { name: 'area', title: '配套面积', comType: 'Label', dataType: 'double', group: 'g1' },
                        { name: 'personCost', title: '外包人工费', comType: 'Label', dataType: 'double', group: 'g1' },
                        { name: 'preCaiLiaoCost', title: '预决算材料费', comType: 'KeyInput', dataType: 'double', group: { width: 280, name: 'g2'} },
                        { name: 'realCaiLiaoCost', title: '实际领用材料费', comType: 'KeyInput', dataType: 'double', group: 'g2' },
                        { name: 'repairCost', title: '路面修理费', comType: 'KeyInput', dataType: 'double', group: 'g2' },
                        { name: 'duJianCost', title: '桥管土建费', comType: 'KeyInput', dataType: 'double', group: 'g2' },
                        { name: 'heTongCost', title: '合同金额', comType: 'KeyInput', dataType: 'double', group: 'g2' },
                        { name: 'prePayCost', title: '预付款', comType: 'KeyInput', dataType: 'double', group: 'g2' },
                        { name: 'backUpOneCost', title: '备用一', comType: 'KeyInput', dataType: 'double', group: 'g2' },
                        { name: 'backUpTwoCost', title: '备用二', comType: 'KeyInput', dataType: 'double', group: 'g2' },
                        { name: 'backUpThreeCost', title: '备用三', comType: 'KeyInput', dataType: 'double', group: 'g2' }
                    ];
                    var _planP = taskInfo.addPanel({ title: '结算工程费用' }).css('height:auto;position: relative;background-color: #fff;border: 1px solid #ededed;border-bottom-color: #d5d5d5;box-shadow: 0 1px 2px #eee;');
                    var _form = (new $.UI.Form({ p: _planP, state: 'Insert', foot_h: _formHeadH, extSubmitVal: { proId: args.proId }, loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=PRO_SC_ACCOUNT_INFO', updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=PRO_SC_ACCOUNT_INFO', insertApi: 'm=SYS_CM_PRO&action=addAccount&taskId=' + args.taskId, items: _fiAry, ifFixedHeight: false, onSubmitSuccess: function (obj) { MTips.show('提交成功', 'ok'); loadFormData(obj.ReturnValue.get(0)); } }));
                    if ((+args.accountInfoId)) { loadFormData(+args.accountInfoId); }
                    _form.items['area'].setData(_vInfo.proArea, _vInfo.proArea + '㎡');
                    _form.items['personCost'].setData(_vInfo.realCost, _vInfo.realCost + '￥');
                    function loadFormData(id) { args.accountInfoId = id; _form.loadDataByID(id, function () { _form.btnSet.items[0].setText('修改费用'); }); }
                }
            });
        }
        var _taskAry = [
            { title: '结算项目', name: 'jiSuanId', ifTrans: true, type: 'none', width: 80 },
            { title: '口径', name: 'typeId', ifTrans: true, type: 'none', width: 120 },
            { title: '管材', name: 'guanCaiId', ifTrans: true, type: 'none', width: 130 },
            { title: '路面', name: 'luMianId', ifTrans: true, type: 'none', width: 80 },
            { title: '单价', name: 'price', type: 'none', width: 80 },
            { title: '<font color="red">数量</font>', name: 'num', type: 'none', width: 100 },
            { title: '小计(￥)', name: 'cost', type: 'none', width: 100 },
            { title: '备注', name: 'note', ifEnabledTips: true, type: 'none', width: 100 }
        ];
        var _fiAry = [
            { name: 'jiSuanId', title: '结算项目', comType: 'Select', group: { name: 'g1', width: 280 }, gtID: 520, req: true, sErr: '结算项目必填' },
            { name: 'guiGeId', title: '口径', comType: 'Select', group: 'g1', req: true, sErr: '口径必填' },
            { name: 'guanCaiId', title: '管材', comType: 'Select', group: 'g1', req: true, sErr: '管材必填' },
            { name: 'luMianId', title: '路面', comType: 'Select', group: 'g1', textKey: 'dbo.SYS_TRANS_GT(luMianId)', valueKey: 'luMianId', extFields: ['price'] },
            { name: 'price', title: '单价', comType: 'KeyInput', group: { name: 'g2', width: 280 }, dataType: 'double' },
            { name: 'num', title: '数量', comType: 'KeyInput', dataType: 'double', group: 'g2', req: true, sErr: '数量必填' },
            { name: 'note', title: '备注', comType: 'TextArea', group: 'g2' }
        ];
        var _planP = taskInfo.addPanel({ title: '工程设计量' }).css('height:200px;position: relative;background-color: #fff;border: 1px solid #ededed;border-bottom-color: #d5d5d5;box-shadow: 0 1px 2px #eee;');
        new $.UI.List({ p: _planP, aHeader: _taskAry, loadApi: 'm=SYS_TABLE_BASE&action=getByCondition&table=PRO_SC_COST&jsonCondition={"proId": ' + args.proId + ', "type": 0}', colControls: { header: { height: 30}} });
        var _realP = taskInfo.addPanel({ title: '工程实际量' }).css('height:355px;position: relative;background-color: #fff;border: 1px solid #ededed;border-bottom-color: #d5d5d5;box-shadow: 0 1px 2px #eee;');
        var _realListP = _realP, _realList;
        if (args.taskId) {
            var _btnAry = [];
            if (+obj.currNode.type !== 11) { _btnAry.push({ name: 'FORM-SYS-SUBMIT', text: '新建条目', skin: 'Button-blue', css: 'margin-left:102px;' }); }
            var _tempL = new $.UI.Layout({ p: _realP, dir: 'we', start: 300, isRoot: true, ifDrag: false, barWidth: 1 }); _realListP = _tempL.eFoot;
            var _form = new $.UI.Form({ p: _tempL.eHead, head_h: 30, extSubmitVal: { proId: args.proId, type: 1 }, title: '新建工程量条目', onChange: onFormChange, submitApi: 'm=SYS_CM_PRO&action=addRealMete', items: _fiAry, foot_h: 40, btnItems: _btnAry, onSubmitSuccess: function () { _form.reset(); _realList.refresh(); } });
            _form.evt('onSubmit', function (obj) {
                var _val = obj.Data.IValue, _cost = (+_val.price) * (+_val.num);
                if (+_val.typeId == 532) { _cost = -_cost; _val.price = -(+_val.price); }
                _form.setExt('cost', _cost);
            });
        }
        _realList = new $.UI.List({ p: _realListP, onOperateClick: onOperateClick, aHeader: _realAry, loadApi: 'm=SYS_TABLE_BASE&action=getByCondition&table=PRO_SC_COST&jsonCondition={"proId": ' + args.proId + ', "type": 1}', onTDUpdate: onTDUpdate, colControls: { header: { height: 30}} });
    }

    function onTDUpdate(obj, value, editTips) {
        var _price = +(obj.eTr.attr('price')), _remainNum = +(obj.eTr.attr('num')), _num = +value.Data.IValue.num, _cost = (_num - _remainNum) * _price;
        $.Util.ajax({
            args: 'm=SYS_CM_PRO&action=updateRealMete&proId=' + args.proId + '&cost=' + _cost + '&id=' + value.id + '&num=' + _num,
            onSuccess: function () { MTips.show('修改成功', 'ok'); editTips.hide(); obj.List.refresh(); }
        });
        return false;
    }

    function onFormChange(obj) {
        var _item = obj.FormItem, _name = obj.Name;
        switch (obj.Name) {
            case 'jiSuanId':
            case 'guiGeId':
                _item.next.reset().set('gtID', obj.Value); break;
            case 'guanCaiId':
                _item.next.reset().set('loadApi', 'm=SYS_CM_PRO&&action=loadPrice&guiGeId=' + obj.Value); break;
            case 'luMianId':
                var _val = obj.Args.MenuArgs.data.price;
                _item.next.setData(_val, _val);
                break;
        }
    }

    function onOperateClick(obj) {
        var _id = obj.RowId, _cost = +obj.eTr.attr('cost');
        if (obj.Name == 'delete') {
            MConfirm.setWidth(250).show('确定删除该记录！').evt('onOk', function () {
                $.Util.ajax({
                    args: 'm=SYS_CM_PRO&action=delRealMete&proId=' + args.proId + '&cost=' + _cost + '&id=' + _id,
                    onSuccess: function () { obj.eTr.r(); MTips.show('删除成功', 'ok'); }
                });
            });
        }
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