$.NameSpace('$View.projectyh');
$View.projectyh.PM = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB };
    var coms = {}, _paging, eBody, pmInfo, curr, popTips, eLiAry = [];
    var _html = '<div class="title"><div class="_title">施工编号：{0}</div><div class="_info"><span style="margin-right:15px;">状态：{1}</span><span style="margin-right:15px;">类型：{2}</span><span>地址：{3}</span></div></div></div>';
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'rootTips': { head_h: 30, icon: 'fa fa-briefcase', title: '施工项目管理', gbsID: 112, toolBarSkin: 'Button-default', cn: 'b0', onToolBarClick: onToolBarClick },
            'rootLayout': { min: 300, max: 500, isRoot: 1, start: 400, dir: 'we', dirLock: 1 },
            'userTips': { head_h: 0, foot_h: 30, icon: 'fa fa-list', title: '工程列表', cn: 'b0' },
            'paging': { onSelect: loadProjects, onClick: loadProjects },
            'pmInfo': { url: 'View/projectyh/PMInfo.js' }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootTips',
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eHead: {
                    type: 'Tips', name: 'userTips', foot: { type: 'Paging', name: 'paging' }
                },
                eFoot: { name: 'pmInfo', type: 'View' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        _paging = coms.paging; pmInfo = coms.pmInfo;
        eBody = coms.userTips.body.cn('Waterfall').h('<ul class="ListItem"></ul>').fc();
        loadProjects();
    }
    function loadProjects() {
        var _pIdx = _paging.get('pageIndex'), _pSize = _paging.get('pageSize');
        eBody.h('<div style="padding:20px;z-index:20;text-align:center;"><img src="images/loading/gif/loading51.gif" /></div>');
        $.Util.ajax({
            args: 'm=SYS_TABLE_BASE&action=pagingForList&table=PRO_MG&dataType=json&pageIndex=' + _pIdx + '&pageSize=' + _pSize,
            onSuccess: function (d) {
                var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length;
                if (!_dLen) { eBody.h('<div style="padding:20px;text-align:center;"><img src="images/EmptyData.gif"></div>'); } else { eBody.h(''); }
                for (var i = 0; i < _dLen; i++) {
                    var _obj = _dAry[i];
                    var _eLi = eBody.adElm('', 'li').ac('cp').attr('proId', _obj.id)
                        .h(_html.format(_obj.proCode, _obj.state, _obj.proType, _obj.address))
                        .evt('click', function (e) {
                            var e = $.e.fix(e), _e = e.t, _eLi = findLi(_e);
                            fireClick(_eLi);
                        });
                    eLiAry.push(_eLi);
                }
                _paging.setTotal(+eval(d.get(1) || '[]')[0].count);
                fireClick(0);
            }
        });
    }

    function fireClick(index) {
        var _eLi = index.tagName ? index : eLiAry[index];
        if (curr) { curr.css('border: 1px solid #E2E2E2'); }
        curr = _eLi; curr.css('border: 1px solid #DF2D3B;');
        loadProjectInfo(_eLi.attr('proId'));
    }

    function onToolBarClick(obj) {
        switch (+obj.Name) {
            case 113:
                var _fiAry = [
                    { name: 'proCode', title: '施工编号', comType: 'Input', req: true, group: { name: 'g1', width: 280 } },
                    { name: 'proType', title: '类型', comType: 'Select', group: 'g1', gtID: 456, req: true },
                    { name: 'proNature', title: '性质', comType: 'Select', group: 'g1', gtID: 468, req: true },
                    { name: 'proArea', title: '区域', comType: 'Select', group: 'g1', gtID: 469, req: true },
                    { name: 'address', title: '地址', comType: 'Input', group: 'g1', req: true },
                    { name: 'customer', title: '客户名', comType: 'Input', group: 'g1' },
                    { name: 'contact', title: '联系方式', comType: 'Input', group: 'g1' },
                    { name: 'proSource', title: '来源', comType: 'Select', group: 'g1', gtID: 470, req: true },
                    { name: 'acreage', title: '配套面积', comType: 'KeyInput', dataType: 'double', group: 'g1' },
                    { name: 'outPutValue', title: '估计产值', comType: 'KeyInput', dataType: 'double', group: { name: 'g2', width: 280 }, req: true },
                    { name: 'collectTime', title: '收单日', comType: 'Date', group: 'g2' },
                    { name: 'issuedTime', title: '下单日', comType: 'EndDate', matchItem: 'collectTime', group: 'g2' },
                    { name: 'execDept', title: '施工部门', dataType: 'int', comType: 'Select', ifTrans: true, gtID: 472, req: true, group: 'g2', onChange: function (obj) { obj.Form.setHidden('dept', obj.Value); } },
                    { name: 'deadline', title: '施工期限', comType: 'Date', group: { name: 'g3', width: 280 } },
                    { name: 'qingZhao', title: '请照情况', comType: 'Select', group: 'g3', gtID: 7 },
                    { name: 'handleTime', title: '办理日', comType: 'Date', req: true, visibled: false, group: 'g3' },
                    { name: 'allowTime', title: '许可日', comType: 'Date', req: true, visibled: false, group: 'g3' },
                    { name: 'payCost', title: '支付费用', comType: 'KeyInput', dataType: 'double', visibled: false, group: 'g3' },
                    { name: 'note', title: '备注', comType: 'TextArea', group: 'g3' }
                ];
                if (popTips) { popTips.remove(); popTips = null; }
                popTips = new $.UI.Tips({ head_h: 30, icon: 'icon-glyph-plus-sign', title: '新建工程', comMode: 'x-auto', y: 120, ifMask: true, ifClose: true, width: 640, ifFixedHeight: false });
                (new $.UI.Form({ p: popTips.body, state: 'Insert', insertApi: 'm=SYS_CM_PRO&action=addProject', items: _fiAry, ifFixedHeight: false, onSubmitSuccess: function () { popTips.remove(); popTips = null; } })).focus();
                break;
            case 114:
                if (!curr) { MTips.show('请先选择要存档的工程', 'warn'); return; }
                MConfirm.setWidth(250).show('确定存档工程?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_TABLE_TREE&table=PRO_MG&action=deleteByIDs&ids=' + curr.attr('proId'),
                        onSuccess: function () { MTips.show('删除成功', 'ok'); loadProjects(); }
                    })
                });
                break;
        }
    }

    function loadProjectInfo(proId) {
        pmInfo.load(proId);
    }

    function findLi(_e) { if (_e.tagName == 'LI') { return _e; } else { return findLi(_e.pn()); } }

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