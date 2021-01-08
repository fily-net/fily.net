using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;
using System.Web;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Fily.JSON;
using Fily.Base;

namespace Fily.Util
{
    public static class MConvert
    {
        #region 私有变量的定义, keySplit
        private static char keySplit = ',';
        #endregion

        #region keySplit的set, get方法
        public static void setKeySplit(char _keySplit)
        {
            keySplit = _keySplit;
        }
        public static char getKeySplit()
        {
            return keySplit;
        }
        #endregion

        #region toSql: json字符串转成sql语句   //jsonJoin  and    jsonMatch
        /// <summary>
        /// json字符串转成sql语句  已经整合之前版本的jsonJoin  和 jsonMatch 两个函数
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <param name="sqlKey">sqlKey, 可以是between, like, 默认是null</param>
        /// <returns>返回sql字符串</returns>
        public static string toSql(string jsonStr, string sqlKey)
        {
            StringBuilder sqlStr = new StringBuilder();
            try
            {
                JObject json = JObject.Parse(jsonStr);
                foreach (JProperty field in json.Children())
                {
                    string name = Filter.filterSqlStr(field.Name), value = field.Value.ToString();
                    string type = field.Value.Type.ToString();
                    if (type == "String")
                    {
                        value = Filter.filterSqlStr(value);
                        switch (sqlKey)
                        {
                            case "between":
                                string[] _v = value.Split(',');
                                value = "''" + _v[0] + "''" + " and " + "''" + _v[1] + "''";
                                break;
                            case "like":
                                value = "''%" + value + "%''";
                                break;
                            default:
                                value = "''" + value + "''";
                                break;
                        }
                    }
                    sqlStr.Append(name + " " + sqlKey + " " + value + " and ");
                }
                sqlStr.Remove(sqlStr.Length - 5, 5);
            }
            catch (Exception)
            {
                sqlStr.Append(jsonStr);
            }
            return sqlStr.ToString();
        }
        #endregion

        #region toUpdateSql: 把jsonUpdate的json字符串转化成update可以执行的sql语句
        /// <summary>
        /// 把jsonUpdate的json字符串转化成update可以执行的sql语句
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <param name="isProc">使用通过存储过程来执行sql语句, 默认是false</param>
        /// <returns>返回update key=value形式的sql语句</returns>
        public static string toUpdateSql(string jsonStr, bool isProc)
        {
            StringBuilder sqlStr = new StringBuilder();
            string _quote = "'";
            if (isProc) { _quote = "''"; }
            try
            {
                JObject json = JObject.Parse(jsonStr);
                foreach (JProperty field in json.Children())
                {
                    string name = Filter.filterSqlStr(field.Name), value = field.Value.ToString();
                    string type = field.Value.Type.ToString();
                    if (type == "String")
                    {
                        value = Filter.filterSqlStr(value);
                        value = Filter.filterNormalStr(value);
                        value = _quote + value + _quote;
                    }
                    sqlStr.Append(name + "=" + value + ",");
                }
                sqlStr.Remove(sqlStr.Length - 1, 1);
            }
            catch (Exception)
            {
                sqlStr.Append(jsonStr);
            }
            return sqlStr.ToString();
        }
        /// <summary>
        /// 把jsonUpdate的json字符串转化成update可以执行的sql语句
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <returns>返回update key=value形式的sql语句</returns>
        public static string toUpdateSql(string jsonStr)
        {
            return toUpdateSql(jsonStr, false);
        }
        #endregion

        #region toOrderSql: 把jsonUpdate的json字符串转化成order排序的sql语句
        /// <summary>
        /// toOrderSql: 把jsonUpdate的json字符串转化成order排序的sql语句
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <returns></returns>
        public static string toOrderSql(string jsonStr)
        {
            StringBuilder sqlStr = new StringBuilder();
            try
            {
                JObject json = JObject.Parse(jsonStr);
                foreach (JProperty field in json.Children())
                {
                    string name = Filter.filterSqlStr(field.Name), value = field.Value.ToString();
                    if (value == "1" || value == "asc") { value = "asc"; } else { value = "desc"; }
                    sqlStr.Append(name + " " + value + ",");
                }
                sqlStr.Remove(sqlStr.Length - 1, 1);
            }
            catch (Exception)
            {
                sqlStr.Append(jsonStr);
            }
            return sqlStr.ToString();
        }
        #endregion

        #region toFilterSql: 把过滤字段对应转成sql语句
        /// <summary>
        /// 把过滤字段对应转成sql语句
        /// </summary>
        /// <param name="jsonAryStr">json格式字符串</param>
        /// <returns></returns>
        public static string toFilterSql(string jsonAryStr)
        {
            string[] jStr = jsonAryStr.Split('\u0001');
            StringBuilder sqlStr = new StringBuilder();
            try
            {
                for (int i = 0, _len = jStr.Length; i < _len; i++) {
                    if (Native.isEmpty(jStr[i])) { continue; }
                    JObject json = JObject.Parse(jStr[i]);
                    string _name = json.SelectToken("col").ToString(), _val = json.SelectToken("value").ToString();
                    string _dType = json.SelectToken("dataType").ToString(), _opt = json.SelectToken("opt").ToString();
                    string _tVal = _val;
                    if (_dType != "int") { _tVal = "'" + _tVal + "'"; }
                    if (sqlStr.Length > 2) { sqlStr.Append(" and "); }
                    switch (_opt)
                    { 
                        case "equal":
                            sqlStr.Append(_name + "=" + _tVal);
                            break;
                        case "not-equal":
                            sqlStr.Append(_name + "<>" + _tVal);
                            break;
                        case "gt":
                            sqlStr.Append(_name + ">" + _val);
                            break;
                        case "less":
                            sqlStr.Append(_name + "<" + _val);
                            break;
                        case "gt-equal":
                            sqlStr.Append(_name + ">=" + _val);
                            break;
                        case "less-equal":
                            sqlStr.Append(_name + "<=" + _val);
                            break;
                        case "like":
                            sqlStr.Append(_name + " like '%" + _val + "%'");
                            break;
                        case "not-like":
                            sqlStr.Append(_name + " not like '%" + _val + "%'");
                            break;
                        case "contain":
                            sqlStr.Append("charindex('" + _val + "'," + _name + ")>0");
                            break;
                        case "not-contain":
                            sqlStr.Append("charindex('" + _val + "'," + _name + ")=0");
                            break;
                        case "between-and":
                            string _val_b1 = json.SelectToken("value1").ToString();
                            if (_dType != "int") { _val_b1 = "'" + _val_b1 + "'"; }
                            sqlStr.Append("between " + _tVal + " and " + _val_b1);
                            break;
                        case "not-between-and":
                            string _val_nb1 = json.SelectToken("value1").ToString();
                            if (_dType != "int") { _val_nb1 = "'" + _val_nb1 + "'"; }
                            sqlStr.Append("not between " + _tVal + " and " + _val_nb1);
                            break;
                        case "starts-width":
                            sqlStr.Append("charindex('" + _val + "'," + _name + ")=1");
                            break;
                        case "not-starts-with":
                            sqlStr.Append("charindex('" + _val + "'," + _name + ")<>1");
                            break;
                        case "end-with":
                            sqlStr.Append("charindex('" + _val + "'," + _name + ")<>0 and charindex('" + _val + "'," + _name + ")=(len(" + _name + ")-len(" + _val + ")+1)");
                            break;
                        case "not-end-width":
                            sqlStr.Append("charindex('" + _val + "'," + _name + ")<>(len(" + _name + ")-len(" + _val + ")+1)");
                            break;
                    }
                }
            }
            catch (Exception)
            {
                sqlStr.Append(jsonAryStr);
            }
            return sqlStr.ToString();
        }
        #endregion

        #region toJson: 把jsonUpdate的json字符串转化成Json对象
        /// <summary>
        /// toJson: 把jsonUpdate的json字符串转化成Json对象
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <returns></returns>
        public static Json toJson(string jsonStr)
        {
            Json _json = new Json();
            try
            {
                JObject json = JObject.Parse(jsonStr);
                foreach (JProperty field in json.Children())
                {
                    string name = field.Name.ToString(), value = field.Value.ToString();
                    _json.Add(name, value);
                }
            }
            catch (Exception)
            {
            }
            return _json;
        }
        #endregion

        #region toWhereSql 把jsonCondition的json字符串转化成where条件的sql语句
        /// <summary>
        /// 把jsonCondition的json字符串转化成where条件的sql语句
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <param name="isProc">使用通过存储过程来执行sql语句, 默认是false</param>
        /// <returns>返回where条件的sql语句</returns>
        public static string toWhereSql(string jsonStr, bool isProc)
        {
            StringBuilder sqlStr = new StringBuilder();
            string _quote = "'";
            if (isProc) { _quote = "''"; }
            try
            {
                JObject json = JObject.Parse(jsonStr);
                foreach (JProperty field in json.Children())
                {
                    string name = Filter.filterSqlStr(field.Name), value = field.Value.ToString();
                    string type = field.Value.Type.ToString(), _oper = "=", _method = "and";
                    string[] _nAry = name.Split(getKeySplit());
                    int _nLen = _nAry.Length;
                    if (_nLen > 1) { _oper = _nAry[1]; }
                    if (_nLen > 2) { _method = _nAry[2]; }
                    if (sqlStr.Length > 0) { sqlStr.Append(" " + _method + " "); }
                    if (type == "String")
                    {
                        value = Filter.filterSqlStr(value);
                        value = Filter.filterNormalStr(value);
                    }
                    switch (_oper.ToLower())
                    {
                        case "between":
                            string[] _v = value.Split(',');
                            if (type == "String")
                            {
                                value = _quote + _v[0] + _quote + " and " + _quote + _v[1] + _quote;
                            }
                            else
                            {
                                value = _v[0] + " and " + _v[1];
                            }
                            break;
                        case "like":
                            if (type == "String") { value = _quote + "%" + value + "%" + _quote; }
                            break;
                        case "notlike":
                            if (type == "String") { value = _quote + "%" + value + "%" + _quote; }
                            _oper = "not like";
                            break;
                        case "gt":
                            _oper = ">";
                            break;
                        case "gl":
                            _oper = "<";
                            break;
                        case "!":
                            _oper = "<>";
                            break;
                        case "include":
                            sqlStr.Append("charindex(','+cast(" + _nAry[0] + " as varchar(10))+',', '," + value + ",')<>0");
                            continue;
                        case "in":
                            value = "(" + value + ")";
                            break;
                        default:
                            if (type == "String") { value = _quote + value + _quote; }
                            break;
                    }
                    sqlStr.Append(_nAry[0] + " " + _oper + " " + value);
                }
            }
            catch (Exception)
            {
                sqlStr.Append(jsonStr);
            }
            return sqlStr.ToString();
        }
        /// <summary>
        /// 把jsonCondition的json字符串转化成where条件的sql语句
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <returns>返回where条件的sql语句</returns>
        public static string toWhereSql(string jsonStr)
        {

            return toWhereSql(jsonStr, false);
        }
        #endregion

        #region toKV: 分解json类型的字符串的keyFields, 和 value 值
        /// <summary>
        /// 分解json类型的字符串的keyFields, 和 value 值
        /// </summary>
        /// <param name="jsonStr">json格式的字符串</param>
        /// <param name="isProc">使用通过存储过程来执行sql语句, 默认是false</param>
        /// <returns>返回一个包含keyFileds, value值的数组， 数组的第一个元素是keyFields值, 第二个元素是value值</returns>
        public static string[] toKV(string jsonStr, bool isProc)
        {
            if (Native.isEmpty(jsonStr)) { return new string[2]{"",""};}
            StringBuilder k = new StringBuilder(), v = new StringBuilder();
            JObject json = JObject.Parse(jsonStr);
            string _quote = "'";
            if (isProc) { _quote = "''"; }
            foreach (JProperty field in json.Children())
            {
                string name = Filter.filterSqlStr(field.Name), value = field.Value.ToString().Trim(), type = field.Value.Type.ToString().Trim();
                if (type != "Double"&&type != "Float") { value = Filter.filterSqlStr(value);value = Filter.filterNormalStr(value); }
                if (type == "String") { value = _quote + value + _quote; }
                k.Append(name + ",");
                v.Append(value + ",");
            }
            k.Remove(k.Length - 1, 1);
            v.Remove(v.Length - 1, 1);
            string[] val = { k.ToString(), v.ToString() };
            return val;
        }
        /// <summary>
        /// 分解json类型的字符串的keyFields, 和 value 值
        /// </summary>
        /// <param name="jsonStr">json格式的字符串</param>
        /// <returns>返回一个包含keyFileds, value值的数组， 数组的第一个元素是keyFields值, 第二个元素是value值</returns>
        public static string[] toKV(string jsonStr)
        {
            return toKV(jsonStr, false);
        }
        #endregion

        #region toKV: 分解json类型的字符串的keyFields, 和 value 值
        /// <summary>
        /// 分解json类型的字符串的keyFields, 和 value 值
        /// </summary>
        /// <param name="jsonStr">json格式的字符串</param>
        /// <returns>返回一个包含keyFileds, value值的数组， 数组的第一个元素是keyFields值, 第二个元素是value值</returns>
        public static string[] toKV(Json json)
        {
            /*
            StringBuilder k = new StringBuilder(), v = new StringBuilder();
            JObject json = JObject.Parse(jsonStr);
            foreach (JProperty field in json.Children())
            {
                string name = filterSqlStr(field.Name);
                string value = filterSqlStr(field.Value.ToString());
                value = filterNormalStr(value);
                string type = field.Value.Type.ToString();
                if (type == "String") { value = "''" + value + "''"; }
                k.Append(name + ",");
                v.Append(value + ",");
            }
            k.Remove(k.Length - 1, 1);
            v.Remove(v.Length - 1, 1);
            string[] val = { k.ToString(), v.ToString() };
             * */
            return null;
        }
        #endregion

        #region getValue: 通过传递key值得到json字符串的value值
        /// <summary>
        /// 从jsonStr字符串中查找键值是key值的value值
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <param name="key">键值, 比如name, age, password</param>
        /// <returns>返回value值</returns>
        public static string getValue(string jsonStr, string key)
        {
            JObject json = JObject.Parse(jsonStr);
            object _valObj = json[key];
            string _val = String.Empty;
            if (_valObj != null) { _val = _valObj.ToString(); }
            return _val;
        }
        #endregion

        #region getInt: 通过传递key值得到json字符串的int型value值
        /// <summary>
        /// getInt: 通过传递key值得到json字符串的int型value值
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <param name="key">键值, 比如name, age, password</param>
        /// <returns>返回value值</returns>
        public static int getInt(string jsonStr, string key)
        {
            return Convert.ToInt16(getValue(jsonStr, key));
        }
        public static double getDouble(string jsonStr, string key)
        {
            return Convert.ToDouble(getValue(jsonStr, key));
        }
        public static bool getBool(string jsonStr, string key)
        {
            return Convert.ToBoolean(getValue(jsonStr, key));
        }
        public static string getString(string jsonStr, string key)
        {
            return getValue(jsonStr, key);
        }
        public static decimal getDecimal(string jsonStr, string key)
        {
            return Convert.ToDecimal(getValue(jsonStr, key));
        }
        public static DateTime getDateTime(string jsonStr, string key)
        {
            return Convert.ToDateTime(getValue(jsonStr, key));
        }
        #endregion

        #region getValueFromJsonStr: 通过传递key值得到json字符串的value值
        /// <summary>
        /// 从jsonStr字符串中查找键值是key值的value值
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <param name="key">键值, 比如name, age, password</param>
        /// <returns>返回value值</returns>
        public static string getValueFromJsonStr(string jsonStr, string key)
        {
            return getValue(jsonStr, key);
        }
        #endregion

        #region removeKey: 通过传递key值得到json字符串的value值
        /// <summary>
        /// 从json字符串中移除键值是key的value值, 并返回新的json字符串, 以前json字符串不会发生变化
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <param name="key">要移除对象的key值</param>
        /// <returns></returns>
        public static string removeKey(string jsonStr, string key)
        {
            try
            {
                JObject json = JObject.Parse(jsonStr);
                object _valObj = json[key];
                if (_valObj != null) { json.Remove(key); jsonStr = json.ToString(); }
            }
            catch (Exception)
            {

            }
            return jsonStr;
        }
        #endregion

        #region removeKey: 通过传递key值得到json字符串的value值
        /// <summary>
        /// 从json字符串中移除键值是key的value值, 并返回要移除对象的值, 一旦移除成功, json字符串会被修改
        /// </summary>
        /// <param name="jsonStr">json格式字符串,使用该方法会可能直接修改json字符串</param>
        /// <param name="key">要移除对象的key值</param>
        /// <returns></returns>
        public static string removeKey(ref string jsonStr, string key)
        {
            try
            {
                JObject json = JObject.Parse(jsonStr);
                object _valObj = json[key];
                if (_valObj != null) { json.Remove(key); jsonStr = json.ToString(); }
                return _valObj.ToString();
            }
            catch (Exception)
            {
                return "";
            }
        }
        #endregion

        #region existKey: 从json字符串判断是否存在键是key的value值
        /// <summary>
        /// 从json字符串判断是否存在键是key的value值
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <param name="key">要判断的key值</param>
        /// <returns>如果存在返回true, 否则返回false</returns>
        public static bool existKey(string jsonStr, string key)
        {
            bool _result = false;
            try
            {
                JObject json = JObject.Parse(jsonStr);
                object _valObj = json[key];
                if (_valObj != null) { _result = true; }
            }
            catch (Exception) { }
            return _result;
        }
        #endregion

        #region getPart: 分解json类型的字符串, 可以单独得到keyFields, value
        /// <summary>
        /// 分解json类型的字符串, 可以单独得到keyFields, value 
        /// </summary>
        /// <param name="jsonStr">json格式的字符串</param>
        /// <param name="part">part可以使key, value 两个值， 如果是key则返回fields的字符串, 否则返回 value的字符串</param>
        /// <returns>字符串</returns>
        public static string getPart(string jsonStr, string part)
        {
            string[] _kv = toKV(jsonStr);
            if (part == "key") { return _kv[0]; } else { return _kv[1]; }
        }
        #endregion

        #region toArray: json格式的字符串转成.net本地化的数组(ArrayList)
        /// <summary>
        /// jsonToArray: json格式的字符串转成.net本地化的数组(ArrayList)
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <returns>ArrayList数组</returns>
        public static ArrayList toArray(string jsonStr)
        {
            JObject json = JObject.Parse(jsonStr);
            ArrayList array = new ArrayList();
            string[] temp;
            foreach (JProperty field in json.Children())
            {
                string name = Filter.filterSqlStr(field.Name);
                string value = field.Value.ToString();
                value = Filter.filterSqlStr(value);
                value = Filter.filterNormalStr(value);
                temp = new string[] { name, value };
                array.Add(temp);
            }
            return array;
        }
        #endregion

        #region toArray: json格式的字符串转成.net本地化的数组(ArrayList)
        /// <summary>
        /// jsonToArray: json格式的字符串转成.net本地化的数组(ArrayList)
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <returns>ArrayList数组</returns>
        public static string jsonArrayListToString(ArrayList ary)
        {
            StringBuilder _str = new StringBuilder();
            _str.Append("[");
            for (int i = 0, _len = ary.Count; i < _len; i++) {
                Json _json = (Json)ary[i];
                _str.Append(_json.toDetail() + ",");
            }
            if (_str.Length > 1) { _str.Remove(_str.Length - 1, 1); };
            _str.Append("]");
            return _str.ToString(); ;
        }
        #endregion

        #region  toEncodeString: json格式字符串转成转码之后的链接字符串
        /// <summary>
        /// jsonToEncodeString： json格式字符串转成转码之后的链接字符串;
        /// </summary>
        /// <param name="jsonStr">
        /// 格式字符串;
        /// </param>
        /// <returns>
        /// 编码之后通过方式连接的字符串;
        /// </returns>
        public static string toEncodeString(string jsonStr)
        {
            StringBuilder _str = new StringBuilder();
            JObject json = JObject.Parse(jsonStr);
            Encoding code = Encoding.GetEncoding("UTF-8");
            foreach (JProperty field in json.Children())
            {
                string name = field.Name;
                string value = field.Value.ToString();
                _str.Append(HttpUtility.UrlEncode(name, code) + "=" + HttpUtility.UrlEncode(@value, code) + "&");
            }
            _str.Remove(_str.Length - 1, 1);
            return _str.ToString();
        }
        #endregion
    }
}