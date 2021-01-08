<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="Fily.Util" %>
<% 
    string action = Native.getAction(), responseText = String.Empty;
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    string T_TABLE = "";
    string DB_NAME = "test"; // help.getDbName();
    string DB_PREFIX = "MPro_";
    string[,] args;
    Json hash = null;
    Native.setDebug(Native.DEBUG_INFO);
    switch (action)
    {
        case "getTableTemplate":
             args = new string[,] { 
                { "dbName", DB_NAME }, 
                { "keyFields", "Name" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("Select {keyFields} FROM {dbName}..SysObjects Where XType='U' and charindex('SYS_MT',name)=1 ORDER BY Name;", hash);
            }
            break;
        case "getAllProDBs":
            args = new string[,] { 
                { "keyFields", "Name" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("Select {0} FROM Master..SysDatabases where charindex('{1}',name)=1 ORDER BY Name;", hash.getValue("keyFields"), DB_PREFIX);
            }
            break;
        case "getAllTables":
            args = new string[,] { 
                { "dbName", DB_NAME }, 
                { "keyFields", "Name" },
                { "server_type", "local"}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _backup = "Select {keyFields} FROM {dbName}..SysObjects Where XType='U' and charindex('SYS_',name)=1 ORDER BY Name;";
                if (hash.getValue("server_type") == "local")
                {
                    responseText = baseApi.execQuery("Select {keyFields} FROM {dbName}..SysObjects Where XType='U' ORDER BY Name;", hash);
                }
                else {
                    DBHelper _help = new DBHelper(hash.getValue("server"), hash.getValue("db"), hash.getValue("uid"), hash.getValue("pwd"));
                    responseText = (new BaseApi(_help)).execQuery("Select " + hash.getValue("keyFields") + " FROM " + hash.getValue("db") + "..SysObjects Where XType='U' ORDER BY Name;");
                }
            }
            break;
        case "getAllFields":
            args = new string[,] {
                { "table", null },
                { "keyFields", "{index},{name},{ifMark},{ifPrimaryKey},{defaultValue},{type},{byte},{length},{decimalSize},{ifNull},{comment}" }
            };
            hash = Native.checkArgs(args, true);
            Native.setDebug(Native.DEBUG_INFO);
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
        case "getList":
            args = new string[,] {
                { "table", null },
                { "jsonCondition", "1=1" }, 
                { "keyFields", "*" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.select(hash.getValue("table"), hash.getValue("keyFields"), hash.getValue("jsonCondition"));
            }
            break;
        case "getTreeList":
            args = new string[,] {
                { "table", null },
                { "jsonCondition", "{\"pid\":1}" },
                { "keyFields", "*" }
            };
            Native.setDebug(Native.DEBUG_SQL);
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.queryTreeNodes(hash.getValue("table"), hash.getValue("keyFields"), MConvert.toWhereSql(hash.getValue("jsonCondition")));
            }
            break;
        case "updateByID":
            args = new string[,]{
                {"id", null},
                {"", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.update(hash.getValue("table"), MConvert.toUpdateSql(hash.getValue("jsonUpdate")), "id=" + hash.getValue("id"));
            }
            break;
        case "updateByCondition":
            args = new string[,]{
                { "table", null },
                {"jsonCondition", null},
                {"jsonUpdate", null}
            };
            Native.setDebug(Native.DEBUG_SQL);
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.update(hash.getValue("table"), MConvert.toUpdateSql(hash.getValue("jsonUpdate")), MConvert.toWhereSql(hash.getValue("jsonCondition")));
            }
            break;
        case "deleteByID":
            args = new string[,]{
                {"id", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.delete(T_TABLE, "id=" + hash.getValue("id"));
            }
            break;
        case "deleteByIDs":
            args = new string[,]{
                {"ids", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.delete(T_TABLE, "id in(" + hash.getValue("ids") + ")");
            }
            break;
        case "addRow":
            args = new string[,] { 
                { "jsonInsert", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string[] _kv = MConvert.toKV(hash.getValue("jsonInsert"));
                responseText = baseApi.insert(T_TABLE, _kv[0], _kv[1]);
            }
            break;
        case "addRows":
            args = new string[,] { 
                { "jsonInsert", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try{
                    _trans.initTrans();
                    string[] _insertAry = hash.getValue("jsonInsert").Split('※');
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
        case "emptyTable":
            args = new string[,] { 
                { "jsonInsert", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("truncate table {0};", T_TABLE);
            }
            break;
        case "getRightObjs":
            args = new string[,] { 
                { "jsonInsert", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string[] _kv = MConvert.toKV(hash.getValue("jsonInsert"));
                responseText = baseApi.insert(T_TABLE, _kv[0], _kv[1]);
            }
            break;
        default:
            responseText = Native.getErrorMsg("调用接口不存在");
            break;
    }
    Native.writeToPage(responseText); 
    
%>