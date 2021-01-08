$.NameSpace('$View.decision');
$View.decision.IndexGrid = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, gtRootID: 156 }, popTips, infoView, currProId;
    var coms = {}, typeTab, mainList;
    var container, paging;
    var proType;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootLayout': { min: 300, max: 500, isRoot: 1, start: 375, dir: 'ns', dirLock: 2 },
            'rootDiv': { head_h: 35, foot_h: 30 },
            'paging': { onSelect: loadNews, onClick: loadNews },
            'typeTab': { gtID: 157, gtType: 'tab', items: [{ name: 'all', type: 'tab', nn: '所有项目', text: '所有', ifPress: true}], skin: 'ButtonSet-tab fl', itemSkin: 'Button-tab', onClick: onTypeClick, onSuccess: onLoadTypeSuccess },
            'toolTab': { itemAlign: 'right', items: [{ name: 'add',  text: '添加项目', icon: 'fa-plus'}], skin: 'ButtonSet-default mr10', onClick: onToolClick },
            'infoView': { url: 'View/decision/PMInfo.js', onNext: function () { mainList.refresh(); }, onLoad: function (view, self) { infoView = view; } }
        }
        var struct = {
            p: owner,
            type: 'BaseDiv',
            name: 'rootDiv',
            head: [
                { name: 'typeTab', type: 'ButtonSet' },
                { name: 'toolTab', type: 'ButtonSet' }
            ],
            foot: { name: 'paging', type: 'Paging' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        typeTab = coms.typeTab; 
        paging = coms.paging;
        container = coms.rootDiv.body.cn('Waterfall').h('<ul class="list-grid"></ul>').fc().evt('click', onOwnerClick);
        typeTab.fireClick(0);
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

    function renderGrid(){

    }

    function onLoadTypeSuccess(obj) {
        if (!obj) { obj = args.pTypeObj; }
        if (!obj) { return; }
        if (!args.pTypeObj) { args.pTypeObj = obj; }
        var _ids = [], _items = obj.items, _btns = obj.ButtonSet.items;
        for (var i = 0, _iLen = _items.length; i < _iLen; i++) { _ids.push(_items[i].name); }
        $.Util.ajax({
            args: 'm=SYS_CM_PM&action=getNonOverNum&dataType=json&proTypes=' + _ids.join(','),
            onSuccess: function (d) {
                var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length, _aCount = 0;
                for (var i = 0; i < _dLen; i++) {
                    var _dObj = _dAry[i], _btn = _btns[_dObj.name];
                    _aCount += +_dObj.count;
                    _btn.setText(_btn.get('nn') + '<font style="color:red;padding:0px 5px;">(' + _dObj.count + ')</font>')
                }
                _btns['all'].setText(_btns['all'].get('nn') + '<font style="color:red;padding:0px 5px;">(' + _aCount + ')</font>')
            }
        });
    }
    function onTypeClick(obj) {
        var _name = obj.Name;
        if (!isNaN(+_name)) { proType = _name;  }else{
            proType = null;
        }
        loadNews();
    }

    function loadNews() {
        var _pIdx = paging.get('pageIndex'), _pSize = paging.get('pageSize'); 
        var _jc = '';
        if (proType) { _jc = '&jsonCondition={"type":' + proType + '}'; }
        container.h('<div style="padding:20px;text-align:center;"><img src="images/EmptyData.gif"></div>'); 
        $.Util.ajax({
            args: 'm=SYS_TABLE_BASE&table=decision_index&action=pagingForList' + _jc+'&dataType=json&pageIndex=' + _pIdx + '&pageSize=' + _pSize,
            onSuccess: function (d) { 
                var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length;
                if (!_dLen) { 
                    container.h('<div style="padding:20px;text-align:center;"><img src="images/EmptyData.gif"></div>'); 
                } else {
                    container.h(''); 
                }
                for (var i = 0; i < _dLen; i++) { addItem(_dAry[i]); }
                paging.setTotal(+eval(d.get(1) || '[]')[0].count);
            }
        });
    }

    function addItem(obj){
        var _link = obj.avatars.split(',')[1],
            _image = '';
        if(_link){
            _image = '<img class="avatar" src="./Module/SYS_CM_FILES.aspx?action=downloadFile&id='+_link+'" />';
        }
        var _html = '<div>'+_image+'</div><div class="title">'+obj.title+'</div><div class="toolbar"><span class="icon fa fa-remove" /><span class="icon fa fa-edit" /></div>';
        var li = container.adElm('', 'li').cn('grid').h(_html);
        li.evt('click', function (e){
            var e = $.e.fix(e);
            if(e.t.tagName=='SPAN'){
                if(e.t.className.ec('fa-remove')){
                    MConfirm.setWidth(250).show('确定删除该记录?').evt('onOk', function () {
                        $.Util.ajax({
                            args: 'm=SYS_TABLE_BASE&table=decision_index&action=deleteByID&id=' + obj.id,
                            onSuccess: function () { MTips.show('删除成功', 'ok'); loadNews(); }
                        })
                    });
                } else if(e.t.className.ec('fa-edit')){
                    var infoAry = [
                    { title: '标题', name: 'title', comType: 'TextArea', req: true },
                    { title: '类型', name: 'type', comType: 'Select', gtID: 157, req: true },
                    { title: '封面', name: 'avatars', comType: 'FileUploader' },
                    { title: '视频', name: 'videos', comType: 'FileUploader' },
                    { title: '附件', name: 'attachments', comType: 'FileUploader' },
                    { title: '故事梗概', name: 'note', comType: 'TextArea' }
                ];
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '修改', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 350, ifFixedHeight: false });
                popTips.Form = new $.UI.Form({ p: popTips.body, loadApi: 'm=SYS_TABLE_BASE&table=decision_index&action=getByID', updateApi: 'm=SYS_TABLE_BASE&table=decision_index&action=updateByID', items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; loadNews(); } });
                popTips.Form.loadDataByID(obj.id, function () {  });
                }
            }else{
                //new $.UI.View({ p: args.p, url: 'View/decision/GridInfo.js', data: obj });
                popTips = new $.UI.Tips({ width: 880, height: 560, icon: 'icon-glyph-list-alt', comMode: 'auto', title: obj.title, head_h: 30, ifMask: true, ifDrag: false, ifClose: true });
                new $.UI.View({ p: popTips.body, url: 'View/decision/GridInfo.js', data: obj });
            }
        });
    }

    function onListClick(obj) { var _rid = obj.Target.getAttr('rowid'); if (currProId == _rid) { return; } currProId = _rid; delayShowInfo(_rid); }
    function onToolClick(obj) {
        if (obj.Name == 'toNormal') { new $.UI.View({ p: args.p, url: 'View/decision/IndexNormal.js' }); return; }
        switch (obj.Name) {
            case 'add':
                //新建项目
                var infoAry = [
                    { title: '标题', name: 'title', comType: 'TextArea', req: true },
                    { title: '类型', name: 'type', comType: 'Select', gtID: 157, req: true },
                    { title: '封面', name: 'avatars', comType: 'FileUploader' },
                    { title: '视频', name: 'videos', comType: 'FileUploader' },
                    { title: '附件', name: 'attachments', comType: 'FileUploader' },
                    { title: '故事梗概', name: 'note', comType: 'TextArea' }
                ];
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建项目', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 350, ifFixedHeight: false });
                popTips.Form = new $.UI.Form({ p: popTips.body, insertApi: 'm=SYS_TABLE_BASE&table=decision_index&action=addRow', items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; loadNews(); onLoadTypeSuccess(); } });
                break;
            case 190:
                //删除项目
                var _ids = mainList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择要删除的行', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除' + _ids.length + '条记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_BASE&table=decision_index&action=deleteByIDs&ids=' + _ids.join(','),
                        onSuccess: function () { MTips.show('删除成功', 'ok'); mainList.refresh(); onLoadTypeSuccess(); }
                    })
                });
                break;
            case 191:
                popTips = new $.UI.Tips({ width: 700, height: 500, icon: 'icon-glyph-list-alt', comMode: 'auto', title: '功能模块对照表管理', head_h: 25, ifMask: true, ifDrag: false, ifClose: true });
                new $.UI.View({ p: popTips.body, url: 'View/common/TreeList.js', table: 'SYS_CM_GLOBAL_TABLE', rootID: args.gtRootID });
                //管理对照表
                break;
            case 192:
                popTips = new $.UI.Tips({ width: 700, height: 500, icon: 'icon-glyph-list-alt', comMode: 'auto', title: '功能模块对照表管理', head_h: 25, foot_h: 33, ifMask: true, ifDrag: false, ifClose: true });
                new $.UI.View({ p: popTips.body, url: 'View/rights/Public.js', table: 'SYS_CM_GLOBAL_TABLE', rootID: args.gtRootID, onLoad: function (view, self) { popTips.public = view; } });
                new $.UI.Button({ p: popTips.foot.css('border-top:1px solid #DBDBDB;'), text: '保存设置', icon: 'icon-glyph-hand-up', align: 'right', cn: 'mr10', onClick: function () { popTips.public.saveSetting(); } });
                //权限管理
                break;
            case 193:
                //保存为Excel
                MTips.show('正在研发中...', 'warn');
                //mainList.saveAsExecl('炫动传播内容产品决策支持系统-项目列表');
                break;
            case 194:
                //打印
                (new $.Util.printer(mainList.get('p'))).print();
                break;
        }
    }

    function delayShowInfo(proId) {
        if (!infoView) { setTimeout(function () { delayShowInfo(proId); }, 200); return; }
        infoView.loadPro(proId);
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