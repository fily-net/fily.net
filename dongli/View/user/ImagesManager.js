$.NameSpace('$View.user');
$View.user.ImagesManager = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, userId: null, regionId: null };
    var coms, formBtn, infoF, toolBar, uList;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _userHAry = [
            { name: 'cb', type: 'checkbox', width: 50 },
            { name: 'state', type: 'attr' },
            { name: 'state', type: 'select', ifTrans: true, title: '状态', width: 80, ifFilter: true, filterItems: ['equal'], gtID: 759 },
            { name: 'name', type: 'none', title: '文件名', width: 150, ifFilter: true, filterItems: ['like'] },
            { name: 'fullName', type: 'none', title: '文件完整名', width: 150, ifFilter: true, filterItems: ['like'] },
            { name: 'tempName', type: 'none', title: '系统临时名', width: 150, ifFilter: true, filterItems: ['like'] },
            { name: 'ext', type: 'none', title: '文件扩展', width: 150, ifFilter: true, filterItems: ['like'] },
            { name: 'size', type: 'none', title: '文件大小', width: 150 },
            { name: 'note', type: 'none', title: '备注', width: 200, MTips: true, ifFilter: true, filterItems: ['like'] }
        ];
        var _userInfo = [
            { name: 'url', title: '', comType: 'Label', group: { name: 'g1', width: 320 }, type: 'image', imgWidth: 200, imgHeight: 200, ifSubmit: false },
            { name: 'state', title: '文件状态', group: { name: 'g2', width: 320 }, ifTrans: true, gtID: 759, comType: 'Select' },
            { name: 'rejectReason', title: '拒绝原因', comType: 'TextArea', group: 'g2' }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _api = 'm=SYS_TABLE_BASE&table=TJ_PICTURE&action=pagingForList&pageSize=1';
        if (args.userId) {
            _api += '&jsonCondition={"userId":' + args.userId + '}';
        }

        var comArgs = {
            'userTips': {
                head_h: 33,
                title: '图片及视频管理',
                icon: 'fa-image',
                cn: 'b0',
                onToolBarClick: onToolBarClick,
                toolBarSkin: 'mr5 Button-default',
                toolBarAry: [
                    { name: 'upload', text: '上传文件', skin: 'Button-s1' }
                ]
            },
            'userList': {
                aHeader: _userHAry,
                ifEnabledFilter: true,
                loadApi: _api,
                colControls: { header: {}, paging: {} },
                onTDClick: onListTDClick,
                onSuccess: function (obj) {
                    
                }
            },
            'userForm': {
                loadApi: 'm=SYS_TABLE_BASE&table=TJ_PICTURE&action=getByID',
                insertApi: 'm=SYS_TABLE_BASE&table=TJ_PICTURE&action=addRow',
                updateApi: 'm=SYS_TABLE_BASE&table=TJ_PICTURE&action=updateByID',
                items: _userInfo,
                btnItems: [
                    { name: 'FORM-SYS-SUBMIT', skin: 'Button-s1', text: '审批', css: 'margin-left:100px;margin-top:8px;' }
                ],
                onSubmitSuccess: onFormSubmitSuccess
            },
            'userLayout': {
                min: 200, max: 500,
                start: 320, dir: 'ns',
                dirLock: 2, isRoot: true
            }
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
        uList = coms.userList;
        infoF = coms.userForm;
    }

    function onToolBarClick(obj) {
        if (popTips) { popTips.remove(); }
        popTips = new $.UI.Tips({
            comMode: 'x-auto',
            width: 500,
            height: 400,
            y: 100, head_h: 30,
            ifMask: true,
            ifClose: true,
            title: '文件上传',
            icon: 'icon-glyph-arrow-up'
        });
        new $.UI.FileUploader({ p: popTips.body, mId: currID, catelog: 'docmg', onSuccess: onUploadSuccess });
    }

    function onFormSubmitSuccess(obj) {
        switch (obj.Form.get('state').trim()) {
            case 'Update':
                MTips.show('修改信息成功', 'ok');
                uList.refresh();
                break;
        }
    }

    function onListTDClick(obj) {
        infoF.loadDataByID(+obj.Target.getAttr('rowId'), function () {

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