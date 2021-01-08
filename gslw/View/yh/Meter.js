$.NameSpace('$View.yh');
$View.yh.Meter = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, table: 'YH_BASE_STATION' };
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { title: 'ID', name: 'id', type: 'attr' },
            { name: 'cb', type: 'checkbox', width: 50 },
            { title: '扫描码', name: 'scanCode', type: 'none', width: 120 },
            { title: '编号', name: 'code', type: 'none', width: 100, ifFilter: true, filterItems: ['like'] },
            { title: '地址', name: 'address', type: 'none', width: 150, ifFilter: true, filterItems: ['like'] },
            { title: '反映人', name: 'fanYingUser', type: 'none', width: 80 },
            { title: '接报时间', name: 'jieBaoTime', type: 'date', width: 80, ifFilter: true, filterItems: ['equal'] },
            { title: '处理级别', name: 'chuLiLevel', ifTrans: true, type: 'none', width: 80 },
            { title: '客户', name: 'customer', type: 'none', width: 80 },
            { title: '来单部门', name: 'laiDanDept', ifTrans: true, type: 'none', width: 80 },
            { title: '修理部门', name: 'repairDept', ifTrans: true, type: 'none', width: 80, ifFilter: true, filterItems: ['equal'] },
            { title: '施工队', name: 'shiGongGroup', ifTrans: true, type: 'none', width: 80 },
            { title: '施工人', name: 'shiGongUsers', type: 'none', width: 80 },
            { title: '修复日期', name: 'repairTime', type: 'date', width: 120, ifFilter: true, filterItems: ['equal'] },
            { title: '地面状况', name: 'earthState', ifTrans: true, type: 'none', width: 80 }
        ];
        var _infoItems = [
            { title: '扫描码', name: 'scanCode', comType: 'ScanCode', group: { name: 'g1', width: 300} },
            { title: '编号', name: 'code', comType: 'Label', group: 'g1' },
            { title: '施工地址', name: 'address', comType: 'Input', group: 'g1' },
            { title: '反映人', name: 'fanYingUser', comType: 'Input', group: 'g1' },
            { title: '反应来源', name: 'fanYingSource', comType: 'Select', gtID: 281, group: 'g1' },
            { title: '反应内容', name: 'fanYingContent', comType: 'Select', gtID: 280, group: 'g1' },
            { title: '接报时间', name: 'jieBaoTime', comType: 'Date', group: { name: 'g2', width: 300} },
            { title: '处理级别', name: 'chuLiLevel', comType: 'Select', gtID: 279, group: 'g2' },
            { title: '客户', name: 'customer', comType: 'Input', group: 'g2' },
            { title: '来单部门', name: 'laiDanDept', comType: 'Select', gtID: 282, group: 'g2' },
            { title: '修理部门', name: 'repairDept', comType: 'Select', gtID: 282, group: 'g2' },
            { title: '修理内容', name: 'repairContent', comType: 'Select', gtID: 283, group: 'g2' },
            { title: '修复日期', name: 'repairTime', comType: 'Date', group: 'g2' },
            { title: '施工队', name: 'shiGongGroup', comType: 'Select', group: { name: 'g3', width: 300} },
            { title: '施工人', name: 'shiGongUsers', comType: 'Input', group: 'g3' },
            { title: '地面状况', name: 'earthState', comType: 'Select', gtID: 327, group: 'g3' },
            { title: '区域', name: 'area', comType: 'Select', gtID: 284, group: 'g3' },
            { title: '回访情况', name: 'huiFang', comType: 'Select', gtID: 285, group: 'g3' },
            { title: '审核人', name: 'shenHePerson', comType: 'Select', group: 'g3' },
            { title: '费用', name: 'feiYong', comType: 'KeyInput', dataType: 'double', group: 'g3' },
            { title: '耗用材料', name: 'haoYong', comType: 'Input', group: { name: 'g4', width: 300} },
            { title: '相关文件', name: 'link', comType: 'FileUploader', group: 'g4' },
            { title: '备注', name: 'note', comType: 'TextArea', group: 'g4' }
        ];
        new $.UI.View({ p: args.p, url: 'View/yh/Base.js', table: args.table, type: 355, headAry: _mHeaderAry, infoAry: _infoItems });
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