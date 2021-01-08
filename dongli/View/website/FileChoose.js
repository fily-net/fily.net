$.NameSpace('$View.website');
$View.website.FileChoose = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, table: 'SYS_CM_FILES', rootID: 6, gbsID: 16, title: '文档选择', onClick:_fn };
    var coms = {}, dirList, fileList, currID, popTips, fileID, infoF, fileView;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { name: 'id', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'depth', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'type', type: 'attr' },
            { name: 'nodeName', type: 'none' }
        ];
        var comArgs = {
            'rootTips': { head_h: 0, foot_h: 0, cn: 'b0', title: args.title, icon: 'fa-file-o', toolBarSkin: 'Button-default', gbsID: args.gbsID, onToolBarClick: onToolBarClick },
            'rootLayout': { min: 120, max: 500, isRoot: 1, start: 160, dir: 'we', dirLock: 1 },
            'dirList': { aHeader: _mHeaderAry, style: 'tree:nodeName', onSuccess: function (obj) { obj.List.fireClick(0); }, onTDClick: onDirListClick },
            'fileView': {  }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootTips',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'List', name: 'dirList' },
                eFoot: { type: 'View', name: 'fileView' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        dirList = coms.dirList; fileList = coms.fileList; fileView = coms.fileView;
        me.loadDirectory(args.rootID);
    }

    function onOperateClick(obj) {
        if (obj.Name == 'del') {
            MConfirm.setWidth(250).show('确定删除此目录或文件?').evt('onOk', function () {
                $.Util.ajax({
                    args: 'm=SYS_CM_FILES&action=delFileOrDir&id=' + obj.RowId,
                    onSuccess: function () { MTips.show('删除成功', 'ok'); fileList.refresh(); },
                    onError: function () { MTips.show('删除失败', 'error'); }
                });
            });
        }
    }

    function deleteFile() {
        if (!fileID) { MTips.show('请先选中要删除的文件', 'warn'); return; }
        MConfirm.setWidth(250).show('确定删除此目录或文件?').evt('onOk', function () {
            $.Util.ajax({
                args: 'm=SYS_CM_FILES&action=delFileOrDir&id=' + fileID,
                onSuccess: function () { MTips.show('删除成功', 'ok'); fileList.refresh(); },
                onError: function () { MTips.show('删除失败', 'error'); }
            });
        });
    }

    function onToolBarClick(obj) {
        if (currID == undefined) { MTips.show('请选择文件目录', 'warn'); return; }
        if (popTips) { popTips.remove(); }
        switch (obj.Text.trim()) {
            case '上传文件':
                popTips = new $.UI.Tips({ comMode: 'x-auto', width: 500, height: 400, y: 100, head_h: 30, ifMask: true, ifClose: true, title: '文件上传', icon: 'icon-glyph-arrow-up' });
                new $.UI.FileUploader({ p: popTips.body, mId: currID, catelog: 'docmg', onSuccess: onUploadSuccess });
                break;
            case '新建目录':
                popTips = new $.UI.PopDialog({ p: $DB, ifClose: true, css: 'max-width:165px;padding:10px;' });
                popTips.clearHTML(false).set('ePop', obj.Owner).init({
                    type: 'Form', ifFixedHeight: false, state: 'Insert',
                    btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '新建(Add)', icon: 'icon-glyph-plus', align: 'right'}],
                    items: [{ name: 'nodeName', comType: 'TextArea', ifHead: false, req: true }, ],
                    insertApi: 'm=SYS_TABLE_TREE&action=addTreeNodeByPid&table=' + args.table + '&pid=' + currID
                }).show().evt('onSubmitSuccess', function (j) {
                    popTips.hide(); MTips.show('新建成功', 'ok'); dirList.fireClick(currID, 'ID');
                });
                break;
            case '删除选中项':
                deleteFile();
                break;
        }
    }
    function onUploadSuccess() { dirList.reExpandTR(currID, 'ID'); }
    function onFileDoubleClick(obj) {
        
    }
    function onDirListClick(obj) {
        currID = obj.Target.getAttr('id');
        if (!currID) { return; }
        fileView.loadView({ url: 'View/website/FileView.js', onClick: args.onClick, pid: currID });

        //loadFiles(currID);
    }

    function loadFiles(pid) {
        console.log(pid);
        if (fileView.loadFiles) {
            fileView.loadFiles(pid);
        } else {
            setTimeout(function () { loadFiles(pid); }, 1000);
        }
    }

    me.loadDirectory = function (id) {
        if (id == undefined) { return; }
        currID = id;
        dirList.loadAjax({ args: 'm=SYS_TABLE_TREE&table=' + args.table + '&action=getTreeListByCondition&jsonCondition={"pid":' + id + ', "type":0}' });
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