$.NameSpace('$View.project');
$View.project.ProjectJieSuanWF = function (j) {
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
                title: '工程外包人工费用结算审核', 
                icon: 'fa fa-ioxhost'
            },
            'wfInfo': { 
                url: 'View/workflow/WorkFlowInfo.js', 
                onNextSuccess: onWFNextSucc, 
                instanceId: args.info.projectJieSuanWfId,
                ifFixedHeight: false,
                ifAttach: false,
                onLoadComplete: function (self) {
                    initForm(self);
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
        
    }

    function onWFComplete(obj) {
        $.Util.ajax({
            args: 'm=SYS_CM_PRO&action=onProjectJieSuanComplete&proId=' + args.info.id + '&proCode=' + args.info.proCode,
            onSuccess: function () {
                args.onSubmitSuccess();
            }
        });
    }

    function onWFNextSucc(obj) {
        /*
        var _node = obj.Node, _users = _node.users;
        if (_users.length > 2) {
            $.Util.ajax({ args: 'm=SYS_CM_OA&action=updateMeetingRights&users=' + _users + '&mid=' + args.mid });
        }*/
    }

    function initForm(obj) {
        var wfInfo = obj.WorkFlowInfo, currNode = obj.currNode;
        var _title = '工程量', 
            _treeOrder = +currNode.treeOrder,
            _ifHasRight = wfInfo.ifHasRight;
        
        if(_treeOrder===1&&_ifHasRight){
            _title = '工程量<span style="color:red;">（双击工程量修改数量）</span>';
        }

        var _mateParent = wfInfo.addPanel({ title: _title }).css('height:auto;position: relative;background-color: #fff;border-left:1px solid #E2E7EB;border-top:1px solid #E2E7EB;').h('<div style="height:35px;border-bottom:1px solid #E2E7EB;border-right:1px solid #E2E7EB;"></div><div></div>');
        var _eBtn = _mateParent.fc();
        var _taskAry = [
            { name: 'id', type: 'attr' },
            { key: 'planNum', name: 'cast(planNum as varchar(10))', type: 'attr' },
            { key: 'realNum', name: 'cast(realNum as varchar(10))', type: 'attr' },
            { key: 'price', name: 'cast(price as varchar(10))', type: 'attr' },
            { title: '结算项目', name: 'jiSuanId', ifTrans: true, type: 'none', width: 120 },
            { title: '管材', name: 'guanCaiId', ifTrans: true, type: 'none', width: 150 },
            { title: '口径', name: 'guiGeId', ifTrans: true, type: 'none', width: 100 },
            { title: '单位', name: 'danWeiId', ifTrans: true, type: 'none', width: 100 },
            { title: '路面', name: 'luMianId', ifTrans: true, type: 'none', width: 80 },
            { title: '<font color="red">设计量</font>', name: 'planNum', type: 'none', width: 100 },
            { title: '<font color="red">实际量</font>', name: 'realNum', type: 'none', width: 100 },
            { title: '备注', name: 'note', ifEnabledTips: true, type: 'none', width: 200 }
        ];
        var list = new $.UI.List({
            p: _eBtn.ns(),
            ifBindID: false,
            ifFixedHeight: false,
            ifEnabledFilter: false,
            aHeader: _taskAry,
            loadApi: 'm=SYS_TABLE_BASE&action=getByCondition&table=PRO_SC_COST&jsonCondition={"proId": ' + args.info.id + '}',
            colControls: { header: { css: 'border-bottom:1px solid #e0e0e0;' } }
        });

        if(_treeOrder===1&&_ifHasRight){
            list.evt('onTDDoubleClick', function (obj) { onMSTDDoubleClick(obj, list); });
            new $.UI.Button({ p: _eBtn, name: 'addMeta', skin: 'Button-s1', text: '添加工程量', onClick: function () { addMeta(list); } });
        }

    }

    /*
    function onFormChange(obj) {
        var _item = obj.FormItem, _name = obj.Name;
        switch (obj.Name) {
            case 'jiSuanId':
            case 'guiGeId':
                _item.next.reset().set('gtID', obj.Value); break;
            case 'guanCaiId':
                _item.next.reset().set('loadApi', 'm=SYS_CM_PRO&&action=loadPrice&guiGeId=' + obj.Value); break;
            case 'luMianId':
                var _val = obj.Args.MenuArgs.data.price||'0';
                //_item.next.setData(_val, _val);
                obj.Form.setHidden('price', parseFloat(_val));
                //console.log(obj);
                break;
        }
    }*/

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
                obj.Form.setHidden('price', parseFloat(_val));
                //_item.next.setData(_val, _val);
                break;
        }
    }

    function addMeta(list) {
        var _fiAry = [
            { name: 'jiSuanId', title: '结算项目', comType: 'Select', group: { name: 'g1', width: 280 }, gtID: 520, req: true, sErr: '结算项目必填' },
            { name: 'guiGeId', title: '口径', comType: 'Select', group: 'g1', req: true, sErr: '口径必填' },
            { name: 'guanCaiId', title: '管材', comType: 'Select', group: 'g1', req: true, sErr: '管材必填' },
            { name: 'luMianId', title: '路面', comType: 'Select', group: 'g1', textKey: 'dbo.SYS_TRANS_GT(luMianId)', valueKey: 'luMianId', extFields: ['price'] },
            //{ name: 'price', title: '单价', comType: 'KeyInput', group: { name: 'g2', width: 280 }, dataType: 'double' },
            { name: 'realNum', title: '数量', comType: 'KeyInput', dataType: 'double', group: 'g1', req: true, sErr: '数量必填' },
            { name: 'note', title: '备注', comType: 'TextArea', group: 'g1' }
        ];


        var _fiAry = [
            { name: 'jiSuanId', title: '结算项目', comType: 'Select', group: { name: 'g1', width: 280 }, gtID: 520, req: true, sErr: '结算项目必填' },
            { name: 'guiGeId', title: '口径', comType: 'Select', group: 'g1', req: true, sErr: '口径必填' },
            { name: 'guanCaiId', title: '管材', comType: 'Select', group: 'g1', req: true, sErr: '管材必填' },
            { name: 'luMianId', title: '路面', comType: 'Select', group: 'g1', textKey: 'dbo.SYS_TRANS_GT(luMianId)', valueKey: 'luMianId', extFields: ['price'] },
            //{ name: 'price', title: '单价', comType: 'KeyInput', group: { name: 'g2', width: 280 }, dataType: 'double' },
            { name: 'realNum', title: '数量', comType: 'KeyInput', dataType: 'double', group: { name: 'g2', width: 280 }, req: true, sErr: '数量必填' },
            { name: 'danWeiId', title: '单位', comType: 'Select', gtID: 233, group: 'g2', req: true },
            { name: 'note', title: '备注', comType: 'TextArea', group: 'g2' }
        ];

        if (popTips) { popTips.remove(); popTips = null; }
        popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-edit', title: '添加工程实际量', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 320, ifFixedHeight: false });
        (new $.UI.Form({
            p: popTips.body,
            items: _fiAry,
            ifFixedHeight: false,
            onChange: onFormChange,
            state: 'Insert',
            btnItems: [
                { name: 'FORM-SYS-SUBMIT', text: '添加工程项', icon: 'fa fa-plus', skin: 'Button-blue', css: 'margin-left:102px;' }
            ],
            onSubmit: function (obj) {
                var _value = obj.Data.IValue,
                    _realNum = +_value.realNum;
                var _price = (+obj.Form.getHidden('price')||0);
                _value.cost = _price * _realNum;
                _value.price = _price;
                _value.type = 1;
                _value.proId = args.info.id;
                //console.log(_value);
                insertMeta(_value, list);
                return false;
            }
        }));
    }

    function insertMeta(value, list) {
        $.Util.ajax({
            args: 'm=SYS_TABLE_BASE&table=PRO_SC_COST&action=addRow&json=' + JSON.stringify(value),
            onSuccess: function () {
                MTips.show('添加成功', 'ok');
                popTips.remove(); popTips = null;
                list.refresh({}, false, false);
            }
        });
    }

    function onMSTDDoubleClick(obj, list) {
        var _id = obj.eTr.attr('id'),
            _planNum = +obj.eTr.attr('planNum'),
            _realNum = obj.eTr.attr('realNum'),
            _price = +obj.eTr.attr('price');

        var _fiAry = [
            { name: 'planNum', title: '设计量', comType: 'Label', ifSubmit: false, text: _planNum, group: { name: 'g1', width: 280 } },
            { name: 'realNum', title: '实际量', comType: 'Input', value: _realNum, dataType: 'double', group: 'g1', req: true }
        ];
        if (popTips) { popTips.remove(); popTips = null; }
        popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-edit', title: '更新工程实际量', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 320, ifFixedHeight: false });
        (new $.UI.Form({
            p: popTips.body,
            items: _fiAry, ifFixedHeight: false,
            onSubmit: function (obj) {
                var _value = obj.Data.IValue,
                    _realNum = +_value.realNum;

                _value.cost = _price * _realNum;
                _value.planCost = _price * _planNum;

                if (_realNum > _planNum*1.2) {
                    MConfirm.setWidth(300).show('注意：实际量已经超过设计量20%!').evt('onOk', function () {
                        submitUpdate(_id, _value, list);
                    });
                } else {
                    submitUpdate(_id, _value, list);
                }
                return false;
            }
        })).focus();
    }

    function submitUpdate(id, value, list) {
        $.Util.ajax({
            args: 'm=SYS_TABLE_BASE&table=PRO_SC_COST&action=updateByID&id=' + id + '&json=' + JSON.stringify(value),
            onSuccess: function () {
                MTips.show('提交成功', 'ok');
                popTips.remove(); popTips = null;
                list.refresh({}, false, false);
            }
        });
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