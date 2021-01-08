$.NameSpace('$View.meeko');
$View.meeko.ViewManager = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms = {};
    var views = [];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 320, dir: 'we', dirLock: 1 },
            'viewTab': { head_h: 33, btnSkin: 'Button-default', skin: 'BaseDiv-Gray', items: [{ name: 'helpDoc', text: 'Meeko框架帮助文档', icon: 'fa fa-home'}], onClose: function (obj) { views[obj.Name] = null; delete views[obj.Name]; } },
            'helpDoc': { url: 'View/help/MeekoDoc.js' },
            'viewStruct': { head_h: 33, title: 'View文件目录', cn: 'bc_7', icon: 'fa fa-list'},
            'fileBrowser': { onFileClick: function (obj) { newPage(obj); }, items: [{ text: 'ViewManager', value: 'ViewManager.js' }, { text: 'IconSelector', value: 'IconSelector.js'}] }
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
                items: [{ type: 'View', name: 'helpDoc'}]
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });

        //--**--Codeing here--**--//
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
    function bindEvent() {
        //--**--Codeing here--**--//
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