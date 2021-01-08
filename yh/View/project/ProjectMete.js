$.NameSpace('$View.project');
$View.project.ProjectMete = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, proId: 0, dType: 0, cost: 0, wfIdx: 108, onSubmitSuccess: _fn };
    var coms = {}, _rVals = [], mainList, _allCost = 0, costP, _idx = new $.nCount(); _idx.getN();
    var _taskAry = [
        { name: 'id', type: 'attr' },
        { title: '结算项目', name: 'jiSuanId', ifTrans: true, type: 'none', width: 80 },
        { title: '口径', name: 'guiGeId', ifTrans: true, type: 'none', width: 80 },
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
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 35, icon: 'icon-glyph-briefcase', cn: 'b0', toolBarSkin: 'mr5 Button-blue', toolBarAry: [{ name: 'save', text: '保存', cn: 'mr20', onClick: onSave}] },
            'layout': { min: 190, max: 500, isRoot: 1, start: 210, dir: 'ns', dirLock: 2 },
            'mainList': { aHeader: _taskAry, colControls: { header: {} }, onOperateClick: onOperateClick },
            'infoForm': { items: _fiAry, foot_h: 38, onChange: onFormChange, btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '添加工程量', icon: 'icon-glyph-hand-right', skin: 'Button-default', css: 'margin-left:102px;'}], onSubmit: onFormSubmit }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: {
                type: 'Layout',
                name: 'layout',
                eHead: { type: 'List', name: 'mainList' },
                eFoot: { type: 'Form', name: 'infoForm' }
            }
        }
        if (args.cost) {
            comArgs.root.toolBarAry = [];
            comArgs.mainList.loadApi = 'm=SYS_TABLE_BASE&action=getByCondition&table=PRO_SC_COST&jsonCondition={"proId": ' + args.proId + ', "type": ' + args.dType + '}';
            struct.body = { type: 'List', name: 'mainList' };
        } else {
            _taskAry.unshift({ title: '操作', name: 'o', type: 'operate', width: 60, items: [{ name: 'delete', text: '删除'}] });
            _taskAry.unshift({ type: 'attr', name: 'id' });
            comArgs.mainList.dataSource = [];
        }
        if (args.dType) {
            comArgs.root.title = '工程<font class="c_6">实际</font>量';
            comArgs.root.toolBarAry[0].text = '发起分包费用结算流程';
            _fiAry[4].comType = 'KeyInput';
        } else {
            comArgs.root.title = '工程设计量';
            _fiAry[4].comType = 'Label';
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        mainList = coms.mainList; costP = coms.root.head.adElm('', 'span').cn('fwb c_6 fs14 tac').css('height:35px;line-height:30px;margin-left:50px;');
    }
    function onOperateClick(obj) {
        var _id = obj.RowId;
        if (obj.Name == 'delete') {
            MConfirm.setWidth(250).show('确定删除该记录！').evt('onOk', function () {
                console.log($.JSON.decode(_rVals[_id]));
                _allCost -= $.JSON.decode(_rVals[_id]).cost;
                _rVals[_id] = null; delete _rVals[_id]; obj.eTr.r(); obj = null;
            });
        }
    }

    function onSave() {
        if (!_rVals.length) { MTips.show('请先添加实际量条目！', 'warn'); return; }
        MConfirm.setWidth(400).show('确定设置该工程实际量, 保存之后可在流程中进行再修改！').evt('onOk', function () {
            var _url = 'm=SYS_CM_PRO&action=saveProjectMete&proId=' + args.proId + '&jsons=' + _rVals.join('\u0002') + '&realCost=' + _allCost;
            if (args.dType) { _url += '&wfIdx=' + args.wfIdx; } else { _url += '&planCost=' + _allCost; }
            $.Util.ajax({
                args: _url,
                onSuccess: function () {
                    MTips.show('提交成功', 'ok'); args.onSubmitSuccess();
                    if ($.global.arrowTips) { $.global.arrowTips.remove(); $.global.arrowTips = null; }
                }
            });
        });
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
    function onFormSubmit(obj) {
        var _val = obj.Data.IValue, _txt = obj.Data.IText, _cost = (+_val.price) * (+_val.num), _idxVal = _idx.getN();
        if (+_val.typeId == 532) { _cost = -_cost; _val.price = -(+_val.price); }
        _val.cost = _txt.cost = _cost; _txt.id = _idxVal; _val.type = args.dType; _val.proId = args.proId; _val.price = +_val.price;
        _allCost += _cost;
        mainList.insertRow(_txt);
        costP.h('总价(￥)：' + _allCost.toFixed(2)); obj.Form.reset();
        _rVals[_idxVal] = $.JSON.encode(_val);
        return false;
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