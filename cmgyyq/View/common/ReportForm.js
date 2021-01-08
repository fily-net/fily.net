$.NameSpace('$View.common');
$View.common.ReportForm = function(j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div');
        //--**--Codeing here--**--//


        var comArgs = {
            'root': { head_h: 30, foot_h: 25 },
            'root1':{this['root']},
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 320, dir: 'we', dirLock: 1 },
            'viewTab': { head_h: 30, btnSkin: 'Button-default', items: [{ name: 'home', text: '首页', icon: 'icon-glyph-home'}] },
            'viewStruct': { head_h: 30, title: 'View文件目录', icon: 'icon-glyph-list', toolBarAry: [{ name: 'refresh', icon: 'icon-glyph-refresh', title: '刷新' }, { name: 'update', icon: 'icon-glyph-pencil', title: '修改'}] },
            'fileMenu': { onClick: function (obj) { newPage(obj); }, items: [{ text: 'ViewManager', value: 'ViewManager.js' }, { text: 'IconSelector', value: 'IconSelector.js'}] }
        }


        var viewStruct = {
            p: owner,
            type: 'BaseDiv',
            name: 'root',
            head: {
                type: 'Layout',
                name: 'rootLayout'
            },
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: {
                    type: 'Tips',
                    name: 'viewStruct',
                    body: { type: 'Menu', name: 'fileMenu' }
                },
                eFoot: { type: 'Tab', name: 'viewTab' }
            }
        }

        var coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
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
    return me;
}