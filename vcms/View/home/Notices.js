$.NameSpace('$View.home');
$View.home.Notices = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, data: null, allCount: 0 };
    var _html1 = '<li><div class="title"><a _tk="SYS_CM_NOTICE" _tid="{0}" class="fa fa-arrow-circle-o-right"></a><div class="_title">{1}</div><div class="_info"><span style="margin-right:15px;">发布人：{2}</span><span>发布于：{3}</span></div><div class="_info"><span style="margin-right:15px;">生效时间：{4}</span><span>截止时间：{5}</span></div></div></li>';
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _htmls = '', _new = null, _len = args.data.length;
        for (var i = 0; i < _len; i++) {
            _new = args.data[i];
            _htmls += _html1.format(_new.id, _new.title, _new.cPerson, _new.cTime, _new.bTime, _new.eTime);
        }
        owner = args.p.h('<div class="info-panel"><div class="panel-head"><div class="info-title">日常公告</div><a class="info-tag" url="View/oa/NoticeList.js">' + args.allCount + '</a></div><div class="panel-body scroll-webkit"><ul>' + _htmls + '</ul></div></div>').evt('click', onOwnerClick);
    }
    function onOwnerClick(e) {
        var e = $.e.fix(e), _e = e.t, _tid = _e.attr('_tid'), _eTitle = _e.pn(), _ePanel = _eTitle.pn();
        if (_e.tagName == 'A' && _tid) {
            if (_e.className.trim() == 'fa fa-arrow-circle-o-right') {
                if (_eTitle.ns()) {
                    _eTitle.ns().show(); _eTitle.ns().ns().show(); _e.cn('fa fa-arrow-circle-o-down');
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
                            _e.cn('fa fa-arrow-circle-o-down');
                        }
                    });
                }
            } else {
                _eTitle.ns().hide(); _eTitle.ns().ns().hide(); _e.cn('fa fa-arrow-circle-o-right');
            }
        }
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


