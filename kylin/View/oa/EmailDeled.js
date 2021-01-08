$.NameSpace('$View.oa');
$View.oa.EmailDeled = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB }, coms, mainList;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _toolBarAry = [
            { text: '彻底删除', cn: 'mr3 mt5', name: 'del', icon: 'fa-minus',skin:'Button-danger' },
            { text: '标记为...', cn: 'mt5', name: 'mark', icon: 'fa-star', type: 'menu', items: [{ text: '未读', value: '0', icon: 'fa fa-star' }, { text: '已读', value: '1', icon: 'fa fa-star-o'}] }
        ];
        var _listAry = [
            { type: 'checkbox', width: 50 },
            { title: '<a class="fa fa-envelope" title="是否已读" ></a><a class="fa fa-paperclip" title="是否有附件"></a>', name: '{0}<a class="mt5 fa fa-email state-{0}{1}cast(ifRead as varchar(20)){1}{0}"></a><a class="fa fa-attach state-{0}{1}cast(ifAttach as varchar(20)){1}{0}"></a>{0}', type: 'none', width: 50 },
            { title: '收件人', name: 'owners', ifTrans: true, trans: 'SYS_TRANS_USERS', type: 'none', width: 240 },
            { title: '标题', name: 'nodeName', type: 'data', width: 380 },
            { title: '时间', name: 'cTime', type: 'date', width: 150 }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 33, cn: 'b0', title: '已删除', icon: 'fa-trash', toolBarAry: _toolBarAry, toolBarSkin: 'Button-blue', onToolBarClick: onToolBarClick, onToolBarMenuClick: onToolBarMenuClick },
            'toolBar': { items: _toolBarAry, onClick: onToolBarClick },
            'mainList': { aHeader: _listAry, loadApi: 'm=SYS_CM_EMAIL&action=pagingForDeletedEmailList&jsonCondition={"delFlag":1}', colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1}} }
        }
        var viewStruct = { p: owner, type: 'Tips', name: 'root', body: { type: 'List', name: 'mainList'} };
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct }); mainList = coms.mainList;
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'del':
                var _ids = mainList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择要删除的行', 'warn'); return; }
                MConfirm.setWidth(250).show('确定彻底删除' + _ids.length + '条记录(<font color=red>不能恢复</font>)?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_CM_EMAIL&action=realDelEmails&ids=' + _ids.join(','),
                        onSuccess: function () { MTips.show('彻底删除成功', 'ok'); mainList.refresh().setAttr('selIds', []); }
                    });
                });
                break;
        }
    }

    function onToolBarMenuClick(obj) {
        var _ids = mainList.getAttr('selIds'), _val = '未读';
        if (!_ids || !_ids.length) { MTips.show('请先选择要删除的行', 'warn'); return; }
        if (+obj.value) { _val = '已读'; }
        MConfirm.setWidth(250).show('确定标记为' + _val + '?').evt('onOk', function () {
            $.Util.ajax({
                args: 'm=SYS_CM_EMAIL&action=markEmails&ids=' + _ids.join(',') + '&flag=' + obj.Value,
                onSuccess: function () { MTips.show('标记成功', 'ok'); mainList.refresh().setAttr('selIds', []); }
            });
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