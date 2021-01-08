$.NameSpace('$View.report');
$View.report.TuanJianReport = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB }, popTips, infoView, currProId;
    var coms = {}, typeTab, mainList;
    var loadApi, body;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootLayout': { min: 300, max: 500, isRoot: 1, start: 375, dir: 'ns', dirLock: 2 },
            'rootDiv': { head_h: 35 },
            'typeTab': {
                items: [
                    { name: 'tupian', type: 'tab', text: '区域图片报表', ifPress: true },
                    { name: 'huoyue', type: 'tab', text: '区域活跃报表' }
                ],
                skin: 'ButtonSet-tab fl',
                itemSkin: 'Button-tab',
                onClick: onTypeClick
            }
        }
        var struct = {
            p: owner,
            type: 'BaseDiv',
            name: 'rootDiv',
            head: [
                { name: 'typeTab', type: 'ButtonSet' }
            ]
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        body = coms.rootDiv.body;

        typeTab = coms.typeTab;
        typeTab.fireClick(0);
    }

    function onTypeClick(obj) {
        switch (obj.Name) {
            case 'tupian':
                $.Util.ajax({

                });

                body.h('<canvas width="300" height="300"/>');
                var pieData = [
				    {
				        value: 300,
				        color: "#F7464A",
				        highlight: "#FF5A5E",
				        label: "Red"
				    },
				    {
				        value: 50,
				        color: "#46BFBD",
				        highlight: "#5AD3D1",
				        label: "Green"
				    },
				    {
				        value: 100,
				        color: "#FDB45C",
				        highlight: "#FFC870",
				        label: "Yellow"
				    },
				    {
				        value: 40,
				        color: "#949FB1",
				        highlight: "#A8B3C5",
				        label: "Grey"
				    },
				    {
				        value: 120,
				        color: "#4D5360",
				        highlight: "#616774",
				        label: "Dark Grey"
				    }
                ];
                var ctx = body.fc().getContext("2d");
                var pie = new Chart(ctx).Pie(pieData);
                break;
            case 'huoyue':

                break;
        }
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