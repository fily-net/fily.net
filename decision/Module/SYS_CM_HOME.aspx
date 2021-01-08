<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="Fily.Util" %>
<% 
    string action = Native.getAction(), responseText = String.Empty;
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    string T_notice = "SYS_CM_NOTICE", T_news = "SYS_CM_NEWS";
    string[,] args;
    Json hash = null;
    string _UID = MSession.get(MSession.getClientKey());
    switch (action) {
        case "getUserInfos":
            args = new string[,] { 
                { "pid", "1" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                if (!Native.isNullEmpty(_UID) && _UID != "-1")
                {
                    string _sql = MString.getRightsSelectStr("SYS_CM_FN_TREE", "id,pid,nodeName,url,icon,note", "charIndex(','+cast(" + hash.getValue("pid") + " as varchar)+',',parentPath)<>0 and delFlag<>1", "treeOrder", "asc") + "select * from SYS_CM_USER where id=" + _UID + ";";
                    _sql += "select id,pid,nodeName,url,icon,note from SYS_CM_FN_TREE where ifShortcuts=8;";
                    
                    responseText = baseApi.execQuery(_sql);
                }
                else
                {
                    responseText = Native.getErrorMsg("还未登陆哦");
                }
            }
            break;
        case "getMenuByPid":
            args = new string[,] { 
                { "pid", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                if (!Native.isNullEmpty(_UID) && _UID != "-1")
                {
                    string _sql = MString.getRightsSelectStr("SYS_CM_FN_TREE", "id,pid,nodeName,url,icon,note", "charIndex(','+cast(" + hash.getValue("pid") + " as varchar)+',',parentPath)<>0 and delFlag<>1", "treeOrder", "asc");
                    responseText = baseApi.execQuery(_sql);
                }
                else
                {
                    responseText = Native.getErrorMsg("还未登陆哦");
                }
            }
            break;
        case "init-normal":
            args = new string[,] {
                { "newsFields", "id, title, convert(varchar(20),cTime, 120) as cTime, dbo.SYS_TRANS_USER(cPerson) as cPerson" },
                { "newsIndex", "1" }, 
                { "newsSize", "10" }, 
                { "noticeFields", "id, title, convert(varchar(20),cTime, 120) as cTime, dbo.SYS_TRANS_USER(cPerson) as cPerson" },
                { "noticeIndex", "1" }, 
                { "noticeSize", "10" }, 
                { "imageFields", "id, nodeName,convert(varchar(20),cTime, 120) as cTime, dbo.SYS_TRANS_USER(cPerson) as cPerson, 'uploads/'+catelog+'/'+sysName+'.'+extName as src" },
                { "imageIndex", "1" }, 
                { "imageSize", "10" },
                { "delFlag", "0" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.paging(T_news, hash.getInt("newsIndex"), hash.getInt("newsSize"), hash.getValue("newsFields"), "1=1", "cTime desc", hash.getInt("delFlag"));
                responseText += baseApi.getReSplit() + baseApi.paging(T_notice, hash.getInt("noticeIndex"), hash.getInt("noticeSize"), hash.getValue("noticeFields"), "datediff(day,bTime,getdate())>0 and datediff(day,getdate(),eTime)>0", "cTime desc", hash.getInt("delFlag"));
                responseText += baseApi.getReSplit() + baseApi.paging("SYS_CM_FILES", hash.getInt("imageIndex"), hash.getInt("imageSize"), hash.getValue("imageFields"), "pid=5", "cTime desc", hash.getInt("delFlag"));
            }
            break;
        case "init":
            args = new string[,] {
                { "newsFields", "id, title, convert(varchar(20),cTime, 120) as cTime, dbo.SYS_TRANS_USER(cPerson) as cPerson" },
                { "newsIndex", "1" }, 
                { "newsSize", "10" }, 
                { "noticeFields", "id, title, convert(varchar(20),cTime, 120) as cTime, convert(varchar(20),bTime, 120) as bTime, convert(varchar(20),eTime, 120) as eTime, dbo.SYS_TRANS_USER(cPerson) as cPerson" },
                { "noticeIndex", "1" }, 
                { "noticeSize", "10" }, 
                { "delFlag", "0" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.paging(T_news, hash.getInt("newsIndex"), hash.getInt("newsSize"), hash.getValue("newsFields"), "1=1", "cTime desc", hash.getInt("delFlag"));
                responseText += baseApi.getReSplit() + baseApi.paging(T_notice, hash.getInt("noticeIndex"), hash.getInt("noticeSize"), hash.getValue("noticeFields"), "(datediff(day,bTime,getdate())>0 and datediff(day,getdate(),eTime)>0) or (bTime is null or eTime is null)", "cTime desc", hash.getInt("delFlag"));
                string _sql = MString.getSelectStr("SYS_CM_MEETING", "count(*)", "year='" + DateTime.Now.Year.ToString() + "' and cast(month as int)=" + DateTime.Now.Month.ToString() + " and cast(day as int)=" + DateTime.Now.Day.ToString() + " and dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', observers, ',', cPerson)<>0");
                _sql += MString.getSelectStr("U_EMAIL_" + MSession.get(MSession.getClientKey()), "count(*)", "type=1 and ifRead<>1");
                _sql += MString.getSelectStr("SYS_WF_INSTANCE", "count(*)", "delFlag=0 and pid=0 and dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', owner,',',0)<>0");
                responseText += baseApi.getReSplit() + baseApi.execQuery(_sql);
            }
            break;
        case "loadDetailById":
            args = new string[,] { 
                { "keyFields", "content" }, 
                { "tk", null }, 
                { "tid", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _tk = hash.getValue("tk"), _tid = hash.getValue("tid");
                string _sql = "select "+hash.getValue("keyFields")+" from "+_tk+" where id="+_tid+";";
                _sql += "select id,nodeName,sysName,size from dbo.SYS_CM_FILES where charIndex(','+cast(id as varchar(10))+',', (select link from dbo." + _tk + " where id=" + _tid + "))<>0;";
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "loadNotices":
            args = new string[,] { 
                { "keyFields", "id, title, convert(varchar(20),cTime, 120) as cTime, convert(varchar(20),bTime, 120) as bTime, convert(varchar(20),eTime, 120) as eTime, dbo.SYS_TRANS_USER(cPerson) as cPerson, cPerson as uid" }, 
                { "pageIndex", "1" }, 
                { "pageSize", "10" },
                { "jsonCondition", "1=1" }, 
                { "jsonOrder", "{\"cTime\":\"desc\"}" },
                { "delFlag", "0" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.paging(T_notice, hash.getInt("pageIndex"), hash.getInt("pageSize"), hash.getValue("keyFields"), MConvert.toWhereSql(hash.getValue("jsonCondition")), MConvert.toOrderSql(hash.getValue("jsonOrder")), hash.getInt("delFlag"));
            }
            break;
        case "loadNews":
            args = new string[,] { 
                { "keyFields", "id, title, convert(varchar(20),cTime, 120) as cTime, dbo.SYS_TRANS_USER(cPerson) as cPerson, cPerson as uid" }, 
                { "pageIndex", "1" }, 
                { "pageSize", "10" },
                { "jsonCondition", "1=1" }, 
                { "jsonOrder", "{\"cTime\":\"desc\"}" },
                { "delFlag", "0" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.paging(T_news, hash.getInt("pageIndex"), hash.getInt("pageSize"), hash.getValue("keyFields"), MConvert.toWhereSql(hash.getValue("jsonCondition")), MConvert.toOrderSql(hash.getValue("jsonOrder")), hash.getInt("delFlag"));
            }
            break;
        default:
            responseText = Native.getErrorMsg("API不存在");
            break;
    }
    Native.writeToPage(responseText);
%>