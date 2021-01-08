<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="Fily.WorkFlow" %>
<%@ Import Namespace="Fily.Util" %>
<%@ Import Namespace="Fily.Depository" %>
<% 
    
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    string action = Native.getAction(), responseText = String.Empty;
    string T_MS = R.Table.WH_MS, T_STOCK = R.Table.WH_MS_STOCK, T_BATCH = R.Table.WH_MS_BATCH;
    string [,] args;
    Json _args = null;
    switch (action) {
        case "create":
            args = new string[,] { 
                { "json", null },
                { "type", null },
                { "wfIdx", null },
                { "MSInfos", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                ProjectTicket ticket = new ProjectTicket(baseApi);
                string tk_form = _args.getValue("json"), MSInfos = _args.getValue("MSInfos");
                int wfIdx = _args.getInt("wfIdx");
                switch (_args.getValue("type")) { 
                    case "receive":
                        responseText = ticket.receive(tk_form, MSInfos, wfIdx);
                        break;
                    case "back":
                        responseText = ticket.back(tk_form, MSInfos, wfIdx);break;
                }
            }
            break;
        case "getMSDetailForTK":
            args = new string[,] { 
                { "keyFields", "*" },
                { "jsonCondition", "1=1" }, 
                { "type", null },
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sql = "select {0} from dbo.SYS_WH_MS ms left join dbo.{1}_DETAIL detail on ms.id=detail.msId where detail.oid={2} and " + MConvert.toWhereSql(_args.getValue("jsonCondition")) + ";";
                responseText = baseApi.execQuery(_sql, _args.getValue("keyFields"), _args.getValue("type"), _args.getValue("tkId"));
            }
            break;
        case "onReceiveComplete":
            args = new string[,] { 
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = new Ticket(baseApi).onReceiveComplete(_args.getValue("tkId"));
            }
            break;
        case "onBackComplete":
            args = new string[,] { 
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = new Ticket(baseApi).onBackComplete(_args.getValue("tkId"));
            }
            break;
        case "getBackMSDetail":
            args = new string[,] { 
                { "keyFields", "*" },
                { "msId", null },
                { "proId", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _msId = _args.getValue("msId"), _proId = _args.getValue("proId"), _sql = String.Empty;
                _sql = "select {0}, (select sum(remainNum) from dbo.TK_WH_SEND_DETAIL where msId=ms.id and batchId<>0 and proId={1}) as stockNumber from dbo.SYS_WH_MS as ms where ms.id={2};";
                responseText = baseApi.execQuery(_sql, _args.getValue("keyFields"), _args.getValue("proId"), _args.getValue("msId"));
            }
            break;
        default :
            responseText = Native.getErrorMsg("调用接口不对或不存在");
            break;
    }
    Native.writeToPage(responseText); 
%>