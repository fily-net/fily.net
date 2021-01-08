$.namespace('$View.crm');
$View.crm.Merchant = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB }, popTips;
    var coms = {}, typeTab, mainList;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootDiv': { head_h: 38, foot_h: 0, skin: 'none' },
            'type': { skin: 'arrow', ifAutoClick: false, items: [{ text: '<span>私海<em class="nav-tab-arrow"></em></span>', name: '169' }, { text: '<span>公海<em class="nav-tab-arrow"></em></span>', name: '170'}], onClick: onTabClick },
            'mainList': { onItemClick: onListItemClick }
        }
        var struct = {
            p: owner,
            type: 'BaseDiv',
            name: 'rootDiv',
            head: { name: 'type', type: 'Tab' },
            body: { name: 'mainList', type: 'List' }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        mainList = coms.mainList; coms.type.fireClick(0);
    }
    function onListItemClick(obj) { new $.UI.View({ p: args.p, proId: obj.id, url: 'View/crm/MerchantInfo.js' }); }
    function onTabClick(obj) { mainList.loadAjax('m=SYS_CM_CRM&action=pagingForRightsPM&jsonCondition={"proType":' + obj.name + '}&ifCount=1&pageIndex=1&pageSize=20&dataType=json&keyFields=id, merchantName as title, dbo.SYS_TRANS_USER(oPerson) as oPerson, dbo.SYS_TRANS_USER(cPerson) as cPerson, convert(varchar(20),cTime, 120) as cTime'); }
    me.init = function (j) { setDefault(j); layout(); return me; }
    if (arguments.length) { me.init(j); }
    return me;
}