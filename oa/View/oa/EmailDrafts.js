$.namespace('$View.oa');
$View.oa.EmailDrafts = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB }, mainList;
    function _default() { }
    function _layout() {
        var _toolBarAry = [
            { text: '删除', cn: 'mr3 mt5', name: 'del', icon: 'icon-glyph-remove-circle' }
        ];
        var _listAry = [
            { type: 'checkbox', width: 50 },
            { title: '收件人', name: 'owners', ifTrans: true, trans: 'SYS_TRANS_USERS', type: 'none', width: 240 },
            { title: '标题', name: 'nodeName', type: 'data', width: 380 },
            { title: '时间', name: 'cTime', type: 'date', width: 150 }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 33, cn: 'b0', title: '草稿箱', icon: 'icon-glyph-gift', toolBarAry: _toolBarAry, toolBarSkin: 'Button-default', onToolBarClick: onToolBarClick },
            'toolBar': { items: _toolBarAry, onClick: onToolBarClick },
            'mainList': { aHeader: _listAry, loadApi: 'm=SYS_CM_EMAIL&action=pagingForEmailList&jsonCondition={"type":10}', onTDDoubleClickBefore: onListDClick, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } } }
        }
        var viewStruct = { p: owner, type: 'Tips', name: 'root', body: { type: 'List', name: 'mainList' } };
        coms = $.layout({ args: comArgs, struct: viewStruct });
        mainList = coms.mainList;
    }
    function _event() { }
    function _override() { }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'del':
                //删除项目
                var _ids = mainList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择要删除的行', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除' + _ids.length + '条记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_CM_EMAIL&action=delEmails&ids=' + _ids.join(','),
                        onSuccess: function () { MTips.show('删除成功', 'ok'); mainList.refresh().setAttr('selIds', []); }
                    });
                });
                break;
        }
    }

    function onListDClick(obj) {
        args.email.setSelected('write');
        new $.UI.View({ p: args.p, url: 'View/oa/EmailEditor.js', formId: obj.getAttr('rowId'), email: args.email });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}