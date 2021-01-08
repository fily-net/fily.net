$.NameSpace('$View.oa');
$View.oa.HomeManager = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms = {}, eBody;
    var mItems = [
        { name: 'news', text: '施工信息', value: 22, icon: 'fa fa-bell' },
        { name: 'notice', text: '日常公告信息', value: 23, icon: 'fa fa-bars' }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { title: '公共信息管理', cn: 'b0', icon: 'fa fa-newspaper-o', head_h: 30 },
            'main': { head_h: 35 },
            'types': { gbsID: 149, onClick: onTMenuClick, skin: 'ButtonSet-tab fl', gbsType: 'tab', onSuccess: function (obj) { obj.ButtonSet.fireClick(0); } }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: {
                type: 'BaseDiv',
                name: 'main',
                head: { type: 'ButtonSet', name: 'types' }
            }
        };
        coms = $.Util.initUI({ args: comArgs, struct: struct });
    }

    function onTMenuClick(obj) {
        var fiAry = [], _loadApi = 'm=SYS_TABLE_BASE&action=pagingForList&',
            _table = '',
            _body = coms.main.body,
            _headAry = [];
        switch (obj.name) {
            case '150':
                fiAry = [
                    { name: 'title', title: '标题', comType: 'Input', width: 430, req: true },
                    { name: 'bTime', title: '开始时间', comType: 'Date', req: true, width: 430 },
                    { name: 'eTime', title: '截止时间', comType: 'EndDate', matchItem: 'bTime', width: 430, req: true },
                    { name: 'link', title: '附件', comType: 'FileUploader', width: 430 },
                    { name: 'content', title: '内容', comType: 'RichText', width: 437, req: true }
                ];
                _table = 'SYS_CM_NOTICE';
                _loadApi += 'table=' + _table;
                _headAry = [
                    { title: '标题', name: 'title', width: 150 },
                    { title: '创建时间', name: 'cTime', type: 'date', width: 130 },
                    { title: '修改时间', name: 'mTime', type: 'date', width: 130 },
                    { title: '创建人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 100 }
                ];
                break;
            case '151':
                fiAry = [
                    { name: 'title', title: '标题', comType: 'Input', width: 430, req: true },
                    { name: 'link', title: '附件', comType: 'FileUploader', width: 430 },
                    { name: 'content', title: '内容', comType: 'RichText', width: 437, req: true }
                ];
                _table = 'SYS_CM_NEWS';
                _loadApi += 'table=' + _table;
                _headAry = [
                    { title: '标题', name: 'title', width: 150 },
                    { title: '创建时间', name: 'cTime', type: 'date', width: 130 },
                    { title: '修改时间', name: 'mTime', type: 'date', width: 130 },
                    { title: '创建人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 100 }
                ];
                break;
            case 'image':
                new $.UI.View({ p: _body, url: 'View/common/ImageInfo.js', loadApi: 'm=SYS_CM_FILES&action=getFilesList&jsonCondition={"pid":5}' });
                return;
        }
        new $.UI.View({ p: _body, url: 'View/common/MasterInfo.js', fiAry: fiAry, aHeader: _headAry, loadApi: _loadApi, table: _table });
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