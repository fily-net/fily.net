$.NameSpace('$View.project');
$View.project.PMInfoFiles = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, proId: 1, proList: null };
    var coms = {}, popTips;
    var _fileAry = [
        { title: '文件名', name: 'nodeName', type: 'none', width: 140, ifEnabledTips: true },
        { title: '格式', name: 'extName', type: 'none', width: 60 },
        { title: '大小', name: 'size', type: 'none', ifTrans: true, trans: 'SYS_TRANS_FILE_SIZE', width: 60 },
        { title: '上传人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 80 },
        { title: '上传时间', name: 'cTime', type: 'date', width: 130 },
        { title: '<font color="red">操作</font>', type: 'operate', items: [{ icon: 'fa fa-download', name: 'download', href: 'Module/SYS_CM_FILES.aspx?action=downloadFile%26id={0}{1}cast(id as varchar(10)){1}{0}'}], width: 60 }
    ];
    function setDefault(j) {
        args = $.Util.initArgs(j, args);
    }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'infoBase': { head_h: 0, foot_h: 34, cn: 'b0'  },
            'fileList': { aHeader: _fileAry, colControls: { header: {} } },
            'toolBar': { items: [{name:'upload', skin: 'Button-blue', css: 'float:right;', text: '上传文件', icon: 'fa fa-upload'}], onClick: onToolBarClick }
        }
        var struct = {
            p: owner,
            type: 'BaseDiv',
            name: 'infoBase',
            body: { name: 'fileList', type: 'List' },
            foot: { name: 'toolBar', type: 'ButtonSet' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        coms.fileList.loadAjax({ args: 'm=SYS_TABLE_BASE&action=getFilesById&table=PRO_MG&id=' + args.proId });
    }

    function onToolBarClick() {
        if (popTips) { popTips.remove(); }
        popTips = new $.UI.Tips({ comMode: 'x-auto', width: 500, height: 400, y: 100, head_h: 30, ifMask: true, ifClose: true, title: '文件上传', icon: 'fa-upload' });
        new $.UI.FileUploader({
            p:popTips.body,
            onComplete: function (objs) {
                $.Util.ajax({
                    args: 'm=SYS_TABLE_BASE&table=PRO_MG&action=updateFilesById&link=' + objs.currIds.join(',') + '&id=' + args.proId,
                    onSuccess: function () { coms.fileList.refresh(); }
                });
            }
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