$.NameSpace('$View.website');
$View.website.FileView = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, pid: 0, onClick: _fn };
    var coms = {}, paging, eList;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 0, foot_h: 30, cn: 'b0', title: '文件视图', icon: 'fa fa-th-list' },
            'paging': { onSelect: change, onClick: change }
        }
        var struct = { p: owner, type: 'Tips', name: 'root', foot: { name: 'paging', type: 'Paging' } }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        paging = coms.paging;
        eList = coms.root.body.cn('Waterfall').h('<ul class="ListItem"></ul>').fc().evt('click', onOwnerClick);
        loadNews(args.pid);
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'back':
                new $.UI.View({ p: args.p, url: 'View/home/Index.js' });
                break;
        }
    }

    function onOwnerClick(e) {
        var e = $.e.fix(e), _e = e.t, _tid = _e.attr('_tid'), _eTitle = _e.pn().pn(), _ePanel = _eTitle.pn();
        if (_e.tagName == 'A' && _tid) {
            if (_e.className.trim() == 'fa fa-arrow-circle-o-right') {
                if (_eTitle.ns()) {
                    _eTitle.ns().show(); _eTitle.ns().ns().show(); _e.cn('fa fa-arrow-circle-o-down');
                } else {
                    //_e.cn('loading16');
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

    function change() {
        loadNews(args.pid);
    }

    function loadNews(pid) {
        
        var _pIdx = paging.get('pageIndex'), _pSize = paging.get('pageSize');
        eList.h('<div style="padding:20px;z-index:20;text-align:center;"><img src="images/loading/gif/loading51.gif" /></div>');
        $.Util.ajax({
            args: 'm=SYS_TABLE_TREE&table=SYS_CM_FILES&action=pagingForTreeList&dataType=json&pageIndex=' + _pIdx + '&pageSize=' + _pSize + '&jsonCondition={"pid": ' + pid + '}',
            onSuccess: function (d) {
                var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length;
                if (!_dLen) {
                    eList.h('<div style="padding:20px;text-align:center;"><img src="images/EmptyData.gif"></div>');
                } else {
                    eList.h('');
                }
                for (var i = 0; i < _dLen; i++) {
                    addItem(_dAry[i]);
                }
                paging.setTotal(+eval(d.get(1) || '[]')[0].count);
            }
        });
    }

    

    function addItem(obj) {
        var _html = '', _ext = obj.extName.toLow(), _sys = obj.sysName, _catelog = obj.catelog;
        var _path = 'uploads/' + _catelog + '/' + _sys + '.' + _ext;
        switch(_ext){
            case 'png':
            case 'jpg':
                _html = '<div style="margin: 10px;"><img style="height: 120px;" src="'+_path+'" /><div style="margin: 10px;">'+_path+'</div></div>';
                break;
            case 'mp4':
                _html = '<div style="margin: 10px;"><video src="' + _path + '" width="500" height="250" controls="controls">您的浏览器不支持此种视频格式。</video></div>';
                break;
            default:
                _html = '<div style="margin: 10px;">' + _path + '</div>';
                break;
        }
        var eLi = eList.adElm('', 'li').h(_html).attr('path', 'uploads/' + _catelog + '/' + _sys + '.' + _ext);
        eLi.evt('click', function (e) {
            var e = $.e.fix(e);
            var _t = findLi(e.t);
            e.stop();
            args.onClick(_t.attr('path'));
        });
    }

    function findLi(_t) {
        if (_t.tagName == "LI") {
            return _t;
        } else {
            return findLi(_t.pn());
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