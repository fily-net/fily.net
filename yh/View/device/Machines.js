$.NameSpace('$View.device');
$View.device.Machines = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, gtRootID: 156, fireid: null, infoUrl: 'View/device/MachinesInfo.js' }, popTips;
    var coms = {}, typeTab, mainList, currProType, toolBar;
    var ghAry = [
        { type: 'checkbox', width: 40 },
        { title: '<font class="c_6">使用状态</font>', name: 'state', type: 'select', ifTrans: true, width: 100, ifFilter: true, filterItems: ['equal'], gtID:366 },
        { title: '设备编号', name: 'deviceCode', type:'none', width: 110, ifFilter: true, filterItems: ['like'] },
        { title: '设备名称', name: 'deviceName', type: 'none', width: 110 },
        { title: '型号', name: 'deviceType', type: 'none', width: 110 },
        { title: '主要规格', name: 'guiGe', type: 'none', width: 110 },
        { title: '复杂系数机', name: 'xiShuJi', type: 'none', width: 110 },
        { title: '复杂系数电', name: 'xiShuDian', type: 'none', width: 110 },
        { title: '电机型号', name: 'dianJiXinHao', type: 'none', width: 110 },
        { title: '电机功率KW', name: 'dianJiGongLv', type: 'none', width: 110 },
        { title: '制造厂', name: 'maker', type: 'none', width: 110 },
        { title: '出厂日期', name: 'outTime', type: 'date', width: 130 },
        { title: '投产日期', name: 'useTime', type: 'date', width: 130 },
        { title: '备注', name: 'note', comType: 'none', width: 150 }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootDiv': { head_h: 30, title: '机具管理', icon: 'icon-glyph-align-left', toolBarSkin: 'mr5 Button-default', cn: 'b0', gbsID: 89, onToolBarClick: onToolClick },
            'mainList': { aHeader: ghAry, loadApi: 'm=SYS_TABLE_BASE&table=DEVICE_MACHINES&action=pagingForList', ifEnabledFilter: true, colControls: { header: {}, paging: { pageSize: 10, pageIndex: 1} }, onTDDoubleClick: onListDClick, onSuccess: function (obj) { if (obj.Length && args.fireid) { obj.List.fireClick(args.fireid, 'ID'); } } }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootDiv',
            body: { type: 'List', name: 'mainList' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        mainList = coms.mainList;
    }
    function onListDClick(obj) { new $.UI.View({ p: args.p, title: obj.getAttr('merchantName'), type: 'normal', url: args.infoUrl, proId: obj.getAttr('rowid') }); }
    function onToolClick(obj) {
        if (obj.Name == 'toUL') { new $.UI.View({ p: args.p, url: 'View/crm/Index.js' }); return; }
        switch (+obj.Name) {
            case 90:
                //新建项目
                var infoAry = [
                    { title: '设备编号', name: 'deviceCode', comType: 'Input', req: true },
                    { title: '设备名称', name: 'deviceName', comType: 'Input', req: true },
                    { title: '型号', name: 'deviceType', comType: 'Input', req: true },
                    { title: '主要规格', name: 'guiGe', comType: 'Input', req: true },
                    { title: '复杂系数机', name: 'xiShuJi', comType: 'Input', req: true },
                    { title: '复杂系数电', name: 'xiShuDian', comType: 'Input', req: true },
                    { title: '电机型号', name: 'dianJiXinHao', comType: 'Input', req: true },
                    { title: '电机功率KW', name: 'dianJiGongLv', comType: 'Input', req: true },
                    { title: '制造厂', name: 'maker', comType: 'Input', req: true },
                    { title: '出厂日期', name: 'outTime', comType: 'Date', req: true },
                    { title: '投产日期', name: 'useTime', comType: 'EndDate', matchItem: 'outTime', req: true },
                    { title: '原值', name: 'origCost', comType: 'KeyInput', dataType: 'double' },
                    { title: '安装地点', name: 'address', comType: 'Input' },
                    { title: '折旧年限', name: 'zheJiuTime', comType: 'Date' },
                    { title: '分类', name: 'type', comType: 'Input' },
                    { title: '内台办费用', name: 'inCost', comType: 'KeyInput', dataType: 'double', req: true },
                    { title: '外台办费用', name: 'outCost', comType: 'KeyInput', dataType: 'double', req: true },
                    { title: '下次复证日期', name: 'nextCheckTime', comType: 'Date' },
                    { title: '附件', name: 'link', comType: 'FileUploader' },
                    { title: '备注', name: 'note', comType: 'TextArea' }
                ];
                var oP = +$.ck.get('SESSIONID');
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建项目', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 880, ifFixedHeight: false });
                if (currProType == 170) { oP = 0; }
                popTips.Form = new $.UI.Form({ p: popTips.body, insertApi: 'm=SYS_TABLE_BASE&table=DEVICE_MACHINES&action=addRow', items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; mainList.refresh(); } });
                break;
            case 91:
                //删除项目
                var _ids = mainList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择机具', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除'+_ids+'条机具记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_BASE&table=DEVICE_MACHINES&action=deleteByIDs&ids=' + _ids.join(','),
                        onSuccess: function () { MTips.show('删除成功', 'ok'); mainList.refresh(); }
                    })
                });
                break;
            case 34:
                //保存为Excel
                mainList.saveAsExecl('机具列表');
                break;
            case 35:
                //打印
                (new $.Util.printer(mainList.get('p'))).print();
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