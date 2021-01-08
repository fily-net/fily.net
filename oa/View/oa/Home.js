$.namespace('$View.oa');
$View.oa.Home = function (args) {
    var me = this, owner, _fn = function () { };
    var _args = { p: $DB };
    var newP, noticeP, imgP;
    var _html1 = '<li><div class="title"><a _tk="SYS_CM_NEWS" _tid="{0}" class="icon-compact-line-r"></a><div class="_title">{1}</div><div class="_info"><span style="margin-right:15px;">发布人：{2}</span><span>发布于：{3}</span></div></div></li>';
    var _htmlNotice = '<li><div class="title"><a _tk="SYS_CM_NOTICE" _tid="{0}" class="icon-compact-line-r"></a><div class="_title">{1}</div><div class="_info"><span style="margin-right:15px;">发布人：{2}</span><span>发布于：{3}</span></div><div class="_info"><span style="margin-right:15px;">开始时间：{4}</span><span>截止时间：{5}</span></div></div></li>';
    var _htmlImg = '<li><div class="title"><a class="icon-compact-line-r"></a><div class="_title">{0}</div><div class="_info"><span style="margin-right:15px;">发布人：{1}</span><span>发布于：{2}</span></div></div><div><img src="{3}"></div><div class="attach"><span>附件：</span><div class="files"><a href="Module/SYS_CM_FILES.aspx?action=downloadFile&id={5}">{4}</a></div></div></li>';
    var _htmlBBS = '<li><div class="title"><div class="_title"><a url="View/oa/BBSInfo.js" fId="{0}">{1}</a></div><div class="_info"><span style="margin-right:15px;">发布人：{2}</span><span>发布于：{3}</span></div></div></li>';
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('Waterfall scroll-webkit').evt('click', onOwnerClick);
        noticeP = owner.adElm('', 'div').h('<div><span>公告栏</span><a url="View/oa/NoticeList.js" onclick="return false;">完整信息</a></div><ul class="ListItem" style="margin-top: 50px;"></ul>').chn(1);
        newP = owner.adElm('', 'div').h('<div><span>信息</span><a url="View/oa/NewsList.js" onclick="return false;">完整信息</a></div><ul class="ListItem" style="margin-top: 50px;"></ul>').chn(1);
        imgP = owner.adElm('', 'div').h('<div><span>我的任务</span></div><ul class="ListItem" style="margin-top: 50px;"></ul>').chn(1);
        $.Util.ajax({
            args: 'm=SYS_CM_HOME&action=init&dataType=json',
            onSuccess: function (obj) {
                var _newAry = eval(obj.get(0) || '[]'), _noticeAry = eval(obj.get(2) || '[]'), _imgAry = eval(obj.get(4) || '[]');
                var _len = Math.max(_newAry.length, _noticeAry.length); _len = Math.max(_len, _imgAry.length);
                var _newStrAry = [], _noticeStrAry = [], _imgStrAry = [];
                for (var i = 0; i < _len; i++) {
                    var _new = _newAry[i], _notice = _noticeAry[i], _img = _imgAry[i];
                    if (_new) { _newStrAry.push(_html1.format(_new.id, _new.title, _new.cPerson, _new.cTime)); }
                    if (_notice) { _noticeStrAry.push(_htmlNotice.format(_notice.id, _notice.title, _notice.cPerson, _notice.cTime, _notice.bTime, _notice.eTime)); }
                    //if (_img) { _imgStrAry.push(_htmlImg.format(_img.nodeName, _img.cPerson, _img.cTime, _img.src, _img.nodeName, _img.id)); }
                    if (_img) { _imgStrAry.push(_htmlBBS.format(_img.id, _img.title, _img.cPerson, _img.cTime)); }
                }
                imgP.adElm('', 'li').h('<div class="title"><div class="_title">会议</div><div class="_info"><a style="margin-right:15px;cursor:pointer;" url="View/oa/Meeting.js">还有<span style="color:red;" class="fwb">' + eval(obj.get(6) || '[]')[0].count + '</span>条待处理会议</a></div></div>');
                imgP.adElm('', 'li').h('<div class="title"><div class="_title">邮件</div><div class="_info"><a style="margin-right:15px;cursor:pointer;" url="View/oa/EmailReceived.js">还有<span style="color:red;" class="fwb">' + eval(obj.get(7) || '[]')[0].count + '</span>条未读邮件</a></div></div>');
                newP.h(_newStrAry.join('')); noticeP.h(_noticeStrAry.join('')); //imgP.h(_imgStrAry.join(''));
            }
        });
    }
    function _event() { }
    function _override() { }
    function onOwnerClick(e) {
        var e = $.e.fix(e), _e = e.t, _tid = _e.attr('_tid'), _eTitle = _e.pn(), _ePanel = _eTitle.pn();
        if (_e.tagName == 'A' && _tid) {
            if (_e.className.trim() == 'icon-compact-line-r') {
                if (_eTitle.ns()) {
                    _eTitle.ns().show(); _eTitle.ns().ns().show(); _e.cn('icon-compact-line-b');
                } else {
                    _e.cn('loading16');
                    $.Util.ajax({
                        args: 'm=SYS_CM_HOME&action=loadDetailById&dataType=json&tk=' + _e.attr('_tk') + '&tid=' + _tid,
                        onSuccess: function (obj) {
                            var _fAry = eval(obj.get(1) || '[]'), _fLen = _fAry.length, _content = eval(obj.get(0) || '[]')[0].content, _sFile = '';
                            for (var i = 0; i < _fLen; i++) { var _file = _fAry[i]; _sFile += '<a href="Module/SYS_CM_FILES.aspx?action=downloadFile&id=' + _file.id + '" >' + _file.nodeName + '</a>'; }
                            if (!_sFile) { _sFile = '<a>没有相关附件</a>'; }
                            _ePanel.adElm('', 'div').cn('content').h(_content.replaceAll('<br>', ''));
                            _ePanel.adElm('', 'div').cn('attach').h('<span>附件：</span><div class="files">' + _sFile + '</div>');
                            _e.cn('icon-compact-line-b');
                        }
                    });
                }
            } else {
                _eTitle.ns().hide(); _eTitle.ns().ns().hide(); _e.cn('icon-compact-line-r');
            }
        }
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}


