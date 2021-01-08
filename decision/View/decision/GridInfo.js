$.NameSpace('$View.decision');
$View.decision.GridInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, userId: null }, coms, infoF, popTips;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _data = args.data;
        var _html = "";
        _html += '<div><div>标题：</div><div>'+_data.title+'</div></div>';
        _html += '<div><div>故事梗概：</div><div>'+_data.note+'</div></div>';

        $.Util.ajax({
            args: 'm=SYS_CM_FILES&action=getFilesByLink&dataType=json&jsonCondition={"type":1}&link=' + _data.attachments,
            onSuccess: function (d) { 
                var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length;

                var _avatars = _data.avatars.split(',').map(function (value){
                    if(value){
                        return '<img class="avatar" src="./Module/SYS_CM_FILES.aspx?action=downloadFile&id='+value+'" />';
                    }
                });
                _html += '<div><div>封面：</div><div>'+_avatars.join('')+'</div></div>';


                var _videos = _data.videos.split(',').map(function (value){
                    if(value){
                        return '<video class="video" controls="controls" src="./Module/SYS_CM_FILES.aspx?action=downloadFile&id='+value+'" >您的浏览器需要升级到最新版本。</video>';
                    }
                });
                _html += '<div><div>视频：</div><div>'+_videos.join('')+'</div></div>';


                var _attchments = _dAry.map(function (value){
                    if(value){
                        return '<div><a class="file" href="./Module/SYS_CM_FILES.aspx?action=downloadFile&id='+value.id+'" >'+value.nodeName+'</a></div>';
                    }
                });

                _html += '<div><div>附件：</div><div>'+_attchments.join('')+'</div></div>';
                owner = args.p.adElm('', 'div').cn('grid-info').h(_html);
            }
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