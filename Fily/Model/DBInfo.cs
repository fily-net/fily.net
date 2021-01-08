using System;
using System.Collections.Generic;
using System.Web;
using System.Configuration;

namespace Fily.Model
{
    public class DBInfo
    {
        private string dbServer;
        private string dbName;
        private string username;
        private string password;
        private string dbSettingStr = ";Min Pool Size=3;Max Pool Size=200;Asynchronous Processing=true;MultipleActiveResultSets=true;Connect Timeout=15;Connection Lifetime=30;";

        public DBInfo() { 
        
        }
        public DBInfo(string dbServer, string dbName, string username, string password)
        {
            setDbServer(dbServer);
            setDbName(dbName);
            setUsername(username);
            setPassword(password);
        }

        #region dbServer, dbName, username, password 四个私有变量的set, get方法定义
        public void setDbServer(string str) { dbServer = str; }
        public string getDbServer() { return dbServer; }
        public void setDbName(string str) { dbName = str; }
        public string getDbName() { return dbName; }
        public void setUsername(string str) { username = str; }
        public string getUsername() { return username; }
        public void setPassword(string str) { password = str; }
        public string getPassword() { return password; }
        #endregion

        public string toMsConnectionString(string connectionKey) 
        {
            string _cs = "Server=" + getDbServer() + ";DataBase=" + getDbName() + ";User Id=" + getUsername() + ";Password=" + getPassword();
            if (connectionKey != null&&connectionKey != "") { _cs = ConfigurationManager.AppSettings[connectionKey].ToString(); }
            return _cs + dbSettingStr;
        }

        public string toMsConnectionString()
        {
            return toMsConnectionString(null);
        }

        public string toMyConnectionString(string connectionKey)
        {
            string _cs = "CharSet=utf8;Data Source=" + getDbServer() + ";Database='" + getDbName() + "';User ID=" + getUsername() + ";Password=" + getPassword();
            if (connectionKey != null && connectionKey != "") { _cs = ConfigurationManager.AppSettings[connectionKey].ToString(); }
            return _cs;
        }

        public string toMyConnectionString()
        {
            return toMyConnectionString(null);
        }

    }
}