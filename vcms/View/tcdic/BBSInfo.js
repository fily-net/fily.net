$.NameSpace('$View.tcdic');
$View.tcdic.BBSInfo = function (j) {
    var me = this, _fn = function () { };
    var owner, coms = {};
    var args = { p: $DB, fid: null };
    var rootTips, eDetail, eForm, eComment, popTips;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp fs12');
        var comArgs = { 'root': { head_h: 30, foot_h: 0, cn: 'b0', title: '评论', icon: 'icon-glyph-comment'} }
        var struct = { p: owner, type: 'Tips', name: 'root', body: [] };
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        rootTips = coms.root;
        var _eMain = rootTips.body;
        eDetail = _eMain.adElm('', 'div').css('background-color:#F9F9F9;border: 10px solid #fff;').h('<div class="b_17 p10 r5" style="min-height:64px;"></div>').fc();
        eComment = _eMain.adElm('', 'div').css('background-color:#F9F9F9;border: 10px solid #fff;').h('<div class="b_17 p10 r5"><ul></ul></div>').fc().fc();
        eComment.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t, _tid = _e.attr('tid');
            if (_e.tagName == 'SPAN' && _tid) {
                switch (_e.attr('mtips')) {
                    case '展开回复':
                        expandSons(_tid, _e);
                        break;
                    case '回复':
                        if (popTips) { popTips.remove(); popTips = null; }
                        popTips = new $.UI.Tips({ title: '回复', icon: 'icon-glyph-share-alt', head_h: 30, ifClose: true, ifDrag: false, comMode: 'x-auto', y: 120, width: 486, ifFixedHeight: false, ifMask: true });
                        popTips.Form = new $.UI.Form({ p: popTips.body, extSubmitVal: { pid: _tid }, insertApi: 'm=SYS_TABLE_TREE&table=SYS_CM_FORUM&action=addTreeNode', items: [{ ifHead: false, name: 'content', comType: 'RichText', width: 450, req: true}], ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; onReplySuccess(_tid, _e); } });
                        break;
                }
            }
            e.stop();
        });
        eForm = _eMain.adElm('', 'div').css('min-height:98px;background-color:#F9F9F9;border: 10px solid #fff;').h('<div class="b_17 p5 r5"></div>').fc();
        _eMain.adElm('', 'div').css('clear:both;');
        me.loadByID(args.fid);
    }

    function initDetail(info, files) {
        rootTips.setTitle(info.ftitle);
        eDetail.cn('email-info').css('margin: 10px;').h('<img class="r3 fl" src="images/avatar/' + info.uavatar + '" style="width:64px;height:64px;" /><div style="margin-left:70px;"><span style="padding-right:8px;font-weight: bold;">' + info.uname + '</span><span style="color:#A3A3A3;">' + info.fcTime + '</span><div style="line-height:2;">' + info.fcontent + '</div></div>');
        var _eFile = eDetail.adElm('', 'div').cn('file-list').css('margin-left:70px;'), _file;
        for (var i = 0, _len = files.length; i < _len; i++) {
            _file = files[i];
            _eFile.adElm('', 'a').h('<span class="download"></span><span MTips=' + _file.nodeName + '>' + _file.nodeName + '</span>').attr('target', '_self').attr('href', 'Module/SYS_CM_FILES.aspx?action=downloadFile&id=' + _file.id);
        }
    }

    function initForm(user, id) {
        eForm.h('<img class="r3 fl" src="images/avatar/' + (user.avatar || '64.jpg') + '" MTips="' + (user.uid || '') + '" style="width:64px;height:64px;" /><div style="margin-left:70px;"><div></div></div>');
        new $.UI.Form({ p: eForm.chn(1), extSubmitVal: { pid: id }, onSubmitSuccess: function () { MTips.show('评论成功!', 'ok'); me.loadByID(args.fid); }, insertApi: 'm=SYS_TABLE_TREE&table=SYS_CM_FORUM&action=addTreeNode', css: 'width:502px;', items: [{ name: 'content', comType: 'RichText', width: 500, height: 60, ifHead: false, req: true, sErr: '评论内容不能为空'}], btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '提交回复', icon: 'icon-glyph-hand-up', align: 'right'}], ifFixedHeight: false });
    }

    function initComment(dAry, p) {
        var _dLen = dAry.length;
        if (!_dLen) { p.h('<div class="tac"><span>还未评价哦!</span></div>'); return; }
        p.h('');
        for (var i = 0; i < _dLen; i++) { addReplyItem(dAry[i], p); }
    }

    function expandSons(_tid, _e) {
        $.Util.ajax({
            args: 'm=SYS_CM_OA&action=loadForumReplays&dataType=json&id=' + _tid,
            onSuccess: function (data) { initComment(eval(data.get(0) || '[]'), addReplyDom(_e)); }
        });
    }

    function onReplySuccess(_tid, _e) {
        expandSons(_tid, _e);
    }

    function addReplyDom(_e) {
        var _tempP = _e.pn(), _eT = $(_tempP.lastChild);
        if (_eT.attr('reply')) { _eT.show(); return _eT; }
        return _e.pn().adElm('', 'div').attr('reply', '1').css('border:1px solid #F8CB10;background-color: #FBEC98;padding:5px;');
    }

    function addReplyItem(obj, p) {
        var _id = obj.fid;
        p.adElm('', 'li').css('width:auto;margin:8px 0;border-bottom:1px dotted #E1E1E1;min-height:78px;').h('<img class="r3 fl" src="images/avatar/' + obj.uavatar + '" style="width:64px;height:64px;" /><div style="margin-left:70px;"><span style="padding-right:8px;font-weight: bold;">' + obj.uname + '</span><span style="color:#A3A3A3;">' + obj.fcTime + '</span><span class="fr fwb m5">' + obj.forder + '楼</span><span MTips="展开回复" tid="' + _id + '" class="fr icon-glyph-chevron-down m5 cp" ></span><span MTips="回复" tid="' + _id + '" class="fr icon-glyph-share-alt m5 cp" ></span><div style="line-height:2;">' + obj.fcontent + '</div></div>');
    }

    me.loadByID = function (id) {
        if (!id) { return me; }
        $.Util.ajax({
            args: 'm=SYS_CM_OA&action=loadForumByID&dataType=json&id=' + id,
            onSuccess: function (d) {
                var _user = eval(d.get(0) || '[]')[0], _info = eval(d.get(1))[0], _sons = eval(d.get(2) || '[]'), _files = eval(d.get(3) || '[]');
                args.fid = id; initDetail(_info, _files); initForm(_user || {}, _info.fid); initComment(_sons, eComment);
            },
            onError: function () { MTips.show('加载评论失败!', 'error'); }
        });
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