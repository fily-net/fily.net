$.NameSpace('$View.pm');
$View.pm.IndexView = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, gtRootID: 156, infoUrl: 'View/pm/PMInfo2.js' }, popTips, infoView, currProId;
    var coms = {}, typeTab, mainList;
    var loadApi;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var hAry = [
            { name: 'id', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'sons', type: 'attr' },
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
        var comArgs = {
            'rootLayout': { min: 300, max: 500, isRoot: 1, start: 375, dir: 'ns', dirLock: 2 },
            'rootDiv': { head_h: 35 },
            'typeTab': { gtID: 717, gtType: 'tab', items: [{ name: 'all', type: 'tab', nn: '所有任务', text: '所有任务', ifPress: true}], skin: 'ButtonSet-tab fl', itemSkin: 'Button-tab', onClick: onTypeClick },
            'mainList': { aHeader: hAry, style: 'tree:nodeName', colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} } }
        }
        var struct = {
            p: owner,
            type: 'BaseDiv',
            name: 'rootDiv',
            head: [
                { name: 'typeTab', type: 'ButtonSet' }
            ],
            body: { type: 'List', name: 'mainList' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        typeTab = coms.typeTab; mainList = coms.mainList; typeTab.fireClick(0);
    }

    function onTypeClick(obj) {
        var _name = obj.Name, _jc = '';
        if (!isNaN(+_name)) { _jc = '&jsonCondition={"proType":' + _name + ', "pid": 0}'; } else { _jc = '&jsonCondition={"pid":0}'; }
        loadApi = 'm=SYS_TABLE_TREE&table=SYS_PM_PROJECT&action=pagingForTreeList' + _jc;
        mainList.loadAjax({ args: loadApi, cbFn: { onSuccess: function (obj) { if (obj.Length) { mainList.fireClick(0); } } } });
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