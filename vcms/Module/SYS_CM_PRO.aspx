<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="Fily.Util" %>
<%@ Import Namespace="Fily.WorkFlow" %>
<%@ Import Namespace="System.Collections" %>
<% 
    string action = Native.getAction(), responseText = String.Empty;
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    string[,] args;
    Json _args = null;
    switch (action) {
        case "addProject":
            args = new string[,] { 
                { "json", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    //113: 发起施工项目的操作，获取权限用户和角色
                    Json node = _trans.execJson(MString.getSelectStr(R.Table.CM_GLOBAL_BTNSET, "users,roles", 113));
                    string _users = node.getValue("users"), _roles = node.getValue("roles");
                    string[] _kv = MConvert.toKV(_args.getValue("json"));
                    responseText = _trans.addRow(R.Table.PRO_MG, _kv[0] + ",users,roles,observers", _kv[1] + ",'" + _users + "','" + _roles + "','" + _users + "'");
                    _trans.addRow("PRO_SC_ACCOUNT_INFO", "proId", responseText);
                    _trans.commit();
                }
                catch (Exception e)
                {
                    responseText = Native.getErrorMsg(e.Message);
                    _trans.rollback();
                }
                finally
                {
                    _trans.close();
                }
            }
            break;
        case "addRealMete":
            args = new string[,] { 
                { "json", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _json = _args.getValue("json");
                    string[] _kv = MConvert.toKV(_json);
                    _trans.addRow("PRO_SC_COST", _kv[0], _kv[1]);
                    _trans.execNonQuery(MString.getUpdateStr(R.Table.PRO_MG, "realCost=realCost+"+MConvert.getDouble(_json, "cost"), MConvert.getInt(_json, "proId")));
                    _trans.commit();
                }
                catch (Exception e)
                {
                    responseText = Native.getErrorMsg(e.Message);
                    _trans.rollback();
                }
                finally
                {
                    _trans.close();
                }
            }
            break;
        case "delRealMete":
            args = new string[,] { 
                { "id", null },
                { "proId", null },
                { "cost", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery(MString.getDeleteStr("PRO_SC_COST", "id=" + _args.getValue("id")) + MString.getUpdateStr(R.Table.PRO_MG, "realCost=realCost-" + _args.getValue("cost"), _args.getInt("proId")));
            }
            break;
        case "addAccount":
            args = new string[,] { 
                { "json", null },
                { "taskId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {

                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _json = _args.getValue("json");
                    string[] _kv = MConvert.toKV(_json);
                    string _newId = _trans.addRow("PRO_SC_ACCOUNT_INFO", _kv[0], _kv[1]);
                    _trans.execNonQuery(MString.getUpdateStr("PRO_SC_COST_COUNT", "accountInfoId=" + _newId, _args.getInt("taskId")));
                    responseText = _newId;
                    _trans.commit();
                }
                catch (Exception e)
                {
                    responseText = Native.getErrorMsg(e.Message);
                    _trans.rollback();
                }
                finally
                {
                    _trans.close();
                }
            }
            break;
        case "updateRealMete":
            args = new string[,] { 
                { "id", null },
                { "proId", null },
                { "num", null },
                { "cost", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery(MString.getUpdateStr("PRO_SC_COST", "num="+_args.getValue("num")+",cost=cost"+_args.getValue("cost"), _args.getInt("id")) + MString.getUpdateStr(R.Table.PRO_MG, "realCost=realCost+" + _args.getValue("cost"), _args.getInt("proId")));
            }
            break;
        case "saveProjectDesignMete":
            args = new string[,] { 
                { "proId", null },
                { "proCode", null },
                { "proType", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                
                string _proId = _args.getValue("proId"),
                    _proCode = _args.getValue("proCode"),
                    _proType = _args.getValue("proType"), 
                    _update = String.Empty;
                string _url = "View/project/PMInfo.js?" + _proId;
                int _wfIndex = 122;
                if(_proType=="770"){
                    _wfIndex = 129;
                }
                string _wfId = (new WFIndex(_wfIndex, baseApi)).addInstance("【工程编号：" + _proCode + "】开工报告审核", _url);
                string _users = baseApi.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                if (!Native.isEmpty(_wfId))
                {
                    _update = "kaiGongWfId=" + _wfId + ", users='" + _users + "', observers=observers + '" + _users + "',planCost=100";
                }
                baseApi.execQuery(MString.getUpdateStr(R.Table.PRO_MG, _update, _args.getInt("proId")));
                responseText = _args.getValue("proId");
            }
            break;
        case "onDuiWuApplyComplete":
            args = new string[,] { 
                { "proId", null },
                { "proCode", null },
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                StringBuilder _sql = new StringBuilder();
                string _wfId = String.Empty,
                    _wfIdx = "123",
                    _proId = _args.getValue("proId"),
                    _proCode = _args.getValue("proCode"),
                    _update = String.Empty,
                    _users = String.Empty;

                if (_wfIdx != "0")
                {
                    string _url = "View/project/PMInfo.js?" + _proId;
                    _wfId = (new WFIndex(Convert.ToInt32(_wfIdx), baseApi)).addInstance("【工程编号：" + _proCode + "】施工合同会签", _url);
                    _users = baseApi.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                }
                if (!Native.isEmpty(_wfId))
                {
                    _update = "heTongWfId=" + _wfId + ", users='" + _users + "', observers=observers + '" + _users + "'";
                }
                if (!Native.isEmpty(_update)) { _sql.Append(MString.getUpdateStr(R.Table.PRO_MG, _update, _args.getInt("proId"))); }
                baseApi.execQuery(_sql.ToString());
                responseText = _args.getValue("proId");
            }
            break;
        case "onHeTongComplete":
            args = new string[,] { 
                { "proId", null },
                { "proCode", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                StringBuilder _sql = new StringBuilder();
                string _proId = _args.getValue("proId"),
                    _proCode = _args.getValue("proCode"),
                    _update = String.Empty;

                string _execDept = baseApi.select("PRO_MG", "execDept", "id="+_proId);  //项目组
                string _execPerson = baseApi.select("PRO_MG", "execPerson", "id="+_proId);  //项目组
                string _proType = baseApi.select("PRO_MG", "proType", "id="+_proId);  //项目组
                string _owner = baseApi.select("SYS_CM_ROLE","uids", "id=" + _execDept)+"," + _execPerson+",";
                int _wfIndex = 127;
                if(_proType=="770"){
                    _wfIndex = 130;
                }
                string _wfId = (new WFIndex(_wfIndex, baseApi)).addInstance("【工程编号：" + _proCode + "】工程外包人工量结算", "View/project/PMInfo.js?" + _proId, _owner, false, "项目组最后阶段进入外包人工费用结算");
                _update = "state=507, users=',', roles='," + _execDept + ",',projectJieSuanWfId=" + _wfId;
                if (!Native.isEmpty(_update)) { 
                    _sql.Append(MString.getUpdateStr(R.Table.PRO_MG, _update, _args.getInt("proId"))); 
                }
                baseApi.execQuery(_sql.ToString());
                responseText = _owner;
            }
            break;
        case "onKaiGongComplete":
            args = new string[,] { 
                { "proId", null },
                { "proCode", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                StringBuilder _sql = new StringBuilder();
                string _proId = _args.getValue("proId"),
                    _proCode = _args.getValue("proCode"),
                    _update = String.Empty;
                string _url = "View/project/PMInfo.js?" + _proId;
                string _wfId = (new WFIndex(123, baseApi)).addInstance("【工程编号：" + _proCode + "】施工队伍审核会签", _url);
                string _users = baseApi.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                if (!Native.isEmpty(_wfId))
                {
                    _update += "duiWuApplyWfId=" + _wfId + ", users='" + _users + "', observers=observers + '" + _users + "'";
                }
                if (!Native.isEmpty(_update)) { _sql.Append(MString.getUpdateStr(R.Table.PRO_MG, _update, _args.getInt("proId"))); }
                baseApi.execQuery(_sql.ToString());
                responseText = _args.getValue("proId");
            }
            break;
        case "onJieSuanComplete":
            args = new string[,] { 
                { "proId", null },
                { "proCode", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                StringBuilder _sql = new StringBuilder();
                string _proId = _args.getValue("proId"),
                    _proCode = _args.getValue("proCode"),
                    _update = String.Empty,
                    _users = String.Empty;
                _users = ",";
                _update = "state=509, users='" + _users + "', observers=observers + '" + _users + "'";
                _sql.Append(MString.getUpdateStr(R.Table.PRO_MG, _update, _args.getInt("proId")));
                baseApi.execQuery(_sql.ToString());
                responseText = _args.getValue("proId");
            }
            break;
        case "saveProjectMete":
            args = new string[,] { 
                { "proId", null },
                { "realCost", "0" },
                { "jsons", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string[] _sVal = _args.getValue("jsons").Split('\u0002');
                StringBuilder _sql = new StringBuilder();
                string _proId = _args.getValue("proId"),
                    _update = String.Empty;
                string _url = "View/project/PMInfo.js?" + _proId;
                string _wfId = (new WFIndex(Convert.ToInt32(119), baseApi)).addInstance("【工程ID(" + _proId + ")】竣工确认", _url);
                string _users = baseApi.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                
                for (int i = 0, _len = _sVal.Length; i < _len; i++)
                {
                    if (!Native.isEmpty(_sVal[i])) {
                        string[] _kv = MConvert.toKV(_sVal[i]);
                        _sql.Append(MString.getInsertStr("PRO_SC_COST", _kv[0], _kv[1]));
                    }
                }
                if (!Native.isEmpty(_wfId))
                {
                    _update = "confirmWfId=" + _wfId + ", users='" + _users + "', observers=observers + '" + _users + "', realCost=" + _args.getValue("realCost");
                }
                if (!Native.isEmpty(_update)){ _sql.Append(MString.getUpdateStr(R.Table.PRO_MG, _update, _args.getInt("proId"))); }
                //Native.write(_sql.ToString());
                baseApi.execQuery(_sql.ToString());
                responseText = _args.getValue("proId");
            }
            break;
        case "onProjectJieSuanComplete":
            args = new string[,] { 
                { "proId", null },
                { "proCode", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                StringBuilder _sql = new StringBuilder();
                string _proId = _args.getValue("proId"),
                    _proCode = _args.getValue("proCode"),
                    _update = String.Empty;
                string _url = "View/project/PMInfo.js?" + _proId;
                string _wfId = (new WFIndex(Convert.ToInt32(128), baseApi)).addInstance("【工程编号：" + _proCode + "】工程总费用审核结算", _url);
                string _users = baseApi.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                if (!Native.isEmpty(_wfId))
                {
                    _update = "jieSuanWfId=" + _wfId + ", users='" + _users + "', observers=observers + '" + _users + "', state=508";
                }
                _sql.Append(MString.getUpdateStr(R.Table.PRO_MG, _update, _args.getInt("proId")));
                baseApi.execQuery(_sql.ToString());
                responseText = _args.getValue("proId");
            }
            break;
        case "updateProByID":
            args = new string[,]{
                {"id", null},
                {"json", null},
                {"currState", null}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _json = _args.getValue("json"), _updateSql = MConvert.toUpdateSql(_json), _id = _args.getValue("id"), _wfId = String.Empty, _taskId = String.Empty, _users = String.Empty;
                
            }
            break;
        case "loadPrice":
            args = new string[,] { 
                { "guiGeId", null },
                { "keyFields", "*" },
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.select("PRO_SC_STANDARD", _args.getValue("keyFields"), "guiGeId=" + _args.getValue("guiGeId"));
            }
            break;
        case "updateStateByID":
            args = new string[,]{
                {"id", null},
                {"proId", null},
                {"json", null}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery(MString.getUpdateStr("PRO_SC_ACCOUNT_INFO", MConvert.toUpdateSql(_args.getValue("json")), "id=" + _args.getValue("id"))+MString.getUpdateStr(R.Table.PRO_MG, "state=511", _args.getInt("proId")));
            }
            break;
        case "addReciveTask":
            args = new string[,] { 
                { "json", null },
                { "proCode", null },
                { "MSInfos", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _return = String.Empty,
                    _json = _args.getValue("json"),
                    _code = MConvert.getValue(_json, "code"),
                    _proId = MConvert.getValue(_json, "proId"),
                    _proCode = _args.getValue("proCode");
                string _url = "View/project/InTask.js?" + _proId;
                string _wfId = (new WFIndex(116, baseApi)).addInstance("【工程编号：" + _proCode + "】【领料单号：" + _code + "】工程物资领料申请", _url);
                SqlTrans trans = new SqlTrans(baseApi);
                try
                {
                    string[] _kv = MConvert.toKV(_json);
                    string _users = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                    string _newID = trans.addRow("PRO_MS_RECEIVE", _kv[0] + ",wfId,users,observers", _kv[1] + "," + _wfId + ",'" + _users + "','" + _users + "'");
                    string[] infoAry = _args.getValue("MSInfos").Split('\u0002');
                    for (int i = 0, _len = infoAry.Length; i < _len; i++)
                    {
                        string[] _tKV = MConvert.toKV(infoAry[i]);
                        trans.execNonQuery(MString.getInsertStr("PRO_MS_RECEIVE_DETAIL", _tKV[0] + ",oid,proId", _tKV[1] + "," + _newID + "," + _proId ));
                    }
                    trans.execNonQuery(MString.getUpdateStr(R.Table.WF_INSTANCE, "url='" + ("View/project/InTask.js?" + _proId + "&taskId=" + _newID) + "'", "id=" + _wfId));
                    _return = _newID;
                    trans.commit();
                }
                catch (Exception e)
                {
                    trans.rollback();
                    _return = Native.getErrorMsg(e.Message);
                }
                finally
                {
                    trans.close();
                }
                responseText = _return;
            }
            break;
        case "onReciveTaskComplete":
            args = new string[,]{
                {"tkId", null}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sql = MString.getUpdateStr("PRO_MS_RECEIVE_DETAIL", "state=741,notUsed=number", "oid=" + _args.getValue("tkId"));
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "getBackMSCount":
            args = new string[,] { 
                { "proId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execScalar(MString.format("select {0} from dbo.SYS_WH_MS ms left join dbo.PRO_MS_RECEIVE_DETAIL detail on ms.id=detail.msId where detail.notUsed<>0 and detail.state=741 and detail.proId={1};", "count(detail.id)", _args.getValue("proId")));
            }
            break;
        case "saveReciveResult":
            args = new string[,] { 
                { "proId", null },
                { "proCode", null },
                { "backCount", "0"}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _proId = _args.getValue("proId"),
                    _proCode = _args.getValue("proCode");
                string _update = String.Empty,
                    _return = String.Empty;
                if (_args.getInt("backCount") != 0)
                {
                    string _url = "View/project/PMInfo.js?" + _proId;
                    string _backWfId = (new WFIndex(115, baseApi)).addInstance("【工程编号：" + _proCode + "】工程物资退料申请", _url);
                    _update = "tuiLiaoWfId=" + _backWfId + ",";
                   
                }

                string _execDept = baseApi.select("PRO_MG", "execDept", "id=" + _proId);  //项目组
                string _owner = baseApi.select("SYS_CM_ROLE", "uids", "id=" + _execDept);
                string _jsWfId = (new WFIndex(127, baseApi)).addInstance("【工程编号：" + _proCode + "】工程外包人工量结算", "View/project/PMInfo.js?" + _proId, _owner, false, "项目组最后阶段进入外包人工费用结算");
                _update += "projectJieSuanWfId=" + _jsWfId + ",";

                SqlTrans trans = new SqlTrans(baseApi);
                try
                {
                    double _usedSum = 0.00, 
                        _sum = 0.00;
                    ArrayList tks = trans.execJsonList(MString.getSelectStr("dbo.PRO_MS_RECEIVE", "id", "proId=" + _proId));
                    for (int i = 0; i < tks.Count; i++) {
                        Json tk = (Json)(tks[i]);
                        Json td = trans.execJson("select sum(usedSum) as usedSum, sum(sum) as allSum from dbo.PRO_MS_RECEIVE_DETAIL where oid="+tk.getValue("id"));
                        trans.execNonQuery(MString.getUpdateStr("dbo.PRO_MS_RECEIVE", "cost=" + td.getValue("allSum") + ", realCost=" + td.getValue("usedSum"), tk.getInt("id")));
                        _usedSum += Convert.ToDouble(String.IsNullOrEmpty(td.getValue("usedSum")) ? "0.0" : td.getValue("usedSum"));
                        _sum += Convert.ToDouble(String.IsNullOrEmpty(td.getValue("allSum")) ? "0.0" : td.getValue("allSum"));
                    }
                    trans.execNonQuery(MString.getUpdateStr("dbo.PRO_MG", _update + "msPlanCost=" + _sum.ToString() + ", msRealCost=" + _usedSum.ToString(), "id=" + _proId));
                    _return = _proId;
                    trans.commit();
                }
                catch (Exception e)
                {
                    trans.rollback();
                    _return = Native.getErrorMsg(e.Message);
                }
                finally
                {
                    trans.close();
                }
                responseText = _return;
            }
            break;
        case "addSupplierApply":
            args = new string[,] { 
                { "json", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                /* 添加流程
                string _json = _args.getValue("json");
                string _wfId = (new WFIndex(Convert.ToInt32(115), baseApi)).addInstance("供应商申请流程", "View/project/Supplier.js");
                string [] _kv = MConvert.toKV(_json);
                responseText = baseApi.insert("PRO_SUPPLIER", _kv[0] + ",wfId", _kv[1] + "," + _wfId);*/
                string _json = _args.getValue("json");
                string[] _kv = MConvert.toKV(_json);
                responseText = baseApi.insert("PRO_SUPPLIER", _kv[0] + ",state", _kv[1] + ",748");
            }
            break;
        case "onSupplierApplyComplete":
            args = new string[,] { 
                { "sid", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateById("PRO_SUPPLIER", "state=748", _args.getInt("sid"));
            }
            break;
        case "setSupplier":
            args = new string[,] { 
                { "sid", null },
                { "rid", null },
                { "proId", null },
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                //string _sql = MString.getUpdateStr("PRO_MG", "msSupplierId=" + _args.getValue("sid"), "id=" + _args.getValue("proId"));
                string _sql = MString.getUpdateStr("PRO_MS_RECEIVE", "gongYingShang=" + _args.getValue("sid"), "id=" + _args.getValue("rid"));
                responseText = baseApi.execQuery(_sql);
            }
            break;
        default:
            responseText = Native.getErrorMsg("API不存在");
            break;
    }
    Native.writeToPage(responseText);
%>