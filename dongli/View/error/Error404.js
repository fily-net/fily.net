$.NameSpace('$View.error');
$View.error.Error404 = function (j) {
    var me = this, _fn = function () { };
    var owner, args = { p: $DB, href: '' };
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        var html = '<div style="width:500px;position: absolute;background: #fff;top:150px;left:50%;margin-left:-250px;-webkit-box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, .3);box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, .3);padding: 30px 50px 50px 50px;"><h1 style="font-size: 36px;padding-bottom: 20px;"><span style="font-size: 60px;padding-right: 15px;color: #333;">404</span>页面为找到</h1><p style="line-height: 2em;">很抱歉!这个页面<a class="c_6" href="#" url="' + args.href + '">' + args.href + '</a>已经找不到了。</p></div>';
        owner = args.p.adElm('', 'div').h(html).css('font-family: "Microsoft Yahei",Arial,Helvetica,sans-serif;color: #9B9B9B;background: #F3F3F3;width:100%;height:100%;');
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