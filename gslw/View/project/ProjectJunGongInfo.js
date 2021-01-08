$.NameSpace('$View.project.ProjectJunGongInfo');
$View.project.ProjectJunGongInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, proId: null, proList: null }, coms, taskInfo, popTips;
    function setDefault(j) {
        args = $.Util.initArgs(j, args);
    }
    function layout() {
        var _detailAry = [
            { name: 'acreage', title: '配套面积', comType: 'KeyInput', dataType: 'double', group: { name: 'g2', width: 280 } },
            { name: 'collectTime', title: '收单日', comType: 'Date', group: 'g2' },
            { name: 'issuedTime', title: '下单日', comType: 'Date', group: 'g2' },
            { name: 'feedBack', title: '回访情况', comType: 'Select', group: 'g2', gtID: 471, req: true },
            { name: 'deadline', title: '施工期限', comType: 'Date', group: { name: 'g3', width: 280 } },
            { name: 'bTime', title: '开工日期', comType: 'Date', group: 'g3', req: true, },
            { name: 'shuiTestTime', title: '水压试验日期', comType: 'EndDate', matchItem: 'bTime', group: 'g3', req: true },
            { name: 'xiaoDuTime', title: '冲洗消毒日期', comType: 'EndDate', matchItem: 'shuiTestTime', group: 'g3', req: true },
            { name: 'eTime', title: '竣工日期', comType: 'EndDate', matchItem: 'xiaoDuTime', group: 'g3', req: true },
            { name: 'qingZhao', title: '请照情况', comType: 'Select', group: 'g3', gtID: 7, onChange: onQingZhaoChange },
            { name: 'handleTime', title: '办理日', comType: 'Date', req: true, visibled: false, group: 'g3' },
            { name: 'allowTime', title: '许可日', comType: 'Date', req: true, visibled: false, group: 'g3' },
            { name: 'payCost', title: '支付费用', comType: 'KeyInput', dataType: 'double', visibled: false, group: 'g3' }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'detailInfo': {
                items: _detailAry,
                ifFixedHeight: false,
                state: 'Update',
                head_h: 30,
                title: '竣工信息',
                extLoadFields: ['dbo.SYS_TRANS_RIGHTS(' + ($.ck.get('SESSIONID') || '') + ', users,roles,0) as ifRights', 'state', 'proCode', 'planCost', 'realCost'],
                loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=PRO_MG',
                onSubmitSuccess: onFormSubmitSuccess,
                updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=PRO_MG'
            }
        }

        var struct = {
            p: owner,
            type: 'Form', name: 'detailInfo'
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        coms.detailInfo.loadDataByID(args.proId, function (obj) {

        }, true);
    }

    function onFormSubmitSuccess(obj) {
        args.proList.refresh({ onSuccess: function (obj) { args.proList.fireClick(0); } });
    }

    function onQingZhaoChange(obj) {
        if (+obj.Value == 8) {
            obj.FormItem.next.show().next.show().next.show();
        } else {
            obj.FormItem.next.hide().next.hide().next.hide();
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