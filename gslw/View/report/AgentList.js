$.NameSpace('$View.crm');
$View.crm.AgentList = function (j) {
    var me = this, _fn = function () { };
    var owner;
    var args = { p: $DB }, popTips, formitems;
    var coms = {}, mainList, currID, ifSign;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var hAry = [
            { name: 'ifSign', type: 'attr' },
            { title: '签约', name: 'ifSign', type: 'none', width: 30, ifTrans: true, ifFilter: true, filterItems: ['equal'] },
            { title: '省', name: 'lev1', type: 'none', ifEnabledTips: true, width: 120, ifFilter: true, filterItems: ['like'] },
            { title: '市', name: 'lev2', type: 'none', ifEnabledTips: true, width: 120, ifFilter: true, filterItems: ['like'] },
            { title: '行业', name: 'type', type: 'none', width: 60, ifFilter: true, filterItems: ['like'] },
            { title: '商户', name: 'shNum', type: 'none', width: 60 },
            { title: '节点总数', name: 'nodeNum', type: 'none', width: 60 },
            /*{ title: '硬件总金额', name: 'hardwareTotal', type: 'none', width: 80 },*/
            { title: '硬件年收益', name: 'hardwareProfit', type: 'none', width: 100 },
            { title: '资费年收益', mtips: '代理商资费年收益<font class=\'fwb c_6\'>=</font>商家数<font class=\'fwb c_6\'>x</font>平均节点数<font class=\'fwb c_6\'>x</font>资费<font class=\'fwb c_6\'>x</font>定位比例<font class=\'fwb c_6\'>x</font>365<font class=\'fwb c_6\'>x</font>40%', name: 'softwareProfit', type: 'none', width: 100 },
            { title: '年总收益', name: 'agentTotal', type: 'none', width: 100 },
            { title: '年代理费', name: 'agentPayment', type: 'none', width: 100 }
        ];
        var fAry = [
            { title: '省', name: 'lev1', comType: 'Input', opt: 'like', dataType: 'string', ifEnterSubmit: true },
            { title: '市', name: 'lev2', comType: 'Input', opt: 'like', dataType: 'string', ifEnterSubmit: true },
            { text: '搜索查询', icon: 'icon-glyph-search', type: 'normal', skin: 'Button-default', width: 72, css: 'margin-top:0px;padding:2px 3px;', comType: 'Button', name: 'search', onClick: onSearch }
        ];
        var comArgs = {
            'rootDiv': { head_h: 76, title: '代理商数据查询&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="wwtppt/storyload.html">物态网渠道版</a>', cn: 'b0', toolBarSkin: 'mr10 Button-default', gbsID: 40, onToolBarClick: onToolClick },
            'mainList': { aHeader: hAry, loadApi: 'm=SYS_TABLE_BASE&action=pagingForList&table=CRM_Agent_query', colControls: { header: {}, paging: { pageSize: 10, pageIndex: 1} }, onTDClick: onListClick }
        }
        var struct = {
            p: owner,
            type: 'Tips',
            name: 'rootDiv',
            body: { type: 'List', name: 'mainList' }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        var eForm = coms.rootDiv.head.adElm('', 'div').css('position: absolute;top:35px;padding:3px;width:100%;height:35px;background-color:#fff;border-top: 1px solid #F3EAEA;');
        var searchForm = new $.UI.Form({ p: eForm, ifFixedHeight: false, foot_h: 0, items: fAry, onEnterSubmit: onFormEnterSubmit, onSubmit: function () { return false; } });
        formitems = searchForm.aItem;
        mainList = coms.mainList;
    }
    function onFormEnterSubmit(obj) { onSearch(obj); }
    function onSearch(obj) {
        var _fAry = [];
        for (var i = 0, _len = formitems.length; i < _len; i++) {
            var _fi = formitems[i], _val = _fi.getValue();
            if (_val) {
                _fAry.push($.JSON.encode({ col: _fi.get('name'), value: _val, opt: _fi.get('opt'), dataType: _fi.get('dataType') }));
            }
        }
        mainList.getAttr('loadArgsObj').filterCondition = _fAry.join('\u0001');
        mainList.loadAjax({ args: mainList.getAttr('loadArgsObj') });
    }
    function onListClick(obj) { currID = obj.Target.getAttr('rowid'); ifSign = obj.Target.getAttr('ifSign'); }
    function onToolClick(obj) {
        if (obj.Name == 'toUL') { new $.UI.View({ p: args.p, url: 'View/crm/Index.js' }); return; }
        switch (+obj.Name) {
            case 41:
                //删除项目
                if (!currID) { MTips.show('请先选择要操作的行', 'warn'); return; }
                MConfirm.setWidth(250).show('确定修改签约状态?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_CM_CRM&action=changeIfSign&id=' + currID + '&ifSign=' + ifSign,
                        onSuccess: function () { MTips.show('修改成功', 'ok'); mainList.refresh(null, true, true); }
                    })
                });
                break;
            case 42:
                //保存为Excel
                mainList.saveAsExecl('代理商数据查询');
                break;
            case 43:
                //打印
                (new $.Util.printer(mainList.get('p'))).print();
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