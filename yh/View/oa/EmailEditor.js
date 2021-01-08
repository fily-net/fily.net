$.NameSpace('$View.oa');
$View.oa.EmailEditor = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, formId: null }, coms, infoForm;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _toolBarAry = [
            { text: '发送', cn: 'mr3 mt5', name: 'send', icon: 'icon-glyph-hand-up' },
            { text: '存草稿', cn: 'mt5', name: 'saveAsCopy', icon: 'icon-compact-make-alone' }
        ];
        var _formAry = [
            { title: '标题', name: 'nodeName', comType: 'Input', width: 545, req: true, group: { width: 700 }, sErr: '邮件标题必填' },
            { title: '收件人', name: 'owners', comType: 'UserSelector', css: 'width:545px;', sErr: '收信人必填', req: true },
            { title: '附件', name: 'link', comType: 'FileUploader', uploadApi: 'm=SYS_CM_FILES&action=uploadFile' },
            { title: '正文', name: 'content', comType: 'RichText', width: 550, height: 400 }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 33, cn: 'b0', title: '写信', icon: 'icon-glyph-pencil', toolBarAry: _toolBarAry, toolBarSkin: 'Button-default', onToolBarClick: onToolBarClick },
            'form': { foot_h: 0, items: _formAry, loadApi: 'm=SYS_CM_EMAIL&action=getInfo', updateApi: 'm=SYS_CM_EMAIL&action=updateDrafts' }
        }
        var viewStruct = { p: owner, type: 'Tips', name: 'root', body: { type: 'Form', name: 'form'} }
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
        infoForm = coms.form;
        if (args.formId) { infoForm.loadDataByID(args.formId); }
    }

    function onToolBarClick(obj) {
        var _name = obj.Name;
        if (_name == 'send') {
            if (infoForm.check() == false) { return false; }
            infoForm.set('state', 'Insert').set('insertApi', 'm=SYS_CM_EMAIL&action=' + _name);
        } else {
            infoForm.check();
            if (args.formId) {
                infoForm.set('state', 'Update');
            } else {
                infoForm.set('state', 'Insert').set('insertApi', 'm=SYS_CM_EMAIL&action=' + _name);
            }
        }
        infoForm.evt('onSubmitSuccess', function (obj) {
            if (_name == 'send') {
                MTips.show('发送成功', 'ok');
                if (args.formId) { $.Util.ajax({ args: 'm=SYS_CM_EMAIL&action=delEmails&ids=' + args.formId }); }
            } else {
                MTips.show('保存草稿成功', 'ok');
            }
            args.email.fireClick(_name);
        }).submit();
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