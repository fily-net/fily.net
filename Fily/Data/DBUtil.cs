using System;
using System.Data;
using System.Text;
using System.Data.SqlClient;
using System.Collections;
using System.Web;
using Fily.Base;
using Fily.Util;
using Fily.JSON;
using MySql.Data.MySqlClient;

namespace Fily.Data
{
    public static class DBUtil
    {
        #region 私有属性
        private static BaseApi api;
        private static DBHelper helper;
        private static ArrayList transAry = new ArrayList();
        #endregion 

        #region BaseApi, DBHelper set和get方法
        public static void setBaseApi(BaseApi _api) { api = _api; }
        public static BaseApi getBaseApi() { return api; }
        public static void setDBHelper(DBHelper _helper) { helper = _helper; }
        public static DBHelper getDBHelper() { return helper; }
        #endregion

        #region getSqlTrans: 得到SqlTrans对象
        /// <summary>
        /// getSqlTrans: 得到SqlTrans对象
        /// </summary>
        /// <returns>SqlTrans对象</returns>
        public static SqlTrans getSqlTrans() {
            SqlTrans _trans = null;
            if (helper == null) { helper = new MsSqlDBHelper(); }
            if (api == null) { api = new BaseApi(helper); }
            if (transAry.Count < 5)
            {
                _trans = new SqlTrans(api);
                transAry.Add(_trans);
            }
            else {
                for (int i = 0; i < transAry.Count; i++)
                { 
                    _trans = (SqlTrans)transAry[i];
                    if (_trans == null) { transAry.Remove(i); continue;}
                    if (_trans.state != ConnectionState.Closed) { break; }
                }
                if (_trans == null) {
                    _trans = new SqlTrans(api);
                    transAry.Add(_trans);
                }
            }
            return _trans;
        }
        #endregion

        #region DataReaderToJsonArrayString: 输出SqlDataReader中的数据为Json格式 -- (Json)
        /// <summary>
        /// DataReaderToJsonArrayString: 输出SqlDataReader中的数chuanjian据为Json格式 -- (Json)
        /// </summary>
        /// <param name="SqlDataReader">SqlDataReader对象</param>
        /// <param name="reSplit">数据集分隔符, 默认是"@&@"</param>
        /// <returns>json格式的字符串</returns>
        public static string DataReaderToJsonArrayString(IDataReader dr, string reSplit)
        {
            int _reLen = reSplit.Length;
            try
            {
                StringBuilder strDS = new StringBuilder();
                do
                {
                    StringBuilder sbRow = new StringBuilder();
                    if (dr.Read())
                    {
                        int i, _len = dr.FieldCount;
                        /*
                         * 方案一  --begin--
                        if (_len == 1){
                            string _tepVal = dr.GetValue(0).ToString(),_tepName = dr.GetName(0);
                            if (dr.Read())
                            {
                                sbRow.Append("[{\"" + _tepName +"\":\""+ _tepVal + "\"},");
                                while (dr.Read())
                                {
                                    sbRow.Append("{\"" +dr.GetName(0)+"\":\""+ dr.GetValue(0).ToString() + "\"},");
                                }
                                sbRow.Remove(sbRow.Length - 1, 1);
                                sbRow.Append("]");
                            }
                            else
                            {
                                sbRow.Append(_tepVal);
                            }
                        }else {
                            sbRow.Append('[');
                            do
                            {
                                sbRow.Append("{");
                                for (i = 0; i < _len; i++)
                                {
                                    string _key = dr.GetName(i), _val = dr.GetValue(i).ToString();
                                    if (_key.Length == 0 || _key == "") { _key = "count"; }
                                    sbRow.Append("\"" + _key + "\":\"" + _val + "\",");
                                }
                                sbRow.Remove(sbRow.Length - 1, 1);
                                sbRow.Append("},");
                            } while (dr.Read());
                            sbRow.Remove(sbRow.Length - 1, 1);
                            sbRow.Append(']');
                        }
                         *方案一  --begin-- 
                         */
                        /**方案二  --begin-- **/
                        sbRow.Append('[');
                        do
                        {
                            sbRow.Append("{");
                            for (i = 0; i < _len; i++)
                            {
                                string _key = dr.GetName(i), _val = dr.GetValue(i).ToString().Trim();
                                if (_key.Length == 0 || _key == "") { _key = "count"; }
                                _val = _val.Replace("\"","\\\"");
                                sbRow.Append("\"" + _key + "\":\"" + _val + "\",");
                            }
                            sbRow.Remove(sbRow.Length - 1, 1);
                            sbRow.Append("},");
                        } while (dr.Read());
                        sbRow.Remove(sbRow.Length - 1, 1);
                        sbRow.Append(']');
                        /**方案二  --end-- **/
                        strDS.Append(sbRow);
                    }
                    strDS.Append(reSplit);
                } while (dr.NextResult());
                strDS.Remove(strDS.Length - _reLen, _reLen);
                return Filter.refilterStr(strDS.ToString());
            }
            catch (Exception ex)
            {
                Native.write(Native.getErrorMsg(ex.Message));
                return Native.getErrorMsg(ex.Message);
            }
        }
        #endregion

        #region DataReaderToJsonObjectString: 输出SqlDataReader中的数据为Json格式 -- (Json)
        /// <summary>
        /// DataReaderToJsonObjectString: 输出SqlDataReader中的数chuanjian据为Json格式 -- (Json)
        /// </summary>
        /// <param name="SqlDataReader">SqlDataReader对象</param>
        /// <param name="reSplit">数据集分隔符, 默认是"@&@"</param>
        /// <returns>json格式的字符串</returns>
        public static string DataReaderToJsonObjectString(IDataReader dr, string reSplit, string key, string value)
        {
            int _reLen = reSplit.Length;
            try
            {
                StringBuilder strDS = new StringBuilder();
                do
                {
                    StringBuilder sbRow = new StringBuilder();
                    if (dr.Read())
                    {
                        int i, _len = dr.FieldCount;
                        /*
                         * 方案一  --begin--
                        if (_len == 1){
                            string _tepVal = dr.GetValue(0).ToString(),_tepName = dr.GetName(0);
                            if (dr.Read())
                            {
                                sbRow.Append("[{\"" + _tepName +"\":\""+ _tepVal + "\"},");
                                while (dr.Read())
                                {
                                    sbRow.Append("{\"" +dr.GetName(0)+"\":\""+ dr.GetValue(0).ToString() + "\"},");
                                }
                                sbRow.Remove(sbRow.Length - 1, 1);
                                sbRow.Append("]");
                            }
                            else
                            {
                                sbRow.Append(_tepVal);
                            }
                        }else {
                            sbRow.Append('[');
                            do
                            {
                                sbRow.Append("{");
                                for (i = 0; i < _len; i++)
                                {
                                    string _key = dr.GetName(i), _val = dr.GetValue(i).ToString();
                                    if (_key.Length == 0 || _key == "") { _key = "count"; }
                                    sbRow.Append("\"" + _key + "\":\"" + _val + "\",");
                                }
                                sbRow.Remove(sbRow.Length - 1, 1);
                                sbRow.Append("},");
                            } while (dr.Read());
                            sbRow.Remove(sbRow.Length - 1, 1);
                            sbRow.Append(']');
                        }
                         *方案一  --begin-- 
                         */
                        /**方案二  --begin-- **/
                        sbRow.Append('[');
                        do
                        {
                            sbRow.Append("{\"" + dr.GetValue(0).ToString().Trim() + "\":\"" + dr.GetValue(1).ToString().Trim() + "\"}");
                            for (i = 0; i < _len; i++)
                            {
                                string _key = dr.GetName(i), _val = dr.GetValue(i).ToString().Trim();
                                if (_key.Length == 0 || _key == "") { _key = "count"; }
                                _val = _val.Replace("\"", "\\\"");
                                sbRow.Append("\"" + _key + "\":\"" + _val + "\",");
                            }
                            sbRow.Remove(sbRow.Length - 1, 1);
                            sbRow.Append("},");
                        } while (dr.Read());
                        sbRow.Remove(sbRow.Length - 1, 1);
                        sbRow.Append(']');
                        /**方案二  --end-- **/
                        strDS.Append(sbRow);
                    }
                    strDS.Append(reSplit);
                } while (dr.NextResult());
                strDS.Remove(strDS.Length - _reLen, _reLen);
                return Filter.refilterStr(strDS.ToString());
            }
            catch (Exception ex)
            {
                Native.write(Native.getErrorMsg(ex.Message));
                return Native.getErrorMsg(ex.Message);
            }
        }
        #endregion

        #region DataReaderToArrayString: 输出SqlDataReader中的数据为数组格式 -- (Array)
        /// <summary>
        /// DataReaderToArrayString: 输出SqlDataReader中的数据为数组格式 -- (Array)
        /// </summary>
        /// <param name="SqlDataReader">SqlDataReader对象</param>
        /// <param name="reSplit">数据集分隔符, 默认是"@&@"</param>
        /// <returns>数组格式字符串</returns>
        public static string DataReaderToArrayString(IDataReader dr, string reSplit)
        {
            int _reLen = reSplit.Length;
            try
            {
                StringBuilder strDS = new StringBuilder();
                do
                {
                    StringBuilder sbRow = new StringBuilder();
                    if (dr.Read())
                    {
                        int i, _len = dr.FieldCount;
                        /* 方案二
                        if (_len == 1)
                        {
                            string _tepVal = dr.GetValue(0).ToString();
                            if (dr.Read())
                            {
                                sbRow.Append("[[" + _tepVal + "],");
                                while (dr.Read())
                                {
                                    sbRow.Append("[" + dr.GetValue(0).ToString() + "],");
                                }
                                sbRow.Remove(sbRow.Length - 1, 1);
                                sbRow.Append("]");
                            }
                            else
                            {
                                sbRow.Append(_tepVal);
                            }
                        }
                        else
                        {
                            sbRow.Append('[');
                            do
                            {
                                sbRow.Append("[");
                                for (i = 0; i < _len; i++)
                                {
                                    string _val = "\"" + dr.GetValue(i).ToString() + "\"";
                                    sbRow.Append(_val + ",");
                                }
                                sbRow.Remove(sbRow.Length - 1, 1);
                                sbRow.Append("],");
                            } while (dr.Read());
                            sbRow.Remove(sbRow.Length - 1, 1);
                            sbRow.Append(']');
                        }
                         * */
                        //方案二
                        sbRow.Append('[');
                        do
                        {
                            sbRow.Append("[");
                            for (i = 0; i < _len; i++)
                            {
                                string _val = "\"" + dr.GetValue(i).ToString().Trim() + "\"";
                                sbRow.Append(_val + ",");
                            }
                            sbRow.Remove(sbRow.Length - 1, 1);
                            sbRow.Append("],");
                        } while (dr.Read());
                        sbRow.Remove(sbRow.Length - 1, 1);
                        sbRow.Append(']');

                        strDS.Append(sbRow);
                    }
                    strDS.Append(reSplit);
                } while (dr.NextResult());
                strDS.Remove(strDS.Length - _reLen, _reLen);
                return Filter.refilterStr(strDS.ToString());
            }
            catch (Exception ex)
            {
                return Native.getErrorMsg(ex.Message);
            }
        }
        #endregion

        #region DataReaderToHtml: 输出SqlDataReader中的数据为Html格式 -- (Html)
        /// <summary>
        /// resultToHtml: 输出SqlDataReader中的数据为Html格式 -- (Html)
        /// </summary>
        /// <param name="SqlDataReader">要转换的SqlDataReader</param>
        /// <param name="rSplit">行分隔符</param>
        /// <param name="cSplit">列分隔符</param>
        /// <param name="reSplit">数据集分隔符</param>
        /// <returns>通过各种分隔符组合成的字符串</returns>
        public static string DataReaderToHtml(IDataReader dr, string rSplit, string cSplit, string reSplit)
        {
            int _rLen = rSplit.Length, _cLen = cSplit.Length, _reLen = reSplit.Length;
            try
            {
                StringBuilder strDS = new StringBuilder();
                do
                {
                    StringBuilder sbRow = new StringBuilder();
                    if (dr.Read())
                    {
                        int i, _len = dr.FieldCount;
                        /* 方案一： 
                        if (_len == 1)
                        {
                            string _tepVal = dr.GetValue(0).ToString();
                            if (dr.Read())
                            {
                                sbRow.Append(_tepVal + rSplit);
                                while (dr.Read()) {
                                    sbRow.Append(dr.GetValue(0).ToString() + rSplit);
                                }
                                sbRow.Remove(sbRow.Length - _rLen, _rLen);
                            }
                            else {
                                sbRow.Append(_tepVal);
                            }
                        }
                        else
                        {
                            do
                            {
                                for (i = 0; i < _len; i++)
                                {
                                    string _val = dr.GetValue(i).ToString();
                                    sbRow.Append(_val + cSplit);
                                }
                                sbRow.Remove(sbRow.Length - _cLen, _cLen);
                                sbRow.Append(rSplit);
                            } while (dr.Read());
                            sbRow.Remove(sbRow.Length - _rLen, _rLen);
                        }
                         * */
                        //方案二
                        do
                        {
                            for (i = 0; i < _len; i++)
                            {
                                string _val = dr.GetValue(i).ToString().Trim();
                                sbRow.Append(_val + cSplit);
                            }
                            sbRow.Remove(sbRow.Length - _cLen, _cLen);
                            sbRow.Append(rSplit);
                        } while (dr.Read());
                        sbRow.Remove(sbRow.Length - _rLen, _rLen);

                        strDS.Append(sbRow);
                    }
                    strDS.Append(reSplit);
                } while (dr.NextResult());
                strDS.Remove(strDS.Length - _reLen, _reLen);
                return Filter.refilterStr(strDS.ToString());
            }
            catch (Exception ex)
            {
                return Native.getErrorMsg(ex.Message);
            }
        }
        #endregion

        #region DataReaderToArrayList: 把SqlDataReader对象转换成ArrayList形式的结果集, ArrayList中每一个元素都是一个ArrayList的对象, 二这个对象中又是每一行数据是字符串数组(string [] row)的集合
        /// <summary>
        /// DataReaderToArrayList: 把SqlDataReader对象转换成ArrayList形式的结果集, ArrayList中每一个元素都是一个ArrayList的对象, 二这个对象中又是每一行数据是字符串数组(string [] row)的集合
        /// </summary>
        /// <param name="dr">SqlDataReader对象</param>
        /// <returns>ArrayList对象</returns>
        public static ArrayList DataReaderToArrayList(IDataReader dr)
        {
            ArrayList dataSrc = new ArrayList();
            do
            {
                ArrayList view = new ArrayList();
                if (dr.Read())
                {
                    do
                    {
                        int _len = dr.FieldCount;
                        string[] _row = new string[_len];
                        for (int i = 0; i < _len; i++)
                        {
                            _row[i] = Filter.refilterStr(dr.GetValue(i).ToString());
                        }
                        view.Add(_row);
                    } while (dr.Read());
                }
                dataSrc.Add(view);
            } while (dr.NextResult());
            return dataSrc;
        }
        #endregion

        #region DataReaderToJson: 把SqlDataReader对象转换成ArrayList形式的结果集, ArrayList中每一个元素都是一个ArrayList的对象, 二这个对象中又是每一行数据是字符串数组(string [] row)的集合
        /// <summary>
        /// DataReaderToArrayList: 把SqlDataReader对象转换成ArrayList形式的结果集, ArrayList中每一个元素都是一个ArrayList的对象, 二这个对象中又是每一行数据是字符串数组(string [] row)的集合
        /// </summary>
        /// <param name="dr">SqlDataReader对象</param>
        /// <returns>ArrayList对象</returns>
        public static Json DataReaderToJson(IDataReader dr)
        {
            Json _json = null;
            if (dr.Read())
            {
                _json = new Json();
                for (int i = 0, _len = dr.FieldCount; i < _len; i++)
                {
                    string _key = dr.GetName(i), _val = Filter.refilterStr(dr.GetValue(i).ToString());
                    if (Native.isEmpty(_key)) { _key = "count"; }
                    _json[_key] = _val;
                }
            }
            return _json;
        }
        #endregion

        #region DataReaderToJsonList: 把SqlDataReader对象转换成ArrayList形式的结果集, ArrayList中每一个元素都是一个ArrayList的对象, 二这个对象中又是每一行数据是字符串数组(string [] row)的集合
        /// <summary>
        /// DataReaderToArrayList: 把SqlDataReader对象转换成ArrayList形式的结果集, ArrayList中每一个元素都是一个ArrayList的对象, 二这个对象中又是每一行数据是字符串数组(string [] row)的集合
        /// </summary>
        /// <param name="dr">SqlDataReader对象</param>
        /// <returns>ArrayList对象</returns>
        public static ArrayList DataReaderToJsonList(IDataReader dr)
        {
            ArrayList list = new ArrayList();
            Json json = null;
            if (dr.Read())
            {
                do
                {
                    json = new Json();
                    for (int i = 0, _len = dr.FieldCount; i < _len; i++)
                    {
                        string _key = dr.GetName(i), _val = Filter.refilterStr(dr.GetValue(i).ToString());
                        if (Native.isEmpty(_key)) { _key = "count"; }
                        json[_key] = _val;
                    }
                    list.Add(json);
                } while (dr.Read());
            }
            return list;
        }
        #endregion

        #region DataReaderToHashJson: 把SqlDataReader对象转换成ArrayList形式的结果集, ArrayList中每一个元素都是一个ArrayList的对象, 二这个对象中又是每一行数据是字符串数组(string [] row)的集合
        /// <summary>
        /// DataReaderToArrayList: 把SqlDataReader对象转换成ArrayList形式的结果集, ArrayList中每一个元素都是一个ArrayList的对象, 二这个对象中又是每一行数据是字符串数组(string [] row)的集合
        /// </summary>
        /// <param name="dr">SqlDataReader对象</param>
        /// <returns>ArrayList对象</returns>
        public static Json DataReaderToHashJson(IDataReader dr, string key)
        {
            Json hash = new Json();
            Json json = null;
            string _hashKey = String.Empty;
            if (dr.Read())
            {
                do
                {
                    json = new Json();
                    for (int i = 0, _len = dr.FieldCount; i < _len; i++)
                    {
                        string _key = dr.GetName(i), _val = Filter.refilterStr(dr.GetValue(i).ToString());
                        if (Native.isEmpty(_key)) { _key = "count"; }
                        if (key == _key) { _hashKey = _val; }
                        json[_key] = _val;
                    }
                    hash[_hashKey] = json;
                } while (dr.Read());
            }
            return hash;
        }
        #endregion

        #region onExecSqlBefore: 执行sql之前的回调函数
        /// <summary>
        /// onExecSqlBefore: 执行sql之前的回调函数
        /// </summary>
        /// <param name="_class">所属类名</param>
        /// <param name="_method">所属类的方法名</param>
        /// <param name="_sql">要执行的sql语句</param>
        public static void onExecSqlBefore(string _class, string _method, string _sql) {
            if (Native.getDebug() == Native.DEBUG_SQL) {
                System.Diagnostics.StackTrace st = new System.Diagnostics.StackTrace(1, true);
                Native.write("<br>【debug_sql_begin】{0}.{1}: {2} ----line:{3}【debug_sql_end】<br>", _class, _method, _sql, st.GetFrame(0).GetFileLineNumber()); 
            }
        }
        #endregion

        #region onExecSqlError: 在执行sql出错时执行的回调
        /// <summary>
        /// onExecSqlError: 在执行sql出错时执行的回调
        /// </summary>
        /// <param name="_class">所属类名</param>
        /// <param name="_method">所属类的方法名</param>
        /// <param name="_sql">要执行的sql语句</param>
        /// <param name="_errorMessage">执行出错信息</param>
        public static void onExecSqlError(string _class, string _method, string _sql, string _errorMessage)
        {
            if (Native.getDebug() == Native.DEBUG_ERROR)
            {
                System.Diagnostics.StackTrace st = new System.Diagnostics.StackTrace(1, true);
                Native.write("<br>【error_sql_begin】{0}.{1}: {2} ----Message:{3},   ----line:{4}【error_sql_end】<br>", _class, _method, _sql, _errorMessage, st.GetFrame(0).GetFileLineNumber());
            }
        }
        #endregion
    }
}