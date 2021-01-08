$.NameSpace('$View.yh');
$View.yh.RepairLeakage = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, table: 'YH_REPAIR_LEAKAGE' };
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { title: 'ID', name: 'id', type: 'attr' },
            { name: 'cb', type: 'checkbox', width: 50 },
            { title: '扫描码', name: 'scanCode', type: 'none', width: 120 },
            { title: '漏水点代码', name: 'daiMa', type: 'none', width: 150, ifFilter: true },
            { title: '漏水所在管道', name: 'guanDaiMa', type: 'none', width: 80 },
            { title: '漏水原因', name: 'yuanYin', type: 'none', width: 80, ifFilter: true },
            { title: '报漏时间', name: 'baoLouTime', type: 'date', width: 80 },
            { title: '修复日期', name: 'repairTime', type: 'date', width: 80 },
            { title: '施工队', name: 'shiGongGroup', ifTrans: true, type: 'none', width: 80 },
            { title: '漏水点地址', name: 'address', type: 'none', width: 80 },
            { title: '漏水管口径', name: 'kouJing', type: 'none', width: 80 },
            { title: '埋设日期', name: 'maiSheTime', type: 'date', width: 80 },
            { title: '漏水类型', name: 'type', ifTrans: true, type: 'none', width: 80 },
            { title: '路面类型', name: 'luMianType', ifTrans: true, type: 'none', width: 80 }
        ];
        var _infoItems = [
            { title: '扫描码', name: 'scanCode', comType: 'ScanCode', group: { name: 'g1', width: 300} },
            { title: '漏水点代码', name: 'daiMa', comType: 'Input', group: 'g1' },
            { title: '漏水管代码', name: 'guanDaiMa', comType: 'Input', group: 'g1' },
            { title: '漏水点地址', name: 'address', comType: 'Input', group: 'g1' },
            { title: '漏水管口径', name: 'kouJing', comType: 'Input', group: 'g1' },
            { title: '漏水管管材', name: 'guanCai', comType: 'Select', gtID: 286, group: 'g1' },
            { title: '漏水类型', name: 'type', comType: 'Select', gtID: 289, group: 'g1' },
            { title: '埋设日期', name: 'maiSheTime', comType: 'Date', group: { name: 'g2', width: 300} },
            { title: '漏水管埋深', name: 'shenDu', comType: 'Input', dataType:'double', group: 'g2' },
            { title: '漏水日气温', name: 'qiWen', comType: 'Input', group: 'g2' },
            { title: '路面类型', name: 'luMianType', comType: 'Select', gtID: 310, group: 'g2' },
            { title: '路基土壤', name: 'tuRang', comType: 'Select', gtID: 282, group: 'g2' },
            { title: '交通负荷', name: 'fuHe', comType: 'Select', gtID: 313, group: 'g2' },
            { title: '漏水原因', name: 'yuanYin', comType: 'Date', group: 'g2' },
            { title: '修复类型', name: 'shiGongGroup', comType: 'Select', group: 'g2'},
            { title: '耗用材料', name: 'haoYong', comType: 'Input', group: { name: 'g3', width: 300} },
            { title: '费用', name: 'feiYong', comType: 'Input', dataType: 'double', group: 'g3' },
            { title: '漏水性质', name: 'xingZhi', comType: 'Select', gtID: 311, group: 'g3' },
            { title: '处理级别', name: 'chuLiLevel', comType: 'Select', gtID: 315, group: 'g3' },
            { title: '漏失水量', name: 'shuiLiang', comType: 'Input', dataType:'double', group: 'g3' },
            { title: '漏水日期', name: 'louShuiTime', comType: 'Date', group: 'g3' },
            { title: '报漏时间', name: 'baoLouTime', comType: 'Date', group: 'g3' },
            { title: '开工日期', name: 'kaiGongTime', comType: 'Date', group: 'g3' },
            { title: '修复日期', name: 'repairTime', comType: 'Date', group: { name: 'g4', width: 300} },
            { title: '施工队', name: 'shiGongGroup', comType: 'Select', group: 'g4' },
            { title: '回访情况', name: 'huiFang', comType: 'Select', group: 'g4' },
            { title: '相关文件', name: 'link', comType: 'FileUploader', group: 'g4' },
            { title: '备注', name: 'note', comType: 'TextArea', group: 'g4' }
        ];
        new $.UI.View({ p: args.p, url: 'View/yh/Base.js', table: args.table, type: 354, headAry: _mHeaderAry, infoAry: _infoItems });
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