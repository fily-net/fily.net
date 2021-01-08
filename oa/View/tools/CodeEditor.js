$.namespace('$View.tools');
$View.tools.CodeEditor = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, onToolBarClick: _fn };
    var views = [], editor, pending;
    var btnAry = [
        { name: 'getValue', text: '获取值' },
        { name: 'saveValue', text: '保存' }
    ];
    function _default() { }
    function _layout() {
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
        coms = $.layout({ args: comArgs, struct: struct, p: owner });
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
    }
    function _event() { }
    function _override() { }
    function looksLikeScheme(code) {
        return !/^\s*\(\s*function\b/.test(code) && /^\s*[;\(]/.test(code);
    }

    function update() {
        editor.setOption("mode", looksLikeScheme(editor.getValue()) ? "scheme" : "javascript");
    }
    me.getValue = function () { return editor.getValue(); };
    me.setValue = function (value) { editor.setValue(value); };
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}