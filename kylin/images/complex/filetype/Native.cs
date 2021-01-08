using System;
using System.Collections.Generic;
using System.Linq;
using System.Configuration;
using System.Text;
using System.Collections;
using System.Web;
using System.Net;
using System.Text.RegularExpressions;
using Fily.JSON;
using Fily.Util;

namespace Fily.Base
{
    #region Native 本框架提供一些基本单元函数, 静态类，可以直接通过类名调用
    /// <summary>
    /// Native 本框架提供一些基本单元函数
    /// </summary>
    public static class Native
    {
        #region 变量定义
        private static string modulePath = "Module/";
        private static string reSplit = "@&@";
        private static string ERR_STR = "errorInfo=执行出错: ";
        public static readonly string CHECK_ERR = "SYS_ERROR";
        public static readonly string CHECK_RESULT = "SYS_RESULT";
        public static bool ifWriteToPage = false;
        public const int DEBUG_INFO = 0;        //输出基本调试信息
        public const int DEBUG_SQL = 10;        //输出sql信息
        public const int DEBUG_ERROR = 20;      //输出错误信息
        public const int DEBUG_ALL = 30;        //输出所有调试信息
        public const string VERSION = "Fily-2013-1-14";
        private static int debug = DEBUG_INFO;
        #endregion

        #region modulePath的set, get方法
        public static void setModulePath(string path)
        {
            modulePath = path;
        }
        public static string getModulePath()
        {
            return modulePath;
        }
        #endregion

        #region reSplit的set, get方法
        public static void setReSplit(string _reSplit)
        {
            reSplit = _reSplit;
        }
        public static string getReSplit()
        {
            return reSplit;
        }
        #endregion

        #region 设置是否以调试的方式运行项目
        public static void setDebug(int _debug) {
            debug = _debug;
        }
        #endregion

        #region 获取是否以调试的方式运行项目
        public static int getDebug()
        {
            return debug;
        }
        #endregion

        #region isNullEmpty: 判断字符串是否是空或者null
        public static bool isNullEmpty(string str)
        {
            bool flag = false;
            if (str == null || str == String.Empty)
            {
                flag = true;
            }
            return flag;
        }
        #endregion

        #region isNull: 判断字符串是否是null
        public static bool isNull(string str)
        {
            bool flag = false;
            if (str == null)
            {
                flag = true;
            }
            return flag;
        }
        #endregion

        #region isEmpty: 判断字符串是否是空
        public static bool isEmpty(string str)
        {
            bool flag = false;
            if (str == String.Empty&&str.Length==0)
            {
                flag = true;
            }
            return flag;
        }
        #endregion

        #region getTime: 获取服务器的时间
        public static string getTime()
        {
            DateTime dateTime = DateTime.Now;
            return dateTime.ToString(@"yyyyMMddHHmmss");
        }
        #endregion

        #region writeJS: 通过Page元素向客户端写js内容
        public static void writeJS(string jsContent)
        {
            //HttpContext.Current.Page.RegisterStartupScript("writejs", "<script type='text/javascript'>" + jsContent + "</script>");
        }
        #endregion

        #region timeOut: 超时设置 时间单位是秒 比如 30000
        public static void timeOut(int time)
        {
            System.Threading.Thread.Sleep(time);
        }
        #endregion

        #region getNow: 获取服务器当前时间
        public static string getNow() { 
            return DateTime.Now.ToString(); 
        }
        #endregion

        #region write: 统一输出
        public static void write(string str)
        {
            HttpContext.Current.Response.Write(str);
        }
        public static void write(string str, params object [] args)
        {
            write(MString.format(str, args));
        }
        #endregion

        #region log: 统一输出
        public static void log(string str)
        {
            HttpContext.Current.Response.Write(str);
        }
        #endregion

        #region getErrorMsg: 统一输出出错信息
        public static string getErrorMsg(string errorMsg)
        {
            return ERR_STR + errorMsg;
        }
        #endregion

        #region getErrorMsg: 多参数 统一输出出错信息
        public static string getErrorMsg(string errorMsg, params object [] args)
        {
            return ERR_STR + MString.format(errorMsg, args);
        }
        #endregion

        #region writeToPage: 把内容是str的输出到客户端页面, 如果已经执行过则会直接返回
        public static void writeToPage(string str)
        {
            //if (ifWriteToPage) { return; }
            str = HttpUtility.HtmlDecode(str);
            int _err_len = ERR_STR.Length;
            if (str.Length < _err_len || str.Substring(0, _err_len) != ERR_STR)
            {
                str = "errorInfo=0" + getReSplit() + str;
            }
            ifWriteToPage = true;
            try
            {
                string callbackFun = HttpContext.Current.Request["callback"].ToString();
                HttpContext.Current.Response.ContentType = "text/javascript;charset=utf-8";
                HttpContext.Current.Response.Write(callbackFun + "('" + str + "');");
            }
            catch (Exception)
            {
                HttpContext.Current.Response.Write(str);
            }
        }
        #endregion

        #region writeToPage: 把内容是str的输出到客户端页面, 如果已经执行过则会直接返回
        public static void writeToJSON(string str)
        {
            str = HttpUtility.HtmlDecode(str);
            string _data = str, _code = "0", _version = "V1.0.1", _msg = "";
            int _index = str.IndexOf(ERR_STR);
            if (_index > -1)
            {
                _code = "1";
                _msg = str.Replace(ERR_STR, "");
                _data = "";
            }
            if (_data.IndexOf("{") != 0 && _data.IndexOf("[") != 0){
                _data = "\""+_data+"\"";
            }
            HttpContext.Current.Response.ContentType = "application/json;charset=utf-8";
            HttpContext.Current.Response.Write("{ \"data\": " + _data + ", \"msg\":\""+_msg+"\", \"code\": " + _code + ", \"version\": \"" + _version + "\" }");
        }
        #endregion

        #region writeToPage: 把内容是字符串数组(Array)数据输出到客户端页面, 如果已经执行过则会直接返回
        public static void writeToPage(string [] results)  //直接输出结果集
        {
            if (ifWriteToPage) { return; }
            string _reSplit = getReSplit();
            int _err_len = ERR_STR.Length, _reLen = _reSplit.Length;
            StringBuilder _sb = new StringBuilder();
            _sb.Append("errorInfo=0" + _reSplit);
            for (int i = 0; i < results.GetLength(0); i++ )
            {
                string _str = results[i];
                int _sLen = _str.Length;
                if (_sLen < _err_len) { _sb.Append(_str + _reSplit); continue; }
                string _tepStr = _str.Substring(0, _err_len);
                if (_tepStr == ERR_STR) { _str = _str.Substring(_err_len); }
                _sb.Append(_str + _reSplit);
            }
            _sb.Remove(_sb.Length-_reLen, _reLen);
            ifWriteToPage = true;
            HttpContext.Current.Response.Write(_sb.ToString());
        }
        #endregion

        #region routing: 根据参数进行服务器端跳转(也就是所谓的"路由")
        public static void routing()
        {
            string _module = HttpContext.Current.Request["c"], _path = String.Empty;
            if (isNullEmpty(_module)) { _module = HttpContext.Current.Request["m"]; }
            if (isNullEmpty(_module)) { _module = HttpContext.Current.Request["controller"]; }
            if (isNullEmpty(_module)) { _module = HttpContext.Current.Request["module"]; }
            if (isNullEmpty(_module)) { write(getErrorMsg("缺少\"module\"参数")); return; }
            try
            {
                string _m_path = ConfigurationManager.AppSettings["module_path"].ToString();
                if (isEmpty(_m_path)) { _m_path = getModulePath(); }
                _path = _m_path + _module + ".aspx";
                if (getDebug() == DEBUG_ALL)
                {
                    HttpContext.Current.Response.Redirect(_path);
                }
                else {
                    HttpContext.Current.Server.Transfer(_path, true);
                }
            }
            catch (HttpException e) {
                write(getErrorMsg(e.Message));
            }
        }
        #endregion

        #region getAction: 获取URL中接口名
        public static string getAction()
        {
            ifWriteToPage = false;
            string _action = HttpContext.Current.Request["action"];
            if (isNullEmpty(_action)) { _action = HttpContext.Current.Request["api"]; }
            if (isNullEmpty(_action)) { writeToPage(getErrorMsg("缺少接口名参数(action or api)")); }
            try { MSession.setClientKey(HttpContext.Current.Request["clientkey"].ToString()); } catch (Exception) { };
            return _action;
        }
        #endregion

        #region getAction: 通过传递的参数获取URL中接口名
        public static string getAction(string args)
        {
            ifWriteToPage = false;
            string _action = String.Empty;
            try
            {
                _action = HttpContext.Current.Request[args].ToString();
                MSession.setClientKey(HttpContext.Current.Request["clientkey"].ToString());
                if (isNullEmpty(_action))
                {
                    writeToPage(getErrorMsg("缺少接口名参数(action or api)"));
                }
            }
            catch (Exception) {
                writeToPage(getErrorMsg("缺少接口名参数(action or api)"));
            }
            return _action;
        }
        #endregion

        #region checkArgs: 检查Request参数, 如果有不满足的则直接返回false, 否则返回true
        public static Json checkArgs(string[,] args)
        {
            HttpRequest _req = HttpContext.Current.Request;
            Json hash = new Json();
            for (int i = 0; i < args.GetLength(0); i++)
            {
                int _len_1 = args.GetLength(1);
                string _key = args[i, 0], _defVal = args[i, 1], _realVal;
                try {
                    _realVal = _req[_key].ToString();
                }catch(Exception e) {
                    if (isNull(_defVal))
                    {
                        hash[CHECK_ERR] = Native.getErrorMsg("字段\"" + _key + "\"是必填参数(Requied), "+e.Message);
                        hash[CHECK_RESULT] = false;
                        return hash;
                    }
                    else {
                        _realVal = _defVal;
                    }
                }
                if (_len_1 == 3 && args[i, 2] == "1") { _realVal = Filter.filterNormalStr(_realVal); }
                hash[_key] = HttpUtility.HtmlDecode(_realVal); ;
            }
            hash[CHECK_RESULT] = true;
            return hash;
        }
        #endregion

        #region checkArgs: 检查Request参数, 如果有不满足的则直接返回false, 否则返回true
        public static Json checkArgs(string[,] args, bool ifWriteErrorToPage)
        {
            Json _json = checkArgs(args);
            if (ifWriteErrorToPage && _json.Contains(CHECK_ERR)) { Native.writeToPage(_json.getString(CHECK_ERR)); ifWriteErrorToPage = true; }
            return _json;
        }
        #endregion

        #region initArgs: 初始化参数
        /// <summary>
        /// initArgs: 初始化参数
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        public static Json initArgs(string[,] args)
        {
            HttpRequest _req = HttpContext.Current.Request;
            Json hash = new Json();
            for (int i = 0; i < args.GetLength(0); i++)
            {
                int _len_1 = args.GetLength(1);
                string _key = args[i, 0], _defVal = args[i, 1];
                string _realVal = _req[_key];
                if (isNullEmpty(_realVal)) { _realVal = _defVal; }
                if (_len_1 == 3 && args[i, 2] == "1") { _realVal = Filter.filterNormalStr(_realVal); }
                hash[_key] = _realVal;
            }
            return hash;
        }
        #endregion

        #region checkJsonStr: 检查Json字符串的key值是否匹配第二个数组参数中的每个元素, 如果匹配成功则返回JSON字符串转成的hashjson对象, 否则返回的HashJson中的RESULT = false;
        /// <summary>
        /// checkJsonStr: 检查Json字符串的key值是否匹配第二个数组参数中的每个元素, 如果匹配成功则返回JSON字符串转成的hashjson对象, 否则返回的HashJson中的RESULT = false;
        /// </summary>
        /// <param name="jsonStr">json格式字符串</param>
        /// <param name="jsonStr">要匹配的字符串数组</param>
        /// <returns>HashJson</returns>
        public static Json checkJsonStr(string jsonStr, string[] reqAry)
        {
            Json _hash = new Json(jsonStr);
            string _re = "True";
            for (int i = 0; i < reqAry.Length; i++) {
                string _key = reqAry[i];
                if (!_hash.ContainsKey(_key)) { _re = "False"; _hash.Add(CHECK_ERR, "json字符串中缺少键值(key)-"+_key); break; }
            }
            _hash.Add(CHECK_RESULT, _re);
            return _hash;
        }
        #endregion

        #region onRequestBefore: 执行请求之前的回调函数
        public static bool onRequestBefore(bool ifCheck)
        {
            if (ifCheck) {
                if (!MSession.exist("username")) { Native.writeToPage(Native.getErrorMsg("您还未登陆, 请登陆再试!")); return false; }
            }
            return true;
        }
        #endregion

        #region onRequestAfter: 执行请求之后的回调函数
        public static bool onRequestAfter()
        {
            return true;
        }
        #endregion
    }
    #endregion
}