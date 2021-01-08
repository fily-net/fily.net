<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="Meeko.Base" %>
<%@ Import Namespace="Meeko.Data" %>
<%@ Import Namespace="Meeko.IO" %>
<%@ Import Namespace="Meeko.JSON" %>
<%@ Import Namespace="Meeko.Util" %>
<% 
    DBHelper help = new DBHelper("MPro_Release");
    BaseApi baseApi = new BaseApi(help);
    string action = Native.getAction(), responseText = String.Empty, T_VIEW = "SYS_CM_UI";
    MFile mFile = new MFile();
    string[,] args;
    Json hash = null;
    switch (action) { 
        case "getAllIcon":
            responseText = mFile.readIcon("css/icon.css");
            break;
        case "getViewList":
            args = new string[,] { 
                { "keyFields", "*" },
                { "jsonCondition", "{\"pid\":1}" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.selectTree(T_VIEW, hash.getValue("keyFields"), MConvert.toWhereSql(hash.getValue("jsonCondition")));
            }
            break;
        case "getById":
            args = new string[,] { 
                { "keyFields", "*" },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.selectTree(T_VIEW, hash.getValue("keyFields"), "id=" + hash.getValue("id"));
            }
            break;
        case "updateViewById":
            args = new string[,] { 
                { "chartArgs", null },
                { "comArgs", null },
                { "structArgs", null },
                { "varArgs", null },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateTreeNode(T_VIEW, "chartArgs='" + hash.getValue("chartArgs") + "',comArgs='" + hash.getValue("comArgs") + "',structArgs='" + hash.getValue("structArgs") + "',varArgs='" + hash.getValue("varArgs") + "'", "id=" + hash.getValue("id"));
            }
            break;
        default:
            responseText = Native.getErrorMsg("api或action不存在");
            break;
    }
    Native.writeToPage(responseText);
%>