$.NameSpace('$View.workflow');
$View.workflow.WorkFlowInfo = function (j) {
    var me = this, _fn = function () { };
    var owner, coms = {};
    var args = {
        p: $DB,
        instanceId: -1,
        ifEdit: true,
        tid: '',
        ifAttach: false,
        ifEdit: true,
        ifFixedHeight: true,
        onNextSuccess: _fn,
        onLoadComplete: _fn,
        onCompleteBefore: _fn,
        onComplete: _fn,
        onRights: _fn,
        onConfirmBefore: _fn,
        onNextClick: _fn,
        onRoleChange: _fn,
        onUserChange: _fn
    };
    var rootTips, eDetail, currID, selNextID, currForm, instanceID, _fiNote, popInfo, currType, ifRuning = false, _ifOver = false, hasRight = false, toolBar, infoObj;
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p;
        var comArgs = { 'root': { ifFixedHeight: args.ifFixedHeight, icon: 'fa fa-random', toolBarSkin: 'Button-default', head_h: 32, cn: 'b0 wp'} }
        var struct = { p: owner, type: 'Tips', name: 'root' }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
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

    function initUI(id) {
        $.Util.ajax({
            args: { m: 'SYS_CM_WF', action: 'getWFCurrDetail', keyFields: 'id, nodeName, state, dbo.SYS_TRANS_USER(cPerson) as t_cPerson, dbo.SYS_TRANS_USER(mPerson) as t_mPerson, dbo.SYS_TRANS_USERS(owner) as t_owner, treeOrder, type, note, sons, dbo.SYS_FORMAT_TIME(cTime) as cTime', dataType: 'json', instanceId: id },
            onSuccess: function (d) {
                var _sAry = d.get(0), _currNode;
                if (_sAry) {
                    var _objAry = eval(_sAry), _aLen = _objAry.length, _eWalker;
                    if (args.ifAttach) {
                        me.attach = new $.UI.FormItem({
                            p: me.addPanel({ title: '文件附件' }),
                            comType: 'FileUploader',
                            catlog: 'workflow',
                            onComplete: onUploadFilesComplete
                        }).setData(infoObj.link, infoObj.link);
                    }
                    var _eTu = me.addPanel({ title: '流程历史状态' }).h('<div class="node-detail-step"></div><ul class="node-detail-list"></ul>'),
                        _eChart = _eTu.fc(),
                        _eNote = _eChart.ns();
                    for (var i = 0; i < _aLen; i++) {
                        var _obj = _objAry[i], _type = +_obj.type, _title = _obj.nodeName; _currNode = _obj;
                        if (_type == 11) { _ifOver = true; } else { _ifOver = false; }
                        if (i == _aLen - 1) { _type = _type + ' curr'; }
                        _eChart.adElm('', 'div').cn('node-type type-' + _type).h(_title);
                        if (i < _aLen - 1) { addDetailItem(_eNote, _obj); }
                        if (+_obj.state) {
                            $.Util.ajax({
                                args: {
                                    m: 'SYS_CM_WF',
                                    action: 'getWFCurrDetail',
                                    keyFields: 'id, nodeName, state, dbo.SYS_TRANS_USER(nodeName) as tPerson, dbo.SYS_TRANS_USER(mPerson) as mPerson, dbo.SYS_TRANS_ROLE_USER(nodeName) as tPersonRole, note, dbo.SYS_FORMAT_TIME(mTime) as mTime',
                                    dataType: 'json',
                                    instanceId: _obj.id
                                },
                                onSuccess: function (data) {
                                    var _sUsers = data.get(0), _uAry = [];
                                    if (_sUsers) { _uAry = eval(_sUsers); }
                                    var _uLen = _uAry.length, _uObj, _sText = '并行列表', _ifPerson = false;
                                    if (_uLen) {
                                        if (_type == 20) { _sText = '子流程状态'; }
                                        _eWalker = (new $.UI.Panel({ p: eDetail, title: _sText })).eContent;
                                        for (var _i = 0; _i < _uLen; _i++) {
                                            _uObj = _uAry[_i];
                                            if (_type == 20) { addP_Process(_eWalker, _uObj); } else { addP_Person(_eWalker, _uObj); _ifPerson = true; }
                                        }
                                        if (_ifPerson && toolBar && hasRight) {
                                            toolBar.addItem({
                                                name: 'deny',
                                                skin: 'Button-danger',
                                                icon: 'fa-microphone-slash',
                                                text: '拒绝',
                                                align: 'right',
                                                cn: 'mr10'
                                            });
                                        }
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
        var _title = '<span class="title">' + obj.nodeName + '</span><span class="person">' + obj.t_mPerson + '</span><span class="time">' + obj.cTime + '</span>';
        if (+obj.sons) {
            var _eTitle = p.adElm('', 'li').cn('node-type-' + obj.type).css('border-left:3px solid #BF0000;').h('<div class="head"><a class="fa fa-angle-right"></a>' + _title + '</div><div class="content"></div>').fc(),
                _eContent = _eTitle.ns().hide(), _tid = obj.id;
            _eTitle.fc().evt('click', function (e) {
                var e = $.e.fix(e), _e = e.t;
                if (_e.className.trim() == 'fa fa-angle-right') {
                    _e.cn('fa fa-angle-down'); _eContent.show();
                    if (!_eContent.h()) {
                        $.Util.ajax({
                            args: 'm=SYS_TABLE_TREE&action=getNodesByPid&table=SYS_WF_INSTANCE&dataType=json&pid=' + _tid + '&keyFields=id, nodeName, state, dbo.SYS_TRANS_USER(nodeName) as tPerson, dbo.SYS_TRANS_USER(mPerson) as mPerson, dbo.SYS_TRANS_ROLE_USER(nodeName) as tPersonRole, note, dbo.SYS_FORMAT_TIME(mTime) as mTime',
                            onSuccess: function (obj) {
                                var _fAry = eval(obj.get(0) || '[]'), _fLen = _fAry.length;
                                for (var i = 0; i < _fLen; i++) {
                                    addP_Person(_eContent, _fAry[i]);
                                }
                            }
                        });
                    }
                } else {
                    _e.cn('fa fa-angle-right'); _eContent.hide();
                }
            });
        } else {
            p.adElm('', 'li').cn('node-type-' + obj.type).h('<div class="head">'+_title+'</div><div class="content">'+obj.note+'</div>');
        }
    }

    function addP_Person(p, obj) {
        var _daiLi = '', _role = '';
        if (obj.mPerson && obj.mPerson != obj.tPerson) {
            _daiLi = '<span class="proxy">代理人：' + obj.mPerson + '</span>';
        }
        if (obj.tPersonRole) {
            _role = '<span class="person" style="">' + obj.tPersonRole + '：</span>';
        }
        var _title = '<div class="title">'+_role+'<span class="person">' + obj.tPerson + '</span>' + _daiLi + '<span class="time">' + obj.mTime + '</span></div>';
        p.adElm('', 'div').cn('bx-node state-' + obj.state).h('<a class="msg fa ' + ((obj.state != '100')?'fa-check-circle-o':'') + '"></a>' + _title + '<div class="content">' + obj.note + '</div>');
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
                var _sAry = d.get(0), _rObj = eval(d.get(1) || '[]')[0], _v = +eval(d.get(2) || '[]')[0].v;
                if(!_rObj){
                    rootTips.setTitle('<font color="red" class="fwb mr10">流程实例不存在, 请确认流程实例ID: '+args.instanceId+'</font>');
                    return false;
                }
                if (+_rObj.state == -5) {
                    var _title = '<font color="red" class="fwb mr10">流程已被创建者（' + _rObj.mPerson_trans + '）主动取消！</font>';
                    //if (+_rObj.cPerson == +$.ck.get('SESSIONID')) {
                    if (_v) {
                        _title += '<a href="#" onClick="return false;">重启</a>';
                    }
                    rootTips.setTitle(_title);
                    initUI(id);
                    return;
                }
                if (!_sAry) { return false; }
                var _dObj = eval(_sAry)[0], _btnAry = strToBtnJsonAry(_dObj['trans_next']);
                currID = _dObj.id;
                infoObj = _rObj;
                var _text = '正在进行中...', _color = '#C84823';
                if (+_dObj.type == 11) {
                    _text = '流程结束';
                    _color = '#22A66D';
                    rootTips.setIcon('fa fa-check');
                }
                rootTips.setTitle('<span style="color: '+_color+'">'+_text+'：' + _dObj.nodeName + '</span>');
                if (_btnAry.length && args.ifEdit) {
                    if (+_rObj.rvalue) {
                        _btnAry.push({ name: 'confirm', text: '确认通过', align: 'right', icon: 'fa-check-circle-o', skin: 'Button-blue', cn: 'mr10 glow' });
                        hasRight = true;
                        me.ifHasRight = true;
                        args.onRights(me, rootTips.toolBar, _dObj, _rObj);
                        var _eNext = me.addPanel({ title: '下一步' }).h('<div class="wp"></div><div class="wp"></div><div class="wp"></div>'),
                        _eBtn = _eNext.fc();
                        //if (+_rObj.cPerson == +$.ck.get('SESSIONID')) {
                        if (_v) {
                            _btnAry.push({ name: 'cancle', text: '取消或关闭', skin: 'Button-danger', icon: 'fa-toggle-off', align: 'right', cn: 'mr10' });
                        }
                        toolBar = new $.UI.ButtonSet({ p: _eBtn, items: _btnAry, onClick: function (obj) { onNextClick(obj, _eBtn.ns()); } });
                        toolBar.fireClick(0);
                        if (!_ifOver) { _fiNote = new $.UI.FormItem({ p: $(_eNext.lastChild), comType: 'TextArea', title: '备注' }); }
                    } else {
                        me.ifHasRight = false;
                    }
                } else {
                    me.ifHasRight = false;
                }
                initUI(id);
            }
        });
    }

    function onNextClick(obj, eForm) {
        var _bName = obj.Name;
        if (args.onNextClick(obj, eForm) != undefined) { return; };
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
                                    { name: 'roles', title: '部门', comType: 'MultiSelect', loadApi: 'm=SYS_CM_WF&action=getPersonFormUserOrRole&keyFields=id,nodeName&type=role&id=' + _bName, req: true, sErr: '部门是必填字段' },
                                    { name: 'users', title: '用户', comType: 'MultiSelect', loadApi: 'm=SYS_CM_WF&action=getPersonFormUserOrRole&keyFields=id,uid&type=user&id=' + _bName }
                                ];
                                break;
                            case 2:
                                _fiAry = [
                                    { name: 'roles', title: '部门', comType: 'MultiSelect', loadApi: 'm=SYS_CM_USERS&action=getAllDepts', req: true, sErr: '部门是必填字段' },
                                    { name: 'users', title: '用户', comType: 'UserSelector' }
                                ];
                                break;
                        }
                        currForm = new $.UI.Form({ p: eForm, head_h: 0, foot_h: 0, ifFixedHeight: false, items: _fiAry });
                        currForm.evt('onChange', function (changeValue) {
                            if (changeValue.Name == 'roles') {
                                args.onRoleChange(changeValue);
                            }
                            if (changeValue.Name == 'users') {
                                args.onUserChange(changeValue);
                            }
                        });
                    }
                });
                break;
        }
    }
    function doSucc(d) {
        //rootTips.body.h('<div style="width:180px;text-align:center;margin:50px -90px;padding:5px;font-size:12px;border:1px solid #FF8E42;background: #FFFF90;position:absolute;left:50%;">确认成功!</div>');
        var _node = eval(d.get(0) || '[]')[0];
        args.onNextSuccess({ WFInfo: me, Node: _node, RID: instanceID });
        if (currType == 11 && +_node.type == 11) {
            args.onComplete({ WFInfo: me, Node: eval(d.get(0))[0], RID: instanceID });
        }
        me.setInstanceId(instanceID);
    }
    function strToBtnJsonAry(str) {
        var _ary = str.split('&@&'), _idAry = _ary[0].split(','), _txtAry = _ary[1].split(','), _typeAry = _ary[2].split(','), _len = _idAry.length, _bAry = [];
        for (var i = 0; i < _len; i++) {
            var _id = _idAry[i];
            if (_id) {
                _bAry.push({ name: _id, text: _txtAry[i], type: 'tab', nodeType: _typeAry[i] });
            }
        }
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