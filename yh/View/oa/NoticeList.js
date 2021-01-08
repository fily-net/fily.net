$.NameSpace('$View.oa');
$View.oa.NoticeList = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms = {}, paging, eList;
    var _html = '<div class="title"><a _tk="SYS_CM_NOTICE" _tid="{0}" class="icon-compact-line-r"></a><div class="_title">{1}</div><div class="_info"><span style="margin-right:15px;">发布人：{2}</span><span>发布于：{3}</span></div><div class="_info"><span style="margin-right:15px;">开始时间：{4}</span><span>截止时间：{5}</span></div></div></div>';
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 30, foot_h: 25, cn: 'b0', title: '公告栏列表', icon: 'icon-glyph-th-list', toolBarSkin: 'Button-default', toolBarAry: [{ text: '回到首页', name: 'back', icon: 'icon-glyph-arrow-left', css: 'margin-top:3px;', cn: 'mr10'}], onToolBarClick: onToolBarClick },
            'paging': { onSelect: loadNotices, onClick: loadNotices }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            foot: { name: 'paging', type: 'Paging' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        paging = coms.paging; eList = coms.root.body.cn('Waterfall').h('<ul class="ListItem"></ul>').fc().evt('click', onOwnerClick); loadNotices();
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'back':
                new $.UI.View({ p: args.p, url: 'View/oa/Home.js' });
                break;
        }
    }

    function loadNotices() {
        var _pIdx = paging.get('pageIndex'), _pSize = paging.get('pageSize'); eList.h('<div style="padding:20px;z-index:20;text-align:center;"><img src="images/loading/gif/loading51.gif" /></div>');
        $.Util.ajax({
            args: 'm=SYS_CM_HOME&action=loadNotices&dataType=json&pageIndex=' + _pIdx + '&pageSize=' + _pSize,
            onSuccess: function (d) {
                var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length;
                if (!_dLen) { eList.h('<div style="padding:20px;text-align:center;"><img src="images/EmptyData.gif"></div>'); } else { eList.h(''); }
                for (var i = 0; i < _dLen; i++) { addItem(_dAry[i]); }
                paging.setTotal(+eval(d.get(1)||'[]')[0].count); 
            }
        });
    }
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
    function addItem(obj) {
        eList.adElm('', 'li').h(_html.format(obj.id, obj.title, obj.cPerson, obj.cTime, obj.bTime, obj.eTime));
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