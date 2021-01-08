$.namespace('$View.oa');
$View.oa.HomeManager = function (args) {
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB };
    var coms = {}, eBody;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { title: '主页模块管理', cn: 'b0', icon: 'icon-glyph-home', head_h: 37 },
            'typeTab': { items: [{ name: 'news', text: '养护信息' }, { name: 'notice', text: '公告' }], onTabClick: onTMenuClick }
        }
        var struct = { p: owner, type: 'Tips', name: 'root', body: { type: 'Tab', name: 'typeTab' } };
        coms = $.layout({ args: comArgs, struct: struct });
    }
    function _event() { }
    function _override() {}
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
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}