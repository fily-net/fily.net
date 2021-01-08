using System;
using System.Collections.Generic;
using System.Web;
using System.Text;
using System.Collections;
using Fily.Data;
using Fily.Util;
using Fily.JSON;
using Fily.Base;

namespace Fily.WorkFlow
{
    /// <summary>
    /// 工作流索引对象
    /// </summary>
    public class WFIndex
    {
        #region 私有变量的定义
        private BaseApi api;
        private int indexID;
        private const char SCHAR = '※';
        #endregion

        #region 构造函数
        public WFIndex(int _indexID, BaseApi _api) { indexID = _indexID; api = _api; }
        #endregion

        #region 变量的set, get方法
        public int getIndexID() { return indexID; }
        public string getJsonStr() {
            return api.execQuery("select wfJson from {0} where id={1};", R.Table.WF_INDEX, indexID);
        }
        public string setJsonStr(string _json) {
            return api.execQuery("update table {0} set json='{1}' where id={2};", R.Table.WF_INDEX, _json, indexID);
        }
        #endregion

        #region toDefinition: 通过传递过来的一批json字符串生成工作流定义
        /// <summary>
        /// toDefinition: 通过传递过来的一批json字符串生成工作流定义
        /// </summary>
        /// <param name="_definitionJson">一批以※间隔的json字符串</param>
        /// <returns>生成工作流定义成功之后返回定义表中关联的id</returns>
        public string toDefinition(string _definitionJson){
            string _returnVal = String.Empty;
            SqlTrans trans = new SqlTrans(api);
            try
            {
                string[] _jsonAry = _definitionJson.Split(SCHAR);
                string _idx = String.Empty, _json = String.Empty, _exist = String.Empty;
                StringBuilder _ids = new StringBuilder();
                string [] _kv;
                for (int i = 0, _len = _jsonAry.GetLength(0); i < _len; i++) {
                    _json = _jsonAry[i];
                    _idx = MConvert.getValue(_json, "idx");
                    _exist = trans.execScalar("select 1 from {0} where oid={1} and idx='{2}';", R.Table.WF_DEFINITION, indexID, _idx);
                    if (Native.isEmpty(_exist))
                    {
                        _kv = MConvert.toKV(_json);
                        string _id = trans.execScalar("insert into {0} ({1}) values({2});select SCOPE_IDENTITY();", R.Table.WF_DEFINITION, _kv[0]+",oid", _kv[1]+","+indexID);
                        _ids.Append(_id + ",");
                    }
                    else {
                        break;
                    }
                }
                ArrayList _list = (ArrayList)trans.execArrayList("select idx, id from {0} where oid={1};", R.Table.WF_DEFINITION, indexID)[0];
                Json _hash = toHashJson(_list);
                if (_ids.Length > 0) { _ids.Remove(_ids.Length - 1, 1); } else { _ids = getIDs(_hash); }
                string _next = getUpdateVal("next", _hash), _pre = getUpdateVal("pre", _hash);
                _returnVal = _ids.ToString();
                trans.execNonQuery("update {0} set {1}, {2} where id in ({3});", R.Table.WF_DEFINITION, _next, _pre, _returnVal);
                trans.commit();
            }
            catch (Exception e)
            {
                trans.rollback();
                _returnVal = Native.getErrorMsg(e.Message.ToString());
            }
            finally {
                trans.close();
            }
            return _returnVal;
        }
        #endregion

        #region reToDefinition: 通过传递过来的一批json字符串重新生成工作流定义
        /// <summary>
        /// reToDefinition: 通过传递过来的一批json字符串重新生成工作流定义
        /// </summary>
        /// <param name="_definitionJson">一批以※间隔的json字符串</param>
        /// <returns>生成工作流定义成功之后返回定义表中关联的id</returns>
        public string reToDefinition(string _definitionJson)
        {
            api.execQuery("delete {0} where oid={1};", R.Table.WF_DEFINITION, indexID);
            return toDefinition(_definitionJson);
        }
        #endregion

        #region addInstance: 新建在该流程索引下的实例
        /// <summary>
        /// addInstance: 新建在该流程索引下的实例
        /// </summary>
        /// <returns></returns>
        public string addInstance(string alias, string url, string owners,  bool ifReturnCurrID, string note)
        {
            SqlTrans trans = new SqlTrans(api);
            string _return = String.Empty;
            try
            {
                Json json = trans.execJson("select id,oid,nodeName,type,next,users,roles,logicState from {0} where oid={1} and type=10;", R.Table.WF_DEFINITION, indexID);
                if (json == null)
                {
                    _return = Native.getErrorMsg("在索引ID为{0}中未找到开始节点, 请核实!", indexID);
                }
                else {
                    if (owners.Length < 2) { owners = trans.getAllUsers(json.getValue("users"), json.getValue("roles")); }
                    switch(json.getInt("logicState")){
                        case 6:
                            owners = "," + MSession.get(MSession.getClientKey()) + ",";
                            break;
                        case 7:
                            owners = trans.getDeptOwners(MSession.get(MSession.getClientKey())); 
                            break;
                    }
                    string _k = "oid,nodeName,owner,url";
                    string _v = json.getValue("oid") + ",'" + alias + "','" + owners + "','"+url+"'";
                    _return = trans.execScalar(MString.getInsertStr(R.Table.WF_INSTANCE, _k, _v, true));
                    int _rootID = Convert.ToInt16(_return);
                    string _kt = "oid,definedNodeID,nodeName,next,pre,state,type,owner,note";
                    string _vt = json.getValue("oid") + "," + json.getValue("id") + ",'" + json.getValue("nodeName") + "','" + json.getValue("next") + "',0,1,10,'" + owners+"','"+note+"'";
                    string _CURRID = trans.addTreeNode(R.Table.WF_INSTANCE, _rootID, _kt, _vt);
                    if (ifReturnCurrID) { _return += "@" + _CURRID; }
                    trans.commit();
                }
            }
            catch (Exception ex)
            {
                _return = Native.getErrorMsg(ex.Message + "--addInstance");
                trans.rollback();
            }
            finally {
                trans.close();
            }
            return _return;
        }
        #endregion

        #region addInstance: 新建在该流程索引下的实例
        /// <summary>
        /// addInstance: 新建在该流程索引下的实例
        /// </summary>
        /// <param name="alias">别名</param>
        /// <param name="owners">流程拥有者</param>
        /// <returns></returns>
        public string addInstance(string alias, string url, bool ifReturnCurrID, string note)
        {
            return addInstance(alias, url, ",", ifReturnCurrID, note);
        }
        #endregion

        #region addInstance: 新建在该流程索引下的实例
        /// <summary>
        /// addInstance: 新建在该流程索引下的实例
        /// </summary>
        /// <param name="alias">别名</param>
        /// <param name="owners">流程拥有者</param>
        /// <returns></returns>
        public string addInstance(string alias, string url, string note)
        {
            return addInstance(alias, url, ",", false, note);
        }
        #endregion

        #region addInstance: 新建在该流程索引下的实例
        /// <summary>
        /// addInstance: 新建在该流程索引下的实例
        /// </summary>
        /// <param name="alias">别名</param>
        /// <param name="owners">流程拥有者</param>
        /// <returns></returns>
        public string addInstance(string alias, string url)
        {
            return addInstance(alias, url, ",", false, "");
        }
        #endregion

        #region toHashJson: 把两行两列的数组转化成key:value形式的HashJson对象
        /// <summary>
        /// toHashJson: 把两行两列的数组转化成key:value形式的HashJson对象
        /// </summary>
        /// <param name="list">ArrayList对象</param>
        /// <returns></returns>
        private Json toHashJson(ArrayList list) {
            Json json = new Json();
            for (int i = 0, _len = list.Count; i < _len; i++) { 
                string [] _row = (string [])list[i];
                json[_row[0]] = _row[1];
            }
            return json;
        }
        #endregion

        #region getUpdateVal: 得到要更新的字段的value值
        /// <summary>
        /// getUpdateVal: 得到要更新的字段的value值
        /// </summary>
        /// <param name="_key">字段名, 比如nodename, pNode</param>
        /// <param name="_json">HashJson对象条件</param>
        /// <returns>返回更新value值</returns>
        private string getUpdateVal(string _key, Json _json) {
            string _origKey = _key;
            foreach (DictionaryEntry de in _json)
            {
                _key = "replace(" + _key + ",'"+de.Key.ToString()+"','"+de.Value.ToString()+"')";
            }
            return _origKey+"="+_key;
        }
        #endregion

        #region getIDs: 得到定义表中跟这条工作流索引关联的一批ID值
        /// <summary>
        /// getIDs: 得到定义表中跟这条工作流索引关联的一批ID值
        /// </summary>
        /// <param name="_json">HashJson对象</param>
        /// <returns></returns>
        private StringBuilder getIDs(Json _json)
        {
            StringBuilder _ids = new StringBuilder();
            foreach (DictionaryEntry de in _json)
            {
                _ids.Append(de.Value.ToString()+",");
            }
            if (_ids.Length > 0) { _ids.Remove(_ids.Length - 1, 1); }
            return _ids;
        }
        #endregion

        #region getStartNode: 得到开始节点(start node)
        /// <summary>
        /// 得到开始节点(start node)
        /// </summary>
        /// <returns>得到开始节点</returns>
        public Json getStartNode() {
            return api.getDBHelper().execJson("select * from {0} where oid={1} and type=10;", R.Table.WF_DEFINITION, indexID);
        }
        #endregion

        #region getNextNodes: 获得next节点数组(start node)
        /// <summary>
        /// getNextNodes: 获得next节点数组(start node)
        /// </summary>
        /// <param name="id">当前节点的id值</param>
        /// <returns></returns>
        public ArrayList getNextNodes(int id)
        {
            return api.getDBHelper().execJsonList("select * from {0} where oid={1} and charindex('{2}',pNode,2)<>0;", R.Table.WF_DEFINITION, indexID, id);
        }
        #endregion

        #region getPreNodes: 获得pre节点数组(start node)
        /// <summary>
        /// getPreNodes: 获得pre节点数组(start node)
        /// </summary>
        /// <param name="id">当前节点的id值</param>
        /// <returns></returns>
        public ArrayList getPreNodes(int id)
        {
            return api.getDBHelper().execJsonList("select * from {0} where oid={1} and charindex('{2}',nNode,2)<>0;", R.Table.WF_DEFINITION, indexID, id);
        }
        #endregion

        #region getEndNode: 得到结束节点(end node)
        public Json getEndNode()
        {
            return api.getDBHelper().execJson("select * from {0} where oid={1} and type=11;", R.Table.WF_DEFINITION, indexID);
        }
        #endregion

    }
}