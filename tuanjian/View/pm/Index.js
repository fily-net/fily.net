$.NameSpace('$View.pm');
$View.pm.Index = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, gtRootID: 156 }, popTips, infoView, currProId;
    var coms = {}, typeTab, mainList, infoForm;
    var loadApi;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var hAry = [
            { name: 'id', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { type: 'checkbox', width: 50 },
            { name: 'nodeName', type: 'attr' },
            { title: '项目名称', name: 'nodeName', ifEnabledTips: true, type: 'none', width: 180 },
            { title: '项目进度', name: 'schedule', type: 'process', width: 80 },
            { title: '所属阶段', name: 'proType', ifTrans: true, type: 'none', width: 100 },
            { title: '任务等级', name: 'level', ifTrans: true, type: 'none', width: 100 },
            { title: '任务状态', name: 'step', ifTrans: true, type: 'none', width: 100 },
            { title: '创建者', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 60 },
            { title: '创建时间', name: 'cTime', type: 'date', width: 125 },
            { title: '预计开始时间', name: 'preSTime', type: 'date', width: 125 },
            { title: '预计结束时间', name: 'preETime', type: 'date', width: 125 },
            { title: '备注', name: 'note', ifEnabledTips: true, type: 'none', width: 300 }
        ];
        var infoFormAry = [
            { title: '任务名称', name: 'nodeName', comType: 'TextArea', req: true },
            { title: '任务等级', name: 'level', comType: 'Select', gtID: 722, req: true },
            { title: '进度', name: 'schedule', comType: 'NumUpDown' },
            { title: '任务状态', name: 'step', comType: 'Select', gtID: 726, req: true },
            { title: '阶段', name: 'proType', comType: 'Select', gtID: 717, req: true },
            { title: '预计开始时间', name: 'preSTime', comType: 'Date' },
            { title: '预计结束时间', name: 'preETime', comType: 'EndDate', matchItem: 'preSTime' },
            { title: '开始时间', name: 'sTime', comType: 'Date' },
            { title: '结束时间', name: 'eTime', comType: 'EndDate', matchItem: 'sTime' },
            { title: '任务说明', name: 'note', comType: 'TextArea' }
        ];
        var comArgs = {
            'rootLayout': { min: 300, max: 500, isRoot: 1, start: 375, dir: 'ns', dirLock: 2 },
            'rootDiv': { head_h: 35 },
            'typeTab': { gtID: 717, gtType: 'tab', items: [{ name: 'all', type: 'tab', nn: '所有任务', text: '所有任务', ifPress: true}], skin: 'ButtonSet-tab fl', itemSkin: 'Button-tab', onClick: onTypeClick },
            'toolTab': { gbsID: 140, ifRights: true, itemAlign: 'right', skin: 'ButtonSet-default mr10', onClick: onToolClick },
            'mainList': { aHeader: hAry, style: 'tree:nodeName', colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onTDClick: onListClick },
            'infoForm': { updateApi: 'm=SYS_TABLE_TREE&table=SYS_PM_PROJECT&action=updateNodeByID', state: 'Update', loadApi: 'm=SYS_TABLE_TREE&table=SYS_PM_PROJECT&action=getNodeByID', items: infoFormAry, ifFixedHeight: true, onSubmitSuccess: function () { refresh(); } }
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
            eFoot: { type: 'Form', name: 'infoForm' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        typeTab = coms.typeTab;
        mainList = coms.mainList;
        typeTab.fireClick(0);
        infoForm = coms.infoForm;
    }
    
    function onTypeClick(obj) {
        var _name = obj.Name, _jc = '';
        if (!isNaN(+_name)) { _jc = '&jsonCondition={"proType":' + _name + ', "pid": 0}'; } else { _jc = '&jsonCondition={"pid":0}'; }
        loadApi = 'm=SYS_TABLE_TREE&table=SYS_PM_PROJECT&action=pagingForTreeList' + _jc;
        mainList.loadAjax({ args: loadApi, cbFn: { onSuccess: function (obj) { if (obj.Length) { mainList.fireClick(0); } else { infoView.loadPro(0); } } } });
    }
    function onListClick(obj) {
        var _rid = obj.Target.getAttr('rowid');
        if (currProId == _rid) { return; }
        currProId = _rid;
        delayShowInfo(_rid);
        
    }
    function onToolClick(obj) {
        if (obj.Name == 'toNormal') { new $.UI.View({ p: args.p, url: 'View/pm/IndexNormal.js' }); return; }
        switch (+obj.Name) {
            case 142:
                //新建项目
                var infoAry = [
                    { title: '任务名称', name: 'nodeName', comType: 'TextArea', req: true },
                    { title: '任务等级', name: 'level', comType: 'Select', gtID: 722, req: true },
                    { title: '阶段', name: 'proType', comType: 'Select', gtID: 717, req: true },
                    { title: '预计开始时间', name: 'preSTime', comType: 'Date' },
                    { title: '预计结束时间', name: 'preETime', comType: 'EndDate', matchItem: 'preSTime' },
                    { title: '任务说明', name: 'note', comType: 'TextArea' }
                ];
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建任务', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 350, ifFixedHeight: false });
                popTips.Form = new $.UI.Form({ p: popTips.body, insertApi: 'm=SYS_TABLE_TREE&table=SYS_PM_PROJECT&action=addTreeNodeByPid&pid=0', items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; mainList.refresh(); } });
                break;
            case 143:
                //删除项目
                var _ids = mainList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择要删除的行', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除' + _ids.length + '条记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_TREE&table=SYS_PM_PROJECT&action=deleteByIDs&ids=' + _ids.join(','),
                        onSuccess: function () { MTips.show('删除成功', 'ok'); refresh(); }
                    })
                });
                break;
            case 147:
                //新建子任务项目
                if (!currProId) { MTips.show('请先选择父级任务', 'warn'); return; }
                var infoAry = [
                    { title: '任务名称', name: 'nodeName', comType: 'TextArea', req: true },
                    { title: '任务等级', name: 'level', comType: 'Select', gtID: 722, req: true },
                    { title: '阶段', name: 'proType', comType: 'Select', gtID: 717, req: true },
                    { title: '预计开始时间', name: 'preSTime', comType: 'Date' },
                    { title: '预计结束时间', name: 'preETime', comType: 'EndDate', matchItem: 'preSTime' },
                    { title: '任务说明', name: 'note', comType: 'TextArea' }
                ];
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建子任务', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 350, ifFixedHeight: false });
                popTips.Form = new $.UI.Form({ p: popTips.body, insertApi: 'm=SYS_TABLE_TREE&table=SYS_PM_PROJECT&action=addTreeNodeByPid&pid=' + currProId, items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; refresh(); } });
                break;
        }
    }

    function refresh() {
        mainList.loadAjax({
            args: loadApi,
            cbFn: {
                onSuccess: function (obj) {
                    if (obj.Length) {
                        mainList.fireClick(0);
                    } else {
                        delayShowInfo(0);
                    }
                }
            }
        });
    }

    function delayShowInfo(proId) {
        if (!infoForm) { setTimeout(function () { delayShowInfo(proId); }, 200); return; }
        infoForm.loadDataByID(proId);
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