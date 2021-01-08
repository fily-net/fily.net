$.NameSpace('$View.qt');
$View.qt.PaperInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, paperId: 0 };
    var coms = {}, rootTips, eBody, _paging, toolBar;
    var _html = '<div class="title"><a _tid="{0}" MTips="删除" class="icon-compact-del"></a><a _tid="{0}" MTips="展开" _type="{1}" class="icon-compact-line-r"></a><a _tid="{0}" _title="{2}" MTips="查看投票结果" class="icon-compact-table"></a><div class="_title">{2}</div><div class="_info"><span style="margin-right:15px;">创建人：{3}</span><span>创建时间：{4}</span></div></div></div>';
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _tbAry = [
            { text: '添加题目', name: 'addTopic', skin: 'Button-blue', css: 'margin-top:2px;margin-right:20px;' }
        ];
        var comArgs = {
            'root': { head_h: 30, foot_h: 30, title: '问卷详情', icon: 'icon-glyph-gift', cn: 'b0', toolBarAry: _tbAry, onToolBarClick: onToolBarClick },
            'paging': { onSelect: loadTopics, onClick: loadTopics }
        };
        var struct = { p: owner, type: 'Tips', name: 'root', foot: { name: 'paging', type: 'Paging'} }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        rootTips = coms.root; eBody = rootTips.body.cn('Waterfall').h('<ul class="ListItem"></ul>').fc().evt('click', onOwnerClick); _paging = coms.paging; toolBar = rootTips.toolBar.hide();
    }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'addTopic':
                var arrowTips = $.initArrowTips(obj, 'width:600px;padding:5px 10px 5px 10px;'), _count = new $.nCount();
                _count.setN(3);
                var _valAry = [{ text: '单选', value: 1 }, { text: '多选', value: 2 }, { text: '输入框', value: 3}];
                var _fiAry = [
                    { name: 'title', title: '主题：', comType: 'Input', group: { width: 590, name: 'g1' }, width: 460, req: true },
                    { name: 'link', title: '附件：', comType: 'FileUploader', group: 'g1', width: 460 },
                    { name: 'type', title: '选择模式：', comType: 'Radios', group: 'g1', sons: _valAry, req: true, width: 460, onChange: function (obj) { if (+obj.Value == 3) { obj.Form.groups['g2'].hide(); } else { obj.Form.groups['g2'].show(); } } },
                    { name: 'item1', title: '选项：', placeholder: '选项1', comType: 'Input', group: { width: 590, name: 'g2' }, width: 460 },
                    { name: 'item2', title: '', placeholder: '选项2', comType: 'Input', group: 'g2', width: 460 },
                    { name: 'item3', title: '', placeholder: '选项3', comType: 'Input', group: 'g2', width: 460 }
                ];
                var _form = $.global.arrowTips.init({
                    type: 'Form',
                    items: _fiAry,
                    ifFixedHeight: false,
                    btnItems: [
                        { name: 'FORM-SYS-SUBMIT', text: '提交', skin: 'Button-blue', css: 'margin-left:100px;' },
                        { name: 'addItem', text: '添加选项', skin: 'Button-default' }
                    ],
                    onClick: function (obj) {
                        if (obj.Name == 'addItem') {
                            var _currN = _count.getN();
                            if (_currN > 8) { MTips.show('最多8项', 'warn'); return; }
                            _form.addItem({ name: 'item' + _currN, title: '', placeholder: '选项' + _currN, comType: 'Input', group: 'g2', width: 460 }).focus();
                        };
                    },
                    onSubmit: function (obj) {
                        var _val = obj.Data.IValue, _itemAry = []; _val.paperId = args.paperId;
                        for (var k in _val) { if (k.indexOf('item') > -1) { if (_val[k]) { _itemAry.push(_val[k]); } _val[k] = null; delete _val[k]; }; }
                        $.Util.ajax({
                            args: 'm=SYS_CM_OA&action=addpaperTopic&json=' + $.JSON.encode(_val) + '&items=' + _itemAry.join('\u0002'),
                            onSuccess: function () {
                                MTips.show('提交成功', 'ok'); if ($.global.arrowTips) { $.global.arrowTips.remove(); $.global.arrowTips = null; }; loadTopics();
                            }
                        });
                        return false;
                    }
                }, true);
                _form.items['type'].setValue(1);
                break;
        }
    }

    function onOwnerClick(e) {
        var e = $.e.fix(e), _e = e.t, _tid = _e.attr('_tid'), _eTitle = _e.pn(), _ePanel = _eTitle.pn();
        if (_e.tagName == 'A' && _tid) {
            switch (_e.attr('MTips')) {
                case '删除':
                    MConfirm.setWidth(250).show('确定删除该选项?').evt('onOk', function () {
                        $.Util.ajax({
                            args: 'm=SYS_TABLE_BASE&table=SYS_QT_PAPER_TOPIC&action=deleteByID&id=' + _tid,
                            onSuccess: function () { MTips.show('删除成功', 'ok'); loadTopics(); }
                        })
                    });
                    break;
                case '展开':
                    if (_e.className.trim() == 'icon-compact-line-r') {
                        if (_eTitle.ns()) {
                            _eTitle.ns().show(); _eTitle.ns().ns().show(); _e.cn('icon-compact-line-b');
                        } else {
                            _e.cn('loading16');
                            $.Util.ajax({
                                args: 'm=SYS_CM_OA&action=loadTopicItems&dataType=json&topicId=' + _tid,
                                onSuccess: function (obj) {
                                    var _dAry = eval(obj.get(0) || '[]'), _dLen = _dAry.length, _fAry = eval(obj.get(1) || '[]'), _fLen = _fAry.length, _type = +_e.attr('_type'), _itemAry = [], _sFile = '';
                                    var _tempP = _ePanel.adElm('', 'div').cn('content');
                                    switch (_type) {
                                        case 1: _type = 'Radios'; break;
                                        case 2: _type = 'CheckBoxs'; break;
                                        case 3: _type = 'TextArea'; break;
                                    }
                                    for (var i = 0; i < _dLen; i++) {
                                        var _item = _dAry[i];
                                        _itemAry.push({ p: _tempP, type: _type, value: _item.id, text: _item.title, css: 'float:none;width:100%;' });
                                    }
                                    (new $.UI.FormItem({ p: _tempP, comType: _type, ifHead: false, ifFoot: false, sons: _itemAry, css: 'width:100%;' })).doms.eBody.css('width:100%;').fc().css('width:100%;');
                                    for (var i = 0; i < _fLen; i++) { var _file = _fAry[i]; _sFile += '<a href="Module/SYS_CM_FILES.aspx?action=downloadFile&id=' + _file.id + '" >' + _file.nodeName + '</a>'; }
                                    if (!_sFile) { _sFile = '<a>没有相关附件</a>'; }
                                    _ePanel.adElm('', 'div').cn('attach').h('<span>附件：</span><div class="files">' + _sFile + '</div>');
                                    _e.cn('icon-compact-line-b');
                                }
                            });
                        }
                    } else {
                        _eTitle.ns().hide(); _eTitle.ns().ns().hide(); _e.cn('icon-compact-line-r');
                    }
                    break;
                case '查看投票结果':
                    new $.UI.View({ p: args.p, url: 'View/qt/TopicResults.js', topicId: _tid, topicTitle: _e.attr('_title') });
                    break;
            }
        }
    }

    function loadTopics() {
        var _pIdx = _paging.get('pageIndex'), _pSize = _paging.get('pageSize');
        eBody.h('<div style="padding:20px;z-index:20;text-align:center;"><img src="images/loading/gif/loading51.gif" /></div>');
        $.Util.ajax({
            args: 'm=SYS_CM_OA&action=loadpaperInfo&paperId=' + args.paperId + '&dataType=json&pageIndex=' + _pIdx + '&pageSize=' + _pSize,
            onSuccess: function (d) {
                var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length, _info = eval(d.get(2) || '[]')[0];
                rootTips.setTitle(_info.nodeName);
                if (!_dLen) { eBody.h('<div style="padding:20px;text-align:center;"><img src="images/EmptyData.gif"></div>'); } else { eBody.h(''); };
                new $.UI.FormItem({ p: eBody.adElm('', 'li').css('width:100%;height:45px;'), title: '链接：', value: $.Util.url2Obj().path + '/mobile/survey.html?guid=' + _info.guid, width: 600 });
                for (var i = 0; i < _dLen; i++) { addItem(_dAry[i]); }
                _paging.setTotal(+eval(d.get(1) || '[]')[0].count);
            }
        });
    }

    function addItem(obj) {
        eBody.adElm('', 'li').h(_html.format(obj.id, obj.type, obj.title, obj.cPerson, obj.cTime));
    }

    me.loadpaper = function (paperId) { args.paperId = paperId; toolBar.show(); loadTopics(); }
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