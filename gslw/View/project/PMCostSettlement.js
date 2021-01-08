$.NameSpace('$View.project.PMCostSettlement');
$View.project.PMCostSettlement = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, proId: null, proList: null }, coms, taskInfo, popTips, _body, _form;
    var _fiAry = [
        { name: 'outCost', title: '对外结算费', comType: 'KeyInput', dataType: 'double', group: { width: 280, name: 'g1' } },
        { name: 'inCost', title: '对内结算费', comType: 'KeyInput', group: 'g1' },
        { name: 'faZhanCost', title: '业务发展中心结算费', comType: 'KeyInput', group: 'g1' },
        { name: 'yinYeCost', title: '营业所结算费', comType: 'KeyInput', group: 'g1' },
        { name: 'bateOneCost', title: '按40%结算费', comType: 'KeyInput', group: 'g1' },
        { name: 'bateTwoCost', title: '按8.3结算费', comType: 'KeyInput', group: 'g1' },
        { name: 'proFitCost', title: '利润', comType: 'KeyInput', group: 'g1' },
        { name: 'area', title: '配套面积', comType: 'KeyInput', group: 'g1' },
        { name: 'personCost', title: '外包人工费', comType: 'KeyInput', group: 'g1' },
        { name: 'preCaiLiaoCost', title: '预决算材料费', comType: 'KeyInput', group: { width: 280, name: 'g2' } },
        { name: 'realCaiLiaoCost', title: '实际领用材料费', comType: 'KeyInput', group: 'g2' },
        { name: 'repairCost', title: '路面修理费', comType: 'KeyInput', group: 'g2' },
        { name: 'duJianCost', title: '桥管土建费', comType: 'KeyInput', group: 'g2' },
        { name: 'heTongCost', title: '合同金额', comType: 'KeyInput', group: 'g2' },
        { name: 'prePayCost', title: '预付款', comType: 'KeyInput', group: 'g2' },
        { name: 'backUpOneCost', title: '备用一', comType: 'KeyInput', group: 'g2' },
        { name: 'backUpTwoCost', title: '备用二', comType: 'KeyInput', group: 'g2' },
        { name: 'backUpThreeCost', title: '备用三', comType: 'KeyInput', group: 'g2' }
    ];

    var _detailAry = [
        { name: 'collectTime', title: '收单日', comType: 'Date', group: { name: 'g2', width: 280 } },
        { name: 'issuedTime', title: '下单日', comType: 'Date', group: 'g2' },
        { name: 'feedBack', title: '回访情况', comType: 'Select', group: 'g2', gtID: 471, req: true },
        { name: 'deadline', title: '施工期限', comType: 'Date', group: 'g3' },
        { name: 'bTime', title: '开工日期', comType: 'Date', group: { name: 'g3', width: 280 }, req: true, },
        { name: 'shuiTestTime', title: '水压试验日期', comType: 'EndDate', matchItem: 'bTime', group: 'g3', req: true },
        { name: 'xiaoDuTime', title: '冲洗消毒日期', comType: 'EndDate', matchItem: 'shuiTestTime', group: 'g3', req: true },
        { name: 'eTime', title: '竣工日期', comType: 'EndDate', matchItem: 'xiaoDuTime', group: 'g3', req: true },
        { name: 'qingZhao', title: '请照情况', comType: 'Select', group: 'g3', gtID: 7, onChange: onQingZhaoChange },
        { name: 'handleTime', title: '办理日', comType: 'Date', req: true, visibled: false, group: 'g3' },
        { name: 'allowTime', title: '许可日', comType: 'Date', req: true, visibled: false, group: 'g3' },
        { name: 'payCost', title: '支付费用', comType: 'KeyInput', dataType: 'double', visibled: false, group: 'g3' }
    ];
    function setDefault(j) {
        args = $.Util.initArgs(j, args);
    }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 38, title: '施工信息', icon: 'fa fa-file-text-o', cn: 'b0' },
            'layout': { min: 560, max: 600, isRoot: 1, start: 560, dir: 'we', dirLock: 1 },
            'taskInfo': {
                items: _fiAry, 
                ifFixedHeight: false,
                state: 'Update',
                head_h: 30,
                title: '施工过程附加费用',
                updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=PRO_SC_ACCOUNT_INFO',
                onSubmitSuccess: function () { 
                    MTips.show('修改数据成功', 'ok');
                }
            },
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
            },
            'typeTab': { gtID: 765, gtType: 'tab', skin: 'ButtonSet-tab fl', itemSkin: 'Button-tab', onClick: onTypeClick, onSuccess: onLoadTypeSuccess },
        }

        var struct = {
            p: owner,
            type: 'BaseDiv',
            name: 'root',
            head: [
                    { name: 'typeTab', type: 'ButtonSet' }
            ]
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        _body = coms.root.body;
    }

    function onLoadTypeSuccess(obj) {
        obj.ButtonSet.fireClick(0);
    }

    function onTypeClick(obj) {
        _body.h('');
        switch (obj.Name) {
            case '767':
                _form = new $.UI.Form({
                    p: _body,
                    items: _fiAry,
                    ifFixedHeight: false,
                    state: 'Update',
                    head_h: 0,
                    title: '施工过程附加费用',
                    updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=PRO_SC_ACCOUNT_INFO',
                    onSubmitSuccess: function () {
                        MTips.show('修改数据成功', 'ok');
                    }
                });
                _form.loadDataByWhereCondition('m=SYS_TABLE_BASE&action=getByCondition&table=PRO_SC_ACCOUNT_INFO&jsonCondition={"proId": ' + args.proId + '}');
                break;
            case '766':
                _form = new $.UI.Form({
                    p: _body,
                    items: _detailAry,
                    ifFixedHeight: false,
                    state: 'Update',
                    head_h: 0,
                    title: '竣工信息',
                    extLoadFields: ['dbo.SYS_TRANS_RIGHTS(' + ($.ck.get('SESSIONID') || '') + ', users,roles,0) as ifRights', 'state', 'proCode', 'planCost', 'realCost'],
                    loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=PRO_MG',
                    onSubmitSuccess: onFormSubmitSuccess,
                    updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=PRO_MG'
                });
                _form.loadDataByID(args.proId, function (obj) {

                }, true);
                break;
        }
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