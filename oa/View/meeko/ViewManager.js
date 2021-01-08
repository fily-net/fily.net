$.namespace('$View.meeko');
$View.meeko.ViewManager = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB }, views = [];
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 220, dir: 'we', dirLock: 1 },
            'viewTab': { head_h: 30, btnSkin: 'Button-default', skin: 'BaseDiv-Gray', items: [{ name: 'helpDoc', text: 'Meeko框架帮助文档', icon: 'icon-glyph-home' }], onClose: function (obj) { views[obj.Name] = null; delete views[obj.Name]; } },
            'helpDoc': { url: 'View/help/MeekoDoc.js' },
            'viewStruct': { head_h: 30, title: 'View文件目录', cn: 'bc_7', icon: 'icon-glyph-list' },
            'fileBrowser': { onFileClick: function (obj) { newPage(obj); }, items: [{ text: 'ViewManager', value: 'ViewManager.js' }, { text: 'IconSelector', value: 'IconSelector.js' }] }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'rootLayout',
            eHead: {
                type: 'Tips',
                name: 'viewStruct',
                body: { type: 'FileBrowser', name: 'fileBrowser' }
            },
            eFoot: {
                type: 'Tab',
                name: 'viewTab',
                items: [{ type: 'View', name: 'helpDoc' }]
            }
        }
        coms = $.layout({ args: comArgs, struct: struct });
    }
    function _event() { }
    function _override() { }
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