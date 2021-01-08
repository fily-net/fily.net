$.NameSpace('$View.tcdic');
$View.tcdic.Type = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, gtRootID: 156, infoUrl: 'View/pm/PMInfo2.js' }, popTips, infoView, currProId;
    var coms = {}, typeTab, mainList, currID;
    var loadApi;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var hAry = [
            { name: 'id', type: 'attr' },
            { name: 'link', type: 'attr' },
            { name: 'cb', type: 'checkbox', width: 50 },
            { title: '标题', name: 'title', ifEnabledTips: true, type: 'none', width: 180, ifFilter: true, filterItems: ['like'] },
            { title: '作者', name: 'author', type: 'none', width: 100, ifFilter: true, filterItems: ['like'] },
            { title: '类别', name: 'videoType', ifTrans: true, type: 'select', width: 100, gtID: 818, ifFilter: true, filterItems: ['equal'] },
            { title: '关键字', name: 'keywords', type: 'none', width: 100, ifFilter: true, filterItems: ['like'] },
            { title: '分钟数', name: 'minutes', type: 'none', width: 100, ifFilter: true, filterItems: ['equal', 'greater', 'less'] },
            { title: '文件大小', name: 'size', type: 'none', width: 100, ifFilter: true, filterItems: ['equal', 'greater', 'less'] },
            { title: '文件路径', name: 'link', type: 'none', width: 100, ifFilter: true, filterItems: ['equal', 'greater', 'less'] },
            { title: '上传人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', loadApi: 'm=SYS_CM_USERS&action=getAllUsers',type: 'select', textKey: 'uid', width: 80, ifFilter: true, filterItems: ['equal'] },
            { title: '上传时间', name: 'cTime', type: 'date', width: 145, ifFilter: true, filterItems: ['equal'] },
            { title: '视频介绍', name: 'note', ifEnabledTips: true, type: 'none', width: 300, ifFilter: true, filterItems: ['like'] }
        ];
        var comArgs = {
            'rootLayout': { min: 300, max: 500, isRoot: 1, start: 375, dir: 'ns', dirLock: 2 },
            'rootDiv': { head_h: 38 },
            'typeTab': { gtID: 818, gtType: 'tab', items: [{ name: 'all', type: 'tab', nn: '所有案例', text: '所有案例', ifPress: true }], skin: 'ButtonSet-tab fl', itemSkin: 'Button-tab', onClick: onTypeClick },
            'toolBar': { gbsID: 162, skin: 'ButtonSet-normal fr mt5 mr5',  onClick: onToolBarClick },
            'mainList': { aHeader: hAry, ifEnabledFilter: true, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } }, onTDClick: onMainListTDClick, onTDDoubleClick: onMainListTDDoubleClick }
        }
        var struct = {
            p: owner,
            type: 'BaseDiv',
            name: 'rootDiv',
            head: [
                { name: 'typeTab', type: 'ButtonSet' },
                { name: 'toolBar', type: 'ButtonSet' }
            ],
            body: { type: 'List', name: 'mainList' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        typeTab = coms.typeTab; mainList = coms.mainList; typeTab.fireClick(0);
    }

    function onMainListTDDoubleClick(obj) {
        var _link = obj.getAttr("link");
        $.Util.ajax({
            args: { m: 'SYS_CM_FILES', action: 'getFilesByLink', link: _link, dataType: 'json', jsonCondition: '{"type": 1}' },
            onSuccess: function (obj) {
                var _aVal = eval(obj.get(0) || '[]'), _aLen = _aVal.length;
                var _content = '';

                //console.log(_aVal);
                for (var i = 0; i < _aLen; i++) {
                    var _fObj = _aVal[i], _fName = _fObj.nodeName, _txt = _fName;
                    if (_txt.length > 25) { _txt = _txt.substr(0, 25) + '...'; }
                    var _url = 'uploads/' + _fObj.catelog + '/' + _fObj.sysName + '.' + _fObj.extName;
                    _content += '<div><a style="padding: 10px;" class="fa fa-download" target="_black" href="Module/SYS_CM_FILES.aspx?action=downloadFile&id=' + _fObj.id + '">' + _fName + '</a>';
                    _content += ' <video id="myVideo' + i + '" class="pf-video" width="620" height="380" controls="controls"><source src="' + _url + '" type=\'video/mp4; codecs="avc1.42E01E, mp4a.40.2"\' /><source src="' + _url + '" type=\'video/ogg; codecs="theora, vorbis"\' /></video><source src="' + _url + '" type=\'video/webm; codecs="vp8, vorbis""\' /></video></div>';
                }
                if (popTips) { popTips.remove(); popTips = null; }
                popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-play', title: '视频播放', comMode: 'x-auto', y: 120, height: 480, ifMask: true, ifClose: true, width: 640, ifFixedHeight: true });
                popTips.body.css('overflow:auto;').h(_content);
                for (var i = 0; i < _aLen; i++) {
                    new PlayerFramework.Player('myVideo'+i, {
                        width: "620px",
                        height: "380px"
                    });
                }
            }
        });
        console.log(_link);
    }

    function onMainListTDClick(obj) {
        currID = obj.Target.getAttr("id");
    }

    function onToolBarClick(obj) {
        switch (+obj.Name) {
            case 163:
                //保存为Excel
                mainList.saveAsExecl('炫动传播-少儿动漫视频内容列表', null, true); 
                break;
            case 164:
                var _ids = mainList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择要删除的行', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除' + _ids.length + '条记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_BASE&table=SYS_VCMS_VIDEOS&action=deleteByIDs&ids=' + _ids.join(','),
                        onSuccess: function () { MTips.show('删除成功', 'ok'); mainList.refresh({ onSuccess: function (obj) { obj.List.fireClick(0); } }); }
                    })
                });
                break;
            case 165:
                var _fiAry = [
                    { name: 'title', title: '标题', comType: 'Input', req: true, group: { name: 'g1', width: 520 }, width: 400 },
                    { name: 'videoType', title: '类型', comType: 'Select', group: 'g1', gtID: 818, req: true, width: 400 },
                    { name: 'author', title: '作者', comType: 'Input', group: 'g1', req: true, width: 400 },
                    { name: 'keywords', title: '关键字', comType: 'Input', group: 'g1', req: true, width: 400 },
                    { name: 'minutes', title: '分钟数', comType: 'Input', dataType: 'double', group: 'g1', req: true, width: 400 },
                    { name: 'link', title: '视频文件', comType: 'FileUploader', group: 'g1', req: true, width: 400 },
                    { name: 'note', title: '视频介绍', comType: 'TextArea', group: 'g1', width: 400 }
                ];
                if (popTips) { popTips.remove(); popTips = null; }
                popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-plus', title: '添加视频', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 540, ifFixedHeight: false });
                (new $.UI.Form({
                    p: popTips.body, state: 'Insert', insertApi: 'm=SYS_TABLE_BASE&action=addRow&table=SYS_VCMS_VIDEOS', items: _fiAry, ifFixedHeight: false, onSubmitSuccess: function () {
                        popTips.remove(); popTips = null;
                        mainList.refresh({
                            onSuccess: function (obj) {
                                obj.List.fireClick(0);
                            }
                        }, false, false);
                    }
                }));
                break;
            case 166:
                if (!currID) {
                    MTips.show('请先选择要编辑的记录!', 'warn'); return;
                }
                var _fiAry = [
                    { name: 'title', title: '标题', comType: 'Input', req: true, group: { name: 'g1', width: 520 }, width: 400 },
                    { name: 'videoType', title: '类型', comType: 'Select', group: 'g1', gtID: 818, req: true, width: 400 },
                    { name: 'author', title: '作者', comType: 'Input', group: 'g1', req: true, width: 400 },
                    { name: 'keywords', title: '关键字', comType: 'Input', group: 'g1', req: true, width: 400 },
                    { name: 'minutes', title: '分钟数', comType: 'Input', dataType: 'double', group: 'g1', req: true, width: 400 },
                    { name: 'link', title: '视频文件', comType: 'FileUploader', group: 'g1', req: true, width: 400 },
                    { name: 'note', title: '视频介绍', comType: 'TextArea', group: 'g1', width: 400 }
                ];
                if (popTips) { popTips.remove(); popTips = null; }
                popTips = new $.UI.Tips({ head_h: 30, icon: 'fa fa-edit', title: '编辑视频', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 540, ifFixedHeight: false });
                (new $.UI.Form({
                    p: popTips.body, state: 'Update', loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=SYS_VCMS_VIDEOS', submitApi: 'm=SYS_TABLE_BASE&action=updateByID&table=SYS_VCMS_VIDEOS', items: _fiAry, ifFixedHeight: false, onSubmitSuccess: function () {
                        popTips.remove(); popTips = null;
                        mainList.refresh({
                            onSuccess: function (obj) {
                                obj.List.fireClick(0);
                            }
                        }, false, false);
                    }
                })).loadDataByID(currID, function (obj) {

                }, true);
                break;
        }
    }

    function onTypeClick(obj) {
        var _name = obj.Name, _jc = '';
        if (!isNaN(+_name)) { _jc = '&jsonCondition={"videoType":' + _name + '}'; }
        loadApi = 'm=SYS_TABLE_BASE&table=SYS_VCMS_VIDEOS&action=pagingForList' + _jc;
        mainList.loadAjax({ args: loadApi, cbFn: { onSuccess: function (obj) { if (obj.Length) { mainList.fireClick(0); } } } });
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