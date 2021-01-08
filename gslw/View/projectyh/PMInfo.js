$.NameSpace('$View.projectyh');
$View.projectyh.PMInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, proId: 0 };
    var coms = {};
    var _fiAry = [
        { name: 'proCode', title: '施工编号', comType: 'Input', req: true, group: { name: 'g1', width: 280} },
        { name: 'state', comType: 'Label', group: 'g1', visibled: false },
        { name: 'proType', title: '类型', comType: 'Select', group: 'g1', gtID: 456, onChange: onProTypeChange, req: true },
        { name: 'proNature', title: '性质', comType: 'Select', group: 'g1', gtID: 468, req: true },
        { name: 'proArea', title: '区域', comType: 'Select', group: 'g1', gtID: 469, req: true },
        { name: 'address', title: '地址', comType: 'Input', group: 'g1', req: true },
        { name: 'customer', title: '客户名', comType: 'Input', group: 'g1' },
        { name: 'contact', title: '联系方式', comType: 'Input', group: 'g1' },
        { name: 'proSource', title: '来源', comType: 'Select', group: 'g1', gtID: 470, req: true },
        { name: 'acreage', title: '配套面积', comType: 'KeyInput', dataType: 'double', group: { name: 'g2', width: 280} },
        { name: 'outPutValue', title: '估计产值', comType: 'KeyInput', dataType: 'double', group: 'g2', req: true },
        { name: 'collectTime', title: '收单日', comType: 'Date', group: 'g2' },
        { name: 'issuedTime', title: '下单日', comType: 'Date', group: 'g2' },
        { name: 'feedBack', title: '回访情况', comType: 'Select', group: 'g2', gtID: 471, visibled: false, req: true },
        { name: 'execDept', title: '施工部门', dataType: 'int', comType: 'Select', ifTrans: true, gtID: 472, req: true, group: 'g2', onChange: function (obj) { obj.Form.setHidden('dept', obj.Value); } },
        { name: 'execTeam', title: '分包商', comType: 'Select', trans: 'SYS_TRANS_CPN', textKey: 'companyName', popWidth: 320, loadApi: 'm=SYS_TABLE_BASE&action=getByCondition&orderCol=cTime&table=TZ_COOPERATION', group: 'g2', visibled: false },
        { name: 'deadline', title: '施工期限', comType: 'Date', group: { name: 'g3', width: 280} },
        { name: 'execTeamLeader', title: '施工负责人', comType: 'Input', group: 'g3', req: true, visibled: false },
        { name: 'bTime', title: '开工日期', comType: 'Date', group: 'g3', req: true, visibled: false },
        { name: 'shuiTestTime', title: '水压试验日期', comType: 'EndDate', matchItem: 'bTime', group: 'g3', req: true, visibled: false },
        { name: 'xiaoDuTime', title: '冲洗消毒日期', comType: 'EndDate', matchItem: 'shuiTestTime', group: 'g3', req: true, visibled: false },
        { name: 'eTime', title: '竣工日期', comType: 'EndDate', matchItem: 'xiaoDuTime', group: 'g3', req: true, visibled: false },
        { name: 'qingZhao', title: '请照情况', comType: 'Select', group: 'g3', gtID: 7, onChange: onQingZhaoChange },
        { name: 'handleTime', title: '办理日', comType: 'Date', req: true, visibled: false, group: 'g3' },
        { name: 'allowTime', title: '许可日', comType: 'Date', req: true, visibled: false, group: 'g3' },
        { name: 'payCost', title: '支付费用', comType: 'KeyInput', dataType: 'double', visibled: false, group: 'g3' },
        { name: 'note', title: '备注', comType: 'TextArea', group: 'g3' }
    ];
    var _fileAry = [
        { title: '文件名', name: 'nodeName', type: 'none', width: 80, ifEnabledTips: true },
        { title: '格式', name: 'extName', type: 'none', width: 60 },
        { title: '大小', name: 'size', type: 'none', ifTrans: true, trans: 'SYS_TRANS_FILE_SIZE', width: 60 },
        { title: '上传人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 80 },
        { title: '上传时间', name: 'cTime', type: 'date', width: 130 },
        { title: '<font color="red">操作</font>', type: 'operate', items: [{ icon: 'icon-glyph-download', name: 'download', href: 'Module/SYS_CM_FILES.aspx?action=downloadFile%26id={0}{1}cast(id as varchar(10)){1}{0}'}], width: 60 }
    ];
    function setDefault(j) {
        args = $.Util.initArgs(j, args);
        if ($.global.arrowTips) {
            $.global.arrowTips.remove();
            $.global.arrowTips = null;
        }
    }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'infoTips': { head_h: 0, cn: 'b0', toolBarSkin: 'mr5 Button-default', gbsID: 115, onToolBarClick: onToolBarClick },
            'infoLayout': { min: 244, max: 600, start: 500, dir: 'we', dirLock: 2 },
            'fileList': { aHeader: _fileAry, colControls: { header: {}} },
            'taskInfo': { items: _fiAry, title: '基本信息', extLoadFields: ['dbo.SYS_TRANS_RIGHTS(' + ($.ck.get('SESSIONID') || '') + ', users,roles,0) as ifRights', 'state', 'proCode', 'wfId', 'accountWfId', 'planCost', 'realCost'], loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=PRO_MG', onSubmitSuccess: onFormSubmitSuccess }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'infoTips',
            body: {
               
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        me.load(args.proId);
    }

    me.load = function(proId) {

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