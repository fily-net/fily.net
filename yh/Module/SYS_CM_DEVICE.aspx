<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Meeko" %>
<%@ Import Namespace="Meeko.Base" %>
<%@ Import Namespace="Meeko.Data" %>
<%@ Import Namespace="Meeko.JSON" %>
<%@ Import Namespace="Meeko.IO" %>
<%@ Import Namespace="Meeko.Util" %>
<%@ Import Namespace="Meeko.WorkFlow" %>
<% 
    string action = Native.getAction(), responseText = String.Empty;
    DBHelper help = new DBHelper("MPro_Release");
    BaseApi baseApi = new BaseApi(help);
    string[,] args;
    Json _args = null;
    switch (action) {
        case "addProject":
            args = new string[,] { 
                { "json", null },
                { "dept", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _users = _trans.execScalar(MString.getSelectStr(R.Table.CM_GLOBAL_TABLE, "users", _args.getInt("dept")));
                    string[] _kv = MConvert.toKV(_args.getValue("json"));
                    responseText = _trans.addRow(R.Table.PRO_MG, _kv[0] + ",users,observers", _kv[1] + ",'" + _users + "','" + _users + "'");
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
        case "getDevicesById":
            args = new string[,] { 
                { "keyFields", "*" },
                { "jsonCondition", "1=1" }, 
                { "id", null },
                { "type", "0"}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                int _type = _args.getInt("type");
                string _tid = "DEVICE_CAR", _tfileds = "cars";
                if (_type == 1) { _tid = "DEVICE_MACHINES"; _tfileds = "machines"; }
                string _whereSql = MConvert.toWhereSql(_args.getValue("jsonCondition")) + " and charindex(','+cast(id as varchar(10))+',',(select " + _tfileds + " from DEVICE_APPLY as temp where temp.id=" + _args.getValue("id") + "))<>0";
                responseText = baseApi.select(_tid, _args.getValue("keyFields"), _whereSql);
            }
            break;
        case "setDevicesById":
            args = new string[,] { 
                { "tkId", null },
                { "cars", ","},
                { "machines", ","}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateById("dbo.DEVICE_APPLY", "cars='," + _args.getValue("cars") + ",', machines='," + _args.getValue("machines") + ",'", _args.getInt("tkId"));
            }
            break;
        default:
            responseText = Native.getErrorMsg("API不存在");
            break;
    }
    Native.writeToPage(responseText);
%>