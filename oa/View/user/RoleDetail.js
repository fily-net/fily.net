$.namespace('$View.user');
$View.user.RoleDetail = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var _api = 'm=SYS_CM_USERS', _infoF, _delBtn, currObj, currID, currRefreshID;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = { 'detailForm': { head_h: 34, icon: 'icon-vector-info-card', state: 'Update', loadApi: 'm=SYS_CM_USERS&action=getDept', updateApi: 'm=SYS_CM_USERS&action=updateDept', ifFixedHeight: false, btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '修改', icon: 'icon-glyph-edit', css: 'margin-left:102px;', skin: 'btn-info' }, { name: 'FORM-SYS-DEL', text: '删除', icon: 'icon-glyph-minus', css: 'margin-left:10px;', skin: 'btn-danger' }], onClick: onFormClick } }
        var viewStruct = { p: owner, type: 'Form', name: 'detailForm' }
        coms = $.layout({ args: comArgs, struct: viewStruct }); _infoF = coms.detailForm; _delBtn = _infoF.getButton('FORM-SYS-DEL');
    }
    function _event() { }
    function _override() { }
    function onFormClick(obj) {
        if (obj.Name == 'FORM-SYS-DEL') {
            $.Util.ajax({
                args: 'm=SYS_CM_USERS&action=delDept&id=' + currID,
                onSuccess: function () { currObj.List.reExpandTR(currRefreshID, 'ID'); }
            });
        }
    }

    me.loadInfo = function (obj, items) {
        var _tg = obj.Target; currObj = obj; currID = _tg.getAttr('id'); currRefreshID = +_tg.getAttr('pid');
        items[0].group = { width: 320 };
        _infoF.setTitle('<font color="red">' + _tg.get('text') + '</font>详情').reLoadItems(items, { onSuccess: function () { _infoF.loadDataByID(currID); } });
        if (currRefreshID == 1) { _delBtn.hide(); } else { _delBtn.show(); }
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}