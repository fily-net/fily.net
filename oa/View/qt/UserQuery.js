$.namespace('$View.qt');
$View.qt.UserQuery = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var _paging, eBody, mList, curr;
    var _html = '<div class="title"><div class="_title">{0}<a style="float:right;height:20px;" target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin={3}&amp;site=qq&amp;menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:{3}:41" alt="点击这里给我发消息" title="点击这里给我发消息"></a></div><div class="_info"><span style="margin-right:15px;">邮箱：<a href="mailto:{1}">{1}</a></span><span style="margin-right:15px;">手机号：{2}</span><span>QQ号：<a href="tencent://message/?uin={3}&amp;Site=online&amp;Menu=yes">{3}</a></span></div></div></div>';
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _valAry = [
            { title: '问卷', name: '(select nodeName from SYS_QT_PAPER where id=self.paperId)', type: 'none', width: 180 },
            { title: '题目', name: '(select title from SYS_QT_PAPER_TOPIC where id=self.topicId)', type: 'none', width: 220 },
            //{ title: '真实值', name: 'value', type: 'none', width: 120 },
            { title: '文本值', name: 'text', type: 'none', ifEnabledTips: true, width: 350 },
            { title: '提交时间', name: 'cTime', type: 'date', width: 130 }
        ];
        var comArgs = {
            'rootTips': { head_h: 30, icon: 'icon-glyph-search', title: '问卷参与用户结果查询', cn: 'b0' },
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 320, dir: 'we', dirLock: 1 },
            'userTips': { head_h: 29, foot_h: 30, icon: 'icon-glyph-list', title: '用户列表', cn: 'b0' },
            'paging': { onSelect: loadUsers, onClick: loadUsers },
            'mList': { aHeader: _valAry, colControls: { header: {}, paging: { pageSize: 20, pageIndex: 1 } } }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootTips',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: {
                    type: 'Tips', name: 'userTips', foot: { type: 'Paging', name: 'paging' }
                },
                eFoot: { name: 'mList', type: 'List' }
            }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        _paging = coms.paging; mList = coms.mList;
        eBody = coms.userTips.body.cn('Waterfall').h('<ul class="ListItem"></ul>').fc();
        loadUsers();
    }
    function _event() { }
    function _override() { }
    function loadUsers() {
        var _pIdx = _paging.get('pageIndex'), _pSize = _paging.get('pageSize');
        eBody.h('<div style="padding:20px;z-index:20;text-align:center;"><img src="images/loading/gif/loading51.gif" /></div>');
        $.Util.ajax({
            args: 'm=SYS_TABLE_BASE&action=pagingForList&table=SYS_QT_USER&dataType=json&pageIndex=' + _pIdx + '&pageSize=' + _pSize,
            onSuccess: function (d) {
                var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length;
                if (!_dLen) { eBody.h('<div style="padding:20px;text-align:center;"><img src="images/EmptyData.gif"></div>'); } else { eBody.h(''); }
                for (var i = 0; i < _dLen; i++) {
                    var _obj = _dAry[i];
                    eBody.adElm('', 'li').ac('cp').attr('uid', _obj.id).h(_html.format(_obj.name, _obj.email, _obj.phoneNumber, _obj.qq)).evt('click', function (e) {
                        var e = $.e.fix(e), _e = e.t, _eLi = findLi(_e);
                        if (curr) { curr.css('border: 1px solid #E2E2E2'); }
                        curr = _eLi; curr.css('border: 1px solid #DF2D3B;');
                        loadTopicValues(_eLi.attr('uid'));
                    });
                }
                _paging.setTotal(+eval(d.get(1) || '[]')[0].count);
            }
        });
    }
    function loadTopicValues(uid) { mList.loadAjax({ args: 'm=SYS_TABLE_BASE&action=pagingForList&table=SYS_QT_PAPER_ANSWER&jsonCondition={"userId": ' + uid + '}' }); }
    function findLi(_e) { if (_e.tagName == 'LI') { return _e; } else { return findLi(_e.pn()); } }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}