$.NameSpace('$View.project');
$View.project.ExecTeam = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, table: 'PRO_EXEC_TEAM' };
    var coms = {}, infoF, formBtn, mainList;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _tbAry = [
            {name:'add',text:'新建施工队', cn:'mr10', icon:'fa fa-plus'},
            {name:'del',text:'删除施工队',icon:'fa fa-close'}
        ];
        var comArgs = {
            'rootBase': { head_h: 30, cn:'b0', toolBarSkin:'Button-default', title: '施工队管理', icon:'fa fa-leaf', toolBarAry: _tbAry, onToolBarClick: onToolBarClick },
            'toolBar': { items:_tbAry, onClick: onToolBarClick },
            'rootLayout': { min: 200, max: 500, isRoot: true, start: 420, dir: 'we', dirLock: 1 },
            'mainList': { aHeader:[{name:'companyName',type:'none'}], onTDClick: onMainListClick, loadApi: 'm=SYS_TABLE_BASE&action=pagingForList&table='+args.table, onSuccess: function (obj){ obj.List.fireClick(0);}, colControls: { paging: { pageSize: 20, pageIndex: 1} } },
            'infoForm': { head_h: 30, ifFixedHeight:false, title: '基本信息', icon: 'fa fa-list-alt', loadApi:'m=SYS_TABLE_BASE&action=getByID&table='+args.table, updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table='+args.table, insertApi: 'm=SYS_TABLE_BASE&action=addRowWithAttachment&table='+args.table, onSubmitSuccess: onFormSuccess },
        }
        var struct = {
            p: owner,
            type:'Tips',
            name:'rootBase',
            body:{
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'List', name: 'mainList' },
                eFoot: { type: 'Form', name: 'infoForm' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        infoF = coms['infoForm']; formBtn = infoF.getButton('FORM-SYS-SUBMIT'); mainList = coms['mainList'];
    }

    function onFormSuccess(obj){
        if (obj.Form.get('state')=='Insert'){ mainList.refresh(null, true, true); }
    }

    function onToolBarClick(obj){
        switch(obj.Name){
            case 'add':
                var arrowTips = $.initArrowTips(obj, 'width:520px;padding:5px 10px 5px 10px;');
                var _fiAry = [
                    {title:'施工队名称',name:'companyName',comType:'Input',req:true, sErr:'施工队名称不能为空',width:400, group:{width:700}},
                    {title:'施工队资质证书编号',name:'QCN',comType:'Input',req:false, sErr:'施工队资质证书编号不能为空',width:400},
                    {title:'施工队资质等级',name:'QL',comType:'Input',req:false, sErr:'施工队资质等级不能为空',width:400},
                    {title:'法定代表人',name:'legalPerson',comType:'Input',req:false, sErr:'施工队代表人不能为空',width:400},
                    {title:'施工队负责人',name:'responsePerson',comType:'Input',req:false, sErr:'施工队负责人不能为空',width:400},
                    {title:'施工队联系人',name:'contact',comType:'Input',req:true, sErr:'联系人不能为空',width:400},
                    {title:'联系人电话',name:'mobilphone',comType:'Input',req:true, sErr:'联系人电话不能为空',width:400},
                    {title:'经营范围',name:'business',comType:'TextArea',width:400,height:200}
                ];
                var _form = $.global.arrowTips.init({
                    type: 'Form',
                    items: _fiAry,
                    ifFixedHeight: false,
                    insertApi: 'm=SYS_TABLE_BASE&action=addRow&table=' + args.table,
                    btnItems: [
                        { name: 'FORM-SYS-SUBMIT', icon: 'fa fa-plus', text: '新建施工队', skin: 'Button-blue', css: 'margin-left:100px;' }
                    ],
                    onSubmitSuccess: function (obj) {
                        if ($.global.arrowTips) { $.global.arrowTips.remove(); $.global.arrowTips = null; }; mainList.refresh({onSuccess: function (){ mainList.fireClick(0); }});
                    }
                }, true);
                break;
            case 'del':
                var _id = mainList.getAttr('selID');
                if(_id){
                    MConfirm.setWidth(250).show('确定删除此项记录?').evt('onOk', function (){
                        $.Util.ajax({
                            args: 'm=SYS_TABLE_BASE&action=deleteByID&table='+args.table+'&id='+_id,
                            onSuccess: function (){ mainList.refresh({onSuccess: function(){mainList.fireClick(0);}}); MTips.show('删除记录成功!','ok'); },
                            onError: function (d){ MTips.show('删除记录失败!','error'); }
                        });
                    });
                }else {
                    MTips.show('请选择记录','warn');   
                }
                break;
        }
    }

    function onMainListClick(obj){
        var _id = obj.Target.getAttr('rowId');
        var _fid = _id;
        var _infoAry = [
            {title:'施工队名称',name:'companyName',comType:'Input',req:true, sErr:'名称不能为空',width:400, group:{width:700}},
            {title:'资质证书编号',name:'QCN',comType:'Input',req:false, sErr:'资质证书编号不能为空',width:400},
            {title:'资质等级',name:'QL',comType:'Input',req:false, sErr:'资质等级不能为空',width:400},
            {title:'法定代表人',name:'legalPerson',comType:'Input',req:false, sErr:'法定代表人不能为空',width:400},
            {title:'负责人',name:'responsePerson',comType:'Input',req:false, sErr:'负责人不能为空',width:400},
            {title:'联系人',name:'contact',comType:'Input',req:true, sErr:'联系人不能为空',width:400},
            {title:'联系人电话',name:'mobilphone',comType:'Input',req:true, sErr:'联系人电话不能为空',width:400},
            {title:'附件',name:'link',comType:'FileUploader',width:400, specialFiles: [{ ext: 'jpg', name: '营业执照_' + _fid }, { ext: 'jpg', name: '税务登记_' + _fid }, { ext: 'doc', name: '开户证明_' + _fid }, { ext: 'jpg', name: '法人身份证复印件_' + _fid }, { ext: 'jpg', name: '资质证书_' + _fid }, { ext: 'jpg', name: '安全生产许可证_' + _fid }] },
            {title:'经营范围',name:'business',comType:'TextArea',width:400,height:200}
        ];
        infoF.reLoadItems(_infoAry, { onSuccess: function (){ infoF.loadDataByID(_id, function (){formBtn.setIcon('fa fa-edit').setText('编辑施工队信息');}); } });
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