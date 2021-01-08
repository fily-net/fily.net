$.NameSpace('$View.common');
$View.common.ImageInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, key:'nodeName', loadApi:'' };
    var coms = {}, infoF, mainList, fileTips, currID;
    var _tbAry = [
        {name:'upload',text:'上传文件',icon:'icon-glyph-upload'},
        {name:'del',text:'删除文件',icon:'icon-glyph-minus-sign'}
    ];
    var _fcAry = [
        { name: 'nodeName', title: '文件名', comType: 'Label' },
        { name: 'size', title: '文件大小', comType: 'Label' },
        { name: 'cTime', title: '上传时间', comType: 'Label' },
        { name: 'filePath', comType: 'Label', type:'image', size:'auto', css:'width:100%;margin:20px auto;' }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootBase': { head_h: 33 },
            'toolBar': { items:_tbAry, onClick: onToolBarClick },
            'rootLayout': { min: 200, max: 500, isRoot: 1, start: 320, dir: 'we', dirLock: 1 },
            'mainList': { aHeader:[{name:args.key,type:'none',ifEdit:false}], onTDClick: onMainListClick, loadApi: args.loadApi, onSuccess: function (obj){ obj.List.fireClick(0);} },
            'infoForm': { head_h: 22, ifFocus: false, ifFixedHeight:false, foot_h:0, title: '未选中文件', icon: 'icon-compact-picture', items: _fcAry, loadApi:'m=SYS_TABLE_BASE&action=getByID&table='+args.table },
        }
        var struct = {
            p: owner,
            type:'BaseDiv',
            name:'rootBase',
            head: {type:'ButtonSet',name:'toolBar'},
            body:{
                type: 'Layout',
                name: 'rootLayout',
                eHead: { type: 'List', name: 'mainList' },
                eFoot: { type: 'Form', name: 'infoForm' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        infoF = coms['infoForm']; mainList = coms['mainList'];
    }

    function onToolBarClick(obj){
        switch(obj.Name){
            case 'upload':
                fileTips = new $.UI.Tips({ comMode: 'x-auto', width: 500, height: 400, y: 100, head_h: 30, ifMask: true, ifClose: true, title: '图标选择器', icon: 'icon-glyph-picture' });
                new $.UI.FileUploader({ p: fileTips.body, mId: 5, catelog: 'sys_img_src', allowFileFormat:['jpg','png'], onComplete: function (){ mainList.refresh(); } });
                break;
            case 'del':
                if (!currID){ MTips.show('还未选中图片哦!','warn');return; }
                MConfirm.setWidth(250).show('确定删除此图片?').evt('onOk', function () {
                    $.Util.ajax({
                        args:'m=SYS_CM_FILES&action=delFileOrDir&id='+currID,
                        onSuccess: function (obj){ MTips.show('删除成功','ok');mainList.refresh({ onSuccess:function (){ mainList.fireClick(0); } }); },
                        onError: function (){ MTips.show('删除失败','error'); }
                    });
                });
                break;
        }
    }

    function onMainListClick(obj){
        currID= obj.Target.getAttr('rowId');
        $.Util.ajax({
            args:'m=SYS_CM_FILES&action=getFileDetail&keyFields=nodeName,size,convert(varchar(20),cTime, 120) as cTime,\'uploads/\'%2Bcatelog%2B\'/\'%2BsysName%2B\'.\'%2BextName as filePath&dataType=json&id='+currID,
            onSuccess:function (obj){
                var _sVal = obj.get(0);
                if(_sVal){
                    var _oVal = eval(_sVal)[0];
                    infoF.setTitle(_oVal['nodeName']);
                    for(var key in _oVal){ infoF.items[key].setText(_oVal[key]); }
                }
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