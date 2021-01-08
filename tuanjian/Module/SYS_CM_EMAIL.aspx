<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.Util" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="System.IO" %>
<% 
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    MEmail mEmail = new MEmail(baseApi);
    string action = Native.getAction(), responseText = String.Empty;
    string [,] args;
    Json _args = null;
    switch (action) {
        case "getPersonalMailInfo":
            args = new string[,] { 
                { "keyFields", "*" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sql = MString.getSelectStr("dbo.SYS_CM_USER", "ifEnableEmail", "id=" + MSession.get(MSession.getClientKey()));
                _sql += MString.getSelectStr("U_EMAIL_" + MSession.get(MSession.getClientKey()), "count(*)", "type=1 and ifRead<>1");
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "pagingForEmailList":
            args = new string[,] { 
                { "fileName", "U_EMAIL_" + MSession.get(MSession.getClientKey()) },
                { "keyFields", "*" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "jsonCondition", ""},
                { "orderCondition", "{\"cTime\":\"desc\"}" },
                { "filterCondition", "" },
                { "delFlag", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {

                string _where = MConvert.toWhereSql(_args.getValue("jsonCondition")), _filter = MConvert.toFilterSql(_args.getValue("filterCondition").Trim());
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
                responseText = baseApi.paging("U_EMAIL_" + MSession.get(MSession.getClientKey()), _args.getInt("pageIndex"), _args.getInt("pageSize"), _args.getValue("keyFields"), _where, MConvert.toOrderSql(_args.getValue("orderCondition")), _args.getInt("delFlag"));
                if (!Native.isNullEmpty(_strDownload))
                {
                    string _strContent = _title + "\r\n" + responseText.Split(baseApi.getReSplit().ToCharArray())[0].Replace("&", "-").Replace(baseApi.getRSplit(), "\r\n");
                    MFile.exportCsv(_args.getValue("fileName") + ".csv", _strContent);
                    return;
                }
            }
            break;
        case "pagingForDeletedEmailList":
            args = new string[,] { 
                { "keyFields", "*" }, 
                { "pageIndex", "1" }, 
                { "pageSize", "10" },
                { "jsonCondition", "1=1" }, 
                { "jsonOrder", "id" },
                { "delFlag", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.paging("U_EMAIL_" + MSession.get(MSession.getClientKey()), _args.getInt("pageIndex"), _args.getInt("pageSize"), _args.getValue("keyFields"), MConvert.toWhereSql(_args.getValue("jsonCondition")), MConvert.toOrderSql(_args.getValue("jsonOrder")), _args.getInt("delFlag"));
            }
            break;
        case "getEmailListByCondition":
            args = new string[,] { 
                { "jsonCondition", null},
                { "keyFields", "*" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.queryTreeNodes("U_EMAIL_" + MSession.get(MSession.getClientKey()), _args.getValue("keyFields"), MConvert.toWhereSql(_args.getValue("jsonCondition")));
            }
            break;
        case "saveAsCopy":
            args = new string[,] { 
                { "json", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = mEmail.saveAsCopy(_args.getValue("json"));
            }
            break;
        case "updateDrafts":
            args = new string[,] { 
                { "json", null },
                { "id", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = mEmail.updateByID(_args.getValue("json"), _args.getInt("id"));
            }
            break;
        case "send":
            args = new string[,] { 
                { "json", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = mEmail.send(_args.getValue("json"));
            }
            break;
        case "getInfo":
            args = new string[,] { 
                { "id", null },
                { "keyFields", "*" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _table = "U_EMAIL_" + MSession.get(MSession.getClientKey()), _id = _args.getValue("id");
                string _sql = MString.getUpdateStr(_table, "ifRead=1", Convert.ToInt16(_id)) + MString.getSelectStr(_table, _args.getValue("keyFields"), "id=" + _id);
                _sql += "select id,nodeName,sysName,size from dbo.SYS_CM_FILES where charIndex(','+cast(id as varchar(10))+',', (select link from dbo." + _table + " where id=" + _id + "))<>0;";
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "delEmails":
            args = new string[,] { 
                { "ids", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _table = "U_EMAIL_" + MSession.get(MSession.getClientKey());
                string _sql = MString.getDeleteStr(_table, "id in (" + _args.getValue("ids")+")");
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "realDelEmails":
            args = new string[,] { 
                { "ids", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _table = "U_EMAIL_" + MSession.get(MSession.getClientKey());
                string _sql = MString.getRealDeleteStr(_table, "id in (" + _args.getValue("ids") + ")");
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "markEmails":
            args = new string[,] { 
                { "ids", null },
                { "flag", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _table = "U_EMAIL_" + MSession.get(MSession.getClientKey());
                string _sql = MString.getUpdateStr(_table, "ifRead=" + _args.getValue("flag"), "id in (" + _args.getValue("ids") + ")");
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "test":
            responseText = mEmail.enabledMail(5);
            break;
        case "testsend":
            args = new string[,] { 
                { "to", "945758912@qq.com" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                Mail _mail = new Mail();
                _mail.setSubject("测试邮件");
                _mail.setContent("哈哈");
                _mail.send(_args.getValue("to"));
            }
            break;
        default :
            responseText = Native.getErrorMsg("请求接口不存在");
            break;
    }
    Native.writeToPage(responseText);  
%>