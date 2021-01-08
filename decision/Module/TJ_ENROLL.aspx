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
    string action = Native.getAction(), responseText = String.Empty;
    string T_ENROLL = "TJ_ENROLL";
    string [,] args;
    Json _args = null;
    switch (action) {
        case "download":
                responseText = baseApi.select(T_ENROLL, "name, age, sex, birthday, school, grade, phone, email, techang", "delFlag<>1");
                if (!Native.isNullEmpty(responseText))
                {
                    string _strContent = "\r\n" + responseText.Split(baseApi.getReSplit().ToCharArray())[0].Replace("&", "-").Replace(baseApi.getRSplit(), "\r\n");
                    MFile.exportCsv("微信报名.csv", _strContent);
                    return;
                }
            break;
        case "enroll":           //登陆
            args = new string[,] {
                { "name", "" },
                { "age", "" },
                { "sex", "" },
                { "birthday", "" },
                { "school", "" },
                { "grade", "" },
                { "phone", "" },
                { "email", "" },
                { "techang", "" }
            };

            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                if (Convert.ToInt32(baseApi.execScalar("select count(*) from " + T_ENROLL+" where delFlag<>1")) > 299)
                {
                    responseText = Native.getErrorMsg("对不起，本次活动已额满");
                }
                else
                {
                    string _name = _args.getValue("name");
                    string _age = _args.getValue("age");
                    string _sex = _args.getValue("sex");
                    string _birthday = _args.getValue("birthday");
                    string _school = _args.getValue("school");
                    string _grade = _args.getValue("grade");
                    string _phone = _args.getValue("phone");
                    string _email = _args.getValue("email");
                    string _techang = _args.getValue("techang");
                    if (Convert.ToInt32(baseApi.execScalar("select count(id) from " + T_ENROLL + " where name='" + _name + "' or email='"+_email+"'")) > 0)
                    {
                        responseText = Native.getErrorMsg("您好，您已经报名成功了，请勿重新提交，谢谢！");
                    }
                    else {
                        Mail _mail = new Mail();
                        _mail.setSubject("成功报名友谊使者选拔活动");
                        _mail.setContent("您好 " + _name + "(" + _email + "), <br /><br />感谢您参加友谊使者活动, 您已成功报名, 请携一张一寸照于3月19日9:00-17:00至汉中路188号上海市青少年活动中心中4楼青年文化交流部领取参赛证。<br /><br />指导单位：上海市人民对外友好协会<br />主办单位：上海市青少年活动中心");
                        _mail.send(_email);
                        responseText = baseApi.insert(T_ENROLL, "name, age, sex, birthday, school, grade, phone, email, techang", "'" + _name + "','" + _age + "','" + _sex + "','" + _birthday + "','" + _school + "','" + _grade + "','" + _phone + "','" + _email + "','" + _techang + "'");
                        responseText = "您已成功报名友谊使者选拔活动，请携一张一寸照于3月19日9:00-17:00至汉中路188号上海市青少年活动中心中4楼青年文化交流部领取参赛证";
                    }
                }
            }
            break;
        default :
            responseText = Native.getErrorMsg("调用接口不对或不存在");
            break;
    }

    Native.writeToJSON(responseText);
%>
