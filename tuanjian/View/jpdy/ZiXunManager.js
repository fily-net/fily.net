﻿$.NameSpace('$View.jpdy');
$View.jpdy.ZiXunManager = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB }, zixunId;
    var coms, toolBar, mainList, popTips, fileTips;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _HAry = [
            { name: 'cb', type: 'checkbox', width: 50 },
            { name: 'state', ifEdit: false, type: 'select', title: '状态', width: 80, ifTrans: true, ifFilter: true, filterItems: ['equal'], varID: 25  },
            { name: 'avatarImg', path: 'http://localhost:8888/images/zixun/', type: 'image', title: '图片', width: 60 },
            { name: 'title', type: 'none', title: '标题', width: 250, ifFilter: true, filterItems: ['like'] },
            { name: 'content', type: 'none', title: '内容', width: 520, ifEnableTips: true },
            { name: 'createTime', type: 'date', title: '创建时间', width: 150 },
            { name: 'modifyTime', type: 'date', title: '修改时间', width: 150 },
            { name: 'note', type: 'none', title: '备注', width: 250 }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var toolbarAry = [
            { name: 'addZiXun', text: '添加旅游资讯' },
            { name: 'deleteZiXun', text: '删除旅游资讯' },
            { name: 'modifyZiXun', text: '修改旅游资讯' }
        ];
        var comArgs = {
            'mainTips': { head_h: 34, title: '旅游资讯管理', cn: 'b0', onToolBarClick: onToolBarClick, toolBarSkin: 'mr5 Button-default', toolBarAry: toolbarAry },
            'mainList': { dataType: 'html', dbType: 'mysql', aHeader: _HAry, ifEnabledFilter: true, loadApi: 'm=MYSQL_BASE&table=t_sys_global_zixun&action=pagingForList&pageSize=1', colControls: { header: {}, paging: {} }, onTDClick: onListTDClick, onSuccess: function (obj) { if (obj.Length) { obj.List.fireClick(0); } } }
        }
        var viewStruct = {
            p: owner,
            type: 'Tips',
            name: 'mainTips',
            body: { type: 'List', name: 'mainList' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
        toolBar = coms.mainTips.toolBar; mainList = coms.mainList;
    }

    function onListTDClick(obj) {
        zixunId = obj.Target.getAttr('rowId');
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'addZiXun':
                //添加旅游资讯
                var infoAry = [
                    { name: 'avatarImg', ifEdit: true, comType: 'Label', onClick: onImageClick, type: 'image', group: { width: 620 } },
                    { name: 'title', width: 500, title: '标题', comType: 'Input', req: true, sErr:'标题是必填项'},
                    { name: 'content', width: 508, title: '内容', comType: 'RichText' },
                    { name: 'note', width: 500, title: '备注', comType: 'TextArea' }
                ];
                popTips = new $.UI.Tips({ head_h: 30, title: '添加旅游资讯', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 650, ifFixedHeight: false });
                popTips.Form = new $.UI.Form({ p: popTips.body, insertApi: 'm=MYSQL_BASE&table=t_sys_global_zixun&action=addRow', items: infoAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; mainList.refresh(); } });
                break;
            case 'deleteZiXun':
                if (!zixunId) {
                    MTips.show('请先选择要删除的资讯!', 'warn');
                }
                MConfirm.setWidth(250).show('确定' + obj.Text + '?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=MYSQL_BASE&table=t_sys_global_zixun&action=deleteByID&id=' + zixunId,
                        onSuccess: function () { MTips.show('删除成功!', 'ok'); mainList.refresh(null, true, true); }
                    });
                });
                break;
        }
    }

    function onImageClick(obj) {
        fileTips = new $.UI.Tips({ comMode: 'x-auto', width: 500, height: 300, y: 100, head_h: 30, ifMask: true, ifClose: true, title: '上传图片', icon: 'icon-vector-man' });
        new $.UI.FileUploader({
            p: fileTips.body, module: 'MYSQL_FILES', uploadApi: 'action=uploadAvatarImg&catlog=zixun', onSuccess: function (cb) {
                var _nSrc = 'http://localhost:8888/images/zixun/' + cb.File.fileName; obj._E.src = _nSrc;
                obj.FormItem.setValue(cb.File.fileName);
                fileTips.remove(); fileTips = null;
            }
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