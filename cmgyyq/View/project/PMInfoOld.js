$.NameSpace('$View.project');
$View.project.PMInfoOld = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, proId: 0, proList: null };
    var coms = {}, taskInfo, infoTips, toolBar, subBtn, popTips, infoBtns, fileList, fBtns, infoVal, currState, ifEdit = false, _pCost;
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
    function setDefault(j) { args = $.Util.initArgs(j, args); if ($.global.arrowTips) { $.global.arrowTips.remove(); $.global.arrowTips = null; } }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'infoTips': { head_h: 30, cn: 'b0', toolBarSkin: 'mr5 Button-default', gbsID: 115, onToolBarClick: onToolBarClick },
            'infoLayout': { min: 244, max: 600, start: 500, dir: 'we', dirLock: 2 },
            'fileList': { aHeader: _fileAry, colControls: { header: {}} },
            'taskInfo': { items: _fiAry, title: '基本信息', extLoadFields: ['dbo.SYS_TRANS_RIGHTS(' + ($.ck.get('SESSIONID') || '') + ', users,roles,0) as ifRights', 'state', 'proCode', 'wfId', 'accountWfId', 'planCost', 'realCost'], loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=PRO_MG', onSubmitSuccess: onFormSubmitSuccess }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'infoTips',
            body: {
                name: 'infoLayout', type: 'Layout',
                eHead: { name: 'taskInfo', type: 'Form' },
                eFoot: { name: 'fileList', type: 'List' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        taskInfo = coms.taskInfo; subBtn = taskInfo.getButton(0); infoTips = coms.infoTips; infoBtns = infoTips.toolBar.hide(); fileList = coms.fileList; fBtns = taskInfo.btnSet;
        onInit();
    }

    function onFormSubmitSuccess(obj) {
        args.proList.refresh({ onSuccess: function (obj) { args.proList.fireClick(0); } });
    }

    function onProTypeChange(obj) {
        if (+obj.Form.items['state'].getValue() > 506) {
            if (obj.Value === '457') {
                taskInfo.items['shuiTestTime'].show();
                taskInfo.items['xiaoDuTime'].show();
            } else {
                taskInfo.items['shuiTestTime'].hide();
                taskInfo.items['xiaoDuTime'].hide();
            }
        }
    }

    function onQingZhaoChange(obj) {
        if (+obj.Value == 8) {
            obj.FormItem.next.show().next.show().next.show();
        } else {
            obj.FormItem.next.hide().next.hide().next.hide();
        }
    }

    function onToolBarClick(obj) {
        switch (+obj.Name) {
            case 116:  //上传文件
                popTips = new $.UI.Tips({ comMode: 'x-auto', width: 500, height: 400, y: 100, head_h: 30, ifMask: true, ifClose: true, title: '文件上传', icon: 'icon-glyph-arrow-up' });
                new $.UI.FileUploader({ p:
                    popTips.body,
                    onComplete: function (objs) {
                        $.Util.ajax({
                            args: 'm=SYS_TABLE_BASE&table=PRO_MG&action=updateFilesById&link=' + objs.currIds.join(',') + '&id=' + args.proId,
                            onSuccess: function () { fileList.refresh(); }
                        });
                    }
                });
                break;
            case 117:  //工程设计量
                onDesignClick(obj);
                break;
            case 118:  //工程领料
                popTips = new $.UI.Tips({ head_h: 0, comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 940, height: 800 });
                new $.UI.View({ p: popTips.body, url: 'View/depository/OutTask.js', ifEdit: true, proId: args.proId, proTitle: infoVal.proCode });
                break;
            case 119:  //工程退料
                popTips = new $.UI.Tips({ head_h: 0, comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 940, height: 800 });
                new $.UI.View({ p: popTips.body, url: 'View/depository/BackTask.js', ifEdit: true, proId: args.proId, proTitle: infoVal.proCode });
                break;
        }
    }

    function onEditPro() {
        taskInfo.set('state', 'Update').set('updateApi', 'm=SYS_CM_PRO&action=updateProByID');
        taskInfo.items['bTime'].setVisibled(true);
        taskInfo.items['execTeamLeader'].setVisibled(true);
        if (currState == 506) {
            taskInfo.items['execTeam'].setVisibled(true);
            taskInfo.items['execTeamLeader'].setVisibled(true);
        }
        if (currState > 506) { taskInfo.items['eTime'].setVisibled(true); }
        if (currState > 507) { taskInfo.items['feedBack'].setVisibled(true); }
    }

    function onInit() {
        subBtn.setText('修改工程信息').setIcon('fa fa-edit');
        if ($.global.arrowTips) { $.global.arrowTips.remove(); $.global.arrowTips = null; }
        taskInfo.loadDataByID(args.proId, function (obj) {
            var _vObj = obj.Value; infoVal = _vObj;
            var _wfId = +_vObj.wfId, _accountWfId = +_vObj.accountWfId;
            infoTips.setTitle('修改工程<font class="c_6">(' + _vObj.proCode + ')</font>').setIcon('icon-glyph-edit');
            taskInfo.setHidden('currState', _vObj.state); currState = _vObj.state;
            if (+_vObj.ifRights) { ifEdit = true; } else { ifEdit = false; }
            if (_wfId) { infoBtns.addItem({ text: '查询分包商申请流程', icon: 'fa fa-search', name: _wfId, onClick: onSearchClick }); }
            if (_accountWfId) { infoBtns.addItem({ text: '查询分包费用结算流程', icon: 'fa fa-search', name: _accountWfId, onClick: onQueryAccount }); }
            switch (+_vObj.state) {
                case 506:  //未开工
                    delayShowBtns(function () {
                        infoBtns.show();
                        infoBtns.items['116'].show();
                        infoBtns.items['117'].show();
                        infoBtns.items['118'].hide();
                        infoBtns.items['119'].hide();
                    });
                    if (+_vObj.ifRights) {
                        onEditPro();
                        if (!_wfId) { fBtns.show(); } else { fBtns.hide(); }
                    } else {
                        fBtns.hide();
                    }
                    break;
                case 507:  //在建
                    if (+obj.Value.ifRights) {
                        onEditPro();
                        delayShowBtns(function () {
                            infoBtns.show();
                            infoBtns.items['116'].show();
                            infoBtns.items['117'].show();
                            infoBtns.items['118'].show();
                            infoBtns.items['119'].show();
                        });
                        fBtns.show();
                    } else {
                        fBtns.hide();
                    }
                    break;
                case 508:  //竣工
                    if (+obj.Value.ifRights) {
                        onEditPro();
                        delayShowBtns(function () {
                            infoBtns.show();
                            infoBtns.items['116'].show();
                            infoBtns.items['117'].show();
                            infoBtns.items['118'].hide();
                            infoBtns.items['119'].show();
                        });
                        fBtns.show();
                        fBtns.items[0].hide();
                        fBtns.addItem({ name: 'applyWF', text: '发起分包费用结算', icon: 'fa fa-hand-o-up', css: 'margin-left:105px;', skin: 'Button-blue', onClick: applyWF });
                    } else {
                        fBtns.hide();
                    }
                    break;
                case 509:  //审核结算
                    fBtns.hide();
                    delayShowBtns(function () {
                        infoBtns.show();
                        infoBtns.items['116'].show();
                        infoBtns.items['117'].show();
                        infoBtns.items['118'].hide();
                        infoBtns.items['119'].show();
                    });
                    break;
                case 510:  //送审
                    fBtns.hide();
                    delayShowBtns(function () {
                        infoBtns.show();
                        infoBtns.items['116'].show();
                        infoBtns.items['117'].show();
                        infoBtns.items['118'].hide();
                        infoBtns.items['119'].show();
                    });
                    infoBtns.addItem({ text: '工程费用结算', icon: 'fa fa-calculator', name: 'account', onClick: onAccount });
                    break;
                case 511:   //已结
                    infoBtns.addItem({ text: '工程费用结算', icon: 'fa fa-calculator', name: 'account', onClick: onAccount });
                    infoBtns.show();
                    fBtns.hide();
                    infoBtns.items['116'].show();
                    infoBtns.items['117'].show();
                    infoBtns.items['118'].show();
                    infoBtns.items['119'].show();
                    break;
            }
        }, true);
        fileList.loadAjax({ args: 'm=SYS_TABLE_BASE&action=getFilesById&table=PRO_MG&id=' + args.proId });
    }

    function onAccount(obj) {
        initArrowTips(obj, 'width:600px;height:350px;padding:5px 10px 5px 10px;');
        var _fiAry = [
            { name: 'outCost', title: '对外结算费', comType: 'KeyInput', dataType: 'double', group: { width: 280, name: 'g1'} },
            { name: 'inCost', title: '对内结算费', comType: 'Label', group: 'g1' },
            { name: 'faZhanCost', title: '业务发展中心结算费', comType: 'Label', group: 'g1' },
            { name: 'yinYeCost', title: '营业所结算费', comType: 'Label', group: 'g1' },
            { name: 'bateOneCost', title: '按40%结算费', comType: 'Label', group: 'g1' },
            { name: 'bateTwoCost', title: '按8.3结算费', comType: 'Label', group: 'g1' },
            { name: 'proFitCost', title: '利润', comType: 'Label', group: 'g1' },
            { name: 'area', title: '配套面积', comType: 'Label', group: 'g1' },
            { name: 'personCost', title: '外包人工费', comType: 'Label', group: 'g1' },
            { name: 'preCaiLiaoCost', title: '预决算材料费', comType: 'Label', group: { width: 280, name: 'g2'} },
            { name: 'realCaiLiaoCost', title: '实际领用材料费', comType: 'Label', group: 'g2' },
            { name: 'repairCost', title: '路面修理费', comType: 'Label', group: 'g2' },
            { name: 'duJianCost', title: '桥管土建费', comType: 'Label', group: 'g2' },
            { name: 'heTongCost', title: '合同金额', comType: 'Label', group: 'g2' },
            { name: 'prePayCost', title: '预付款', comType: 'Label', group: 'g2' },
            { name: 'backUpOneCost', title: '备用一', comType: 'Label', group: 'g2' },
            { name: 'backUpTwoCost', title: '备用二', comType: 'Label', group: 'g2' },
            { name: 'backUpThreeCost', title: '备用三', comType: 'Label', group: 'g2' }
        ];
        var _form = $.global.arrowTips.init({ type: 'Form', items: _fiAry, ifFixedHeight: false, updateApi: 'm=SYS_CM_PRO&action=updateStateByID&proId=' + args.proId, onSubmitSuccess: function () { if (_form.get('state') == 'Update') { MTips.show('提交成功', 'ok'); if ($.global.arrowTips) { $.global.arrowTips.remove(); $.global.arrowTips = null; }; args.proList.refresh(); } } }, true);
        _form.loadDataByWhereCondition('m=SYS_TABLE_BASE&action=getByCondition&table=PRO_SC_ACCOUNT_INFO&jsonCondition={"proId": ' + args.proId + '}');
    }

    function applyWF(obj) {
        initArrowTips(obj);
        $.global.arrowTips.init({ type: 'View', url: 'View/project/ProjectMete.js', proId: args.proId, cost: +infoVal.realCost, dType: 1, onSubmitSuccess: function () { fBtns.hide(); } });
    }

    function onQueryAccount(obj) {
        initArrowTips(obj);
        $.global.arrowTips.init({ type: 'View', url: 'View/project/SettlementTariffFlowInfo.js', wfId: +obj.Name, proId: args.proId });
    }

    function onSearchClick(obj) {
        initArrowTips(obj);
        $.global.arrowTips.init({ type: 'View', url: 'View/workflow/WorkFlowInfo.js', instanceId: +obj.Name, ifEdit: false });
    }

    function onDesignClick(obj) {
        initArrowTips(obj);
        if (!_pCost) { _pCost = +infoVal.planCost; }
        if (+currState > 506 && _pCost < 1) { _pCost = 1; }
        $.global.arrowTips.init({ 
            type: 'View', 
            url: 'View/project/ProjectDesignMete.js', 
            proId: args.proId, 
            cost: _pCost, 
            dType: 0, 
            onSubmitSuccess: function () { 
                _pCost = 100; 
                } 
                });
    }

    function initArrowTips(obj, css) {
        if ($.global.arrowTips) { $.global.arrowTips.remove(); $.global.arrowTips = null; } //F1F3F4
        var _css = css || 'width:915px;height:520px;padding:5px 10px 5px 10px;';
        $.global.arrowTips = new $.UI.PopDialog({ p: $DB, ePop: obj.Owner, ifClose: true, arrowBBC: '#FFF', css: _css });
        $.global.arrowTips.get('owner').dc('oh');
    }
    function delayShowBtns(onCB) { if (!infoBtns.items['116']) { setTimeout(function () { delayShowBtns(onCB); }, 200); return; }; onCB(); }
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