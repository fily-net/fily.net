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
    string action = Native.getAction(), responseText = String.Empty;
    MySqlDBHelper help = new MySqlDBHelper("MySql_Release");
    MyBaseApi baseApi = new MyBaseApi(help);
    if (Native.isNullEmpty(Request["table"])) {Native.writeToPage(Native.getErrorMsg("字段\"table\"是必填参数")); return;}
    string T_TABLE = Request["table"].ToString();
    string[,] args;
    Json hash = null;
    Native.setDebug(Native.DEBUG_INFO);
    switch (action)
    {
        case "pagingForList":
            args = new string[,] {
                { "keyFields", "*" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "jsonCondition", ""},
                { "orderCondition", "{\"createTime\":\"desc\"}" },
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
                responseText = baseApi.execQuery(MySqlString.getSelectStr(T_TABLE, "top 8 "+hash.getValue("keyFields"), hash.getValue("key") + " like '%" + hash.getValue("value") + "%'"));
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
                //responseText = MySqlString.getSelectStr(T_TABLE, hash.getValue("keyFields"), "id=" + hash.getValue("id"));
                responseText = baseApi.execQuery(MySqlString.getSelectStr(T_TABLE, hash.getValue("keyFields"), "id="+hash.getValue("id")));
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
        case "addRows":
            args = new string[,] { 
                { "jsons", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                MySqlTrans _trans = new MySqlTrans(baseApi);
                try{
                    _trans.initTrans();
                    string[] _insertAry = hash.getValue("jsons").Split('※');
                    StringBuilder _ids = new StringBuilder();
                    for(int i =0, _len= _insertAry.GetLength(0); i<_len; i++){
                        string _str = _insertAry[i];
                        if(!Native.isEmpty(_str)){
                            string[] _kv = MConvert.toKV(_str);
                            string _id = _trans.execScalar(MySqlString.getInsertStr(T_TABLE, _kv[0], _kv[1], true));
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
        case "getListByPid":
            args = new string[,] { 
                { "pid", null },
                { "keyFields", "*" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _wSql = "pid=" + hash.getValue("pid");
                responseText = baseApi.queryTreeNodes(T_TABLE, hash.getValue("keyFields"), _wSql);
            }
            break;
        case "getListByCondition":
            args = new string[,] { 
                { "keyFields", "*" },
                { "jsonCondition", "1=1"}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery(MySqlString.getSelectStr(T_TABLE, hash.getValue("keyFields"), MConvert.toWhereSql(hash.getValue("jsonCondition"))));
            }
            break;
        default:
            responseText = Native.getErrorMsg("调用接口不存在");
            break;
    }
    Native.writeToPage(responseText); 
    
%>