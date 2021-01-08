$.NameSpace('$View.bug');
$View.bug.BugList = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, stateId: 584, levId: 585, table: 'SYS_BUGS', toolBarId: 134 };
    var coms = {}, mainList, infoF, popTips, currID, eHistroy, cPerson;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _hAry = [
            { name: 'id', type: 'attr' },
            { name: 'cPerson', type: 'attr' },
            { name: 'cb', type: 'checkbox', width: 50 },
            { title: '状态', name: 'state', type: 'select', width: 90, ifFilter: true, filterItems: ['equal'], gtID: args.stateId },
            { title: '优先级', name: 'lev', type: 'select', width: 90, ifFilter: true, filterItems: ['equal'], gtID: args.levId },
            { title: '标题/主题', name: 'title', type: 'none', width: 250, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
            { title: '指派给...', name: 'assignTo', ifTrans: true, type: 'select', trans: 'SYS_TRANS_USER', ifFilter: true, filterItems: ['equal'], gtID: 279, width: 120 },
            { title: '开始时间', name: 'bTime', type: 'date', width: 130, ifFilter: true, filterItems: ['equal'] },
            { title: '更新于', name: 'mTime', type: 'date', width: 130, ifFilter: true, filterItems: ['equal'] },
            { title: '创建于', name: 'cTime', type: 'date', width: 130, ifFilter: true, filterItems: ['equal'] },
            { title: '描述', name: 'note', type: 'none', width: 230, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] }
        ];
        var _fiArray = [
            { name: 'title', title: '主题：', comType: 'Input', group: { width: 260, name: 'g1' }, req: true },
            { name: 'state', title: '状态：', comType: 'Select', group: 'g1', gtID: args.stateId },
            { name: 'lev', title: '优先级：', comType: 'Select', group: 'g1', gtID: args.levId },
            { name: 'bTime', title: '开始时间：', comType: 'Date', group: 'g1' },
            { name: 'planEndTime', title: '预计完成时间：', comType: 'EndDate', matchItem: 'bTime', group: 'g1' },
            { name: 'planEndTime', title: '附件：', comType: 'FileUploader', group: 'g1' },
            { name: 'assignTo', title: '指派给：', comType: 'SingleUserSelector', group: 'g1', loadApi: 'm=SYS_CM_USERS&action=getAllUsers', textKey: 'uid', req: true },
            { name: 'observers', title: '跟踪者：', comType: 'UserSelector', group: 'g1' },
            { name: 'note', title: '描述：', comType: 'Label', group: 'g1' }
        ];
        var comArgs = {
            'root': { head_h: 35 },
            'layout': { min: 344, max: 500, isRoot: 1, start: 440, dir: 'ns', dirLock: 2 },
            'toolBar': { itemAlign: 'right', gbsID: args.toolBarId, itemSkin: 'mr5 Button-default', onClick: onToolBarClick },
            'status': { itemAlign: 'left', skin: 'ButtonSet-tab fl', itemSkin: 'Button-tab', gtType: 'tab', gtID: 584, css: 'margin-right:20px;', onSuccess: function (obj) { obj.ButtonSet.fireClick(0); }, onClick: onStatusClick },
            'sList': { aHeader: _hAry, onTDClick: onListClick, ifEnabledFilter: true, deleteApi: 'm=SYS_TABLE_BASE&action=deleteByIDs&table=' + args.table, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onTDDoubleClick: onListDClick },
            'infoTips': { head_h: 32, title: 'Bug信息', icon: 'icon-glyph-th-large', cn: 'b0', gbsID: 137, toolBarSkin: 'mr10 Button-default', onToolBarClick: onToolBarClick },
            'infoLayout': { min: 244, max: 500, isRoot: 1, start: 340, dir: 'we', dirLock: 1 },
            'info': { items: _fiArray, extSubmitVal: { state: 586 }, head_h: 0, foot_h: 35, title: '基本信息', loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=' + args.table, updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=' + args.table, insertApi: 'm=SYS_TABLE_BASE&action=addRow&table=' + args.table, onSubmitSuccess: function () { mainList.refresh(); }, onSubmit: onFormSubmit }
        }
        var struct = {
            p: owner,
            name: 'root',
            type: 'BaseDiv',
            head: [{ type: 'ButtonSet', name: 'status' }, { type: 'ButtonSet', name: 'toolBar'}],
            body: {
                type: 'Layout',
                name: 'layout',
                eHead: { type: 'List', name: 'sList' },
                eFoot: { type: 'Tips', name: 'infoTips', body: { type: 'Layout', name: 'infoLayout', eHead: { name: 'info', type: 'Form'}} }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        mainList = coms.sList; infoF = coms.info; eHistroy = coms.infoLayout.eFoot.ac('Waterfall').h('<ul class="ListItem" style="margin: 10px 25px;"></ul>').fc();
    }

    function onListDClick(obj) { new $.UI.View({ p: args.p, url: args.taskUrl, proType: args.type, proId: obj.getAttr('rowid'), status: obj.getAttr('status') }); }
    function onFormSubmit(obj) { var _form = obj.Form; if (_form.get('state') == 'Update' && obj.Data.UValue.repairTime) { _form.setExt('status', 350); } }
    function onListClick(obj) {
        var _id = obj.Target.getAttr('rowId'); currID = _id; cPerson = obj.Target.getAttr('cPerson');
        infoF.loadDataByID(_id, function (obj) { coms.infoTips.setTitle(obj.Value.title + ' -- ' + obj.Value.state_trans + ' -- ' + obj.Value.lev_trans); infoF.getButton('FORM-SYS-SUBMIT').setText('修改基本信息'); loadHistorys(); });
    }

    function onStatusClick(obj) {
        mainList.loadAjax({
            args: 'm=SYS_TABLE_BASE&action=pagingForList&table=' + args.table + '&jsonCondition={"state":' + obj.Name + '}',
            cbFn: { onSuccess: function (obj) { if (obj.Length) { mainList.fireClick(0); }; } }
        });
    }

    function onToolBarClick(obj) {
        switch (+obj.Name) {
            case 135:
                onAddItem(obj);
                break;
            case 136:
                var _sIds = mainList.getAttr('selIds');
                if (_sIds && _sIds.length) {
                    MConfirm.evt('onOk', function () { mainList.delSelRows(); }).setWidth(250).show('确定删除已选择的<font color="red">' + _sIds.length + '</font>项记录?');
                } else {
                    MTips.show('请先选择要删除的记录!', 'warn')
                }
                break;
            case 138:
                onAddHistory(obj);
                break;
        }
    }

    function onAddItem(obj) {
        var arrowTips = $.initArrowTips(obj, 'width:600px;padding:5px 10px 5px 10px;');
        var _fiAry = [
            { name: 'title', title: '主题：', comType: 'Input', group: { width: 590, name: 'g1' }, width: 460, req: true },
            { name: 'lev', title: '优先级：', comType: 'Select', group: 'g1', width: 460, gtID: args.levId },
            { name: 'bTime', title: '开始时间：', comType: 'Date', group: 'g1', width: 460 },
            { name: 'planEndTime', title: '预计完成时间：', comType: 'EndDate', matchItem: 'bTime', group: 'g1', width: 460 },
            { name: 'link', title: '附件：', comType: 'FileUploader', group: 'g1', width: 460 },
            { name: 'assignTo', title: '指派给：', comType: 'SingleUserSelector', group: 'g1', loadApi: 'm=SYS_CM_USERS&action=getAllUsers', textKey: 'uid', width: 460, req: true },
            { name: 'observers', title: '跟踪者：', comType: 'UserSelector', group: 'g1', width: 460 },
            { name: 'note', title: '描述：', comType: 'RichText', group: 'g1', width: 460 }
        ];
        var _form = $.global.arrowTips.init({
            type: 'Form',
            items: _fiAry,
            ifFixedHeight: false,
            insertApi: 'm=SYS_TABLE_BASE&action=addRow&table=' + args.table,
            btnItems: [
                { name: 'FORM-SYS-SUBMIT', text: '新建Bug', skin: 'Button-blue', css: 'margin-left:100px;' }
            ],
            onSubmitSuccess: function (obj) {
                if ($.global.arrowTips) { $.global.arrowTips.remove(); $.global.arrowTips = null; }; mainList.refresh();
            }
        }, true);
    }

    function onAddHistory(obj) {
        var arrowTips = $.initArrowTips(obj, 'width:600px;padding:5px 10px 5px 10px;');
        var _fiAry = [
            { name: 'note', title: '描述：', comType: 'RichText', group: { width: 590, name: 'g1' }, width: 460, req: true },
            { name: 'link', title: '附件：', comType: 'FileUploader', group: 'g1', width: 460 }
        ];
        var _form = $.global.arrowTips.init({
            type: 'Form',
            items: _fiAry,
            ifFixedHeight: false,
            insertApi: 'm=SYS_TABLE_BASE&action=addRow&table=SYS_BUGS_HISTORY',
            extSubmitVal: { bugId: currID },
            btnItems: [
                { name: 'FORM-SYS-SUBMIT', text: '新增记录', skin: 'Button-blue', css: 'margin-left:100px;' }
            ],
            onSubmitSuccess: function (obj) {
                if ($.global.arrowTips) { $.global.arrowTips.remove(); $.global.arrowTips = null; }; loadHistorys();
            }
        }, true);
    }

    function loadHistorys() {
        eHistroy.h('<div style="padding:20px;z-index:20;text-align:center;"><img src="images/loading/gif/loading51.gif" /></div>');
        $.Util.ajax({
            args: 'm=SYS_CM_OA&action=loadBugs&bugId=' + currID + '&dataType=json',
            onSuccess: function (d) {
                var _dAry = eval(d.get(0).replaceAll('"[', '[').replaceAll(']"', ']') || '[]'), _dLen = _dAry.length;
                if (!_dLen) { eHistroy.h('<div style="padding:20px;text-align:center;"><img src="images/EmptyData.gif"></div>'); } else { eHistroy.h(''); };
                for (var i = 0; i < _dLen; i++) { addHistory(_dAry[i]); }
            }
        });
    }

    function addHistory(obj) {
        var _sfiles = '', _files = obj.files;
        for (var i = 0, _fLen = _files.length; i < _fLen; i++) { var _file = _files[i]; _sfiles += '<a href="Module/SYS_CM_FILES.aspx?action=downloadFile&id=' + _file.id + '" >' + _file.nodeName + '</a>'; }
        var _dir = 'left', _bc = '#E2E2E2', _bbc = '#D9F0F7', _arrowH = '<div class="pa w16 h16 fl" style="margin-left:-16px;padding:0px;margin-top:5px;"></div>';
        if (+cPerson != +obj.cPerson) {
            _dir = 'right'; _arrowH = '<div class="pa w16 h16 fr" style="padding:0px;margin-top:5px;right:10px;"></div>'; _bbc = '#FFFFCA';
        }
        var _temp = eHistroy.adElm('', 'li').css('background-color:' + _bbc + ';').h(_arrowH + '<div class="fr">' + obj.trans_cPerson+ ' # ' + obj.id + '</div><div class="content">' + obj.note + '</div><div class="attach" style="min-height:17px;"><span>附件：</span><div class="files">' + _sfiles + '<div class="fr lh20">' + obj.cTime + '</div></div></div>');
        new $.UI.Arrow({ p: _temp.fc(), diff: 1, comMode: 'border', borderColor: _bc, backgroundColor: _bbc, cn: 'cp', dir: _dir });
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