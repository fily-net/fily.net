$.NameSpace('$View.tools');
$View.tools.CodeEditor = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, onToolBarClick: _fn };
    var coms = {};
    var views = [], editor, pending;
    var btnAry = [
        { name: 'getValue', text: '获取值' },
        { name: 'saveValue', text: '保存' }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 30 },
            'toolBar': { items: btnAry, onClick: function (obj) { obj.CodeEditor = me; args.onToolBarClick(obj); } },
            'codeContainer': { html: '<textarea style="width:100%;height:100%;" name="code" id="code-edit" ></textarea>' }
        }
        var struct = {
            type: 'BaseDiv',
            name: 'root',
            head: { type: 'ButtonSet', name: 'toolBar' },
            body: { type: 'Container', name: 'codeContainer' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct, p: owner });
        editor = CodeMirror.fromTextArea($('code-edit'), {
            mode: "scheme",
            lineNumbers: true,
            matchBrackets: true,
            tabMode: "indent",
            onChange: function () {
                clearTimeout(pending);
                setTimeout(update, 400);
            }
        });
        //--**--Codeing here--**--//
    }

    function looksLikeScheme(code) {
        return !/^\s*\(\s*function\b/.test(code) && /^\s*[;\(]/.test(code);
    }

    function update() {
        editor.setOption("mode", looksLikeScheme(editor.getValue()) ? "scheme" : "javascript");
    }

    function bindEvent() {
        //--**--Codeing here--**--//
    }

    me.getValue = function () { return editor.getValue(); };
    me.setValue = function (value) { editor.setValue(value); };
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