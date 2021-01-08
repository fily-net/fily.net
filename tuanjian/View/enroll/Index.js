$.NameSpace('$View.enroll');
$View.enroll.Index = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, gtRootID: 156, fireid: null, infoUrl: 'View/pm/PMInfo2.js' }, popTips;
    var coms = {}, typeTab, mainList;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var hAry = [
            { name: 'cb', type: 'checkbox', width: 60 },
            { title: '姓名', name: 'name', type: 'none', width: 140, ifFilter: true, filterItems: ['like'] },
            { title: '性别', name: 'sex', type: 'none', width: 60, ifFilter: true, filterItems: ['like'] },
            { title: '学校', name: 'school', type: 'none', width: 140, ifFilter: true, filterItems: ['like'] },
            { title: '年级', name: 'grade', type: 'none', width: 140, ifFilter: true, filterItems: ['like'] },
            { title: '联系方式', name: 'phone', type: 'none', width: 140, ifFilter: true, filterItems: ['like'] },
            { title: '电子邮件', name: 'email', type: 'none', width: 140, ifFilter: true, filterItems: ['like'] },
            { title: '出生年月', name: 'birthday', type: 'none', width: 140, ifFilter: true, filterItems: ['like'] },
            { title: '报名时间', name: 'cTime', type: 'date', width: 140, ifFilter: true, filterItems: ['like'] },
            { title: '备注', name: 'techang', ifEnabledTips: true, type: 'none', width: 180, ifFilter: true, filterItems: ['like'] }
        ];

        var _toolBarAry = [
            { text: '下载为Excel', cn: 'mr3 mt5', name: 'download' },
            { text: '删除', cn: 'mr3 mt5', name: 'delete' }
        ];
        var comArgs = {
            'root': { head_h: 33, cn: 'b0', title: '报名列表', toolBarAry: _toolBarAry, toolBarSkin: 'Button-default', onToolBarClick: onToolBarClick },
            'toolBar': { items: _toolBarAry, onClick: onToolBarClick },
            'mainList': { ifEnabledFilter: false, aHeader: hAry, loadApi: 'table=TJ_ENROLL&action=pagingForList&m=SYS_TABLE_BASE', colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } } }
        }
        var struct = {
            p: owner,
            type: 'Tips', name: 'root', body: { type: 'List', name: 'mainList' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        mainList = coms.mainList;
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'download':
                //保存为Excel
                mainList.saveAsExecl('微信报名列表');
                break;
            case 'delete':
                //删除项目
                var _ids = mainList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择要删除的行', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除' + _ids.length + '条记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_BASE&table=TJ_ENROLL&action=deleteByIDs&ids=' + _ids.join(','),
                        onSuccess: function () { MTips.show('删除成功', 'ok'); mainList.refresh(); }
                    })
                });
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
