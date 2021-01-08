$.namespace('$View.help');
$View.help.MeekoDoc = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, key: 'nodeName', loadApi: '', fnId: 0, appId: 0, moduleId: 12 };
    var attrP, evtP, methodP;
    var _tbAry = [
        { name: 'upload', text: '上传文件', icon: 'icon-glyph-upload' },
        { name: 'del', text: '删除文件', icon: 'icon-glyph-minus-sign' }
    ];
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 320, dir: 'we', dirLock: 1 },
            'attrPanel': { title: '定义属性', icon: 'icon-compact-attr' },
            'eventPanel': { title: '回调函数', icon: 'icon-compact-event' },
            'methodPanel': { title: '对外函数', icon: 'icon-compact-method' },
            'tips-left': { head_h: 30, title: '组件列表(<font color="red">Meeko系统版本:v1.0.0</font>)', icon: 'icon-glyph-th-list', cn: 'b0' },
            'mainList': { loadApi: 'm=SYS_TABLE_TREE&table=SYS_CM_GLOBAL_TABLE&action=getNodesByPid&pid=15', onSuccess: function (obj) { obj.List.fireClick(0); }, onTDClick: onMainListClick }
        }
        var struct = {
            p: owner,
            type: 'Layout',
            name: 'rootLayout',
            eHead: { type: 'Tips', name: 'tips-left', body: { type: 'List', name: 'mainList'} },
            eFoot: [
                { type: 'AttrPanel', name: 'attrPanel' },
                { type: 'AttrPanel', name: 'eventPanel' },
                { type: 'AttrPanel', name: 'methodPanel' }
            ]
        }
        coms = $.layout({ args: comArgs, struct: struct });
        attrP = coms['attrPanel'].owner; evtP = coms['eventPanel'].owner; methodP = coms['methodPanel'].owner;
    }
    function _event() { }
    function _override() { }
    function onMainListClick(obj) {
        var _text = obj.Target.get('text');
        var _helpObj = $($.UI[_text].help());
        attrP.h(''); evtP.h(''); methodP.h('');
        new $.UI.Json({ p: attrP, value: _helpObj.args, title: _text + '属性' });
        new $.UI.Json({ p: evtP, value: {}, title: _text + '回调' });
        new $.UI.Json({ p: methodP, value: _helpObj.method, title: _text + '对外方法' });
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}