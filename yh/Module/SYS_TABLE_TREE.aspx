<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Meeko.Base" %>
<%@ Import Namespace="Meeko.Data" %>
<%@ Import Namespace="Meeko.JSON" %>
<%@ Import Namespace="Meeko.IO" %>
<%@ Import Namespace="Meeko.Util" %>
<% 
    DBHelper help = new DBHelper("MPro_Release");
    BaseApi baseApi = new BaseApi(help); Native.setDebug(Native.DEBUG_INFO);
    string action = Native.getAction(), responseText = String.Empty;
    if (Native.isNullEmpty(Request["table"])) {Native.writeToPage(Native.getErrorMsg("字段\"table\"是必填参数")); return;}
    string T_TABLE = Request["table"].ToString();
    string[,] args;
    Json hash = null;
    switch (action)
    {
        case "pagingForTreeList":
            args = new string[,] { 
                { "fileName", T_TABLE },
                { "keyFields", "*" }, 
                { "pageIndex", "1" }, 
                { "pageSize", "10" },
                { "jsonCondition", "1=1" }, 
                { "jsonOrder", "id" },
                { "delFlag", "0" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _strDownload = Request["jsonDownload"];
                responseText = baseApi.paging(T_TABLE, hash.getInt("pageIndex"), hash.getInt("pageSize"), hash.getValue("keyFields"), MConvert.toWhereSql(hash.getValue("jsonCondition")), MConvert.toOrderSql(hash.getValue("jsonOrder")), hash.getInt("delFlag"));
                if (!Native.isNullEmpty(_strDownload))
                {
                    string _strContent = MConvert.toKV(_strDownload)[1] + "\r\n\"" + responseText + "\"";
                    MFile.exportCsv(hash.getValue("fileName") + ".csv", _strContent);
                }
            }
            break;
        case "pagingListByPid":
            args = new string[,] { 
                { "fileName", T_TABLE },
                { "keyFields", "*" }, 
                { "pageIndex", "1" }, 
                { "pageSize", "10" },
                { "pid", null }, 
                { "jsonOrder", "id" },
                { "delFlag", "0" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _strDownload = Request["jsonDownload"];
                Native.setDebug(Native.DEBUG_INFO);
                responseText = baseApi.paging(T_TABLE, hash.getInt("pageIndex"), hash.getInt("pageSize"), hash.getValue("keyFields"), "pid=" + hash.getValue("pid"), MConvert.toOrderSql(hash.getValue("jsonOrder")), hash.getInt("delFlag"));
                if (!Native.isNullEmpty(_strDownload))
                {
                    string _strContent = MConvert.toKV(_strDownload)[1] + "\r\n\"" + responseText + "\"";
                    MFile.exportCsv(hash.getValue("fileName") + ".csv", _strContent);
                }
            }
            break;
        case "getTreeListByCondition":
            args = new string[,] { 
                { "jsonCondition", null},
                { "keyFields", "*" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.queryTreeNodes(T_TABLE, hash.getValue("keyFields"), MConvert.toWhereSql(hash.getValue("jsonCondition")));
            }
            break;
        case "getNodesByPids":
            args = new string[,] { 
                { "pids", null },
                { "keyFields", "*" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string[] ids = hash.getValue("pids").Split(',');
                string _sql = "", _kf = hash.getValue("keyFields");
                for (int i = 0, _iLen = ids.Length; i < _iLen; i++) { 
                    _sql += "select " + _kf + " from "+T_TABLE+" where pid="+ids[i]+";";
                }
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "getNodeByID":
            args = new string[,] { 
                { "id", null },
                { "keyFields", "*" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.select(T_TABLE, hash.getValue("keyFields"), "id=" + hash.getValue("id"));
            }
            break;
        case "getTreeListByPid":
        case "getNodesByPid":
            args = new string[,] { 
                { "pid", null },
                { "keyFields", "*" },
                { "ifRights", "0" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _wSql = "pid=" + hash.getValue("pid");
                if (hash.getValue("ifRights") != "0") { _wSql += " and dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', users,roles,cPerson)<>0"; }
                responseText = baseApi.queryTreeNodes(T_TABLE, hash.getValue("keyFields"), _wSql);
            }
            break;
        case "getRightsNodesByPid":
            args = new string[,] { 
                { "pid", null },
                { "keyFields", "*" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _wSql = "pid=" + hash.getValue("pid")+" and dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', users,roles,cPerson)<>0";
                responseText = baseApi.queryTreeNodes(T_TABLE, hash.getValue("keyFields"), _wSql);
            }
            break;
        case "getNodesByCondition":
            args = new string[,] { 
                { "jsonCondition", null},
                { "keyFields", "*" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.queryTreeNodes(T_TABLE, hash.getValue("keyFields"), MConvert.toWhereSql(hash.getValue("jsonCondition")));
            }
            break;
        case "orderNode":
            args = new string[,]{
                {"id", null},
                {"order", "1"}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.orderTreeNode(T_TABLE, hash.getInt("id"), hash.getValue("order"));
            }
            break;
        case "updateNodeByID":
            args = new string[,]{
                {"id", null},
                {"json", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateTreeNode(T_TABLE, MConvert.toUpdateSql(hash.getValue("json")), hash.getInt("id"));
            }
            break;
        case "updateNodeByCondition":
            args = new string[,]{
                {"jsonCondition", null},
                {"jsonUpdate", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.update(T_TABLE, MConvert.toUpdateSql(hash.getValue("jsonUpdate")), MConvert.toWhereSql(hash.getValue("jsonCondition")));
            }
            break;
        case "addTreeNode":
            args = new string[,] { 
                { "json", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.addTreeNode(T_TABLE, hash.getValue("json"));
            }
            break;
        case "addTreeNodeByPid":
            args = new string[,] { 
                { "json", null }, {"pid", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.addTreeNode(T_TABLE, hash.getInt("pid"), hash.getValue("json"));
            }
            break;
        case "addTreeNodesByPid":
            args = new string[,] { 
                { "rows", null }, {"pid", null}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try {
                    string [] _rowAry = hash.getValue("rows").Split(baseApi.getRSplit().ToCharArray());
                    for(int i=0, _len = _rowAry.Length; i<_len; i++){
                        responseText = _trans.addTreeNode(T_TABLE, hash.getInt("pid"), "nodeName", "'"+_rowAry[i]+"'");
                    }
                    _trans.commit();
                    
                }catch(Exception e){
                    responseText = Native.getErrorMsg(e.Message);
                    _trans.rollback();
                }finally{
                    _trans.rollback();
                }
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
        case "delTreeNode":
            args = new string[,] { 
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.deleteTreeNode(T_TABLE, hash.getInt("id"));
            }
            break;
        case "moveTreeNode":
            args = new string[,] { 
                { "id", null },
                { "pid", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                Native.setDebug(Native.DEBUG_SQL);
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    _trans.moveTreeNode(T_TABLE, hash.getInt("id"), hash.getInt("pid"));
                    _trans.commit();
                }
                catch (Exception e)
                {
                    responseText = Native.getErrorMsg(e.Message);
                    _trans.rollback();
                }
                finally {
                    _trans.close();
                }
            }
            break;
        case "emptyTable":
            responseText = baseApi.emptyTable(T_TABLE);
            break;
        default:
            responseText = Native.getErrorMsg("调用接口不存在");
            break;
    }
    Native.writeToPage(responseText); 
    
%>