using System;
using System.Collections.Generic;
using System.Web;
using System.Text;
using Fily.Data;
using Fily.Base;
using Fily.Util;
using Fily.WorkFlow;
using System.Collections;
using Fily.JSON;

namespace Fily.Depository
{
    public class ProjectTicket
    {
        private BaseApi api;
        public ProjectTicket(BaseApi _api) { api = _api; }

        #region 物资收料
        /// <summary>
        /// 物资收料
        /// </summary>
        /// <param name="tk_form">单据表单信息</param>
        /// <param name="MSInfos">物资具体信息</param>
        /// <returns></returns>
        public string receive(string tk_form, string MSInfos, int wfIdx) {
            string _return = String.Empty, _code = MConvert.getValue(tk_form, "code");
            string _wfId = (new WFIndex(wfIdx, api)).addInstance("施工工程收料单号:" + _code, "");
            SqlTrans trans = new SqlTrans(api);
            try
            {
                string[] _kv = MConvert.toKV(tk_form);
                string _users = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId)), _proId = MConvert.getValue(tk_form, "proId");
                string _newID = trans.addRow(R.Table.TK_WH_RECEIVE, _kv[0] + ",wfId,users,observers", _kv[1] + "," + _wfId + ",'" + _users + "','" + _users + "'");
                string[] infoAry = MSInfos.Split('^');
                for (int i = 0, _len = infoAry.Length; i < _len; i++) {
                    string[] _tKV = MConvert.toKV(infoAry[i]);
                    trans.execNonQuery(MString.getInsertStr(R.Table.TK_WH_RECEIVE_DETAIL, _tKV[0] + ", oid, proId", _tKV[1] + "," + _newID + "," + _proId));
                }
                _return = _newID;
                trans.commit();
            }
            catch (Exception e)
            {
                trans.rollback();
                _return = Native.getErrorMsg(e.Message);
            }
            finally {
                trans.close();
            }
            return _return;
        }
        #endregion

        #region 物资退料
        /// <summary>
        /// 物资退料
        /// </summary>
        /// <param name="tk_form">单据表单信息</param>
        /// <param name="MSInfos">物资具体信息</param>
        /// <returns></returns>
        public string back(string tk_form, string MSInfos, int wfIdx)
        {
            string _return = String.Empty, _code = MConvert.getValue(tk_form, "code"), _whId = MConvert.getValue(tk_form, "whId"), _proId = MConvert.getValue(tk_form, "proId");
            string _wfId = (new WFIndex(wfIdx, api)).addInstance("退料单号:" + _code, "");
            SqlTrans trans = new SqlTrans(api);
            try
            {
                string[] _kv = MConvert.toKV(tk_form);
                string _users = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                string _newID = trans.addRow(R.Table.TK_WH_BACK, _kv[0] + ",wfId,users,observers", _kv[1] + "," + _wfId + ",'" + _users + "','" + _users + "'");
                string[] infoAry = MSInfos.Split('^');
                for (int i = 0, _len = infoAry.Length; i < _len; i++)
                {
                    string _sInfo = infoAry[i], _pid = String.Empty, _msId = MConvert.getValue(_sInfo, "msId");
                    string[] _tKV = MConvert.toKV(_sInfo);
                    double _num = MConvert.getDouble(_sInfo, "number");
                    ArrayList _stocks = trans.execJsonList("select {0} from {1} where msId={2} and remainNum<>0 and batchId<>0 and proId={3} order by cTime desc, id desc;", "id,whId,batchId,batchCode,batchPrice,number,remainNum", R.Table.TK_WH_SEND_DETAIL, _msId, _proId);
                    for (int _n = 0; _n < _stocks.Count; _n++)
                    {
                        if (_num < 0 || _num == 0) { break; }
                        Json _stock = (Json)_stocks[_n];
                        double _realNum = 0, _price = _stock.getDouble("batchPrice");
                        string _k = String.Empty, _v = String.Empty, _batchId = "0", _batchCode = "", _newWhId = _whId, _sendId = _stock.getValue("id"), _sourceId = _stock.getValue("whId");
                        _num = _num - _stock.getDouble("remainNum");
                        if (Native.isEmpty(_newWhId) || _newWhId == "0") { _newWhId = _sourceId; _batchId = _stock.getValue("batchId"); _batchCode = _stock.getValue("batchCode"); }
                        if (_num > 0)
                        {
                            _realNum = _stock.getDouble("remainNum");
                            if (Native.isEmpty(_pid))
                            {
                                _k = "msId,sourceId,proId,whId,oid,planNum";
                                _v = _msId + "," + _sourceId + "," + _proId + "," + _newWhId + "," + _newID + "," + MConvert.getValue(_sInfo, "planNum");
                                _pid = trans.execScalar(MString.getInsertStr(R.Table.TK_WH_BACK_DETAIL, _k, _v, true));
                            }
                            _k = "sendId,msId,sourceId,proId,whId,oid,batchId,batchCode,price,number,sum";
                            _v = _sendId + "," + _msId + "," + _sourceId + "," + _proId + "," + _newWhId + "," + _newID + "," + _batchId + ",'" + _batchCode + "'," + _price + "," + _realNum + "," + _price * _realNum;
                            trans.addTreeNode(R.Table.TK_WH_BACK_DETAIL, Convert.ToInt16(_pid), _k, _v);
                            trans.execNonQuery("update " + R.Table.TK_WH_BACK_DETAIL + " set sum=sum+" + (_price * _realNum) + ", number=number+" + _realNum + " where id=" + _pid);

                        }
                        else
                        {
                            _realNum = _stock.getDouble("remainNum") + _num;
                            if (!Native.isEmpty(_pid))
                            {
                                _k = "sendId,msId,sourceId,proId,whId,oid,batchId,batchCode,price,number,sum";
                                _v = _sendId + "," + _msId + "," + _sourceId + "," + _proId + "," + _newWhId + "," + _newID + "," + _batchId + ",'" + _batchCode + "'," + _price + "," + _realNum + "," + _price * _realNum;
                                trans.addTreeNode(R.Table.TK_WH_BACK_DETAIL, Convert.ToInt16(_pid), _k, _v);
                                trans.execNonQuery("update " + R.Table.TK_WH_BACK_DETAIL + " set sum=sum+" + (_price * _realNum) + ", number=number+" + _realNum + " where id=" + _pid);
                            }
                            else
                            {
                                trans.addRow(R.Table.TK_WH_BACK_DETAIL, _tKV[0] + ",sendId,proId,whId,sourceId,oid,batchId,batchCode,price,sum,planSum", _tKV[1] + "," + _sendId + "," + _proId + "," + _newWhId + "," + _sourceId + "," + _newID + "," + _batchId + ",'" + _batchCode + "'," + _price + "," + (_realNum * _price) + "," + (MConvert.getDouble(_sInfo, "planNum") * _price));
                            }
                        }
                    }
                }
                _return = _newID;
                trans.commit();
            }
            catch (Exception e)
            {
                trans.rollback();
                _return = Native.getErrorMsg(e.Message);
            }
            finally
            {
                trans.close();
            }
            return _return;
        }
        #endregion

        //仓库流程执行完之后的回调
        #region 收料完成回调
        /// <summary>
        /// 收料完成回调
        /// </summary>
        /// <param name="_tkId">收料单据ID</param>
        /// <returns></returns>
        public string onReceiveComplete(string _tkId) {
            string _sql = String.Empty, _return = String.Empty;
            SqlTrans _trans = new SqlTrans(api);
            try
            {
                Json _rJson = _trans.execJson("select code,whId from {0} where id={1};", R.Table.TK_WH_RECEIVE, _tkId);
                string _code = _rJson.getValue("code");
                StringBuilder _noQuerySql = new StringBuilder();
                _noQuerySql.Append(MString.getUpdateStr(R.Table.TK_WH_RECEIVE, "state=" + R.WorkFlow.OVER, Convert.ToInt16(_tkId)));
                _noQuerySql.Append(MString.getUpdateStr(R.Table.TK_WH_RECEIVE_DETAIL, "state=1, receiveCode='" + _code + "'", "oid="+Convert.ToInt16(_tkId)));
                _trans.execNonQuery(_noQuerySql.ToString());
                _return = _tkId;
                _trans.commit();
            }
            catch (Exception e)
            {
                _return = Native.getErrorMsg(e.Message);
                _trans.rollback();
            }
            finally
            {
                _trans.close();
            }
            return _return;
        }
        #endregion

        #region 退料完成回调
        /// <summary>
        /// 退料完成回调
        /// </summary>
        /// <param name="_tkId">退料单据ID</param>
        /// <returns></returns>
        public string onBackComplete(string _tkId)
        {
            string _sql = String.Empty, _return = String.Empty;
            SqlTrans _trans = new SqlTrans(api);
            try
            {
                ArrayList _msInfos = _trans.execJsonList("select * from {0} where oid={1} and sendId<>0;", R.Table.TK_WH_BACK_DETAIL, _tkId);
                Json _rJson = _trans.execJson("select code,whId from {0} where id={1};", R.Table.TK_WH_BACK, _tkId);
                string _bCode = _rJson.getValue("code");
                StringBuilder _noQuerySql = new StringBuilder();
                for (int i = 0, _len = _msInfos.Count; i < _len; i++)
                {
                    Json _MS = (Json)_msInfos[i];
                    int _msID = _MS.getInt("msId"), _whId = _MS.getInt("whId"), _bId = _MS.getInt("batchId");
                    double _num = _MS.getDouble("number"), _price = _MS.getDouble("price"), _msCostCount = _MS.getDouble("sum");
                    if (_bId == 0)
                    {
                        string _keys = "type,batchCode,whId,msId,price,totalNum,remainNum";
                        string _values = "453,'" + _bCode + "'," + _whId + "," + _msID + "," + _price + "," + _num + "," + _num;
                        int _batchId = Convert.ToInt16(_trans.execScalar(MString.getInsertStr(R.Table.WH_MS_BATCH, _keys, _values, true)));
                        Json _TSTOCK = _trans.execJson("select id from {0} where whId={1} and msId={2};", "SYS_WH_STOCK", _whId, _msID);
                        if (_TSTOCK == null)
                        {
                            _trans.execNonQuery(MString.getInsertStr(R.Table.WH_MS_STOCK, "whId,msId,totalSum,number", _whId + "," + _msID + "," + _msCostCount + "," + _num));
                        }
                        else
                        {
                            _trans.execNonQuery(MString.getUpdateStr(R.Table.WH_MS_STOCK, "number=number+" + _num + ",totalSum=totalSum+" + _msCostCount, "whId=" + _whId + " and msId=" + _msID));
                        }
                        Json _rd = _trans.execJson("select number,totalSum from {0} where whId={1} and msId={2};", R.Table.WH_MS_STOCK, _whId, _msID);
                        _noQuerySql.Append("update " + R.Table.TK_WH_BACK_DETAIL + " set mTime=getdate(), batchId=" + _batchId + ", batchCode='" + _bCode + "', totalCount=" + _rd.getDouble("number") + ", balance=" + _rd.getDouble("totalSum") + "  where id=" + _MS.getInt("id") + ";");
                        _noQuerySql.Append(MString.getUpdateStr(R.Table.WH_MS, "avgPrice=(select cast((sum(totalSum)+" + _msCostCount + ")/(sum(number)+" + _num + ") as numeric(18,2)) from " + R.Table.WH_MS_STOCK + " where msId=" + _msID + "), price=" + _price, _msID));
                    }
                    else
                    {
                        _trans.execNonQuery(MString.getUpdateStr(R.Table.WH_MS_BATCH, "remainNum=remainNum+" + _MS.getDouble("number"), _bId));
                        _trans.execNonQuery(MString.getUpdateStr(R.Table.WH_MS_STOCK, "number=number+" + _num + ",totalSum=totalSum+" + _msCostCount, "whId=" + _whId + " and msId=" + _msID));
                        Json _rd = _trans.execJson("select number,totalSum from {0} where whId={1} and msId={2};", R.Table.WH_MS_STOCK, _whId, _msID);
                        _noQuerySql.Append(MString.getUpdateStr(R.Table.TK_WH_BACK_DETAIL, "totalCount=" + _rd.getDouble("number") + ", balance=" + _rd.getDouble("totalSum"), "id=" + _MS.getInt("id")));
                        _noQuerySql.Append(MString.getUpdateStr(R.Table.WH_MS, "avgPrice=(select cast((sum(totalSum)+" + _msCostCount + ")/(sum(number)+" + _num + ") as numeric(18,2)) from " + R.Table.WH_MS_STOCK + " where msId=" + _msID + "), price=" + _price, _msID));
                    }
                    _noQuerySql.Append(MString.getUpdateStr(R.Table.TK_WH_SEND_DETAIL, "remainNum=remainNum-" + _num, _MS.getInt("sendId")));
                }
                _noQuerySql.Append(MString.getUpdateStr(R.Table.TK_WH_BACK, "state=" + R.WorkFlow.OVER, Convert.ToInt16(_tkId)));
                _trans.execNonQuery(_noQuerySql.ToString());
                _return = _tkId;
                _trans.commit();
            }
            catch (Exception e)
            {
                _return = Native.getErrorMsg(e.Message);
                _trans.rollback();
            }
            finally
            {
                _trans.close();
            }
            return _return;
        }
        #endregion

    }
}