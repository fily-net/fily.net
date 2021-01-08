using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Meeko.Base;
using Meeko.Data;
using Meeko.IO;
using Meeko.Util;

namespace Meeko.Ext
{
    public class str
    {

        public string cStrAry(string s,string append)
            {
                char fg = '※';
                s = ((s==""||s==null||append==fg.ToString())) ? s : (s+fg.ToString());
                if(append!=""&&append!=fg.ToString()) s += append;
                return s;
            }
        public string[] cStrAry(string s, string append, bool bAry)
            {
                char fg = '※';
                string str = string.Empty;
                str = cStrAry(s, append);
                return str.Split(fg);
            }

        public string tableInsert(DBHelper dbh,string t,string k,string v)
            {
                string sql = "insert into " + t + "("+k+") values("+v+");select SCOPE_IDENTITY();";
                try
                {
                    BaseApi ba = new BaseApi(dbh);
                    return ba.execTrans(sql);
                }
                catch(Exception e)
                {
                    //Native.writeToPage(Native.getErrorMsg(e.Message));
                    return Native.getErrorMsg(e.Message);
                }
            }
        public string tableDel(DBHelper dbh,string t,string c)
            {
                string sql = "delete " + t + " where " + c;
                try
                {
                    BaseApi ba = new BaseApi(dbh);
                    return ba.execQuery(sql);
                }
                catch (Exception e)
                {
                    return Native.getErrorMsg(e.Message);
                }
            }

        public string tableUpdate(DBHelper dhb, string t, string u, string c)
            {
                string sql = "update " + t + " set " + u + " where " + c;
                try
                {
                    BaseApi ba = new BaseApi(dhb);
                    return ba.execQuery(sql);
                }
                catch (Exception e)
                {
                    return Native.getErrorMsg(e.Message);
                }
            }

        public string tableSelect(DBHelper dhb, string t, string k, string c,string dt)
            {
                string sql = "select " + k + " from " + t + " where " + c;
                try
                {
                    BaseApi ba = new BaseApi(dhb, "$", "^", "@&@", dt);
                    return ba.execQuery(sql);
                }
                catch (Exception e)
                {
                    return Native.getErrorMsg(e.Message);
                }
            }
        #region 错误判断
        public bool bError(string s)
        {
            if (s.Length>15&&s.Substring(0, 15).ToLower() == "errorinfo=执行出错:") { return true; };
            return false;
        }
        #endregion

        #region jsonDC json -> where条件 允许查询所有记录的条件转换特例
            public string jsonDC(string c)
            {
                if (Native.isNullEmpty(c)) c = "1=1";
                else c = json2sp(c, "and");
                return c;
            }
        #endregion

        #region json2sp
        public string json2sp(string jsonStr, string sqlKey)
        {
            string sql = string.Empty;
            //StringBuilder sqlStr = new StringBuilder();
            try {
                JObject json = JObject.Parse(jsonStr);
                foreach (JProperty field in json.Children())
                {
                    string name = field.Name, value = string.Empty;
                    string type = field.Value.Type.ToString();
                    name = Filter.filterSqlStr(name);
                    name = Filter.filterNormalStr(name);
                    switch (type)
                    { 
                        case "String":
                            value = (string)field.Value.ToString();
                            value = Filter.filterSqlStr(value);
                            value = "'" + value + "'";
                            break;
                        default:
                            value = field.Value.ToString();
                            value = Filter.filterSqlStr(value);
                            value = Filter.filterNormalStr(value);
                            break;
                    }
                    if (sqlKey == "key") { sql += name + ",";}
                    else if (sqlKey == "val") { sql += value + ",";}
                    else if (sqlKey == "," || sqlKey == "and") { if (name == value ||("'"+name+"'")==value) { return Native.getErrorMsg("请停止注入行为"); }; sql += ((sql == "") ? "" : " " + sqlKey + " ") + name + " = " + value; } 
                    //string a = string.Empty;   
                }
                if (sqlKey == "key" || sqlKey == "val") { sql = sql.Substring(0, sql.Length - 1); }
                
            }catch(Exception e){
                return Native.getErrorMsg(e.Message);
            }
            return sql;
        }
        #endregion

        #region 构造旗帜查询 旗帜删除
        public string json2sp(string jsonStr, string sqlKey,string flag)
        {
            string sql = string.Empty;
            flag = Native.isNullEmpty(flag) ? "0" : "1";
            //StringBuilder sqlStr = new StringBuilder();
            try {
                JObject json = JObject.Parse(jsonStr);
                foreach (JProperty field in json.Children())
                {
                    string name = field.Name, value = string.Empty;
                    string type = field.Value.Type.ToString();
                    name = Filter.filterSqlStr(name);
                    name = Filter.filterNormalStr(name);
                    switch (type)
                    { 
                        case "String":
                            value = (string)field.Value.ToString();
                            value = Filter.filterSqlStr(value);
                            value = "'" + value + "'";
                            break;
                        default:
                            value = field.Value.ToString();
                            value = Filter.filterSqlStr(value);
                            value = Filter.filterNormalStr(value);
                            break;
                    }
                    if (sqlKey == "," || sqlKey == "and") { if (name == value || ("'" + name + "'") == value) { return Native.getErrorMsg("请停止注入行为"); };sql += name + " = " + value + " " + sqlKey + " "; } 
                    //string a = string.Empty;   
                }

                if (sqlKey == "," || sqlKey == "and") { sql += "delFlag=" + flag; }
            }catch(Exception e){
                return Native.getErrorMsg(e.Message);
            }
            return sql;
        }
        #endregion

    }
}
