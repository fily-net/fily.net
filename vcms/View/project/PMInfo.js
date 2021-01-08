$.NameSpace('$View.project');
$View.project.PMInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, proId: 0, proList: null, typeId: 0 };
    var coms = {}, infoBody, info = null;

    var _tabs = {};

    var _tabObject = {
        'detail': { name: 'detail', url: 'View/project/PMInfoForm.js', type: 'tab', icon: 'fa fa-list', text: '表单明细' },
        'files': { name: 'files', url: 'View/project/PMInfoFiles.js', type: 'tab', icon: 'fa fa-file-o', text: '资源文件' },
        'shejiliang': { name: 'shejiliang', url: 'View/project/ProjectDesignMete.js', type: 'tab', icon: 'fa fa-list-alt', text: '设计量' },
        'duiwu': { name: 'duiwu', url: 'View/project/DuiWuApplyWF.js', type: 'tab', icon: 'fa fa-sliders', text: '队伍会签' },
        'hetong': { name: 'hetong', url: 'View/project/HeTongWF.js', type: 'tab', icon: 'fa fa-code-fork', text: '合同会签' },
        'kaigong': { name: 'kaigong', url: 'View/project/KaiGongWF.js', type: 'tab', icon: 'fa fa-pencil', text: '开工报告审批' },
        'kaigongbengfang': { name: 'kaigong', url: 'View/project/KaiGongBengFangWF.js', type: 'tab', icon: 'fa fa-pencil', text: '泵房开工报告审批' },
        'lingliao': { name: 'lingliao', url: 'View/project/ProjectReceiveDetail.js', type: 'tab', icon: 'fa fa-cart-plus', text: '领料详情' },
        'tuiliao': { name: 'tuiliao', url: 'View/project/BackTask.js', type: 'tab', icon: 'fa fa-cart-arrow-down', text: '退料' },
        'qingsuan': { name: 'qingsuan', url: 'View/project/MSCheck.js', type: 'tab', icon: 'fa fa-cart-plus', text: '物资结算' },
        //'projectmete': { name: 'projectmete', url: 'View/project/ProjectMete.js', type: 'tab', icon: 'fa fa-list', text: '工程量结算' },
        'costinfo': { name: 'costinfo', url: 'View/project/PMCostSettlement.js', type: 'tab', icon: 'fa fa-wrench', text: '施工信息' },
        'shigong': { name: 'shigong', url: 'View/project/ProjectShiGongInfo.js', type: 'tab', icon: 'fa fa-table', text: '施工信息' },
        'jungong': { name: 'jungong', url: 'View/project/ProjectJunGongInfo.js', type: 'tab', icon: 'fa fa-table', text: '竣工信息' },
        'projectjiesuan': { name: 'confirm', url: 'View/project/ProjectJieSuanWF.js', type: 'tab', icon: 'fa fa-sheqel', text: '外包人工结算' },
        'jiesuan': { name: 'jiesuan', url: 'View/project/CostWF.js', type: 'tab', icon: 'fa fa-calculator', text: '审核结算' }
    };

    var _extAry = [
        { name: 'detail', url: 'View/project/PMInfoForm.js', type: 'tab', icon: 'fa fa-list', text: '表单明细' }
        //{ name: 'files', url: 'View/project/PMInfoFiles.js', type: 'tab', icon: 'fa fa-file-o', text: '资源文件' }
    ];
    
    function setDefault(j) {
        args = $.Util.initArgs(j, args);
    }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _toolBarAry = [];
        if (!args.proList) {
            _toolBarAry.push({ name: 'back', url: 'View/project/PMInfoForm.js', icon: 'fa fa-arrow-left', text: '返回工程列表' });
        }
        var comArgs = {
            'infoBase': { head_h: 40, cn: 'b0'  },
            'infoLayout': { min: 244, max: 600, start: 500, dir: 'we', dirLock: 2 },
            'extTab': { items: _extAry, skin: 'ButtonSet-tab fl', itemSkin: 'Button-tab', onClick: onTypeClick },
            'toolBar': { items: _toolBarAry, skin: 'ButtonSet-default fr', itemSkin: 'Button-blue', css: 'margin-right:10px;margin-top:3px;', onClick: onToolBarClick }
        }
        var struct = {
            p: owner,
            type: 'BaseDiv',
            name: 'infoBase',
            head: [
                { name: 'extTab', type: 'ButtonSet' },
                { name: 'toolBar', type: 'ButtonSet' }
            ]
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        infoBody = coms.infoBase.body;
        onInit();
    }

    function onTypeClick(obj) {
        if (!obj.Args.url) { return false; }
        new $.UI.View({ info: info, pmInfo: me, p: infoBody, url: obj.Args.url, proId: args.proId, proCode: info.proCode, proList: args.proList, onSubmitSuccess: onFormSubmitSuccess });
    }

    function onToolBarClick(obj) {
        switch (obj.name) {
            case 'back':
                new $.UI.View({ p: args.p, url: 'View/project/PMFullScreen.js', typeId: args.typeId });
                break;
        }
    }

    me.fireTabClick = function (value) {
        coms.extTab.fireClick(value);
    }

    function onInit() {
        loadProInfoById(function (info) {
            console.log(info);
           // coms.extTab.reLoadItems([]);
            //addTab('detail');
            //addTab('files');

            if (+info.planCost) {
                addTab('shejiliang');
            } else {
                if (info.ifSelf) {
                    addTab('shejiliang');
                }
            }
            if (+info.kaiGongWfId) {
                if (info.proType === '770') {
                    addTab('kaigongbengfang');
                } else {
                    addTab('kaigong');
                }
            }

            if (+info.duiWuApplyWfId) {
                addTab('duiwu');
            }
            if (+info.heTongWfId) {
                addTab('hetong');
            }

            

            if (+info.state >= 507) {
                addTab('lingliao');
                /*
                if (+info.tuiLiaoWfId) {
                    addTab('tuiliao');
                }*/
                if (+info.ifRights) {
                    addTab('costinfo');
                    //addTab('jungong');
                    //addTab('qingsuan');
                }

                if (+info.projectJieSuanWfId) {
                    addTab('projectjiesuan');
                }
                if (+info.jieSuanWfId) {
                    addTab('jiesuan');
                }
            }
            
            me.fireTabClick(coms.extTab.length()-1);
        });
    }

    function addTab(name) {
        if (!coms.extTab.items[name]&&!_tabs[name]) {
            coms.extTab.addItem(_tabObject[name]);
            _tabs[name] = true;
        }
    }

    function loadProInfoById(callback) {
        var _fields = 'id,duiWuApplyWfId,heTongWfId,kaiGongWfId,jieSuanWfId,projectJieSuanWfId,tuiLiaoWfId,confirmWfId,msPlanCost,msRealCost,proCode,state,proType,dbo.SYS_TRANS_GT(proType) as proType_trans,proNature as proNature,dbo.SYS_TRANS_GT(proNature) as proNature_trans,proArea as proArea,dbo.SYS_TRANS_GT(proArea) as proArea_trans,address as address,customer as customer,contact as contact,proSource as proSource,dbo.SYS_TRANS_GT(proSource) as proSource_trans,acreage as acreage,outPutValue as outPutValue,dbo.SYS_FORMAT_TIME(collectTime) as collectTime,dbo.SYS_FORMAT_TIME(issuedTime) as issuedTime,feedBack as feedBack,dbo.SYS_TRANS_GT(feedBack) as feedBack_trans,execDept as execDept,dbo.SYS_TRANS_GT(execDept) as execDept_trans,execTeam as execTeam,dbo.SYS_TRANS_CPN(execTeam) as execTeam_trans,dbo.SYS_FORMAT_TIME(deadline) as deadline,execTeamLeader as execTeamLeader,dbo.SYS_FORMAT_TIME(bTime) as bTime,dbo.SYS_FORMAT_TIME(shuiTestTime) as shuiTestTime,dbo.SYS_FORMAT_TIME(xiaoDuTime) as xiaoDuTime,dbo.SYS_FORMAT_TIME(eTime) as eTime,qingZhao as qingZhao,dbo.SYS_TRANS_GT(qingZhao) as qingZhao_trans,dbo.SYS_FORMAT_TIME(handleTime) as handleTime,dbo.SYS_FORMAT_TIME(allowTime) as allowTime,payCost as payCost,note as note,dbo.SYS_TRANS_RIGHTS(' + $.ck.get('SESSIONID') + ', users,roles,0) as ifRights,state,proCode,biJiaWfId,planCost,realCost,cPerson';
        var _url = 'm=SYS_TABLE_BASE&action=getByID&table=PRO_MG&dataType=json&id=' + args.proId + '&keyFields=' + _fields;
        $.Util.ajax({
            args: _url,
            onSuccess: function (data) {
                info = eval(data.get(0) || '[]')[0];
                if (+info.cPerson == +$.ck.get('SESSIONID')) {
                    info.ifSelf = true;
                }
                callback(info);
            }
        });
    }

   

    function onFormSubmitSuccess(obj) {
        if (args.proList) {
            args.proList.refresh({ onSuccess: function (obj) { args.proList.fireClick(0); } });
        } else {
            onInit();
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