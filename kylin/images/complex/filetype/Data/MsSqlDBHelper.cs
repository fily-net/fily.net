using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.Sql;
using System.Data.SqlClient;
using System.Configuration;
using System.Web;
using Fily.Base;
using Fily.Util;
using Fily.JSON;

namespace Fily.Data
{
    /// <summary>
    /// 封装了对数据库的一些基本操作的方法
    /// </summary>
    public class MsSqlDBHelper: DBHelper
    {
        #region 变量定义
        private string _CLASS = "Fily.Data.MsSqlDBHelper";
        #endregion

        #region DBHelper: 无参数的构造函数
        public MsSqlDBHelper() :base(){ }
        #endregion

        #region DBHelper: 通过web.config中已经配置好连接数据库的key值进行初始化
        public MsSqlDBHelper(string conKey): base(conKey){}
        #endregion

        #region DBHelper: 有参数的构造函数
        public MsSqlDBHelper(string server, string db, string username, string password): base(server, db, username, password) {}
        #endregion

        public override SqlConnection getDbConnecton()
        {
            SqlConnection connection = null;
            try
            {
                if (dbConnections.Count > 0)
                {
                    foreach (IDbConnection con in dbConnections)
                    {
                        if (con.State == ConnectionState.Closed)
                        {
                            connection = (SqlConnection)con;
                            break;
                        }
                    }
                }
                else
                {
                    connection = new SqlConnection(dbInfo.toMsConnectionString());
                    dbConnections.Add(connection);
                }
            }
            catch (Exception)
            {
                return null;
            }
            connection.Open();
            return connection;

        }

        

        #region execScalar: 执行sql语句
        public override string execScalar(string sql)
        {
            string _result = String.Empty;
            try
            {
                DBUtil.onExecSqlBefore(_CLASS, "execScalar", sql);
                using (SqlConnection sqlConn = new SqlConnection(dbInfo.toMsConnectionString()))
                {
                    sqlConn.Open();
                    SqlCommand sqlComm = sqlConn.CreateCommand();
                    sqlComm.CommandText = sql;
                    _result = sqlComm.ExecuteScalar().ToString();
                    sqlConn.Close();
                }
            }
            catch (Exception ex)
            {
                DBUtil.onExecSqlError(_CLASS, "execScalar", sql, ex.Message);
                _result = Native.getErrorMsg(ex.Message);
            }
            return _result;
        }
        #endregion

        #region execTrans: 普通执行Sql语句  --  只适用于update, insert, delete, 存储过程 四种
        /// <summary>
        /// 普通执行Sql语句  --  只适用于update, insert, delete, 存储过程 四种 
        /// </summary>
        /// <param name="sql">执行sql语言</param>
        /// <returns>
        /// 1: 如果执行成功则返回字符串1
        /// 2: 如果执行失败则返回执行失败信息
        /// </returns>
        public override string execTrans(string sql, string dataType, string reSplit, string rSplit, string cSplit)
        {
            DBUtil.onExecSqlBefore(_CLASS, "execTrans", sql);
            SqlTransaction sqlTrans = null;
            SqlConnection connection = getDbConnecton();
            string value = String.Empty;
            try
            {
                sqlTrans = connection.BeginTransaction(); // 创建一个执行SQL事务的对象, 开启事务
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = connection;
                cmd.Transaction = sqlTrans;  //将执行事务的对象赋值给sqlCommand
                cmd.CommandText = @sql;
                using (SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.Default)) {
                    switch (dataType.ToLower())
                    {
                        case "json":
                            value = DBUtil.DataReaderToJsonArrayString(dr, reSplit);
                            break;
                        case "ary":
                        case "array":
                            value = DBUtil.DataReaderToArrayString(dr, reSplit);
                            break;
                        case "html":
                            value = DBUtil.DataReaderToHtml(dr, rSplit, cSplit, reSplit);
                            break;
                    }
                    dr.Close();
                }
                sqlTrans.Commit(); //提交事务
                connection.Close();
            }
            catch (Exception ex)
            {
                if (sqlTrans != null) { sqlTrans.Rollback(); connection.Close(); }
                value = Native.getErrorMsg(ex.Message);
                DBUtil.onExecSqlError(_CLASS, "execTrans", sql, ex.Message);
            }
            return value;
        }
        #endregion

        #region execNonQuery: 普通执行Sql语句  --  只适用于update, insert, delete, 存储过程 四种
        /// <summary>
        /// 普通执行Sql语句  --  只适用于update, insert, delete, 存储过程 四种 
        /// </summary>
        /// <param name="sql">执行sql语言</param>
        /// <returns>
        /// 1: 如果执行成功则返回字符串1
        /// 2: 如果执行失败则返回执行失败信息
        /// </returns>
        public override int execNonQuery(string sql)
        {
            int _result = 0;
            try
            {
                DBUtil.onExecSqlBefore(_CLASS, "execNonQuery", sql);
                using (SqlConnection sqlConn = new SqlConnection(dbInfo.toMsConnectionString()))
                {
                    sqlConn.Open();
                    SqlCommand sqlComm = sqlConn.CreateCommand();
                    sqlComm.CommandText = sql;
                    _result = sqlComm.ExecuteNonQuery();
                    sqlConn.Close();
                }
            }
            catch (Exception ex)
            {
                DBUtil.onExecSqlError(_CLASS, "execNonQuery", sql, ex.Message);
                _result = -1;
            }
            return _result;
        }
        #endregion

        #region execDataSet: 普通执行Sql语句  --  只适用于query, 存储过程 四种
        /// <summary>
        /// 普通执行Sql查询语句  --  只适用于query, 存储过程 四种
        /// </summary>
        /// <param name="sql">执行sql查询语言</param>
        /// <returns>
        /// 1: 如果执行成功则返回字符串1
        /// 2: 如果执行失败则返回执行失败信息
        /// </returns>
        public override DataSet execDataSet(string sql)
        {
            DataSet ds = new DataSet();
            try
            {
                DBUtil.onExecSqlBefore(_CLASS, "execDataSet", sql);
                using (SqlConnection sqlConn = new SqlConnection(dbInfo.toMsConnectionString()))
                {
                    sqlConn.Open();
                    SqlCommand sqlComm = sqlConn.CreateCommand();
                    sqlComm.CommandText = sql;
                    SqlDataAdapter dr = new SqlDataAdapter(sqlComm);
                    dr.Fill(ds);
                    sqlConn.Close();
                }
            }
            catch (Exception ex)
            {
                DBUtil.onExecSqlError(_CLASS, "execDataSet", sql, ex.Message);
            }
            return ds;
        }
        #endregion

        #region execJson: 普通执行Sql语句 
        /// <summary>
        /// execHashJson: 普通执行Sql语句
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <returns></returns>
        public override Json execJson(string sql)
        {
            Json json = null;
            try
            {
                DBUtil.onExecSqlBefore(_CLASS, "execHashJson", sql);
                using (SqlConnection sqlConn = new SqlConnection(dbInfo.toMsConnectionString()))
                {
                    sqlConn.Open();
                    SqlCommand sqlComm = sqlConn.CreateCommand();
                    sqlComm.CommandText = sql;
                    using (SqlDataReader dr = sqlComm.ExecuteReader(CommandBehavior.Default))
                    {
                        json = DBUtil.DataReaderToJson(dr);
                        dr.Close();
                    }
                    sqlConn.Close();
                }
            }
            catch (Exception ex)
            {
                DBUtil.onExecSqlError(_CLASS, "execHashJson", sql, ex.Message);
            }
            return json;
        }
        #endregion

        #region new execJsonList: 普通执行Sql语句
        /// <summary>
        /// execHashJson: 普通执行Sql语句
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <returns></returns>
        public override ArrayList execJsonList(string sql)
        {
            ArrayList list = null;
            try
            {
                DBUtil.onExecSqlBefore(_CLASS, "execJsonList", sql);
                using (SqlConnection sqlConn = new SqlConnection(dbInfo.toMsConnectionString()))
                {
                    sqlConn.Open();
                    SqlCommand sqlComm = sqlConn.CreateCommand();
                    sqlComm.CommandText = sql;
                    using (SqlDataReader dr = sqlComm.ExecuteReader(CommandBehavior.Default))
                    {
                        list = DBUtil.DataReaderToJsonList(dr);
                        dr.Close();
                    }
                    sqlConn.Close();
                }
            }
            catch (Exception ex)
            {
                DBUtil.onExecSqlError(_CLASS, "execJsonList", sql, ex.Message);
            }
            return list;
        }
        #endregion

        #region execHashJson: 普通执行Sql语句
        /// <summary>
        /// execHashJson: 普通执行Sql语句
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <returns></returns>
        public override Json execHashJson(string sql, string key)
        {
            Json hash = null;
            try
            {
                DBUtil.onExecSqlBefore(_CLASS, "execJsonList", sql);
                using (SqlConnection sqlConn = new SqlConnection(dbInfo.toMsConnectionString()))
                {
                    sqlConn.Open();
                    SqlCommand sqlComm = sqlConn.CreateCommand();
                    sqlComm.CommandText = sql;
                    using (SqlDataReader dr = sqlComm.ExecuteReader(CommandBehavior.Default))
                    {
                        hash = DBUtil.DataReaderToHashJson(dr, key);
                        dr.Close();
                    }
                    sqlConn.Close();
                }
            }
            catch (Exception ex)
            {
                DBUtil.onExecSqlError(_CLASS, "execJsonList", sql, ex.Message);
            }
            return hash;
        }
        #endregion

        #region getQueryResultByType: 根据不同的dataType得到相应的查询结果
        /// <summary>
        /// getQueryResultByType: 根据不同的dataType得到相应的查询结果
        /// </summary>
        /// <param name="sql">要执行查询的sql语句</param>
        /// <param name="dataType">数据类型</param>
        /// <param name="reSplit">结果集分隔符</param>
        /// <param name="rSplit">行分隔符</param>
        /// <param name="cSplit">列分隔符</param>
        /// <returns>查询结果根据dataType而得到的字符串数据</returns>
        public override string getQueryResultByType(string sql, string dataType, string reSplit, string rSplit, string cSplit)
        {
            string value = String.Empty;
            DBUtil.onExecSqlBefore(_CLASS, "getQueryResultByType", sql);
            try
            {
                using (SqlConnection sqlConn = new SqlConnection(dbInfo.toMsConnectionString()))
                {
                    sqlConn.Open();
                    SqlCommand sqlComm = sqlConn.CreateCommand();
                    sqlComm.CommandText = sql;
                    using (IDataReader dr = sqlComm.ExecuteReader(CommandBehavior.Default)) {
                        switch (dataType.ToLower())
                        {
                            case "json":
                                value = DBUtil.DataReaderToJsonArrayString(dr, reSplit);
                                break;
                            case "json-object":
                                value = DBUtil.DataReaderToJsonArrayString(dr, reSplit);
                                break;
                            case "ary":
                            case "array":
                                value = DBUtil.DataReaderToArrayString(dr, reSplit);
                                break;
                            case "html":
                                value = DBUtil.DataReaderToHtml(dr, rSplit, cSplit, reSplit);
                                break;
                        }
                        dr.Close();
                    }
                    sqlConn.Close();
                }
            }
            catch (Exception ex)
            {
                value = Native.getErrorMsg(ex.Message);
                DBUtil.onExecSqlError(_CLASS, "getQueryResultByType", sql, ex.Message);
            }
            return value;
        }
        #endregion 

        #region getArrayResult: 得到数组结果集
        /// <summary>
        /// getArrayResult: 得到数组结果集
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <returns></returns>
        public override ArrayList getArrayListResult(string sql)
        {
            ArrayList dataSrc = null;
            DBUtil.onExecSqlBefore(_CLASS, "getArrayListResult", sql);
            try
            {
                using (SqlConnection sqlConn = new SqlConnection(dbInfo.toMsConnectionString()))
                {
                    sqlConn.Open();
                    SqlCommand sqlComm = sqlConn.CreateCommand();
                    sqlComm.CommandText = sql;
                    using (SqlDataReader dr = sqlComm.ExecuteReader(CommandBehavior.Default))
                    {
                        dataSrc = DBUtil.DataReaderToArrayList(dr);
                        dr.Close();
                    }
                    sqlConn.Close();
                }
            }
            catch (Exception ex)
            {
                DBUtil.onExecSqlError(_CLASS, "getArrayListResult", sql, ex.Message);
            }
            return dataSrc;
        }
        #endregion

    }
}