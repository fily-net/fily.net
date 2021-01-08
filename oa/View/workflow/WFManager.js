$.namespace('$View.workflow');
$View.workflow.WFManager = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var wfInfo, idxId, instanceList, formTips;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _aHeader = [
            { name: 'id', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'type', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'depth', type: 'attr' },
            { name: 'nodeName', type: 'none' }
        ];
        var instanceToolBarItems = [
            { value: 'addInstance', text: '新建流程实例', icon: 'icon-compact-add-bold' },
            { value: 'delInstance', text: '删除流程实例', icon: 'icon-compact-minus-bold' }
        ];
        var comArgs = {
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 220, dir: 'we', dirLock: 1 },
            'instanceLayout': { min: 200, max: 500, start: 220, dir: 'we', dirLock: 1 },
            'stateLayout': { min: 200, max: 500, start: 220, dir: 'ns', dirLock: 2 },
            'structTips': { head_h: 38, icon: 'icon-compact-struct', title: '系统流程模版列表', cn: 'b0' },
            'instanceTips': { head_h: 38, icon: 'icon-compact-struct', title: '流程实例列表', cn: 'b0', toolBarSkin: 'Button-default', toolBarAry: [{ name: 'instanceAction', type: 'menu', enabled: false, cn: 'mr5', icon: 'icon-compact-asterisk', items: instanceToolBarItems}], onToolBarMenuClick: onTipsToolBarMenuClick },
            'instanceList': { aHeader: [{ name: 'id', type: 'attr' }, { name: 'nodeName', type: 'none'}], onTDClick: function (obj) { wfInfo.setInstanceId(obj.Target.getAttr('id')); } },
            'wfList': { ifShowIcon: 'type', aHeader: _aHeader, loadApi: 'm=SYS_CM_WF&action=getWFIndex&jsonCondition={"pid":1}', style: 'tree:nodeName', onTDClick: onListClick },
            'wfInfo': { url: 'View/workflow/WorkFlowInfo.js', onLoad: function (view) { wfInfo = view; } }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'rootLayout',
            eHead: {
                type: 'Tips',
                name: 'structTips',
                body: { type: 'List', name: 'wfList' }
            },
            eFoot: {
                type: 'Layout',
                name: 'instanceLayout',
                eHead: {
                    type: 'Tips',
                    name: 'instanceTips',
                    body: { type: 'List', name: 'instanceList' }
                },
                eFoot: { type: 'View', name: 'wfInfo' }
            }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        instanceList = coms["instanceList"];
    }
    function _event() { }
    function _override() { }
    function onListClick(obj) {
        var _tg = obj.Target, _id = _tg.getAttr('id'), _json = _tg.getAttr('json');
        if ((+_tg.getAttr('type'))) {
            idxId = _id;
            coms['instanceTips'].toolBar.setEnabled('instanceAction', true);
            instanceList.loadAjax({
                args: 'm=SYS_CM_WF&action=getWFInstanceByIdxId&idxId=' + idxId,
                cbFn: { onSuccess: function (obj) { if (obj.Data.data[0]) { obj.List.fireClick(0); } else { wfInfo.setInstanceId(-1); } } }
            });
        }
    }

    function onTipsToolBarMenuClick(obj) {
        switch (obj.Value) {
            case 'addInstance':
                $.Util.ajax({
                    args: 'm=SYS_CM_WF&action=addWFInstance&idxId=' + idxId,
                    onSuccess: function () { coms['wfList'].fireClick(idxId, 'ID'); MTips.show('添加成功', 'ok'); }
                });
                break;
            case 'delInstance':
                var _selID = instanceList.getAttr('selID');
                if (_selID) {
                    $.Util.ajax({
                        args: 'm=SYS_CM_WF&action=delWFInstance&instanceID=' + _selID,
                        onSuccess: function () { coms['wfList'].fireClick(idxId, 'ID'); MTips.show('删除成功', 'ok'); }
                    });
                }

                break;
        }
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}