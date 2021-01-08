using System;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using Fily.Data;
using Fily.Base;
using Fily.JSON;
using Fily.Util;

namespace Fily.WorkFlow
{
    public class WFRuler
    {
        #region 私有变量的定义
        private static MReflection Ref = new MReflection();
        #endregion

        #region 构造函数
        public WFRuler() { }
        #endregion

        #region runCallBackFn: 执行对应规则上的各种回调函数
        /// <summary>
        /// 执行对应规则上的各种回调函数
        /// </summary>
        /// <param name="fnArgs">函数名列表, 以逗号分隔开</param>
        public void runCallBackFnList(params string [] fnArgs) {
            
        }
        #endregion

        #region runFn: 执行对应规则上的各种回调函数
        /// <summary>
        /// 执行对应规则上的各种回调函数
        /// </summary>
        /// <param name="fnArgs">Json格式函数对象</param>
        private static void runFn(Json rule)
        {
            if (rule.getInt("enabled") == 1) {
                Json _val = Json.Parse(rule.getString("val"));
                string _sql = _val.getString("sql"), _method = _val.getString("method");
                DBUtil.getDBHelper().execNonQuery(_sql);//执行sql
                string[] _args = _method.Split(',');
                Ref.loadClass(_args[0], _args[1]);
                Ref.invoke(_args[2], _args[3]);//执行后台代码
            }
        }
        #endregion

        #region runEvent: 执行对应规则上的各种独立事件
        /// <summary>
        /// 执行对应规则上的各种独立事件
        /// </summary>
        /// <param name="eventArgs">事件名列表, 以逗号分隔开</param>
        private static void runEvent(Json evt, ArrayList owners, SqlTrans trans)
        {
            /*
            switch(evt.getValue("itemKey")){
                case "evt_email_inner":
                    for (int i = 0; i < owners.Count; i++)
                    {
                        trans.execNonQuery(MString.getInsertStr("U_EMAIL_" + ((Json)owners[i]).getValue("id"), "nodeName, content, type", "'
             * 
             * 系统提醒','系统有任务等您处理，谢谢',1"));
                    }
                    break;
                case "evt_email_outter":
                    Mail _mail = new Mail();
                    for (int i = 0; i < owners.Count; i++) {
                        string _email = Filter.refilterStr(Filter.filterNormalStr(((Json)owners[i]).getValue("email")));
                        if (!Native.isEmpty(_email)) { 
                            _mail.setSubject("Fily系统提醒");
                            _mail.setContent("系统有任务等您处理，谢谢");
                            _mail.send(_email);
                        }
                    }
                    break;
                case "evt_log":

                    break;
                case "evt_sms":

                    break;
                case "evt_msg":

                    break;
            }*/
        }
        #endregion

        #region runCurrRule: 运行流程节点规则
        /// <summary>
        /// runRule: 运行流程节点规则
        /// </summary>
        /// <param name="rule">规则Json对象</param>
        private static void runCurrRule(Json rule, ArrayList owners, SqlTrans trans)
        {
            switch (rule.getInt("type")) { 
                case 1:
                    runFn(rule);
                    break;
                case 2:
                    runEvent(rule, owners, trans);
                    break;
                case 3:

                    break;
            }
        }
        #endregion

        #region runNextRule: 运行流程节点规则
        /// <summary>
        /// runRule: 运行流程节点规则
        /// </summary>
        /// <param name="rule">规则Json对象</param>
        private static void runNextRule(Json rule, ArrayList owners, SqlTrans trans)
        {
            switch (rule.getInt("type"))
            {
                case 1:
                    runFn(rule);
                    break;
                case 2:
                    runEvent(rule, owners, trans);
                    break;
                case 3:

                    break;
            }
        }
        #endregion

        #region runNext: 根据当前节点和下一个节点id运行扭转的回调函数
        /// <summary>
        /// runNext: 根据当前节点和下一个节点id运行扭转的回调函数
        /// </summary>
        /// <param name="_currDefinedID">当前节点的定义节点ID</param>
        /// <param name="_nextDefinedID">下一个节点的定义节点ID</param>
        public static void runNext(int _currDefinedID, int _nextDefinedID, string _currOwners, string _nextOwners)
        {
            SqlTrans trans = new SqlTrans(DBUtil.getBaseApi());
            try
            {
                //ArrayList _cRules = trans.execJsonList("select type, itemKey, itemValue from {0} where oid={1};", T_rule, _currDefinedID);
                ArrayList _nRules = trans.execJsonList("select type, itemKey, itemValue from {0} where oid={1};", R.Table.WF_RULE, _nextDefinedID);
                //ArrayList _cOwners = trans.execJsonList(MString.getSelectStr("SYS_CM_USER", "id,email", "charindex(','+cast(id as varchar(10))+',','" + _currOwners + "')<>0"));
                ArrayList _nOwners = trans.execJsonList(MString.getSelectStr("SYS_CM_USER", "id,email", "charindex(','+cast(id as varchar(10))+',','" + _nextOwners + "')<>0"));
                //if (_cRules != null) { for (int _c = 0, _cLen = _cRules.Count; _c < _cLen; _c++) { runCurrRule((Json)_cRules[_c], _cOwners); } }
                if (_nRules != null) { for (int _n = 0, _nLen = _nRules.Count; _n < _nLen; _n++) { runNextRule((Json)_nRules[_n], _nOwners, trans); } }
                trans.commit();
            }
            catch (Exception e)
            {
                trans.rollback();
                Native.write(e.Message);
            }
            finally {
                trans.close();
            }
        }
        #endregion
    }
}