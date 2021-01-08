$.NameSpace('$View.crm');
$View.crm.MsgList = function (j) {
    var me = this, _fn = function () { };
    var owner, coms, args = { p: $DB, proId: null };
    var hTemp = '<div class="title"><div class="_title">{0}</div><div class="_info"><span style="margin-right:15px;">发布人：{1}</span><span>发布于：{2}</span></div></div><div class="content dn">{3}</div></div>';
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'ul').cn('ListItem');
        $.Util.ajax({
            args: 'm=SYS_CM_HOME&action=loadNews&dataType=json&pageIndex=1&pageSize=20',
            onSuccess: function (d) {
                var _listAry = eval(d.get(0) || '[]'), obj;
                for (var i = 0, _len = _listAry.length; i < _len; i++) {
                    obj = _listAry[i];
                    owner.adElm('', 'li').h(hTemp.format(obj.title, obj.cPerson, obj.cTime, obj.content)).evt('click', onNewsItemClick);
                }
            },
            onError: function (d) { MTips.show(d.data || '加载失败', 'error'); }
        });
    }
    function onNewsItemClick(e) {
        var e = $.e.fix(e), _e = e.t;
        var _eLi = findLi(_e), _lc = $(_eLi.lastChild);
        if (_lc.className.ec('dn')) { _lc.dc('dn'); } else { _lc.ac('dn'); }
        e.stop();
    }
    function findLi(_e) { if (_e.tagName == 'LI') { return _e; } else { return findLi(_e.pn()); } }
    me.init = function (j) { setDefault(j); layout(); return me; }
    if (arguments.length) { me.init(j); }
    return me;
}