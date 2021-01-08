$.namespace('$View.user');
$View.user.DeptManager = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var _api = 'm=SYS_CM_USERS', formBtn, infoF, toolBar;
    function _default() { }
    function _layout() {
        var _roleHAry = [
            { name: 'id', type: 'attr' },
            { name: 'type', type: 'attr' },
            { name: 'uids', type: 'attr' },
            { name: 'nodeName', type: 'none' }
        ];
        var _userHAry = [
            { name: 'id', type: 'attr' },
            { name: 'uid', type: 'none', filterItems: ['like', 'equal'], title: '用户名', ifEdit: true, ifFilter: true, width: 90 },
            { name: 'icCard', type: 'none', filterItems: ['like', 'equal'], title: 'IC卡号', ifFilter: true, width: 90 },
            { name: 'cName', type: 'none', filterItems: ['like', 'equal'], title: '中文名', ifFilter: true, width: 90 },
            { name: 'eName', type: 'none', filterItems: ['like', 'equal'], title: '英文名', ifFilter: true, width: 90 },
            { name: 'sex', type: 'select', filterItems: ['equal'], gtID: 131, dataType: 'int', ifTrans: true, ifFilter: true, title: '性别', width: 50 },
            { name: 'ifEnableEmail', type: 'select', filterItems: ['equal'], ifTrans: true, ifFilter: true, title: '是否启用邮箱', width: 90 },
            { name: 'agents', type: 'none', ifTrans: true, trans: 'SYS_TRANS_USERS', title: '代理人', width: 120 },
            { name: 'fixedPhoneNum', type: 'none', title: '办公室座机', width: 120 },
            { name: 'mobilePhoneNum', type: 'none', title: '手机号码', width: 120 },
            { name: 'email', type: 'none', title: '邮箱', width: 120 }
        ];
        var _userInfo = [
            { name: 'avatar', title: '', comType: 'Label', group: { name: 'g1', width: 320 }, type: 'image' },
            { name: 'uid', title: '用户名', comType: 'Input', group: 'g1', req: true },
            { name: 'icCard', title: 'IC卡号', comType: 'Input', group: 'g1', req: true },
            { name: 'sex', title: '性别', comType: 'Radios', gtID: 131, group: 'g1', req: true },
            { name: 'birthday', title: '出生年月', comType: 'Date', group: { name: 'g2', width: 320 }, req: true },
            { name: 'department', title: '部门', comType: 'Select', group: 'g2', req: true },
            { name: 'post', title: '职位', comType: 'Select', group: 'g2' },
            { name: 'postRoom', title: '办公室', comType: 'Select', group: 'g2', req: true },
            { name: 'fixedPhoneNum', title: '座机电话', group: 'g2', comType: 'Input', req: true },
            { name: 'mobilePhoneNum', title: '移动电话', group: 'g2', comType: 'Input', req: true },
            { name: 'address', title: '常住地址', group: { name: 'g3', width: 320 }, comType: 'Input', req: true },
            { name: 'email', title: '邮件', group: 'g3', comType: 'Input', req: true },
            { name: 'ifEnableEmail', title: '是否启用邮件', group: 'g3', comType: 'Radios', gtID: 10, req: true },
            { name: 'note', title: '备注', comType: 'TextArea', group: 'g3' }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 220, dir: 'we', dirLock: 1 },
            'roleTips': { head_h: 33, title: '部门列表', icon: 'icon-vector-man-full', cn: 'b0' },
            'userTips': { head_h: 33, title: '用户列表', icon: 'icon-glyph-user', cn: 'b0' },
            'roleList': { varName: 'roleList', aHeader: _roleHAry, loadApi: _api + '&action=getAllDepts&jsonCondition={"pid":3}', updateApi: _api + '&action=updateDept', onTDClick: onRoleClick, onSuccess: function (obj) { obj.List.fireClick(0); } },
            'userList': { aHeader: _userHAry, deleteApi: _api + '&action=delUsers', updateApi: _api + '&action=updateUser', colControls: { header: {}, paging: {}} }
        }
        var viewStruct = {
            p: owner,
            type: 'Tips', 
            name: 'roleTips', 
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'List', name: 'roleList' },
                eFoot: {
                    type: 'Tips',
                    name: 'userTips',
                    body: { type: 'List', name: 'userList' }
                }
            }
        }
        coms = $.layout({ args: comArgs, struct: viewStruct });
    }
    function _event() { }
    function _override() { }
    function onFormInit(obj) {
        infoF = obj.Form; formBtn = infoF.getButton('FORM-SYS-SUBMIT');
    }

    function onRoleClick(obj) {
        var _type = obj.Target.getAttr('type'), _args = _api + '&action=getUsers';
        switch (_type) {
            case '-2':
                _args += '&jsonCondition={"delFlag":1}';
                break;
            case '0':
                var _uids = obj.Target.getAttr('uids');
                _uids = _uids.substr(1, _uids.length - 2);
                if (!_uids) { _uids = '0'; }
                _args += '&jsonCondition={"id,in":"' + _uids + '"}';
                break;
        }
        coms['userList'].setAttr('selTrs', []).set('selIds', []);
        coms['userList'].loadAjax({ args: _args });
    }

    function unique_array(ary) {
        var _a = [], _b = {}, _l = ary.length, i, _c = 0;
        for (i = 0; i < _l; i++) { var _d = ary[i]; if (_d) { _b[_d] = true; } }
        for (var e in _b) { _a[_c] = e; _c++; }
        return _a;
    }

    function getSelUserHtml() {
        var _uList = coms['userList'], _selTRAry = _uList.getAttr('selTrs'), _sLen = _selTRAry.length, _html = '', _ids = [];
        for (var i = 0; i < _sLen; i++) { var _obj = _uList.getRowDataByTR(_selTRAry[i]); _html += '<div class="fl p5 m3 fs12 bc_17">' + _obj.uid + '</div>'; _ids.push(_obj.id); }
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
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}