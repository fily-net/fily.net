$.NameSpace('$View.tcdic');
$View.tcdic.BBS = function (j) {
    var me = this, _fn = function () { };
    var owner, coms = {};
    var args = { p: $DB };
    var mainList, toolBar, popTips, bInfo, curr;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var headAry = [
            { title: '案例名称', name: 'title', type: 'none', width: 250 },
            { title: '创建人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 120 },
            { title: '回复', name: 'sons', type: 'none', width: 120 },
            { title: '状态/类型', name: 'type', type: 'none', ifTrans: true, width: 120 },
            { title: '最后发表', name: 'mTime', type: 'date', width: 180 }
        ];
        var comArgs = {
            'root': { min: 200, max: 800, isRoot: 1, start: 350, dir: 'ns', dirLock: 2 },
            'topBaseDiv': { head_h: 33 },
            'typeTab': { items: [{ name: 'all', icon: 'icon-glyph-align-justify', text: '全部', type: 'tab'}], loadApi: 'm=SYS_TABLE_TREE&action=getNodesByCondition&table=SYS_CM_GLOBAL_TABLE&jsonCondition={"pid,in":"818"}&keyFields=nodeName as text, nodeName as nn, id as name, icon', btnType: 'tab', onClick: onTabClick },
            'toolBar': { gbsID: 22, itemAlign: 'right', onClick: onToolBarClick },
            'mainList': { aHeader: headAry, onTDClick: function (obj) { delayShowInfo(obj.Target.getAttr('rowid')); }, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onSuccess: function (obj) { if (obj.Length) { obj.List.fireClick(0); } } },
            'info': { url: 'View/tcdic/BBSInfo.js', onLoad: function (view, self) { bInfo = view; } }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'root',
            eHead: {
                type: 'BaseDiv',
                name: 'topBaseDiv',
                head: [
                    { name: 'typeTab', type: 'ButtonSet' },
                    { name: 'toolBar', type: 'ButtonSet' }
                ],
                body: { name: 'mainList', type: 'List' }
            },
            eFoot: { type: 'View', name: 'info' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        mainList = coms.mainList; toolBar = coms.toolBar; coms.typeTab.fireClick('all');
    }

    function delayShowInfo(id) {
        if (!bInfo) { setTimeout(function () { delayShowInfo(id); }, 200); return; }
        curr = id; bInfo.loadByID(id);
    }

    function onToolBarClick(obj) {
        switch (+obj.Name) {
            case 23:
                if (popTips) {
                    popTips.show();
                    popTips.Form.reset();
                } else {
                    var fiAry = [
                        { title: '案例名称', name: 'title', comType: 'Input', width: 320, req: true },
                        { title: '类型', name: 'type', comType: 'Select', gtID: 818, width: 320, req: true },
                        { title: '附件', name: 'link', comType: 'FileUploader', width: 320 },
                        { title: '内容', name: 'content', comType: 'RichText', width: 450, req: true }
                    ];
                    popTips = new $.UI.Tips({ title: '发布', icon: 'icon-glyph-hand-up', head_h: 30, ifClose: true, ifDrag: false, comMode: 'x-auto', y: 120, width: 600, ifFixedHeight: false, ifMask: true, onClose: function () { popTips.hide(); return false; } });
                    popTips.Form = new $.UI.Form({ p: popTips.body, extSubmitVal: { pid: 0 }, insertApi: 'm=SYS_TABLE_TREE&table=SYS_CM_FORUM&action=addTreeNode', items: fiAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.hide(); mainList.refresh(); } });
                }
                break;
            case 24:
                if (!curr) { MTips.show('请先选择要删除的记录', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_CM_OA&action=deleteMeetingByID&id=' + curr,
                        onSuccess: function () { MTips.show('删除成功', 'ok'); mainList.refresh(); },
                        onError: function () { MTips.show('删除失败', 'error'); }
                    });
                });
                break;
            case 25:

                break;
            case 26:

                break;
        }
    }

    function onTabClick(obj) {
        var _name = obj.Name, _jc = '';
        if (_name == 'all') {
            _jc = '{"pid":0}';
        } else {
            if (obj.Button.get('flag')) {
                _jc = '{"pid":0,"state":' + _name + '}';
            } else {
                _jc = '{"pid":0,"type":' + _name + '}';
            }
        }
        mainList.loadAjax({ args: 'm=SYS_TABLE_TREE&table=SYS_CM_FORUM&action=pagingForTreeList&jsonCondition=' + _jc });
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