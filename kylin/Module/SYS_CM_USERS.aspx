<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false"  Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="Fily.Util" %>
<% 
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    MFile file = new MFile();
    string action = Native.getAction(), responseText = String.Empty;
    string T_ROLES = "SYS_CM_ROLE", T_USERS = "SYS_CM_USER";
    string [,] args;
    Json hash = null;
    switch (action) {
        case "login":           //登陆
            args = new string[,] { 
                { "uid", "" },
                { "pwd", "" },
                { "icCard", "" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                if (Native.isEmpty(hash.getValue("icCard")))
                {
                    responseText = baseApi.execQuery(MString.getSelectStr(T_USERS, "id", "uid='" + hash.getValue("uid") + "' and pwd='" + hash.getValue("pwd") + "'"));
                    if (Native.isEmpty(responseText)) { 
                        responseText = Native.getErrorMsg("用户名或密码错误!"); 
                    } else {
                        baseApi.updateById(T_USERS, "lastLoginTime=getdate()", Convert.ToInt16(responseText));
                        Session["userId"] = responseText;
                        MSession.set(responseText, responseText);
                    }
                }
                else {
                    responseText = baseApi.execQuery(MString.getSelectStr(T_USERS, "id", "icCard='"+ hash.getValue("icCard") +"'"));
                    if (Native.isEmpty(responseText)) { 
                        responseText = Native.getErrorMsg("IC卡错误!"); 
                    } else {
                        baseApi.updateById(T_USERS, "lastLoginTime=getdate()", Convert.ToInt16(responseText));
                        MSession.set(responseText, responseText); 
                    }
                }
            }
            break;
        case "qieHuan":           //注销
            args = new string[,] { 
                { "uid", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                try
                {
                    string _uid = hash.getValue("uid");
                    MSession.logout();
                    MSession.set(_uid, _uid);
                    responseText = _uid;
                }
                catch (Exception e)
                {
                    responseText = e.Message;
                }
            }
            break;
        case "getExtDepts":
            args = new string[,] { 
                { "keyFields", "*" },
                { "rid", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("select " + hash.getValue("keyFields") + " from dbo.SYS_CM_ROLE where charindex(','+cast(id as varchar(10))+',', (select link from dbo.SYS_CM_ROLE where id="+hash.getValue("rid")+"))<>0;");
            }
            break;
        case "forgetPWD":           //登陆
            args = new string[,] { 
                { "email", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _email = hash.getValue("email");
                responseText = baseApi.execQuery("select pwd from {0} where email='{1}';", T_USERS, Filter.filterNormalStr(_email));
                if (Native.isEmpty(responseText)) {
                    responseText = Native.getErrorMsg("跟该邮件绑定的账号不存在"); 
                } else {
                    Mail _mail = new Mail();
                    _mail.setSubject("忘记密码--原密码");
                    _mail.setContent("尊敬的"+_email+", 您的原始密码是："+responseText);
                    _mail.send(Filter.refilterStr(Filter.filterNormalStr(_email)));
                    responseText = "发送成功";
                }
            }
            break;
        case "logout":           //注销
            try
            {
                MSession.logout();
            }
            catch (Exception e) {
                responseText = e.Message;
            }
            break;
        case "changePwd":           //登陆
            args = new string[,] { 
                { "json", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                Json _info = MConvert.toJson(hash.getValue("json"));
                int _id = _info.getInt("id");
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _pwd = _trans.execScalar("select pwd from {0} where id={1};", T_USERS, _id);
                    if (_pwd == _info.getValue("old_pwd"))
                    {
                        _trans.execNonQuery(MString.getUpdateStr(T_USERS, "pwd='" + _info.getValue("new_pwd") + "'", _id));
                    }
                    else {
                        responseText = Native.getErrorMsg("原密码错误!");
                    }
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
        case "getRightsToolBars":
            args = new string[,] { 
                { "pid", null },
                { "keyFields", "*" },
                { "ifRights", "1" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _wSql = "pid=" + hash.getValue("pid");
                if (hash.getValue("ifRights") != "0") { _wSql += " and (ifRights=0 or (ifRights=1 and dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', users,roles,cPerson)<>0))"; }
                responseText = baseApi.queryTreeNodes("SYS_CM_GLOBAL_BTNSET", hash.getValue("keyFields"), _wSql);
            }
            break;
        case "getRightsWFIndexs":
            args = new string[,] { 
                { "pid", null },
                { "keyFields", "*" },
                { "ifRights", "1" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _wSql = "pid=" + hash.getValue("pid");
                if (hash.getValue("ifRights") != "0") { _wSql += " and (ifRights=0 or (ifRights=1 and dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', users,roles,cPerson)<>0))"; }
                responseText = baseApi.queryTreeNodes("SYS_WF_INDEX", hash.getValue("keyFields"), _wSql);
            }
            break;
        case "getAllDepts":     //得到所有部门
            args = new string[,] { 
                { "keyFields", "id,nodeName" },
                { "jsonCondition", "{\"pid\":3}" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.selectTree(T_ROLES, hash.getValue("keyFields"), MConvert.toWhereSql(hash.getValue("jsonCondition")));
            }
            break;
        case "getDept":     //更新部门
            args = new string[,] { 
                { "keyFields", "*" },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.select(T_ROLES, hash.getValue("keyFields"), "id=" + hash.getValue("id"));
            }
            break;
        case "updateDept":     //更新部门
            args = new string[,] { 
                { "json", null },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _kv = hash.getValue("json"), _rid = hash.getValue("id");
                    if (MConvert.existKey(_kv, "uids")) {
                        string _origal = _trans.execScalar(MString.getSelectStr(T_ROLES, "uids", hash.getInt("id")));
                        _trans.execNonQuery(MString.getUpdateStr(T_USERS, "department=0", "id in (0" + _origal + "0)"));
                        _trans.execNonQuery(MString.getUpdateStr(T_USERS, "department=" + _rid, "id in (0" + MConvert.getValue(_kv, "uids") + "0)"));
                    }
                    _trans.execNonQuery(MString.getUpdateStr(T_ROLES, MConvert.toUpdateSql(_kv), hash.getInt("id")));
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
        case "addDept":     //得到所有部门
            args = new string[,] { { "json", null } };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.addTreeNode(T_ROLES, hash.getValue("json"));
            }
            break;
        case "delDept":     //得到所有部门
            args = new string[,] { { "id", null } };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.deleteTreeNode(T_ROLES, hash.getInt("id"));
            }
            break;
        case "delUsers":     //根据条件查询用户
            args = new string[,] { 
                { "ids", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.delete(T_USERS, "id in ("+hash.getValue("ids")+")");
            }
            break;
        case "getUsersByDept":     //根据条件查询用户
            args = new string[,] { 
                { "keyFields", "*" },
                { "dept", "3" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.select(T_USERS, hash.getValue("keyFields"), "id<>1 and department=" + hash.getValue("dept"));
            }
            break;
        case "getAllUsers":     //根据条件查询用户
            args = new string[,] { 
                { "keyFields", "*" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.select(T_USERS, hash.getValue("keyFields"), "id<>1");
            }
            break;
        case "getUnallocateUsers":     //根据条件查询用户
            args = new string[,] { 
                { "keyFields", "*" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.select(T_USERS, hash.getValue("keyFields"), "department=0 and id<>1");
            }
            break;
        case "getUserInfo":     //根据ID查询用户
            args = new string[,] { 
                { "keyFields", "*" },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.select(T_USERS, hash.getValue("keyFields"), "id=" + hash.getValue("id"));
            }
            break;     
        case "getUsers":     //根据条件查询用户
            args = new string[,] { 
                { "keyFields", "*" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "jsonCondition", ""},
                { "orderCondition", "" },
                { "filterCondition", "" },
                { "delFlag", "0" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _where = MConvert.toWhereSql(hash.getValue("jsonCondition")), _filter = MConvert.toFilterSql(hash.getValue("filterCondition").Trim());
                if (_where.Length > 0 && _filter.Length > 0) { _where += " and " + _filter; } else { if (_filter.Length > 0) { _where = _filter; } }
                if (_where.Length > 0) { _where += " and id<>1"; }else {_where += "id<>1";}
                responseText = baseApi.paging(T_USERS, hash.getInt("pageIndex"), hash.getInt("pageSize"), hash.getValue("keyFields"), _where, MConvert.toOrderSql(hash.getValue("orderCondition")), hash.getInt("delFlag"));
            }
            break;
        case "getUsersNoPaging": 
            args = new string[,] { 
                { "keyFields", "*" },
                { "jsonCondition", "1=1"}
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.select(T_USERS, hash.getValue("keyFields"), MConvert.toWhereSql(hash.getValue("jsonCondition"))+" and id<>1");
            }
            break;
        case "addUser":
            args = new string[,] { 
                { "json", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _jsonStr = hash.getValue("json");
                string[] _kv = MConvert.toKV(_jsonStr);
                string _k = _kv[0], _v = _kv[1], _uid = MConvert.getValue(_jsonStr, "uid");
                if (!Native.isEmpty(_uid)) { _k += ",cName,pinYin"; _v += ",'" + _uid + "',dbo.SYS_GET_PINYIN('" + _uid + "')"; }
                responseText = baseApi.insert(T_USERS, _k, _v);
                if (MConvert.existKey(_jsonStr, "department") && (MConvert.getValue(_jsonStr, "department") != "" || MConvert.getValue(_jsonStr, "department") != "0"))
                {
                    string _dept = MConvert.getValue(_jsonStr, "department");
                    if (!Native.isEmpty(_dept)) { baseApi.updateById(T_ROLES, "uids=uids+'" + responseText + ",'", Convert.ToInt16(responseText)); } 
                }
                if (MConvert.existKey(_jsonStr, "ifEnableEmail") && MConvert.getValue(_jsonStr, "ifEnableEmail") == "11") {
                    (new MEmail(baseApi)).enabledMail(Convert.ToInt16(responseText)); 
                }
            }
            break;
        case "resetEmail":
            args = new string[,] { 
               { "id", "xxx" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                
                SqlTrans _trans = new SqlTrans(baseApi);
               // _trans.execNonQuery("");

                ArrayList _users = _trans.execJsonList(MString.getSelectStr("SYS_CM_USER", "id", "1=1"));
                int _id = 0;
                for (int i = 0, _len = _users.Count; i < _len; i++) {
                    _id = ((Json)_users[i]).getInt("id");
                    (new MEmail(baseApi)).enabledMail(_id);
                }
                _trans.commit();
                responseText = "重置成功";
            }
            break;
        case "updateUser": 
            args = new string[,] { 
                { "json", null },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _jsonStr = hash.getValue("json");
                if (MConvert.existKey(_jsonStr, "ifEnableEmail")) { (new MEmail(baseApi)).enabledMail(hash.getInt("id")); }
                responseText = baseApi.updateById(T_USERS, MConvert.toUpdateSql(_jsonStr), hash.getInt("id"));
            }
            break;
        case "loadUserByUIDS":
            args = new string[,] { 
                { "keyFields", "*" },
                { "uids", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.select(T_USERS, hash.getValue("keyFields"), "id<>1 and id in (0" + hash.getValue("uids") + "0)");
            }
            break;
        case "moveUsersToRole":     //移动用户到角色中
            args = new string[,] { 
                { "roleId", null },
                { "userIds", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateById(T_ROLES, "id<>1 and uids='" + hash.getValue("userIds") + "'", hash.getInt("roleId"));
            }
            break;
        case "getAvatar":           //登陆
            args = new string[,] { 
                { "uid", "" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {

                string _avatar = baseApi.execQuery(MString.getSelectStr(T_USERS, "avatar", "id="+hash.getValue("uid")));
                responseText = file.getImage(_avatar, Server.MapPath("images/avatar/"), 1024000);
            }
            break;
        default :
            responseText = Native.getErrorMsg("调用接口不对或不存在");
            break;
    }
    Native.writeToPage(responseText); 
%>