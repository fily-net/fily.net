<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="Fily" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.Util" %>
<%@ Import Namespace="Fily.Office" %>
<% 
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    string action = Native.getAction(), responseText = String.Empty;
    string [,] args;
    Json _args = null;
    switch (action) {
        case "readAttach":
            args = new string[,] { 
                { "fid", "1" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                try
                {
                    responseText = OfficeReader.ReadWord(Server.MapPath("./uploads/docmg/2015100109080019059.doc"));
                }
                catch (Exception e) {
                    responseText = e.Message;
                }
                
            }
            break;
        default :
            responseText = Native.getErrorMsg("请求接口不存在");
            break;
    }
    Native.writeToPage(responseText);  
%>