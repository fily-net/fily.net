$.NameSpace('$View.user');
$View.user.UserManager = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms, formBtn, infoF, toolBar, uList;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _userHAry = [
            { name: 'cb', type: 'checkbox', width: 50 },
            { name: 'uid', type: 'none', title: '登陆名', width: 100, ifFilter: true, filterItems: ['like'] },
            { name: 'cName', type: 'none', title: '姓名', width: 100 },
            { name: 'icCard', type: 'none', title: '人员编号', width: 80 },
            { name: 'department', type: 'select', ifTrans: true, trans: 'SYS_TRANS_ROLE', title: '部门', width: 110, ifFilter: true, filterItems: ['equal'], loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid":3}' },
            { name: 'titles', type: 'select', ifTrans: true, title: '人员状态', width: 100, ifFilter: true, filterItems: ['equal'], gtID: 143 },
            { name: 'sex', type: 'select', ifTrans: true, title: '性别', width: 60, ifFilter: true, filterItems: ['equal'], gtID: 131 },
            { name: 'birthday', type: 'date', title: '出生年月', width: 130 },
            { name: 'fixedPhoneNum', type: 'none', title: '座机电话', width: 120 },
            { name: 'mobilePhoneNum', type: 'none', title: '移动电话', width: 120 },
            { name: 'email', type: 'none', title: '邮件', width: 150 },
            { name: 'address', type: 'none', title: '常住地址', width: 150 },
            { name: 'note', type: 'none', title: '备注', width: 150 }
        ];
        var _userInfo = [
            { name: 'avatar', title: '', comType: 'Label', group: { name: 'g1', width: 320 }, type: 'image', ifSubmit: false },
            { name: 'uid', title: '用户名', comType: 'Input', group: 'g1', req: true, sErr:'用户名必填' },
            { name: 'icCard', title: 'IC卡号', comType: 'Input', group: 'g1'},
            { name: 'sex', title: '性别', comType: 'Radios', gtID: 131, value: 132, defText: 132, group: 'g1' },
            { name: 'birthday', title: '出生年月', comType: 'Date', group: { name: 'g2', width: 320} },
            { name: 'department', title: '部门', comType: 'Select', group: 'g2', trans: 'SYS_TRANS_ROLE', loadApi: 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid":3}', onChange: onDeptChange },
            { name: 'post', title: '职位', comType: 'Select', group: 'g2', trans: 'SYS_TRANS_ROLE' },
            { name: 'titles', title: '职称', comType: 'Select', group: 'g2', ifTrans: true, gtID: 143 },
            { name: 'fixedPhoneNum', title: '座机电话', group: 'g2', comType: 'Input' },
            { name: 'mobilePhoneNum', title: '移动电话', group: 'g2', comType: 'Input' },
            { name: 'agents', title: '代理人', comType: 'UserSelector', group: { name: 'g3', width: 320} },
            { name: 'address', title: '常住地址', group: 'g3', comType: 'Input' },
            { name: 'email', title: '邮件', group: 'g3', comType: 'Input' },
            { name: 'ifEnableEmail', title: '是否启用邮件', value: 11, defText: 11, group: 'g3', comType: 'Radios', gtID: 10 },
            { name: 'note', title: '备注', comType: 'TextArea', group: 'g3' }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'userTips': { head_h: 30, title: '用户管理', icon: 'fa fa-user', cn: 'b0', onToolBarMouseDown: onToolBarMouseDown, onToolBarClick: onToolBarClick, toolBarSkin: 'mr5 Button-default', gbsID: 19 },
            'userList': { aHeader: _userHAry, ifEnabledFilter: true, loadApi: 'm=SYS_TABLE_BASE&table=SYS_CM_USER&action=pagingForList&delFlag=0&jsonCondition={"id,>":2}&orderCondition={"cTime": "asc"}', colControls: { header: {}, paging: {} }, onTDClick: onUserClick, onSuccess: function (obj) { if (obj.Length) { obj.List.fireClick(0); } else { toolBar.fireClick(0); } } },
            'userForm': { head_h: 0, icon_h: 18, loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=SYS_CM_USER', insertApi: 'm=SYS_CM_USERS&action=addUser', updateApi: 'm=SYS_CM_USERS&action=updateUser', title: '员工档案信息', items: _userInfo, onFinishInit: onFormInit, onSubmitSuccess: onFormSubmitSuccess },
            'userLayout': { min: 200, max: 500, start: 320, dir: 'ns', dirLock: 2, isRoot: true }
        }
        var viewStruct = {
            p: owner,
            type: 'Layout',
            name: 'userLayout',
            eHead: {
                type: 'Tips',
                name: 'userTips',
                body: { type: 'List', name: 'userList' }
            },
            eFoot: { type: 'Form', name: 'userForm' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
        toolBar = coms.userTips.toolBar; infoF = coms.userForm; uList = coms.userList;
    }
    function onDeptChange(obj) { obj.FormItem.next.set('loadApi', 'm=SYS_CM_USERS&action=getAllDepts&jsonCondition={"pid":' + obj.Value + '}'); }
    function onFormInit(obj) { formBtn = infoF.getButton('FORM-SYS-SUBMIT'); }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            case '20':
                infoF.set('state', 'Insert').reset().focus();
                formBtn.setIcon('fa fa-plus').setText('添加用户信息');
                break;
            case '21':
                var _ids = uList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择人', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除该' + _ids.length + '项记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_CM_USERS&action=delUsers&ids=' + _ids.join(','),
                        onSuccess: function () { uList.refresh() }
                    });
                });
                break;
        }
    }

    function onFormSubmitSuccess(obj) {
        switch (obj.Form.get('state').trim()) {
            case 'Update':
                MTips.show('修改信息成功', 'ok'); uList.refresh(); 
                break;
            case 'Insert':
                MTips.show('添加信息成功', 'ok'); uList.refresh(); obj.Form.reset().set('state', 'Insert').focus();
                break;
        }
    }

    function onToolBarMouseDown(obj) {
        if (obj.Name == 'moveUser') {
            var e = obj.E, _x = e.clientX, _y = e.clientY, _val = getSelUserHtml(), _overElm;
            if (!_val[0]) { return; }
            var _dargDiv = $DB.adElm('', 'div').cn('pa PopTips-default').css('left:' + _x + 'px;top:' + _y + 'px;padding:10px;max-width:250px;').h(_val[0]);
            $.drag.init(_dargDiv);
            _dargDiv.onDragStart = function () { }
            _dargDiv.onDrag = function (x, y) {
                setTimeout(function () {
                    var _eTR = findTarget($($D.elementFromPoint(x + 2, y - 2)));
                    if (_eTR) {
                        if (_overElm) { _overElm.dc('fwb'); }
                        _eTR.ac('fwb'); _overElm = _eTR;
                    }
                }, 100);
            }
            _dargDiv.onDragEnd = function (x, y) {
                var _eTR = findTarget($($D.elementFromPoint(x + 2, y - 2)));
                if (_eTR) {
                    var _ids = unique_array(_eTR.attr('link').split(',').concat(_val[1])), _rId = _eTR.attr('id'), _sIds = ',' + _ids.join(',') + ',';
                    $.Util.ajax({
                        args: 'm=SYS_CM_USERS&action=moveUsersToRole&userIds=' + _sIds + '&roleId=' + _rId,
                        onSuccess: function () {
                            _eTR.attr('link', _sIds);
                            coms['userList'].getAttr('Paging').set('pageIndex', 1);
                            coms['roleList'].fireClick(_rId, 'ID');
                        }
                    });
                }
                _dargDiv.r(); _dargDiv = null; delete _dargDiv;
                if (_overElm) { _overElm.dc('fwb'); }
            }
            $.drag.start(e, _dargDiv);
        }
    }

    function unique_array(ary) {
        var _a = [], _b = {}, _l = ary.length, i, _c = 0;
        for (i = 0; i < _l; i++) { var _d = ary[i]; if (_d) { _b[_d] = true; } }
        for (var e in _b) { _a[_c] = e; _c++; }
        return _a;
    }

    function getSelUserHtml() {
        var _uList = coms['userList'], _selTRAry = _uList.getAttr('selTrs'), _sLen = _selTRAry.length, _html = '', _ids = [];
        for (var i = 0; i < _sLen; i++) { var _obj = _uList.getRowDataByTR(_selTRAry[i]); _html += '<div class="fl p3 m3 fs12 bc_17">' + _obj.uid + '</div>'; _ids.push(_obj.id); }
        return [_html, _ids];
    }

    function findTarget(elm) {
        var _eTR = findListTR(elm), _eTT;
        if (_eTR && _eTR.pn().pn().pn().attr('list') == 'roleList') { _eTT = _eTR; }
        return _eTT;
    }
    function findListTR(elm) {
        switch (elm.tagName) {
            case 'DIV':
                if (elm.className.indexOf('td-') != -1) { return findListTR(elm.pn().pn()); }
                break;
            case 'TD':
                return elm.pn();
            case 'TR':
                return elm;
        }
        return null;
    }
    function onUserClick(obj) { delayShowInfo(obj.Target.getAttr('rowId')); }
    function delayShowInfo(id) {
        if (!infoF) { setTimeout(function () { delayShowInfo(id); }, 200); return; }
        infoF.loadDataByID(id, function () { formBtn.setIcon('fa fa-edit').setText('修改用户信息'); });
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