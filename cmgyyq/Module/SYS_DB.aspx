<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="Fily.Util" %>
<% 
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    string action = Native.getAction(), responseText = String.Empty;
    string DB_PREFIX = "MPro_";
    string[,] args;
    Json hash = null;
    switch (action)
    {
        
        case "getAllDBs":
            args = new string[,] { 
                { "keyFields", "Name" },
                { "server_type", "local" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                if (hash.getValue("server_type") == "local")
                {
                    responseText = baseApi.execQuery("Select {0} FROM Master..SysDatabases ORDER BY Name;", hash.getValue("keyFields"));
                }
                else
                {
                    DBHelper _help = new DBHelper(Request["server"], "Master", Request["uid"], Request["pwd"]);
                    responseText = (new BaseApi(_help)).execQuery("Select {0} FROM Master..SysDatabases ORDER BY Name;", hash.getValue("keyFields"));
                }
            }
            break;
        case "getAllProDBs":
            args = new string[,] { 
                { "keyFields", "Name" },
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("Select {0} FROM Master..SysDatabases where charindex('{1}',name)=1 ORDER BY Name;", hash.getValue("keyFields"), DB_PREFIX);
            }
            break;
        case "getAllTables":
            args = new string[,] { 
                { "DBName", null }, 
                { "keyFields", "Name" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("Select {keyFields} FROM {DBName}..SysObjects Where XType='U' and charindex('SYS_',name)=1 ORDER BY Name;", hash);
            }
            break;
        case "createDBByCopy":
            Native.setDebug(Native.DEBUG_ERROR);
            args = new string[,] {
                { "DBName", null },
                { "DBPath", "E:\\Code\\DB\\ForSqlServer"}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                baseApi.createDBByCopy(DB_PREFIX+hash.getValue("DBName"), hash.getValue("DBPath"));
            }
            break;
        case "setDBOffline":
            args = new string[,] {
                { "DBName", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                baseApi.setDBOffline(hash.getValue("DBName"));
            }
            break;
        case "setDBOnline":
            args = new string[,] {
                { "DBName", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                baseApi.setDBOnline(hash.getValue("DBName"));
            }
            break;
        default:
            responseText = Native.getErrorMsg("调用接口不存在");
            break;
    }
    Native.writeToPage(responseText); 
    
%>