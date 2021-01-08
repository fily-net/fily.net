﻿$.NameSpace('$View.oa');
$View.oa.NewManager = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms = {}, eBody;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var fiAry = [
            { name: 'title', title: '标题', comType: 'Input', width: 430, req: true },
            { name: 'bTime', title: '开始时间', comType: 'Date', req: true, width: 430 },
            { name: 'eTime', title: '截止时间', comType: 'EndDate', matchItem: 'bTime', width: 430, req: true },
            { name: 'link', title: '附件', comType: 'FileUploader', width: 430 },
            { name: 'content', title: '内容', comType: 'RichText', width: 437, req: true }
        ],
        _table = 'SYS_CM_NEWS',
        _loadApi = 'm=SYS_TABLE_BASE&action=pagingForList&table=' + _table,
        _headAry = [
            { title: '标题', name: 'title', width: 250, ifEnabledTips: true, ifFilter: true, filterItems: ['like'] },
            { title: '创建时间', name: 'cTime', type: 'date', width: 145, ifFilter: true, filterItems: ['equal'] },
            { title: '修改时间', name: 'mTime', type: 'date', width: 145, ifFilter: true, filterItems: ['equal'] },
            { title: '创建人', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 100 }
        ];
        var comArgs = {
            'root': { title: '施工公告管理', cn: 'b0', icon: 'fa fa-newspaper-o', head_h: 30 },
            'infoView': {
                url: 'View/common/MasterInfo.js', fiAry: fiAry, aHeader: _headAry, loadApi: _loadApi, table: _table
            }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'root',
            body: {
                type: 'View',
                name: 'infoView'
            }
        };
        coms = $.Util.initUI({ args: comArgs, struct: struct });
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