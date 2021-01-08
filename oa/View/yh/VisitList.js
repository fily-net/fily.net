$.namespace('$View.yh');
$View.yh.VisitList = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB };
    var mainList, sForm;
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var hAry = [
            { title: '编号', name: 'code', type: 'none', width: 120 },
            { title: '修理类别', name: 'type', type: 'none', width: 120, ifTrans: true },
            { title: '修理部门', name: 'repairDept', type: 'none', ifTrans: true, width: 120, ifTrans: true },
            { title: '修理地点', name: 'address', type: 'none', width: 150 },
            { title: '修复日期', name: 'repairTime', type: 'date', width: 130 },
            { title: '回访情况', name: 'huiFang', ifTrans: true, type: 'none', width: 80, ifTrans: true },
            { title: '备注', name: 'note', type: 'none', width: 200 }
        ];
        var fAry = [
            { title: '开始时间', name: 'begin', comType: 'Date', req: true },
            { title: '结束时间', name: 'end', comType: 'EndDate', matchItem: 'begin', req: true },
            { title: '修理类别', name: 'type', comType: 'Select', gtID: 352, req: true },
            { title: '修理部门', name: 'repairDept', comType: 'Select', gtID: 356, req: true },
            { title: '回访情况', name: 'huiFang', comType: 'Select', gtID: 285, req: true }
        ];
        var comArgs = {
            'rootDiv': { head_h: 35, title: '养护回访情况统计表', cn: 'b0', toolBarSkin: 'mr10 Button-default', toolBarAry: [{ name: 'print', text: '打印', cn: 'mr10', icon: 'icon-glyph-print' }, { name: 'search', text: '搜索', cn: 'mr10', icon: 'icon-glyph-search'}], onToolBarClick: onToolClick },
            'layout': { min: 250, max: 500, isRoot: 1, start: 300, dir: 'we', barWidth: 3, dirLock: 1 },
            'form': { foot_h: 0, ifFixedHeight: false, items: fAry },
            'mainList': { aHeader: hAry, colControls: { header: {}, paging: { pageSize: 10, pageIndex: 1}} }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootDiv',
            body: {
                type: 'Layout', name: 'layout',
                eHead: { name: 'form', type: 'Form' },
                eFoot: { type: 'List', name: 'mainList' }
            }
        }
        coms = $.layout({ args: comArgs, struct: struct });
        mainList = coms.mainList; sForm = coms.form;
    }
    function _event() { }
    function _override() { }
    function onToolClick(obj) {
        switch (obj.Name) {
            case 'search':
                var _result = sForm.check(true);
                if (_result[0] != false) {
                    var _data = _result[1].IValue, _url = 'm=SYS_TABLE_BASE&action=queryReport&table=', _jc = {};
                    if (+_data['type'] == 354) { _url += 'YH_REPAIR_LEAKAGE'; } else { _url += 'YH_BASE_STATION'; }
                    for (var k in _data) {
                        if (k == 'begin' || k == 'end') {
                            _url += '&' + k + '=' + _data[k];
                        } else {
                            _jc[k] = _data[k];
                        }
                    }
                    _url += '&jsonCondition=' + $.JSON.encode(_jc);
                    mainList.setAttr('ifAjax', false).loadAjax({ args: _url });
                }
                break;
            case 'saveAsExcel':
                //保存为Excel
                mainList.saveAsExecl('养护回访情况统计表');
                break;
            case 'print':
                //打印
                (new $.Util.printer(mainList.get('p'))).print();
                break;
        }
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}