$.NameSpace('$View.website');
$View.website.News = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms, formBtn, infoF, toolBar, uList;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _userHAry = [
            { name: 'cb', type: 'checkbox', width: 50 },
            { name: 'type', type: 'select', ifTrans: true, title: '类型', width: 150, ifFilter: true, filterItems: ['equal'], gtID: 766 },
            { name: 'title', type: 'none', title: '标题', width: 180, ifFilter: true, filterItems: ['like'] },
           // { name: 'url', type: 'none', title: '链接', width: 180 },
            { name: 'note', type: 'none', title: '留言内容', width: 400 }
        ];
        var _userInfo = [
            { name: 'type', title: '类型', group: { name: 'g1', width: 800 }, width: 630, ifTrans: true, gtID: 766, comType: 'Select' },
            { name: 'title', title: '标题', group: 'g1', width: 630, comType: 'Input' },
            { name: 'note', title: '正文', comType: 'RichText', width: 637, group: 'g1' }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'userTips': {
                head_h: 30, title: '新闻管理',
                icon: 'fa fa-user', cn: 'b0',
                toolBarAry: [
                    { name: 'add', text: '发布新闻', skin: 'Button-s1' },
                    { name: 'delete', text: '删除新闻', skin: 'Button-danger' }
                ],
                onToolBarClick: onToolBarClick,
                toolBarSkin: 'mr5 Button-default'
            },
            'userList': {
                aHeader: _userHAry,
                ifEnabledFilter: true,
                loadApi: 'm=SYS_TABLE_BASE&table=DL_NEWS&action=pagingForList&orderCondition={"cTime": "asc"}',
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
                loadApi: 'm=SYS_TABLE_BASE&table=DL_NEWS&action=getByID',
                insertApi: 'm=SYS_TABLE_BASE&table=DL_NEWS&action=addRow',
                updateApi: 'm=SYS_TABLE_BASE&table=DL_NEWS&action=updateByID',
                items: _userInfo,
                onSubmitSuccess: onFormSubmitSuccess
            },
            'userLayout': { min: 200, max: 500, start: 420, dir: 'ns', dirLock: 2, isRoot: true }
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

        /*
        var viewStruct = {
            p: owner,
            type: 'Tips',
            name: 'userTips',
            body: { type: 'List', name: 'userList' }
        }*/
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
        toolBar = coms.userTips.toolBar;
        infoF = coms.userForm;
        uList = coms.userList;
        //formBtn = infoF.getButton('FORM-SYS-SUBMIT');
    }

    function onUserDoubleClick(obj) {
        //var _id = obj.eTr.attr('rowid');
        //new $.UI.View({ p: args.p, url: 'View/user/ImagesManager.js', userId: _id });
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'add':
                infoF.set('state', 'Insert').reset().focus();
                formBtn.setIcon('fa fa-plus').setText('发布新闻');
                break;
            case 'delete':
                var _ids = uList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择删除记录', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除该' + _ids.length + '项记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_BASE&table=DL_NEWS&action=deleteByIDs&ids=' + _ids.join(','),
                        onSuccess: function () { uList.refresh() }
                    });
                });
                break;
        }
    }
    
    function onFormSubmitSuccess(obj) {
        switch (obj.Form.get('state').trim()) {
            case 'Update':
                MTips.show('修改成功', 'ok');
                //uList.refresh();
                break;
            case 'Insert':
                MTips.show('添加成功', 'ok');
                //uList.refresh();
               // obj.Form.reset().set('state', 'Insert').focus();
                break;
        }
    }
    function onUserClick(obj) {
        delayShowInfo(obj.Target.getAttr('rowId'));
    }
    function delayShowInfo(id) {
        if (!infoF) { setTimeout(function () { delayShowInfo(id); }, 200); return; }
        infoF.loadDataByID(id, function () {
            infoF.getButton('FORM-SYS-SUBMIT').setIcon('fa fa-edit').setText('修改新闻');
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