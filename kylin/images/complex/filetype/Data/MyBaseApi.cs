using System;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using Fily.Base;
using Fily.JSON;
using Fily.Util;
using Fily.IO;

namespace Fily.Data
{
    /// <summary>
    /// BaseApi 是系统提供的基本API接口
    /// </summary>
    public class MyBaseApi
    {
        #region 私有变量的定义
        private MySqlDBHelper helper;  //DataBaseHelper, 改类主要封装了一些对数据库的基本操作和数据格式转换的方法
        private HttpRequest req = HttpContext.Current.Request;
        private const string DB_TEMPLATE = "MTemplate";
        private const string DB_PATH = "E:\\Code\\DB\\ForSqlServer"; 
        private string cSplit;  //cellSplit, 列分隔符
        private string rSplit;  //rowSplit, 行分隔符
        private string reSplit; //resultSplit, 结果集分隔符
        private string dataType;//dataType, 数据类型, 可以使json, array, html 三种格式 默认是html
        #endregion

        #region MyBaseApi(DBHelper dbh)
        /// <summary>
        /// BaseApi(DBHelper dbh): 只有DBHelper一个参数的构造函数
        /// </summary>
        /// <param name="dbh">DBHelper对象</param>
        public MyBaseApi(MySqlDBHelper dbh) { initClass(dbh, req["rSplit"], req["cSplit"], req["resultSplit"], req["dataType"]); }
        #endregion

        #region MyBaseApi(MySqlDBHelper dbh, string rS, string cS)
        /// <summary>
        /// BaseApi(DBHelper dbh, string rS, string cS, string reS): 有四个参数的构造函数
        /// </summary>
        /// <param name="dbh">DBHelper对象</param>
        /// <param name="rS">行分隔符</param>
        /// <param name="cS">列分隔符</param>
        public MyBaseApi(MySqlDBHelper dbh, string rS, string cS) { initClass(dbh, rS, cS, req["resultSplit"], req["dataType"]); }
        #endregion

        #region MyBaseApi(MySqlDBHelper dbh, string rS, string cS, string reS)
        /// <summary>
        /// BaseApi(DBHelper dbh, string rS, string cS, string reS): 有四个参数的构造函数
        /// </summary>
        /// <param name="dbh">DBHelper对象</param>
        /// <param name="rS">行分隔符</param>
        /// <param name="cS">列分隔符</param>
        /// <param name="reS">结果集分隔符</param>
        public MyBaseApi(MySqlDBHelper dbh, string rS, string cS, string reS) { initClass(dbh, rS, cS, reS, req["dataType"]); }
        #endregion

        #region MyBaseApi(MySqlDBHelper dbh, string rS, string cS, string reS, string dtS)
        /// <summary>
        /// BaseApi(DBHelper dbh, string rS, string cS, string reS, string dtS): 有五个参数的构造函数
        /// </summary>
        /// <param name="dbh">DBHelper对象</param>
        /// <param name="rS">行分隔符</param>
        /// <param name="cS">列分隔符</param>
        /// <param name="reS">结果集分隔符</param>
        /// <param name="dtS">数据类型, 可以使json, array, html 三种格式 默认是html</param>
        public MyBaseApi(MySqlDBHelper dbh, string rS, string cS, string reS, string dtS) { initClass(dbh, rS, cS, reS, dtS); }
        #endregion

        #region initClass(MySqlDBHelper dbh, string rS, string cS, string reS, string dtS)
        /// <summary>
        /// BaseApi(DBHelper dbh, string rS, string cS, string reS, string dtS): 有五个参数的构造函数
        /// </summary>
        /// <param name="dbh">DBHelper对象</param>
        /// <param name="rS">行分隔符</param>
        /// <param name="cS">列分隔符</param>
        /// <param name="reS">结果集分隔符</param>
        /// <param name="dtS">数据类型, 可以使json, array, html 三种格式 默认是html</param>
        private void initClass(MySqlDBHelper dbh, string rS, string cS, string reS, string dtS)
        {
            if (Native.isNullEmpty(rS)) { rS = "\u0002"; }
            if (Native.isNullEmpty(cS)) { cS = "\u0001"; }
            if (Native.isNullEmpty(reS)) { reS = "\u0003"; }
            if (Native.isNullEmpty(dtS)) { dtS = "html"; }
            setDBHelper(dbh);
            setRSplit(rS);
            setCSplit(cS);
            setReSplit(reS);
            setDataType(dtS);
            MConvert.setKeySplit(',');
        }
        #endregion

        #region 私有变量的set, get方法的定义
        public MySqlDBHelper getDBHelper() { return helper; }
        public void setDBHelper(MySqlDBHelper dbh) { helper = dbh; }
        public string getCSplit() { return cSplit; }
        public void setCSplit(string cS) { cSplit = cS; }
        public string getRSplit() { return rSplit; }
        public void setRSplit(string rS) { rSplit = rS; }
        public string getReSplit() { return reSplit; }
        public void setReSplit(string reS) { reSplit = reS; Native.setReSplit(reS); }
        public string getDataType() { return dataType; }
        public void setDataType(string dt) { dataType = dt; }
        #endregion

        #region execQuery: 只有sql一个参数的方法
        /// <summary>
        /// 直接调用helper的方法执行sql语句
        /// </summary>
        /// <param name="sql">sql语句, 存储过程</param>
        /// <returns></returns>
        public string execQuery(string sql) {
            return helper.getQueryResultByType(sql, dataType, reSplit, rSplit, cSplit);
        }
        public string execQuery(string sql, params object [] args)
        {
            return execQuery(MySqlString.format(sql, args));
        }
        public string execQuery(string sql, Json json)
        {
            return execQuery(MySqlString.format(sql, json));
        }
        #endregion

        #region execQueryExt: sql, dataType 两个参数的方法
        /// <summary>
        /// 直接调用helper的方法执行sql语句
        /// </summary>
        /// <param name="sql">sql语句, 存储过程</param>
        /// <param name="dt">dataType 字符串数据类型, 可以使json, html, array, ary</param>
        /// <returns></returns>
        public string execQueryExt(string sql, string dt)
        {
            return helper.getQueryResultByType(sql, dt, reSplit, rSplit, cSplit);
        }
        #endregion

        #region execQueryExt: sql, dataType, reSplit 三个参数的方法
        /// <summary>
        /// execQuery: sql, dataType, reSplit 三个参数的方法
        /// </summary>
        /// <param name="sql">sql语句, 存储过程</param>
        /// <param name="dt">dataType 字符串数据类型, 可以使json, html, array, ary, 默认是html</param>
        /// /// <param name="reS">结果集分隔符,  默认是@&@</param>
        /// <returns></returns>
        public string execQueryExt(string sql, string dt, string reS)
        {
            return helper.getQueryResultByType(sql, dt, reS, rSplit, cSplit);
        }
        #endregion

        #region execTrans: 只有sql一个参数的方法
        /// <summary>
        /// 直接调用helper的方法执行sql语句
        /// </summary>
        /// <param name="sql">sql语句, 存储过程</param>
        /// <returns></returns>
        public string execTrans(string sql)
        {
            return helper.execTrans(sql, dataType, reSplit, rSplit, cSplit);
        }
        public string execTrans(string sql, params object [] args)
        {
            return execTrans(MySqlString.format(sql, args));
        }
        #endregion

        #region execScalar: 返回第一行第一列的数据
        /// <summary>
        /// 返回第一行第一列的数据
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public string execScalar(string sql)
        {
            return helper.execScalar(sql);
        }
        public string execScalar(string sql, params object[] args)
        {
            return execScalar(MySqlString.format(sql, args));
        }
        #endregion

        #region execTrans: sql, dataType 两个参数的方法
        /// <summary>
        /// 直接调用helper的方法执行sql语句
        /// </summary>
        /// <param name="sql">sql语句, 存储过程</param>
        /// <param name="dt">dataType 字符串数据类型, 可以使json, html, array, ary</param>
        /// <returns></returns>
        public string execTrans(string sql, string dt)
        {
            return helper.execTrans(sql, dt, reSplit, rSplit, cSplit);
        }
        #endregion

        #region execTrans: sql, dataType, reSplit 三个参数的方法
        /// <summary>
        /// execQuery: sql, dataType, reSplit 三个参数的方法
        /// </summary>
        /// <param name="sql">sql语句, 存储过程</param>
        /// <param name="dt">dataType 字符串数据类型, 可以使json, html, array, ary, 默认是html</param>
        /// /// <param name="reS">结果集分隔符,  默认是@&@</param>
        /// <returns></returns>
        public string execTrans(string sql, string dt, string reS)
        {
            return helper.execTrans(sql, dt, reS, rSplit, cSplit);
        }
        #endregion

        /**
         * 对数据库的基本通用操作函数有一下方法:
         * getAllTable: 得到连接数据库的所有表
         * getTableFields: 得到连接数据库的所有表
         * getAllProcs: 得到数据库的所有存储过程
         * tableExist: 判断数据库是否存在表名是tableName的表
         * execSql: 通用执行sql语句的存储过程
         * getTableInfo: 获取某张表的字段信息
         * select: 查询
         * insert: 插入
         * delete: 删除
         * update: 修改
         **/



        #region execSqlByProc: 通过调用存储过程的方式来执行sql语句
        /// <summary>
        /// execSqlByProc: 通过调用存储过程的方式来执行sql语句
        /// </summary>
        /// <param name="sql">要执行的sql语句, 存储过程</param>
        /// <returns>查询结果</returns>
        public string execSqlByProc(string sql)
        {
            return execQuery("exec (" + sql + ");");
        }
        public string execSqlByProc(string sql, params object [] args)
        {
            return execSqlByProc(MySqlString.format(sql, args));
        }
        public string execSqlByProc(string sql, Json json)
        {
            return execSqlByProc(MySqlString.format(sql, json));
        }
        #endregion

        /*单表的增删改查操作   --begin*/
        #region select: 根据表名(table), 查询字段(fields), 查询条件(whereCondiction), 排序字段(orderByColumn), 排序顺序(order)查询结果
        /// <summary>
        /// select: 根据表名(table), 查询字段(fields), 查询条件(whereCondiction)查询结果
        /// </summary>
        /// <param name="table">表名</param>
        /// <param name="fields">查询字段</param>
        /// <param name="whereCondiction">查询条件</param>
        /// <param name="orderByColumn">要排序的字段</param>
        /// <param name="order">排序方式: asc desc</param>
        /// <returns>查询结果</returns>
        public string select(string table, string fields, string whereCondiction, string orderByColumn, string order)
        {
            return execQuery(MySqlString.getSelectStr(table, fields, whereCondiction, orderByColumn, order));
        }
        /// <summary>
        /// select: 根据表名(table), 查询字段(fields), 查询条件(whereCondiction)查询结果
        /// </summary>
        /// <param name="table">表名</param>
        /// <param name="fields">查询字段</param>
        /// <param name="whereCondiction">查询条件</param>
        /// <returns>查询结果</returns>
        public string select(string table, string fields, string whereCondiction)
        {
            return select(table, fields, whereCondiction, "createTime", "asc");
        }
        #endregion 

        

        #region insert: 根据表名(table), 字段(fields), 字段值(value)向数据库插入数据
        /// <summary>
        /// insert: 根据表名(table), HashJson对象向数据库插入数据
        /// </summary>
        /// <param name="table"></param>
        /// <param name="json"></param>
        /// <returns></returns>
        public string insert(string table, Json json)
        {
            //string sql = "exec tableInsert '"+table+"','"+fields+"','"+values+"';";
            return "";
        }
        #endregion 

        #region insert: 根据表名(table), json字符串(jsonStr)向数据库插入数据
        /// <summary>
        /// insert: 根据表名(table), json字符串(jsonStr)向数据库插入数据
        /// </summary>
        /// <param name="table">根据表名(table)</param>
        /// <param name="jsonStr">json字符串</param>
        /// <returns></returns>
        public string insert(string table, string jsonStr)
        {
            string[] _kv = MConvert.toKV(jsonStr);
            return insert(table, _kv[0], _kv[1]);
        }
        #endregion 

        #region insert: 根据表名(table), 字段(fields), 字段值(value)向数据库插入数据
        /// <summary>
        /// insert: 根据表名(table), 字段(fields), 字段值(value)向数据库插入数据
        /// </summary>
        /// <param name="table">表名(table)</param>
        /// <param name="fields">字段(fields)</param>
        /// <param name="values">字段值(value)</param>
        /// <returns></returns>
        public string insert(string table, string fields, string values)
        {
            return execQuery(MySqlString.getInsertStr(table, fields, values, true));
        }
        #endregion 

        #region delete: 根据表名(table), 删除条件(whereCondition)删除数据
        /// <summary>
        /// delete: 根据表名(table), 删除条件(whereCondition)删除数据
        /// </summary>
        /// <param name="table">表名(table)</param>
        /// <param name="whereCondiction">删除条件(whereCondition)</param>
        /// <returns></returns>
        public string delete(string table, string whereCondiction)
        {
            return execQuery(MySqlString.getDeleteStr(table, whereCondiction));
        }
        /// <summary>
        /// delete: 根据表名(table), ID(id)删除数据
        /// </summary>
        /// <param name="table">表名(table)</param>
        /// <param name="id">id值</param>
        /// <returns></returns>
        public string deleteById(string table, int id)
        {
            return execQuery(MySqlString.getDeleteStr(table, "id="+id));
        }
        /// <summary>
        /// deleteByIds: 根据表名(table), ID(id)删除数据
        /// </summary>
        /// <param name="table">表名(table)</param>
        /// <param name="id">id值</param>
        /// <returns></returns>
        public string deleteByIds(string table, string ids)
        {
            return execQuery(MySqlString.getDeleteStr(table, "id in (" + ids + ")"));
        }
        #endregion

        #region reStore: 根据表名(table), 删除条件(whereCondition)删除数据
        /// <summary>
        /// reStore: 根据表名(table), 删除条件(whereCondition)删除数据
        /// </summary>
        /// <param name="table">表名(table)</param>
        /// <param name="whereCondiction">删除条件(whereCondition)</param>
        /// <returns></returns>
        public string reStore(string table, string whereCondiction)
        {
            return execQuery(MySqlString.getRestoreStr(table, whereCondiction));
        }
        /// <summary>
        /// reStore: 根据表名(table), ID(id)删除数据
        /// </summary>
        /// <param name="table">表名(table)</param>
        /// <param name="id">id值</param>
        /// <returns></returns>
        public string reStoreById(string table, int id)
        {
            return execQuery(MySqlString.getRestoreStr(table, "id=" + id));
        }
        /// <summary>
        /// reStore: 根据表名(table), ID(id)删除数据
        /// </summary>
        /// <param name="table">表名(table)</param>
        /// <param name="id">id值</param>
        /// <returns></returns>
        public string reStoreByIds(string table, string ids)
        {
            return execQuery(MySqlString.getRestoreStr(table, "id in (" + ids + ")"));
        }
        #endregion

        #region update: 根据表名(table), 修改结果(updateSql), 修改条件(whereCondition)进行修改数据
        /// <summary>
        /// update: 根据表名(table), 修改结果(updateSql), 修改条件(whereCondition)进行修改数据
        /// </summary>
        /// <param name="table">表名(table)</param>
        /// <param name="updateSql">修改结果(updateSql)</param>
        /// <param name="whereCondiction">修改条件(whereCondition)</param>
        /// <returns></returns>
        public string update(string table, string updateSql, string whereCondiction)
        {
            return execQuery(MySqlString.getUpdateStr(table, updateSql, whereCondiction));
        }
        #endregion

        #region updateById: 根据表名(table), 修改结果(updateSql), 修改条件(whereCondition)进行修改数据
        /// <summary>
        /// update: 根据表名(table), 修改结果(updateSql), 修改条件(whereCondition)进行修改数据
        /// </summary>
        /// <param name="table">表名(table)</param>
        /// <param name="updateSql">修改结果(updateSql)</param>
        /// <param name="id">对应的ID值</param>
        /// <returns></returns>
        public string updateById(string table, string updateSql, int id)
        {
            return execQuery(MySqlString.getUpdateStr(table, updateSql, "id="+id));
        }
        #endregion

        #region paging: 分页通用接口
        /// <summary>
        /// paging: 分页通用接口
        /// </summary>
        /// <param name="table">表名</param>
        /// <param name="pageIndex">页索引</param>
        /// <param name="pageSize">每页的条数</param>
        /// <param name="keyFields">字段裂变, 以逗号分隔开</param>
        /// <param name="queryCondition">查询条件</param>
        /// <param name="orderCondition">排序条件</param>
        /// <returns></returns>
        public string paging(string table, int pageIndex, int pageSize, string keyFields, string queryCondition, string orderCondition, int delFlag)
        {
            if (delFlag > -1) {
                if (!Native.isEmpty(queryCondition)) { queryCondition = "(" + queryCondition + ") and "; }
                queryCondition += "delFlag='"+delFlag.ToString()+"'"; 
            }
            if (!Native.isEmpty(queryCondition)) { queryCondition = " where "+queryCondition; }
            if (!Native.isEmpty(orderCondition)) { orderCondition = " order by " + orderCondition; }
            int _start = (pageIndex - 1) * pageSize, _end = pageIndex * pageSize;
            string _sql = @"
                    select SQL_CALC_FOUND_ROWS {0} from {1} {2} {3} LIMIT {4},{5};
                    select FOUND_ROWS() as count;
                    ";
            return execQuery(_sql, keyFields, table, queryCondition, orderCondition, _start, pageSize);
        }
        #endregion

        /*树状表结构的基本操作   --begin*/
        #region updateTreeOrder: 更新树结构的treeOrder
        /// <summary>
        /// updateTreeOrder: 更新树结构的treeOrder
        /// </summary>
        /// <param name="table">表名</param>
        /// <param name="condition">where条件 如: id=12</param>
        /// <param name="treeOrder">更新之后的treeOrder值</param>
        /// <returns></returns>
        public string updateTreeOrder(string table, string condition, int treeOrder)
        {
            MySqlTrans _trans = new MySqlTrans(this);
            string _val = String.Empty;
            try
            {
                _val = _trans.execReader("");
                _trans.commit();
            }
            catch (Exception e)
            {
                _val = Native.getErrorMsg(e.Message.ToString());
                _trans.rollback();
            }
            finally
            {
                _trans.close();
            }
            return _val;
        }
        #endregion

        #region addTreeNode: 添加树节点
        /// <summary>
        /// addTreeNode: 添加树节点
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_pid">父节点ID</param>
        /// <param name="_key">字段列表</param>
        /// <param name="_values">值列表</param>
        /// <returns>返回当前树节点ID</returns>
        public string addTreeNode(string _table, int _pid, string jsonStr)
        {
            MySqlTrans _trans = new MySqlTrans(this);
            string _val = String.Empty;
            try
            {
                string[] _kv = MConvert.toKV(jsonStr);
                _val = _trans.addTreeNode(_table, _pid, _kv[0], _kv[1]);
                _trans.commit();
            }
            catch (Exception e)
            {
                _trans.rollback();
                _val = Native.getErrorMsg(e.Message);
            }
            finally
            {
                _trans.close();
            }
            return _val;
        }
        /// <summary>
        /// addTreeNode: 添加树节点
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="jsonStr">含有pid字段的json字符串</param>
        /// <returns></returns>
        public string addTreeNode(string _table, string jsonStr)
        {
            return addTreeNode(_table, MConvert.getInt(jsonStr, "pid"), jsonStr);
        }
        #endregion

        #region deleteTreeNode: 删除树节点
        /// <summary>
        /// deleteTreeNode: 删除树节点
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_id">要删除的节点ID</param>
        /// <returns>操作结果</returns>
        public string deleteTreeNode(string _table, int _id)
        {
            MySqlTrans _trans = new MySqlTrans(this);
            string _val = String.Empty;
            try
            {
                string _pid = _trans.execScalar("select pid from {0} where id={1};", _table, _id);
                if (!Native.isEmpty(_pid))
                {
                    string _sql = @"update {0} set delFlag=1 where pid={1} or id={1};update {0} set sons=sons-1 where id={2};";
                    _val = _trans.execNonQuery(_sql, _table, _id, _pid).ToString();
                    _trans.commit();
                }
                else
                {
                    _val = Native.getErrorMsg("在表({0})中id={1}的节点不存在", _table, _id);
                }
            }
            catch (Exception e)
            {
                _val = Native.getErrorMsg(e.Message);
                _trans.rollback();
            }
            finally
            {
                _trans.close();
            }
            return _val;
        }
        #endregion

        #region updateTreeNode: 更新树节点
        /// <summary>
        /// deleteTreeNode: 删除树节点
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_id">要删除的节点ID</param>
        /// <returns>操作结果</returns>
        public string updateTreeNode(string _table, string _update, int _id)
        {
            return execTrans(MySqlString.getUpdateStr(_table, _update, _id));
        }
        public string updateTreeNode(string _table, string _update, string _condition)
        {
            return execTrans(MySqlString.getUpdateStr(_table, _update, _condition));
        }
        #endregion

        #region queryTreeNodes: 根据条件查询
        /// <summary>
        /// updateTreeNode: 更新树节点
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_keyFields">以逗号分隔开的类表</param>
        /// <param name="_jsonCondition">查询条件</param>
        /// <returns>查询结果</returns>
        public string queryTreeNodes(string _table, string _keyFields, string _jsonCondition)
        {
            return execQuery(MySqlString.getSelectStr(_table, _keyFields, _jsonCondition, "treeOrder", "asc"));
        }
        #endregion

        #region orderTreeNode: 根据升序或降序尽心修改顺序
        /// <summary>
        /// orderTreeNode: 根据升序或降序尽心修改顺序
        /// </summary>
        /// <param name="_table">表名</param>
        /// <param name="_id">要排序操作的ID值</param>
        /// <param name="_ifAsc">是否按照升序方式排序, true: 升序, false: 降序</param>
        /// <returns></returns>
        public string orderTreeNode(string _table, int _id, bool _ifAsc)
        {
            MySqlTrans _trans = new MySqlTrans(this);
            string _val = String.Empty, _sign = ">", _fn = "min";
            if (_ifAsc) { _sign = "<"; _fn = "max"; }
            try
            {
                Json _node = _trans.execJson(MySqlString.getSelectStr(_table, "pid, treeOrder", "id=" + _id));
                if (_node != null)
                {
                    int _pid = _node.getInt("pid"), _treeOrder = _node.getInt("treeOrder");
                    Json _target = _trans.execJson("select top 1 id,treeOrder from {0} where pid={1} and treeOrder=(select {2}(treeOrder) from {0} where pid={1} and treeOrder{3}{4});", _table, _pid, _fn, _sign, _treeOrder);
                    if (_target != null)
                    {
                        string _sql = "update {0} set treeOrder={1} where id={2};";
                        _sql = MySqlString.format(_sql, _table, _target.getValue("treeOrder"), _id);
                        _sql += "update {0} set treeOrder={1} where id={2};";
                        _sql = MySqlString.format(_sql, _table, _treeOrder, _target.getValue("id"));
                        _trans.execNonQuery(_sql);
                    }
                    else
                    {
                        Native.writeToPage(Native.getErrorMsg("id是{0}的记录指针已经是第一行或最后一行", _id));
                    }
                }
                else
                {
                    Native.writeToPage(Native.getErrorMsg("在表({0})中不存在id是{1}的记录", _table, _id));
                }
                _trans.commit();
            }
            catch (Exception e)
            {
                _val = Native.getErrorMsg(e.Message);
                _trans.rollback();
            }
            finally
            {
                _trans.close();
            }
            return _val;
        }
        public string orderTreeNode(string _table, int _id, string _order)
        {
            bool _ifAsc = true;
            if (_order == "0") { _ifAsc = false; }
            return orderTreeNode(_table, _id, _ifAsc);
        }
        #endregion

        #region moveTreeNode: 移动树节点
        /// <summary>
        /// moveTreeNode: 移动树节点
        /// </summary>
        /// <param name="table">表名</param>
        /// <param name="id"></param>
        public void moveTreeNode(string table, int id)
        {
            MySqlTrans _trans = new MySqlTrans(this);
            string _val = String.Empty;
            try
            {
                _val = _trans.execReader("");
                _trans.commit();
            }
            catch (Exception e)
            {
                _val = Native.getErrorMsg(e.Message.ToString());
                _trans.rollback();
            }
            finally
            {
                _trans.close();
            }
        }
        #endregion

    }
}