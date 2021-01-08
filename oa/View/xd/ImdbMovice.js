$.namespace('$View.xd');
$View.xd.ImdbMovice = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var infoBody, imgBody, currID, popTips, url;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _taskAry = [
            { name: 'id', type: 'attr' },
            { name: 'imdblink', type: 'attr' },
            { title: '排名', name: 'rank', type: 'none', width: 50, ifFilter: true, filterItems: ['like'] },
            { title: '影片名称', name: 'name', type: 'none', width: 220, ifFilter: true, filterItems: ['like'], ifEnabledTips: true },
            { title: 'IMDB评分', name: 'imdbfen', type: 'none', width: 80, ifFilter: true, filterItems: ['like'] },
            { title: '豆瓣评分', name: 'doubanfen', type: 'none', width: 80, ifFilter: true, filterItems: ['like'] },
            { title: '类型', name: 'leixing', type: 'none', width: 120, ifFilter: true, filterItems: ['like'], ifEnabledTips: true },
            { title: '语言', name: 'yuyan', type: 'none', width: 80, ifFilter: true, filterItems: ['like'], ifEnabledTips: true },
            { title: '出品公司', name: 'company', type: 'none', width: 120, ifFilter: true, filterItems: ['like'], ifEnabledTips: true },
            { title: '国家', name: 'guojia', type: 'none', width: 80, ifFilter: true, filterItems: ['like'], ifEnabledTips: true },
            { title: '每集时长', name: 'shichang', type: 'none', width: 70, ifFilter: true, filterItems: ['like'] },
            { title: '集数', name: 'jishu', type: 'none', width: 80, ifFilter: true, filterItems: ['like'] },
            { title: '导演', name: 'daoyan', type: 'none', width: 120, ifFilter: true, filterItems: ['like'], ifEnabledTips: true },
            { title: '发行时间', name: 'faxingtime', type: 'none', width: 100, ifFilter: true, filterItems: ['like'] },
            { title: '获得奖项', name: 'jiangxiang', type: 'none', width: 120, ifFilter: true, filterItems: ['like'], ifEnabledTips: true },
            { title: '故事梗概', name: 'genggai', type: 'none', width: 120, ifFilter: true, filterItems: ['like'], ifEnabledTips: true },
            { title: '关键词', name: 'keywords', type: 'none', width: 120, ifFilter: true, filterItems: ['like'], ifEnabledTips: true },
            { title: 'IMDB链接', name: 'imdblink', type: 'none', width: 120, ifFilter: true, filterItems: ['like'], ifEnabledTips: true }
        ];
        var comArgs = {
            'rootTips': { head_h: 35, icon: 'icon-glyph-wrench', title: 'IMDB-Movice', cn: 'b0', toolBarAry: [{ text: '上传文件', name: 'updateFile', skin: 'mr5 mt2 Button-blue' }], onToolBarClick: onToolBarClick },
            'rootLayout': { min: 200, max: 800, isRoot: 1, start: 350, dir: 'we', dirLock: 2 },
            'imgTips': { head_h: 30, icon: 'icon-glyph-list', title: 'IMDB详情', cn: 'b0' },
            'imdbList': { aHeader: _taskAry, loadApi: 'm=SYS_TABLE_BASE&table=XD_IMDB_MOVICE&action=pagingForList', ifEnabledFilter: true, onSuccess: function (obj) { if (obj.Length) { obj.List.fireClick(0); } }, onTDClick: onDBClick, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } } }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootTips',
            body: { name: 'rootLayout', type: 'Layout', eHead: { type: 'List', name: 'imdbList' }, eFoot: { type: 'Tips', name: 'imgTips' } }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        infoBody = coms.imgTips.body.h('<ul class="ListItem"></ul><ul class="album p5"></ul>').fc();
        imgBody = infoBody.ns().evt('click', onImgClick);
    }
    function _event() { }
    function _override() { }
    function onDBClick(obj) { currID = obj.Target.getAttr('id'); url = obj.Target.getAttr('imdblink'); loadImgs(); }
    function onImgClick(e) {
        var e = $.e.fix(e), _e = e.t;
        if (_e.tagName == 'A' && _e.attr('p') == 'deleteImg') {
            MConfirm.setWidth(350).show('确定删除图片?').evt('onOk', function () {
                $.Util.ajax({
                    args: 'm=SYS_CM_PM&action=delIMDBAttachs&id=' + currID + '&ids='+_e.attr('_imgid')+'&dataType=json',
                    onSuccess: function (d) { MTips.show('删除成功', 'ok'); _e.pn().pn().pn().r(); }
                });
            });
        }
    }

    function onUploadComplete(obj) {
        var _fids = obj.currIds;
        $.Util.ajax({
            args: 'm=SYS_CM_PM&action=onIMDBUploadOver&id=' + currID + '&files='+_fids.join(',')+'&dataType=json',
            onSuccess: function (d) { loadImgs(); }
        });
    }

    function loadImgs() {
        infoBody.h('<div style="padding:20px;z-index:20;text-align:center;"><img src="images/loading/gif/loading51.gif" /></div>');
        $.Util.ajax({
            args: 'm=SYS_CM_PM&action=getIMDBInfo&id=' + currID + '&keyFields=*&dataType=json',
            onSuccess: function (d) {
                var _info = eval($.Util.filter(d.get(0)) || '[]')[0], _temp = '';
                var _kv = {
                    rank: '排名',
                    name: '名称',
                    faxingtime: '发行时间',
                    daoyan: '导演',
                    jishu: '集数',
                    company: ' 动画公司',
                    guojia: '国家',
                    shichang: '时长',
                    leixing: '类型',
                    yuyan: '语言',
                    keywords: '关键词',
                    imdbfen: 'IMDB评分',
                    doubanfen: '豆瓣评分',
                    imdblink: 'IMDb链接',
                    jiangxiang: '获得奖项',
                    genggai: '故事梗概'
                };
                for (var k in _kv) { _temp += '<tr><td class="first">' + _kv[k] + '</td><td>' + _info[k] + '</td></tr>'; }
                infoBody.h('<table class="info">' + _temp + '</table>');
                var _imgAry = eval(d.get(1) || '[]'), _hAry = [], _img;
                for (var i = 0, _len = _imgAry.length; i < _len; i++) {
                    _img = _imgAry[i];
                    _hAry.push('<li><div class="bd"><p class="photo_albumlist_wrap"><img src="uploads/' + _img.catelog + '/' + _img.sysName + '.' + _img.extName + '" /><span></p><div class="action"><a _imgId="' + _img.id + '" p="deleteImg" mtips="删除图片" class="icon icon-compact-del fr m5"></a></div></div><div class="detail">' + (_img.nodeName || '') + '</div></li>');
                }
                if (!_hAry.length) { _hAry.push('<li>暂无图片</li>'); }
                imgBody.h(_hAry.join(''));
            }
        });
    }

    function onToolBarClick(obj) {
        if (!currID) { MTips.show('请先选择记录', 'warn'); return false; }
        if (popTips) { popTips.remove(); popTips = null; }
        switch (obj.Name) {
            case 'updateFile':
                popTips = new $.UI.Tips({ comMode: 'x-auto', width: 500, height: 400, y: 100, head_h: 30, ifMask: true, ifClose: true, title: '文件上传', icon: 'icon-glyph-arrow-up' });
                new $.UI.FileUploader({ p: popTips.body, onComplete: onUploadComplete });
                break;
            case 'toLink':
                popTips = new $.UI.Tips({ comMode: 'x-auto', width: 640, height: 500, y: 100, cn:'b0', content: '<iframe src="'+url+'" class="wp hp oa"></iframe>', head_h: 30, ifMask: true, ifClose: true, title: '查看链接', icon: 'icon-glyph-globe' });
                popTips.body.css('overflow: hidden;');
                break;
        }
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}