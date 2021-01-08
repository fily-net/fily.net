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
    public class Ticket
    {
        private BaseApi api;
        public Ticket(BaseApi _api) { api = _api; }

        #region 物资收料
        /// <summary>
        /// 物资收料
        /// </summary>
        /// <param name="tk_form">单据表单信息</param>
        /// <param name="MSInfos">物资具体信息</param>
        /// <returns></returns>
        public string receive(string tk_form, string MSInfos, int wfIdx) {
            string _return = String.Empty, _code = MConvert.getValue(tk_form, "code");
            string _wfId = (new WFIndex(wfIdx, api)).addInstance("收料单号:" + _code, "");
            SqlTrans trans = new SqlTrans(api);
            try
            {
                string[] _kv = MConvert.toKV(tk_form);
                string _users = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId)), _whId = MConvert.getValue(tk_form, "whId");
                string _newID = trans.addRow(R.Table.TK_WH_RECEIVE, _kv[0] + ",wfId,users,observers", _kv[1] + "," + _wfId + ",'" + _users + "','" + _users + "'");
                string[] infoAry = MSInfos.Split('^');
                for (int i = 0, _len = infoAry.Length; i < _len; i++) {
                    string[] _tKV = MConvert.toKV(infoAry[i]);
                    trans.execNonQuery(MString.getInsertStr(R.Table.TK_WH_RECEIVE_DETAIL, _tKV[0] + ",oid,whId", _tKV[1] + "," + _newID + "," + _whId));
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

        #region 物资领料
        /// <summary>
        /// 物资领料
        /// </summary>
        /// <param name="tk_form">单据表单信息</param>
        /// <param name="MSInfos">物资具体信息</param>
        /// <returns></returns>
        public string send(string tk_form, string MSInfos, int wfIdx)
        {
            string _return = String.Empty, _code = MConvert.getValue(tk_form, "code"), _proId = MConvert.getValue(tk_form, "proId");
            string _wfId = (new WFIndex(wfIdx, api)).addInstance("领料单号:" + _code, "");
            SqlTrans trans = new SqlTrans(api);
            try
            {
                string[] _kv = MConvert.toKV(tk_form);
                string _users = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                string _newID = trans.addRow(R.Table.TK_WH_SEND, _kv[0] + ",wfId,users,observers", _kv[1] + "," + _wfId + ",'" + _users + "','" + _users + "'");
                string[] infoAry = MSInfos.Split('^');
                for (int i = 0, _len = infoAry.Length; i < _len; i++)
                {
                    string _sInfo = infoAry[i];
                    string[] _tKV = MConvert.toKV(_sInfo);
                    int _total = MConvert.getInt(_sInfo, "number"), _planTotal = MConvert.getInt(_sInfo, "planNum"), _currTotal = 0, _rTotal = 0, _fixTotal = _total;
                    string _sql = "select {0} from {1} where msId={2} and whId={3} and remainNum<>0 order by cTime asc;", _pid = String.Empty, _whId = MConvert.getValue(tk_form, "whId");
                    ArrayList _batchs = trans.execJsonList(_sql, "id,batchCode,price,totalNum,remainNum", R.Table.WH_MS_BATCH, MConvert.getInt(_sInfo, "msId"), Convert.ToInt16(_whId));
                    for (int bi = 0; bi < _batchs.Count; bi++)
                    {
                        Json _batch = (Json)_batchs[bi];
                        int _remain = _batch.getInt("remainNum");
                        _currTotal += _remain;
                        string _k = String.Empty, _v = String.Empty;
                        _rTotal = _total - _remain;
                        if (_rTotal > 0)
                        {
                            _total = _rTotal;
                            if (Native.isEmpty(_pid))
                            {
                                _k = _tKV[0] + ",proId,whId,oid,batchTotal,batchRemain,sum";
                                _v = _tKV[1] + "," + _proId + "," + _whId + "," + _newID + "," + _batch.getValue("totalNum") + "," + _batch.getValue("remainNum") + "," + _batch.getDouble("price") * _remain;
                                _pid = trans.execScalar(MString.getInsertStr(R.Table.TK_WH_SEND_DETAIL, _k, _v, true));
                            }
                            _k = "proId,whId,oid,msId,batchId,batchCode,batchPrice,batchTotal,batchRemain,number,sum";
                            _v = _proId + "," + _whId + "," + _newID + "," + MConvert.getValue(_sInfo, "msId") + "," + _batch.getValue("id") + ",'" + _batch.getValue("batchCode") + "'," + _batch.getValue("price") + "," + _batch.getValue("totalNum") + "," + _batch.getValue("remainNum") + "," + _remain + "," + _batch.getDouble("price") * _remain;
                            trans.addTreeNode(R.Table.TK_WH_SEND_DETAIL, Convert.ToInt16(_pid), _k, _v);
                        }
                        else
                        {
                            if (!Native.isEmpty(_pid))
                            {
                                _k = "proId,whId,oid,msId,batchId,batchCode,batchPrice,batchTotal,batchRemain,number,sum";
                                _v = _proId + "," + _whId + "," + _newID + "," + MConvert.getValue(_sInfo, "msId") + "," + _batch.getValue("id") + ",'" + _batch.getValue("batchCode") + "'," + _batch.getValue("price") + "," + _batch.getValue("totalNum") + "," + _batch.getValue("remainNum") + "," + _total + "," + _batch.getDouble("price") * _total;
                                trans.addTreeNode(R.Table.TK_WH_SEND_DETAIL, Convert.ToInt16(_pid), _k, _v);
                                trans.execNonQuery("update " + R.Table.TK_WH_SEND_DETAIL + " set sum=sum+" + (_batch.getDouble("price") * _total) + ", batchTotal=batchTotal+" + _batch.getValue("totalNum") + ", batchRemain=batchRemain+" + _batch.getValue("remainNum") + " where id=" + _pid);
                            }
                            else
                            {
                                _k = _tKV[0] + ",proId,whId,oid,batchId,batchCode,batchPrice,batchTotal,batchRemain,sum,planSum";
                                _v = _tKV[1] + "," + _proId + "," + _whId + "," + _newID + "," + _batch.getValue("id") + ",'" + _batch.getValue("batchCode") + "'," + _batch.getValue("price") + "," + _batch.getValue("totalNum") + "," + _batch.getValue("remainNum") + "," + _batch.getDouble("price") * _total + "," + _batch.getDouble("price") * _planTotal;
                                _pid = trans.execScalar(MString.getInsertStr(R.Table.TK_WH_SEND_DETAIL, _k, _v, true));
                            }
                        }
                        if (_currTotal > _fixTotal || _currTotal == _fixTotal) { break; }
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

        #region 物资调拨
        /// <summary>
        /// 物资调拨
        /// </summary>
        /// <param name="tk_form">单据表单信息</param>
        /// <param name="MSInfos">物资具体信息</param>
        /// <returns></returns>
        public string allocate(string tk_form, string MSInfos, int wfIdx)
        {
            string _return = String.Empty, _code = MConvert.getValue(tk_form, "code"), _toId = MConvert.getValue(tk_form, "whId"), _fromId = MConvert.getValue(tk_form, "sourceId");
            string _wfId = (new WFIndex(wfIdx, api)).addInstance("调拨单号:" + _code, "");
            SqlTrans trans = new SqlTrans(api);
            try
            {
                string[] _kv = MConvert.toKV(tk_form);
                string _users = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                string _newID = trans.addRow(R.Table.TK_WH_ALLOCATE, _kv[0] + ",wfId,users,observers", _kv[1] + "," + _wfId + ",'" + _users + "','" + _users + "'");
                string[] infoAry = MSInfos.Split('^');
                for (int i = 0, _len = infoAry.Length; i < _len; i++)
                {
                    string _sInfo = infoAry[i], _pid = String.Empty, _msId = MConvert.getValue(_sInfo, "msId");
                    string[] _tKV = MConvert.toKV(_sInfo);
                    double _num = MConvert.getDouble(_sInfo, "number");
                    ArrayList _stocks = trans.execJsonList("select {0} from {1} where msId={2} and whId={3} and remainNum<>0 order by cTime asc, id asc;", "id,batchCode,price,remainNum", R.Table.WH_MS_BATCH, _msId, _fromId);
                    for (int _n = 0; _n < _stocks.Count; _n++)
                    {
                        Json _stock = (Json)_stocks[_n];
                        double _realNum = 0, _price = _stock.getDouble("price"), _remainNum = _stock.getDouble("remainNum");
                        string _k = String.Empty, _v = String.Empty, _batchId = _stock.getValue("id"), _batchCode = _stock.getValue("batchCode");
                        if (_num < 0 || _num == 0) { break; }
                        _num = _num - _remainNum;
                        if (_num > 0)
                        {
                            _realNum = _remainNum;
                            if (Native.isEmpty(_pid))
                            {
                                _k = "msId,fromWhId,toWhId,oid,planNum";
                                _v = _msId + "," + _fromId + "," + _toId + "," + _newID + "," + MConvert.getValue(_sInfo, "planNum");
                                _pid = trans.execScalar("insert into {0} ({1}) values ({2});select SCOPE_IDENTITY();", R.Table.TK_WH_ALLOCATE_DETAIL, _k, _v);
                            }
                            _k = "msId,fromWhId,toWhId,oid,batchId,batchCode,price,number,sum";
                            _v = _msId + "," + _fromId + "," + _toId + "," + _newID + "," + _batchId + ",'" + _batchCode + "'," + _price + "," + _realNum + "," + _price * _realNum;
                            trans.addTreeNode(R.Table.TK_WH_ALLOCATE_DETAIL, Convert.ToInt16(_pid), _k, _v);
                            trans.execNonQuery("update " + R.Table.TK_WH_ALLOCATE_DETAIL + " set sum=sum+" + (_price * _realNum) + ", number=number+" + _realNum + " where id=" + _pid);

                        }
                        else
                        {
                            _realNum = _remainNum + _num;
                            if (!Native.isEmpty(_pid))
                            {
                                _k = "msId,fromWhId,toWhId,oid,batchId,batchCode,price,number,sum";
                                _v = _msId + "," + _fromId + "," + _toId + "," + _newID + "," + _batchId + ",'" + _batchCode + "'," + _price + "," + _realNum + "," + _price * _realNum;
                                trans.addTreeNode(R.Table.TK_WH_ALLOCATE_DETAIL, Convert.ToInt16(_pid), _k, _v);
                                trans.execNonQuery("update " + R.Table.TK_WH_ALLOCATE_DETAIL + " set sum=sum+" + (_price * _realNum) + ", number=number+" + _realNum + " where id=" + _pid);
                            }
                            else
                            {
                                trans.addRow(R.Table.TK_WH_ALLOCATE_DETAIL, _tKV[0] + ",fromWhId,toWhId,oid,batchId,batchCode,price,sum,planSum", _tKV[1] + "," + _fromId + "," + _toId + "," + _newID + "," + _batchId + ",'" + _batchCode + "'," + _price + "," + (_realNum * _price) + "," + (MConvert.getDouble(_sInfo, "planNum") * _price));
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

        #region 总务收料
        /// <summary>
        /// 总务收料
        /// </summary>
        /// <param name="tk_form">单据表单信息</param>
        /// <param name="MSInfos">物资具体信息</param>
        /// <returns></returns>
        public string glReceive(string tk_form, string MSInfos, int wfIdx)
        {
            string _return = String.Empty, _code = MConvert.getValue(tk_form, "code");
            string _wfId = (new WFIndex(wfIdx, api)).addInstance("收料单号:" + _code, "");
            SqlTrans trans = new SqlTrans(api);
            try
            {
                string[] _kv = MConvert.toKV(tk_form);
                string _users = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                string _newID = trans.addRow(R.Table.GL_RECEIVE, _kv[0] + ",wfId,users,observers", _kv[1] + "," + _wfId + ",'" + _users + "','" + _users + "'");
                string[] infoAry = MSInfos.Split('^');
                for (int i = 0, _len = infoAry.Length; i < _len; i++)
                {
                    string[] _tKV = MConvert.toKV(infoAry[i]);
                    trans.execNonQuery(MString.getInsertStr(R.Table.GL_RECEIVE_DETAIL, _tKV[0] + ",oid", _tKV[1] + "," + _newID));
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

        #region 办公用品采购
        /// <summary>
        /// 办公用品采购
        /// </summary>
        /// <param name="tk_form">单据表单信息</param>
        /// <param name="MSInfos">物资具体信息</param>
        /// <returns></returns>
        public string officeIn(string tk_form, string MSInfos, int wfIdx)
        {
            string _return = String.Empty, _code = MConvert.getValue(tk_form, "code");
            string _wfId = (new WFIndex(wfIdx, api)).addInstance("办公用品采购单号:" + _code, "");
            SqlTrans trans = new SqlTrans(api);
            try
            {
                string[] _kv = MConvert.toKV(tk_form);
                string _users = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                string _newID = trans.addRow("OFFICEMS_IN", _kv[0] + ",wfId,users,observers", _kv[1] + "," + _wfId + ",'" + _users + "','" + _users + "'");
                string[] infoAry = MSInfos.Split('^');
                for (int i = 0, _len = infoAry.Length; i < _len; i++)
                {
                    string[] _tKV = MConvert.toKV(infoAry[i]);
                    trans.execNonQuery(MString.getInsertStr("OFFICEMS_IN_DETAIL", _tKV[0] + ",oid", _tKV[1] + "," + _newID));
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

        #region 办公用品申领
        /// <summary>
        /// 办公用品申领
        /// </summary>
        /// <param name="tk_form">单据表单信息</param>
        /// <param name="MSInfos">物资具体信息</param>
        /// <returns></returns>
        public string officeOut(string tk_form, string MSInfos, int wfIdx)
        {
            string _return = String.Empty, _code = MConvert.getValue(tk_form, "code");
            string _wfId = (new WFIndex(wfIdx, api)).addInstance("办公用品申领单号:" + _code, "");
            SqlTrans trans = new SqlTrans(api);
            try
            {
                string[] _kv = MConvert.toKV(tk_form);
                string _users = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                string _newID = trans.addRow("OFFICEMS_OUT", _kv[0] + ",wfId,users,observers", _kv[1] + "," + _wfId + ",'" + _users + "','" + _users + "'");
                string[] infoAry = MSInfos.Split('^');
                for (int i = 0, _len = infoAry.Length; i < _len; i++)
                {
                    string[] _tKV = MConvert.toKV(infoAry[i]);
                    trans.execNonQuery(MString.getInsertStr("OFFICEMS_OUT_DETAIL", _tKV[0] + ",oid", _tKV[1] + "," + _newID));
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

        #region 总务领料
        /// <summary>
        /// 总务领料
        /// </summary>
        /// <param name="tk_form">单据表单信息</param>
        /// <param name="MSInfos">物资具体信息</param>
        /// <returns></returns>
        public string glSend(string tk_form, string MSInfos, int wfIdx)
        {
            string _return = String.Empty, _code = MConvert.getValue(tk_form, "code");
            string _wfId = (new WFIndex(wfIdx, api)).addInstance("总务领料单号:" + _code, "");
            SqlTrans trans = new SqlTrans(api);
            try
            {
                string[] _kv = MConvert.toKV(tk_form);
                string _users = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                string _newID = trans.addRow(R.Table.GL_SEND, _kv[0] + ",wfId,users,observers", _kv[1] + "," + _wfId + ",'" + _users + "','" + _users + "'");
                string[] infoAry = MSInfos.Split('^');
                for (int i = 0, _len = infoAry.Length; i < _len; i++)
                {
                    string _sInfo = infoAry[i];
                    string[] _tKV = MConvert.toKV(_sInfo);
                    double _num = MConvert.getInt(_sInfo, "number"), _planNum = MConvert.getInt(_sInfo, "planNum"), _realNum = 0;
                    string _sql = "select {0} from {1} where msId={2} and remainNum<>0 order by cTime asc;", _pid = String.Empty;
                    ArrayList _batchs = trans.execJsonList(_sql, "id,batchCode,price,totalNum,remainNum", R.Table.GL_MS_BATCH, MConvert.getInt(_sInfo, "msId"));
                    for (int bi = 0; bi < _batchs.Count; bi++)
                    {
                        if (_num < 0 || _num == 0) { break; }
                        Json _batch = (Json)_batchs[bi];
                        double _remain = _batch.getDouble("remainNum");
                        string _k = String.Empty, _v = String.Empty;
                        _num = _num - _remain;
                        if (_num > 0)
                        {
                            _realNum = _remain;
                            if (Native.isEmpty(_pid))
                            {
                                _k = _tKV[0] + ",oid,batchTotal,batchRemain,sum";
                                _v = _tKV[1] + "," + _newID + "," + _batch.getValue("totalNum") + "," + _batch.getValue("remainNum") + "," + _batch.getDouble("price") * _remain;
                                _pid = trans.execScalar(MString.getInsertStr(R.Table.GL_SEND_DETAIL, _k, _v, true));
                            }
                            _k = "oid,msId,batchId,batchCode,batchPrice,batchTotal,batchRemain,number,sum";
                            _v = _newID + "," + MConvert.getValue(_sInfo, "msId") + "," + _batch.getValue("id") + ",'" + _batch.getValue("batchCode") + "'," + _batch.getValue("price") + "," + _batch.getValue("totalNum") + "," + _batch.getValue("remainNum") + "," + _remain + "," + _batch.getDouble("price") * _remain;
                            trans.addTreeNode(R.Table.GL_SEND_DETAIL, Convert.ToInt16(_pid), _k, _v);
                        }
                        else
                        {
                            _realNum = _num + _remain;
                            if (!Native.isEmpty(_pid))
                            {
                                _k = "oid,msId,batchId,batchCode,batchPrice,batchTotal,batchRemain,number,sum";
                                _v = _newID + "," + MConvert.getValue(_sInfo, "msId") + "," + _batch.getValue("id") + ",'" + _batch.getValue("batchCode") + "'," + _batch.getValue("price") + "," + _batch.getValue("totalNum") + "," + _batch.getValue("remainNum") + "," + _realNum + "," + _batch.getDouble("price") * _realNum;
                                trans.addTreeNode(R.Table.GL_SEND_DETAIL, Convert.ToInt16(_pid), _k, _v);
                                trans.execNonQuery("update " + R.Table.GL_SEND_DETAIL + " set sum=sum+" + (_batch.getDouble("price") * _realNum) + ", batchTotal=batchTotal+" + _batch.getValue("totalNum") + ", batchRemain=batchRemain+" + _batch.getValue("remainNum") + " where id=" + _pid);
                            }
                            else
                            {
                                _k = _tKV[0] + ",oid,batchId,batchCode,batchPrice,batchTotal,batchRemain,sum,planSum";
                                _v = _tKV[1] + "," + _newID + "," + _batch.getValue("id") + ",'" + _batch.getValue("batchCode") + "'," + _batch.getValue("price") + "," + _batch.getValue("totalNum") + "," + _batch.getValue("remainNum") + "," + _batch.getDouble("price") * _realNum + "," + _batch.getDouble("price") * _planNum;
                                _pid = trans.execScalar(MString.getInsertStr(R.Table.GL_SEND_DETAIL, _k, _v, true));
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

        #region 养护领料
        /// <summary>
        /// 养护领料
        /// </summary>
        /// <param name="tk_form">单据表单信息</param>
        /// <param name="MSInfos">物资具体信息</param>
        /// <returns></returns>
        public string yhSend(string tk_form, string MSInfos, int wfIdx)
        {
            string _return = String.Empty, _code = MConvert.getValue(tk_form, "code"), _proId = MConvert.getValue(tk_form, "proId"), _proType = MConvert.getValue(tk_form, "proType");
            string _wfId = (new WFIndex(wfIdx, api)).addInstance("养护领料:" + _code, "");
            SqlTrans trans = new SqlTrans(api);
            try
            {
                string[] _kv = MConvert.toKV(tk_form);
                string _users = trans.execScalar(MString.getSelectStr(R.Table.WF_INSTANCE, "owner", "id=" + _wfId));
                string _newID = trans.addRow(R.Table.YH_TASK, _kv[0] + ",wfId,users,observers", _kv[1] + "," + _wfId + ",'" + _users + "','" + _users + "'");
                string[] infoAry = MSInfos.Split('^');
                for (int i = 0, _len = infoAry.Length; i < _len; i++)
                {
                    string _sInfo = infoAry[i];
                    string[] _tKV = MConvert.toKV(_sInfo);
                    int _total = MConvert.getInt(_sInfo, "number"), _planTotal = MConvert.getInt(_sInfo, "planNum"), _currTotal = 0, _rTotal = 0, _fixTotal = _total;
                    string _sql = "select {0} from {1} where msId={2} and whId={3} and remainNum<>0 order by cTime asc;", _pid = String.Empty, _whId = MConvert.getValue(tk_form, "whId");
                    ArrayList _batchs = trans.execJsonList(_sql, "id,batchCode,price,totalNum,remainNum", R.Table.WH_MS_BATCH, MConvert.getInt(_sInfo, "msId"), Convert.ToInt16(_whId));
                    for (int bi = 0; bi < _batchs.Count; bi++)
                    {
                        Json _batch = (Json)_batchs[bi];
                        int _remain = _batch.getInt("remainNum");
                        _currTotal += _remain;
                        string _k = String.Empty, _v = String.Empty;
                        _rTotal = _total - _remain;
                        if (_rTotal > 0)
                        {
                            _total = _rTotal;
                            if (Native.isEmpty(_pid))
                            {
                                _k = _tKV[0] + ",proId,proType,whId,oid,batchTotal,batchRemain,sum";
                                _v = _tKV[1] + "," + _proId + "," + _proType + "," + _whId + "," + _newID + "," + _batch.getValue("totalNum") + "," + _batch.getValue("remainNum") + "," + _batch.getDouble("price") * _remain;
                                _pid = trans.execScalar(MString.getInsertStr(R.Table.YH_TASK_DETAIL, _k, _v, true));
                            }
                            _k = "proId,proType,whId,oid,msId,batchId,batchCode,batchPrice,batchTotal,batchRemain,number,sum";
                            _v = _proId + "," + _proType + "," + _whId + "," + _newID + "," + MConvert.getValue(_sInfo, "msId") + "," + _batch.getValue("id") + ",'" + _batch.getValue("batchCode") + "'," + _batch.getValue("price") + "," + _batch.getValue("totalNum") + "," + _batch.getValue("remainNum") + "," + _remain + "," + _batch.getDouble("price") * _remain;
                            trans.addTreeNode(R.Table.YH_TASK_DETAIL, Convert.ToInt16(_pid), _k, _v);
                        }
                        else
                        {
                            if (!Native.isEmpty(_pid))
                            {
                                _k = "proId,proType,whId,oid,msId,batchId,batchCode,batchPrice,batchTotal,batchRemain,number,sum";
                                _v = _proId + "," + _proType + "," + _whId + "," + _newID + "," + MConvert.getValue(_sInfo, "msId") + "," + _batch.getValue("id") + ",'" + _batch.getValue("batchCode") + "'," + _batch.getValue("price") + "," + _batch.getValue("totalNum") + "," + _batch.getValue("remainNum") + "," + _total + "," + _batch.getDouble("price") * _total;
                                trans.addTreeNode(R.Table.YH_TASK_DETAIL, Convert.ToInt16(_pid), _k, _v);
                                trans.execNonQuery("update " + R.Table.YH_TASK_DETAIL + " set sum=sum+" + (_batch.getDouble("price") * _total) + ", batchTotal=batchTotal+" + _batch.getValue("totalNum") + ", batchRemain=batchRemain+" + _batch.getValue("remainNum") + " where id=" + _pid);
                            }
                            else
                            {
                                _k = _tKV[0] + ",proId,proType,whId,oid,batchId,batchCode,batchPrice,batchTotal,batchRemain,sum,planSum";
                                _v = _tKV[1] + "," + _proId + "," + _proType + "," + _whId + "," + _newID + "," + _batch.getValue("id") + ",'" + _batch.getValue("batchCode") + "'," + _batch.getValue("price") + "," + _batch.getValue("totalNum") + "," + _batch.getValue("remainNum") + "," + _batch.getDouble("price") * _total + "," + _batch.getDouble("price") * _planTotal;
                                _pid = trans.execScalar(MString.getInsertStr(R.Table.YH_TASK_DETAIL, _k, _v, true));
                            }
                        }
                        if (_currTotal > _fixTotal || _currTotal == _fixTotal) { break; }
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
                ArrayList _msInfos = _trans.execJsonList("select * from {0} where oid={1};", R.Table.TK_WH_RECEIVE_DETAIL, _tkId);
                Json _rJson = _trans.execJson("select code,whId from {0} where id={1};", R.Table.TK_WH_RECEIVE, _tkId);
                string _keys = "batchCode,whId,msId,price,totalNum,remainNum", _WHID = _rJson.getValue("whId");
                StringBuilder _noQuerySql = new StringBuilder();
                for (int i = 0, _len = _msInfos.Count; i < _len; i++)
                {
                    Json _MS = (Json)_msInfos[i];
                    int _msID = _MS.getInt("msId");
                    double _num = _MS.getDouble("number"), _price = _MS.getDouble("price"), _msCostCount = _price * _num;
                    string _bCode = _rJson.getValue("code"), _values = "'" + _bCode + "'," + _WHID + "," + _msID + "," + _price + "," + _num + "," + _num;
                    int _batchId = Convert.ToInt16(_trans.execScalar(MString.getInsertStr(R.Table.WH_MS_BATCH, _keys, _values, true)));
                    Json _TSTOCK = _trans.execJson("select id from {0} where whId={1} and msId={2};", R.Table.WH_MS_STOCK, _WHID, _msID);
                    if (_TSTOCK == null)
                    {
                        _trans.execNonQuery(MString.getInsertStr(R.Table.WH_MS_STOCK, "whId,msId,totalSum,number", _WHID + "," + _msID + "," + _msCostCount + "," + _num));
                    }
                    else
                    {
                        _trans.execNonQuery(MString.getUpdateStr(R.Table.WH_MS_STOCK, "number=number+" + _num + ",totalSum=totalSum+" + _msCostCount, "whId=" + _WHID + " and msId=" + _msID));
                    }
                    Json _rd = _trans.execJson("select number,totalSum from {0} where whId={1} and msId={2};", R.Table.WH_MS_STOCK, _WHID, _msID);
                    _noQuerySql.Append(_sql);
                    _noQuerySql.Append(MString.getUpdateStr(R.Table.TK_WH_RECEIVE_DETAIL, "batchId=" + _batchId + ", batchCode='" + _bCode + "', totalCount=" + _rd.getDouble("number") + ", balance=" + _rd.getDouble("totalSum"), "id=" + _MS.getInt("id")));
                    _noQuerySql.Append(MString.getUpdateStr(R.Table.WH_MS, "avgPrice=(select cast((sum(totalSum)+" + _msCostCount + ")/(sum(number)+" + _num + ") as numeric(18,2)) from " + R.Table.WH_MS_STOCK + " where msId=" + _msID + "), price=" + _price, _msID));
                }
                _noQuerySql.Append(MString.getUpdateStr(R.Table.TK_WH_RECEIVE, "state=" + R.WorkFlow.OVER, Convert.ToInt16(_tkId)));
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

        #region 领料完成回调
        /// <summary>
        /// 领料完成回调
        /// </summary>
        /// <param name="_tkId">领料单据ID</param>
        /// <returns></returns>
        public string onSendComplete(string _tkId)
        {
            string _sql = String.Empty, _return = String.Empty;
            SqlTrans _trans = new SqlTrans(api);
            try
            {
                ArrayList _msInfos = _trans.execJsonList("select * from {0} where oid={1} and batchId<>0;", R.Table.TK_WH_SEND_DETAIL, _tkId);
                Json _rJson = _trans.execJson("select code,whId from {0} where id={1};", R.Table.TK_WH_SEND, _tkId);
                string _WHID = _rJson.getValue("whId");
                StringBuilder _noQuerySql = new StringBuilder();
                for (int i = 0, _len = _msInfos.Count; i < _len; i++)
                {
                    Json _MS = (Json)_msInfos[i];
                    int _msID = _MS.getInt("msId");
                    double _num = _MS.getDouble("number"), _price = _MS.getDouble("batchPrice"), _msCostCount = _price * _num;
                    double _realNum = Convert.ToDouble(_trans.execScalar("select remainNum from {0} where id={1};", R.Table.WH_MS_BATCH, _MS.getInt("batchId")));
                    if ((_realNum - _num) < 0) { _trans.rollback(); _trans.close(); return Native.getErrorMsg("批次库存不够, 请联系管理员"); }
                    _trans.execNonQuery(MString.getUpdateStr(R.Table.WH_MS_BATCH, "remainNum=remainNum-" + _num, _MS.getInt("batchId")) + MString.getUpdateStr(R.Table.WH_MS_STOCK, "number=number-" + _num + ", totalSum=totalSum-" + _msCostCount, "whId=" + _WHID + " and msId=" + _msID));
                    Json _rd = _trans.execJson("select number,totalSum from {0} where whId={1} and msId={2};", R.Table.WH_MS_STOCK, _WHID, _msID);
                    _noQuerySql.Append(MString.getUpdateStr(R.Table.TK_WH_SEND_DETAIL, "remainNum=number,totalCount=" + _rd.getDouble("number") + ", balance=" + _rd.getDouble("totalSum"), "id=" + _MS.getInt("id")));
                    _noQuerySql.Append(MString.getUpdateStr(R.Table.WH_MS, "avgPrice=(select cast((sum(totalSum)+" + _msCostCount + ")/(sum(number)+" + _num + ") as numeric(18,2)) from "+R.Table.WH_MS_STOCK+" where msId=" + _msID + ")", _msID));
                }
                _noQuerySql.Append(MString.getUpdateStr(R.Table.TK_WH_SEND, "state=" + R.WorkFlow.OVER, Convert.ToInt16(_tkId)));
                _trans.execNonQuery(_noQuerySql.ToString());
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

        #region 调拨完成回调
        /// <summary>
        /// 调拨完成回调
        /// </summary>
        /// <param name="_tkId">调拨单据ID</param>
        /// <returns></returns>
        public string onAllocateComplete(string _stkId)
        {
            string _sql = String.Empty, _return = String.Empty;
            SqlTrans _trans = new SqlTrans(api);
            try
            {
                int _tkId = Convert.ToInt16(_stkId);
                Json _rJson = _trans.execJson(MString.getSelectStr(R.Table.TK_WH_ALLOCATE, "code,whId,sourceId", _tkId));
                ArrayList _msInfos = _trans.execJsonList("select * from {0} where oid={1} and batchId<>0;", R.Table.TK_WH_ALLOCATE_DETAIL, _tkId);
                int _fromId = _rJson.getInt("sourceId"), _toId = _rJson.getInt("whId");
                string _keys = "batchCode,whId,msId,price,totalNum,remainNum,type";
                StringBuilder _noQuerySql = new StringBuilder();
                for (int i = 0, _len = _msInfos.Count; i < _len; i++)
                {
                    Json _MS = (Json)_msInfos[i];
                    int _msID = _MS.getInt("msId");
                    int _rCount = Convert.ToInt16(_trans.execScalar("select remainNum from {0} where id={1};", R.Table.WH_MS_BATCH, _MS.getInt("batchId")));
                    if (_rCount < 0 || _rCount == 0) { _trans.rollback(); _trans.close(); return Native.getErrorMsg("源库存量不足,调拨失败!"); }
                    double _num = _MS.getDouble("number"), _price = _MS.getDouble("price"), _msCostCount = _price * _num;
                    string _bCode = _rJson.getValue("code"), _values = "'" + _bCode + "'," + _toId + "," + _msID + "," + _price + "," + _num + "," + _num + ",454";
                    int _batchId = Convert.ToInt16(_trans.execScalar(MString.getInsertStr(R.Table.WH_MS_BATCH, _keys, _values, true)));
                    Json _TSTOCK = _trans.execJson("select id from {0} where whId={1} and msId={2};", R.Table.WH_MS_STOCK, _toId, _msID);
                    if (_TSTOCK == null)
                    {
                        _trans.execNonQuery(MString.getInsertStr(R.Table.WH_MS_STOCK, "whId,msId,totalSum,number", _toId + "," + _msID + "," + _msCostCount + "," + _num));
                    }
                    else
                    {
                        _trans.execNonQuery(MString.getUpdateStr(R.Table.WH_MS_STOCK, "number=number+" + _num + ",totalSum=totalSum+" + _msCostCount, "whId=" + _toId + " and msId=" + _msID));
                    }
                    _trans.execNonQuery(MString.getUpdateStr(R.Table.WH_MS_BATCH, "remainNum=remainNum-" + _num, _MS.getInt("batchId")));
                    _trans.execNonQuery(MString.getUpdateStr(R.Table.WH_MS_STOCK, "number=number-" + _num + ", totalSum=totalSum-" + _MS.getDouble("sum"), "whId=" + _fromId + " and msId=" + _msID));
                    Json _rd = _trans.execJson("select number,totalSum from {0} where whId={1} and msId={2};", R.Table.WH_MS_STOCK, _toId, _msID);
                    _noQuerySql.Append(MString.getUpdateStr(R.Table.TK_WH_ALLOCATE_DETAIL, "totalCount=" + _rd.getDouble("number") + ", balance=" + _rd.getDouble("totalSum"), "id=" + _MS.getInt("id")));
                }
                _noQuerySql.Append(MString.getUpdateStr(R.Table.TK_WH_ALLOCATE, "state=" + R.WorkFlow.OVER, Convert.ToInt16(_tkId)));
                _trans.execNonQuery(_noQuerySql.ToString());
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

        #region 养护领料完成回调
        /// <summary>
        /// 养护领料完成回调
        /// </summary>
        /// <param name="_tkId">养护领料单据ID</param>
        /// <returns></returns>
        public string onYHSendComplete(string _tkId)
        {
            string _sql = String.Empty, _return = String.Empty;
            SqlTrans _trans = new SqlTrans(api);
            try
            {
                ArrayList _msInfos = _trans.execJsonList("select * from {0} where oid={1} and batchId<>0;", R.Table.YH_TASK_DETAIL, _tkId);
                Json _rJson = _trans.execJson("select code,whId from {0} where id={1};", R.Table.YH_TASK, _tkId);
                string _WHID = _rJson.getValue("whId");
                StringBuilder _noQuerySql = new StringBuilder();
                for (int i = 0, _len = _msInfos.Count; i < _len; i++)
                {
                    Json _MS = (Json)_msInfos[i];
                    int _msID = _MS.getInt("msId");
                    double _num = _MS.getDouble("number"), _price = _MS.getDouble("batchPrice"), _msCostCount = _price * _num;
                    double _realNum = Convert.ToDouble(_trans.execScalar(MString.getSelectStr(R.Table.WH_MS_BATCH, "remainNum", _MS.getInt("batchId"))));
                    if ((_realNum - _num) < 0) { _trans.rollback(); _trans.close(); return Native.getErrorMsg("批次库存不够, 请联系管理员"); }
                    _trans.execNonQuery(MString.getUpdateStr(R.Table.WH_MS_BATCH, "remainNum=remainNum-" + _num, _MS.getInt("batchId")) + MString.getUpdateStr(R.Table.WH_MS_STOCK, "number=number-" + _num + ", totalSum=totalSum-" + _msCostCount, "whId=" + _WHID + " and msId=" + _msID));
                    Json _rd = _trans.execJson("select number,totalSum from {0} where whId={1} and msId={2};", R.Table.WH_MS_STOCK, _WHID, _msID);
                    _noQuerySql.Append(MString.getUpdateStr(R.Table.YH_TASK_DETAIL, "remainNum=number,totalCount=" + _rd.getDouble("number") + ", balance=" + _rd.getDouble("totalSum"), "id=" + _MS.getInt("id")));
                    _noQuerySql.Append(MString.getUpdateStr(R.Table.WH_MS, "avgPrice=(select cast((sum(totalSum)+" + _msCostCount + ")/(sum(number)+" + _num + ") as numeric(18,2)) from " + R.Table.WH_MS_STOCK + " where msId=" + _msID + ")", _msID));
                }
                _noQuerySql.Append(MString.getUpdateStr(R.Table.YH_TASK, "state=" + R.WorkFlow.OVER, Convert.ToInt16(_tkId)));
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

        #region 总务收料完成回调
        /// <summary>
        /// 总务收料完成回调
        /// </summary>
        /// <param name="_tkId">总务收料单据ID</param>
        /// <returns></returns>
        public string onGLReceiveComplete(string _tkId)
        {
            string _sql = String.Empty, _return = String.Empty;
            SqlTrans _trans = new SqlTrans(api);
            try
            {
                ArrayList _msInfos = _trans.execJsonList("select * from {0} where oid={1};", R.Table.GL_RECEIVE_DETAIL, _tkId);
                Json _rJson = _trans.execJson("select code from {0} where id={1};", R.Table.GL_RECEIVE, _tkId);
                string _keys = "batchCode,msId,price,totalNum,remainNum";
                StringBuilder _noQuerySql = new StringBuilder();
                for (int i = 0, _len = _msInfos.Count; i < _len; i++)
                {
                    Json _MS = (Json)_msInfos[i];
                    int _msID = _MS.getInt("msId");
                    double _num = _MS.getDouble("number"), _price = _MS.getDouble("price"), _msCostCount = _price * _num;
                    string _bCode = _rJson.getValue("code"), _values = "'" + _bCode + "'," + _msID + "," + _price + "," + _num + "," + _num;
                    int _batchId = Convert.ToInt16(_trans.execScalar(MString.getInsertStr(R.Table.GL_MS_BATCH, _keys, _values, true)));
                    Json _TSTOCK = _trans.execJson("select id from {0} where msId={1};", R.Table.GL_MS_STOCK, _msID);
                    if (_TSTOCK == null)
                    {
                        _trans.execNonQuery(MString.getInsertStr(R.Table.GL_MS_STOCK, "msId,totalSum,number", _msID + "," + _msCostCount + "," + _num));
                    }
                    else
                    {
                        _trans.execNonQuery(MString.getUpdateStr(R.Table.GL_MS_STOCK, "number=number+" + _num + ",totalSum=totalSum+" + _msCostCount, "msId=" + _msID));
                    }
                    Json _rd = _trans.execJson("select number,totalSum from {0} where msId={1};", R.Table.GL_MS_STOCK, _msID);
                    _noQuerySql.Append(MString.getUpdateStr(R.Table.GL_RECEIVE_DETAIL, "batchId=" + _batchId + ", batchCode='" + _bCode + "', totalCount=" + _rd.getDouble("number") + ", balance=" + _rd.getDouble("totalSum"), "id=" + _MS.getInt("id")));
                    _noQuerySql.Append(MString.getUpdateStr(R.Table.GL_MS, "avgPrice=(select cast((sum(totalSum)+" + _msCostCount + ")/(sum(number)+" + _num + ") as numeric(18,2)) from " + R.Table.GL_MS_STOCK + " where msId=" + _msID + "), price=" + _price, _msID));
                }
                _noQuerySql.Append(MString.getUpdateStr(R.Table.GL_RECEIVE, "state="+R.WorkFlow.OVER, Convert.ToInt16(_tkId)));
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

        #region 总务领料完成回调
        /// <summary>
        /// 总务领料完成回调
        /// </summary>
        /// <param name="_tkId">总务领料单据ID</param>
        /// <returns></returns>
        public string onGLSendComplete(string _tkId)
        {
            string _sql = String.Empty, _return = String.Empty;
            SqlTrans _trans = new SqlTrans(api);
            try
            {
                ArrayList _msInfos = _trans.execJsonList("select * from {0} where oid={1} and batchId<>0;", R.Table.GL_SEND_DETAIL, _tkId);
                Json _send = _trans.execJson(MString.getSelectStr(R.Table.GL_SEND, "*", "id=" + _tkId));
                StringBuilder _noQuerySql = new StringBuilder();
                for (int i = 0, _len = _msInfos.Count; i < _len; i++)
                {
                    Json _MS = (Json)_msInfos[i];
                    int _msID = _MS.getInt("msId");
                    double _num = _MS.getDouble("number"), _price = _MS.getDouble("batchPrice"), _msCostCount = _price * _num;
                    Json _batch = _trans.execJson("select * from {0} where id={1};", R.Table.GL_MS_BATCH, _MS.getInt("batchId"));
                    double _realNum = Convert.ToDouble(_batch.getValue("remainNum"));
                    if ((_realNum - _num) < 0) { _trans.rollback(); _trans.close(); return Native.getErrorMsg("批次库存不够, 请联系管理员"); }
                    Json _msInfo = _trans.execJson(MString.getSelectStr(R.Table.GL_MS, "*", _msID));
                    if (_msInfo.getValue("parentPath").IndexOf(",5,") > -1)
                    {
                        String[] _types = _msInfo.getValue("parentPath").Split(',');
                        string _gk = String.Empty, _gv = String.Empty;
                        _gk = "zcCode,batchId,batchCode,zcName,zcNorm,zcSort,zcType,zcUnits,zcUseDept,zcUser,zcKeeper,zcBuyTime,zcOrigalCost,zcCost";
                        _gv = "'ZC001'," + _batch.getValue("id") + ",'" + _batch.getValue("batchCode") + "','" + _msInfo.getValue("nodeName") + "','" + _msInfo.getValue("guige") + "'," + _types[2] + "," + _types[3] + "," + _msInfo.getValue("danwei") + "," + _send.getValue("dept") + "," + _send.getValue("cPerson") + "," + _send.getValue("cPerson") + ",'" + _batch.getValue("cTime") + "'," + _batch.getValue("price") + "," + _batch.getValue("price");
                        for (int g = 0; g < _num; g++) { _trans.addRow(R.Table.TZ_ZICHAN, _gk, _gv); }
                    }
                    _trans.execNonQuery(MString.getUpdateStr(R.Table.GL_MS_BATCH, "remainNum=remainNum-" + _num, _MS.getInt("batchId")) + MString.getUpdateStr(R.Table.GL_MS_STOCK, "number=number-" + _num + ", totalSum=totalSum-" + _msCostCount, "msId=" + _msID));
                    Json _rd = _trans.execJson("select number,totalSum from {0} where msId={1};", R.Table.GL_MS_STOCK, _msID);
                    _noQuerySql.Append(MString.getUpdateStr(R.Table.GL_SEND_DETAIL, "remainNum=number,totalCount=" + _rd.getDouble("number") + ", balance=" + _rd.getDouble("totalSum"), "id=" + _MS.getInt("id")));
                    _noQuerySql.Append(MString.getUpdateStr(R.Table.GL_MS, "avgPrice=(select cast((sum(totalSum)+" + _msCostCount + ")/(sum(number)+" + _num + ") as numeric(18,2)) from " + R.Table.GL_MS_STOCK + " where msId=" + _msID + ")", _msID));
                }
                _noQuerySql.Append(MString.getUpdateStr(R.Table.GL_SEND, "state="+R.WorkFlow.OVER, Convert.ToInt16(_tkId)));
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