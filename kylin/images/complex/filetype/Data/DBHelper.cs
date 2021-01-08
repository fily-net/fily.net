using System;
using System.Collections.Generic;
using System.Collections;
using System.Text;
using System.Data;
using System.Data.Sql;
using System.Data.SqlClient;
using System.Configuration;
using System.Web;
using Fily.Base;
using Fily.Util;
using Fily.JSON;
using Fily.Model;

namespace Fily.Data
{
    public class DBHelper
    {
        #region 变量定义
        #endregion
        public DBInfo dbInfo;
        public ArrayList dbConnections = new ArrayList();
        public DBHelper() 
        {
            try
            {
                dbInfo = new DBInfo(ConfigurationManager.AppSettings["Server"],
                    ConfigurationManager.AppSettings["DataBase"],
                    ConfigurationManager.AppSettings["UserID"],
                    ConfigurationManager.AppSettings["Password"]);
                DBUtil.setDBHelper(this);
            }
            catch (Exception)
            {
                Native.writeToPage(Native.getErrorMsg("未能在Web.config配置文件的appSettings中找到Server, DataBase, UserID, Password的节点"));
            }
        }

        public DBHelper(string server, string db, string username, string password)
        {
            dbInfo = new DBInfo(server, db, username, password);
            DBUtil.setDBHelper(this);
        }
        public DBHelper(string connectionString) 
        {
            try
            {
                string _setting = ConfigurationManager.AppSettings[connectionString].ToString();
                string[] _sAry = _setting.Split(';');
                dbInfo = new DBInfo();
                for (int i = 0, _sLen = _sAry.Length; i < _sLen; i++)
                {
                    string[] _kvAry = _sAry[i].Split('=');
                    switch (_kvAry[0])
                    {
                        case "Server": dbInfo.setDbServer(_kvAry[1]); break;
                        case "DataBase": dbInfo.setDbName(_kvAry[1]); break;
                        case "User Id": dbInfo.setUsername(_kvAry[1]); break;
                        case "Password": dbInfo.setPassword(_kvAry[1]); break;
                    }
                }
                DBUtil.setDBHelper(this);
            }
            catch (Exception)
            {
                Native.writeToPage(Native.getErrorMsg("未能在Web.config配置文件的appSettings中找到key值是" + connectionString + "的节点"));
            }
        }

        public virtual SqlConnection getDbConnecton() 
        {
            SqlConnection connection = null;
            try
            {
                if (dbConnections.Count > 0) {
                    foreach (SqlConnection con in dbConnections)
                    { 
                        if(con.State == ConnectionState.Closed) {
                            connection = con;
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
        public virtual string execScalar(string sql)
        {
            return String.Empty;
        }
        public virtual string execScalar(string sql, params object[] args)
        {
            return execScalar(MString.format(sql, args));
        }
        public virtual string execScalar(string sql, Json json)
        {
            return execScalar(MString.format(sql, json));
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
        public virtual string execTrans(string sql, string dataType, string reSplit, string rSplit, string cSplit)
        {
            return String.Empty;
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
        public virtual int execNonQuery(string sql)
        {
            return 0;
        }
        public virtual int execNonQuery(string sql, params object[] args)
        {
            return execNonQuery(MString.format(sql, args));
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
        public virtual DataSet execDataSet(string sql)
        {
            return new DataSet();
        }
        public virtual DataSet execDataSet(string sql, params object[] args)
        {
            return execDataSet(MString.format(sql, args));
        }
        #endregion

        #region execJson: 普通执行Sql语句 
        /// <summary>
        /// execHashJson: 普通执行Sql语句
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <returns></returns>
        public virtual Json execJson(string sql)
        {
            return null;
        }
        public virtual Json execJson(string sql, params object[] args)
        {
            return execJson(sql, args);
        }
        #endregion

        #region execJsonList: 普通执行Sql语句
        /// <summary>
        /// execHashJson: 普通执行Sql语句
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <returns></returns>
        public virtual ArrayList execJsonList(string sql)
        {
            return null;
        }
        public virtual ArrayList execJsonList(string sql, params object[] args)
        {
            return execJsonList(sql, args);
        }
        #endregion

        #region execHashJson: 普通执行Sql语句
        /// <summary>
        /// execHashJson: 普通执行Sql语句
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <returns></returns>
        public virtual Json execHashJson(string sql, string key)
        {
            return null;
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
        public virtual string getQueryResultByType(string sql, string dataType, string reSplit, string rSplit, string cSplit) {
            return String.Empty;
        }
        #endregion 

        #region getArrayResult: 得到数组结果集
        /// <summary>
        /// getArrayResult: 得到数组结果集
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <returns></returns>
        public virtual ArrayList getArrayListResult(string sql)
        {
            return null;
        }
        /// <summary>
        /// getArrayResult: 得到数组结果集
        /// </summary>
        /// <param name="sql">要执行的sql语句</param>
        /// <param name="args">参数</param>
        /// <returns></returns>
        public virtual ArrayList getArrayListResult(string sql, params object[] args)
        {
            return getArrayListResult(MString.format(sql, args));
        }
        #endregion 

        public virtual string getDBInfo(string dataType, string reSplit, string rSplit, string cSplit)
        {
            return getQueryResultByType("", dataType, reSplit, rSplit, cSplit);
        }
       
    }
}
