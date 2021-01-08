$.NameSpace('$View.project');
$View.project.SettlementTariffStandard = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, rootID: 520 };
    var coms = {}, treeList, mainList, popTips, guiGeId, currObj;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { name: 'id', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'type', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'depth', type: 'attr' },
            { name: 'nodeName', type: 'none', ifEdit: true }
        ];
        var hAry = [
            { title: 'ID', name: 'id', type: 'attr' },
            { type: 'checkbox', width: 40 },
            { title: '规格', name: 'guiGeId', ifTrans: true, type: 'none', width: 150 },
            { title: '路面', name: 'luMianId', ifTrans: true, type: 'none', width: 150 },
            { title: '单价', name: 'price', type: 'none', width: 100, ifEdit: true, comType: 'KeyInput', dataType: 'double' },
            { title: '创建人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'select', width: 150 },
            { title: '创建时间', name: 'cTime', type: 'date', width: 130 },
        ];
        var comArgs = {
            'rootTips': { head_h: 30, foot_h: 0, cn: 'b0', title: '工程结算资费标准', icon: 'icon-glyph-align-left', toolBarSkin: 'mr5 Button-default', gbsID: 128, onToolBarClick: onToolBarClick },
            'rootLayout': { min: 180, max: 300, isRoot: 1, start: 200, dir: 'we', dirLock: 1 },
            'treeList': { aHeader: _mHeaderAry, style: 'tree:nodeName', table: 'SYS_CM_GLOBAL_TABLE', loadApi: 'm=SYS_TABLE_TREE&action=getNodesByPid&table=SYS_CM_GLOBAL_TABLE&pid=' + args.rootID, onTDClick: onTypeClick, onSuccess: function (obj) { obj.List.fireClick(0); } },
            'mainList': { aHeader: hAry, updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=PRO_SC_STANDARD', colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1}} }
        };
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootTips',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'List', name: 'treeList' },
                eFoot: { type: 'List', name: 'mainList' }
            }
        };
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        treeList = coms.treeList; mainList = coms.mainList;
    }


    function onTypeClick(obj) {
        currObj = obj; guiGeId = obj.Target.getAttr('rowid');
        mainList.loadAjax({ args: 'm=SYS_TABLE_BASE&action=pagingForList&table=PRO_SC_STANDARD&jsonCondition={"guiGeId": ' + guiGeId + '}' });
    }

    function onToolBarClick(obj) {
        var _pid = guiGeId || args.rootID;
        switch (+obj.Name) {
            case 129:
                initArrowTips(obj, 'max-width:160px;padding:5px 10px 5px 10px;');
                $.global.arrowTips.init({
                    type: 'Form', ifFixedHeight: false, state: 'Insert',
                    btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '新建(Add)', icon: 'icon-glyph-plus', align: 'right'}],
                    items: [{ name: 'nodeName', comType: 'TextArea', ifHead: false, req: true}],
                    insertApi: 'm=SYS_TABLE_TREE&action=addTreeNodeByPid&table=SYS_CM_GLOBAL_TABLE&pid=' + _pid
                }).show().evt('onSubmitSuccess', function (j) { treeList.refresh(); removeArrowTips(); MTips.show('新建成功', 'ok'); });
                break;
            case 130:
                if (!guiGeId || !currObj) { MTips.show('请选择要删除的规格', 'warn'); return false; }
                MConfirm.setWidth(250).show('<font color="red">确定删除该规格?</font>').evt('onOk', function () {
                    $.Util.ajax({ args: 'm=SYS_TABLE_BASE&action=deleteByID&table=SYS_CM_GLOBAL_TABLE&id=' + guiGeId, onSuccess: function () { MTips.show('删除成功', 'ok'); currObj.Target.eTr.r(); currObj = null; guiGeId = null; } });
                });
                break;
            case 131:
                if (!guiGeId) { MTips.show('请选择规格', 'warn'); return false; }
                initArrowTips(obj, 'max-width:300px;padding:0px;', '#F1F3F4');
                $.global.arrowTips.init({
                    type: 'Form', ifFixedHeight: false, state: 'Insert', title: '添加价格条目', head_h: 30,
                    btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '新建(Add)', icon: 'icon-glyph-plus', css: 'margin-right:38px;', align: 'right'}],
                    items: [
                        { title: '路面', name: 'luMianId', comType: 'Select', gtID: 710, group: { name: 'g1', width: 302} },
                        { title: '单价', name: 'price', comType: 'KeyInput', dataType: 'double', group: 'g1' }
                    ],
                    extSubmitVal: { guiGeId: guiGeId },
                    insertApi: 'm=SYS_TABLE_BASE&action=addRow&table=PRO_SC_STANDARD'
                }).show().evt('onSubmitSuccess', function (j) { mainList.refresh(); removeArrowTips(); MTips.show('新建成功', 'ok'); });
                break;
            case 132:
                var _selIds = mainList.getAttr('selIds') || [];
                if (!_selIds.length) { MTips.show('请选择要删除的价格条目', 'warn'); return false; }
                MConfirm.setWidth(250).show('<font color="red">确定删除' + _selIds.length + '条价格条目?</font>').evt('onOk', function () {
                    $.Util.ajax({ args: 'm=SYS_TABLE_BASE&action=deleteByIDs&table=PRO_SC_STANDARD&ids=' + _selIds.join(','), onSuccess: function () { MTips.show('删除成功', 'ok'); mainList.refresh(); } });
                });
                break;
        }
    }

    function initArrowTips(obj, css, bbc) {
        if ($.global.arrowTips) { $.global.arrowTips.remove(); $.global.arrowTips = null; }
        $.global.arrowTips = new $.UI.PopDialog({ p: $DB, ePop: obj.Owner, ifClose: true, arrowBBC: (bbc || '#FFF'), css: css });
        $.global.arrowTips.get('owner').dc('oh');
    }
    function removeArrowTips() { if ($.global.arrowTips) { $.global.arrowTips.remove(); $.global.arrowTips = null; }; }
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