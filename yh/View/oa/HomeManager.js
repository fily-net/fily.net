$.NameSpace('$View.oa');
$View.oa.HomeManager = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms = {}, eBody;
    var mItems = [
        { name: 'news', text: '养护信息', value: 22, icon: 'icon-compact-tips' },
        { name: 'notice', text: '公告', value: 23, icon: 'icon-compact-info-card' }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { title: '主页模块管理', cn: 'b0', icon: 'icon-glyph-home', head_h: 30 },
            'typeTab': { items: mItems, onTabClick: onTMenuClick }
        }
        var struct = { p: owner, type: 'Tips', name: 'root', body: { type: 'Tab', name: 'typeTab'} };
        coms = $.Util.initUI({ args: comArgs, struct: struct });
    }

    function onTMenuClick(obj) {
        var fiAry = [], _loadApi = 'm=SYS_TABLE_BASE&action=pagingForList&', _table = '', _body = obj.Body;
        switch (obj.Name) {
            case 'notice':
                fiAry = [
                    { name: 'title', title: '标题', comType: 'Input', width: 430, req: true },
                    { name: 'bTime', title: '开始时间', comType: 'Date', req: true, width: 430 },
                    { name: 'eTime', title: '截止时间', comType: 'EndDate', matchItem: 'bTime', width: 430, req: true },
                    { name: 'link', title: '附件', comType: 'FileUploader', width: 430 },
                    { name: 'content', title: '内容', comType: 'RichText', width: 437, req: true }
                ];
                _table = 'SYS_CM_NOTICE';
                _loadApi += 'table=' + _table;
                break;
            case 'news':
                fiAry = [
                    { name: 'title', title: '标题', comType: 'Input', width: 430, req: true },
                    { name: 'link', title: '附件', comType: 'FileUploader', width: 430 },
                    { name: 'content', title: '内容', comType: 'RichText', width: 437, req: true }
                ];
                _table = 'SYS_CM_NEWS';
                _loadApi += 'table=' + _table;
                break;
            case 'image':
                new $.UI.View({ p: _body, url: 'View/common/ImageInfo.js', loadApi: 'm=SYS_CM_FILES&action=getFilesList&jsonCondition={"pid":5}' });
                return;
        }
        new $.UI.View({ p: _body, url: 'View/common/MasterInfo.js', fiAry: fiAry, loadApi: _loadApi, table: _table });
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