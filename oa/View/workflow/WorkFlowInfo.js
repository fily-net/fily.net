$.namespace('$View.workflow');
$View.workflow.WorkFlowInfo = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, instanceId: -1, ifEdit: true, tid: '', ifAttach: false, ifEdit: true, ifFixedHeight: true, onNextSuccess: _fn, onLoadComplete: _fn, onCompleteBefore: _fn, onComplete: _fn, onRights: _fn, onConfirmBefore: _fn };
    var rootTips, eDetail, currID, selNextID, currForm, instanceID, _fiNote, popInfo, currType, ifRuning = false, _ifOver = false, hasRight = false, toolBar, infoObj;
    function _default() { }
    function _layout() {
        owner = args.p;
        var comArgs = { 'root': { ifFixedHeight: args.ifFixedHeight, icon: 'icon-compact-struct', head_h: 38, cn: 'b0 wp'} }
        var struct = { p: owner, type: 'Tips', name: 'root' }
        coms = $.layout({ args: comArgs, struct: struct });
        rootTips = coms['root']; eDetail = rootTips.body;
        rootTips.head.evt('click', function (e) {
            var e = $.e.fix(e), _e = e.t;
            if (_e.tagName == 'A' && _e.attr('onclick')) {
                MConfirm.setWidth(250).show('确认重启该流程?').evt('onOk', function () {
                    $.Util.ajax({ args: { m: 'SYS_CM_WF', action: 'reStart', wfId: instanceID }, onSuccess: function (obj) { me.setInstanceId(instanceID); } });
                });
            }
            e.stop();
        });
        me.setInstanceId(args.instanceId);
    }
    function _event() { }
    function _override() { }
    function initUI(id) {
        $.Util.ajax({
            args: { m: 'SYS_CM_WF', action: 'getWFCurrDetail', keyFields: 'id, nodeName, state, dbo.SYS_TRANS_USER(cPerson) as t_cPerson, dbo.SYS_TRANS_USER(mPerson) as t_mPerson, dbo.SYS_TRANS_USERS(owner) as t_owner, treeOrder, type, note, sons, cTime', dataType: 'json', instanceId: id },
            onSuccess: function (d) {
                var _sAry = d.get(0), _currNode;
                if (_sAry) {
                    var _objAry = eval(_sAry), _aLen = _objAry.length, _eWalker;
                    var _eTu = me.addPanel({ title: '流程历史图' }).h('<div class="step"></div><ul class="ListItem"></ul>'), _eChart = _eTu.fc(), _eNote = _eChart.ns();
                    if (args.ifAttach) { new $.UI.FormItem({ p: me.addPanel({ title: '文件附件' }), comType: 'FileUploader', catlog: 'workflow', onComplete: onUploadFilesComplete }).setData(infoObj.link, infoObj.link); }
                    for (var i = 0; i < _aLen; i++) {
                        var _obj = _objAry[i], _type = +_obj.type, _title = _obj.nodeName; _currNode = _obj;
                        if (_type == 11) { _ifOver = true; } else { _ifOver = false; }
                        _eChart.adElm('', 'div').cn('node-type type-' + _type).h(_title);
                        if (i < _aLen - 1) { addDetailItem(_eNote, _obj); }
                        if (+_obj.state) {
                            $.Util.ajax({
                                args: { m: 'SYS_CM_WF', action: 'getWFCurrDetail', keyFields: 'id, nodeName, state, dbo.SYS_TRANS_USER(nodeName) as tPerson, dbo.SYS_TRANS_USER(mPerson) as mPerson, note, mTime', dataType: 'json', instanceId: _obj.id },
                                onSuccess: function (data) {
                                    var _sUsers = data.get(0), _uAry = [];
                                    if (_sUsers) { _uAry = eval(_sUsers); }
                                    var _uLen = _uAry.length, _uObj, _sText = '并行者列表', _ifPerson = false;
                                    if (_uLen) {
                                        if (_type == 20) { _sText = '子流程状态'; }
                                        _eWalker = (new $.UI.Panel({ p: eDetail, title: _sText })).eContent;
                                        for (var _i = 0; _i < _uLen; _i++) {
                                            _uObj = _uAry[_i];
                                            if (_type == 20) { addP_Process(_eWalker, _uObj); } else { addP_Person(_eWalker, _uObj); _ifPerson = true; }
                                        }
                                        if (_ifPerson && toolBar && hasRight) { toolBar.addItem({ name: 'deny', text: '拒绝', align: 'right', cn: 'mr10', skin: 'Button-danger' }); }
                                    }
                                }
                            });
                        }
                    }
                }
                ifRuning = false;
                args.onLoadComplete({ WorkFlowInfo: me, currNode: _currNode, Tips: rootTips });
            }
        });
    }

    function onUploadFilesComplete(obj) {
        $.Util.ajax({
            args: 'm=SYS_CM_WF&action=updateWFFiles&files=' + obj.Objs.currIds.join(',') + '&wfId=' + instanceID,
            onSuccess: function () { }
        });
    }

    function addDetailItem(p, obj) {
        if (+obj.sons) {
            var _htmlTemp = '<div class="title"><a class="icon-compact-line-r"></a><span class="_title">' + obj.nodeName + '</span><div class="_info fr" style="width:auto;"><span>' + obj.cTime + '(' + obj.t_mPerson + ')</span></div></div><div class="content"></div>';
            var _eTitle = p.adElm('', 'li').css('border-left:3px solid #BF0000;').h(_htmlTemp).fc(), _eContent = _eTitle.ns().hide(), _tid = obj.id;
            _eTitle.fc().evt('click', function (e) {
                var e = $.e.fix(e), _e = e.t;
                if (_e.className.trim() == 'icon-compact-line-r') {
                    _e.cn('icon-compact-line-b'); _eContent.show();
                    if (!_eContent.h()) {
                        $.Util.ajax({
                            args: 'm=SYS_TABLE_TREE&action=getNodesByPid&table=SYS_WF_INSTANCE&dataType=json&pid=' + _tid + '&keyFields=id, nodeName, state, dbo.SYS_TRANS_USER(nodeName) as tPerson, dbo.SYS_TRANS_USER(mPerson) as mPerson, note, mTime',
                            onSuccess: function (obj) {
                                var _fAry = eval(obj.get(0) || '[]'), _fLen = _fAry.length;
                                for (var i = 0; i < _fLen; i++) { addP_Person(_eContent, _fAry[i]); }
                            }
                        });
                    }
                } else {
                    _e.cn('icon-compact-line-r'); _eContent.hide();
                }
            });
        } else {
            var _htmlTemp = '<div class="title"><span class="_title">' + obj.nodeName + ': </span><span style="line-height: 20px;font-size: 12px;">' + obj.note + '</span><div class="_info fr" style="width:auto;"><span>' + obj.cTime + '(' + obj.t_mPerson + ')</span></div></div>';
            p.adElm('', 'li').h(_htmlTemp);
        }
    }

    function addP_Person(p, obj) {
        var _sColor = '#FF7600', _cText = '';
        if (obj.state == '101') { _sColor = '#008e18'; }
        if (obj.state == '201') { _sColor = '#E53E38'; }
        if (obj.mPerson && obj.mPerson != obj.tPerson) { _cText = '代理确认人：' + obj.mPerson + '------'; }
        p.adElm('', 'div').cn('p5 m5').css('color:#fff;background-color:' + _sColor + ';').h(obj.tPerson + ':' + obj.note + '<span class="dib fr">' + _cText + obj.mTime + '</span>');
    }

    function addP_Process(p, obj) {
        var _sColor = '#ff7800';
        if (obj.state == '-1') { _sColor = '#008e18'; }
        p.adElm('', 'div').cn('p5 m5 cp').css('color:#fff;background-color:' + _sColor + ';').h(obj.tPerson)
        .evt('click', function (e) {
            popInfo = new $.UI.Tips({ width: 600, height: 400, comMode: 'auto', head_h: 30, title: obj.nodeName, ifClose: true, ifMask: true });
            new $View.workflow.WorkFlowInfo({ p: popInfo.body });
        });
    }

    function initInfo(id) {
        $.Util.ajax({
            args: { m: 'SYS_CM_WF', action: 'getWFCurrState', dataType: 'json', instanceId: id },
            onSuccess: function (d) {
                var _sAry = d.get(0), _rObj = eval(d.get(1) || '[]')[0];
                if (+_rObj.state == -5) {
                    var _title = '<font color="red" class="fwb mr10">流程已创建者被取消</font>';
                    if (+_rObj.cPerson == +$.ck.get('SESSIONID')) { _title += '<a href="#" onClick="return false;">重启</a>'; }
                    rootTips.setTitle(_title);
                    initUI(id);
                    return;
                }
                if (!_sAry) { return false; }
                var _dObj = eval(_sAry)[0], _btnAry = strToBtnJsonAry(_dObj['trans_next']);
                currID = _dObj.id; infoObj = _rObj;
                rootTips.setTitle('当前状态：<font color="red">' + _dObj.nodeName + '</font>');
                if (_btnAry.length && args.ifEdit) {
                    var _eNext = me.addPanel({ title: '下一步' }).h('<div class="wp"></div><div class="wp"></div><div class="wp"></div>'), _eBtn = _eNext.fc();
                    if (+_rObj.cPerson == +$.ck.get('SESSIONID')) { _btnAry.push({ name: 'cancle', text: '取消或关闭', align: 'right', cn: 'mr10' }); }
                    if (+_rObj.rvalue) { _btnAry.push({ name: 'confirm', text: '确认通过', align: 'right', cn: 'mr10 glow' }); hasRight = true; args.onRights(me, rootTips.toolBar, _dObj, _rObj); }
                    toolBar = new $.UI.ButtonGroup({ p: _eBtn, items: _btnAry, onClick: function (obj) { onNextClick(obj, _eBtn.ns()); } });
                    toolBar.fireClick(0);
                    if (!_ifOver) { _fiNote = new $.UI.FormItem({ p: $(_eNext.lastChild), comType: 'TextArea', title: '备注' }); }
                }
                initUI(id);
            }
        });
    }

    function onNextClick(obj, eForm) {
        var _bName = obj.Name;
        switch (_bName) {
            case 'cancle':
                MConfirm.setWidth(250).show('确认取消?').evt('onOk', function () {
                    $.Util.ajax({ args: { m: 'SYS_CM_WF', action: 'cancle', wfId: instanceID }, onSuccess: function () { me.setInstanceId(instanceID); } });
                });
                break;
            case 'deny':
                var _sNote = _fiNote.getValue();
                if (_sNote.trim() == '') { MTips.show('请填写拒绝理由', 'warn'); _fiNote.focus(); return; }
                MConfirm.setWidth(250).show('确定拒绝?').evt('onOk', function () {
                    if (currType == 11) { if (args.onCompleteBefore(me) == false) { return; } }
                    var _args = { m: 'SYS_CM_WF', action: 'deny', currId: currID, nextId: selNextID }, _json = {};
                    if (currForm) {
                        var _data = currForm.check(true);
                        if (_data[0] != false) { _json = _data[1].IValue; } else { return; }
                    }
                    _json.note = _sNote;
                    _args.json = $.JSON.encode(_json);
                    $.Util.ajax({ args: _args, onSuccess: doSucc });
                });
                break;
            case 'confirm':
                if (args.onConfirmBefore(obj, eForm) != undefined) { return; };
                if (!selNextID) { MTips.show('请先选择下一步要扭转的状态', 'warn'); return; }
                MConfirm.setWidth(250).show('确定确认通过?').evt('onOk', function () {
                    if (currType == 11) { if (args.onCompleteBefore(me) == false) { return; } }
                    var _val = '';
                    if (_fiNote) { _val = _fiNote.getValue(); }
                    var _args = { m: 'SYS_CM_WF', action: 'next', currId: currID, nextId: selNextID }, _json = {};
                    if (currForm) {
                        var _data = currForm.check(true);
                        if (_data[0] != false) { _json = _data[1].IValue; } else { return; }
                    }
                    _json.note = _val;
                    _args.json = $.JSON.encode(_json);
                    $.Util.ajax({ args: _args, onSuccess: doSucc });
                });
                break;
            default:
                currType = +obj.Button.get('nodeType');
                $.Util.ajax({
                    args: { m: 'SYS_CM_WF', action: 'getDefinitionNodeInfoById', keyFields: 'logicState', id: _bName },
                    onSuccess: function (d) {
                        var _ls = +d.get(0), _fiAry = [];
                        eForm.h(''); currForm = null; selNextID = _bName;
                        if (_ls != 1 && _ls != 2) { return; }
                        switch (_ls) {
                            case 1:
                                _fiAry = [
                                    { name: 'users', title: '用户', comType: 'MultiSelect', loadApi: 'm=SYS_CM_WF&action=getPersonFormUserOrRole&keyFields=id,uid&type=user&id=' + _bName },
                                    { name: 'roles', title: '部门', comType: 'MultiSelect', loadApi: 'm=SYS_CM_WF&action=getPersonFormUserOrRole&keyFields=id,nodeName&type=role&id=' + _bName }
                                ];
                                break;
                            case 2:
                                _fiAry = [
                                    { name: 'users', title: '用户', comType: 'UserSelector' },
                                    { name: 'roles', title: '部门', comType: 'MultiSelect', loadApi: 'm=SYS_CM_USERS&action=getAllDepts' }
                                ];
                                break;
                        }
                        currForm = new $.UI.Form({ p: eForm, head_h: 0, foot_h: 0, ifFixedHeight: false, items: _fiAry });
                    }
                });
                break;
        }
    }
    function doSucc(d) {
        //rootTips.body.h('<div style="width:180px;text-align:center;margin:50px -90px;padding:5px;font-size:12px;border:1px solid #FF8E42;background: #FFFF90;position:absolute;left:50%;">确认成功!</div>');
        me.setInstanceId(instanceID);
        args.onNextSuccess({ WFInfo: me, Node: eval(d.get(0) || '[]')[0], RID: instanceID });
        if (currType == 11) { args.onComplete({ WFInfo: me, Node: eval(d.get(0))[0], RID: instanceID }); }
    }
    function strToBtnJsonAry(str) {
        var _ary = str.split('&@&'), _idAry = _ary[0].split(','), _txtAry = _ary[1].split(','), _typeAry = _ary[2].split(','), _len = _idAry.length, _bAry = [];
        for (var i = 0; i < _len; i++) { var _id = _idAry[i]; if (_id) { _bAry.push({ name: _id, text: _txtAry[i], type: 'tab', nodeType: _typeAry[i] }); } }
        return _bAry;
    }
    me.addPanel = function (j) { return (new $.UI.Panel({ p: eDetail, title: j.title || '' })).eContent.cn('wfdetail'); }
    me.setInstanceId = function (id) {
        if (ifRuning) { return; }
        ifRuning = true; eDetail.h(''); currForm = null; selNextID = null; hasRight = false; rootTips.toolBar.clear();
        if (id == -1) { rootTips.setTitle(''); ifRuning = false; return; }
        instanceID = id; initInfo(id);
    }
    me.setTitle = function (title) { rootTips.setTitle(title); return me; }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}