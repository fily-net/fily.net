using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Text;
using System.Web.Security;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Collections;
using Fily.IO;
using Fily.Util;
using Fily.JSON;
using Fily.Data;

namespace Fily.Base
{
    public static class MString
    {
        //private static Logger logger = Logger.getLogger(DBUtil.getDBHelper());

        #region format: 实现js中的format方法
        public static string format(string _str, params object [] _args) {
            int i, _len = _args.Length;
            for (i = 0; i < _len; i++)
            {
                _str = _str.Replace("{" + i + "}", _args[i].ToString());
            }
            return _str;
        }
        #endregion

        #region format: 实现js中的format方法
        public static string format(string _str, Json json)
        {
            foreach (DictionaryEntry de in json)
            {
                _str = _str.Replace("{" + de.Key.ToString() + "}", de.Value.ToString());
            }
            return _str;
        }
        #endregion

        #region getInsertStr: 得到sql insert字符串
        /// <summary>
        /// getInsertStr: 得到sql insert字符串
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_key">字段列表, 字段之间通过逗号分隔开</param>
        /// <param name="_val">值列表, 每个字段值之间通过逗号分隔开</param>
        /// <returns>返回sql insert语句</returns>
        public static string getInsertStr(string _table, string _key, string _val)
        {
            string _cPerson = MSession.get(MSession.getClientKey());
            if (Native.isNullEmpty(_cPerson)) {
                _cPerson = "0";
            }
            string _sql = "insert into {0} ({1},cPerson) values ({2}," + _cPerson + ");", _return = format(_sql, _table, _key, _val);
            //logger.log(_return).logToNet("Insert", _table, _return);
            return _return;
        }
        #endregion

        #region getInsertStr: 得到sql insert字符串
        /// <summary>
        /// getInsertStr: 得到sql insert字符串
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_key">字段列表, 字段之间通过逗号分隔开</param>
        /// <param name="_val">值列表, 每个字段值之间通过逗号分隔开</param>
        /// <param name="ifGetID">是否要返回插入数据之后的ID值</param>
        /// <returns>返回sql insert语句</returns>
        public static string getInsertStr(string _table, string _key, string _val, bool ifGetID)
        {
            string _sql = getInsertStr(_table, _key, _val);
            if (ifGetID) { _sql += "select SCOPE_IDENTITY();";}
            return _sql;
        }
        #endregion

        #region getRightsSelectStr: 得到有权限的查询字符串
        /// <summary>
        /// getSelectStr: 得到有权限的查询字符串, 默认是按照id升序
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_key">字段列表, 字段之间通过逗号分隔开</param>
        /// <param name="_condition">查询条件</param>
        /// <returns>查询字符串</returns>
        public static string getRightsSelectStr(string _table, string _key, string _condition)
        {
            return getRightsSelectStr(_table, _key, _condition, "cTime", "asc");
        }
        #endregion

        #region getRightsSelectStr: 得到有权限的查询字符串
        /// <summary>
        /// getSelectStr: 得到有权限的查询字符串
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_key">字段列表, 字段之间通过逗号分隔开</param>
        /// <param name="_condition">查询条件/param>
        /// <param name="_orderColumn">排序字段名</param>
        /// <param name="_order">排序方式</param>
        /// <returns>查询字符串</returns>
        public static string getRightsSelectStr(string _table, string _key, string _condition, string _orderColumn, string _order)
        {
            string _sql = "select {0} from {1} as self where dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', users,roles,cPerson)<>0 and delFlag<>1 and {2}";
            if (!Native.isEmpty(_orderColumn) && !Native.isEmpty(_order) && _key.ToLower().IndexOf("count(") == -1) { _sql += " order by {3} {4}"; }
            _sql += ';';
            return format(_sql, _key, _table, _condition, _orderColumn, _order);
        }
        #endregion

        #region getManagerRightsSelectStr: 得到有权限的查询字符串
        /// <summary>
        /// getSelectStr: 得到有权限的查询字符串, 默认是按照id升序
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_key">字段列表, 字段之间通过逗号分隔开</param>
        /// <param name="_condition">查询条件</param>
        /// <returns>查询字符串</returns>
        public static string getManagerRightsSelectStr(string _table, string _key, string _condition)
        {
            return getManagerRightsSelectStr(_table, _key, _condition, "cTime", "asc");
        }
        #endregion

        #region getManagerRightsSelectStr: 得到有权限的查询字符串
        /// <summary>
        /// getSelectStr: 得到有权限的查询字符串
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_key">字段列表, 字段之间通过逗号分隔开</param>
        /// <param name="_condition">查询条件/param>
        /// <param name="_orderColumn">排序字段名</param>
        /// <param name="_order">排序方式</param>
        /// <returns>查询字符串</returns>
        public static string getManagerRightsSelectStr(string _table, string _key, string _condition, string _orderColumn, string _order)
        {
            string _sql = "select {0} from {1} as self where (ifRights=0 or (ifRights=1 and dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', users,roles,cPerson)<>0)) and delFlag<>1 and {2}";
            if (!Native.isEmpty(_orderColumn) && !Native.isEmpty(_order) && _key.ToLower().IndexOf("count(") == -1) { _sql += " order by {3} {4}"; }
            _sql += ';';
            return format(_sql, _key, _table, _condition, _orderColumn, _order);
        }
        #endregion

        #region getSelectStr: 得到查询字符串
        /// <summary>
        /// getSelectStr: 得到查询字符串, 默认是按照id升序
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_key">字段列表, 字段之间通过逗号分隔开</param>
        /// <param name="_condition">查询条件</param>
        /// <returns>查询字符串</returns>
        public static string getSelectStr(string _table, string _key, string _condition)
        {
            return getSelectStr(_table, _key, _condition, "id", "asc");
        }
        #endregion

        #region getSelectStr: 得到查询字符串
        /// <summary>
        /// getSelectStr: 得到查询字符串, 默认是按照id
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_key">字段列表, 字段之间通过逗号分隔开</param>
        /// <param name="_id">查询ID</param>
        /// <returns>查询字符串</returns>
        public static string getSelectStr(string _table, string _key, int _id)
        {
            return getSelectStr(_table, _key, "id="+_id, "cTime", "asc");
        }
        #endregion

        #region getSelectStr: 得到查询字符串
        /// <summary>
        /// getSelectStr: 得到查询字符串
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_key">字段列表, 字段之间通过逗号分隔开</param>
        /// <param name="_condition">查询条件/param>
        /// <param name="_orderColumn">排序字段名</param>
        /// <param name="_order">排序方式</param>
        /// <returns>查询字符串</returns>
        public static string getSelectStr(string _table, string _key, string _condition, string _orderColumn, string _order)
        {
            string _sql = "select {0} from {1} as self where delFlag<>1 and {2}";
            if (!Native.isEmpty(_orderColumn) && !Native.isEmpty(_order) && _key.ToLower().IndexOf("count(") == -1) { _sql += " order by {3} {4}"; }
            _sql += ';';
            return format(_sql, _key, _table, _condition, _orderColumn, _order);
        }
        #endregion

        #region getSelectStr: 得到查询字符串
        /// <summary>
        /// getSelectStr: 得到查询字符串
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_key">字段列表, 字段之间通过逗号分隔开</param>
        /// <param name="_condition">查询条件/param>
        /// <param name="_orderColumn">排序字段名</param>
        /// <param name="_order">排序方式</param>
        /// <returns>查询字符串</returns>
        public static string getSelectStr(string _table, string _key, string _condition, string _orderColumn, int _order)
        {
            string _orderStr = "desc";
            if (_order == 1) { _orderStr = "asc"; }
            return getSelectStr(_table, _key, _condition, _orderColumn, _orderStr);
        }
        #endregion

        #region getDeleteStr: 得到删除字符串
        /// <summary>
        /// getDeleteStr: 得到删除字符串
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_condition">删除条件 如: id=1</param>
        /// <returns>删除字符串</returns>
        public static string getDeleteStr(string _table, string _condition)
        {
            string _sql = "update {0} set delFlag=1,mTime=getdate() where {1};", _return = format(_sql, _table, _condition);
            //logger.log(_return).logToNet("FalseDelete", _table, _return);
            return _return;
        }
        #endregion

        #region getRestoreStr: 得到恢复、复原字符串
        /// <summary>
        /// getRestoreStr: 得到恢复、复原字符串
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_condition">删除条件 如: id=1</param>
        /// <returns>删除字符串</returns>
        public static string getRestoreStr(string _table, string _condition)
        {
            string _sql = "update {0} set delFlag=0,mTime=getdate() where {1};", _return = format(_sql, _table, _condition);
            //logger.log(_return).logToNet("Restore", _table, _return);
            return _return;
        }
        #endregion

        #region getRealDeleteStr: 得到真正删除字符串
        /// <summary>
        /// getRealDeleteStr: 得到真正删除字符串
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_condition">删除条件 如: id=1</param>
        /// <returns>删除字符串</returns>
        public static string getRealDeleteStr(string _table, string _condition)
        {
            string _sql = "delete {0} where {1};", _return = format(_sql, _table, _condition);
            //logger.log(_return).logToNet("TrueDelete", _table, _return);
            return _return;
        }
        #endregion

        #region getUpdateStr: 得到update字符串
        /// <summary>
        /// getUpdateStr: 得到update字符串
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_update">更新字符串</param>
        /// <param name="_condition">更行条件</param>
        /// <returns>update字符串</returns>
        public static string getUpdateStr(string _table, string _update, string _condition)
        {
            string _mPerson = MSession.get(MSession.getClientKey());
            if (Native.isNullEmpty(_mPerson))
            {
                _mPerson = "0";
            }
            string _sql = "update {0} set mPerson=" + _mPerson + ", mTime=getdate(),{1} where {2};", _return = format(_sql, _table, _update, _condition);
            //logger.log(_return).logToNet("Update", _table, _return);
            return _return;
        }
        #endregion

        #region getUpdateStr: 得到update字符串
        /// <summary>
        /// getUpdateStr: 得到update字符串
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_update">更新字符串</param>
        /// <param name="_id">记录ID值</param>
        /// <returns>update字符串</returns>
        public static string getUpdateStr(string _table, string _update, int _id)
        {
            return getUpdateStr(_table, _update, "id="+_id);
        }
        #endregion

        #region escape: escape字符串
        /// <summary>
        /// escape: escape字符串
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string escape(string s)
        {
            StringBuilder sb = new StringBuilder();
            byte[] byteArr = System.Text.Encoding.Unicode.GetBytes(s);
            for (int i = 0; i < byteArr.Length; i += 2)
            {
                sb.Append("%u");
                sb.Append(byteArr[i + 1].ToString("X2"));//把字节转换为十六进制的字符串表现形式
                sb.Append(byteArr[i].ToString("X2"));
            }
            return sb.ToString();

        }
        #endregion

        #region 把JavaScript的escape()转换过去的字符串解释回来, 方法支持汉字
        /// <summary>
        /// //把JavaScript的escape()转换过去的字符串解释回来, 方法支持汉字
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string unescape(string s)
        {
            string str = s.Remove(0, 2);//删除最前面两个＂%u＂
            string[] strArr = str.Split(new string[] { "%u" }, StringSplitOptions.None);//以子字符串＂%u＂分隔
            byte[] byteArr = new byte[strArr.Length * 2];
            for (int i = 0, j = 0; i < strArr.Length; i++, j += 2)
            {
                byteArr[j + 1] = Convert.ToByte(strArr[i].Substring(0, 2), 16); //把十六进制形式的字串符串转换为二进制字节
                byteArr[j] = Convert.ToByte(strArr[i].Substring(2, 2), 16);
            }
            str = System.Text.Encoding.Unicode.GetString(byteArr);　//把字节转为unicode编码
            return str;

        }
        #endregion
    }
}
