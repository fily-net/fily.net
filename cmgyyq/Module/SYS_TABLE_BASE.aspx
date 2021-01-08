 <%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="Fily.Util" %>
<%@ Import Namespace="Fily.WorkFlow" %>
<% 
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    string action = Native.getAction(), responseText = String.Empty;
    if (Native.isNullEmpty(Request["table"])) {Native.writeToPage(Native.getErrorMsg("字段\"table\"是必填参数")); return;}
    string T_TABLE = Request["table"].ToString();
    string[,] args;
    Json hash = null;
    switch (action)
    {
        case "pagingForList":
            args = new string[,] { 
                { "fileName", T_TABLE },
                { "keyFields", "*" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "jsonCondition", ""},
                { "orderCondition", "{\"cTime\":\"desc\"}" },
                { "filterCondition", "" },
                { "delFlag", "0" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {

                string _where = MConvert.toWhereSql(hash.getValue("jsonCondition")), _filter = MConvert.toFilterSql(hash.getValue("filterCondition").Trim());
                if (_where.Length > 0 && _filter.Length > 0)
                {
                    _where += " and " + _filter;
                }
                else if (_filter.Length > 0)
                {
                    _where = _filter;
                }
                string _strDownload = Request["jsonDownload"], _title = String.Empty;
                if (!Native.isNullEmpty(_strDownload)) { baseApi.setRSplit("\r\n\""); baseApi.setCSplit(","); _title = MConvert.toKV(_strDownload)[1].Replace("'", ""); }
                responseText = baseApi.paging(T_TABLE, hash.getInt("pageIndex"), hash.getInt("pageSize"), hash.getValue("keyFields"), _where, MConvert.toOrderSql(hash.getValue("orderCondition")), hash.getInt("delFlag"));
                if (!Native.isNullEmpty(_strDownload))
                {
                    string _strContent = _title + "\r\n" + responseText.Split(baseApi.getReSplit().ToCharArray())[0].Replace("&", "-").Replace(baseApi.getRSplit(), "\r\n");
                    MFile.exportCsv(hash.getValue("fileName") + ".csv", _strContent);
                    return;
                }
            }
            break;
        case "pagingForRightsWFList":
            args = new string[,] { 
                { "fileName", T_TABLE },
                { "keyFields", "*" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "jsonCondition", "1=1"},
                { "orderCondition", "{\"cTime\":\"desc\"}" },
                { "filterCondition", "" },
                { "delFlag", "0" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _where = MConvert.toWhereSql(hash.getValue("jsonCondition")), _filter = MConvert.toFilterSql(hash.getValue("filterCondition"));
                if (_where.Length > 0 && _filter.Length > 0)
                {
                    _where += " and " + _filter;
                }
                else if (_filter.Length > 0)
                {
                    _where = _filter;
                }
                string _strDownload = Request["jsonDownload"], _title = String.Empty;
                if (!Native.isNullEmpty(_strDownload)) { baseApi.setRSplit("\r\n\""); baseApi.setCSplit(","); _title = MConvert.toKV(_strDownload)[1].Replace("'", ""); }
                responseText = baseApi.paging(T_TABLE, hash.getInt("pageIndex"), hash.getInt("pageSize"), hash.getValue("keyFields"), _where + " and dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', users+observers,roles,cPerson)<>0", MConvert.toOrderSql(hash.getValue("orderCondition")), hash.getInt("delFlag"));
                if (!Native.isNullEmpty(_strDownload))
                {
                    string _strContent = _title + "\r\n" + responseText.Split(baseApi.getReSplit().ToCharArray())[0].Replace(baseApi.getRSplit(), "\r\n");
                    MFile.exportCsv(hash.getValue("fileName") + ".csv", _strContent);
                    return;
                }
            }
            break;
        case "getRightsListByPid":
            args = new string[,] { 
                { "pid", null },
                { "keyFields", "*" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _wSql = "pid=" + hash.getValue("pid") + " and (ifRights=0 or (ifRights=1 and dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', users,roles,cPerson)<>0))";
                responseText = baseApi.queryTreeNodes(T_TABLE, hash.getValue("keyFields"), _wSql);
            }
            break;
        case "getManagerRightsList":
            args = new string[,] { 
                { "keyFields", "*" },
                { "jsonCondition", "1=1"}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery(MString.getManagerRightsSelectStr(T_TABLE, hash.getValue("keyFields"), MConvert.toWhereSql(hash.getValue("jsonCondition"))));
            }
            break;
        case "queryReport":
            args = new string[,] { 
                { "fileName", T_TABLE },
                { "keyFields", "*" },
                { "begin", DateTime.Now.Year.ToString() + "-"+  DateTime.Now.Month.ToString() + "-01" },
                { "end", DateTime.Now.Year.ToString() + "-"+  (DateTime.Now.Month+1).ToString() + "-01" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "jsonCondition", ""},
                { "orderCondition", "{\"cTime\":\"desc\"}" },
                { "filterCondition", "" },
                { "delFlag", "0" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _where = MConvert.toWhereSql(hash.getValue("jsonCondition")), _filter = MConvert.toFilterSql(hash.getValue("filterCondition").Trim());
                if (_where.Length > 0 && _filter.Length > 0)
                {
                    _where += " and " + _filter;
                }
                else if (_filter.Length > 0)
                {
                    _where = _filter;
                }
                if (!Native.isEmpty(_where)) { _where += " and "; }
                _where += " (mTime between '" + hash.getValue("begin") + "' and '" + hash.getValue("end") + "')";
                string _strDownload = Request["jsonDownload"], _title = String.Empty;
                if (!Native.isNullEmpty(_strDownload)) { baseApi.setRSplit("\r\n\""); baseApi.setCSplit(","); _title = MConvert.toKV(_strDownload)[1].Replace("'", ""); }
                responseText = baseApi.paging(T_TABLE, hash.getInt("pageIndex"), hash.getInt("pageSize"), hash.getValue("keyFields"), _where, MConvert.toOrderSql(hash.getValue("orderCondition")), hash.getInt("delFlag"));
                if (!Native.isNullEmpty(_strDownload))
                {
                    string _strContent = _title + "\r\n" + responseText.Split(baseApi.getReSplit().ToCharArray())[0].Replace(baseApi.getRSplit(), "\r\n");
                    MFile.exportCsv(hash.getValue("fileName") + ".csv", _strContent);
                    return;
                }
            }
            break;
        case "likeQueryKey":
            args = new string[,] { 
                { "keyFields", "*" },
                { "key",  null },
                { "value",  null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery(MString.getSelectStr(T_TABLE, "top 8 "+hash.getValue("keyFields"), hash.getValue("key") + " like '%" + hash.getValue("value") + "%'"));
            }
            break;
        case "updateRights":
            args = new string[,] { 
                { "users", null },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _users = hash.getString("users");
                responseText = baseApi.updateById(T_TABLE, "users='" + _users + "',observers=observers+'" + _users + "'", hash.getInt("id"));
            }
            break;
        case "getAllFields":
            args = new string[,] {
                { "table", null },
                { "keyFields", "name" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.getTableFields(hash.getValue("table"), hash.getValue("keyFields"));
            }
            break;
        case "getTableInfo":
            args = new string[,] {
                { "table", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.getTableInfo(hash.getValue("table"));
            }
            break;
        case "getByID":
            args = new string[,] { 
                { "id", null },
                { "keyFields", "*" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery(MString.getSelectStr(T_TABLE, hash.getValue("keyFields"), "id="+hash.getValue("id")));
            }
            break;
        case "getByCondition":
            args = new string[,] { 
                { "jsonCondition", "1=1"},
                { "keyFields", "*" },
                { "orderCol", "cTime" },
                { "order", "desc" },
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.select(T_TABLE, hash.getValue("keyFields"), MConvert.toWhereSql(hash.getValue("jsonCondition")), hash.getValue("orderCol"), hash.getValue("order"));
            }
            break;
        case "updateByID":
            args = new string[,]{
                {"id", null},
                {"json", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.update(T_TABLE, MConvert.toUpdateSql(hash.getValue("json")), "id=" + hash.getValue("id"));
            }
            break;
        case "updateByCondition":
            args = new string[,]{
                {"jsonCondition", null},
                {"json", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.update(T_TABLE, MConvert.toUpdateSql(hash.getValue("json")), MConvert.toWhereSql(hash.getValue("jsonCondition")));
            }
            break;
        case "deleteByID":
            args = new string[,]{
                {"id", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.deleteById(T_TABLE, hash.getInt("id"));
            }
            break;
        case "deleteByCondition":
            args = new string[,]{
               {"jsonCondition", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.delete(T_TABLE, MConvert.toWhereSql(hash.getValue("jsonCondition")));
            }
            break;
        case "deleteByIDs":
            args = new string[,]{
                {"ids", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.deleteByIds(T_TABLE, hash.getValue("ids"));
            }
            break;
        case "reStoreById":
            args = new string[,]{
                {"id", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.reStoreById(T_TABLE, hash.getInt("id"));
            }
            break;
        case "reStoreByCondition":
            args = new string[,]{
               {"jsonCondition", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.reStore(T_TABLE, MConvert.toWhereSql(hash.getValue("jsonCondition")));
            }
            break;
        case "reStoreByIds":
            args = new string[,]{
                {"ids", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.reStoreByIds(T_TABLE, hash.getValue("ids"));
            }
            break;
        case "addRow":
            args = new string[,] { 
                { "json", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string[] _kv = MConvert.toKV(hash.getValue("json"));
                responseText = baseApi.insert(T_TABLE, _kv[0], _kv[1]);
            }
            break;
        case "addWorkFlowRow":
            args = new string[,] { 
                { "json", null },
                { "wfIndexId", "0" },
                { "url", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                

                string _sJson = hash.getValue("json"), _wfId = "0";
                int _wfIdx = 0;
                if (MConvert.existKey(_sJson, "wfTypeId")) { _wfIdx = MConvert.getInt(_sJson, "wfTypeId"); }
                if (_wfIdx == 0 && hash.ContainsKey("wfIndexId")) { _wfIdx = hash.getInt("wfIndexId"); }
                if (_wfIdx != 0) { _wfId = (new WFIndex(_wfIdx, baseApi)).addInstance(MConvert.getString(_sJson, "title"), hash.getValue("url")); }
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string[] _kv = MConvert.toKV(_sJson);
                    string _users = _trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                    string _k = _kv[0] + ",wfId,users,observers", _v = _kv[1] + "," + _wfId + ",'" + _users + "','" + _users + "'";
                    responseText = _trans.execNonQuery(MString.getInsertStr(T_TABLE, _k, _v, true)).ToString();
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
        case "addRowWithAttachment":
            args = new string[,] { 
                { "json", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _sJson = hash.getValue("json"), _link = MConvert.getString(_sJson, "link");
                    string[] _kv = MConvert.toKV(_sJson);
                    string _sql = String.Empty;
                    responseText = _trans.execScalar(MString.getInsertStr(T_TABLE, _kv[0], _kv[1], true));
                    if (!Native.isEmpty(_link)) {
                        string[] _ids = _link.Split(',');
                        for (int i=0, _iLen = _ids.Length; i < _iLen; i++) { 
                            string _id = _ids[i];
                            if (!Native.isEmpty(_id)) { _sql += "update {0} set instanceId={1} where id="+_id+";"; }
                        }
                    }
                   // _trans.execNonQuery(_sql, "SYS_CM_FILES_UPLOAD", responseText);
                    _trans.commit();
                }
                catch (Exception e)
                {
                    _trans.rollback();
                    responseText = Native.getErrorMsg(e.Message);
                }
                finally {
                    _trans.close();
                }
            }
            break;
        case "addRows":
            args = new string[,] { 
                { "jsons", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try{
                    _trans.initTrans();
                    string[] _insertAry = hash.getValue("jsons").Split('※');
                    StringBuilder _ids = new StringBuilder();
                    for(int i =0, _len= _insertAry.GetLength(0); i<_len; i++){
                        string _str = _insertAry[i];
                        if(!Native.isEmpty(_str)){
                            string[] _kv = MConvert.toKV(_str);
                            string _id = _trans.execScalar(MString.getInsertStr(T_TABLE, _kv[0], _kv[1], true));
                            _ids.Append(_id+",");
                        }
                    }
                    _ids.Remove(_ids.Length-1, 1);
                    responseText = _ids.ToString();
                    _trans.commit();
                }catch(Exception e){
                    responseText = e.Message;
                    _trans.rollback();
                }finally{
                    _trans.close();
                }
            }
            break;
        case "deleteByOid":
            args = new string[,] { 
                { "oid", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.delete(T_TABLE, "oid=" + hash.getValue("oid"));
            }
            break;
        case "updateFilesById":
            args = new string[,] { 
                { "id", null },
                { "link", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateById(T_TABLE, "link=link+'" + hash.getValue("link") + ",'", hash.getInt("id"));
            }
            break;
        case "getFilesById":
            args = new string[,] { 
                { "keyFields", "*" },
                { "jsonCondition", "1=1" }, 
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _whereSql = MConvert.toWhereSql(hash.getValue("jsonCondition")) + " and charindex(','+cast(id as varchar(10))+',',(select link from " + T_TABLE + " as temp where temp.id="+hash.getValue("id")+"))<>0";
                responseText = baseApi.select(R.Table.CM_FILES, hash.getValue("keyFields"), _whereSql);
            }
            break;
        case "emptyTable":
            responseText = baseApi.emptyTable(T_TABLE);
            break;
        case "updateWFRights":
            args = new string[,] { 
                { "users", null },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _users = hash.getString("users");
                responseText = baseApi.execQuery(MString.getUpdateStr(T_TABLE, "users='" + _users + "',observers=observers+'" + _users + "'", hash.getInt("id")));
            }
            break;
        default:
            responseText = Native.getErrorMsg("调用接口不存在");
            break;
    }
    Native.writeToPage(responseText); 
    
%>