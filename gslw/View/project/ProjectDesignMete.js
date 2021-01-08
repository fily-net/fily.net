$.NameSpace('$View.project');
$View.project.ProjectDesignMete = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, info: null, proId: 0, proList: null, onSubmitSuccess: _fn };
    var coms = {}, mainList, rootBody, _formAry = [], popTips;
    var _taskAry = [
        { name: 'id', type: 'attr' },
        { type: 'checkbox', width: 50 },
        { title: '结算项目', name: 'jiSuanId', ifTrans: true, type: 'none', width: 120 },
        { title: '管材', name: 'guanCaiId', ifTrans: true, type: 'none', width: 180 },
        { title: '口径', name: 'guiGeId', ifTrans: true, type: 'none', width: 100 },
        { title: '单位', name: 'danWeiId', ifTrans: true, type: 'none', width: 100 },
        { title: '<font color="red">设计量</font>', name: 'planNum', type: 'none', width: 100 },
        { title: '备注', name: 'note', ifEnabledTips: true, type: 'none', width: 400 }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 35, title: '工程设计量', icon: 'fa fa-list-alt', cn: 'b0', gbsID: 158, onToolBarClick: onToolBarClick },
            'mainList': { aHeader: _taskAry, loadApi: 'm=SYS_TABLE_BASE&action=getByCondition&table=PRO_SC_COST&jsonCondition={"proId": ' + args.proId + ', "type": 0}', colControls: { header: {}} }
        }
        var struct = {
            p: owner, type: 'Tips', name: 'root',
            body: {
                type: 'List', name: 'mainList'
            }
        }
        if (+args.info.planCost) {
            comArgs.root.toolBarAry = [];
        } else {
            comArgs.root.toolBarAry = [
                { name: 'save', text: '保存设计量', cn: 'mr5 mt10', skin: 'Button-s1', icon: 'fa-save', css: 'margin-top:4px;' }
            ];
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        mainList = coms.mainList;
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'save':
                var _len = 1;
                if (!_len) { MTips.show('请先选择设计量条目！', 'warn'); return; }
                MConfirm.setWidth(350).show('确定设置该工程设计量, 保存之后将不能再修改！').evt('onOk', function () {
                    var _url = 'm=SYS_CM_PRO&action=saveProjectDesignMete&proId=' + args.proId + '&proCode=' + args.proCode + '&proType=' + args.info.proType;
                    $.Util.ajax({
                        args: _url,
                        onSuccess: function () {
                            MTips.show('保存成功', 'ok');
                            args.onSubmitSuccess();
                        }
                    });
                });
                break;
            case '159':
                var _fiAry = [
                    { name: 'jiSuanId', title: '项目', comType: 'Select', group: { name: 'g1', width: 260 }, gtID: 620, req: true },
                    { name: 'guanCaiId', title: '管材', comType: 'Select', gtID: 621, group: 'g1' },
                    { name: 'guiGeId', title: '口径', comType: 'Select', gtID: 622, group: 'g1' },
                    { name: 'planNum', title: '数量', comType: 'KeyInput', dataType: 'int', group: 'g1', req: true },
                    { name: 'danWeiId', title: '单位', comType: 'Select', gtID: 233, group: 'g1', req: true },
                    { name: 'note', title: '备注', comType: 'TextArea', group: 'g1' }
                ];

                var _fiAry = [
                    { name: 'jiSuanId', title: '结算项目', comType: 'Select', group: { name: 'g1', width: 280 }, gtID: 520, req: true, sErr: '结算项目必填' },
                    { name: 'guiGeId', title: '口径', comType: 'Select', group: 'g1', req: true, sErr: '口径必填' },
                    { name: 'guanCaiId', title: '管材', comType: 'Select', group: 'g1', req: true, sErr: '管材必填' },
                    { name: 'luMianId', title: '路面', comType: 'Select', group: 'g1', textKey: 'dbo.SYS_TRANS_GT(luMianId)', valueKey: 'luMianId', extFields: ['price'] },
                    //{ name: 'price', title: '单价', comType: 'KeyInput', group: { name: 'g2', width: 280 }, dataType: 'double' },
                    { name: 'planNum', title: '数量', comType: 'KeyInput', dataType: 'double', group: { name: 'g2', width: 280 }, req: true, sErr: '数量必填' },
                    { name: 'danWeiId', title: '单位', comType: 'Select', gtID: 233, group: 'g2', req: true },
                    { name: 'note', title: '备注', comType: 'TextArea', group: 'g2' }
                ];

                if (popTips) { popTips.remove(); popTips = null; }
                popTips = new $.UI.Tips({
                    head_h: 30, icon: 'fa fa-plus',
                    title: '添加项目', comMode: 'x-auto', y: 120,
                    ifMask: true, ifClose: true, width: 320,
                    ifFixedHeight: false
                });
                (new $.UI.Form({
                    p: popTips.body,
                    state: 'Insert',
                    insertApi: 'm=SYS_TABLE_BASE&table=PRO_SC_COST&action=addRow',
                    extSubmitVal: {
                        proId: args.proId
                    },
                    items: _fiAry,
                    ifFixedHeight: false,
                    onChange: onFormChange,
                    onSubmitBefore: function (obj) {
                        var _value = obj.Data.IValue,
                            _planNum = +_value.planNum;
                        var _price = +obj.Form.getExt('price') || 0;
                        _value.type = 0;
                        _value.planCost = _price * _planNum;
                    },
                    onSubmitSuccess: function () {
                        popTips.remove(); popTips = null;
                        MTips.show('添加成功', 'ok');
                        mainList.refresh({ onSuccess: function (obj) { obj.List.fireClick(0); } }, false, false);
                    }
                }));
                break;
            case '160':
                var _ids = mainList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择要删除的行', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除' + _ids.length + '条记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_TREE&table=PRO_SC_COST&action=deleteByIDs&ids=' + _ids.join(','),
                        onSuccess: function () {
                            MTips.show('删除成功', 'ok');
                            mainList.refresh({ onSuccess: function (obj) { obj.List.fireClick(0); } });
                        }
                    })
                });
                break;
        }
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
                obj.Form.setExt('price', parseFloat(_val));
                //_item.next.setData(_val, _val);
                break;
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