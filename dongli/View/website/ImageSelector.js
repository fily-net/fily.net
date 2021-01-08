$.NameSpace('$View.website');
$View.website.ImageSelector = function (j) {
    var me = this, _fn = function () { };
    var owner, args = { p: $DB, cn: '', onItemClick: _fn }, pObj = {}, clipBoard;
    var sel;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = new $.UI.Tips({ p: args.p, head_h: 30, title: '图片视频资源选择器', cn: 'IconSelector' });
        $.Util.ajax({
            args: "m=SYS_CM_FILES&action=getImages&dataType=json",
            onSuccess: function (data) {
                var _iAry = eval(data.get(0)||'[]');
                for (var i = 0, _iLen = _iAry.length; i < _iLen; i++) { addIcon(_iAry[i]); }
            }
        });
    }

    function addIcon(val) {
        var _eT = owner.body;
        var _path = "uploads/docmg/" + val.sysName + "." + val.extName;
        var _eLi = _eT.adElm('', 'li').cn('icon-item').css('margin:20px;').h('<img imgPath="' + val.imageUrl + '" videoPath="' + val.videoUrl + '" src=' + _path + ' style="width: 320px;height:240px;" />');
        _eLi.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t; e.stop();
            if (_e.tagName == 'LI') {
                _e = _e.fc();
            }
            args.onItemClick({
                Self: me,
                imagePath: _e.attr('imgPath'),
                videoPath: _e.attr('videoPath')
            });
        });
    }
    me.getArgs = function () { return args; }
    me.evt = function (key, fn) { me.set(key, fn); return me; }
    me.set = function (key, value) { args[key] = value; return me; }
    me.get = function (key) { return args[key]; }
    me.show = function () { owner.show(); return me; }
    me.hide = function () { owner.hide(); return me; }
    me.remove = function () { owner.remove(); me = null; delete me; }
    me.init = function (j) { setDefault(j); layout(); return me; }
    if (arguments.length) { me.init(j); }
    return me;
}