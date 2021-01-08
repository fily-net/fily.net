$.NameSpace('$View.project.ProjectShiGongInfo');
$View.project.ProjectShiGongInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, proId: null, proList: null }, coms, taskInfo, popTips;
    function setDefault(j) {
        args = $.Util.initArgs(j, args);
    }
    function layout() {
        var _fiAry = [
            { name: 'outCost', title: '对外结算费', comType: 'KeyInput', dataType: 'double', group: { width: 280, name: 'g1'} },
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

        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
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
            }
        }

        var struct = {
            p: owner,
            type: 'Form', name: 'taskInfo'
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        taskInfo = coms.taskInfo;
        taskInfo.loadDataByWhereCondition('m=SYS_TABLE_BASE&action=getByCondition&table=PRO_SC_ACCOUNT_INFO&jsonCondition={"proId": ' + args.proId + '}');
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