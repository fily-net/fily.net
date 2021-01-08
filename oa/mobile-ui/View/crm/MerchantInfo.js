$.namespace('$View.crm');
$View.crm.MerchantInfo = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var coms, args = { p: $DB, proId: null };
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'ul').cn('List');
        $.Util.ajax({
            args: 'm=SYS_TABLE_BASE&table=CRM_MERCHANT&action=getByID&keyFields=merchantName as "商户名称", dbo.SYS_TRANS_GT(merchantType) as "行业类型", merchantArea as "面积", avgConsume as "平均消费", dollNum as "安装点数", dbo.SYS_TRANS_GT(netType) as "网络类型", dbo.SYS_TRANS_GT(linkAgeType) as "是否连锁", linkAge as "连锁店数", dbo.SYS_TRANS_GT(stars) as "点评星级", dbo.SYS_TRANS_GT(evaluate) as "对商户评级", dbo.SYS_TRANS_GT(cooperation) as "合作情况", counties as "行政区", address as "地址", market as "商圈", fuZeRen as "负责人", fuZeRenLianXi as "联系方式", lianXiRen as "联系人", zhiWu as "职务"&dataType=json&id=' + args.proId || 2,
            onSuccess: function (d) {
                var _infoObj = eval(d.get(0) || '[]')[0];
                for (var k in _infoObj) {
                    owner.adElm('', 'li').h('<div><strong>' + k + '：</strong>' + _infoObj[k] + '</div>');
                }
            },
            onError: function (d) { MTips.show(d.data || '加载失败', 'error'); }
        });
    }
    me.init = function (j) { setDefault(j); layout(); return me; }
    if (arguments.length) { me.init(j); }
    return me;
}