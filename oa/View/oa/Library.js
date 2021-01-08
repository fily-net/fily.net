$.namespace('$View.oa');
$View.oa.Library = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, table: 'SYS_CM_FILES', rootID: 2, gbsID: 16, title: '文档共享管理' };
    var dirList, fileList, currID, popTips, fileID;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { name: 'id', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'depth', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'type', type: 'attr' },
            { name: 'nodeName', type: 'none' }
        ];
        var _fHeaderAry = [
            { name: 'sons', type: 'attr' },
            { title: '名称', name: 'nodeName', type: 'none', width: 260 },
            { title: '修改日期', name: 'cTime', type: 'date', width: 150 },
            { title: '类型', name: 'extName', type: 'none', width: 120 },
            { title: '大小', name: 'size', type: 'none', ifTrans: true, trans: 'SYS_TRANS_FILE_SIZE', width: 120 },
            { title: '上传者', name: 'cPerson', type: 'none', ifTrans: true, trans: 'SYS_TRANS_USER', width: 80 },
            { title: '<font color="red">操作</font>', type: 'operate', items: [{ icon: 'icon-glyph-download', name: 'download', href: 'Module/SYS_CM_FILES.aspx?action=downloadFile%26id={0}{1}cast(id as varchar(10)){1}{0}'}], width: 80 }
        ];
        var comArgs = {
            'rootTips': { head_h: 38, foot_h: 0, cn: 'b0', title: args.title, icon: 'icon-glyph-folder-close', gbsID: args.gbsID, onToolBarClick: onToolBarClick },
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 320, dir: 'we', dirLock: 1 },
            'dirList': { aHeader: _mHeaderAry, style: 'tree:nodeName', onSuccess: function (obj) { obj.List.fireClick(0); }, onTDClick: onDirListClick },
            'fileList': { aHeader: _fHeaderAry, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onTDDoubleClick: onFileDoubleClick, onTDClick: onListTDClick, onOperateClick: onOperateClick }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootTips',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'List', name: 'dirList' },
                eFoot: { type: 'List', name: 'fileList' }
            }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        dirList = coms.dirList; fileList = coms.fileList;
        me.loadDirectory(args.rootID);
    }
    function _event() { }
    function _override() { }
    function onListTDClick(obj) { fileID = obj.Target.getAttr('rowid'); console.log(fileID); }
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
                $.Dialog.get({ css: 'max-width:170px;padding:10px;', ePop: obj.Owner }).init({
                    type: 'Form', ifFixedHeight: false, state: 'Insert',
                    btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '新建(Add)', icon: 'icon-glyph-plus', css:'margin-right:0px;', align: 'right'}],
                    items: [{ name: 'nodeName', comType: 'TextArea', ifHead: false, req: true }, ],
                    insertApi: 'm=SYS_TABLE_TREE&action=addTreeNodeByPid&table=' + args.table + '&pid=' + currID
                }).evt('onSubmitSuccess', function (j) { $.Dialog.destroy(); MTips.show('新建成功', 'ok'); dirList.fireClick(currID, 'ID'); }).show();
                break;
            case '删除选中项':
                deleteFile();
                break;
        }
    }
    function onUploadSuccess() { dirList.reExpandTR(currID, 'ID'); }
    function onFileDoubleClick(obj) { return; if (+obj.getAttr('sons')) { me.loadDirectory(obj.getAttr('rowid')); } else { MTips.show('该文件夹没有子项啦!', 'warn') } }
    function onDirListClick(obj) {
        currID = obj.Target.getAttr('id');
        if (!currID) { return; }
        fileList.loadAjax({ args: 'm=SYS_TABLE_TREE&table=' + args.table + '&action=pagingListByPid&pid=' + currID });
    }

    me.loadDirectory = function (id) {
        if (id == undefined) { return; }
        currID = id;
        dirList.loadAjax({ args: 'm=SYS_TABLE_TREE&table=' + args.table + '&action=getTreeListByCondition&jsonCondition={"pid":' + id + ', "type":0}' });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}