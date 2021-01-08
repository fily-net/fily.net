$.NameSpace('$View.user');
$View.user.RoleDetail = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB }, coms, _api = 'm=SYS_CM_USERS', _infoF, _delBtn, currObj, currID, currRefreshID;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'detailForm':
                {
                    head_h: 0, state: 'Update', loadApi: 'm=SYS_CM_USERS&action=getDept',
                    updateApi: 'm=SYS_CM_USERS&action=updateDept',
                    ifFixedHeight: false,
                    btnItems: [
                        { name: 'FORM-SYS-SUBMIT', skin: 'Button-blue', text: '修改', icon: 'fa fa-edit', css: 'margin-left:100px;' },
                        { name: 'FORM-SYS-DEL', skin: 'Button-danger', text: '删除', icon: 'fa fa-minus', css: 'margin-left:10px;' }
                    ],
                    onClick: onFormClick
                }
        }
        var viewStruct = { p: owner, type: 'Form', name: 'detailForm' }
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct }); _infoF = coms.detailForm; _delBtn = _infoF.getButton('FORM-SYS-DEL');
    }

    function onFormClick(obj) {
        if (obj.Name == 'FORM-SYS-DEL') {
            MConfirm.setWidth(350).show('确定删除该项吗？').evt('onOk', function () {
                $.Util.ajax({
                    args: 'm=SYS_CM_USERS&action=delDept&id=' + currID,
                    onSuccess: function () { currObj.List.reExpandTR(currRefreshID, 'ID'); }
                });
            });
        }
    }

    me.loadInfo = function (obj, items) {
        var _tg = obj.Target; currObj = obj; currID = _tg.getAttr('id'); currRefreshID = +_tg.getAttr('pid');
        items[0].group = { width: 320 };
        _infoF.reLoadItems(items, { onSuccess: function () { _infoF.loadDataByID(currID); } });
        if (currRefreshID == 1) { _delBtn.hide(); } else { _delBtn.show(); }
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