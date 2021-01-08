using System;
using System.Collections.Generic;
using System.Web;
using System.Collections;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.Sql;
using System.Data.SqlClient;
using Fily.Base;
using Fily.JSON;
using MySql.Data.MySqlClient;

namespace Fily.Data
{
    #region SQL 实务对象
    /// <summary>
    /// SqlTrans: SQL 实务对象
    /// </summary>
    public class MySqlTrans
    {
        #region 私有变量定义
        private MyBaseApi baseApi;
        private MySqlConnection sqlCon;
        private MySqlTransaction sqlTrans;
        private MySqlCommand cmd;
        private string _CLASS = "Fily.Data.MySqlTrans";
        public ConnectionState state;
        private string transName;
        #endregion

        #region SqlTrans: 通过传递BaseApi进行实务的构建
        public MySqlTrans(MyBaseApi _baseApi) { setBaseApi(_baseApi); }
        #endregion

        #region BaseApi对象的get, set方法
        public MyBaseApi getBaseApi() { return baseApi; }
        public void setBaseApi(MyBaseApi _baseApi)
        { 
            baseApi = _baseApi;
            sqlCon = _baseApi.getDBHelper().getDbConnecton();
            initTrans(); 
        }
        #endregion

        #region initTrans: 通过传递实务名进行初始化实务
        public void initTrans(string _transName)
        {
            if (transName == _transName) { return; }
            transName = _transName;
            state = ConnectionState.Open;
            try
            {
                sqlTrans = sqlCon.BeginTransaction(IsolationLevel.ReadUncommitted);
            }
            catch (Exception)
            {
                initTrans(); return;
            }
            state = ConnectionState.Connecting;
            cmd = new MySqlCommand();
            cmd.Connection = sqlCon;
            cmd.Transaction = sqlTrans;  //将执行事务的对象赋值给sqlCommand
        }
        #endregion

        #region initTrans: 无参数初始化实务
        public void initTrans()
        {
            try {
                string _tName = MRandom.RandLetter(10);
                initTrans(_tName);
            }catch(Exception){
                initTrans();
            }
        }
        #endregion

        #region execReader: 执行sql语句
        public string execReader(string sql)
        {
            string value = String.Empty;
            DBUtil.onExecSqlBefore(_CLASS, "execReader", sql);
            cmd.CommandText = @sql;
            state = ConnectionState.Executing;
            using (MySqlDataReader dr = cmd.ExecuteReader(CommandBehavior.Default))
            {
                switch (baseApi.getDataType().ToLower())
                {
                    case "json":
                        value = DBUtil.DataReaderToJsonArrayString(dr, baseApi.getReSplit());
                        break;
                    case "jsonobject":
                        //value = DBUtil.DataReaderToJsonObjectString(dr, baseApi.getReSplit(), );
                        break;
                    case "ary":
                    case "array":
                        value = DBUtil.DataReaderToArrayString(dr, baseApi.getReSplit());
                        break;
                    case "html":
                        value = DBUtil.DataReaderToHtml(dr, baseApi.getRSplit(), baseApi.getCSplit(), baseApi.getReSplit());
                        break;
                }
                dr.Close();
            }
            return value;
        }
        public string execReader(string sql, params object[] args)
        {
            return execReader(MySqlString.format(sql, args));
        }
        public string execReader(string sql, Json json)
        {
            return execReader(MySqlString.format(sql, json));
        }
        #endregion

        #region execNonQuery: 执行sql语句
        public int execNonQuery(string sql)
        {
            int _result = 0;
            try
            {
                DBUtil.onExecSqlBefore(_CLASS, "execNonQuery", sql);
                cmd.CommandText = @sql;
                state = ConnectionState.Executing;
                _result = cmd.ExecuteNonQuery();
            }
            catch (Exception e) {
                DBUtil.onExecSqlError(_CLASS, "execNonQuery", sql, e.Message);
            }
            return _result;
        }
        public int execNonQuery(string sql, params object [] args)
        {
            return execNonQuery(MySqlString.format(sql, args));
        }
        public int execNonQuery(string sql, Json json)
        {
            return execNonQuery(MySqlString.format(sql, json));
        }
        #endregion

        #region execScalar: 执行sql语句
        public string execScalar(string sql)
        {
            string _result = String.Empty;
            try
            {
                DBUtil.onExecSqlBefore(_CLASS, "execScalar", sql);
                cmd.CommandText = @sql;
                state = ConnectionState.Executing;
                object _rObj = cmd.ExecuteScalar();
                if(_rObj!=null){ _result = _rObj.ToString(); }
            }
            catch (Exception e) {
                _result = Native.getErrorMsg(e.Message);
                DBUtil.onExecSqlError(_CLASS, "execScalar", sql, e.Message);
            }
            return _result;
        }
        public string execScalar(string sql, params object [] args)
        {
            return execScalar(MySqlString.format(sql, args));
        }
        public string execScalar(string sql, Json json)
        {
            return execScalar(MySqlString.format(sql, json));
        }
        #endregion

        #region execArrayList: 执行sql语句并得到ArrayList形式的结果集, ArrayList中每一个元素都是一个ArrayList的对象, 二这个对象中又是每一行数据是字符串数组(string [] row)的集合
        /// <summary>
        /// execArrayList: 执行sql语句并得到ArrayList形式的结果集, ArrayList中每一个元素都是一个ArrayList的对象, 二这个对象中又是每一行数据是字符串数组(string [] row)的集合
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <returns>ArrayList对象</returns>
        public ArrayList execArrayList(string sql)
        {
            ArrayList dataSrc = null;
            try {
                DBUtil.onExecSqlBefore(_CLASS, "execArrayList", sql);
                cmd.CommandText = @sql;
                state = ConnectionState.Executing;
                using (MySqlDataReader dr = cmd.ExecuteReader(CommandBehavior.Default))
                {
                    dataSrc = DBUtil.DataReaderToArrayList(dr);
                    dr.Close();
                }
            }catch(Exception e){
                DBUtil.onExecSqlError(_CLASS, "execArrayList", sql, e.Message);
            }
            return dataSrc;
        }
        public ArrayList execArrayList(string sql, params object [] args)
        {
            return execArrayList(MySqlString.format(sql, args));
        }
        #endregion 

        #region execDataSet: 执行sql语句并得到DataSet结果集
        /// <summary>
        /// execDataSet: 执行sql语句并得到DataSet结果集
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <returns>DataSet对象</returns>
        public DataSet execDataSet(string sql)
        {
            DataSet ds = new DataSet();
            try
            {
                DBUtil.onExecSqlBefore(_CLASS, "execDataSet", sql);
                cmd.CommandText = @sql;
                state = ConnectionState.Executing;
                using (MySqlDataAdapter da = new MySqlDataAdapter(cmd))
                {
                    da.Fill(ds);
                }
            }
            catch (Exception e) {
                DBUtil.onExecSqlError(_CLASS, "execDataSet", sql, e.Message);
            }
            return ds;
        }
        public DataSet execDataSet(string sql, params object[] args)
        {
            return execDataSet(MySqlString.format(sql, args));
        }
        #endregion

        #region execJson: 执行sql语句并得到第一行数据的Json格式数据
        /// <summary>
        /// execJson: 执行sql语句并得到第一行数据的Json格式数据
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <returns>HashJson</returns>
        public Json execJson(string sql)
        {
            Json _json = null;
            try
            {
                DBUtil.onExecSqlBefore(_CLASS, "execJson", sql);
                cmd.CommandText = @sql;
                state = ConnectionState.Executing;
                using (MySqlDataReader dr = cmd.ExecuteReader(CommandBehavior.Default))
                {
                    _json = DBUtil.DataReaderToJson(dr);
                }
            }
            catch (Exception e) {
                DBUtil.onExecSqlError(_CLASS, "execJson", sql, e.Message);
            }
            return _json;
        }
        public Json execJson(string sql, params object[] args)
        {
            return execJson(MySqlString.format(sql, args));
        }
        #endregion

        #region execJsonList: 执行sql语句并得到第一行数据的Json格式数据
        /// <summary>
        /// execJson: 执行sql语句并得到第一行数据的Json格式数据
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <returns>HashJson</returns>
        public ArrayList execJsonList(string sql)
        {
            ArrayList list = null;
            try
            {
                DBUtil.onExecSqlBefore(_CLASS, "execJsonList", sql);
                cmd.CommandText = @sql;
                state = ConnectionState.Executing;
                using (MySqlDataReader dr = cmd.ExecuteReader(CommandBehavior.Default))
                {
                    list = DBUtil.DataReaderToJsonList(dr);
                }
            }
            catch (Exception e) {
                DBUtil.onExecSqlError(_CLASS, "execJsonList", sql, e.Message);
            }
            return list;
        }
        public ArrayList execJsonList(string sql, params object[] args)
        {
            return execJsonList(MySqlString.format(sql, args));
        }
        #endregion

        #region execHashJson: 执行sql语句并得到每一行是Json节点的Json对象
        /// <summary>
        /// 执行sql语句并得到每一行是Json节点的Json对象
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <returns>HashJson</returns>
        public Json execHashJson(string sql, string key)
        {
            Json _json = null;
            try
            {
                DBUtil.onExecSqlBefore(_CLASS, "execHashJson", sql);
                cmd.CommandText = @sql;
                state = ConnectionState.Executing;
                using (MySqlDataReader dr = cmd.ExecuteReader(CommandBehavior.Default))
                {
                    _json = DBUtil.DataReaderToHashJson(dr, key);
                }
            }
            catch (Exception e) {
                DBUtil.onExecSqlError(_CLASS, "execHashJson", sql, e.Message);
            }
            return _json;
        }
        #endregion

        #region addTreeNode: 添加树节点
        /// <summary>
        /// addTreeNode: 添加树节点
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_pid">父节点ID</param>
        /// <param name="_keys">字段列表</param>
        /// <param name="_values">值列表</param>
        /// <returns>返回当前树节点ID</returns>
        public string addTreeNode(string _table, int _pid, string _keys, string _values)
        {
            string _val = String.Empty;
            if (_pid == 0) { return execScalar(MySqlString.getInsertStr(_table, _keys, _values, true)); }
            Json _pre = execJson(MySqlString.getSelectStr(_table, "*", "id=" + _pid));
            if (_pre != null)
            {
                string _treeOrder = execScalar("select max(treeOrder)+1 from {0} where delFlag='0' and pid={1};", _table, _pid).ToString();
                if (Native.isNullEmpty(_treeOrder)||_treeOrder.ToLower()=="null") { _treeOrder = "1"; }
                string _k = _keys + ",parentPath,treeOrder,depth";
                string _v = _values + ",'" + _pre.getString("parentPath") + _pid + ",'," + _treeOrder + "," + (_pre.getInt("depth") + 1);
                if (_k.IndexOf("pid") == -1) { _k += ",pid"; _v += "," + _pid; }
                _val = execScalar(MySqlString.getInsertStr(_table, _k, _v, true));
                execNonQuery(MySqlString.getUpdateStr(_table, "sons=sons+1", "id=" + _pid));
            }
            else
            {
                _val = Native.getErrorMsg("在表({0})中pid={1}的节点不存在", _table, _pid);
            }
            return _val;
        }
        #endregion

        #region addRow: 添加树节点
        /// <summary>
        /// addRow: 添加树节点
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_keys">字段列表</param>
        /// <param name="_values">值列表</param>
        /// <returns></returns>
        public string addRow(string _table, string _keys, string _values)
        {
            if (Native.isEmpty(_keys) || Native.isEmpty(_values)) { return ""; }
            string _result = String.Empty;
            string sql = MySqlString.getInsertStr(_table, _keys, _values, true);
            try
            {
                DBUtil.onExecSqlBefore(_CLASS, "addRow", sql);
                cmd.CommandText = @sql;
                state = ConnectionState.Executing;
                object _rObj = cmd.ExecuteScalar();
                if (_rObj != null) { _result = _rObj.ToString(); }
            }
            catch (Exception e)
            {
                _result = Native.getErrorMsg(e.Message);
                DBUtil.onExecSqlError(_CLASS, "addRow", sql, e.Message);
            }
            return _result;
        }
        #endregion

        #region commit: 提交实务
        public void commit() {
            if (sqlTrans!=null) { 
                sqlTrans.Commit(); //提交事务
            }
            close();
        }
        #endregion

        #region rollback: 回滚实务
        public void rollback() {
            try
            {
                if (sqlTrans != null && sqlTrans.Connection != null) { sqlTrans.Rollback(); }
                close();
            }
            catch (System.Data.SqlClient.SqlException e)
            {
                DBUtil.onExecSqlError(_CLASS, "rollback", "rollback", e.Message.ToString() + ", 实务回滚失败");
            }
        }
        #endregion

        #region close: 关闭SqlConnection 对象
        public void close()
        {
            try
            {
                if (sqlCon != null) {
                    if (sqlCon.State != ConnectionState.Closed) { sqlCon.Close(); }
                }
                state = ConnectionState.Closed;
            }
            catch (System.Data.SqlClient.SqlException e)
            {
                Native.writeToPage(Native.getErrorMsg(e.Message.ToString() + ", 关闭SqlConnection失败!"));
            }
        }
        #endregion
    }
    #endregion
}