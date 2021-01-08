$.namespace('$View.xd');
$View.xd.PageManager = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB }, views = [];
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'viewStruct': { head_h: 30, title: '文件列表', cn: 'bc_7', icon: 'icon-glyph-list'}
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'viewStruct',
            body: { type: 'FileBrowser', name: 'fileBrowser' }
        }
        coms = $.layout({ args: comArgs, struct: struct });
    }
    function _event() { }
    function _override() { }
    function loadFilesByDir (){
        $.Util.ajax({ 
            args: { m: 'SYS_CM_FILES', action: 'getDirFiles', dir: dir, fileType: args.fileType }, 
            onSuccess: function (obj) { _fn(obj); } 
        });
    }

    function newPage(obj) {
        var _eLi = obj.eLi, _fullName = _eLi.attr('fullName'), _txt = _eLi.attr('name');
        if (views[_fullName]) { coms.viewTab.setSelTab(_fullName); return; }
        var _pItem = coms.viewTab.addTabItem({ name: _fullName, text: _txt, ifClose: true }, true);
        var view = new $.UI.View({
            p: _pItem.Body,
            url: _fullName,
            onLoad: function (view, args) { }
        });
        views[_fullName] = view;
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}