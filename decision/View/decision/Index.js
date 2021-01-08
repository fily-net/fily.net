$.NameSpace('$View.decision');
$View.decision.Index = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, gtRootID: 156 }, popTips, infoView, currProId;
    var coms = {}, typeTab, mainList;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var hAry = [
            { type: 'checkbox', width: 40 },
            { name: 'nodeName', type: 'attr' },
            { title: '项目名称', name: 'nodeName', ifEnabledTips: true, type: 'none', width: 120 },
            { title: '项目进度', name: 'schedule', type: 'process', width: 80 },
            { title: '当前流程', name: 'step', ifTrans: true, type: 'none', width: 100 },
            { title: '当前状态', name: 'state', ifTrans: true, type: 'none', width: 100 },
            { title: '创建者', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 60 },
            { title: '创建时间', name: 'cTime', type: 'date', width: 125 },
            { title: '预计开始时间', name: 'preSTime', type: 'date', width: 125 },
            { title: '预计结束时间', name: 'preETime', type: 'date', width: 125 },
            { title: '备注', name: 'note', ifEnabledTips: true, type: 'none', width: 180 }
        ];
        var comArgs = {
            'rootLayout': { min: 300, max: 500, isRoot: 1, start: 375, dir: 'ns', dirLock: 2 },
            'rootDiv': { head_h: 35 },
            'typeTab': { gtID: 157, gtType: 'tab', items: [{ name: 'all', type: 'tab', nn: '所有项目', text: '所有项目', ifPress: true}], skin: 'ButtonSet-tab fl', itemSkin: 'Button-tab', onClick: onTypeClick, onSuccess: onLoadTypeSuccess },
            'toolTab': { gtID: 186, ifRights: true, itemAlign: 'right', items: [{ name: 'toNormal', text: '切换到标准模式', icon: 'icon-glyph-retweet'}], skin: 'ButtonSet-default mr10', onClick: onToolClick },
            'mainList': { aHeader: hAry, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onTDClick: onListClick },
            'infoView': { url: 'View/decision/PMInfo.js', onNext: function () { mainList.refresh(); }, onLoad: function (view, self) { infoView = view; } }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'rootLayout',
            eHead: {
                type: 'BaseDiv',
                name: 'rootDiv',
                head: [
                    { name: 'typeTab', type: 'ButtonSet' },
                    { name: 'toolTab', type: 'ButtonSet' }
                ],
                body: { type: 'List', name: 'mainList' }
            },
            eFoot: { type: 'View', name: 'infoView' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        typeTab = coms.typeTab; mainList = coms.mainList; typeTab.fireClick(0);
    }
    function onLoadTypeSuccess(obj) {
        if (!obj) { obj = args.pTypeObj; }
        if (!obj) { return; }
        if (!args.pTypeObj) { args.pTypeObj = obj; }
        var _ids = [], _items = obj.items, _btns = obj.ButtonSet.items;
        for (var i = 0, _iLen = _items.length; i < _iLen; i++) { _ids.push(_items[i].name); }
        $.Util.ajax({
            args: 'm=SYS_CM_PM&action=getNonOverNum&dataType=json&proTypes=' + _ids.join(','),
            onSuccess: function (d) {
                var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length, _aCount = 0;
                for (var i = 0; i < _dLen; i++) {
                    var _dObj = _dAry[i], _btn = _btns[_dObj.name];
                    _aCount += +_dObj.count;
                    _btn.setText(_btn.get('nn') + '<font style="color:red;padding:0px 5px;">(' + _dObj.count + ')</font>')
                }
                _btns['all'].setText(_btns['all'].get('nn') + '<font style="color:red;padding:0px 5px;">(' + _aCount + ')</font>')
            }
        });
    }
    function onTypeClick(obj) {
        var _name = obj.Name, _jc = '';
        if (!isNaN(+_name)) { _jc = '&jsonCondition={"proType":' + _name + '}'; }
        mainList.loadAjax({ args: 'm=SYS_CM_PM&action=pagingForRightsPM' + _jc, cbFn: { onSuccess: function (obj) { if (obj.Length) { mainList.fireClick(0); } else { infoView.loadPro(0); } } } });
    }
    function onListClick(obj) { var _rid = obj.Target.getAttr('rowid'); if (currProId == _rid) { return; } currProId = _rid; delayShowInfo(_rid); }
    function onToolClick(obj) {
        if (obj.Name == 'toNormal') { new $.UI.View({ p: args.p, url: 'View/decision/IndexNormal.js' }); return; }
        switch (+obj.Name) {
            case 189:
                //新建项目
                var infoAry = [
                    { title: '项目名称', name: 'nodeName', comType: 'TextArea', req: true },
                    { title: '项目类型', name: 'proType', comType: 'Select', gtID: 157, onChange: onProTypeChange, req: true },
                    { title: '图片', name: 'avatars', comType: 'FileUploader' },
                    { title: '预计开始时间', name: 'preSTime', comType: 'Date' },
                    { title: '预计结束时间', name: 'preETime', comType: 'EndDate', matchItem: 'preSTime' },
                    { title: '备注', name: 'note', comType: 'TextArea' }
                ];
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建项目', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 350, ifFixedHeight: false });
                popTips.Form = new $.UI.Form({ p: popTips.body, insertApi: 'm=SYS_TABLE_BASE&table=pm_project&action=addRow', items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; mainList.refresh(); onLoadTypeSuccess(); } });
                break;
            case 1:
                //修改项目
                var infoAry = [
                    { title: '项目名称', name: 'nodeName', comType: 'TextArea', req: true },
                    { title: '项目类型', name: 'proType', comType: 'Select', gtID: 157, onChange: onProTypeChange, req: true },
                    { title: '图片', name: 'avatars', comType: 'FileUploader' },
                    { title: '预计开始时间', name: 'preSTime', comType: 'Date' },
                    { title: '预计结束时间', name: 'preETime', comType: 'EndDate', matchItem: 'preSTime' },
                    { title: '备注', name: 'note', comType: 'TextArea' }
                ];
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建项目', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 350, ifFixedHeight: false });
                popTips.Form = new $.UI.Form({ p: popTips.body, insertApi: 'm=SYS_TABLE_BASE&table=pm_project&action=addRow', items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; mainList.refresh(); onLoadTypeSuccess(); } });
                break;
            case 190:
                //删除项目
                var _ids = mainList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择要删除的行', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除' + _ids.length + '条记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_TREE&table=pm_project&action=deleteByIDs&ids=' + _ids.join(','),
                        onSuccess: function () { MTips.show('删除成功', 'ok'); mainList.refresh(); onLoadTypeSuccess(); }
                    })
                });
                break;
            case 191:
                popTips = new $.UI.Tips({ width: 700, height: 500, icon: 'icon-glyph-list-alt', comMode: 'auto', title: '功能模块对照表管理', head_h: 25, ifMask: true, ifDrag: false, ifClose: true });
                new $.UI.View({ p: popTips.body, url: 'View/common/TreeList.js', table: 'SYS_CM_GLOBAL_TABLE', rootID: args.gtRootID });
                //管理对照表
                break;
            case 192:
                popTips = new $.UI.Tips({ width: 700, height: 500, icon: 'icon-glyph-list-alt', comMode: 'auto', title: '功能模块对照表管理', head_h: 25, foot_h: 33, ifMask: true, ifDrag: false, ifClose: true });
                new $.UI.View({ p: popTips.body, url: 'View/rights/Public.js', table: 'SYS_CM_GLOBAL_TABLE', rootID: args.gtRootID, onLoad: function (view, self) { popTips.public = view; } });
                new $.UI.Button({ p: popTips.foot.css('border-top:1px solid #DBDBDB;'), text: '保存设置', icon: 'icon-glyph-hand-up', align: 'right', cn: 'mr10', onClick: function () { popTips.public.saveSetting(); } });
                //权限管理
                break;
            case 193:
                //保存为Excel
                MTips.show('正在研发中...', 'warn');
                //mainList.saveAsExecl('炫动传播内容产品决策支持系统-项目列表');
                break;
            case 194:
                //打印
                (new $.Util.printer(mainList.get('p'))).print();
                break;
        }
    }

    function delayShowInfo(proId) {
        if (!infoView) { setTimeout(function () { delayShowInfo(proId); }, 200); return; }
        infoView.loadPro(proId);
    }

    function onProTypeChange(obj) {
        $.Util.ajax({
            args: 'm=SYS_CM_PM&action=getStepState&proType=' + obj.Value,
            onSuccess: function (d) { obj.Form.setExt('step', +d.get(0)).setExt('state', +d.get(1)); }
        });
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