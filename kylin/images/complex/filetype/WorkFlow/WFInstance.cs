using System;
using System.Text;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using Fily.Data;
using Fily.Base;
using Fily.JSON;
using Fily.Util;

namespace Fily.WorkFlow
{
    /// <summary>
    /// 工作流实例对象
    /// </summary>
    public class WFInstance
    {
        #region 私有变量的定义
        public const int T_START = 10;      //开始节点     //"T_"前缀表示type类型值
        public const int T_END = 11;        //结束节点
        public const int T_NORMAL = 12;     //普通节点
        public const int T_PARALLEL = 13;   //并行节点
        public const int T_AUTO = 14;       //自动节点
        public const int T_CANCLE = 15;     //取消节点
        public const int T_SUB_PROCESS = 20;     //子流程节点
        private int ID;
        private BaseApi api;
        private WFIndex wfIndex;
        private WFRuler ruler = new WFRuler();
        private const char SCHAR = '※';
        private const int S_NORMAL = 0;  //"S_"前缀表示state值
        private const int S_GOING = 1;
        private const int S_CANCLED = -5;
        private const int S_ENDED = -1;
        private const int S_P_NORMAL = 100;    //"S_P_"前缀表示流程中并行节点的状态值(state)
        private const int S_P_PASS = 101;
        private const int S_P_DENY = 201;
        #endregion

        #region 构造函数
        public WFInstance(BaseApi _api) { api = _api; }
        public WFInstance(BaseApi _api, int _ID, int _indexID) { api = _api; init(_ID, _indexID); }
        #endregion

        #region 私有变量的set, get方法
        public int getID() { return ID; }
        public WFIndex getWFIndex() { return wfIndex; }
        #endregion

        #region init: 初始化工作流实例
        public void init(int _ID, int _indexID) {
            ID = _ID;
            wfIndex = new WFIndex(_indexID, api);
        }
        #endregion

        #region start: 启动流程
        /// <summary>
        /// start: 启动流程
        /// </summary>
        /// <param name="wfID">流程实例ID值</param>
        /// <param name="jsonStr">json字符串</param>
        /// <param name="ext">扩展信息</param>
        /// <returns></returns>
        public string start(int wfID, string jsonStr, string ext = "")
        {
            SqlTrans trans = new SqlTrans(api);
            string _return = String.Empty;
            try
            {
                Json _sNode = trans.execJson(MString.getSelectStr(R.Table.WF_INSTANCE, "oid,state", "id="+wfID));
                if (_sNode.getInt("state") == 0)
                {
                    Json _fNode = trans.execJson(MString.getSelectStr(R.Table.WF_DEFINITION, "*", "oid=" + _sNode.getValue("oid") + ", type=10"));
                    string _kt = "oid,definedNodeID,nodeName,next,pre,state,type,owner,ext";
                    string _owners = trans.getAllUsers(_fNode.getValue("users"), _fNode.getValue("roles"));
                    string _vt = _fNode.getValue("oid") + "," + _fNode.getValue("id") + ",'" + _fNode.getValue("nodeName") + "','" + _fNode.getValue("next") + "',0,1,10,'" + _owners + "','" + ext + "'";
                    string[] _js = MConvert.toKV(jsonStr);
                    if (!Native.isEmpty(_js[0])) { _kt += "," + _js[0]; _vt += "," + _js[1]; }
                    _return = trans.addTreeNode(R.Table.WF_INSTANCE, wfID, _kt, _vt);
                }
                else {
                    _return = Native.getErrorMsg("流程已经结束或取消!");
                }
                trans.commit();
            }
            catch (Exception ex)
            {
                _return = Native.getErrorMsg(ex.Message + "--WFInstance--start");
                trans.rollback();
            }
            finally
            {
                trans.close();
            }
            return _return;
        }
        #endregion

        #region cancle: 取消(关闭)流程   取消或关闭流程状态是： -5
        public string cancle(int wfID, string jsonStr, string ext = "")
        {
            SqlTrans trans = new SqlTrans(api);
            string _return = String.Empty;
            try
            {
                Json _sNode = trans.execJson(MString.getSelectStr(R.Table.WF_INSTANCE, "oid,state", "id=" + wfID));
                if (_sNode.getInt("state") == S_NORMAL)
                {
                    trans.execNonQuery(MString.getUpdateStr(R.Table.WF_INSTANCE, "state=" + S_CANCLED, wfID));
                }
                else
                {
                    _return = Native.getErrorMsg("流程已经结束或取消!");
                }
                trans.commit();
            }
            catch (Exception e)
            {
                _return = Native.getErrorMsg(e.Message + "--WFInstance--cancle");
                trans.rollback();
            }
            finally {
                trans.close();
            }
            return _return;
        }
        #endregion

        #region reStart: 重新启动流程
        public string reStart(int wfID, string jsonStr, string ext = "")
        {
            SqlTrans trans = new SqlTrans(api);
            string _return = String.Empty;
            try
            {
                Json _sNode = trans.execJson(MString.getSelectStr(R.Table.WF_INSTANCE, "oid,state", "id=" + wfID));
                if (_sNode.getInt("state") == S_CANCLED)
                {
                    trans.execNonQuery(MString.getUpdateStr(R.Table.WF_INSTANCE, "state=" + S_NORMAL, wfID));
                }
                else
                {
                    _return = Native.getErrorMsg("流程重启失败!");
                }
                trans.commit();
            }
            catch (Exception e)
            {
                _return = Native.getErrorMsg(e.Message + "--WFInstance--reStart");
                trans.rollback();
            }
            finally
            {
                trans.close();
            }
            return _return;
        }
        #endregion

        #region next: 下一步操作
        public string next(int currID, int nextID, string jsonStr, string ext = "")
        {
            string _return = String.Empty;
            int _type = Convert.ToInt16(api.execScalar("select type from {0} where id={1};", R.Table.WF_INSTANCE, currID));
            switch (_type)
            {
                case T_END:
                    _return = Native.getErrorMsg("流程已经结束");
                    break;
                case T_CANCLE:
                    _return = Native.getErrorMsg("流程已经被取消");
                    break;
                case T_PARALLEL:
                    _return = nextPARALLEL(currID, nextID, jsonStr, ext);
                    break;
                case T_START:
                case T_NORMAL:
                    _return = nextNORMAL(currID, nextID, jsonStr, ext);
                    break;
                case T_AUTO:
                    _return = nextAUTO(currID, nextID, jsonStr, ext);
                    break;
                case T_SUB_PROCESS:
                    _return = nextSUBPROCESS(currID, nextID, jsonStr, ext);
                    break;
            }
            return _return;
        }
        #endregion

        #region nextSUBPROCESS: 子流程节点的下一步扭转
        /// <summary>
        /// nextSUBPROCESS: 子流程节点的下一步扭转
        /// </summary>
        /// <param name="currID"></param>
        /// <param name="nextID"></param>
        /// <param name="jsonStr"></param>
        /// <param name="ext"></param>
        /// <returns></returns>
        private string nextSUBPROCESS(int currID, int nextID, string jsonStr, string ext = "")
        {
            string _return = String.Empty;
            SqlTrans trans = new SqlTrans(api);
            bool _ifNext = false;
            try
            {
                string _count = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "count(*)", "pid=" + currID + " and state<>-1"));
                if (_count == "0") { _ifNext = true; }
                trans.commit();
            }
            catch (Exception e)
            {
                _return = Native.getErrorMsg(e.Message + "--WFInstance--nextSUBPROCESS");
                trans.rollback();
            }
            finally
            {
                trans.close();
            }
            if (_ifNext) { _return = nextNORMAL(currID, nextID, jsonStr, ext); }
            return _return;
        }
        #endregion

        #region denyPARALLEL: 某个并行节点发生拒绝操作
        /// <summary>
        /// nextPARALLEL: 并行节点的下一步扭转
        /// </summary>
        /// <param name="currID"></param>
        /// <param name="nextID"></param>
        /// <param name="jsonStr"></param>
        /// <param name="ext"></param>
        /// <returns></returns>
        public string denyPARALLEL(int currID, int nextID, string jsonStr, string ext = "")
        {
            string _return = String.Empty;
            SqlTrans trans = new SqlTrans(api);
            bool _ifNext = false;
            try
            {
                string _pkv = "state=" + S_P_DENY, _ekv = MConvert.toUpdateSql(jsonStr);
                if (!Native.isEmpty(_ekv)) { _pkv += "," + _ekv; }
                int _ifSucc = trans.execNonQuery(MString.getUpdateStr(R.Table.WF_INSTANCE, _pkv, "pid=" + currID + " and nodeName='" + MSession.get(MSession.getClientKey()) + "'"));
                string _count = trans.execScalar("select count(*) from {0} where pid={1} and state=" + S_P_NORMAL + ";", R.Table.WF_INSTANCE, currID);
                if (_count == "0") { _ifNext = true; }
                api.setDataType("json");
                _return = trans.execReader(MString.getSelectStr(R.Table.WF_INSTANCE, "*", Convert.ToInt16(currID)));
                api.setDataType("html");
                trans.commit();
            }
            catch (Exception e)
            {
                _return = Native.getErrorMsg(e.Message + "--WFInstance--nextPARALLEL");
                trans.rollback();
            }
            finally
            {
                trans.close();
            }
            if (_ifNext) { _return = nextNORMAL(currID, nextID, "", ""); }
            return _return;
        }
        #endregion

        #region nextPARALLEL: 并行节点的下一步扭转
        /// <summary>
        /// nextPARALLEL: 并行节点的下一步扭转
        /// </summary>
        /// <param name="currID"></param>
        /// <param name="nextID"></param>
        /// <param name="jsonStr"></param>
        /// <param name="ext"></param>
        /// <returns></returns>
        private string nextPARALLEL(int currID, int nextID, string jsonStr, string ext = "")
        {
            string _return = String.Empty;
            SqlTrans trans = new SqlTrans(api); 
            bool _ifNext = false;
            try
            {
                string _pkv = "state="+S_P_PASS, _ekv = MConvert.toUpdateSql(jsonStr);
                if (!Native.isEmpty(_ekv)) { _pkv += "," + _ekv; }
                int _ifSucc = trans.execNonQuery(MString.getUpdateStr(R.Table.WF_INSTANCE, _pkv, "pid=" + currID + " and dbo.SYS_TRANS_CONFIRM_USERS(nodeName,'" + MSession.get(MSession.getClientKey()) + "')<>0"));
                string _count = trans.execScalar("select count(*) from {0} where pid={1} and state=" + S_P_NORMAL + ";", R.Table.WF_INSTANCE, currID);
                if (_count=="0") { _ifNext = true; }
                api.setDataType("json");
                _return = trans.execReader(MString.getSelectStr(R.Table.WF_INSTANCE, "*", Convert.ToInt16(currID)));
                api.setDataType("html");
                trans.commit();
            }
            catch (Exception e)
            {
                _return = Native.getErrorMsg(e.Message + "--WFInstance--nextPARALLEL");
                trans.rollback();
            }
            finally
            {
                trans.close();
            }
            if (_ifNext) { _return = nextNORMAL(currID, nextID, "", ""); }
            return _return;
        }
        #endregion

        #region nextAUTO: 并行节点的下一步扭转
        /// <summary>
        /// nextPARALLEL: 并行节点的下一步扭转
        /// </summary>
        /// <param name="currID"></param>
        /// <param name="nextID"></param>
        /// <param name="jsonStr"></param>
        /// <param name="ext"></param>
        /// <returns></returns>
        private string nextAUTO(int currID, int nextID, string jsonStr, string ext = "")
        {
            string _return = String.Empty;
            SqlTrans trans = new SqlTrans(api);
            bool _ifNext = false;
            try
            {
                string _pkv = "state=" + S_P_PASS, _ekv = MConvert.toUpdateSql(jsonStr);
                if (!Native.isEmpty(_ekv)) { _pkv += "," + _ekv; }
                int _ifSucc = trans.execNonQuery(MString.getUpdateStr(R.Table.WF_INSTANCE, _pkv, "pid=" + currID + " and dbo.SYS_TRANS_CONFIRM_USERS(nodeName,'" + MSession.get(MSession.getClientKey()) + "')<>0"));
                string _count = trans.execScalar("select count(*) from {0} where pid={1} and state=" + S_P_NORMAL + ";", R.Table.WF_INSTANCE, currID);
                if (_count == "0") { _ifNext = true; }
                api.setDataType("json");
                _return = trans.execReader(MString.getSelectStr(R.Table.WF_INSTANCE, "*", Convert.ToInt16(currID)));
                api.setDataType("html");
                trans.commit();
            }
            catch (Exception e)
            {
                _return = Native.getErrorMsg(e.Message + "--WFInstance--nextAUTO");
                trans.rollback();
            }
            finally
            {
                trans.close();
            }
            if (_ifNext) { _return = nextNORMAL(currID, nextID, "", ""); }
            return _return;
        }
        #endregion

        #region nextNORMAL: 正常节点的下一步扭转
        /// <summary>
        /// nextNORMAL: 正常节点的下一步扭转
        /// </summary>
        /// <param name="currID">当前节点</param>
        /// <param name="nextID">下个节点</param>
        /// <param name="jsonStr">提交的json字符串</param>
        /// <param name="ext">扩展信息</param>
        /// <returns></returns>
        private string nextNORMAL(int currID, int nextID, string jsonStr, string ext = "")
        {
            string _return = String.Empty, _nextOwners = String.Empty;
            SqlTrans trans = new SqlTrans(api);
            string[] _onEndResult = new string[]{};
            int _newNextID = 0;
            Json _cNode = null, _nNode = null, _parentNode = null;
            try
            {
                _cNode = trans.execJson("select pid, definedNodeID, owner, cPerson from {0} where id={1};", R.Table.WF_INSTANCE, currID);
                _nNode = trans.execJson("select * from {0} where id={1};", R.Table.WF_DEFINITION, nextID);
                _parentNode = trans.execJson("select * from {0} where id={1};", R.Table.WF_INSTANCE, _cNode.getValue("pid"));
                switch (_nNode.getInt("logicState")) { 
                    case 0:
                        _nextOwners = trans.getAllUsers(_nNode.getValue("users"), _nNode.getValue("roles"));
                        break;
                    case 1:
                    case 2:
                        //_nextOwners = trans.getAllUsers(MConvert.removeKey(ref jsonStr, "users"), MConvert.removeKey(ref jsonStr, "roles"));
                        _nextOwners = getParallerUsers(trans, MConvert.removeKey(ref jsonStr, "users"), MConvert.removeKey(ref jsonStr, "roles"), _nNode.getInt("logicState"), _parentNode);
                        break;
                    case 3:
                        _nextOwners = "," + trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "cPerson", "id=" + _cNode.getValue("pid"))) + ",";
                        break;
                    case 4:
                        _nextOwners = _cNode.getValue("owner"); 
                        break;
                    case 5:
                        _nextOwners = getAllStepUsers(trans, _cNode.getInt("pid"));
                        break;
                    case 6:
                        _nextOwners = "," + trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "cPerson", "id=" + _cNode.getInt("pid"))) + ",";
                        break;
                    case 7:
                        _nextOwners = trans.getDeptOwners(trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "cPerson", "id=" + _cNode.getInt("pid")))); 
                        break;
                    case 10:  //自动节点
                        string[] _nextids = trans.execScalar(MString.getSelectStr(R.Table.WF_DEFINITION, "next", nextID)).Split(',');
                        if (_nextids.Length == 3 && !Native.isEmpty(_nextids[1]))
                        {
                            _newNextID = Convert.ToInt16(_nextids[1]);
                        }
                        else {
                            trans.commit();
                            trans.close();
                            return Native.getErrorMsg("自动进行扭转到下个节点时, 当前节点的next不唯一或为空, 请先确认!"); 
                        }
                        break;
                }
                trans.execNonQuery(MString.getUpdateStr(R.Table.WF_INSTANCE, MConvert.toUpdateSql(jsonStr), currID));
                string _nk = "oid,definedNodeID,nodeName,next,pre,ext,type,state,users,roles,owner";
                string _nv = _nNode.getValue("oid") + "," + _nNode.getValue("id") + ",'" + _nNode.getValue("nodeName") + "','" + _nNode.getValue("next") + "'," + currID + ",'" + ext + "'," + _nNode.getValue("type") + ",1,'" + _nNode.getValue("users") + "','" + _nNode.getValue("roles") + "','" + _nextOwners+"'";
                string _newID = trans.addTreeNode(R.Table.WF_INSTANCE, _cNode.getInt("pid"), _nk, _nv);
                trans.execNonQuery(MString.getUpdateStr(R.Table.WF_INSTANCE, "state=0, next='" + _newID + "'", currID));
                switch (_nNode.getInt("type")){
                    case T_PARALLEL:
                        string _nOwners = getParallerUsers(trans, _nNode.getValue("users"), _nNode.getValue("roles"), _nNode.getInt("logicState"), _parentNode);
                        if (_nOwners.Length > 2 && _nNode.getInt("logicState") != 1 && _nNode.getInt("logicState") != 2) { _nextOwners = _nOwners; }
                        trans.execNonQuery(MString.getUpdateStr(R.Table.WF_INSTANCE, "owner=dbo.SYS_TRANS_RIGHTS_USERS('" + _nextOwners + "')", Convert.ToInt16(_newID)));
                        string[] _users = _nextOwners.Split(',');
                        for (int _u = 0, _uLen = _users.Length; _u < _uLen; _u++)
                        {
                            string _uid = _users[_u];
                            if (!Native.isEmpty(_uid)) 
                            {
                                trans.addTreeNode(R.Table.WF_INSTANCE, Convert.ToInt16(_newID), "state,nodeName,owner,users", S_P_NORMAL + ",'" + _uid + "','," + _uid + ",','," + _uid + ",'");
                            }
                        }
                        trans.execNonQuery(MString.getUpdateStr(R.Table.WF_INSTANCE, "users='" + _nextOwners + "'", Convert.ToInt16(_newID)));
                        break;
                    case T_SUB_PROCESS:
                        string[] subIds = _nNode.getValue("subProcessIdxIds").Split(',');
                        for (int _u = 0, _uLen = subIds.Length; _u < _uLen; _u++)
                        {
                            string _sid = subIds[_u];
                            if (!Native.isEmpty(_sid)) { addSubProcess(trans, Convert.ToInt16(_newID), Convert.ToInt16(_sid)); }
                        }
                        break;
                    case T_END:
                        int _pid = _cNode.getInt("pid");
                        trans.execNonQuery(MString.getUpdateStr(R.Table.WF_INSTANCE, "state=" + S_ENDED, _pid));
                        _onEndResult = onProcessEnd(trans, _pid);
                        break;
                }
                trans.execNonQuery(MString.getUpdateStr(R.Table.WF_INSTANCE, "owner=dbo.SYS_TRANS_RIGHTS_USERS('" + _nextOwners + "')", _cNode.getInt("pid")));
                api.setDataType("json");
                _return = trans.execReader(MString.getSelectStr(R.Table.WF_INSTANCE, "*, dbo.SYS_TRANS_USERS(users) as t_users", Convert.ToInt16(_newID)));
                api.setDataType("html");
                trans.commit();
            }
            catch (Exception e)
            {
                _return = Native.getErrorMsg(e.Message + "--WFInstance--nextNORMAL");
                trans.rollback();
            }
            finally
            {
                trans.close();
            }
            if (_cNode != null && _nNode != null) { WFRuler.runNext(_cNode.getInt("definedNodeID"), _nNode.getInt("id"), _cNode.getValue("owner"), _nextOwners); }
            if (_newNextID != 0) { return next(nextID, _newNextID, jsonStr, "节点[" + nextID + "]---->[" + _newNextID + "]自动扭转"); }
            if (_onEndResult.Length > 0) { return nextNORMAL(Convert.ToInt16(_onEndResult[0]), Convert.ToInt16(_onEndResult[1]), "子流程结束时主动触发主流程向下扭转", ""); }
            return _return;
        }
        #endregion

        #region getAllStepUsers: 获取该流程节点的所有参与者
        public string getAllStepUsers(SqlTrans trans, int wfId)
        {
            Hashtable _table = new Hashtable();
            string[] _idsTAry, _idsAry = trans.execReader(MString.getSelectStr("SYS_WF_INSTANCE", "owner", "pid="+wfId)).Split(trans.getBaseApi().getRSplit().ToCharArray());
            string _val = ",", _key;
            for (int i = 0; i < _idsAry.Length; i++)
            {
                _idsTAry = _idsAry[i].Split(',');
                for (int j = 0; j < _idsTAry.Length; j++)
                {
                    _key = _idsTAry[j];
                    if (!Native.isEmpty(_key) && !_table.ContainsKey(_key)) { _table.Add(_key, true); }
                }
            }
            ArrayList akeys = new ArrayList(_table.Keys);
            akeys.Sort();
            for (int i = 0; i < akeys.Count; i++) { _val += akeys[i] + ","; }
            return _val;
        }
        #endregion

        #region getParallerUsers: 获取并行节点参与人
        public string getParallerUsers(SqlTrans trans, string _users, string _roles, int logicState, Json wf)
        {
            Hashtable _table = new Hashtable();
            if (logicState == 5) { _roles += trans.execScalar(MString.getSelectStr("SYS_CM_USER", "department", wf.getInt("cPerson")))+","; }
            string _val = ",", _key;
            string[] _idsTAry, _uTAry = _users.Split(',');
            _roles = _roles.Replace(",,",",");
            int _rLen = _roles.Length;
            if (_rLen > 2)
            {
                _roles = _roles.Substring(1, _rLen - 2);
                string[] _idsAry = trans.execReader(MString.getSelectStr("SYS_CM_ROLE", "link", "id in (" + _roles + ")")).Split(trans.getBaseApi().getRSplit().ToCharArray());
                for (int i = 0; i < _idsAry.Length; i++)
                {
                    _idsTAry = _idsAry[i].Split(',');
                    for (int j = 0; j < _idsTAry.Length; j++)
                    {
                        _key = _idsTAry[j];
                        if (!Native.isEmpty(_key) && !_table.ContainsKey(_key)) { _table.Add(_key, true); }
                    }
                }
            }
            for (int j = 0; j < _uTAry.Length; j++)
            {
                _key = _uTAry[j];
                if (!Native.isEmpty(_key) && !_table.ContainsKey(_key)) { _table.Add(_key, true); }
            }
            ArrayList akeys = new ArrayList(_table.Keys);
            akeys.Sort();
            for (int i = 0; i < akeys.Count; i++) { _val += akeys[i] + ","; }
            return _val;
        }
        #endregion

        #region onProcessEnd: 当流程结束时所触发的事件
        /// <summary>
        /// onProcessEnd: 当流程结束时所触发的事件
        /// </summary>
        /// <param name="trans">SQL事务对象</param>
        /// <param name="pid">子流程根节点ID</param>
        /// <returns></returns>
        private string [] onProcessEnd(SqlTrans trans, int pid)
        {
            string [] _return = new string[] {};
            string _rootID = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "pid", "id=" + pid + " and state=" + S_ENDED));
            if (!Native.isEmpty(_rootID)&&_rootID!="0")
            {
                string _count = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "count(*)", "pid=" + _rootID + " and state<>" + S_ENDED));
                if (_count=="0"){
                    string[] _nexts = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "next", "id=" + _rootID)).Split(',');
                    if (_nexts.Length == 3) { _return =  new string[] {_rootID, _nexts[1]}; }
                }
            }
            return _return;
        }
        #endregion

        #region addSubProcess: 添加子流程
        /// <summary>
        /// addSubProcess: 添加子流程
        /// </summary>
        /// <param name="trans">SQL事务对象</param>
        /// <param name="cNode">子流程节点对象</param>
        /// <param name="idxID">子流程关联的索引ID值</param>
        /// <returns></returns>
        private string addSubProcess(SqlTrans trans, int currID, int idxID)
        {
            string _return = String.Empty;
            Json json = trans.execJson("select id,oid,nodeName,type,next,users,roles from {0} where oid={1} and type=" + T_START + ";", R.Table.WF_DEFINITION, idxID);
            if (json == null)
            {
                _return = Native.getErrorMsg("在索引ID为{0}中未找到开始节点, 请核实!", idxID);
            }
            else
            {
                string _k = "oid,nodeName";
                string _v = json.getValue("oid") + ",'子流程:" + currID + "'";
                int _rootID = Convert.ToInt16(trans.addTreeNode(R.Table.WF_INSTANCE, currID, _k, _v));
                string _kt = "oid,definedNodeID,nodeName,next,pre,state,type,owner";
                string _owners = trans.getAllUsers(json.getValue("users"), json.getValue("roles"));
                string _vt = json.getValue("oid") + "," + json.getValue("id") + ",'" + json.getValue("nodeName") + "','" + json.getValue("next") + "',0," + S_GOING + "," + T_START + ",'" + _owners + "'";
                _return = trans.addTreeNode(R.Table.WF_INSTANCE, _rootID, _kt, _vt);
                //WFRuler.runNext();
            }
            return _return;
        }
        #endregion

        #region getCurrStateNode: 得到当前状态的节点
        /// <summary>
        /// getCurrStateNode: 得到当前状态的节点
        /// </summary>
        /// <param name="_keyFields">字段</param>
        /// <returns></returns>
        public string getCurrStateNode(string _keyFields)
        {
            return api.execQuery("select {0} from {1} where state=1 and appId={2} and oid={3};", _keyFields, R.Table.WF_INSTANCE, ID, wfIndex.getIndexID());
        }
        #endregion

        #region getCurrStateID: 得到当前状态的节点的ID
        /// <summary>
        /// getCurrStateID: 得到当前状态的节点， 默认字段是id
        /// </summary>
        /// <returns></returns>
        public int getCurrStateID()
        {
            return Convert.ToInt16(getCurrStateNode("id"));
        }
        #endregion
    }
}