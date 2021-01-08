using System;
using System.Collections.Generic;
using System.Web;
using Fily.Base;

namespace Fily.Util
{
    public static class MSession
    {
        private static System.Web.SessionState.HttpSessionState session = HttpContext.Current.Session;
        public static bool exist(string _key) {
            string _val = session[_key].ToString();
            if (Native.isEmpty(_val)) { return false; } else { return true; }
        }
        public static void set(string _key, object _value) { session[_key] = _value; }
        public static string get(string _key) {
            string _val = String.Empty;
            try { _val = session[_key].ToString(); }catch(Exception){ _val = "";  }
            return _val;
        }
        public static string getClientKey() { string _id = get("FilyClientKey"); if (Native.isEmpty(_id)) { _id = "0"; } return _id; }
        public static void setClientKey(string key) { set("FilyClientKey", key); }
        public static void logout()
        {
            HttpContext.Current.Session.Remove(getClientKey());
            HttpContext.Current.Session.Clear();
            HttpContext.Current.Session.Abandon();
        }
    }
}