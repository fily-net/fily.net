$.NameSpace('$View.user');
$View.user.TJUserManager = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms, formBtn, infoF, toolBar, uList;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _userHAry = [
            { name: 'cb', type: 'checkbox', width: 50 },
            { name: 'uid', type: 'none', title: '用户名', width: 180, ifFilter: true, filterItems: ['like'] },
            { name: 'nickName', type: 'none', title: '昵称', width: 180 },
            { name: 'state', type: 'select', ifTrans: true, title: '状态', width: 100, ifFilter: true, filterItems: ['equal'], gtID: 756 },
            { name: 'sex', type: 'select', ifTrans: true, title: '性别', width: 100, ifFilter: true, filterItems: ['equal'], gtID: 131 },
            { name: 'birthday', type: 'date', title: '出生年月', width: 130 },
            { name: 'fixedPhoneNum', type: 'none', title: '座机电话', width: 120 },
            { name: 'mobilePhoneNum', type: 'none', title: '移动电话', width: 120 },
            { name: 'email', type: 'none', title: '邮件', width: 150 },
            { name: 'address', type: 'none', title: '常住地址', width: 200 },
            { name: 'note', type: 'none', title: '备注', width: 200 }
        ];
        var _userInfo = [
            { name: 'avatar', title: '', comType: 'Label', group: { name: 'g1', width: 320 }, type: 'image', ifSubmit: false },
            { name: 'uid', title: '用户名', comType: 'Label', group: 'g1' },
            { name: 'nickName', title: '昵称', comType: 'Label', group: 'g1' },
            { name: 'birthday', title: '出生年月', comType: 'Label', group: 'g1' },
            { name: 'state', title: '状态', group: { name: 'g2', width: 320 }, ifTrans: true, gtID: 756, comType: 'Select' },
            { name: 'fixedPhoneNum', title: '座机号', group: 'g1', comType: 'Label' },
            { name: 'mobilePhoneNum', title: '手机号', group: 'g2', comType: 'Label' },
            { name: 'address', title: '常住地址', group: 'g2', comType: 'Label' },
            { name: 'email', title: '邮件', group: 'g2', comType: 'Label' },
            { name: 'note', title: '备注', comType: 'Label', group: 'g2' }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'userTips': {
                head_h: 30, title: '账户管理',
                icon: 'fa fa-user', cn: 'b0'
            },
            'userList': {
                aHeader: _userHAry,
                ifEnabledFilter: true,
                loadApi: 'm=SYS_TABLE_BASE&table=TJ_USER&action=pagingForList&orderCondition={"cTime": "asc"}',
                colControls: { header: {}, paging: {} },
                onTDClick: onUserClick,
                onTDDoubleClick: onUserDoubleClick,
                onSuccess: function (obj) {
                    if (obj.Length) {
                        obj.List.fireClick(0);
                    }
                }
            },
            'userForm': {
                head_h: 0, 
                loadApi: 'm=SYS_TABLE_BASE&table=TJ_USER&action=getByID',
                insertApi: 'm=SYS_TABLE_BASE&table=TJ_USER&action=addRow',
                updateApi: 'm=SYS_TABLE_BASE&table=TJ_USER&action=updateByID',
                title: '账号信息',
                items: _userInfo,
                onSubmitSuccess: onFormSubmitSuccess
            },
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
        toolBar = coms.userTips.toolBar;
        infoF = coms.userForm;
        uList = coms.userList;
        formBtn = infoF.getButton('FORM-SYS-SUBMIT').hide();
    }

    function onUserDoubleClick(obj) {
        var _id = obj.eTr.attr('rowid');
        new $.UI.View({ p: args.p, url: 'View/user/ImagesManager.js', userId: _id });
    }
    
    function onFormSubmitSuccess(obj) {
        switch (obj.Form.get('state').trim()) {
            case 'Update':
                MTips.show('修改信息成功', 'ok');
                uList.refresh();
                break;
            case 'Insert':
                MTips.show('添加信息成功', 'ok');
                uList.refresh(); obj.Form.reset().set('state', 'Insert').focus();
                break;
        }
    }
    function onUserClick(obj) {
        formBtn.setText('修改信息').show();
        delayShowInfo(obj.Target.getAttr('rowId'));
    }
    function delayShowInfo(id) {
        if (!infoF) { setTimeout(function () { delayShowInfo(id); }, 200); return; }
        infoF.loadDataByID(id, function () { formBtn.setIcon('fa fa-edit').setText('修改用户状态'); });
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