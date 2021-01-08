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
    baseApi.setDataType("json");
    MFile file = new MFile();
    string action = Native.getAction(), responseText = String.Empty;
    string T_REGION = "TJ_REGION", 
        T_USERS = "TJ_USER",
        T_PICTURE = "TJ_PICTURE";
    string [,] args;
    Json hash = null;
    switch (action) {
        case "login":           //登陆
            args = new string[,] { 
                { "uid", "" },
                { "pwd", "" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execScalar(MString.getSelectStr(T_USERS, "id", "uid='" + hash.getValue("uid") + "' and pwd='" + hash.getValue("pwd") + "'"));
                if (Native.isEmpty(responseText))
                {
                    responseText = Native.getErrorMsg("用户名或密码错误!");
                }
                else
                {
                    baseApi.updateById(T_USERS, "lastLoginTime=getdate()", Convert.ToInt16(responseText));
                    MSession.set(responseText, responseText);
                    responseText = baseApi.execQuery(MString.getSelectStr(T_USERS, "*", "id=" + responseText));
                }
            }
            break;
        case "register":
            args = new string[,] { 
                { "uid", "" },
                { "pwd", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _uid = hash.getValue("uid"),
                    _pwd = hash.getValue("pwd");
                SqlTrans _trans = new SqlTrans(baseApi);
                try {
                    string _id = _trans.execScalar(MString.getSelectStr(T_USERS, "id", "uid='" + _uid + "'"));
                    if (!Native.isEmpty(_id))
                    {
                        responseText = Native.getErrorMsg("已经注册，请登录!");
                    }
                    else
                    {
                        _id = _trans.execScalar(MString.getInsertStr(T_USERS, "uid, pwd", "'" + _uid + "','" + _pwd + "'", true));
                        responseText = _trans.execReader(MString.getSelectStr(T_USERS, "*", "id=" + _id));
                    }
                    _trans.commit();
                }catch(Exception e){
                    _trans.rollback();
                    responseText = Native.getErrorMsg(e.Message);
                }
                
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
        case "getAllRegions":     //根据条件查询用户
            args = new string[,] { 
                { "keyFields", "*" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.select(T_REGION, hash.getValue("keyFields"), "1=1");
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
                string _where = MConvert.toWhereSql(hash.getValue("jsonCondition")), 
                    _filter = MConvert.toFilterSql(hash.getValue("filterCondition").Trim());
                if (_where.Length > 0 && _filter.Length > 0) { 
                    _where += " and " + _filter; 
                } else { 
                    if (_filter.Length > 0) { 
                        _where = _filter; 
                    } 
                }
                if (_where.Length > 0) { 
                    _where += " and id<>1"; 
                }else {
                    _where += "id<>1";
                }

                responseText = baseApi.pagingNoCount(T_USERS, hash.getInt("pageIndex"), hash.getInt("pageSize"), hash.getValue("keyFields"), _where, MConvert.toOrderSql(hash.getValue("orderCondition")), hash.getInt("delFlag"));
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
                responseText = baseApi.select(T_USERS, hash.getValue("keyFields"), MConvert.toWhereSql(hash.getValue("jsonCondition")));
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
                responseText = file.getImage(_avatar, Server.MapPath("images/tj_user_avatar/"), 1024000);
            }
            break;
        default :
            responseText = Native.getErrorMsg("调用接口不对或不存在");
            break;
    }
    
    
    Native.writeToJSON(responseText);
%>