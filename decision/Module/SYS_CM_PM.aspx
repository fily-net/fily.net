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
    //string T_PM = "SYS_PM_PROJECT", T_GT = "SYS_CM_GLOBAL_TABLE", T_SYS_FILE = "SYS_CM_FILES";

    string T_PM = "pm_project", T_GT = "SYS_CM_GLOBAL_TABLE", T_SYS_FILE = "SYS_CM_FILES";
    string[,] args;
    Json _args = null;
    switch (action) {
        case "pagingForRightsPM":
            args = new string[,] { 
                { "fileName", T_PM },
                { "keyFields", "*" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "jsonCondition", "1=1"},
                { "orderCondition", "{\"cTime\":\"desc\"}" },
                { "filterCondition", "" },
                { "delFlag", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {

                string _where = MConvert.toWhereSql(_args.getValue("jsonCondition")), _filter = MConvert.toFilterSql(_args.getValue("filterCondition"));
                if (_where.Length > 0 && _filter.Length > 0)
                {
                    _where += " and " + _filter;
                }
                else if (_filter.Length > 0)
                {
                    _where = _filter;
                }
                string _strDownload = Request["jsonDownload"];
                if (!Native.isNullEmpty(_strDownload)) { baseApi.setRSplit("\r\n\""); baseApi.setCSplit(","); }
                responseText = baseApi.paging(T_PM, _args.getInt("pageIndex"), _args.getInt("pageSize"), _args.getValue("keyFields"), _where + " and dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', users,roles,cPerson)<>0", MConvert.toOrderSql(_args.getValue("orderCondition")), _args.getInt("delFlag"));
                if (!Native.isNullEmpty(_strDownload))
                {
                    string _strContent = MConvert.toKV(_strDownload)[1] + "\r\n\"" + responseText + "\"";
                    MFile.exportCsv(_args.getValue("fileName") + ".csv", _strContent);
                }
            }
            break;
        case "getProWF":
            args = new string[,] { 
                { "keyFields", "*" },
                { "proKeyFields", "*" },
                { "proId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _proType = _args.getValue("proId");
                responseText = baseApi.select(T_GT, _args.getValue("keyFields"), "pid=(select proType from " + T_PM + " where id=" + _proType + ")");
                responseText += baseApi.getReSplit() + baseApi.select(T_PM, _args.getValue("proKeyFields"), "id=" + _proType);
            }
            break;
        case "stopPro":
            args = new string[,] { 
                { "proId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateById(T_PM, "state=449", _args.getInt("proId"));
            }
            break;
        case "getStepState":
            args = new string[,] { 
                { "proType", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execScalar(MString.getSelectStr(T_GT, "id", "pid=" + _args.getValue("proType")));
                responseText += baseApi.getReSplit() + baseApi.execScalar(MString.getSelectStr(T_GT, "id", "pid=" + responseText));
            }
            break;
        case "getNonOverNum":
            args = new string[,] { 
                { "proTypes", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("select proType as name, count(*) as count from {0} where delFlag<>1 and schedule<>100 and dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', users,roles,cPerson)<>0 and proType in({1}) group by proType;", T_PM, _args.getValue("proTypes"));
            }
            break;
        case "nextStep":
            args = new string[,] { 
                { "proId", null },
                { "nextStep", null },
                { "currStep", null },
                { "schedule", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _nStep = _args.getValue("nextStep");
                    string[] _urs = _trans.execReader(MString.getSelectStr(T_GT, "users,roles", "id=" + _nStep)).Split(baseApi.getCSplit().ToCharArray());
                    string _state = _trans.execScalar(MString.getSelectStr(T_GT, "id", "pid="+_nStep+" and treeOrder=1"));
                    _trans.execNonQuery(MString.getUpdateStr(T_PM, "users=users+'" + _urs[0] + "',roles=roles+'" + _urs[1] + "',step=" + _nStep + ",state=" + _state + ",confirmPerson=',',schedule=" + _args.getValue("schedule"), _args.getInt("proId")));
                    _trans.commit();
                }
                catch (Exception e)
                {
                    responseText = Native.getErrorMsg(e.Message);
                    _trans.rollback();
                }
                finally
                {
                    _trans.close();
                }
                if (_args.getInt("currStep") == 163) { 
                    baseApi.execQuery(@"
                        declare @sum1 int, @sum2 int;
                        set @sum1=0; set @sum2=0;
                        select @sum1=@sum1+cast(value as int) from pm_project_wf_form where proId={0} and step=163 and extid in (426,427) and code='项目评分';
                        select @sum2=@sum2+cast(value as int) from pm_project_wf_form where proId={0} and step=163 and extid in (428,429,430,431,432,433,434,435,447) and code='项目评分';
                        insert pm_project_wf_form (name,proId,step,code,value) values ('综合评分-0',{0},163,'综合评分',convert(numeric(12,2),round((@sum1*0.2+@sum2*0.6/9),2)));
                    ", _args.getValue("proId"));
                }
            }
            break;
        case "submitForm":
            args = new string[,] { 
                { "json", null },
                { "proId", null },
                { "step", null },
                { "extid", "0" },
                { "confirmPerson", ","},
                { "fids", ""}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    ArrayList _form = MConvert.toArray(_args.getValue("json"));
                    string _proid = _args.getValue("proId"), _step = _args.getValue("step"), _extid = _args.getValue("extid");
                    string _exist = _trans.execScalar("select id from {0} where proId={1} and step={2} and extid={3}", "pm_project_wf_form", _proid, _step, _extid);
                    if (Native.isEmpty(_exist))
                    {
                        for (int i = 0, _len = _form.Count; i < _len; i++) {
                            string[] _kv = (string [])_form[i];
                            string _name = _kv[0], _val = _kv[1], _gid = String.Empty;
                            string []_nAry = _name.Split('-');
                            try { _gid = _nAry[1]; } catch { _gid = String.Empty; }
                            _trans.execNonQuery("insert pm_project_wf_form (name,proId,step,extid,gid,code,value) values ('" + _name + "', " + _proid + ", " + _step + "," + _extid + "," + _gid + ",'" + _nAry[0] + "','" + _val + "');");
                        }
                        string _state = _trans.execScalar(MString.getSelectStr(T_GT, "id", "pid=" + _step+" and treeOrder=2"));
                        _trans.execNonQuery(MString.getUpdateStr(T_PM, "confirmPerson='" + _args.getValue("confirmPerson") + "',state="+_state, _args.getInt("proId")));
                        responseText = "insert";
                    }
                    else {
                        for (int i = 0, _len = _form.Count; i < _len; i++)
                        {
                            string[] _kv = (string[])_form[i];
                            int result = _trans.execNonQuery("update pm_project_wf_form set value='" + _kv[1] + "' where proId=" + _proid + " and step=" + _step + " and extid=" + _extid + " and name='" + _kv[0] + "';");
                            if (result == 0) {
                                string _name = _kv[0], _val = _kv[1], _gid = String.Empty;
                                string[] _nAry = _name.Split('-');
                                try { _gid = _nAry[1]; }
                                catch { _gid = String.Empty; }
                                _trans.execNonQuery("insert pm_project_wf_form (name,proId,step,extid,gid,code,value) values ('" + _name + "', " + _proid + ", " + _step + "," + _extid + "," + _gid + ",'" + _nAry[0] + "','" + _val + "');");
                            }
                        }
                        responseText = "update";
                    }
                    string _fids = _args.getValue("fids");
                    if (!Native.isEmpty(_fids)) { _trans.execNonQuery(MString.getUpdateStr(T_PM, "link=link+'" + _fids + ",'", _args.getInt("proId"))); }
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
        case "loadFormData":
            args = new string[,] {
                { "proId", null },
                { "step", null },
                { "extid", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("select name,value from pm_project_wf_form where proId=" + _args.getValue("proId") + " and step=" + _args.getValue("step") + " and extid=" + _args.getValue("extid") + ";");
            }
            break;
        case "loadOverStep":
            args = new string[,] {
                { "keyFields", "code,value,dbo.SYS_TRANS_GT(extid) as ext,dbo.SYS_TRANS_GT(gid) as g" },
                { "proId", null },
                { "step", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("select " + _args.getValue("keyFields") + " from pm_project_wf_form where proId=" + _args.getValue("proId") + " and step=" + _args.getValue("step") + ";");
            }
            break;
        case "loadDiscussDepts":
            args = new string[,] {
                { "gtRootID", null },
                { "proId", null },
                { "preStep", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _rID = _args.getValue("gtRootID");
                string _sql = MString.getSelectStr(T_GT, "id as name, nodeName as text, icon", "pid=" + _rID) + "select code as title, value, value as text, gid as [group], 'Label' as comType, 0 as ifSubmit from pm_project_wf_form where proId=" + _args.getValue("proId") + " and step=" + _args.getValue("preStep") + " and (gid in (select cast(id as varchar(15)) from " + T_GT + " where pid=" + _rID + ") or (gid=0 and extid=0));";
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "loadDecisions":
            args = new string[,] {
                { "keyFields", "id as name, nodeName as text, icon" },
                { "gtRootID", "377" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sql = MString.getSelectStr(T_GT, _args.getValue("keyFields"), "pid=" + _args.getValue("gtRootID"));
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "loadShouYi":
            args = new string[,] {
                { "proId", null },
                { "preStep", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("select value,dbo.SYS_TRANS_GT(extid) as ext,dbo.SYS_TRANS_GT(gid) as title from dbo.pm_project_wf_form where proId=" + _args.getValue("proId") + " and step=" + _args.getValue("preStep") + " and (code='预估收益' or code='评估依据和意见') order by ext; ");
            }
            break;
        case "loadCYTA":
            args = new string[,] {
                { "proId", null },
                { "preStep", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("select value,dbo.SYS_TRANS_GT(extid) as dept from dbo.pm_project_wf_form where proId=" + _args.getValue("proId") + " and step=" + _args.getValue("preStep") + " and code='评估意见';");
            }
            break;
        case "loadAllByProId":
            args = new string[,] {
                { "proId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("select code, value, dbo.SYS_TRANS_GT(step) as step, dbo.SYS_TRANS_GT(extid) as ext, dbo.SYS_TRANS_GT(gid) as g from dbo.pm_project_wf_form where proId=" + _args.getValue("proId") + ";");
            }
            break;
        case "loadPingFeng":
            args = new string[,] {
                { "proId", null },
                { "step", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                baseApi.setDataType("html");
                string[] _iAry = baseApi.execQuery(MString.getSelectStr(T_GT, "nodeName", "pid=439")).Split(baseApi.getRSplit().ToCharArray());
                string _sql = String.Empty, _proId = _args.getValue("proId"), _step = _args.getValue("step");
                for (int i = 0; i < _iAry.Length; i++) {
                    _sql += MString.format(@"
                        declare @val{0} int;
                        set @val{0}=0;
                        select @val{0}=@val{0}+cast(value as int) from dbo.pm_project_wf_form where proId={2} and step={3} and code = '{1}';
                        select cast(@val{0} as varchar(15))+'分' as '{1}';
                    ", i, _iAry[i], _proId, _step);
                }
                _sql += MString.format(@"
                    declare @value int;
                    set @value=0;
                    select @value=@value+cast(value as int) from dbo.pm_project_wf_form where proId={0} and step={1} and code in (select nodeName from dbo.SYS_CM_GLOBAL_TABLE where pid=439);
                    select '<font size=3>'+cast(@value as varchar(15))+'分</font>' as '<font size=3>合计评分</font>';
                    select '<font color=red>'+cast(count(*) as varchar(15))+'票</font>' as '<font color=red>不同意票数</font>' from dbo.pm_project_wf_form where proId={0} and step={1} and value='否';
                    select '<font color=green>'+cast(count(*) as varchar(15))+'票</font>' as '<font color=green>同意票数</font>' from dbo.pm_project_wf_form where proId={0} and step={1} and value='是';
                ", _proId, _step);
                baseApi.setDataType("json");
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "getRights":
            args = new string[,] {
                { "step", "" },
                { "extid", "" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _step = _args.getValue("step"), _extid = _args.getValue("extid"), _value = "0";
                if (!Native.isEmpty(_step)) { _value = baseApi.select(T_GT, "dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', users,roles,cPerson)", "id=" + _step); }
                if (!Native.isEmpty(_extid)) { _value = baseApi.select(T_GT, "dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', users,roles,cPerson)", "id=" + _extid); }
                responseText = _value;
            }
            break;
        case "onUploadOver":
            args = new string[,] {
                { "proId", null },
                { "files", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateById(T_PM, "link=link+'" + _args.getValue("files") + ",'", _args.getInt("proId"));
            }
            break;
        case "getAttachs":
            args = new string[,] {
                { "keyFields", null },
                { "proId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _fids = baseApi.select(T_PM, "replace(link,',,',',') as link", "id=" + _args.getValue("proId"));
                responseText = baseApi.select(T_SYS_FILE, _args.getValue("keyFields"), "id in (0" + _fids + "0)");
            }
            break;
        case "delAttachs":
            args = new string[,] {
                { "ids", null },
                { "proId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _newLink = "link";
                string[] _idsAry = _args.getValue("ids").Split(',');
                for (int i = 0, _len = _idsAry.Length; i < _len; i++) { _newLink = "replace(" + _newLink + ",'," + _idsAry[i] + "','')"; }
                responseText = baseApi.updateById(T_PM, "link=" + _newLink, _args.getInt("proId"));
            }
            break;

        case "onIMDBUploadOver":
            args = new string[,] {
                { "id", null },
                { "files", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateById("XD_IMDB_MOVICE", "link=link+'" + _args.getValue("files") + ",'", _args.getInt("id"));
            }
            break;
        case "getIMDBAttachs":
            args = new string[,] {
                { "keyFields", null },
                { "id", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                baseApi.setDataType("html");
                string _fids = baseApi.select("XD_IMDB_MOVICE", "replace(link,',,',',') as link", "id=" + _args.getValue("id"));
                baseApi.setDataType("json");
                responseText = baseApi.select(T_SYS_FILE, _args.getValue("keyFields"), "id in (0" + _fids + "0)");
            }
            break;
        case "delIMDBAttachs":
            args = new string[,] {
                { "ids", null },
                { "id", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _newLink = "link";
                string[] _idsAry = _args.getValue("ids").Split(',');
                for (int i = 0, _len = _idsAry.Length; i < _len; i++) { _newLink = "replace(" + _newLink + ",'," + _idsAry[i] + "','')"; }
                responseText = baseApi.updateById("XD_IMDB_MOVICE", "link=" + _newLink, _args.getInt("id"));
            }
            break;
        case "getIMDBInfo":
            args = new string[,] {
                { "keyFields", "*" },
                { "id", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                baseApi.setDataType("html");
                string _fids = baseApi.select("XD_IMDB_MOVICE", "replace(link,',,',',') as link", "id=" + _args.getValue("id"));
                baseApi.setDataType("json");
                responseText = baseApi.select("XD_IMDB_MOVICE", "*", "id=" + _args.getValue("id")) + baseApi.getReSplit() +baseApi.select(T_SYS_FILE, _args.getValue("keyFields"), "id in (0" + _fids + "0)");
            }
            break;
        default:
            responseText = Native.getErrorMsg("API不存在");
            break;
    }
    Native.writeToPage(responseText);
%>