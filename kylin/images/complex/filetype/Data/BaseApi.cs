using System;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Data;
using System.Data.Sql;
using System.Data.SqlClient;
using Fily.Base;
using Fily.JSON;
using Fily.Util;
using Fily.IO;

namespace Fily.Data
{
    /// <summary>
    /// BaseApi 是系统提供的基本API接口
    /// </summary>
    public class BaseApi
    {
        #region 私有变量的定义
        private DBHelper helper;  //DataBaseHelper, 改类主要封装了一些对数据库的基本操作和数据格式转换的方法
        private HttpRequest req = HttpContext.Current.Request;
        private const string DB_TEMPLATE = "MTemplate";
        private const string DB_PATH = "E:\\Code\\DB\\ForSqlServer"; 
        private string cSplit;  //cellSplit, 列分隔符
        private string rSplit;  //rowSplit, 行分隔符
        private string reSplit; //resultSplit, 结果集分隔符
        private string dataType;//dataType, 数据类型, 可以使json, array, html 三种格式 默认是html
        private string [,] COL_FIELDS;
        #endregion

        #region BaseApi(DBHelper dbh)
        /// <summary>
        /// BaseApi(DBHelper dbh): 只有DBHelper一个参数的构造函数
        /// </summary>
        /// <param name="dbh">DBHelper对象</param>
        public BaseApi(DBHelper dbh) { initClass(dbh, req["rSplit"], req["cSplit"], req["resultSplit"], req["dataType"]); }
        #endregion

        #region BaseApi(DBHelper dbh, string rS, string cS)
        /// <summary>
        /// BaseApi(DBHelper dbh, string rS, string cS, string reS): 有四个参数的构造函数
        /// </summary>
        /// <param name="dbh">DBHelper对象</param>
        /// <param name="rS">行分隔符</param>
        /// <param name="cS">列分隔符</param>
        public BaseApi(DBHelper dbh, string rS, string cS) { initClass(dbh, rS, cS, req["resultSplit"], req["dataType"]); }
        #endregion

        #region BaseApi(DBHelper dbh, string rS, string cS, string reS)
        /// <summary>
        /// BaseApi(DBHelper dbh, string rS, string cS, string reS): 有四个参数的构造函数
        /// </summary>
        /// <param name="dbh">DBHelper对象</param>
        /// <param name="rS">行分隔符</param>
        /// <param name="cS">列分隔符</param>
        /// <param name="reS">结果集分隔符</param>
        public BaseApi(DBHelper dbh, string rS, string cS, string reS) { initClass(dbh, rS, cS, reS, req["dataType"]); }
        #endregion

        #region BaseApi(DBHelper dbh, string rS, string cS, string reS, string dtS)
        /// <summary>
        /// BaseApi(DBHelper dbh, string rS, string cS, string reS, string dtS): 有五个参数的构造函数
        /// </summary>
        /// <param name="dbh">DBHelper对象</param>
        /// <param name="rS">行分隔符</param>
        /// <param name="cS">列分隔符</param>
        /// <param name="reS">结果集分隔符</param>
        /// <param name="dtS">数据类型, 可以使json, array, html 三种格式 默认是html</param>
        public BaseApi(DBHelper dbh, string rS, string cS, string reS, string dtS) { initClass(dbh, rS, cS, reS, dtS); }
        #endregion

        #region initClass(DBHelper dbh, string rS, string cS, string reS, string dtS)
        /// <summary>
        /// BaseApi(DBHelper dbh, string rS, string cS, string reS, string dtS): 有五个参数的构造函数
        /// </summary>
        /// <param name="dbh">DBHelper对象</param>
        /// <param name="rS">行分隔符</param>
        /// <param name="cS">列分隔符</param>
        /// <param name="reS">结果集分隔符</param>
        /// <param name="dtS">数据类型, 可以使json, array, html 三种格式 默认是html</param>
        private void initClass(DBHelper dbh, string rS, string cS, string reS, string dtS)
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
            DBUtil.setBaseApi(this);
            COL_FIELDS = new string[,] { 
                {"index", "col.colorder as idx"},
                {"name", "col.name as name"},
                {"ifMark", "(case when COLUMNPROPERTY(col.id, col.name, 'IsIdentity')=1 then '√'else '' end) as ifMask"},
                {"ifPrimaryKey", @"(case when (SELECT count(*)
			                              FROM sysobjects
			                              WHERE (name in
						                            (SELECT name
					                               FROM sysindexes
					                               WHERE (id = col.id) AND (indid in
								                             (SELECT indid
								                            FROM sysindexkeys
								                            WHERE (id = col.id) AND (colid in
										                              (SELECT colid
										                             FROM syscolumns
										                             WHERE (id = col.id) AND (name = col.name))))))) AND
												                            (xtype = 'PK'))>0 then '√' else '' end) as ifPrimaryKey"},
                {"defaultValue", "comments.text as defValue"},
                {"type", "types.name as type"},
                {"byte", "col.length as byte"},
                {"length", "COLUMNPROPERTY(col.id, col.name, 'PRECISION') as length"},
                {"decimalSize", "isnull(COLUMNPROPERTY(col.id,col.name,'Scale'),0) as decimalSize"},
                {"ifNull", "(case when col.isnullable=1 then '√'else '' end) as ifNull"},
                {"comment", "properties.value as comment"}
            };
        }
        #endregion

        #region 私有变量的set, get方法的定义
        public DBHelper getDBHelper() { return helper; }
        public void setDBHelper(DBHelper dbh) { helper = dbh; }
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
            return execQuery(MString.format(sql, args));
        }
        public string execQuery(string sql, Json json)
        {
            return execQuery(MString.format(sql, json));
        }
        #endregion

        #region exeJSON: 只有sql一个参数的方法
        /// <summary>
        /// 直接调用helper的方法执行sql语句
        /// </summary>
        /// <param name="sql">sql语句, 存储过程</param>
        /// <returns></returns>
        public Json exeJson(string sql)
        {
            return helper.execJson(sql);
        }
        public Json exeJson(string sql, params object[] args)
        {
            return exeJson(MString.format(sql, args));
        }
        public Json exeJson(string sql, Json json)
        {
            return exeJson(MString.format(sql, json));
        }
        #endregion

        #region exeJsonList: 只有sql一个参数的方法
        /// <summary>
        /// 直接调用helper的方法执行sql语句
        /// </summary>
        /// <param name="sql">sql语句, 存储过程</param>
        /// <returns></returns>
        public ArrayList exeJsonList(string sql)
        {
            return helper.execJsonList(sql);
        }
        public ArrayList exeJsonList(string sql, params object[] args)
        {
            return exeJsonList(MString.format(sql, args));
        }
        public ArrayList exeJsonList(string sql, Json json)
        {
            return exeJsonList(MString.format(sql, json));
        }
        #endregion

        #region exeDataSet: 只有sql一个参数的方法
        /// <summary>
        /// 直接调用helper的方法执行sql语句
        /// </summary>
        /// <param name="sql">sql语句, 存储过程</param>
        /// <returns></returns>
        public DataSet exeDataSet(string sql)
        {
            return helper.execDataSet(sql);
        }
        public DataSet exeDataSet(string sql, params object[] args)
        {
            return exeDataSet(MString.format(sql, args));
        }
        public DataSet exeDataSet(string sql, Json json)
        {
            return exeDataSet(MString.format(sql, json));
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
            return execTrans(MString.format(sql, args));
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
            return execScalar(MString.format(sql, args));
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

        #region addColumn: 添加列
        /// <summary>
        /// addColumn: 添加列
        /// </summary>
        /// <param name="table">字符串要写到的文件路径</param>
        /// <param name="colName">要写的文件内容</param>
        /// <param name="colType">字符串要写到的文件路径</param>
        /// <param name="colIdx">要写的文件内容</param>
        /// <returns>返回是否成功</returns>
        public string addColumn(string table, string colName, string colType, int colid)
        {
            SqlTrans _trans = new SqlTrans(this);
            string _result = String.Empty;
            try{
                _result = _trans.execReader("select 1 from sysobjects where name='{0}' and xtype='u';", table);
                if (Native.isNullEmpty(_result)) {
                    _result =  Native.getErrorMsg("表({0})还未创建哦", table);
                }else {
                    _result = _trans.execReader("select 1 from syscolumns where id=object_id('{0}') and name='{1}';", table, colName);
                    if (!Native.isNullEmpty(_result))
                    {
                        _result =  Native.getErrorMsg("表({0})已经有这个列({1})了哦", table, colName);
                    }else {
                        string _colid = _trans.execScalar(@"
                            declare @colid_max int, @colid int;
                            select @colid_max=max(colid) from   syscolumns   where   id=object_id('{0}');
                            if {1}>@colid_max or {1}<1 
                                set @colid={1}+1
                            else 
                                set @colid={1}
                            select @colid as 'colid';
                        ", table, colid);
                        _trans.execNonQuery("alter table {0} add {1} {2};", table, colName, colType);
                        string _colid_max = _trans.execScalar(@"select colid from syscolumns where id=object_id('{0}') and name = '{1}';", table, colName);
                        if (_trans.execScalar("select @@rowcount;") != "1")
                        {
                            _result = Native.getErrorMsg("加一个新列不成功，请检查你的列类型是否正确");
                        }
                        else {
                            _result = execQuery(@"
                            declare   @sql   varchar(1000);
                            exec sp_configure 'allow updates', 0;
                            exec sp_configure 'allow updates', 1;
                            exec sp_configure 'show advanced options', 1; 
                            RECONFIGURE WITH OVERRIDE;
                            set @sql = 'update syscolumns set colid=-1 where id=object_id(''{0}'') and colid='+cast({1} as varchar(10)); 
                            exec(@sql);
                            set @sql = 'update syscolumns set colid=colid+1 where id=object_id(''{0}'') and colid>='+cast({2} as varchar(10));   
                            exec(@sql);
                            set @sql = 'update syscolumns set colid='+cast({2} as varchar(10))+' where id=object_id(''{0}'') and name=''{3}'';';  
                            exec(@sql);", table, _colid_max, _colid, colName);
                        }
                    }
                }
                _trans.commit();
            }catch(Exception e){
                _trans.rollback();
                _result = Native.getErrorMsg(e.Message.ToString());
            }finally{
                _trans.close();
            }
            return _result;
        }
        #endregion

        #region getAllTable: 得到连接数据库的所有表
        public string getAllTable()
        {
            return execQuery("select name from sysobjects where xtype='U' and name<>'dtproperties';");
        }
        #endregion

        #region getTableFields: 得到表名是tableName的所有字段
        public string getTableFields(string tableName, string keyFields) 
        {
            keyFields = keyFields.Replace("id", "col.id");
            for (int i = 0, _len = COL_FIELDS.GetLength(0); i < _len; i++) {
                keyFields = keyFields.Replace("{" + COL_FIELDS[i, 0] + "}", COL_FIELDS[i, 1]);
            }
            /*
            return execQuery(@"select {0} from sys.syscolumns col 
			                left join sys.extended_properties properties on col.id = properties.major_id AND col.colid = properties.minor_id
			                left join sys.syscomments comments on col.cdefault = comments.id
			                left join sys.systypes types on col.xtype = types.xusertype
			                inner join sys.sysobjects objs on col.id = objs.id and objs.xtype='U' and objs.name<>'dtproperties'
		                where col.id=Object_Id('{1}') order by col.colid, col.id, col.colorder;", keyFields, tableName);*/
            return execQuery(@"select {0} from syscolumns col 
			                left join sysproperties properties on col.id = properties.id AND col.colid = properties.smallid
			                left join syscomments comments on col.cdefault = comments.id
			                left join systypes types on col.xtype = types.xusertype
			                inner join sysobjects objs on col.id = objs.id and objs.xtype='U' and objs.name<>'dtproperties'
		                where col.id=Object_Id('{1}') order by col.colid, col.id, col.colorder;", keyFields, tableName);

        }
        #endregion

        #region getAllProcs: 得到数据库的所有存储过程
        public string getAllProcs()
        {
            return execQuery("select name from sysobjects where xtype='P' and charindex('_',name)=1;");
        }
        #endregion

        #region tableExist: 判断数据库是否存在表名是tableName的表
        public string tableExist(string tableName)
        {
            return execQuery("select 1 from sysobjects where xtype='U' and name="+tableName);
        }
        #endregion

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
            return execSqlByProc(MString.format(sql, args));
        }
        public string execSqlByProc(string sql, Json json)
        {
            return execSqlByProc(MString.format(sql, json));
        }
        #endregion

        #region getTableInfo: 获取某张表的字段信息
        /// <summary>
        /// getTableInfo: 获取某张表的字段信息
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <returns></returns>
        public string getTableInfo(string tableName) {
            return execQuery("EXEC sp_help '{0}';", tableName);
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
            return execQuery(MString.getSelectStr(table, fields, whereCondiction, orderByColumn, order));
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
            return select(table, fields, whereCondiction, "cTime", "asc");
        }
        /// <summary>
        /// select: 根据表名(table), 查询字段(fields), 查询条件(whereCondiction)查询结果
        /// </summary>
        /// <param name="table">表名</param>
        /// <param name="fields">查询字段</param>
        /// <param name="whereCondiction">查询条件</param>
        /// <returns>查询结果</returns>
        public string selectTree(string table, string fields, string whereCondiction)
        {
            string _sql = "select {0} from {1} as self where delFlag<>1 and {2} order by type asc, cTime asc, treeOrder asc";
            return execQuery(_sql, fields, table, whereCondiction);
        }
        #endregion 

        #region selectByProc: 根据表名(table), 查询字段(fields), 查询条件(whereCondiction), 排序字段(orderByColumn), 排序顺序(order)查询结果
        /// <summary>
        /// select: 根据表名(table), 查询字段(fields), 查询条件(whereCondiction)查询结果
        /// </summary>
        /// <param name="table">表名</param>
        /// <param name="fields">查询字段</param>
        /// <param name="whereCondiction">查询条件</param>
        /// <param name="orderByColumn">要排序的字段</param>
        /// <param name="order">排序方式: asc desc</param>
        /// <returns>查询结果</returns>
        public string selectByProc(string table, string fields, string whereCondiction, string orderColumn, string order)
        {
            return execQuery("exec tableSelect '{0}','{1}','{2}','{3}','{4}';", fields, table, whereCondiction, orderColumn, order);
        }
        /// <summary>
        /// select: 根据表名(table), 查询字段(fields), 查询条件(whereCondiction)查询结果
        /// </summary>
        /// <param name="table">表名</param>
        /// <param name="fields">查询字段</param>
        /// <param name="whereCondiction">查询条件</param>
        /// <returns>查询结果</returns>
        public string selectByProc(string table, string fields, string whereCondiction)
        {
            return selectByProc(table, fields, whereCondiction, "id", "1");
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
            return execQuery(MString.getInsertStr(table, fields, values, true));
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
            return execQuery(MString.getDeleteStr(table, whereCondiction));
        }
        /// <summary>
        /// delete: 根据表名(table), ID(id)删除数据
        /// </summary>
        /// <param name="table">表名(table)</param>
        /// <param name="id">id值</param>
        /// <returns></returns>
        public string deleteById(string table, int id)
        {
            return execQuery(MString.getDeleteStr(table, "id="+id));
        }
        /// <summary>
        /// deleteByIds: 根据表名(table), ID(id)删除数据
        /// </summary>
        /// <param name="table">表名(table)</param>
        /// <param name="id">id值</param>
        /// <returns></returns>
        public string deleteByIds(string table, string ids)
        {
            return execQuery(MString.getDeleteStr(table, "id in (" + ids + ")"));
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
            return execQuery(MString.getRestoreStr(table, whereCondiction));
        }
        /// <summary>
        /// reStore: 根据表名(table), ID(id)删除数据
        /// </summary>
        /// <param name="table">表名(table)</param>
        /// <param name="id">id值</param>
        /// <returns></returns>
        public string reStoreById(string table, int id)
        {
            return execQuery(MString.getRestoreStr(table, "id=" + id));
        }
        /// <summary>
        /// reStore: 根据表名(table), ID(id)删除数据
        /// </summary>
        /// <param name="table">表名(table)</param>
        /// <param name="id">id值</param>
        /// <returns></returns>
        public string reStoreByIds(string table, string ids)
        {
            return execQuery(MString.getRestoreStr(table, "id in (" + ids + ")"));
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
            return execQuery(MString.getUpdateStr(table, updateSql, whereCondiction));
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
            return execQuery(MString.getUpdateStr(table, updateSql, "id="+id));
        }
        #endregion

        #region emptyTable: 清空表
        /// <summary>
        /// emptyTable: 清空表
        /// </summary>
        /// <param name="table">要清空的表名</param>
        /// <returns></returns>
        public string emptyTable(string table)
        {
            return execQuery("truncate table {0};", table);
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
                queryCondition += "delFlag="+delFlag.ToString(); 
            }
            if (!Native.isEmpty(queryCondition)) { queryCondition = " where "+queryCondition; }
            if (!Native.isEmpty(orderCondition)) { orderCondition = " order by " + orderCondition; }
            int _start = (pageIndex - 1) * pageSize, _end = pageIndex * pageSize;
            string _sql = @"if exists(SELECT * FROM tempdb.dbo.sysobjects WHERE id = object_id(N'tempdb..#temp_paging' ))
	                            drop table #temp_paging;
                            begin
	                            select identity(int,1,1) idx,temp.id into #temp_paging from (select top 100000000 id from {0}{1}{5})temp;
                                select {2} from {0} as self where id in (select id from #temp_paging where idx between {3} and {4}){5};
                                select count(1) from #temp_paging;
                            end;";
            return execQuery(_sql, table, queryCondition, keyFields, _start, _end, orderCondition);
        }
        #endregion

        #region pagingNoCount: 分页通用接口
        /// <summary>
        /// pagingNoCount: 分页通用接口
        /// </summary>
        /// <param name="table">表名</param>
        /// <param name="pageIndex">页索引</param>
        /// <param name="pageSize">每页的条数</param>
        /// <param name="keyFields">字段裂变, 以逗号分隔开</param>
        /// <param name="queryCondition">查询条件</param>
        /// <param name="orderCondition">排序条件</param>
        /// <returns></returns>
        public string pagingNoCount(string table, int pageIndex, int pageSize, string keyFields, string queryCondition, string orderCondition, int delFlag)
        {
            if (delFlag > -1)
            {
                if (!Native.isEmpty(queryCondition)) { queryCondition = "(" + queryCondition + ") and "; }
                queryCondition += "delFlag=" + delFlag.ToString();
            }
            if (!Native.isEmpty(queryCondition)) { queryCondition = " where " + queryCondition; }
            if (!Native.isEmpty(orderCondition)) { orderCondition = " order by " + orderCondition; }
            int _start = (pageIndex - 1) * pageSize, _end = pageIndex * pageSize;
            string _sql = @"if exists(SELECT * FROM tempdb.dbo.sysobjects WHERE id = object_id(N'tempdb..#temp_paging' ))
	                            drop table #temp_paging;
                            begin
	                            select identity(int,1,1) idx,temp.id into #temp_paging from (select top 100000000 id from {0}{1}{5})temp;
                                select {2} from {0} as self where id in (select id from #temp_paging where idx between {3} and {4}){5};
                            end;";
            return execQuery(_sql, table, queryCondition, keyFields, _start, _end, orderCondition);
        }
        #endregion

        #region emptyTables:清空制定以逗号分隔开的一批表
        /// <summary>
        /// emptyTables:清空制定以逗号分隔开的一批表
        /// </summary>
        /// <param name="table">以逗号分隔开的表名</param>
        /// <returns></returns>
        public string emptyTables(string table)
        {
            string _sql = String.Empty;
            string[] _ts = table.Split(',');
            for (int i = 0, _tLen = _ts.Length; i < _tLen; i++)
            {
                _sql += "truncate table " + _ts[i] + ";";
            }
            return execQuery(_sql);
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
            SqlTrans _trans = new SqlTrans(this);
            string _val = String.Empty;
            try
            {
                _val = _trans.execReader("");
                _trans.commit();
            }catch (Exception e){
                _val = Native.getErrorMsg(e.Message.ToString());
                _trans.rollback();
            }finally {
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
        public string addTreeNode(string _table, int _pid, string jsonStr) {
            SqlTrans _trans = new SqlTrans(this);
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
            finally {
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
        public string addTreeNode(string _table, string jsonStr) { 
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
            SqlTrans _trans = new SqlTrans(this);
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
            return execTrans(MString.getUpdateStr(_table, _update, _id));
        }
        public string updateTreeNode(string _table, string _update, string _condition)
        {
            return execTrans(MString.getUpdateStr(_table, _update, _condition));
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
            return execQuery(MString.getSelectStr(_table, _keyFields, _jsonCondition, "treeOrder", "asc"));
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
            SqlTrans _trans = new SqlTrans(this);
            string _val = String.Empty, _sign = ">", _fn = "min";
            if (_ifAsc) { _sign = "<"; _fn = "max"; }
            try
            {
                Json _node = _trans.execJson(MString.getSelectStr(_table, "pid, treeOrder", "id="+_id));
                if(_node!=null){
                    int _pid = _node.getInt("pid"), _treeOrder = _node.getInt("treeOrder");
                    Json _target = _trans.execJson("select top 1 id,treeOrder from {0} where pid={1} and treeOrder=(select {2}(treeOrder) from {0} where pid={1} and treeOrder{3}{4});", _table, _pid, _fn, _sign, _treeOrder);
                    if (_target != null)
                    {
                        string _sql = "update {0} set treeOrder={1} where id={2};";
                        _sql = MString.format(_sql, _table, _target.getValue("treeOrder"), _id);
                        _sql += "update {0} set treeOrder={1} where id={2};";
                        _sql = MString.format(_sql, _table, _treeOrder, _target.getValue("id"));
                        _trans.execNonQuery(_sql);
                    }
                    else {
                        Native.writeToPage(Native.getErrorMsg("id是{0}的记录指针已经是第一行或最后一行", _id));
                    }
                }else{
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
        public string orderTreeNode(string _table, int _id, string _order) {
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
            SqlTrans _trans = new SqlTrans(this);
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

        #region createDB: 创建数据库
        /// <summary>
        /// createDB: 创建数据库
        /// </summary>
        /// <param name="_DBName">数据库名</param>
        /// <returns></returns>
        public string createDB(string _DBName, string _DataPath)
        {
            string _val = String.Empty, _copyTableSQLs = String.Empty;
            SqlTrans _trans = new SqlTrans(this);
            string _sql = @"use master;
                                if exists (select * from sysdatabases where name='{0}') drop database {0};
                                EXEC sp_configure 'show advanced options', 1; RECONFIGURE;
                                EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;
                                exec xp_cmdshell 'mkdir {1}', NO_OUTPUT;
                                create database {0}
                                on primary (name='{0}_data',fileName='{1}\\{0}_data.mdf',size=10MB,filegrowth=10%)
                                log on (name='{0}_log',fileName='{1}\\{0}_data.ldf',size=1MB,maxsize=20MB,filegrowth=10%)";
            helper.execNonQuery(_sql, _DBName, _DataPath);
            string[] _tables = execQuery("Select name FROM {0}..SysObjects Where XType='U' and charindex('SYS_',name)<>1 ORDER BY Name;", DB_TEMPLATE).Split(getRSplit().ToCharArray());
            for (int i = 0, _len = _tables.GetLength(0); i < _len; i++)
            {
                _copyTableSQLs += MString.format("select * into {0}.dbo.{2} from {1}.dbo.{2};", _DBName, DB_TEMPLATE, _tables[i]);
            }
            try
            {
                _trans.execNonQuery(_copyTableSQLs);
                _trans.commit();
            }
            catch (Exception e)
            {
                _val = e.Message;
                _trans.rollback();
            }
            finally
            {
                _trans.close();
            }
            return _val;
        }
        #endregion

        #region createDBByCopy: 通过复制模版数据库文件来创建数据库
        /// <summary>
        /// createDBByCopy: 通过复制模版数据库文件来创建数据库
        /// </summary>
        /// <param name="_DBName">新建数据库名</param>
        /// <param name="_sourcePath">模版数据库名</param>
        /// <param name="_targetPath">新建数据库路径</param>
        /// <param name="_targetPath">模版数据库路径</param>
        public string createDBByCopy(string _DBName, string _DBTemplate, string _targetPath, string _sourcePath)
        {
            string _return = String.Empty;
            try
            {
                string _tPath = _targetPath + "\\" + _DBName, _sPath = _sourcePath + "\\Fily";
                helper.execNonQuery(@"
                                    use master;if exists (select * from sysdatabases where name='{0}') drop database {0};
                                    exec sp_dboption '{1}', 'offline', 'True';alter database {1} set single_user with rollback IMMEDIATE;
                    ", _DBName, _DBTemplate);
                MFile.createFile(_tPath);
                MFile.copy(_sPath + "\\" + _DBTemplate + ".mdf", _tPath + "\\" + _DBName + ".mdf", true);
                MFile.copy(_sPath + "\\" + _DBTemplate + "_log.ldf", _tPath + "\\" + _DBName + "_log.ldf", true);
                helper.execNonQuery(@"
                                    use master; exec sp_dboption '{1}', 'offline', 'False';alter database {1} set multi_user;
                                    CREATE DATABASE {0} ON  (FILENAME = '{2}\\0}.mdf'), (FILENAME = '{2}\\{0}_log.ldf') FOR ATTACH;
                    ", _DBName, _DBTemplate, _tPath);
            }
            catch (Exception ex) {
                _return = Native.getErrorMsg(ex.Message);
            }
            return _return;
        }
        public void createDBByCopy(string _DBName, string _targetPath) { createDBByCopy(_DBName, DB_TEMPLATE, _targetPath, DB_PATH); }
        public void createDBByCopy(string _DBName) { createDBByCopy(_DBName, DB_TEMPLATE, DB_PATH + "/"+_DBName, DB_PATH + "/Fily"); }
        #endregion

        #region setDBOffline: 设置数据库离线状态, 以便程序可以复制或删除数据文件
        /// <summary>
        /// setDBOffline: 设置数据库离线状态, 以便程序可以复制或删除数据文件
        /// </summary>
        /// <param name="_DBName">数据库名</param>
        public string setDBOffline(string _DBName)
        {
            string _sql = "use master; alter database {0} set single_user with rollback IMMEDIATE;exec sp_dboption '{0}', 'offline', 'True';SELECT DATABASEPROPERTY('{0}','IsOffline');";
            return execQuery(_sql, _DBName);
        }
        #endregion

        #region setDBOnline: 设置数据库在线状态
        /// <summary>
        /// setDBOnline: 设置数据库在线状态
        /// </summary>
        /// <param name="_DBName">数据库名</param>
        public string setDBOnline(string _DBName)
        {
            string _sql = "use master; ALTER DATABASE {0} SET MULTI_USER;exec sp_dboption '{0}', 'offline', 'False';SELECT DATABASEPROPERTY('{0}','IsOffline');";
            return execQuery(_sql, _DBName);
        }
        #endregion

        #region deleteDB: 删除数据库
        /// <summary>
        /// deleteDB: 删除数据库
        /// </summary>
        /// <param name="_DBName">数据库名</param>
        public void deleteDB(string _DBName)
        {
            SqlTrans _trans = new SqlTrans(this);
            string _val = String.Empty;
            try
            {
                string _sql = "use master;drop database {0};";
                _trans.execNonQuery(_sql, _DBName);
                _trans.commit();
            }
            catch (Exception e)
            {
                _val = e.Message;
                _trans.rollback();
            }
            finally
            {
                _trans.close();
            }
        }
        #endregion

        #region getDBInfo: 获取数据信息
        /// <summary>
        /// getDBInfo: 获取数据信息
        /// </summary>
        /// <param name="_DBName"></param>
        /// <returns></returns>
        public string getDBInfo()
        {
            return "";
        }
        #endregion

    }
}