<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Meeko" %>
<%@ Import Namespace="Meeko.Base" %>
<%@ Import Namespace="Meeko.Data" %>
<%@ Import Namespace="Meeko.JSON" %>
<%@ Import Namespace="Meeko.IO" %>
<%@ Import Namespace="Meeko.Util" %>
<%@ Import Namespace="Meeko.WorkFlow" %>
<% 
    string action = Native.getAction(), responseText = String.Empty;
    DBHelper help = new DBHelper("MPro_Release");
    BaseApi baseApi = new BaseApi(help);
    string[,] args;
    Json _args = null;
    switch (action) {
        case "addProject":
            args = new string[,] { 
                { "json", null },
                { "dept", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _users = _trans.execScalar(MString.getSelectStr(R.Table.CM_GLOBAL_TABLE, "users", _args.getInt("dept")));
                    string[] _kv = MConvert.toKV(_args.getValue("json"));
                    responseText = _trans.addRow(R.Table.PRO_MG, _kv[0] + ",users,observers", _kv[1] + ",'" + _users + "','" + _users + "'");
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
        case "saveProjectMete":
            args = new string[,] { 
                { "proId", null },
                { "planCost", "0" },
                { "realCost", "0" },
                { "wfIdx", "0" },
                { "jsons", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string[] _sVal = _args.getValue("jsons").Split('\u0002');
                StringBuilder _sql = new StringBuilder();
                Native.setDebug(Native.DEBUG_ERROR);
                string _wfId = String.Empty, _wfIdx = _args.getValue("wfIdx"), _taskId = String.Empty, _proId = _args.getValue("proId"), _update = String.Empty, _users = String.Empty;
                if (_wfIdx != "0") {
                    _wfId = (new WFIndex(Convert.ToInt32(_wfIdx), baseApi)).addInstance("分包结算申请");
                    _users = baseApi.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                    _taskId = baseApi.insert("dbo.PRO_SC_COST_COUNT", "proId,wfId,users,observers", _proId + "," + _wfId + ",'" + _users + "','" + _users + "'");
                }
                for (int i = 0, _len = _sVal.Length; i < _len; i++)
                {
                    if (!Native.isEmpty(_sVal[i])) {
                        string[] _kv = MConvert.toKV(_sVal[i]);
                        _sql.Append(MString.getInsertStr("PRO_SC_COST", _kv[0], _kv[1]));
                    }
                }
                if (_args.getValue("planCost") != "0") { _update = "planCost=" + _args.getValue("planCost"); }
                if (!Native.isEmpty(_taskId)){
                    if (!Native.isEmpty(_update)){ _update += ",";}
                    _update += "accountWfId=" + _taskId + ", users='" + _users + "', observers=observers + '" + _users + "', state=509, realCost=" + _args.getValue("realCost");
                }
                if (!Native.isEmpty(_update)){ _sql.Append(MString.getUpdateStr(R.Table.PRO_MG, _update, _args.getInt("proId"))); }
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
                int _cState = _args.getInt("currState"), _nState = _cState + 1;
                switch (_cState)
                { 
                    case 506:
                        Native.setDebug(Native.DEBUG_ERROR);
                        if (MConvert.existKey(_json, "execTeam"))
                        {
                            _wfId = (new WFIndex(107, baseApi)).addInstance("分包申请");
                            _updateSql += ",wfId=" + _wfId;
                            _taskId = baseApi.insert("dbo.PRO_SC_APPLY", "proId,wfId,companyId", _id + "," + _wfId + "," + MConvert.getValue(_json, "execTeam"));
                        }
                        else
                        {
                            _updateSql += ",state=" + _nState;
                        }
                        break;
                    case 507:
                        _updateSql += ",state=" + _nState;
                        break;
                    case 508:

                        break;
                    case 509:

                        break;
                    case 510:

                        break;
                    case 511:

                        break;
                }
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    if (!Native.isEmpty(_wfId)) { 
                        _users = _trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                        _updateSql += ",users=',',observers=observers+'" + _users + "'";
                        _trans.execNonQuery(MString.getUpdateStr("dbo.PRO_SC_APPLY", "users='" + _users + "',observers=observers+'" + _users + "'", Convert.ToInt32(_taskId)));
                    }
                    _trans.execNonQuery(MString.getUpdateStr(R.Table.PRO_MG, _updateSql, "id="+_id));
                    responseText = _id;
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
        default:
            responseText = Native.getErrorMsg("API不存在");
            break;
    }
    Native.writeToPage(responseText);
%>