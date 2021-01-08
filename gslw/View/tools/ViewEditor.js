$.NameSpace('$View.tools');
$View.tools.ViewEditor = function (j) {
    var me = this, _fn = function () { };
    var owner, coms = {}, nCom = new $.nCount();
    var args = { p: $DB, id: 0 };
    var comSet = {}, argsSet = {}, flowChart, infoF, extF, rootID;
    var currX = 50, currY = 50, currNodeId, runTips, newBtn;
    var fcAry = [
        { name: 'type', title: '组件类型', comType: 'Select', gtID: 16 },
        { name: 'name', title: '变量名', comType: 'Input' }
    ];
    var toolAry = [
        { name: 'newRoot', text: '新建根节点', icon: 'icon-glyph-plus-sign' },
        { name: 'toJSON', text: 'toJSON', icon: 'icon-compact-attr-list' },
        { name: 'rePaint', text: '重画', icon: 'icon-glyph-repeat' },
        { name: 'save', text: '保存(Save)', icon: 'icon-compact-save' },
        { name: 'debug', text: '调式(Debug)', icon: 'icon-compact-play' },
        { name: 'toJSFile', text: '生成js文件', icon: 'icon-glyph-file' }
    ];
    function setDefault(j) { args = $.Util.initArgs(j, args); }
    function layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var comArgs = {
            'root': { head_h: 30, foot_h: 0 },
            'toolBar': { items: toolAry, onClick: onToolBarClick },
            'rootLayout': { min: 200, max: 500, isRoot: false, start: 320, dir: 'we', dirLock: 2 },
            'flowChart': { onPointClick: onFCPointClick, onLinkEnd: onFCLinkEnd, onPressDrag: onFCPressDrag },
            'infoForm': { head_h: 22, ifFocus: false, foot_h: 0, ifFixedHeight: false, title: '基本属性', icon: 'icon-glyph-list', items: fcAry, onChange: onInfoChange },
            'extForm': { head_h: 22, ifFocus: false, foot_h: 0, ifFixedHeight: false, title: '组件属性', icon: 'icon-glyph-align-justify', css: 'border-top:1px solid #EEEEEE;', onChange: onExtChange }
        }
        var struct = {
            p: owner,
            type: 'BaseDiv',
            name: 'root',
            head: { type: 'ButtonSet', name: 'toolBar' },
            body: {
                type: 'Layout',
                name: 'rootLayout',
                eFoot: [{ type: 'Form', name: 'infoForm' }, { type: 'Form', name: 'extForm'}],
                eHead: { type: 'FlowChart', name: 'flowChart' }
            }
        }
        coms = $.Util.initUI({ args: comArgs, struct: struct });
        flowChart = coms.flowChart; infoF = coms.infoForm; extF = coms.extForm;
        newBtn = coms.toolBar.items['newRoot'];
    }

    function onInfoChange(obj) {
        var _name = obj.Name, _text = obj.Text;
        if (currNodeId == null) { MTips.show('请选择节点', 'warn'); return; }
        if (obj.Name == 'type') {
            if (_text == '请选择类型') { coms['extForm'].reLoadItems([]); return; }
            var _sHelp = $.UI[_text].help();
            if (!_sHelp) { MTips.show('组件$.UI.' + _text + '中没有帮助信息, 请先完善帮助信息!', 'warn'); return; }
            var _hObj = $(_sHelp), _cArgs = _hObj.args, _fiAry = [];
            for (var i in _cArgs) {
                var _val = _cArgs[i], _vType = _val.dataType;
                if (i == 'p') { continue; }
                if (i == 'icon') { _val.comType = 'IconSelector'; }
                _val.name = i; _val.title = i;
                _val.value = _val.defVal;
                _val.comType = _val.comType || 'Input';
                switch (_vType) {
                    case 'bool':
                        _val.comType = 'Radios';
                        _val.sons = [{ value: true, text: 'True' }, { value: false, text: 'False'}];
                        break;
                    case 'int':
                        _val.regTemplate = 'integer'; _val.req = true; _val.comType = 'KeyInput';
                        break;
                    case 'array':
                        _val.comType = 'Label'; _val.ifEdit = true;
                        break;
                }
                _fiAry.push(_val);
            }
            extF.reLoadItems(_fiAry, {
                onSuccess: function () {
                    toComChilds(_text, _hObj.containerAry);
                    var _cValue = argsSet[currNodeId];
                    if (_cValue) {
                        for (var keyName in _cValue) { var _fItem = extF.items[keyName]; if (_fItem) { _fItem.setValue(_cValue[keyName]); }; };
                    } else {
                        obj.FormItem.next.setData('', '').focus();
                    }
                }
            });
        } else {
            flowChart.getNode(currNodeId).set('txt', _text);
        }
        if (comSet[currNodeId]) { comSet[currNodeId][_name] = _text; }
    }

    function toComChilds(type, cAry) {
        var _cAry = cAry, _cNode = flowChart.getNode(currNodeId), _cSet = comSet[currNodeId];
        if (_cNode.getExt('MType') == type) { return; }
        if (_cNode.next) {
            var _nAry = _cNode.next.trim().split(' ');
            for (var n = 0, _nLen = _nAry.length; n < _nLen; n++) { flowChart.deleteNode(_nAry[n]); }
        }
        _cNode.setExt('MType', type);
        var _result = extF.check(true);
        comSet[currNodeId] = { type: type, name: _cNode.id };
        argsSet[currNodeId] = _result[1].UValue;
        if (_cAry) {
            var _sx = _cNode.x + 100, _sy = _cNode.y - 100, _cId = _cNode.id;
            for (var i = 0, _iLen = _cAry.length; i < _iLen; i++) {
                var _part = _cAry[i], _nID = _cId + '_' + _part;
                _sy += 50;
                flowChart.addNode({ id: _nID, type: 'point', color: '#78B443', txt: _part, x: _sx, y: _sy, ext: { comType: 'Container'} });
                flowChart.addNode({
                    id: _cId + '#' + _nID,
                    x: _cNode.x, y: _cNode.y, x1: flowChart.getNode(_nID).x, y1: flowChart.getNode(_nID).y,
                    type: 'line', pre: _cId, next: _nID
                });
                comSet[currNodeId][_part] = null;
            }
        }
    }

    function onExtChange(obj) { argsSet[currNodeId][obj.Name] = obj.Value; }

    function onFCLinkEnd(obj) {
        var _sNode = obj.Start, _eNode = obj.End;
        var _sType = _sNode.getExt('comType');
        if (_sType == 'Com' || _sNode.next) { MTips.show('组件不能拖出组件!', 'warn'); return false; }
        if (_eNode && _eNode.getExt('comType') == _sType) { return false; }
        var _idx = 'C_' + nCom.getN();
        var _selID = obj.Start.id, mc = flowChart.addNode({ id: _idx, txt: _idx, x: obj.EX, y: obj.EY, type: 'point', color: '#0f3', ext: { comType: 'Com'} }, true);
        var lineMc = flowChart.addNode({ id: _selID + "#" + mc.id, type: 'line', x: obj.SX, y: obj.SY, x1: obj.EX, y1: obj.EY, next: mc.id, pre: _selID }, true);
        flowChart.firePointClick(_idx);
        return false;
    }

    function onFCPressDrag(obj) {
        var _tagE = obj.CurrElm;
        if (_tagE.tagName == 'CANVAS') { _tagE = _tagE.pn(); }
        var _id = _tagE.id, _MC = obj.DownMC;
        if (_id) {
            var _eType = obj.FlowChart.hashPoint[_id].getExt('comType'), _sType = obj.DownPoint.getExt('comType');
            if (_eType == _sType && _eType == 'Container') {
                _MC.lineStyle(2, "red", "round").beginPath().mTo(obj.SX, obj.SY).dTo(obj.EX, obj.EY, 10, 3).stroke().css('zIndex:100').cn('pa');
            }
        } else {
            _MC.lineStyle(2, "#060", "round").beginPath().mTo(obj.SX, obj.SY).dTo(obj.EX, obj.EY, 10, 3).stroke().css('zIndex:100').cn('pa');
        }
    }

    function onToolBarClick(obj) {
        switch (obj.Name) {
            case 'newRoot':
                rootID = 'C_' + nCom.getN();
                flowChart.addNode({ id: rootID, type: 'point', x: currX, y: currX, pre: '', next: '', txt: rootID, color: '#0f3', ext: { comType: 'Com'} });
                flowChart.firePointClick(rootID);
                newBtn.setEnabled(false);
                break;
            case 'toJSON':
                //console.log(toUIJSON());
                break;
            case 'save':
                saveJSON();
                break;
            case 'debug':
                var ja = toStruct(), _iJson = ja[0], _iArgs = ja[1];
                if (!_iJson) { return; }
                runTips = new $.UI.Tips({ p: $DB, comMode: 'auto', width: 800, height: 400, ifClose: true, head_h: 30, title: '调式中...', icon: 'icon-compact-play' });
                _iJson.p = runTips.body;
                $.Util.initUI({ args: _iArgs, struct: _iJson });
                break;
            case 'rePaint':
                flowChart.reLoad([]); newBtn.setEnabled(true);
                break;
            case 'toDefinition':
                $.Util.ajax({
                    args: { m: 'SYS_CM_WF', action: 'toWFDefinition', idxId: args.id, definitionJson: toWFString() },
                    onSuccess: function () { MTips.show('生成定义成功', 'ok'); },
                    onError: function () { MTips.show('生成定义失败', 'error'); }
                });
                break;
            case 'reToDefinition':
                $.Util.ajax({
                    args: { m: 'SYS_CM_WF', action: 'reToWFDefinition', idxId: args.id, definitionJson: toWFString() },
                    onSuccess: function () { MTips.show('重新生成定义成功', 'ok'); },
                    onError: function () { MTips.show('重新生成定义失败', 'error'); }
                });
                break;
            case 'toJSFile':
                if (!args.nodeName) { MTips.show('请先选择视图', 'warn'); return; }
                var _chartArgs = toUIJSON(), ja = toStruct(), _comArgs = $.JSON.encode(ja[1] || {}), _structArgs = $.JSON.encode(ja[0] || {});
                $.Util.ajax({
                    args: { m: 'SYS_CM_FILES', action: 'toJSFile', fileName: args.nodeName, comArgs: _comArgs, structArgs: _structArgs },
                    onSuccess: function () { MTips.show('生成文件成功', 'ok'); },
                    onError: function () { MTips.show('生成文件失败', 'error'); }
                });
                break;
        }
    }


    function toUIJSON() {
        var _ary = [], _hash = flowChart.hashPoint;
        for (var i in _hash) {
            var _hObj = _hash[i];
            if ($.getType(_hObj) == "object" && $.m.p(i) + '' == 'NaN') {
                _ary.push($.JSON.encode(_hObj.getJson()));
            }
        }
        return "[" + _ary.join(",") + "]";
    }
    function toStruct() {
        var _args = {};
        var _json = findNext(rootID, _args);
        return [_json, _args];
    }

    function findNext(id, _args) {
        var _node = flowChart.getNode(id);
        if (_node && _args) {
            var _id = _node.id, _cSet = comSet[_id];
            if (!_cSet) { return; }
            var _nAry = _node.next.trim().split(' ');
            _args[_cSet.name] = argsSet[_id];
            for (var _n = 0, _nLen = _nAry.length; _n < _nLen; _n++) {
                var _nNode = flowChart.getNode(_nAry[_n]);
                if (_nNode) { _cSet[_nNode.txt] = findNext(_nNode.next.trim(), _args); }
            }
        }
        return _cSet;
    }

    function onFCPointClick(obj) {
        var _point = obj.Point;
        switch (_point.getExt('comType')) {
            case 'Com':
                var _id = _point.id;
                if (_id == currNodeId) { return; }
                var _comObj = comSet[_id];
                currNodeId = _id;
                if (_comObj) {
                    var _name = _comObj.name, _type = _comObj.type;
                    infoF.items['name'].setData(_name, _name);
                    infoF.items['type'].setData(_type, _type);
                } else {
                    infoF.items['name'].setData(_id, _id);
                    infoF.items['type'].setData('请选择类型', '请选择类型');
                }
                break;
        }
    }

    function saveJSON() {
        if (args.id == null) { return; }
        var _chartArgs = toUIJSON(), ja = toStruct(), _comArgs = $.JSON.encode(ja[1] || {}), _structArgs = $.JSON.encode(ja[0] || {});
        var _varArgs = $.JSON.encode({ comSet: comSet, argsSet: argsSet });
        $.Util.ajax({
            args: { m: 'SYS_CM_UI', action: 'updateViewById', id: args.id, varArgs: _varArgs, chartArgs: _chartArgs, comArgs: _comArgs, structArgs: _structArgs },
            onSuccess: function (d) { MTips.show('保存成功!', 'ok'); },
            onError: function (d) { MTips.show('保存失败!', 'error'); }
        });
    }

    function setArgs(key, value) {

    }

    me.loadById = function (id) {
        if (id == null || id == args.id) { return; }
        $.Util.ajax({
            args: { m: 'SYS_CM_UI', action: 'getById', id: id, dataType: 'json', keyFields: 'id,nodeName,initArgs,structArgs,comArgs,chartArgs,varArgs' },
            onSuccess: function (d) {
                var _str = d.get(0), _vObj = {}, _dAry = [];
                args.id = id;
                if (_str) {
                    _vObj = eval(_str)[0]; _dAry = eval(_vObj.chartArgs);
                    var _var = $(_vObj.varArgs);
                    comSet = _var.comSet || {};
                    argsSet = _var.argsSet || {};
                    args.nodeName = _vObj.nodeName;
                    newBtn.setEnabled(false);
                } else {
                    newBtn.setEnabled(true);
                }
                flowChart.reLoad(_dAry);
                flowChart.firePointClick();
                if (flowChart.firstPoint) { rootID = flowChart.firstPoint.id; }
            }
        });
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