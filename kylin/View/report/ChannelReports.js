$.NameSpace('$View.crm');
$View.crm.ChannelReports = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB }, ifQuery = false;
    var coms = {}, mainList;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var hAry = [
            { title: '拜访人', name: 'dbo.SYS_TRANS_USER(r.cPerson)', type: 'none', width: 130 },
            { title: '拜访时间', name: 'r.vTime', type: 'date', width: 130 },
            { title: '商家名称', name: 'm.company', ifEnabledTips: true, type: 'none', width: 240 },
            { title: '行业类型', name: 'm.business', type: 'none', width: 120 },
            { title: '地址', name: 'm.companyAddress', type: 'none', width: 380 },
            { title: '备注', name: 'r.note', ifEnabledTips: true, type: 'none', width: 380 },
            { title: '创建时间', name: 'r.cTime', type: 'date', width: 130 }
        ];
        var itemAry = [
            { title: '开始时间', name: 'begin', comType: 'Date', req: true },
            { title: '结束时间', name: 'end', comType: 'EndDate', matchItem: 'begin', req: true },
            { title: '拜访人', name: 'cPerson', comType: 'SingleUserSelector' }
        ];
        var comArgs = {
            'rootDiv': { head_h: 35, title: '报表查询', icon: 'icon-glyph-tasks', cn: 'b0', gbsID: 55, toolBarSkin: 'mr10 Button-default', onToolBarClick: onToolBarClick },
            'layout': { min: 200, max: 300, isRoot: 1, start: 310, dir: 'we', dirLock: 1 },
            'queryForm': { ifFixedHeight: false, items: itemAry, btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '搜索', icon: 'icon-glyph-search', css: 'margin-left:102px;'}], onSubmit: onFormSubmit },
            'mainList': { ifBindID: false, aHeader: hAry, colControls: { header: {}} }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootDiv',
            body: {
                type: 'Layout', name: 'layout',
                eHead: { type: 'Form', name: 'queryForm' },
                eFoot: { type: 'List', name: 'mainList' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        mainList = coms.mainList;
        var qForm = coms.queryForm, _dUtil = new $.Util.Date();
        var _bTime = _dUtil.getMonthStartDate().date2Str().split(' ')[0], _eTime = _dUtil.getMonthEndDate().date2Str().split(' ')[0];
        qForm.items['begin'].setData(_bTime, _bTime);
        qForm.items['end'].setData(_eTime, _eTime);
    }

    function onFormSubmit(obj) {
        var _data = obj.Data.IValue;
        if (!_data.cPerson) { _data.cPerson = 0; }
        mainList.loadAjax({
            args: {
                m: 'SYS_CM_CRM', 
                tid: 'dbo.CRM_CHANNEL',
                action: 'queryReport',
                begin: _data.begin,
                end: _data.end,
                cPerson: _data.cPerson
            }
        });
        ifQuery = true;
        return false;
    }

    function onToolBarClick(obj) {
        switch (+obj.Name) {
            case 56:
                if (!ifQuery) { MTips.show('请先查询数据', 'error'); return false; }
                mainList.saveAsExecl('员工任务报表详情', null, true);
                break;
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