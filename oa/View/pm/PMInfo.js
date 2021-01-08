$.namespace('$View.pm');
$View.pm.PMInfo = function (args) {
    var me = this, coms, owner, _fn = function () { };
    var _args = { p: $DB, title: '', proId: 0, type: null, onNext: _fn };
    var popTips, eBody, preStep, currStep, nextStep, btnConfirm, tools, mainTab, subTab;
    var _currIdx = 1, _currLen = 0, _confirms = ',', fileList, _pAry = [];
    var _fc_tv_movie = [
        { name: '目标消费群-0', title: '目标消费群', group: { name: 'desc', ifShowHead: true, title: '提案内容描述'} },
        { name: '故事描述-0', title: '故事描述', group: 'desc' },
        { name: '故事创意来源-0', title: '故事创意来源', group: 'desc' },
        { name: '故事类型-0', title: '故事类型', group: 'desc' },
        { name: '故事剧情-0', title: '故事剧情', group: 'desc' },
        { name: '故事背景-0', title: '故事背景', group: 'desc' },
        { name: '形象描述-0', title: '形象描述', group: 'desc' },
        { name: '形象来源-0', title: '形象来源', group: 'desc' },
        { name: '形象类型-0', title: '形象类型', group: 'desc' },
        { name: '形象造型-0', title: '形象造型', group: 'desc' },
        { name: '形象特性-0', title: '形象特性', group: 'desc' },
        { name: '成功案例-0', title: '成功案例', group: 'desc' },
        { name: '对白风格描述-0', title: '对白风格描述', group: 'desc' },
        { name: '画面风格描述-0', title: '画面风格描述', group: 'desc' },
        { name: '音乐风格描述-0', title: '音乐风格描述', group: 'desc' },
        { name: '技术描述-0', title: '技术描述', group: 'desc' },
        { name: '收视率预估-314', title: '收视率预估', group: { name: 'pinggu', ifShowHead: true, title: '收益项预估'} },
        { name: '收视率预估依据-314', title: '收视率预估依据', group: 'pinggu' },
        { name: '发行收入预估-316', title: '发行收入预估', group: 'pinggu' },
        { name: '发行收入预估依据-316', title: '发行收入预估依据', group: 'pinggu' },
        { name: '整合营销预估-318', title: '整合营销预估', group: 'pinggu' },
        { name: '整合营销预估依据-318', title: '整合营销预估依据', group: 'pinggu' },
        { name: '衍生品直销预估-320', title: '衍生品直接销售预估', group: 'pinggu' },
        { name: '衍生品直销预估依据-320', title: '衍生品直接销售预估依据', group: 'pinggu' },
        { name: '授权收入预估-320', title: '衍生品授权收益预估', group: 'pinggu' },
        { name: '授权收入预估依据-320', title: '衍生品授权收益预估依据', group: 'pinggu' },
        { name: '其他(获奖)预估-324', title: '其他收入方式(获奖)预估', group: 'pinggu' },
        { name: '其他(获奖)预估依据-324', title: '其他收入方式(获奖)预估依据', group: 'pinggu' },
        { name: '品牌价值预估-328', title: '品牌价值评估预估', group: 'pinggu' },
        { name: '品牌价值预估依据-328', title: '品牌价值评估预估依据', group: 'pinggu' },
        { name: '制作团队-325', title: '制作团队', group: { name: 'fangan', ifShowHead: true, title: '实施方案成本及预算'} },
        { name: '合作伙伴与方式-326', title: '合作伙伴与合作方式', group: 'fangan' },
        { name: '制作方案_计划及成本-327', title: '制作方案,计划及成本', group: 'fangan' },
        { name: '播出方案_计划及成本-315', title: '播出方案,计划及成本', group: 'fangan' },
        { name: '发行开展方案_计划及成本-317', title: '发行开展方案,计划及成本', group: 'fangan' },
        { name: '整合营销方案_计划及成本-319', title: '整合营销方案,计划及成本', group: 'fangan' },
        { name: '授权方案_计划及成本-323', title: '授权方案,计划及成本', group: 'fangan' },
        { name: '衍生品销售方案_计划及成本-321', title: '衍生品开发,销售方案,计划及成本', group: 'fangan' }
    ];
    var _fc_tv_cartoon = [
        { name: '目标消费群-0', title: '目标消费群', group: { name: 'desc', ifShowHead: true, title: '提案内容描述'} },
        { name: '故事描述-0', title: '故事描述', group: 'desc' },
        { name: '故事创意来源-0', title: '故事创意来源', group: 'desc' },
        { name: '故事类型-0', title: '故事类型', group: 'desc' },
        { name: '故事剧情-0', title: '故事剧情', group: 'desc' },
        { name: '故事背景-0', title: '故事背景', group: 'desc' },
        { name: '形象描述-0', title: '形象描述', group: 'desc' },
        { name: '形象来源-0', title: '形象来源', group: 'desc' },
        { name: '形象类型-0', title: '形象类型', group: 'desc' },
        { name: '形象造型-0', title: '形象造型', group: 'desc' },
        { name: '形象特性-0', title: '形象特性', group: 'desc' },
        { name: '成功案例-0', title: '成功案例', group: 'desc' },
        { name: '对白风格描述-0', title: '对白风格描述', group: 'desc' },
        { name: '画面风格描述-0', title: '画面风格描述', group: 'desc' },
        { name: '音乐风格描述-0', title: '音乐风格描述', group: 'desc' },
        { name: '技术描述-0', title: '技术描述', group: 'desc' },
        { name: '收视率预估-333', title: '收视率预估', group: { name: 'pinggu', ifShowHead: true, title: '收益项预估'} },
        { name: '收视率预估依据-333', title: '收视率预估依据', group: 'pinggu' },
        { name: '发行收入预估-335', title: '发行收入预估', group: 'pinggu' },
        { name: '发行收入预估依据-335', title: '发行收入预估依据', group: 'pinggu' },
        { name: '整合营销预估-337', title: '整合营销收入预估', group: 'pinggu' },
        { name: '整合营销预估依据-337', title: '整合营销收入预估依据', group: 'pinggu' },
        { name: '衍生品直销预估-341', title: '衍生品直接销售预估', group: 'pinggu' },
        { name: '衍生品直销预估依据-341', title: '衍生品直接销售预估依据', group: 'pinggu' },
        { name: '授权收入预估-339', title: '衍生品授权收益预估', group: 'pinggu' },
        { name: '授权收入预估依据-339', title: '衍生品授权收益预估依据', group: 'pinggu' },
        { name: '其他(获奖)预估-329', title: '其他收入方式(获奖)预估', group: 'pinggu' },
        { name: '其他(获奖)预估依据-329', title: '其他收入方式(获奖)预估依据', group: 'pinggu' },
        { name: '品牌价值预估-343', title: '品牌价值预估', group: 'pinggu' },
        { name: '品牌价值预估依据-343', title: '品牌价值预估依据', group: 'pinggu' },
        { name: '制作团队-330', title: '制作团队', group: { name: 'fangan', ifShowHead: true, title: '实施方案成本及预算'} },
        { name: '合作伙伴与方式-331', title: '合作伙伴与合作方式', group: 'fangan' },
        { name: '制作方案_计划及成本-332', title: '制作方案,计划及成本', group: 'fangan' },
        { name: '播出方案_计划及成本-334', title: '播出方案,计划及成本', group: 'fangan' },
        { name: '发行开展方案_计划及成本-336', title: '发行开展方案,计划及成本', group: 'fangan' },
        { name: '整合营销方案_计划及成本-338', title: '整合营销方案,计划及成本', group: 'fangan' },
        { name: '授权方案_计划及成本-340', title: '授权方案,计划及成本', group: 'fangan' },
        { name: '衍生品销售方案_计划及成本-342', title: '衍生品开发,销售方案,计划及成本', group: 'fangan' }
    ];
    var _fc_tv = [
        { name: '目标消费群-0', title: '目标消费群', group: { name: 'desc', ifShowHead: true, title: '提案内容描述'} },
        { name: '故事描述-0', title: '故事描述', group: 'desc' },
        { name: '故事创意来源-0', title: '故事创意来源', group: 'desc' },
        { name: '故事类型-0', title: '故事类型', group: 'desc' },
        { name: '故事剧情-0', title: '故事剧情', group: 'desc' },
        { name: '故事背景-0', title: '故事背景', group: 'desc' },
        { name: '形象描述-0', title: '形象描述', group: 'desc' },
        { name: '形象来源-0', title: '形象来源', group: 'desc' },
        { name: '形象类型-0', title: '形象类型', group: 'desc' },
        { name: '形象造型-0', title: '形象造型', group: 'desc' },
        { name: '形象特性-0', title: '形象特性', group: 'desc' },
        { name: '成功案例-0', title: '成功案例', group: 'desc' },
        { name: '对白风格描述-0', title: '对白风格描述', group: 'desc' },
        { name: '画面风格描述-0', title: '画面风格描述', group: 'desc' },
        { name: '音乐风格描述-0', title: '音乐风格描述', group: 'desc' },
        { name: '技术描述-0', title: '技术描述', group: 'desc' },
        { name: '票房收入预估-348', title: '票房收入预估', group: { name: 'pinggu', ifShowHead: true, title: '收益项预估'} },
        { name: '票房收入预估依据-348', title: '票房收入预估依据', group: 'pinggu' },
        { name: '发行收入预估-353', title: '非票房发行收入预估', group: 'pinggu' },
        { name: '发行收入预估依据-353', title: '非票房发行收入预估依据', group: 'pinggu' },
        { name: '整合营销预估-355', title: '整合营销收入预估', group: 'pinggu' },
        { name: '整合营销预估依据-355', title: '整合营销收入预估依据', group: 'pinggu' },
        { name: '衍生品直销预估-359', title: '衍生品直接销售预估', group: 'pinggu' },
        { name: '衍生品直销预估依据-359', title: '衍生品直接销售预估依据', group: 'pinggu' },
        { name: '授权收入预估-357', title: '衍生品授权收益预估', group: 'pinggu' },
        { name: '授权收入预估依据-357', title: '衍生品授权收益预估依据', group: 'pinggu' },
        { name: '其他(获奖)预估-344', title: '其他收入方式(获奖)预估', group: 'pinggu' },
        { name: '其他(获奖)预估依据-344', title: '其他收入方式(获奖)预估依据', group: 'pinggu' },
        { name: '品牌价值预估-361', title: '品牌价值评估预估', group: 'pinggu' },
        { name: '品牌价值预估依据-361', title: '品牌价值评估预估依据', group: 'pinggu' },
        { name: '档期-349', title: '档期', group: { name: 'fangan', ifShowHead: true, title: '实施方案成本及预算'} },
        { name: '制作团队-350', title: '制作团队', group: 'fangan' },
        { name: '合作伙伴与方式-351', title: '合作伙伴与合作方式', group: 'fangan' },
        { name: '制作方案_计划及成本-347', title: '制作方案,计划及成本', group: 'fangan' },
        { name: '宣发方案_计划及成本-352', title: '宣发方案,计划及成本', group: 'fangan' },
        { name: '发行开展方案_计划及成本-354', title: '非票房发行开展方案,计划及成本', group: 'fangan' },
        { name: '整合营销方案_计划及成本-356', title: '整合营销方案,计划及成本', group: 'fangan' },
        { name: '授权方案_计划及成本-358', title: '授权方案,计划及成本', group: 'fangan' },
        { name: '衍生品销售方案_计划及成本-360', title: '衍生品开发,销售方案,计划及成本', group: 'fangan' }
    ];
    var _fc_non_tv = [
        { name: '目标消费群-0', title: '目标消费群', group: { name: 'desc', ifShowHead: true, title: '提案内容描述'} },
        { name: '故事描述-0', title: '故事描述', group: 'desc' },
        { name: '故事创意来源-0', title: '故事创意来源', group: 'desc' },
        { name: '故事类型-0', title: '故事类型', group: 'desc' },
        { name: '故事剧情-0', title: '故事剧情', group: 'desc' },
        { name: '故事背景-0', title: '故事背景', group: 'desc' },
        { name: '形象描述-0', title: '形象描述', group: 'desc' },
        { name: '形象来源-0', title: '形象来源', group: 'desc' },
        { name: '形象类型-0', title: '形象类型', group: 'desc' },
        { name: '形象造型-0', title: '形象造型', group: 'desc' },
        { name: '形象特性-0', title: '形象特性', group: 'desc' },
        { name: '成功案例-0', title: '成功案例', group: 'desc' },
        { name: '对白风格描述-0', title: '对白风格描述', group: 'desc' },
        { name: '画面风格描述-0', title: '画面风格描述', group: 'desc' },
        { name: '音乐风格描述-0', title: '音乐风格描述', group: 'desc' },
        { name: '技术描述-0', title: '技术描述', group: 'desc' },
        { name: '收视率预估-366', title: '收视率预估', group: { name: 'pinggu', ifShowHead: true, title: '收益项预估'} },
        { name: '收视率预估依据-366', title: '收视率预估依据', group: 'pinggu' },
        { name: '发行收入预估-368', title: '发行收入预估', group: 'pinggu' },
        { name: '发行收入预估依据-368', title: '发行收入预估依据', group: 'pinggu' },
        { name: '整合营销预估-370', title: '整合营销收入预估', group: 'pinggu' },
        { name: '整合营销预估依据-370', title: '整合营销收入预估依据', group: 'pinggu' },
        { name: '衍生品直销预估-374', title: '衍生品直接销售预估', group: 'pinggu' },
        { name: '衍生品直销预估依据-374', title: '衍生品直接销售预估依据', group: 'pinggu' },
        { name: '授权收入预估-372', title: '衍生品授权收益预估', group: 'pinggu' },
        { name: '授权收入预估依据-372', title: '衍生品授权收益预估依据', group: 'pinggu' },
        { name: '其他(获奖)预估-362', title: '其他收入方式(获奖)预估', group: 'pinggu' },
        { name: '其他(获奖)预估依据-362', title: '其他收入方式(获奖)预估依据', group: 'pinggu' },
        { name: '品牌价值预估-376', title: '品牌价值预估', group: 'pinggu' },
        { name: '品牌价值预估依据-376', title: '品牌价值预估依据', group: 'pinggu' },
        { name: '制作团队-363', title: '制作团队', group: { name: 'fangan', ifShowHead: true, title: '实施方案成本及预算'} },
        { name: '合作伙伴与方式-364', title: '合作伙伴与合作方式', group: 'fangan' },
        { name: '制作方案_计划及成本-365', title: '制作方案,计划及成本', group: 'fangan' },
        { name: '播出方案_计划及成本-367', title: '播出方案,计划及成本', group: 'fangan' },
        { name: '发行开展方案_计划及成本-369', title: '发行开展方案,计划及成本', group: 'fangan' },
        { name: '整合营销方案_计划及成本-371', title: '整合营销方案,计划及成本', group: 'fangan' },
        { name: '授权方案_计划及成本-373', title: '授权方案,计划及成本', group: 'fangan' },
        { name: '衍生品销售方案_计划及成本-375', title: '衍生品开发,销售方案,计划及成本', group: 'fangan' }
    ];
    var _fileAry = [
        { type: 'checkbox', width: 40 },
        { title: '文件名', name: 'nodeName', ifEnabledTips: true, type: 'none', width: 120 },
        { title: '上传者', name: 'cPerson', ifTrans: true, trans: 'SYS_TRANS_USER', type: 'none', width: 50 },
        { title: '上传时间', name: 'cTime', type: 'date', width: 125 },
        { title: '<font color="red">操作</font>', type: 'operate', items: [{ icon: 'icon-glyph-download', name: 'download', href: 'Module/SYS_CM_FILES.aspx?action=downloadFile%26id={0}{1}cast(id as varchar(10)){1}{0}'}], width: 35 }
    ];
    var _fc_obj_2 = { 162: _fc_tv_movie, 167: _fc_tv_cartoon, 172: _fc_tv, 181: _fc_non_tv };
    var _typeDept = { 158: 281, 159: 282, 160: 283, 161: 284 };
    function _default() { }
    function _layout() {
        owner = args.p.adElm('', 'div').cn('wp hp');
        var _tAry = [];
        if (args.type == 'normal') { _tAry.push({ name: 'back', text: '返回', css: 'background-image: -webkit-gradient(linear,left top,left bottom, from(#5AACDD), to(#3787C1));', icon: 'icon-glyph-chevron-left', cn: 'mr10' }); }
        var comArgs = {
            'rootTips': { head_h: 33, icon: 'icon-glyph-list-alt', cn: 'b0', toolBarSkin: 'Button-default', toolBarAry: _tAry, gtID: 392, ifRights: true, onToolBarClick: onToolBarClick },
            'toolTab': { gtID: 186, itemAlign: 'right', skin: 'ButtonSet-default mr10' },
            'mainLayout': { min: 300, max: 500, isRoot: 1, start: 375, dir: 'we', dirLock: 2 },
            'fileList': { aHeader: _fileAry, colControls: { header: {}} }
        }
        var struct = { p: owner, type: 'Tips', name: 'rootTips', body: { name: 'mainLayout', type: 'Layout', eFoot: { name: 'fileList', type: 'List'}} }
        coms = $.layout({ args: comArgs, struct: struct });
        eBody = coms.mainLayout.eHead; fileList = coms.fileList;
        coms.rootTips.toolBar.evt('onSuccess', function (obj) { tools = obj.ButtonSet; btnConfirm = tools.items['446']; me.loadPro(args.proId); });
    }
    function _event() { }
    function _override() { }
    function onToolBarClick(obj) {
        switch (obj.Name) {
            case '446':
                MConfirm.setWidth(250).show('确定确认此操作?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_CM_PM&action=nextStep&proId=' + args.proId + '&nextStep=' + nextStep + '&schedule=' + (_currIdx / _currLen * 100),
                        onSuccess: function () {
                            MTips.show('确认成功', 'ok');
                            _currIdx++; obj.Button.hide(); preStep = currStep; currStep = nextStep; nextStep += 1;
                            mainTab.getItem(currStep).Button.setEnabled(true).fireClick();
                            args.onNext();
                        }
                    });
                });

                MConfirm.setWidth(250).show('确定确认此操作?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_CM_PM&action=nextStep&proId=' + args.proId + '&nextStep=' + nextStep + '&currStep=' + currStep + '&schedule=' + (_currIdx / _currLen * 100),
                        onSuccess: function () {
                            MTips.show('确认成功', 'ok');
                            _currIdx++; obj.Button.hide(); preStep = currStep; currStep = nextStep; nextStep += 1;
                            mainTab.getItem(currStep).Button.setEnabled(true).fireClick();
                            args.onNext();
                        }
                    });
                });
                break;
            case '445':
                onFileUploaderClick();
                break;
            case '444':
                var _ids = fileList.getAttr('selIds');
                if (!_ids || !_ids.length) { MTips.show('请先选择要删除的行', 'warn'); return; }
                MConfirm.setWidth(250).show('确定删除' + _ids.length + '条记录?').evt('onOk', function () {
                    $.Util.ajax({
                        args: 'm=SYS_CM_PM&action=delAttachs&ids=' + _ids.join(',') + '&proId=' + args.proId,
                        onSuccess: function () { MTips.show('删除成功', 'ok'); fileList.refresh(); }
                    })
                });
                break;
            case 'back':
                new $.UI.View({ p: args.p, url: 'View/pm/IndexNormal.js', fireid: args.proId });
                break;
        }
    }

    function bindTools(_body) {
        var eBtn = _body.adElm('', 'div').cn('pf h30 z4').css('margin-top:-30px;');
        var eContent = _body.adElm('', 'div').cn('wp ha').css('margin-top:30px; padding:10px;');
        new $.UI.ButtonSet({
            p: eBtn,
            items: [
                { text: '全收起', type: 'toggle', name: 'allCollapse', icon: 'icon-compact-line-t' },
                { text: '打印', name: 'print', icon: 'icon-glyph-print' },
                { text: '在新页面打开', name: 'openInNewPage', icon: 'icon-glyph-file' }
            ],
            onClick: function (obj) {
                switch (obj.Name) {
                    case 'allCollapse':
                        var _btn = obj.Button;
                        if (obj.Args.ifPress) { _btn.setIcon('icon-compact-line-b').setText('全展开'); } else { _btn.setIcon('icon-compact-line-t').setText('全收起'); }
                        for (var i = 0; i < _pAry.length; i++) { _pAry[i].expand(); }
                        break;
                    case 'openInNewPage':
                        var win = window.open("_black.html", "_blank");
                        win.document.body.onload = function () { win.setContent(eContent.h()); }
                        break;
                    case 'print':
                        (new $.Util.printer(eContent)).print();
                        break;
                }
            }
        });
        return eContent;
    }


    function onFileUploaderClick() {
        popTips = new $.UI.Tips({ comMode: 'x-auto', width: 500, height: 400, y: 100, head_h: 30, ifMask: true, ifClose: true, title: '文件上传', icon: 'icon-glyph-arrow-up' });
        new $.UI.FileUploader({ p: popTips.body, catelog: 'project-mg', onComplete: onUploadSucc });
    }

    function onUploadSucc(obj) {
        if (obj.currIds.length) {
            $.Util.ajax({
                args: 'm=SYS_CM_PM&action=onUploadOver&proId=' + args.proId + '&files=' + obj.currIds.join(','),
                onSuccess: function (d) { fileList.refresh(); }
            });
        } else {
            MTips.show('文件上传失败!', 'warn');
        }
    }

    me.loadPro = function (id) {
        eBody.h('');
        preStep = null; nextStep = null; currStep = null; mainTab = null; subTab = null; _currIdx = null; _currLen = null; _confirms = ','; _pAry = [];
        if (!id) {
            delayShowAllTools(false);
            coms.rootTips.setTitle('未能加载项目');
            fileList.loadAjax({ args: 'm=SYS_CM_PM&action=getAttachs&proId=0' });
        } else {
            delayShowAllTools(true);
            showConfirm(false);
            args.proId = id;
            $.Util.ajax({
                args: 'm=SYS_CM_PM&action=getProWF&keyFields=id as name,nodeName as text&dataType=json&proId=' + id,
                onSuccess: function (d) {
                    var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length, _pInfo = eval(d.get(1) || '[]')[0];
                    currStep = +_pInfo.step; _currLen = _dLen - 1;
                    for (var i = 0; i < _dLen; i++) {
                        var _name = +_dAry[i].name;
                        if (+_pInfo.proType == 161) { _dAry[i].idx = i - 4; } else { _dAry[i].idx = i; }
                        if (_name < currStep) { preStep = _name; }
                        if (_name == currStep) { _dAry[i].ifPress = true; } else { _dAry[i].ifPress = false; }
                        if (_name > currStep) { if (!nextStep) { nextStep = _name; _currIdx = i; }; _dAry[i].enabled = false; } else { _dAry[i].enabled = true; }
                    }
                    args.pInfo = _pInfo; _confirms = _pInfo.confirmPerson; coms.rootTips.setTitle(_pInfo.nodeName);
                    mainTab = new $.UI.Tab({ p: eBody, items: _dAry, onTabClick: onTabClick });
                    fileList.loadAjax({ args: 'm=SYS_CM_PM&action=getAttachs&proId=' + id });
                }
            });
        }
    }
    function onTabClick(obj) {
        if (currStep == +obj.Name) {
            $.Util.ajax({
                args: 'm=SYS_CM_PM&action=getRights&step=' + obj.Name,
                onSuccess: function (d) {
                    if (+d.get(0)) { initCurrStep(obj); } else { allNoRights(obj.Body); }
                }
            });
        } else {
            initOverStep(obj);
        }
    }
    function allNoRights(dom) { dom.h('<div style="width:180px;text-align:center;margin:50px -90px;padding:5px;font-size:12px;border:1px solid #FF8E42;background: #FFFF90;position:absolute;left:50%;">您没有权限, 请联系管理员!</div>'); }
    function initCurrStep(obj) {
        var _body = obj.Body;
        if (_body.h()) { return; }
        _body.h('');
        switch (+obj.Args.idx) {
            case -4:
                var _fc_ary = [
                    { name: '提案人-0', title: '提案人', group: { name: 'g3', width: 310} },
                    { name: '目标观众性别-0', title: '目标观众性别', group: 'g3', comType: 'Select', gtID: 131 },
                    { name: '目标观众年龄-0', title: '目标观众年龄', group: 'g3' },
                    { name: '手机-0', title: '手机', group: 'g3' },
                    { name: '部门-0', title: '部门', group: 'g3' },
                    { name: '工作岗位-0', title: '工作岗位', group: 'g3' },
                    { name: '电子邮箱-0', title: '电子邮箱', group: 'g3' },
                    { name: '方案名称-0', title: '方案名称', group: { name: 'g1', width: 310} },
                    { name: '提交方式-0', title: '提交方式', group: 'g1', comType: 'Select', gtID: 395 },
                    { name: '创新模式-0', title: '创新模式', group: 'g1', comType: 'Select', gtID: 396 },
                    { name: '拟播平台-0', title: '拟播平台', group: 'g1' },
                    { name: '节目类型-0', title: '节目类型', readonly: false, group: { name: 'g2', width: 310 }, comType: 'Select', gtID: 397 },
                    { name: '节目基调-0', title: '节目基调', group: 'g2', comType: 'Select', gtID: 398 },
                    { name: '方案简介-0', comType: 'TextArea', title: '方案简介', group: 'g2' }
                ];
                var _form = new $.UI.Form({ p: _body, ifFixedHeight: false, hidden: { proId: args.proId, step: obj.Name }, items: _fc_ary, onSubmit: function (obj) { return onFormSubmit(obj, function () { showConfirm(true); }) } });
                loadFormData(_form, function (dAry) { if (dAry.length) { showConfirm(true); } else { showConfirm(false); } });
                break;
            case -3:
                $.Util.ajax({
                    args: 'm=SYS_CM_PM&action=loadDecisions&gtRootID=394&dataType=json',
                    onSuccess: function (d) {
                        var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length;
                        if (subTab) { subTab.remove(); subTab = null; obj.Body.h(''); }
                        subTab = new $.UI.Tab({
                            p: _body,
                            loadMode: 'click',
                            items: _dAry,
                            onTabClick: function (subObj) {
                                $.Util.ajax({
                                    args: 'm=SYS_CM_PM&action=getRights&extid=' + subObj.Name,
                                    onSuccess: function (d) {
                                        if (+d.get(0)) { onPersonOneTabClick(obj, subObj); } else { allNoRights(subObj.Body); }
                                    }
                                });
                            }
                        });
                        setTabClick(subTab);
                    }
                });
                break;
            case -2:
                delayShowTools(false);
                $.Util.ajax({
                    args: 'm=SYS_CM_PM&action=loadPingFeng&dataType=json&proId=' + args.proId + '&step=' + preStep,
                    onSuccess: function (d) {
                        var _d = d.data, _dLen = _d.length;
                        var _dom = _body.adElm('', 'div').css('padding:10px;');
                        for (var i = 0; i < _dLen; i++) {
                            var _obj = eval(_d[i] || '[]')[0];
                            for (var k in _obj) { _dom.adElm('', 'div').cn('fs12 lh20 ml10').h('<span class="w200 c_c26 fwb dib">' + k + '</span><span class="dib">' + _obj[k] + '</span>'); }
                        }
                    }
                });
                break;
            case 0:
                var _form = new $.UI.Form({ p: _body, hidden: { proId: args.proId, step: obj.Name }, items: _fc_obj_2[+obj.Name], onSubmit: function (obj) { return onFormSubmit(obj, function () { showConfirm(true); }) } });
                loadFormData(_form, function (dAry) { if (dAry.length) { showConfirm(true); } else { showConfirm(false); } });
                break;
            case 1:
                $.Util.ajax({
                    args: 'm=SYS_CM_PM&action=loadDiscussDepts&gtRootID=' + _typeDept[args.pInfo.proType] + '&proId=' + args.proId + '&preStep=' + preStep + '&dataType=json',
                    onSuccess: function (d) {
                        var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length, _preAry = eval(d.get(1) || '[]');
                        if (subTab) { subTab.remove(); subTab = null; obj.Body.h(''); }
                        subTab = new $.UI.Tab({
                            p: _body,
                            loadMode: 'click',
                            items: _dAry,
                            onTabClick: function (subObj) {
                                $.Util.ajax({
                                    args: 'm=SYS_CM_PM&action=getRights&extid=' + subObj.Name,
                                    onSuccess: function (d) {
                                        if (+d.get(0)) { onSubTabClick(obj, subObj, _preAry); } else { allNoRights(subObj.Body); }
                                    }
                                });
                            }
                        });
                        setTabClick(subTab);
                    }
                });
                break;
            case 2:
                $.Util.ajax({
                    args: 'm=SYS_CM_PM&action=loadDecisions&dataType=json',
                    onSuccess: function (d) {
                        var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length, _preAry = eval(d.get(1) || '[]');
                        if (subTab) { subTab.remove(); subTab = null; obj.Body.h(''); }
                        subTab = new $.UI.Tab({
                            p: _body,
                            loadMode: 'click',
                            items: _dAry,
                            onTabClick: function (subObj) {
                                $.Util.ajax({
                                    args: 'm=SYS_CM_PM&action=getRights&extid=' + subObj.Name,
                                    onSuccess: function (d) {
                                        if (+d.get(0)) { onPersonTabClick(obj, subObj, _preAry); } else { allNoRights(subObj.Body); }
                                    }
                                });
                            }
                        });
                        setTabClick(subTab);
                    }
                });
                break;
            case -1:
            case 3:
                var _fc_ary = [
                    { title: '开始时间', name: '开始时间-0', comType: 'Date', req: true, group: { name: 'info', width: 350 }, sErr: '开始时间必填' },
                    { title: '结束时间', name: '结束时间-0', comType: 'EndDate', matchItem: '开始时间-0', req: true, group: 'info' },
                    { title: '交付物', name: '交付物-0', comType: 'FileUploader', group: 'info', onComplete: function (obj) { obj.FormItem.form.setHidden('fids', obj.Objs.currIds.join(',')); } },
                    { title: '备注', name: '备注-0', comType: 'TextArea', group: 'info' }
                ];
                var _form = new $.UI.Form({
                    p: _body,
                    items: _fc_ary,
                    ifFixedHeight: false,
                    hidden: { proId: args.proId, step: obj.Name },
                    onSubmit: function (fobj) { return onFormSubmit(fobj, function () { showConfirm(true); }); }
                });
                loadFormData(_form, function (dAry) { if (dAry.length) { showConfirm(true); } else { showConfirm(false); } });
                break;
            case 4:
                delayShowTools(false);
                var _body = bindTools(_body.h(''));
                $.Util.ajax({
                    args: 'm=SYS_CM_PM&action=loadAllByProId&dataType=json&proId=' + args.proId,
                    onSuccess: function (d) {
                        var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length, _panel, _step = {}; _pAry = [];
                        for (var i = 0; i < _dLen; i++) {
                            var _d = _dAry[i], _s = _d.step, _ext = _d.ext, _g = _d.g, _dom = _body;
                            if (_s && !_step[_s]) { _panel = new $.UI.Panel({ p: _dom, title: _s }); _step[_s] = _panel.eContent; _pAry.push(_panel); }
                            _dom = _step[_s] || _dom;
                            if (_ext && !_step[_ext]) { _panel = new $.UI.Panel({ p: _dom, title: _ext }); _step[_ext] = _panel.eContent; _pAry.push(_panel); }
                            _dom = _step[_ext] || _dom;
                            if (_g && !_step[_g]) { _panel = new $.UI.Panel({ p: _dom, title: _g }); _step[_g] = _panel.eContent; _pAry.push(_panel); }
                            _dom = _step[_g] || _dom;
                            _dom.adElm('', 'div').cn('fs12 lh20 ml10').h('<span class="w200 c_c26 fwb dib">' + _d.code + '</span><span class="dib">' + _d.value + '</span>');
                        }
                    }
                });
                break;
        }
    }


    function onPersonOneTabClick(obj, subObj) {
        var _body = subObj.Body, _btn = subObj.Button;
        if (_body.h()) { return; }
        $.Util.ajax({
            args: 'm=SYS_CM_PM&action=loadDecisions&gtRootID=439&dataType=json&keyFields=nodeName as title, nodeName%2B\'-0\' as name, \'Radios\' as comType, \'info\' as [group]',
            onSuccess: function (d) {
                var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length;
                for (var i = 0; i < _dLen; i++) { _dAry[i].sons = [{ value: 1, text: 1 }, { value: 2, text: 2 }, { value: 3, text: 3 }, { value: 4, text: 4 }, { value: 5, text: 5}]; }
                _dAry[0].group = { name: 'info', width: 420 };
                _dAry.push({ title: '是否入围', name: '是否入围-0', comType: 'Radios', sons: [{ value: '是', text: '是' }, { value: '否', text: '否'}], group: 'info' });
                _dAry.push({ title: '评估意见', name: '评估意见-0' });
                var _form = new $.UI.Form({
                    p: _body,
                    items: _dAry,
                    ifFocus: false,
                    ifFixedHeight: false,
                    hidden: { proId: args.proId, step: obj.Name, extid: subObj.Name, confirmPerson: _confirms },
                    onSubmit: function (fobj) {
                        if (!_btn.get('ifChecked')) { _confirms += subObj.Name + ','; }
                        fobj.confirmPerson = _confirms;
                        return onFormSubmit(fobj, function () { _btn.setIcon('icon-glyph-ok').set('ifChecked', true); setConfirmShow(subObj.Tab, _confirms); });
                    }
                });
                loadFormData(_form, function (dAry) { });
            }
        });
    }

    function onPersonTabClick(obj, subObj) {
        var _body = subObj.Body, _btn = subObj.Button;
        if (_body.h()) { return; }
        var _fc_ary = [
            { title: '对内容主观评价', name: '对内容主观评价-0', comType: 'TextArea', group: { name: 'info'} },
            { title: '结论性意见', name: '结论性意见-0', comType: 'Select', req: true, sErr: '结论性意见必填', gtID: 388, group: 'info' },
            { title: '可行性意见', name: '可行性意见-0', group: 'info' }
        ];
        $.Util.ajax({
            args: 'm=SYS_CM_PM&action=loadShouYi&proId=' + args.proId + '&preStep=' + preStep + '&dataType=json',
            onSuccess: function (d) {
                var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length, _exts = {}, _f = {};
                for (var i = 0; i < _dLen; i++) {
                    var _i = _dAry[i], _ext = _i.ext, _val = _i.value;
                    if (!_exts[_ext]) { _exts[_ext] = ''; _f[_ext] = _i.title; }
                    if (_exts[_ext]) { _val += '/'; }
                    _exts[_ext] += _val;
                }
                for (var k in _exts) { _fc_ary.push({ title: _f[k] + '收益', text: _exts[k], comType: 'Label', group: 'x', ifSubmit: false }); _fc_ary.push({ title: _f[k] + '评估', name: _f[k] + '评估-0', group: 'x' }); }
                _fc_ary[3].group = { name: 'x', width: 620 };
                var _form = new $.UI.Form({
                    p: _body,
                    items: _fc_ary,
                    hidden: { proId: args.proId, step: obj.Name, extid: subObj.Name, confirmPerson: _confirms },
                    onSubmit: function (fobj) {
                        if (!_btn.get('ifChecked')) { _confirms += subObj.Name + ','; }
                        fobj.confirmPerson = _confirms;
                        return onFormSubmit(fobj, function () { _btn.setIcon('icon-glyph-ok').set('ifChecked', true); setConfirmShow(subObj.Tab, _confirms); });
                    }
                });
                loadFormData(_form, function (dAry) { });
            }
        });
    }

    function setConfirmShow(tab, _confirms) {
        var _cAry = _confirms.split(','), _cLen = _cAry.length, _key, _btn, _kLen = 0;
        for (var i = 0; i < _cLen; i++) {
            _key = _cAry[i].trim();
            if (!_key) { continue; }
            _btn = tab.getTabBtn(_key);
            if (_btn && _btn.get('ifChecked')) { _kLen++; }
        }
        if (tab.aItems.length == _kLen) { showConfirm(true); }
    }

    function setTabClick(tab) {
        var _cAry = _confirms.split(','), _cLen = _cAry.length, _key, _btn, _kLen = 0;
        for (var i = 0; i < _cLen; i++) {
            _key = _cAry[i].trim();
            if (!_key) { continue; }
            _btn = tab.getTabBtn(_key);
            if (_btn) { _btn.setIcon('icon-glyph-ok').set('ifChecked', true); _kLen++; }
        }
        if (tab.aItems.length == _kLen) { showConfirm(true); }
    }

    function loadFormData(_form, onSucc) {
        $.Util.ajax({
            args: 'm=SYS_CM_PM&action=loadFormData&dataType=json&proId=' + _form.getHidden('proId') + '&step=' + _form.getHidden('step') + '&extid=' + (_form.getHidden('extid') || '0'),
            onSuccess: function (d) {
                var _dAry = eval(d.get(0) || '[]'), _dLen = _dAry.length, _fItems = _form.items, _onSucc = onSucc || function () { };
                for (var i = 0; i < _dLen; i++) { var _d = _dAry[i]; if (_fItems[_d.name]) { _fItems[_d.name].setText(_d.value); } }
                if (_dLen) { _form.getButton(0).setIcon('icon-glyph-edit').setText('修改信息'); }
                onSucc(_dAry);
            }
        });
    }

    function onFormSubmit(obj, onSucc) {
        var _form = obj.Form, _onSucc = onSucc || function () { };
        $.Util.ajax({
            args: 'm=SYS_CM_PM&action=submitForm&json=' + $.JSON.encode(obj.Data.IText) + '&proId=' + _form.getHidden('proId') + '&step=' + _form.getHidden('step') + '&extid=' + (_form.getHidden('extid') || '0') + '&confirmPerson=' + (obj.confirmPerson || ','),
            onSuccess: function (d) {
                var _d = d.get(0), _sOk = '修改成功';
                if (_d == 'insert') { _sOk = '提交成功'; _form.btnSet.items[0].setIcon('icon-glyph-edit').setText('修改信息'); }
                MTips.show(_sOk, 'ok');
                _onSucc(_d);
            }
        });
        return false;
    }

    function onSubTabClick(obj, subObj, preAry) {
        var _body = subObj.Body, _btn = subObj.Button;
        if (_body.h()) { return; }
        var _fc_ary = [
            { name: '目标消费群-0', title: '目标消费群', group: { name: 'desc', ifShowHead: true, title: '对提案内容描述的评估'} },
            { name: '故事描述-0', title: '故事描述', group: 'desc' },
            { name: '故事创意来源-0', title: '故事创意来源', group: 'desc' },
            { name: '故事类型-0', title: '故事类型', group: 'desc' },
            { name: '故事剧情-0', title: '故事剧情', group: 'desc' },
            { name: '故事背景-0', title: '故事背景', group: 'desc' },
            { name: '形象描述-0', title: '形象描述', group: 'desc' },
            { name: '形象来源-0', title: '形象来源', group: 'desc' },
            { name: '形象类型-0', title: '形象类型', group: 'desc' },
            { name: '形象造型-0', title: '形象造型', group: 'desc' },
            { name: '形象特性-0', title: '形象特性', group: 'desc' },
            { name: '成功案例-0', title: '成功案例', group: 'desc' },
            { name: '对白风格描述-0', title: '对白风格描述', group: 'desc' },
            { name: '画面风格描述-0', title: '画面风格描述', group: 'desc' },
            { name: '音乐风格描述-0', title: '音乐风格描述', group: 'desc' },
            { name: '技术描述-0', title: '技术描述', group: 'desc' }
        ];
        var _fc_obj_dept_discuss = [
            [
                { name: '部门责任人意见', title: '部门责任人意见' },
                { name: '预估收益', title: '预估收益($/%)' },
                { name: '评估依据和意见', title: '评估依据和意见' }
            ],
            [
                { name: '部门责任人意见', title: '部门责任人意见' },
                { name: '项目方案评估', title: '项目方案评估' },
                { name: '评估依据和意见', title: '评估依据和意见' },
                { name: '实现方案及计划', title: '实现方案及计划' }
            ],
            [
                { name: '部门责任人意见', title: '部门责任人意见' },
                { name: '项目方案评估', title: '项目方案评估' },
                { name: '评估依据和意见', title: '评估依据和意见' },
                { name: '实现方案及计划', title: '实现方案及计划' }
            ],
            [
                { name: '部门责任人意见', title: '部门责任人意见' },
                { name: '项目方案评估', title: '项目方案评估' },
                { name: '评估依据和意见', title: '评估依据和意见' },
                { name: '实现方案及计划', title: '实现方案及计划' }
            ],
            [
                { name: '部门责任人意见', title: '部门责任人意见' },
                { name: '项目方案评估', title: '项目方案评估' },
                { name: '评估依据和意见', title: '评估依据和意见' },
                { name: '实现方案及计划', title: '实现方案及计划' }
            ]
        ]
        $.Util.ajax({
            args: 'm=SYS_CM_PM&action=loadDiscussDepts&gtRootID=' + subObj.Name + '&proId=' + args.proId + '&preStep=' + preStep + '&dataType=json',
            onSuccess: function (d) {
                var _gAry = eval(d.get(0) || '[]'), _gLen = _gAry.length;
                for (var i = 0; i < _gLen; i++) {
                    var _g = _gAry[i], _gn = _g.name, _gfcs = _fc_obj_dept_discuss[i], _giLen = _gfcs.length;
                    _gfcs[0].group = { name: _gn, title: _g.text, ifShowHead: true };
                    _gfcs[0].name += '-' + _gn;
                    _fc_ary.push(_gfcs[0]);
                    for (var _gi = 1; _gi < _giLen; _gi++) { _gfcs[_gi].group = _gn; _gfcs[_gi].name += '-' + _gn; _fc_ary.push(_gfcs[_gi]); }
                }
                _fc_ary = _fc_ary.concat(eval(d.get(1) || '[]'));
                var _form = new $.UI.Form({
                    p: _body,
                    items: _fc_ary,
                    hidden: { proId: args.proId, step: obj.Name, extid: subObj.Name, confirmPerson: _confirms },
                    onSubmit: function (fobj) {
                        if (!_btn.get('ifChecked')) { _confirms += subObj.Name + ','; }
                        fobj.confirmPerson = _confirms;
                        return onFormSubmit(fobj, function () { _btn.setIcon('icon-glyph-ok').set('ifChecked', true); setConfirmShow(subObj.Tab, _confirms); });
                    }
                });
                loadFormData(_form, function (dAry) { });
            }
        });
    }

    function initOverStep(obj) {
        obj.Body.h('');
        var _body = bindTools(obj.Body.h(''));
        $.Util.ajax({
            args: 'm=SYS_CM_PM&action=loadOverStep&dataType=json&proId=' + args.proId + '&step=' + obj.Name,
            onSuccess: function (d) {
                var _dAry = eval(d.get(0) || '[]'), gs = {}, _panel; _pAry = [];
                for (var i = 0, _len = _dAry.length; i < _len; i++) {
                    var _d = _dAry[i], _ext = _d.ext, _g = _d.g, _dom = _body;
                    if (_ext && !gs[_ext]) { _panel = new $.UI.Panel({ p: _dom, title: _ext }); gs[_ext] = _panel.eContent; _pAry.push(_panel); }
                    _dom = gs[_ext] || _body;
                    if (_g && !gs[_g]) { _panel = new $.UI.Panel({ p: _dom, title: _g }); gs[_g] = _panel.eContent; _pAry.push(_panel); }
                    _dom = gs[_g] || gs[_ext] || _body;
                    _dom.adElm('', 'div').cn('fs12 lh20 ml10').h('<span class="w200 c_c26 fwb dib">' + _d.code + '</span><span class="dib">' + _d.value + '</span>');
                }
            }
        });
    }
    function showConfirm(ifShow) { if (!btnConfirm) { return; }; if (ifShow) { btnConfirm.show(); } else { btnConfirm.hide(); } }
    function showTools(ifShow) {
        var _items = tools.aItem, _i = 0;
        if (args.type == 'normal') { _i = 1; }
        for (var i = _i, _len = _items.length; i < _len; i++) { _items[i].setVisibled(ifShow); }
    }

    function showTools(ifShow) {
        var _items = tools.aItem, _i = 0;
        if (args.type == 'normal') { _i = 1; }
        for (var i = _i, _len = _items.length; i < _len; i++) { _items[i].setVisibled(ifShow); }
    }

    function delayShowTools(ifShow) {
        if (!tools) { setTimeout(function () { delayShowTools(ifShow) }, 100); return; }
        showTools(ifShow);
    }

    function showAllTools(ifShow) {
        var _items = tools.aItem;
        for (var i = 0, _len = _items.length; i < _len; i++) { _items[i].setVisibled(ifShow); }
    }

    function delayShowAllTools(ifShow) {
        if (!tools) { setTimeout(function () { delayShowAllTools(ifShow) }, 100); return; }
        showAllTools(ifShow);
    }
    return $.extendView(this, args, _args).main(_default, _layout, _event, _override).setOwner(owner), this;
}