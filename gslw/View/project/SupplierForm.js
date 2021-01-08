$.NameSpace('$View.project');
$View.project.SupplierForm = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, sid: null, onSubmitSuccess: _fn }, coms, taskInfo, popTips;
    function setDefault(j) {
        args = $.Util.initArgs(j, args);
    }
    function layout() {
        var _fiAry = [
            { title: '企业名称', name: 'companyName', comType: 'Input', req: true, sErr: '企业名称不能为空', width: 400, group: { width: 700 } },
            { title: '资质证书', name: 'QCN', comType: 'Input', req: false, sErr: '企业资质证书编号不能为空', width: 400 },
            { title: '资质等级', name: 'QL', comType: 'Input', req: false, sErr: '企业资质等级不能为空', width: 400 },
            { title: '法定代表人', name: 'legalPerson', comType: 'Input', req: false, sErr: '法定代表人不能为空', width: 400 },
            { title: '负责人', name: 'responsePerson', comType: 'Input', req: false, sErr: '负责人不能为空', width: 400 },
            { title: '联系人', name: 'contact', comType: 'Input', req: true, sErr: '联系人不能为空', width: 400 },
            { title: '联系人电话', name: 'mobilphone', comType: 'Input', req: true, sErr: '联系人电话不能为空', width: 400 },
            { title: '营业执照', name: 'link', comType: 'FileUploader', width: 400 },
            { title: '经营范围', name: 'business', comType: 'TextArea', width: 400, height: 200 }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'taskInfo': {
                foot_h: 30,
                items: _fiAry,
                state: 'Update',
                btnItems: [{ name: 'FORM-SYS-SUBMIT', text: '编辑', icon: 'fa fa-edit', skin: 'Button-blue', css: 'margin-left:100px;' }],
                submitApi: 'm=SYS_TABLE_BASE&action=updateByID&table=PRO_SUPPLIER',
                loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=PRO_SUPPLIER',
                onSubmitSuccess: function () {
                    MTips.show('编辑成功', 'ok');
                    args.onSubmitSuccess();
                }
            }
        }
        var viewStruct = {
            p: owner, type: 'Form', name: 'taskInfo'
        };
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
        taskInfo = coms.taskInfo;
        loadInfoByProId(args.sid);
    }

    function loadInfoByProId(sid) {
        taskInfo.loadDataByID(sid, function (obj) {

        }, true);
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