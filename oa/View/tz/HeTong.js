$.namespace('$View.tz');
$View.tz.HeTong = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, gtRootID: 163 }, popTips, infoView, currHTId;
    var typeTab, mainList, currState, tgt = { 90: 179, 81: 180, 96: 181 };
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var hAry = [
            { title: '选择', name: 'choose', type: 'checkbox', width: 45 },
            { name: 'id', type: 'attr' },
            { name: 'wfId', type: 'attr' },
            { name: 'state', type: 'attr' },
            { title: '扫描码', name: 'scanCode', type: 'none', width: 120, ifFilter: true, filterItems: ['like'] },
            { title: '合同编号', name: 'htCode', type: 'none', width: 100, ifFilter: true, filterItems: ['like'] },
            { title: '<font color="red">流程状态</font>', name: 'state', type: 'operate', items: [{ text: '{0}{1}dbo.SYS_TRANS_WF_STATE(wfId){1}{0}', name: '{0}{1}cast(wfId as varchar(15)){1}{0}'}], width: 130 },
            { title: '履行状态', name: 'state', ifTrans: true, type: 'select', width: 80, gtID: 189, ifFilter: true, filterItems: ['equal'] },
            { title: '合同类型', name: 'htType', ifTrans: true, trans: 'SYS_TRANS_WFIDX', type: 'none', width: 80 },
            { title: '标签', name: 'htTag', ifTrans: true, trans: 'SYS_TRANS_GTS', type: 'none', width: 100 },
            { title: '合同名称', ifEnabledTips: true, name: 'htName', type: 'none', width: 100 },
            { title: '签约地点', name: 'htAddress', ifTrans: true, type: 'select', width: 100, gtID: 190, ifFilter: true, filterItems: ['equal'] },
            { title: '签约单位', ifEnabledTips: true, name: 'htCompany', ifTrans: true, trans: 'SYS_TRANS_CPN', type: 'select', loadApi: 'm=SYS_TABLE_BASE&action=getByCondition&orderCol=cTime&table=TZ_COOPERATION', width: 100, ifFilter: true, filterItems: ['equal'] },
            { title: '合同标的', name: 'htValue1', type: 'none', width: 100 },
            { title: '合同标的(万元)', name: 'htValue2', type: 'none', width: 100 },
            { title: '会签时间', name: 'htSignTime', type: 'date', width: 130 },
            { title: '履行时间', name: 'htRunTime', type: 'none', width: 150 },
            { title: '履行跟踪部门', name: 'htRunDept', ifTrans: true, trans: 'SYS_TRANS_ROLE', type: 'select', loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid":"3"}', width: 80, ifFilter: true, filterItems: ['equal'] },
            { title: '变更情况', name: 'htChangeNote', type: 'none', width: 120 },
            { title: '争议情况', name: 'htArgNote', type: 'none', width: 120 },
            { title: '备注', name: 'note', type: 'none', width: 100 }
        ];
        var comArgs = {
            'rootLayout': { min: 300, max: 500, isRoot: 1, start: 375, dir: 'ns', dirLock: 2 },
            'rootDiv': { head_h: 34 },
            'typeTab': { items: [{ name: 'all', text: '所有合同', type: 'tab'}], loadApi: 'm=SYS_CM_WF&action=getWFIndex&jsonCondition={"pid":73}', btnType: 'tab', skin: 'ButtonSet-tab fl', itemSkin: 'Button-tab', onClick: onTypeClick },
            'toolTab': { gbsID: 36, ifRights: true, itemAlign: 'right', skin: 'ButtonSet-default mr10', onClick: onToolClick },
            'mainList': { aHeader: hAry, ifEnabledFilter: true, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onTDClick: onListClick },
            'infoView': { url: 'View/workflow/WorkFlowInfo.js', onNextSuccess: onWFNextSucc, onLoad: function (view, self) { infoView = view; }, onComplete: function () { changeWFState(194, function () { }); }, onLoadComplete: onWFComplete }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'rootLayout',
            eHead: {
                type: 'BaseDiv',
                name: 'rootDiv',
                head: [
                    { name: 'typeTab', type: 'ButtonSet' },
                    { name: 'toolTab', type: 'ButtonSet' }
                ],
                body: { type: 'List', name: 'mainList' }
            },
            eFoot: { name: 'infoView', type: 'View' }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        typeTab = coms.typeTab; mainList = coms.mainList; typeTab.fireClick(0);
    }
    function _event() { }
    function _override() { }
    function onWFNextSucc(obj) {
        $.Util.ajax({
            args: 'm=SYS_TABLE_BASE&action=updateRights&table=TZ_HT&users=' + obj.Node.owner + '&id=' + currHTId,
            onSuccess: function () { mainList.refresh(); }
        });
    }

    function changeWFState(state, succ) {
        $.Util.ajax({
            args: 'm=SYS_CM_TZ&action=changeHTState&htId=' + currHTId + '&state=' + state,
            onSuccess: function () { mainList.refresh(); succ(); }
        });
    }

    function onWFComplete(obj) {
        if (obj.currNode && +obj.currNode.type == 11 && currState != 195) {
            obj.Tips.toolBar.evt('onClick', function (obj) {
                MConfirm.setWidth(250).show('确认结束履行合同?').evt('onOk', function () {
                    changeWFState(195, function () { obj.Button.hide(); MTips.show('确认成功', 'warn'); });
                });
            }).clear().loadApi('m=SYS_CM_USERS&action=getRightsToolBars&pid=' + 37, false, 'normal', null, 'nodeName as text, nodeName as nn, id as name, icon, btnType as type');
        } else {
            obj.Tips.toolBar.clear();
        }
    }
    function onTypeClick(obj) {
        var _name = obj.Name, _jcObj = {}, _jc = '';
        if (!isNaN(+_name)) { _jcObj.htType = _name; }
        _jc = $.JSON.encode(_jcObj);
        if (_jc != '{}') { _jc = '&jsonCondition=' + _jc; } else { _jc = ''; }
        mainList.loadAjax({ args: 'm=SYS_TABLE_BASE&table=TZ_HT&action=pagingForRightsWFList' + _jc, cbFn: { onSuccess: function (obj) { if (obj.Length) { mainList.fireClick(0); } else { delayShowInfo(-1); } } } });
    }
    function onListClick(obj) { var _tg = obj.Target; currHTId = _tg.getAttr('id'); currState = +_tg.getAttr('state'); delayShowInfo(_tg.getAttr('wfId')); }
    function onToolClick(obj) {
        if (obj.Name == 'toNormal') { new $.UI.View({ p: args.p, url: 'View/pm/IndexNormal.js' }); return; }
        switch (+obj.Name) {
            case 40: //新建项目
                var infoAry = [
                    { name: 'scanCode', comType: 'ScanCode', title: '扫描码', group: { name: 'g1', width: 320} },
                    { name: 'htName', comType: 'Input', title: '合同名称', group: 'g1', req: true, sErr: '合同名称必填' },
                    { name: 'htCode', comType: 'Input', title: '合同编号', group: 'g1', req: true, sErr: '合同编号必填' },
                    { name: 'htType', comType: 'Select', title: '合同类型', loadApi: 'm=SYS_CM_WF&action=getWFIndex&jsonCondition={"pid":73}', group: 'g1', req: true, sErr: '合同类型必填' },
                    { name: 'htTag', comType: 'MultiSelect', title: '合同类别', group: 'g1' },
                    { name: 'htAddress', comType: 'Select', title: '签约地点', gtID: 190, group: 'g1', req: true, sErr: '签约地点必填' },
                    { name: 'htCompany', comType: 'Select', title: '签约单位', textKey: 'companyName', popWidth: 280, loadApi: 'm=SYS_TABLE_BASE&action=getByCondition&orderCol=cTime&table=TZ_COOPERATION', group: 'g1', req: true, sErr: '签约单位必填' },
                    { name: 'htValue1', comType: 'KeyInput', dataType: 'float', title: '合同标的', group: 'g1' },
                    { name: 'htValue2', comType: 'Label', text: '按实结算', title: '合同标的(万)', dataType: 'double', group: 'g1' },
                    { name: 'htSignTime', comType: 'Date', title: '会签时间', group: { name: 'g2', width: 320 }, req: true, sErr: '会签时间必填' },
                    { name: 'htRunBTime', comType: 'Date', title: '履行开始时间', group: 'g2', req: true, sErr: '开始时间必填' },
                    { name: 'htRunETime', comType: 'EndDate', matchItem: 'htRunBTime', title: '履行结束时间', group: 'g2', req: true, sErr: '结束时间必填' },
                    { name: 'htRunDept', comType: 'Select', title: '履行跟踪部门', loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid":"3"}', group: 'g2', req: true, sErr: '履行跟踪部门必填' },
                    { name: 'htChangeNote', comType: 'Input', title: '变更情况', group: { name: 'g2', width: 320} },
                    { name: 'htArgNote', comType: 'Input', title: '争议情况', group: 'g2' },
                    { name: 'note', comType: 'TextArea', title: '备注', height: 80, group: { name: 'g2', width: 320} }
                ], _sCode = getBarCodeString();
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建合同', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 640, ifFixedHeight: false });
                popTips.Form = new $.UI.Form({ p: popTips.body, insertApi: 'm=SYS_CM_TZ&action=newHeTong', items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; mainList.refresh({ onSuccess: function (obj) { obj.List.fireClick(0); } }, true, true); }, onChange: onFormChange });
                popTips.Form.items[0].setData(_sCode, _sCode);
                break;
            case 41: //删除项目
                var _ids = mainList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择要删除的行', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除' + _ids.length + '条记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_TREE&table=TZ_HT&action=deleteByIDs&ids=' + _ids.join(','),
                        onSuccess: function () { MTips.show('删除成功', 'ok'); mainList.refresh(); onLoadTypeSuccess(); }
                    })
                });
                break;
            case 42: //管理对照表
                popTips = new $.UI.Tips({ width: 700, height: 500, icon: 'icon-glyph-list-alt', comMode: 'auto', title: '功能模块对照表管理', head_h: 25, ifMask: true, ifDrag: false, ifClose: true });
                new $.UI.View({ p: popTips.body, url: 'View/common/TreeList.js', table: 'SYS_CM_GLOBAL_TABLE', rootID: args.gtRootID });
                break;
            case 43: //保存为Excel
                MTips.show('正在研发中...', 'warn');
                break;
            case 44: //打印
                (new $.Util.printer(mainList.get('p'))).print();
                break;
        }
    }

    function onFormChange(obj) {
        switch (obj.Name) {
            case 'htType':
                obj.FormItem.next.reset().set('loadApi', 'm=SYS_TABLE_TREE&action=getNodesByPid&table=SYS_CM_GLOBAL_TABLE&pid=' + tgt[+obj.Value]);
                break;
            case 'htValue1':
                if (isNaN(+obj.Value) || ! +obj.Value) { obj.FormItem.next.setData('按实结算', '按实结算'); return; }
                var _val = (obj.Value / 10000) + '';
                obj.FormItem.next.setData(_val, _val);
                break;
            case 'htRunETime':
                obj.Form.setExt('htRunTime', obj.FormItem.pre.getValue() + ' -- ' + obj.Value);
                break;
        }
    }

    function delayShowInfo(proId) {
        if (!infoView) { setTimeout(function () { delayShowInfo(proId); }, 200); return; }
        infoView.setInstanceId(proId);
    }

    function getBarCodeString() {
        var _val = '', _now = new Date(), _h = _now.getHours(), _m = _now.getMinutes(), _s = _now.getSeconds();
        _h = _h < 10 ? ('0' + _h) : _h;
        _m = _m < 10 ? ('0' + _m) : _m;
        _s = _s < 10 ? ('0' + _s) : _s;
        _val = _now.date8() + _h + _m + _s;
        return _val;
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}