$.NameSpace('$View.oa');
$View.oa.EmailInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, id: null }, coms, eBody, eForm, mail;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _toolBarAry = [
            { text: '返回', cn: 'mr3 mt5', name: 'goBack', icon: 'icon-glyph-chevron-left' },
            { text: '回复', cn: 'mt5', name: 'reply', icon: 'icon-glyph-edit' }
        //{ text: '转发', cn: 'mt5', name: 'forword', icon: 'icon-glyph-share' }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 33 },
            'toolBar': { items: _toolBarAry, onClick: onToolBarClick, itemAlign: 'right' }
        }
        var viewStruct = { p: owner, type: 'BaseDiv', name: 'root', head: { name: 'toolBar', type: 'ButtonSet'} }
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
        eBody = coms.root.body.ac('email-info'); initInfo(args.id);
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'goBack':
                new $.UI.View({ p: args.p, url: 'View/oa/EmailReceived.js', email: args.email });
                break;
            case 'reply':
                eForm.dc('dn');
                break;
            case 'forword':
                
                break;
        }
    }

    function initInfo(id) {
        $.Util.ajax({
            args: 'm=SYS_CM_EMAIL&action=getInfo&dataType=json&keyFields=id,nodeName,link,content,CONVERT(varchar(100), cTime, 120) as cTime,dbo.SYS_TRANS_USER(cPerson) as cPName,dbo.SYS_TRANS_USERS(owners) as owners, cPerson&id=' + id,
            onSuccess: function (obj) {
                var _info = eval(obj.get(0) || '[]')[0], _files = eval(obj.get(1) || '[]'), _fLen = _files.length; mail = _info;
                eBody.h('<div class="item"><div class="title">' + _info.nodeName + '</div><div><span>收件人：</span><span>' + _info.cPName + '</span></div><div><span>时&nbsp;&nbsp;&nbsp;间：</span><span>' + _info.cTime + '</span></div><div><span>收件人：</span><span>' + _info.owners + '</span></div></div><div style="padding:10px 32px;" class="dn"></div><div class="content">' + _info.content + '</div>');
                eForm = eBody.chn(1);
                new $.UI.Form({
                    p: eForm,
                    ifFixedHeight: false,
                    items: [{ name: 'content', comType: 'RichText', ifHead: false, req: true, width: 450, sErr: '回复内容必填'}],
                    btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '回复', icon: 'icon-glyph-hand-right', css: 'margin-left: 400px;'}],
                    onSubmit: onReplySubmit
                });
                var _eFile = (new $.UI.Panel({ p: eBody, title: '附件(' + _fLen + '个)' })).body.cn('file-list'), _file;
                for (var i = 0, _len = _files.length; i < _len; i++) {
                    _file = _files[i];
                    _eFile.adElm('', 'a').h('<span class="download"></span><span MTips=' + _file.nodeName + '>' + _file.nodeName + '</span>').attr('target', '_self').attr('href', 'Module/SYS_CM_FILES.aspx?action=downloadFile&id=' + _file.id);
                }
            },
            onError: function () { MTips.show('加载失败', 'error'); }
        });
    }
    function onReplySubmit(obj) {
        var _str = obj.Data.IValue.content + '<br><div class="email-info replay">' + eBody.fc().h() + '<div class="detail">' + mail.content + '</div></div>';
        var _sVal = {
            nodeName: '回复: ' + mail.nodeName,
            owners: ',' + mail.cPerson + ',',
            link: mail.link,
            content: _str.replaceAll('&','%26')
        };
        $.Util.ajax({
            args: 'm=SYS_CM_EMAIL&action=send&json=' + $.JSON.encode(_sVal),
            onSuccess: function () {
                MTips.show('回复成功', 'ok'); new $.UI.View({ p: args.p, url: 'View/oa/EmailSended.js', email: args.email });
            }
        });

        return false;
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