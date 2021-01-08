$.namespace('$View.common');
$View.common.TreeList = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, headAry: null, table: 'SYS_QT_PAPER', style: 'bingxing', toolBarAry: null, ifShowToolBar: true, ifExpandAll: false, ifShowID: false, lockLevel: 0, rootID: 0, onTDClickBefore: _fn, onTDClick: _fn };
    var tipsForm, currObj, currTreeList, selBody;
    function _default() {

    }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var toolBarAry = [
            { name: 'addMain', title: '添加主项', icon: 'icon-glyph-plus-sign', onClick: addMain },
            { name: 'addSub', title: '添加子项', icon: 'icon-glyph-plus', onClick: addSub },
            { name: 'addBatch', text: '批量添加子项', skin: 'btn-info', onClick: addBatch },
            { name: 'delSelItem', title: '删除选中项', icon: 'icon-glyph-remove-sign', skin: 'btn-danger', onClick: delSelItem },
            { name: 'moveUp', title: '上移', icon: 'icon-glyph-arrow-up', skin: 'btn-info', onClick: moveUp },
            { name: 'moveDown', title: '下移', icon: 'icon-glyph-arrow-down', skin: 'btn-info', onClick: moveDown },
            { name: 'selAll', title: '全选', icon: 'icon-glyph-check', skin: 'btn-warning', onClick: selAll },
            { name: 'invertSel', title: '反选', icon: 'icon-glyph-share', skin: 'btn-warning', onClick: invertSel },
            { name: 'refresh', title: '刷新', icon: 'icon-glyph-refresh', onClick: refresh }
        ];
        var aHeader = [
            { name: 'id', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'nodeName', type: 'none', width: 200, ifEdit: true }
        ];
        if (args.style.indexOf('tree:') != -1) { aHeader.unshift({ name: 'depth', type: 'attr' }); }
        if (args.ifShowID) { aHeader.unshift({ name: 'id', type: 'none', width: 50 }); }
        if (args.ifShowToolBar) { aHeader.unshift({ name: 'cb', type: 'checkbox', width: 40 }); }
        var _h_h = 38;
        if (!args.ifShowToolBar) { _h_h = 0; }
        if (args.toolBarAry) { toolBarAry = args.toolBarAry; }
        aHeader = args.headAry || aHeader;
        var comArgs = {
            'root': { head_h: _h_h, foot_h: 0 },
            'toolBar': { items: toolBarAry },
            'info': { cn: 'fs12 ti_5 lh30', html: '当前表名：' + args.table + '，  RootID：' + args.rootID },
            'treeList': {
                aHeader: aHeader,
                lockLevel: args.lockLevel,
                style: args.style,
                ifExpandAll: args.ifExpandAll,
                deleteApi: { m: 'SYS_TABLE_TREE', action: 'deleteNodesByIDs', table: args.table },
                updateApi: { m: 'SYS_TABLE_TREE', action: 'updateNodeByID', table: args.table },
                orderApi: { m: 'SYS_TABLE_TREE', action: 'orderNode', table: args.table },
                loadApi: { m: 'SYS_TABLE_TREE', action: 'getNodesByPid', table: args.table, pid: args.rootID },
                onTDClickBefore: function (obj) { return args.onTDClickBefore(obj); },
                onTDClick: function (obj) {
                    currObj = obj; currTreeList = obj.TreeList;
                    var ownerP = obj.TreeList.get('p').pn();
                    var _slVal = ownerP.scrollLeft, _swVal = ownerP.scrollWidth * 2;
                    ownerP.ease(['scrollLeft'], [_swVal], 600, "easeNone", {
                        e: function () { ownerP.scrollLeft = _swVal; },
                        f: function () { ownerP.scrollLeft += 245; }
                    }, 1, '');
                    if (selBody) { selBody.dc('List-sel'); }
                    obj.List.owner.ac('List-sel'); selBody = obj.List.owner;
                    return args.onTDClick(obj);
                }
            }
        }
        var struct = {
            p: owner,
            type: 'BaseDiv',
            name: 'root',
            head: { type: 'ButtonSet', name: 'toolBar' },
            body: { type: 'TreeList', name: 'treeList' },
            foot: { type: 'Container', name: 'info' }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        currTreeList = coms['treeList']; me.treeList = currTreeList;
    }
    function _event() {

    }
    function _override() {

    }
    function addMain(obj) {
        obj.Args.title = '添加主项';
        getForm(obj.Args, function () { coms['treeList'].refresh(); }).items['pid'].setData(args.rootID, 'Root');
    }
    function addSub(obj) {
        if (!currObj) { MTips.show('请选择父节点', 'warn'); return; }
        var _targ = currObj.Target;
        var _pid = _targ.getAttr('rowid'), _txt = _targ.get('text');
        obj.Args.title = '添加子项';
        getForm(obj.Args, function () {
            var _sons = +_targ.getAttr('sons');
            _targ.eTr.attr('sons', ++_sons);
            if (currTreeList.next) {
                currTreeList.next.refresh();
            } else {
                currTreeList.List.fireClick(_pid, 'ID');
            }
        }).items['pid'].setData(_pid, _txt);
    }
    function addBatch(obj) {
        if (!currObj) { MTips.show('请选择父节点', 'warn'); return; }
        var _targ = currObj.Target;
        var _pid = _targ.getAttr('rowid'), _txt = _targ.get('text');
        if (tipsForm) { tipsForm.remove(); tipsForm = null; }
        var fAry = [
            { title: '父节点', comType: 'Label', name: 'pid', text: _txt, value: _pid },
            { title: '当前值(换行分隔)', comType: 'TextArea', name: 'nodeName', req: true }
        ];
        tipsForm = new $.UI.Tips({ p: $DB, title: '批量添加', icon: 'icon-compact-add', head_h: 28, ifClose: true, ifFixedHeight: false, ifMask: true, width: 300, comMode: 'x-auto', y: 120 });
        tipsForm.form = new $.UI.Form({
            p: tipsForm.body,
            items: fAry,
            ifFixedHeight: false,
            onSubmit: function (obj) {
                var _vSubmit = obj.Data.IText.nodeName.replaceAll('<br>', '$');
                $.Util.ajax({
                    args: 'm=SYS_TABLE_TREE&action=addTreeNodesByPid&rSplit=$&table=' + args.table + '&rows=' + _vSubmit + '&pid=' + _pid,
                    onSuccess: function (obj) {
                        tipsForm.remove(); tipsForm = null;
                        var _sons = (+_targ.getAttr('sons')) + _vSubmit.split('$').length;
                        _targ.eTr.attr('sons', _sons);
                        if (currTreeList.next) {
                            currTreeList.next.refresh();
                        } else {
                            currTreeList.List.fireClick(_pid, 'ID');
                        }
                        MTips.show('新建成功', 'ok');
                    },
                    onError: function (d) { MTips.show(d.data, 'error'); }
                });
                return false;
            }
        });
    }
    function delSelItem(obj) {
        var _ids = currTreeList.List.getAttr('selIds');
        if (!_ids || !_ids.length) { MTips.show('请先选择要删除的行', 'warn'); return; }
        MConfirm.setWidth(250).show('确定删除' + _ids.length + '条记录?').evt('onOk', function () {
            $.Util.ajax({
                args: 'm=SYS_TABLE_TREE&table=' + args.table + '&action=deleteByIDs&ids=' + _ids.join(','),
                onSuccess: function () { MTips.show('删除成功', 'ok'); currTreeList.List.refresh(); }
            })
        });
    }
    function moveUp(obj) { currTreeList.List.orderSelNode('asc', function () { }); }
    function moveDown(obj) { currTreeList.List.orderSelNode('desc'); }
    function selAll(obj) { currTreeList.List.setAllChecked(true); }
    function invertSel(obj) { currTreeList.List.setAllChecked(false); }
    function refresh(obj) { currTreeList.List.setAttr('ifAjax', false); currTreeList.List.refresh(); }
    function getForm(obj, cbFn) {
        if (tipsForm) { tipsForm.remove(); tipsForm = null; }
        var fAry = [
            { title: '父节点', comType: 'Label', name: 'pid' },
            { title: '当前值', comType: 'TextArea', name: 'nodeName', limit: 2000, req: true }
        ], _cbfn = cbFn || _fn;
        tipsForm = new $.UI.Tips({ p: $DB, title: obj.title, icon: obj.icon, head_h: 38, ifClose: true, ifFixedHeight: false, ifMask: true, width: 300, comMode: 'x-auto', y: 120 });
        var form = new $.UI.Form({ p: tipsForm.body, items: fAry, insertApi: 'm=SYS_TABLE_TREE&action=addTreeNode&table=' + args.table, ifFixedHeight: false });
        form.evt('onSubmitSuccess', function () { tipsForm.remove(); tipsForm = null; _cbfn(); });
        return form;
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}