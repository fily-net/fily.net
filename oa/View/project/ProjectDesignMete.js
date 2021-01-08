$.namespace('$View.project');
$View.project.ProjectDesignMete = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, proId: 0, dType: 0, cost: 0, onSubmitSuccess: _fn };
    var mainList, rootBody, _formAry = [], _nCount = new $.nCount();
    var _taskAry = [
        { title: '结算项目', name: 'jiSuanId', ifTrans: true, type: 'none', width: 120 },
        { title: '管材', name: 'guanCaiId', ifTrans: true, type: 'none', width: 180 },
        { title: '口径', name: 'guiGeId', ifTrans: true, type: 'none', width: 100 },
        { title: '<font color="red">数量</font>', name: 'num', type: 'none', width: 100 },
        { title: '备注', name: 'note', ifEnabledTips: true, type: 'none', width: 400 }
    ];
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 35, title: '工程设计量', icon: 'icon-glyph-briefcase', cn: 'b0', onToolBarClick: onToolBarClick },
            'layout': { min: 244, max: 500, isRoot: 1, start: 180, dir: 'ns', dirLock: 2 },
            'mainList': { aHeader: _taskAry, loadApi: 'm=SYS_TABLE_BASE&action=getByCondition&table=PRO_SC_COST&jsonCondition={"proId": ' + args.proId + ', "type": ' + args.dType + '}', colControls: { header: {} } }
        }
        var struct = { p: owner, type: 'Tips', name: 'root' }
        if (args.cost) {
            comArgs.root.toolBarAry = [];
            struct.body = { name: 'mainList', type: 'List' };
        } else {
            comArgs.root.toolBarAry = [{ name: 'save', text: '保存', cn: 'mr20 mt10', skin: 'Button-blue', css: 'margin-top:6px;' }, { name: 'addItem', text: '添加条目', skin: 'Button-default', cn: 'mr10', css: 'margin-top:6px;' }];
        }
        coms = $.layout({ args: comArgs, struct: struct });
        rootBody = coms.root.body;
    }
    function _event() { }
    function _override() { }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'save':
                if (!_formAry.length) { MTips.show('请先选择设计量条目！', 'warn'); return; }
                var _rVals = [];
                for (var i = 0, _len = _formAry.length; i < _len; i++) {
                    if (!_formAry[i]) { continue; }
                    var _data = _formAry[i].check(true), _owner = _formAry[i].get('owner');
                    if (_data[0] != false) {
                        var _val = _data[1].IValue; _val.proId = +args.proId; _val.type = +args.dType;
                        _owner.css('border: 1px solid #E2E2E2;'); _rVals.push($.JSON.encode(_val));
                    } else {
                        _owner.css('border: 1px solid rgb(223, 45, 59);'); return;
                    }
                }
                if (!_rVals.length) { MTips.show('请先选择设计量条目！', 'warn'); return; }
                MConfirm.setWidth(350).show('确定设置该工程设计量, 保存之后将不能再修改！').evt('onOk', function () {
                    var _url = 'm=SYS_CM_PRO&action=saveProjectMete&proId=' + args.proId + '&jsons=' + _rVals.join('\u0002') + '&planCost=100';
                    $.Util.ajax({
                        args: _url,
                        onSuccess: function () {
                            MTips.show('提交成功', 'ok');
                            if ($.global.arrowTips) { $.global.arrowTips.remove(); $.global.arrowTips = null; };
                            args.cost = 100; args.onSubmitSuccess();
                        }
                    });
                });
                break;
            case 'addItem':
                var _fiAry = [
                    { name: 'jiSuanId', title: '项目', comType: 'Select', group: { name: 'g1', width: 260 }, gtID: 620, req: true },
                    { name: 'guanCaiId', title: '管材', comType: 'Select', gtID: 621, group: 'g1', req: true },
                    { name: 'guiGeId', title: '口径', comType: 'Select', gtID: 622, group: 'g1', req: true },
                    { name: 'num', title: '数量', comType: 'KeyInput', group: 'g1', req: true },
                    { name: 'note', title: '备注', comType: 'TextArea', group: 'g1' }
                ];
                var _form = new $.UI.Form({ p: rootBody, idx: _nCount.getN(), css: 'margin:10px;float:left;width:280px;box-shadow: 0 2px 3px #e6e6e6;-webkit-box-shadow: 0 2px 3px #e6e6e6;-moz-box-shadow: 0 2px 3px #e6e6e6;border: 1px solid #E2E2E2;', items: _fiAry, foot_h: 38, ifFixedHeight: false, btnItems: [{ name: 'delItem', text: '删除条目', skin: 'Button-blue', onClick: onDelete, css: 'margin-left:197px;' }] });
                _formAry.push(_form);
                break;
        }
    }
    function onDelete(obj) {
        MConfirm.setWidth(290).show('确定删除该条目').evt('onOk', function () {
            var _from = obj.Form, _idx = _from.get('idx');
            _formAry[_idx] = null; delete _formAry[_idx]; _formAry.length--; _from.remove();
        });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}