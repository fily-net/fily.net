$.NameSpace('$View.project.PMInfoForm');
$View.project.PMInfoForm = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, proId: null, proList: null }, coms, taskInfo, popTips;
    function setDefault(j) {
        args = $.Util.initArgs(j, args);
    }
    function layout() {
        var _fiAry = [
            { name: 'proCode', title: '施工编号：', comType: 'Label', group: { name: 'g1', width: 300, ifShowHead: true, title: '基本信息', css: 'margin:5px;border:1px solid rgb(101, 176, 195);' } },
            { name: 'state', title: '状态：', comType: 'Label', ifTrans: true, group: 'g1' },
            { name: 'proSource', title: '来源：', comType: 'Label', ifTrans: true, group: 'g1' },
            { name: 'proType', title: '类型：', comType: 'Label', ifTrans: true, group: 'g1' },
            { name: 'proArea', title: '区域：', comType: 'Label', ifTrans: true, group: 'g1' },
            { name: 'address', title: '地址：', comType: 'Label', group: 'g1' },
            { name: 'applyDanWei', title: '申请单位：', comType: 'Label', group: 'g1' },
            { name: 'applyContact', title: '联系人：', comType: 'Label', group: 'g1' },
            { name: 'applyMobile', title: '联系方式：', comType: 'Label', group: 'g1' },
            { name: 'acreage', title: '配套面积：', comType: 'Label', dataType: 'double', group: 'g1' },
            { name: 'execTeamName', title: '施工队：', comType: 'Label', group: { name: 'g2', width: 300, ifShowHead: true, title: '施工信息', css: 'margin:5px;border:1px solid rgb(101, 176, 195);' } },
            { name: 'execTeamLeader', title: '联系人：', comType: 'Label', group: 'g2' },
            { name: 'execTeamLeaderMobile', title: '联系方式：', comType: 'Label', group: 'g2' },
            { name: 'qingZhao', title: '倔路执照：', comType: 'Label', ifTrans: true, group: 'g2' },
            { name: 'handleTime', title: '执照办理日：', comType: 'Label', group: 'g2' },
            { name: 'allowTime', title: '倔路许可日：', comType: 'Label', group: 'g2' },
            { name: 'payCost', title: '倔路费用：', comType: 'Label', group: 'g2' },
            { name: 'bTime', title: '开工日期：', comType: 'Label', group: 'g2' },
            { name: 'shuiTestTime', title: '泵水日期：', comType: 'Label', group: 'g2' },
            { name: 'xiaoDuTime', title: '冲洗日期：', comType: 'Label', group: 'g2' },
            { name: 'eTime', title: '竣工日期：', comType: 'Label', group: 'g2' },
            { name: 'jieShuiCode', title: '接水编号：', comType: 'Label', group: 'g2' },
            { name: 'jieShuiDanCode', title: '接水单号：', comType: 'Label', group: 'g2' },
            { name: 'heTongCode', title: '合同编号：', comType: 'Label', group: { name: 'g3', width: 300, ifShowHead: true, title: '附加信息', css: 'margin:5px;border:1px solid rgb(101, 176, 195);' } },
            { name: 'note', title: '备注：', comType: 'Label', group: 'g3' }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 32, title: '工程表单明细', icon: 'fa-list', cn: 'b0', toolBarSkin: 'mr5 Button-default', gbsID: 156, onToolBarClick: onToolBarClick },
            'taskInfo': {
                foot_h: 0,
                items: _fiAry,
                extLoadFields: ['dbo.SYS_TRANS_RIGHTS(' + ($.ck.get('SESSIONID') || '') + ', users,roles,0) as ifRights', 'state', 'proCode', 'planCost', 'realCost'],
                loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=PRO_MG'
            }
        }
        var viewStruct = {
            p: owner,
            name: 'root',
            type: 'Tips',
            body: { type: 'Form', name: 'taskInfo' }
        };
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
        taskInfo = coms.taskInfo;
        loadInfoByProId(args.proId);
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case '157':
                var _fiAry = [
                    { name: 'proCode', title: '施工编号', comType: 'Input', req: true, group: { name: 'g1', width: 280 } },
                    { name: 'proType', title: '类型', comType: 'Select', group: 'g1', gtID: 456, req: true },
                    { name: 'proArea', title: '区域', comType: 'Select', group: 'g1', gtID: 469, req: true },
                    { name: 'address', title: '地址', comType: 'Input', group: 'g1', req: true },
                    { name: 'applyDanWei', title: '申请单位', comType: 'Input', group: 'g1' },
                    { name: 'applyContact', title: '联系人', comType: 'Input', group: 'g1' },
                    { name: 'applyMobile', title: '联系方式', comType: 'Input', group: 'g1' },
                    { name: 'heTongCode', title: '合同编号', comType: 'Input', group: 'g1' },
                    { name: 'heTongPrice', title: '合同价', comType: 'KeyInput', dataType: 'double', group: 'g1' },
                    { name: 'proSource', title: '来源', comType: 'Select', group: 'g1', gtID: 470, req: true },
                    { name: 'acreage', title: '配套面积', comType: 'KeyInput', dataType: 'double', group: 'g1' },
                    { name: 'collectTime', title: '收单日', comType: 'Date', group: { name: 'g2', width: 280 } },
                    { name: 'issuedTime', title: '下单日', comType: 'EndDate', matchItem: 'collectTime', group: 'g2' },
                    { name: 'execTeamName', title: '施工队', comType: 'Input', group: 'g2' },
                    { name: 'execTeamLeader', title: '联系人', comType: 'Input', group: 'g2' },
                    { name: 'execTeamLeaderMobile', title: '联系方式', comType: 'Input', group: 'g2' },
                    { name: 'jieShuiCode', title: '接水编号', comType: 'Input', group: 'g2' },
                    { name: 'jieShuiDanCode', title: '接水单号', comType: 'Input', group: 'g2' },
                    { name: 'deadline', title: '施工期限', comType: 'Date', group: { name: 'g3', width: 280 } },
                    { name: 'qingZhao', title: '倔路执照', comType: 'Select', dataType: 'int', group: 'g3', gtID: 7, onChange: onQingZhaoChange },
                    { name: 'handleTime', title: '办理日', comType: 'Date', req: true, visibled: false, group: 'g3' },
                    { name: 'allowTime', title: '许可日', comType: 'Date', req: true, visibled: false, group: 'g3' },
                    { name: 'payCost', title: '支付费用', comType: 'KeyInput', dataType: 'double', visibled: false, group: 'g3' },
                    { name: 'note', title: '备注', comType: 'TextArea', group: 'g3' }
                ];
                if (popTips) { popTips.remove(); popTips = null; }
                popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-edit', title: '编辑工程信息', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 640, ifFixedHeight: false });
                var _form = new $.UI.Form({
                    p: popTips.body,
                    state: 'Update',
                    updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=PRO_MG',
                    items: _fiAry,
                    ifFixedHeight: false,
                    extLoadFields: ['dbo.SYS_TRANS_RIGHTS(' + ($.ck.get('SESSIONID') || '') + ', users,roles,0) as ifRights', 'state', 'proCode', 'planCost', 'realCost'],
                    loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=PRO_MG',
                    onSubmitSuccess: function () {
                        popTips.remove(); popTips = null;
                        MTips.show('编辑成功', 'ok');
                        loadInfoByProId(args.proId);
                    }
                });
                _form.focus();
                _form.loadDataByID(args.proId, function (obj) {

                }, true);
                break;
        }
    }

    function onQingZhaoChange(obj) {
        if (+obj.Value == 8) {
            obj.FormItem.next.show().next.show().next.show();
        } else {
            obj.FormItem.next.hide().next.hide().next.hide();
        }
    }

    function loadInfoByProId(proId) {
        taskInfo.loadDataByID(proId, function (obj) {

        }, true);
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