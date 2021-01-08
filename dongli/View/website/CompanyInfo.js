$.NameSpace('$View.website');
$View.website.CompanyInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB, userId: null }, coms, infoF, popTips;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var _userInfo = [
            { name: 'title', title: '公司名', group: { name: 'g1', width: 800 }, width: 630, comType: 'Input' },
            { name: 'address', title: '地址', group: 'g1', width: 630, comType: 'Input' },
            { name: 'phone', title: '联系电话', group: 'g1', width: 630, comType: 'Input' },
            { name: 'fax', title: '传真', group: 'g1', width: 630, comType: 'Input' },
            { name: 'email', title: '邮件', group: 'g1', width: 630, comType: 'Input' },
            { name: 'website', title: '网站', group: 'g1', width: 630, comType: 'Input' },
            { name: 'link', title: '二维码图片', comType: 'FileView', width: 637, group: 'g1' }
        ];
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'userForm': {
                head_h: 33, foot_h: 40, ifFixedHeight: false,
                loadApi: 'm=SYS_TABLE_BASE&action=getByID&table=DL_COMPANY',
                updateApi: 'm=SYS_TABLE_BASE&action=updateByID&table=DL_COMPANY',
                title: '公司信息',
                icon: 'icon-vector-info-card',
                items: _userInfo
            }
        }
        var viewStruct = { p: owner, type: 'Form', name: 'userForm' };
        coms = $.Util.initUI({ args: comArgs, struct: viewStruct });
        infoF = coms.userForm;
        me.setInfo(1);
    }
    me.setInfo = function (id) { if (!id) { return me; } infoF.loadDataByID(id); return me; }
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