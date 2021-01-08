using System;
using System.Collections.Generic;
using System.Web;
using System.IO;
using Fily.Base;
using Fily.Data;

namespace Fily.Util
{
    public class Logger
    {
        #region 私有变量 
        public static readonly int LOCAL = 0;
        public static readonly int NET = 1;
        public static readonly int ALL = 10;
        public static readonly string T_YEAR = "year";
        public static readonly string T_MONTH = "month";
        public static readonly string T_DAY = "day";
        private string path =  HttpContext.Current.Server.MapPath("Logs/");
        private MsSqlDBHelper helper;
        private static Logger logger;
        private int type;
        private string logMode = T_DAY;
        #endregion

        #region 构造函数
        public Logger() 
        {
            setType(LOCAL);
        }
        public Logger(MsSqlDBHelper _helper)
        {
            setDBHelper(_helper);
            setType(NET);
        }
        #endregion

        #region 获取静态对象Logger
        public static Logger getLogger() {
            if (logger == null) { logger = new Logger(); }
            return logger;
        }
        public static Logger getLogger(MsSqlDBHelper helper)
        {
            if (logger == null) { logger = new Logger(helper); }
            return logger;
        }
        #endregion

        #region set, get
        public void setDBHelper(MsSqlDBHelper _helper) { helper = _helper; }
        public MsSqlDBHelper getDBHelper() { return helper; }
        public void setLogMode(string _mode) { logMode = _mode; }
        public string getlogMode() { return logMode; }
        public void setType(int _type) { type = _type; }
        public int getType() { return type; }
        #endregion

        #region 获取输入, 输出流
        private StreamWriter getWriter(string _flleName) {
            StreamWriter _sf = null;
            string _format = "yyyy", _mode = getlogMode();
            if (_mode == T_MONTH) { _format += "-MM"; }
            if (_mode == T_DAY) { _format += "-MM-dd"; }
            _flleName = DateTime.Today.ToString(_format) + "_" +_flleName;
            string _path = path + _flleName;
            try
            {
                if (!File.Exists(_path)) { File.Create(_path).Close(); }
                _sf = File.AppendText(_path);
            }
            catch (IOException e) {
                Native.writeToPage(Native.getErrorMsg(e.Message.ToString()));
            }
            return _sf;
        }
        private StreamReader getReader(string _flleName)
        {
            StreamReader _sr = null;
            string _path = path + _flleName;
            if (System.IO.File.Exists(_path))
            {
                _sr = File.OpenText(_path);
            }
            return _sr;
        }
        #endregion

        #region error, debug, info, log, logToNet
        public Logger error(string _text)
        {
            write("error", _text); return this;
        }
        public Logger debug(string _text)
        {
            write("debug", _text); return this;
        }
        public Logger info(string _text)
        {
            write("info", _text); return this;
        }
        public Logger log(string _text)
        {
            write("log", _text); return this;
        }
        public Logger logToNet(string action, string table, string content)
        {
            writeToNet(action, table, content); return this;
        }
        #endregion

        #region 记录在Logs目录下的日志文件中
        private void writeToLocal(string _fileName, string _text) {
            StreamWriter _sw = getWriter(_fileName + ".log"), _dataInput = getWriter(_fileName + "_data.log");
            _sw.WriteLine("[" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "] " + _text);
            _sw.Flush();
            _sw.Close();
            _dataInput.WriteLine(_text);
            _dataInput.Flush();
            _dataInput.Close();
        }
        #endregion

        #region 记录在数据库中的表中
        private void writeToNet(string action, string table, string content) {
            string _sql = "insert into {0} ({1},cPerson) values ({2}," + MSession.get(MSession.getClientKey()) + ");", _return = MString.format(_sql, R.Table.CM_LOGS, "action,tid,content,y,m,d", "'" + action + "','" + table + "','" + Filter.filterNormalStr(Filter.filterSqlStr(content)) + "','" + DateTime.Now.Year + "','" + DateTime.Now.Month + "','" + DateTime.Now.Day + "'");
            helper.execNonQuery(_return);
        }
        #endregion

        private void write(string _fileName, string _text) { writeToLocal(_fileName, _text); }

    }
}