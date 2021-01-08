$.NameSpace('$View.ms');
$View.ms.MSFileManager = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, gtRootID: 156 }, popTips, infoView, currProId;
    var coms = {}, typeTab, mainList, infoForm, path, type;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var hAry = [
            { name: 'id', type: 'attr' },
            { name: 'nodeName', type: 'attr' },
            { name: 'path', type: 'attr' },
            { name: 'type', type: 'attr' },
            { title: '文件名', name: 'nodeName', ifEnabledTips: true, type: 'none', width: 180 },
            { title: '大小', name: 'size', type: 'none', width: 80 },
            { title: '路径', name: 'path', type: 'none', width: 200 },
            { title: '类型', name: 'type', ifTrans: true, type: 'none', width: 150 },
            { title: '上传者', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 60 },
            { title: '上传时间', name: 'cTime', type: 'date', width: 125 }
        ];
        var comArgs = {
            'rootLayout': { min: 300, max: 500, isRoot: 1, start: 375, dir: 'ns', dirLock: 2 },
            'formLayout': { min: 300, max: 500, start: 375, dir: 'we', dirLock: 1 },
            'rootDiv': { head_h: 35, title: '物资文件管理' },
            'toolTab': { gbsID: 140, ifRights: true, itemAlign: 'right', skin: 'ButtonSet-default mr10' },
            'mainList': {
                aHeader: hAry,
                loadApi: 'm=SYS_TABLE_BASE&table=SYS_WH_MS_FILES&action=pagingForList',
                colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } },
                onTDClick: onListClick
            },
            'infoForm': {
                items: [
                    {
                        title: '清空表数据', name: 'ms', comType: 'Select', items: [
                            { text: '清空', value: 1 },
                            { text: '不清空', value: 0 }
                        ],
                        req: true
                    }
                ],
                head_h: 30,
                title: '导入数据',
                onSubmit: onInfoSubmit,
                onSubmitSuccess: function () { refresh(); }
            },
            'uploadForm': {
                items: [
                    { title: '物资结构文件', uploadApi: 'm=SYS_CM_MS&action=uploadMSFile&type=757', onComplete: refresh, name: 'ms', comType: 'FileUploader' },
                    { title: '物资文件', uploadApi: 'm=SYS_CM_MS&action=uploadMSFile&type=758', onComplete: refresh, name: 'msdetail', comType: 'FileUploader' }
                ],
                head_h: 30,
                foot_h: 0,
                title: '上传物资文件',
                onSubmitSuccess: function () { refresh(); }
            }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'rootLayout',
            eHead: {
                type: 'BaseDiv',
                name: 'rootDiv',
                head: [
                    //{ name: 'toolTab', type: 'ButtonSet' }
                ],
                body: { type: 'List', name: 'mainList' }
            },
            eFoot: {
                type: 'Layout',
                name: 'formLayout',
                eHead: { type: 'Form', name: 'uploadForm' },
                eFoot: { type: 'Form', name: 'infoForm' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        mainList = coms.mainList;
        infoForm = coms.infoForm;
    }

    function onInfoSubmit(obj) {
        var _action = "importMSIndex";
        switch (type) {
            case '757':
                _action = "importMSIndex";
                break;
            case '758':
                _action = "importMSDetail";
                break;
        }
        if (!path) {
            MTips.show('请选择文件', 'warn');
            return false;
        }
        MConfirm.setWidth(250).show('确定倒入数据?').evt('onOk', function () {
            $.Util.ajax({
                args: 'm=SYS_CM_MS&action=' + _action + '&path=' + path + '&ifReset='+obj.Value.ms,
                onSuccess: function () {
                    MTips.show('倒入数据成功', 'ok');
                }
            });
        });
        return false;
    }
    
    function onListClick(obj) {
        path = obj.Target.getAttr('path');
        type = obj.Target.getAttr('type');
    }

    function refresh() {
        mainList.refresh();
    }

    function delayShowInfo(proId) {
        if (!infoForm) { setTimeout(function () { delayShowInfo(proId); }, 200); return; }
        infoForm.loadDataByID(proId);
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