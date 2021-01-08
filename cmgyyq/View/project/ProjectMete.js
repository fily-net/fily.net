$.NameSpace('$View.project');
$View.project.ProjectMete = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, info: null, onSubmitSuccess: _fn };
    var coms = {}, _rVals = [], mainList, _allCost = 0, costP, _idx = new $.nCount(), popTips; _idx.getN();
    var _taskAry = [
        { name: 'id', type: 'attr' },
        { title: '结算项目', name: 'jiSuanId', ifTrans: true, type: 'none', width: 80 },
        { title: '口径', name: 'guiGeId', ifTrans: true, type: 'none', width: 80 },
        { title: '管材', name: 'guanCaiId', ifTrans: true, type: 'none', width: 130 },
        { title: '路面', name: 'luMianId', ifTrans: true, type: 'none', width: 80 },
        //{ title: '单价', name: 'price', type: 'none', width: 80 },
        { title: '<font color="red">数量</font>', name: 'num', type: 'none', width: 100 },
        //{ title: '小计(￥)', name: 'cost', type: 'none', width: 100 },
        { title: '备注', name: 'note', ifEnabledTips: true, type: 'none', width: 100 }
    ];
    var _fiAry = [
        { name: 'jiSuanId', title: '结算项目', comType: 'Select', group: { name: 'g1', width: 280 }, gtID: 520, req: true, sErr: '结算项目必填' },
        { name: 'guiGeId', title: '口径', comType: 'Select', group: 'g1', req: true, sErr: '口径必填' },
        { name: 'guanCaiId', title: '管材', comType: 'Select', group: 'g1', req: true, sErr: '管材必填' },
        { name: 'luMianId', title: '路面', comType: 'Select', group: 'g1', textKey: 'dbo.SYS_TRANS_GT(luMianId)', valueKey: 'luMianId', extFields: ['price'] },
        //{ name: 'price', title: '单价', comType: 'KeyInput', group: { name: 'g2', width: 280 }, dataType: 'double' },
        { name: 'num', title: '数量', comType: 'KeyInput', dataType: 'double', group: 'g1', req: true, sErr: '数量必填' },
        { name: 'note', title: '备注', comType: 'TextArea', group: 'g1' }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _toolAry = [];
        if (+args.info.ifRights) {
            _toolAry = [
                { name: 'save', text: '确认竣工', cn: 'mr10', icon: 'fa-check', onClick: onSave }
            ];
        }
        var comArgs = {
            'root': { title: '工程<font class="c_6">实际</font>量', head_h: 30, icon: 'fa fa-list-alt', cn: 'b0', toolBarSkin: 'mr5 Button-blue', toolBarAry: _toolAry },
            'layout': { min: 200, max: 500, isRoot: 1, start: 340, dir: 'we', dirLock: 1 },
            'mainList': { aHeader: _taskAry, colControls: { header: {} }, onOperateClick: onOperateClick },
            'infoForm': {
                items: _fiAry, foot_h: 38,
                onChange: onFormChange,
                state: 'Insert',
                btnItems: [
                    { name: 'FORM-SYS-SUBMIT', text: '添加工程项', icon: 'fa fa-plus', skin: 'Button-blue', css: 'margin-left:102px;' }
                ],
                onSubmit: onFormSubmit
            }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: {
                type: 'Layout',
                name: 'layout',
                eHead: { type: 'Form', name: 'infoForm' },
                eFoot: { type: 'List', name: 'mainList' }
            }
        }
        if (+args.info.realCost) {
            comArgs.root.toolBarAry = [];
            comArgs.mainList.loadApi = 'm=SYS_TABLE_BASE&action=getByCondition&table=PRO_SC_COST&jsonCondition={"proId": ' + args.proId + ', "type": 1}';
            struct.body = { type: 'List', name: 'mainList' };
        } else {
            _taskAry.unshift({ title: '操作', name: 'o', type: 'operate', width: 60, items: [{ name: 'delete', text: '删除'}] });
            _taskAry.unshift({ type: 'attr', name: 'id' });
            comArgs.mainList.dataSource = [];
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        mainList = coms.mainList;
        costP = coms.root.head.adElm('', 'span').cn('fwb c_6 fs14 tac').css('height:35px;line-height:30px;margin-left:50px;');
    }
    function onOperateClick(obj) {
        var _id = obj.RowId;
        if (obj.Name == 'delete') {
            MConfirm.setWidth(250).show('确定删除该记录！').evt('onOk', function () {
                _allCost -= $.JSON.decode(_rVals[_id]).cost;
                _rVals[_id] = null; delete _rVals[_id]; obj.eTr.r(); obj = null;
            });
        }
    }

    function onSave() {
        if (!_rVals.length) { MTips.show('请先添加实际量条目！', 'warn'); return; }
        MConfirm.setWidth(400).show('确定设置该工程实际量, 保存之后将进入结算流程！').evt('onOk', function () {
            var _fiAry = [
                { name: 'collectTime', title: '收单日', comType: 'Date', group: { name: 'g1', width: 280 } },
                { name: 'state', comType: 'Label', group: 'g1', visibled: false },
                { name: 'issuedTime', title: '下单日', comType: 'Date', group: 'g1' },
                { name: 'deadline', title: '施工期限', comType: 'Date', group: 'g1' },
                { name: 'bTime', title: '开工日期', comType: 'Date', group: 'g1', req: true },
                { name: 'handleTime', title: '办理日', comType: 'Date', req: true, group: 'g1' },
                { name: 'allowTime', title: '许可日', comType: 'Date', req: true, group: 'g1' },
                { name: 'payCost', title: '支付费用', comType: 'KeyInput', dataType: 'double', group: 'g1' }
            ];
            if (popTips) { popTips.remove(); popTips = null; }
            popTips = new $.UI.Tips({
                head_h: 30,
                icon: 'fa fa-edit',
                title: '填写竣工信息',
                comMode: 'x-auto',
                y: 120,
                ifMask: true,
                ifClose: true,
                width: 320,
                ifFixedHeight: false
            });
            (new $.UI.Form({
                p: popTips.body,
                items: _fiAry,
                state: 'Update',
                btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '确认竣工', icon: 'fa fa-check', skin: 'Button-danger', css: 'margin-left:100px;' }],
                submitApi: 'm=SYS_TABLE_BASE&table=PRO_MG&action=updateByID&id=' + args.proId,
                ifFixedHeight: false,
                onSubmitSuccess: function (obj) {
                    var _url = 'm=SYS_CM_PRO&action=saveProjectMete&proId=' + args.proId + '&jsons=' + _rVals.join('\u0002') + '&realCost=' + _allCost;
                    $.Util.ajax({
                        args: _url,
                        onSuccess: function () {
                            MTips.show('提交成功', 'ok');
                            if (popTips) { popTips.remove(); popTips = null; }
                            args.onSubmitSuccess();
                        }
                    });
                }
            }));  //.focus();
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
                //_item.next.setData(_val, _val);
                obj.Form.setExt('price', parseFloat(_val));
                //console.log(obj);
                break;
        }
    }
    function onFormSubmit(obj) {
        var _val = obj.Value, _txt = obj.Data.IText, _cost = (+_val.price) * (+_val.num), _idxVal = _idx.getN();
        if (+_val.typeId == 532) { _cost = -_cost; _val.price = -(+_val.price); }
        _val.cost = _txt.cost = _cost;
        _txt.id = _idxVal;
        _val.type = 1;
        _val.proId = args.proId;
        _val.price = +_val.price;
        _allCost += _cost;
        mainList.insertRow(_txt);
        //costP.h('总价(￥)：' + _allCost.toFixed(2)); obj.Form.reset();
        //console.log(_val);
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