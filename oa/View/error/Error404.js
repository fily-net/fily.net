$.namespace('$View.error');
$View.error.Error404 = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, href: '' };
    function _default() { }
    function _layout() {
        var html = '<div style="width:500px;position: absolute;background: #fff;top:150px;left:50%;margin-left:-250px;-webkit-box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, .3);box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, .3);padding: 30px 50px 50px 50px;"><h1 style="font-size: 36px;padding-bottom: 20px;"><span style="font-size: 140px;padding-right: 15px;color: #28B779;font-weight: bold;">404</span>页面未找到</h1><p style="line-height: 2em;">很抱歉!这个页面<a class="c_6" href="#" url="' + args.href + '">' + args.href + '</a>已经找不到了。</p><a class="btn btn-warning" url="View/oa/Home.js">返回首页</a></div>';
        owner = args.p.adElm('', 'div').h(html).css('font-family: "Microsoft Yahei",Arial,Helvetica,sans-serif;color: #9B9B9B;background: #F3F3F3;width:100%;height:100%;');
    }
    function _event() { }
    function _override() { }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}