<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
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
    string T_HT = "TZ_HT", T_GT = "SYS_CM_GLOBAL_TABLE", T_SYS_FILE = "SYS_CM_FILES";
    string[,] args;
    Json _args = null;
    switch (action) {
        case "pagingForList":
            args = new string[,] { 
                { "fileName", T_HT },
                { "keyFields", "*" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "jsonCondition", "1=1"},
                { "orderCondition", "{\"cTime\":\"desc\"}" },
                { "filterCondition", "" },
                { "delFlag", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {

                string _where = MConvert.toWhereSql(_args.getValue("jsonCondition")), _filter = MConvert.toFilterSql(_args.getValue("filterCondition"));
                if (_where.Length > 0 && _filter.Length > 0)
                {
                    _where += " and " + _filter;
                }
                else if (_filter.Length > 0)
                {
                    _where = _filter;
                }
                string _strDownload = Request["jsonDownload"];
                if (!Native.isNullEmpty(_strDownload)) { baseApi.setRSplit("\r\n\""); baseApi.setCSplit(","); }
                responseText = baseApi.paging(T_HT, _args.getInt("pageIndex"), _args.getInt("pageSize"), _args.getValue("keyFields"), _where, MConvert.toOrderSql(_args.getValue("orderCondition")), _args.getInt("delFlag"));
                if (!Native.isNullEmpty(_strDownload))
                {
                    string _strContent = MConvert.toKV(_strDownload)[1] + "\r\n\"" + responseText + "\"";
                    MFile.exportCsv(_args.getValue("fileName") + ".csv", _strContent);
                }
            }
            break;
        case "changeHTState"://更新合同状态
            args = new string[,] { 
                { "htId", null },
                { "state", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateById("TZ_HT", "state=" + _args.getValue("state"), _args.getInt("htId"));
            }
            break;
        case "newHeTong"://新建合同
            args = new string[,] { 
                { "json", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                Native.setDebug(Native.DEBUG_ERROR);
                string _sJson = _args.getValue("json"), _wfId = "0";
                int _wfIdx = MConvert.getInt(_sJson, "htType");
                if (_wfIdx != 0) { _wfId = (new WFIndex(_wfIdx, baseApi)).addInstance("合同会签流程"); }
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string[] _kv = MConvert.toKV(_sJson);
                    string _users = _trans.execScalar(MString.getSelectStr("SYS_WF_INSTANCE", "owner", "id=" + _wfId));
                    responseText = _trans.addRow("TZ_HT", _kv[0] + ",wfId,users,observers", _kv[1] + "," + _wfId + ",'" + _users + "','" + _users + "'");
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
        case "NEWFIREWF"://新建消防器具任务
            args = new string[,] { 
                { "json", null },
                { "tid", "TZ_FIRE_WF" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sJson = _args.getValue("json"), _wfId = "0";
                int _wfIdx = MConvert.getInt(_sJson, "wfTypeId");
                if (_wfIdx != 0) { _wfId = (new WFIndex(_wfIdx, baseApi)).addInstance(MConvert.getString(_sJson, "title")); }
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string[] _kv = MConvert.toKV(_sJson);
                    string _users = _trans.execScalar(MString.getSelectStr("SYS_WF_INSTANCE", "owner", "id="+_wfId));
                    string _k = _kv[0] + ",wfId,users,observers", _v = _kv[1] + "," + _wfId + ",'" + _users + "','" + _users + "'";
                    _trans.execNonQuery(MString.getInsertStr(_args.getValue("tid"), _k, _v));
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
        case "updateValid"://更新消防器具有效期
            args = new string[,] { 
                { "rId", null },
                { "RT", "TZ_FIRE_WARE" },
                { "tId", null },
                { "TT", "TZ_FIRE_WF" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    _trans.execNonQuery(MString.getUpdateStr(_args.getValue("RT"), "repairTime=dateadd(month,validMonth,getdate())", "id=" + _args.getValue("rId")));
                    _trans.execNonQuery(MString.getUpdateStr(_args.getValue("TT"), "state=334", "id=" + _args.getValue("tId")));
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
        case "updateTaskState":
            args = new string[,] { 
                { "users", null },
                { "id", null },
                { "tid", "TZ_FIRE_WF" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _users = _args.getString("users");
                responseText = baseApi.updateById(_args.getValue("tid"), "users='" + _users + "',observers=observers+'" + _users + "',state=335", _args.getInt("id"));
            }
            break;
        case "NEWZCWF"://新建资产任务
            args = new string[,] { 
                { "json", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sJson = _args.getValue("json"), _wfId = "0";
                int _wfIdx = MConvert.getInt(_sJson, "type");
                if (_wfIdx != 0) { _wfId = (new WFIndex(_wfIdx, baseApi)).addInstance("资产流程"); }
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string[] _kv = MConvert.toKV(_sJson);
                    string _k = _kv[0] + ",wfId", _v = _kv[1] + "," + _wfId;
                    _trans.execNonQuery(MString.getInsertStr("TZ_ZICHAN_WF", _k, _v));
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
        case "getAttachs":
            args = new string[,] {
                { "keyFields", null },
                { "proId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                
            }
            break;
        default:
            responseText = Native.getErrorMsg("API不存在");
            break;
    }
    Native.writeToPage(responseText);
%>