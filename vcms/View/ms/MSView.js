$.NameSpace('$View.ms');
$View.ms.MSView = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, table: 'SYS_WH_MS', rootID: 0, gbsID: 16, title: '物资查询' };
    var coms = {}, dirList, fileList, currID, popTips, fileID;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _mHeaderAry = [
            { name: 'id', type: 'attr' },
            { name: 'sons', type: 'attr' },
            { name: 'depth', type: 'attr' },
            { name: 'pid', type: 'attr' },
            { name: 'type', type: 'attr' },
            { name: 'code', type: 'attr' },
            { name: 'nodeName{1}{0}<font color="red">【{0}{1}code{1}{0}】</font>{0}', type: 'none' }
        ];
        var _fHeaderAry = [
            { title: '物资编号', name: 'msCode', type: 'none', width: 160 },
            { title: '物资名称', name: 'nodeName', type: 'none', width: 200 },
            { title: '类型', name: 'typeName', type: 'none', width: 200 },
            { title: '版本', name: 'version', type: 'none', width: 60 },
            { title: '规格', name: 'guiGe', type: 'none', width: 120 },
            { title: '单位', name: 'danWei', type: 'none', width: 80 },
            { title: '物资税种', name: 'shuiZhong', type: 'none', width: 160 }
        ];
        var comArgs = {
            'rootTips': { head_h: 32, foot_h: 0, cn: 'b0', title: args.title, icon: 'fa-file-o', toolBarSkin: 'Button-default' },
            'rootLayout': { min: 300, max: 500, isRoot: 1, start: 380, dir: 'we', dirLock: 1 },
            'dirList': { aHeader: _mHeaderAry, style: 'tree:nodeName{1}{0}<font color="red">【{0}{1}code{1}{0}】</font>{0}', onSuccess: function (obj) { obj.List.fireClick(0); }, onTDClick: onDirListClick },
            'fileList': { aHeader: _fHeaderAry, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1} }, onTDDoubleClick: onFileDoubleClick, onTDClick: onListTDClick }
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
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        dirList = coms.dirList;
        fileList = coms.fileList;
        me.loadDirectory(args.rootID);
    }
    function onListTDClick(obj) { fileID = obj.Target.getAttr('rowid'); console.log(fileID); }
    
    function onFileDoubleClick(obj) {
        return;
        if (+obj.getAttr('sons')) { me.loadDirectory(obj.getAttr('rowid')); } else { MTips.show('该文件夹没有子项啦!', 'warn') }
    }
    function onDirListClick(obj) {
        var _code = obj.Target.getAttr('code');
        if (!_code) { return; }
        fileList.loadAjax({ args: 'm=SYS_CM_MS&action=pagingForMSDetail&code='+_code });
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