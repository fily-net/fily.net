<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="Fily.Util" %>
<%@ Import Namespace="Fily.WorkFlow" %>
<%@ Import Namespace="System.Collections" %>
<% 
    string action = Native.getAction(), responseText = String.Empty;
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    string[,] args;
    Json _args = null;
    switch (action) {
        case "getProjectMSDetail":
            args = new string[,] { 
                { "proId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                string _proId = _args.getValue("proId");
                try
                {
                    Native.setDebug(Native.DEBUG_INFO);
                    ArrayList _gys = _trans.execJsonList("select distinct gongYingShang from PRO_MS_RECEIVE as self where delFlag<>1 and proId="+_proId);
                    foreach (Json gys in _gys) {
                        string _gysId = gys.getValue("gongYingShang");
                        string _sql = MString.getSelectStr("dbo.PRO_MS_RECEIVE", "*, dbo.SYS_TRANS_CPN(gongYingShang) as gys, dbo.SYS_TRANS_USER(cPerson) as createPerson, dbo.SYS_FORMAT_TIME(cTime) as createTIme", "gongYingShang=" + _gysId + " and proId=" + _proId);
                        _sql += "select sum(realCost) as realCost, sum(cost) as cost from PRO_MS_RECEIVE where gongYingShang="+_gysId+" and proId="+_proId;
                        responseText += baseApi.getReSplit() + _trans.execReader(_sql);
                    }
                    responseText += baseApi.getReSplit() + _trans.execReader("select sum(cost) as cost from PRO_SC_COST where type=1 and proId=" + _proId);
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
            }
            break;
        case "getProjectCost":
            args = new string[,] { 
                { "proId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                string _proId = _args.getValue("proId");
                try
                {
                    responseText = _trans.execReader("select sum(wuShuiJinE) as wuShuiJinE, sum(jiaShuiHeJi) as jiaShuiHeJi from PROJECT_CAIGOU where proId=" + _proId);
                    responseText += baseApi.getReSplit() + _trans.execReader("select sum(cost) as cost, sum(planCost) as planCost from PRO_SC_COST where proId=" + _proId);
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
            }
            break;
        default:
            responseText = Native.getErrorMsg("API不存在");
            break;
    }
    Native.writeToPage(responseText);
%>