<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="Fily" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.Util" %>
<%@ Import Namespace="Fily.WorkFlow" %>
<% 
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    string action = Native.getAction(), responseText = String.Empty;
    string [,] args;
    Json _args = null;
    switch (action) {
        case "loadHolidayByYear"://根据年份来加载节假日
            args = new string[,] { 
                { "keyFields", "*" },
                { "year", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("select {0} from {1} where {2};", _args.getValue("keyFields"), "SYS_CM_HOLIDAY", "year='" + _args.getValue("year") + "'");
            }
            break;
        case "deleteMeetingByID":
            args = new string[,]{
                {"id", null}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.delete("SYS_CM_MEETING", "id=" + _args.getValue("id"));
            }
            break;
        case "setHoliday"://设置节假日
            args = new string[,] { 
                { "json", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    Json _info = MConvert.toJson(_args.getValue("json"));
                    string _y = _info.getValue("year"), _m = _info.getValue("month"), _d = _info.getValue("day");
                    string _isExist = _trans.execScalar("select id from SYS_CM_HOLIDAY where year='" + _y + "' and month='" + _m + "' and day='" + _d + "'").Trim();
                    if (Native.isEmpty(_isExist))
                    {
                        _trans.execNonQuery("insert into SYS_CM_HOLIDAY values ('" + _y + "','" + _m + "','" + _d + "','" + (_y + _m + _d) + "','" + (_y + "-" + _m + "-" + _d) + "','');");
                    }
                    else {
                        _trans.execNonQuery("delete SYS_CM_HOLIDAY where id=" + _isExist + ";");
                    }
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
        case "loadMeetingByYear"://根据年份和月份加载会议记录
            args = new string[,] { 
                { "keyFields", "*" },
                { "year", null },
                { "month", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery(MString.getSelectStr("SYS_CM_MEETING", _args.getValue("keyFields"), "year='" + _args.getValue("year") + "' and month='" + _args.getValue("month") + "' and dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', ','+observers, roles, cPerson)<>0"));
            }
            break;
        case "updateMeetingRights":
            args = new string[,] { 
                { "users", null },
                { "mid", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _users = _args.getString("users");
                responseText = baseApi.execQuery(MString.getUpdateStr("SYS_CM_MEETING", "users='" + _users + "',observers=observers+'" + _users + "'", _args.getInt("mid")));
            }
            break;
        case "getCurrCount"://获取当天还未完成的会议
            args = new string[,] { 
                { "keyFields", "*" },
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery(MString.getSelectStr("SYS_CM_MEETING", "count(*)", "year='" + DateTime.Now.Year.ToString() + "' and month='" + DateTime.Now.Month.ToString() + "' and day='" + DateTime.Now.Day.ToString() + "' and dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', observers, ',', cPerson)<>0"));
            }
            break;
        case "loadMeetingByID"://根据年份和月份加载会议记录
            args = new string[,] { 
                { "keyFields", "*" },
                { "id", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sql = MString.getSelectStr("SYS_CM_MEETING", _args.getValue("keyFields"), _args.getInt("id"));
                _sql += MString.getSelectStr("SYS_CM_FILES", "id,nodeName", "CHARINDEX(','+cast(id as varchar(10))+',', (select link from SYS_CM_MEETING where id="+_args.getValue("id")+"))<>0");
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "newMeeting"://新建会议记录
            args = new string[,] { 
                { "json", null },
                { "wfIdx", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                
                string _sJson = _args.getValue("json"), _wfId = "0";
                int _wfIdx = _args.getInt("wfIdx");
                if (_wfIdx != 0) { _wfId = (new WFIndex(_args.getInt("wfIdx"), baseApi)).addInstance("新会议", "," + MSession.get(MSession.getClientKey()) + ",", false, ""); }
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _y = MConvert.getValue(_sJson, "year"), _m = MConvert.getValue(_sJson, "month"), _d = MConvert.getValue(_sJson, "day");
                    string[] _kv = MConvert.toKV(_sJson);
                    string _k = _kv[0] + ",dateId,dateAll,wfId", _v = _kv[1] + ",'" + (_y + _m + _d) + "','" + (_y + "-" + _m + "-" + _d) + "'," + _wfId;
                    responseText = _trans.execNonQuery(MString.getInsertStr("SYS_CM_MEETING", _k, _v)).ToString();
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
        case "loadForumByID":
            args = new string[,] { 
                { "id", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _id = _args.getValue("id"), _sql = string.Empty;
                _sql += MString.getSelectStr("SYS_CM_USER", "id,uid,avatar", "id=" + MSession.get(MSession.getClientKey()));
                _sql += "select u.id as uid,u.uid as uname,u.avatar as uavatar,f.title as ftitle,f.content as fcontent,f.id as fid,f.cTime as fcTime from dbo.SYS_CM_FORUM as f left join dbo.SYS_CM_USER as u on f.cPerson=u.id where f.id="+_id+";";
                _sql += "select u.id as uid,u.uid as uname,u.avatar as uavatar,f.title as ftitle,f.content as fcontent,f.id as fid,f.cTime as fcTime, f.treeOrder as forder from dbo.SYS_CM_FORUM as f left join dbo.SYS_CM_USER as u on f.cPerson=u.id where f.pid="+_id+";";
                _sql += "select id,nodeName,sysName,size from dbo.SYS_CM_FILES where charIndex(','+cast(id as varchar(10))+',', (select link from dbo.SYS_CM_FORUM where id=" + _id + "))<>0;";
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "loadForumReplays":
            args = new string[,] { 
                { "id", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("select u.id as uid,u.uid as uname,u.avatar as uavatar,f.title as ftitle,f.content as fcontent,f.id as fid,f.cTime as fcTime, f.treeOrder as forder from dbo.SYS_CM_FORUM as f left join dbo.SYS_CM_USER as u on f.cPerson=u.id where f.pid={0};", _args.getValue("id"));
            }
            break;
        case "addpaperTopic":
            args = new string[,] { 
                { "json", null },
                { "items", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _sJson = _args.getValue("json");
                    string[] _kv = MConvert.toKV(_sJson), _itemAry = _args.getValue("items").Split('\u0002');
                    responseText = _trans.execScalar(MString.getInsertStr("SYS_QT_PAPER_TOPIC", _kv[0], _kv[1], true));
                    for (int i = 0, _len = _itemAry.Length; i < _len; i++) { if (Native.isEmpty(_itemAry[i])) { continue; } _trans.addRow("SYS_QT_PAPER_TOPIC_ITEMS", "paperId,topicId,title", MConvert.getValue(_sJson, "paperId") + "," + responseText + ",'" + _itemAry[i] + "'"); }
                    _trans.commit();
                }
                catch (Exception e)
                {
                    _trans.rollback();
                    responseText = Native.getErrorMsg(e.Message);
                }
                finally
                {
                    _trans.close();
                }
            }
            break;
        case "submitPaper":
            args = new string[,] { 
                { "json", null },
                { "items", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    Native.setDebug(Native.DEBUG_ERROR);
                    string _sJson = _args.getValue("json");
                    string[] _kv = MConvert.toKV(_sJson), _itemAry = _args.getValue("items").Split('\u0002');
                    responseText = _trans.execScalar("insert into SYS_QT_USER (" + _kv[0] + ") values (" + _kv[1] + ");select SCOPE_IDENTITY();");
                    for (int i = 0, _len = _itemAry.Length; i < _len; i++) {
                        if (Native.isEmpty(_itemAry[i])) { continue; };
                        string[] _vals = _itemAry[i].Split('\u0001');
                        _trans.execScalar("insert into SYS_QT_PAPER_ANSWER (" + _kv[0] + ",userId,paperId,topicId,value,text) values (" + _kv[1] + "," + responseText + ", " + _vals[0] + ", " + _vals[1] + ", '" + _vals[2] + "', '" + _vals[3] + "');"); 
                    }
                    _trans.commit();
                }
                catch (Exception e)
                {
                    _trans.rollback();
                    responseText = Native.getErrorMsg(e.Message);
                }
                finally
                {
                    _trans.close();
                }
            }
            break;
        case "loadpaperTopics":
            args = new string[,] { 
                { "keyFields", "id,title, dbo.SYS_TRANS_GT(type) as trans_type,type,convert(varchar(20),cTime, 120) as cTime,dbo.SYS_TRANS_USER(cPerson) as cPerson" },
                { "paperId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sql = MString.getSelectStr("SYS_QT_PAPER_TOPIC", "id, title, type", "paperId=" + _args.getValue("paperId")) + MString.getSelectStr("SYS_QT_PAPER", "*", _args.getInt("paperId"));
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "loadPaperAllTopics":
            args = new string[,] { 
                { "paperId", "0" },
                { "paperGUID", "" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _paperId = _trans.execScalar(MString.getSelectStr("SYS_QT_PAPER", "id", "(id=" + _args.getValue("paperId") + " or guid='" + _args.getValue("paperGUID") + "')"));
                    if (Native.isEmpty(_paperId))
                    {
                        responseText = Native.getErrorMsg("不存在查询试题");
                    }
                    else {
                        ArrayList topics = _trans.execJsonList(MString.getSelectStr("SYS_QT_PAPER_TOPIC", "id, title, type", "paperId=" + _paperId));
                        for (int i = 0, _len = topics.Count; i < _len; i++)
                        {
                            Json _topic = (Json)topics[i];
                            _topic.setValue("items", MConvert.jsonArrayListToString(_trans.execJsonList(MString.getSelectStr("SYS_QT_PAPER_TOPIC_ITEMS", "id as value, title as text, 'float:none;width:100%;' as css", "topicId=" + _topic.getValue("id")))));
                        }
                        responseText = MConvert.jsonArrayListToString(topics) + baseApi.getReSplit() + _trans.execJson(MString.getSelectStr("SYS_QT_PAPER", "*", Convert.ToInt32(_paperId))).toDetail();
                    }
                    _trans.commit();
                }
                catch (Exception e)
                {
                    _trans.rollback();
                    responseText = Native.getErrorMsg(e.Message);
                }
                finally
                {
                    _trans.close();
                }
            }
            break;
        case "loadPaperAllTopicsReport":
            args = new string[,] { 
                { "paperId", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _paperId = _args.getValue("paperId");
                    ArrayList topics = _trans.execJsonList(MString.getSelectStr("SYS_QT_PAPER_TOPIC", "id, title, type, (select count(*) from SYS_QT_PAPER_ANSWER as answer where answer.topicId=self.id) as count", "paperId=" + _paperId));
                    for (int i = 0, _len = topics.Count; i < _len; i++)
                    {
                        Json _topic = (Json)topics[i];
                        _topic.setValue("items", MConvert.jsonArrayListToString(_trans.execJsonList(MString.getSelectStr("SYS_QT_PAPER_TOPIC_ITEMS", "id as value, title as text, 'float:none;width:100%;' as css, (select count(*) from SYS_QT_PAPER_ANSWER as answer where charindex(','+cast(self.id as varchar(10))+',', answer.value)<>0) as count", "topicId=" + _topic.getValue("id")))));
                    }
                    responseText = MConvert.jsonArrayListToString(topics) + baseApi.getReSplit() + _trans.execJson(MString.getSelectStr("SYS_QT_PAPER", "*", Convert.ToInt32(_paperId))).toDetail();
                    _trans.commit();
                }
                catch (Exception e)
                {
                    _trans.rollback();
                    responseText = Native.getErrorMsg(e.Message);
                }
                finally
                {
                    _trans.close();
                }
            }
            break;
        case "loadpaperInfo":
            args = new string[,] { 
                { "keyFields", "id,title, dbo.SYS_TRANS_GT(type) as trans_type,type,convert(varchar(20),cTime, 120) as cTime,dbo.SYS_TRANS_USER(cPerson) as cPerson" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "orderCondition", "{\"cTime\":\"desc\"}" },
                { "paperId", null },
                { "delFlag", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.paging("SYS_QT_PAPER_TOPIC", _args.getInt("pageIndex"), _args.getInt("pageSize"), _args.getValue("keyFields"), "paperId=" + _args.getValue("paperId"), MConvert.toOrderSql(_args.getValue("orderCondition")), _args.getInt("delFlag"));
                responseText += baseApi.getReSplit() + baseApi.execQuery(MString.getSelectStr("SYS_QT_PAPER", "*", _args.getInt("paperId")));
            }
            break;
        case "loadTopicItems":
            args = new string[,] { 
                { "keyFields", "id,title,convert(varchar(20),cTime, 120) as cTime,dbo.SYS_TRANS_USER(cPerson) as cPerson" },
                { "topicId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sql = MString.getSelectStr("SYS_QT_PAPER_TOPIC_ITEMS", _args.getValue("keyFields"), "topicId=" + _args.getInt("topicId"));
                _sql += MString.getSelectStr(R.Table.CM_FILES, "id,nodeName", "charindex(','+cast(id as varchar(10))+',',(select link+',' from SYS_QT_PAPER_TOPIC as temp where temp.id=" + _args.getInt("topicId") + "))<>0");
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "loadPapers":
            args = new string[,] { 
                { "keyFields", "id,nodeName,convert(varchar(20),cTime, 120) as cTime,dbo.SYS_TRANS_USER(cPerson) as cPerson" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sql = MString.getSelectStr("SYS_QT_PAPER", _args.getValue("keyFields"), "type=1");
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "loadBugs":
            args = new string[,] { 
                { "bugId", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    ArrayList bugs = _trans.execJsonList(MString.getSelectStr("SYS_BUGS_HISTORY", "id,note,dbo.SYS_FORMAT_TIME(cTime) as cTime, dbo.SYS_TRANS_USER(cPerson) as trans_cPerson,cPerson,link", "bugId=" + _args.getValue("bugId")));
                    for (int i = 0, _len = bugs.Count; i < _len; i++)
                    {
                        Json _bug = (Json)bugs[i];
                        _bug.setValue("files", MConvert.jsonArrayListToString(_trans.execJsonList(MString.getSelectStr(R.Table.CM_FILES, "id,nodeName", "charindex(','+cast(id as varchar(10))+',','" + _bug.getValue("link")+ "')<>0"))));
                    }
                    responseText = MConvert.jsonArrayListToString(bugs);
                    _trans.commit();
                }
                catch (Exception e)
                {
                    _trans.rollback();
                    responseText = Native.getErrorMsg(e.Message);
                }
                finally
                {
                    _trans.close();
                }
            }
            break;
        default :
            responseText = Native.getErrorMsg("请求接口不存在");
            break;
    }
    Native.writeToPage(responseText);  
%>