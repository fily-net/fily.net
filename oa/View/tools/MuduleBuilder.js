$.namespace('$View.tools');
$View.tools.MuduleBuilder = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var views = [], mEditor, mTips;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _aHeader = [
            { name: 'id', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'type', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'depth', type: 'attr' },
            { name: 'nodeName', type: 'none' }
        ];
        var comArgs = {
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 220, dir: 'we', dirLock: 1 },
            'viewStruct': { head_h: 30, foot_h: 33, title: 'API模块', cn: 'bc_7', icon: 'icon-glyph-list' },
            'viewToolBar': { itemAlign: 'right', itemSkin: 'Button-toolbar', onClick: onToolBarClick },
            'moduleList': { ifShowIcon: 'type', aHeader: _aHeader, loadApi: 'm=SYS_TABLE_TREE&action=getTreeListByPid&pid=1&table=SYS_CM_API_DESC', style: 'tree:nodeName', onTDClick: onMuduleClick },
            'apiEditor': { url: 'View/tools/CodeEditor.js', onLoad: function (view) { mEditor = view; view.evt('onToolBarClick', onEditorClick); } }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'rootLayout',
            eHead: {
                type: 'Tips',
                name: 'viewStruct',
                body: { type: 'List', name: 'moduleList' },
                foot: { type: 'ButtonSet', name: 'viewToolBar' }
            },
            eFoot: { type: 'View', name: 'apiEditor' }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        vToolBar = coms['viewToolBar'];
    }
    function _event() { }
    function _override() { }
    function onMuduleClick(obj) {
        var _tg = obj.Target, _id = _tg.getAttr('id'), _type = +_tg.getAttr('type'), _tbAry = [];
        if (_type && mEditor) {
            if (_type == 1) {
                args.moduleID = _id;
                _tbAry = [
                    { name: 'del', title: '删除', cn: 'mr5', icon: 'icon-glyph-minus' },
                    { name: 'addAPI', title: '新建接口(API)', icon: 'icon-glyph-plus-sign' },
                    { name: 'toAspxFile', title: '生成aspx接口文件', icon: 'icon-glyph-file' },
                    { name: 'importAPI', title: '导入接口(ImportAPI)', foldID: _id, icon: 'icon-glyph-folder-open' }
                ];
            } else {
                _tbAry = [{ name: 'del', title: '删除', cn: 'mr5', icon: 'icon-glyph-minus' }];
            }
            $.Util.ajax({
                args: 'm=SYS_TABLE_TREE&action=getNodeByID&table=SYS_CM_API_DESC&dataType=html&keyFields=nodeName,args,code&id=' + _id,
                onSuccess: function (d) {
                    var _sData = d.get(0).split('\u0001');
                    args.currID = _id;
                    mEditor.setValue(_sData[2]);
                },
                onError: function () { MTips.show('加载失败!', 'warn'); }
            });
        } else {
            _tbAry = [
                { name: 'del', title: '删除', cn: 'mr5', icon: 'icon-glyph-minus' },
                { name: 'addModule', title: '新建模块(Module)', icon: 'icon-glyph-plus' },
                { name: 'addType', title: '新建分类(Type)', icon: 'icon-glyph-plus-sign' },
                { name: 'importModule', title: '导入模块(ImportModule)', foldID: _id, icon: 'icon-glyph-folder-open' }
            ];
        }
        vToolBar.reLoadItems(_tbAry);
    }

    function onEditorClick(obj) {
        switch (obj.Name) {
            case 'saveValue':
                if (args.currID) {
                    $.Util.ajax({
                        args: 'm=SYS_CM_API&action=saveAPI&code=' + mEditor.getValue().replaceAll('+', '%2B') + '&id=' + args.currID,
                        onSuccess: function () { MTips.show('保存成功!', 'ok'); },
                        onError: function () { MTips.show('保存失败!', 'error'); }
                    });
                } else {
                    MTips.show('请先选择API!', 'error');
                }
                break;
            case 'getValue':

                break;
        }
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'del':

                break;
            case 'addModule':

                break;
            case 'addType':

                break;
            case 'addAPI':

                break;
            case 'toAspxFile':
                if (args.moduleID) {
                    $.Util.ajax({
                        args: 'm=SYS_CM_API&action=toAspxFile&moduleID=' + args.moduleID,
                        onSuccess: function () { MTips.show('生成文件成功', 'ok'); },
                        onError: function () { MTips.show('生成文件失败', 'error'); }
                    });
                } else {
                    MTips.show('请先选择系统模块!', 'warn');
                }
                break;
            case 'importAPI':
            case 'importModule':
                mTips = new $.UI.Tips({ head_h: 30, title: '请选择文件', icon: 'icon-glyph-folder-open', width: 320, height: 240, comMode: 'auto', ifClose: true, ifMask: true });
                new $.UI.FileBrowser({ p: mTips.body, dir: 'Module', onFileClick: function (fObj) { onFileClick(fObj, obj.Name, obj.Button.get('foldID'), mTips); } });
                break;
        }
    }

    function onFileClick(obj, name, id, tips) {
        $.Util.ajax({
            args: 'm=SYS_CM_API&action=importAPI&type=' + name + '&id=' + id + '&filename=' + obj.eLi.attr('fullname'),
            onSuccess: function () { tips.remove(); tips = null; MTips.show('导入成功', 'ok'); },
            onError: function () { MTips.show('导入失败', 'error'); }
        });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}