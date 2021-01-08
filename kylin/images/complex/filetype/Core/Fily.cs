using System;
using System.Collections.Generic;
using System.Web;
using System.Configuration;
using Fily.Base;

namespace Fily.Core
{
    public static class Fily
    {
        #region success:
        public static void success(string data)
        {
            write(data, 200);
        }
        #endregion

        #region error:
        public static void error(string message, int code)
        {
            write(message, code);
        }
        #endregion

        #region write:
        public static void write(string content, int statusCode)
        {
            HttpContext.Current.Response.StatusCode = statusCode;
            //HttpContext.Current.Response.Write("{\"\":""}");
        }
        #endregion

        #region routing: 根据参数进行服务器端跳转(也就是所谓的"路由")
        public static void routing()
        {
            string _module = HttpContext.Current.Request["c"],
                _path = String.Empty;
            if (Native.isNullEmpty(_module)) { _module = HttpContext.Current.Request["m"]; }
            if (Native.isNullEmpty(_module)) { _module = HttpContext.Current.Request["controller"]; }
            if (Native.isNullEmpty(_module)) { _module = HttpContext.Current.Request["module"]; }
            if (Native.isNullEmpty(_module))
            {
                Native.write(Native.getErrorMsg("缺少\"module\"参数"));
                return;
            }
            try
            {
                string _m_path = ConfigurationManager.AppSettings["module_path"].ToString();
                if (Native.isEmpty(_m_path)) { _m_path = Native.getModulePath(); }
                _path = _m_path + _module + ".aspx";
                if (Native.getDebug() == Native.DEBUG_ALL)
                {
                    HttpContext.Current.Response.Redirect(_path);
                }
                else
                {
                    HttpContext.Current.Server.Transfer(_path, true);
                }
            }
            catch (HttpException e)
            {
                Native.write(Native.getErrorMsg(e.Message));
            }
        }
        #endregion


        #region onRequestBefore: 执行请求之前的回调函数
        public static bool onRequestBefore(bool ifCheck)
        {
            if (ifCheck)
            {
                //
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
}