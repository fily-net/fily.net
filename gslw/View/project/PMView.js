$.NameSpace('$View.project');
$View.project.PMView = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms = {};
    var _taskAry = [
        { name: 'id', type: 'attr' },
        { title: '施工编号', name: 'proCode', type: 'none', width: 120, ifFilter: true, filterItems: ['like'] },
        { title: '<font color="red">当前状态</font>', name: 'state', type: 'select', width: 120, ifFilter: true, gtID: 505, filterItems: ['equal'] },
        { title: '工程类型', name: 'proType', type: 'select', width: 120, ifFilter: true, gtID: 456, filterItems: ['equal'] },
        { title: '工程地址', name: 'address', type: 'none', width: 120, ifFilter: true, filterItems: ['like'] },
        { title: '工程性质', name: 'proNature', type: 'select', width: 120, ifFilter: true, gtID: 468, filterItems: ['equal'] },
        { title: '施工部门', name: 'execDept', type: 'select', width: 120, ifFilter: true, gtID: 472, filterItems: ['equal'] },
        { title: '工程区域', name: 'proArea', type: 'select', width: 120, ifFilter: true, gtID: 469, filterItems: ['equal'] },
        { title: '收单日', name: 'collectTime', type: 'date', width: 130, ifFilter: true, filterItems: ['equal'] },
        { title: '开工日期', name: 'bTime', type: 'date', width: 130, ifFilter: true, filterItems: ['equal'] },
        { title: '竣工日期', name: 'eTime', type: 'date', width: 130, ifFilter: true, filterItems: ['equal'] },
        { title: '请照情况', name: 'qingZhao', type: 'select', width: 120, ifFilter: true, gtID: 7, filterItems: ['equal'] },
        { title: '分包商', name: 'execTeam', ifEnabledTips: true, ifTrans: true, trans: 'SYS_TRANS_CPN', textKey: 'companyName', loadApi: 'm=SYS_TABLE_BASE&action=getByCondition&orderCol=cTime&table=TZ_COOPERATION', type: 'select', width: 180, ifFilter: true, filterItems: ['equal'] },
        { title: '施工期限', name: 'deadline', type: 'date', width: 130, ifFilter: true, filterItems: ['equal'] },
        { title: '施工负责人', name: 'execTeamLeader', type: 'none', width: 120, ifFilter: true, filterItems: ['like'] },
        { title: '领料总金', name: 'lingAllCost', type: 'none', width: 120 },
        { title: '退料总金', name: 'tuiAllCost', type: 'none', width: 120 },
        { title: '备注', name: 'note', key: 'note', type: 'none', width: 120, ifEnabledTips: true }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 30, title: '工程查看', icon: 'icon-glyph-briefcase', cn: 'b0', toolBarSkin: 'mr5 Button-default' },
            'taskList': { aHeader: _taskAry, loadApi: 'm=SYS_TABLE_BASE&table=PRO_MG&action=pagingForRightsWFList', ifEnabledFilter: true, onSuccess: function (obj) { if (obj.Length) { obj.List.fireClick(0); } }, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1}} }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: {
                type: 'List', name: 'taskList'
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
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