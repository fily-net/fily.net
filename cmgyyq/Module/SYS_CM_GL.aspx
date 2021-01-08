<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="Fily.WorkFlow" %>
<%@ Import Namespace="Fily.Util" %>
<%@ Import Namespace="Fily.Depository" %>
<% 
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    string action = Native.getAction(), responseText = String.Empty;
    string [,] args;
    Json _args = null;
    switch (action) {
        case "create":
            args = new string[,] { 
                { "json", null },
                { "type", null },
                { "wfIdx", null },
                { "MSInfos", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                Ticket ticket = new Ticket(baseApi);
                string _sJson = _args.getValue("json"), _sMSInfos = _args.getValue("MSInfos");
                int _wfIdx = _args.getInt("wfIdx");
                switch (_args.getValue("type")) { 
                    case "receive":
                        responseText = ticket.glReceive(_sJson, _sMSInfos, _wfIdx);
                        break;
                    case "send":
                        responseText = ticket.glSend(_sJson, _sMSInfos, _wfIdx);
                        break;
                }
            }
            break;
        case "getMSDetailForTK":
            args = new string[,] { 
                { "keyFields", "*" },
                { "type", null },
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _table = "GENERAL_RECEIVE";
                if (_args.getValue("type") == "send") { _table = "GENERAL_SEND"; }
                string _sql = "select {0} from dbo.GENERAL_MS ms left join dbo.{1}_DETAIL detail on ms.id=detail.msId where detail.oid={2};";
                responseText = baseApi.execQuery(_sql, _args.getValue("keyFields"), _table, _args.getValue("tkId"));
            }
            break;
        case "getStockTask":
            args = new string[,] {
                { "keyFields", "*" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "type", "receive" },
                { "jsonCondition", ""},
                { "orderCondition", "" },
                { "filterCondition", "" },
                { "delFlag", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {

                string _where = MConvert.toWhereSql(_args.getValue("jsonCondition")), _filter = MConvert.toFilterSql(_args.getValue("filterCondition")), _table = String.Empty;
                if (_where.Length > 0 && _filter.Length > 0)
                {
                    _where += " and " + _filter;
                }
                else if (_filter.Length > 0)
                {
                    _where = _filter;
                }
                string _strDownload = Request["jsonDownload"];
                if (_args.getValue("type") == "receive") { _table = "GENERAL_RECEIVE"; } else { _table = "GENERAL_SEND"; }
                responseText = baseApi.paging(_table, _args.getInt("pageIndex"), _args.getInt("pageSize"), _args.getValue("keyFields"), _where, MConvert.toOrderSql(_args.getValue("orderCondition")), _args.getInt("delFlag"));
            }
            break;
        case "getInStockTask":
            args = new string[,] {
                { "keyFields", "*" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "jsonCondition", ""},
                { "orderCondition", "" },
                { "filterCondition", "" },
                { "delFlag", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {

                string _where = MConvert.toWhereSql(_args.getValue("jsonCondition")), _filter = MConvert.toFilterSql(_args.getValue("filterCondition"));
                if (_where.Length > 0 && _filter.Length > 0)
                {
                    _where += " and " + _filter;
                }
                else if(_filter.Length > 0) { 
                    _where = _filter;
                }
                string _strDownload = Request["jsonDownload"];
                responseText = baseApi.paging("GENERAL_RECEIVE", _args.getInt("pageIndex"), _args.getInt("pageSize"), _args.getValue("keyFields"), _where, MConvert.toOrderSql(_args.getValue("orderCondition")), _args.getInt("delFlag"));
            }
            break;
        case "getOutStockTask":
            args = new string[,] {
                { "keyFields", "*" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "jsonCondition", ""},
                { "orderCondition", "" },
                { "filterCondition", "" },
                { "delFlag", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {

                string _where = MConvert.toWhereSql(_args.getValue("jsonCondition")), _filter = MConvert.toFilterSql(_args.getValue("filterCondition"));
                if (_where.Length > 0 && _filter.Length > 0)
                {
                    _where += " and " + _filter;
                }
                else if(_filter.Length > 0) { 
                    _where = _filter;
                }
                string _strDownload = Request["jsonDownload"];
                responseText = baseApi.paging("GENERAL_SEND", _args.getInt("pageIndex"), _args.getInt("pageSize"), _args.getValue("keyFields"), _where, MConvert.toOrderSql(_args.getValue("orderCondition")), _args.getInt("delFlag"));
            }
            break;
        case "onReceiveComplete":
            args = new string[,] { 
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _tkId = _args.getValue("tkId");
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    ArrayList _msInfos = _trans.execJsonList("select * from {0} where oid={1};", "GENERAL_RECEIVE_DETAIL", _tkId);
                    Json _rJson = _trans.execJson("select code from {0} where id={1};", "GENERAL_RECEIVE", _tkId);
                    string _keys = "batchCode,msId,price,totalNum,remainNum";
                    for (int i = 0, _len = _msInfos.Count; i < _len; i++)
                    {
                        Json _MS = (Json)_msInfos[i];
                        int _msID = _MS.getInt("msId");
                        double _num = _MS.getDouble("number"), _price = _MS.getDouble("price");
                        string _values = "'" + _rJson.getValue("code") + "'," + _msID + "," + _price + "," + _num + "," + _num;
                        _trans.execNonQuery(MString.getInsertStr("GENERAL_MS_BATCH", _keys, _values));
                        _trans.execNonQuery(MString.getUpdateStr("GENERAL_MS", "stock=stock+" + _num + ",totalSum=totalSum+" + (_price * _num), _msID));
                        _trans.execNonQuery(MString.getUpdateStr("GENERAL_RECEIVE", "state=1", Convert.ToInt16(_tkId)));
                    }
                    _trans.commit();
                }
                catch (Exception e)
                {
                    responseText = Native.getErrorMsg(e.Message);
                    _trans.rollback();
                }
                finally
                {
                    _trans.close();
                }
            }
            break;
        case "onSendComplete":
            args = new string[,] { 
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _tkId = _args.getValue("tkId"), _sql = String.Empty;
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    ArrayList _msInfos = _trans.execJsonList("select * from {0} where oid={1};", "GENERAL_SEND_DETAIL", _tkId);
                    for (int i = 0, _len = _msInfos.Count; i < _len; i++)
                    {
                        Json _MS = (Json)_msInfos[i];
                        double _total = _MS.getDouble("number"), _remainNum = _total, _changeNum, _changeSum = 0;
                        int _msID = _MS.getInt("msId");
                        bool _ifChangeBatchOver = false;
                        ArrayList _batchs = _trans.execJsonList("select id,batchCode,price,totalNum,remainNum from {0} where msId={1} and remainNum<>0 order by cTime;", "GENERAL_MS_BATCH", _msID);
                        for (int k = 0; k < _batchs.Count; k++)
                        {
                            Json _batch = (Json)_batchs[k];
                            int _rNum = _batch.getInt("remainNum");
                            _remainNum -= _rNum;
                            if (_remainNum > 0)
                            {
                                _changeNum = _rNum;
                            }
                            else
                            {
                                _changeNum = _rNum + _remainNum; _ifChangeBatchOver = true;
                            }
                            _changeSum += _changeNum * _batch.getDouble("price");
                            _trans.execNonQuery(MString.getUpdateStr("GENERAL_MS_BATCH", "remainNum=remainNum-" + _changeNum, _batch.getInt("id")));
                            if (_ifChangeBatchOver) { break; }
                        }
                        _trans.execNonQuery(MString.getUpdateStr("GENERAL_MS", "stock=stock-" + _total + ", totalSum=totalSum-" + _changeSum, _msID));
                        _trans.execNonQuery(MString.getUpdateStr("GENERAL_RECEIVE", "state=1", Convert.ToInt16(_tkId)));
                    }
                    _trans.commit();
                }
                catch (Exception e)
                {
                    responseText = Native.getErrorMsg(e.Message);
                    _trans.rollback();
                }
                finally
                {
                    _trans.close();
                }
            }
            break;
        case "create_yh_other_send":
            args = new string[,] { 
                { "json", null },
                { "wfIdx", null },
                { "MSInfos", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sJson = _args.getValue("json"), _sMSInfos = _args.getValue("MSInfos");
                int _wfIdx = _args.getInt("wfIdx");
                string _return = String.Empty, _code = MConvert.getValue(_sJson, "code");
                string _wfId = (new WFIndex(_wfIdx, baseApi)).addInstance("领料单号:" + _code, "");
                SqlTrans trans = new SqlTrans(baseApi);
                try
                {
                    string[] _kv = MConvert.toKV(_sJson);
                    string _newID = trans.addRow("YH_OTHER_SEND", _kv[0] + ",wfId", _kv[1] + "," + _wfId);
                    string[] infoAry = _sMSInfos.Split('^');
                    for (int i = 0, _len = infoAry.Length; i < _len; i++)
                    {
                        string[] _tKV = MConvert.toKV(infoAry[i]);
                        if (!Native.isEmpty(_tKV[0]) && !Native.isEmpty(_tKV[1]))
                        {
                            trans.execReader("insert into {0} ({1}) values ({2});", "YH_OTHER_SEND_DETAIL", _tKV[0] + ",oid", _tKV[1] + "," + _newID);
                        }
                    }
                    responseText = _newID;
                    trans.commit();
                }
                catch (Exception e)
                {
                    trans.rollback();
                    responseText = Native.getErrorMsg(e.Message);
                }
                finally
                {
                    trans.close();
                }
            }
            break;
        case "create_yh_task":
            args = new string[,] { 
                { "json", null },
                { "MSInfos", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sJson = _args.getValue("json"), _sMSInfos = _args.getValue("MSInfos");
                int _wfIdx = MConvert.getInt(_sJson, "wfType");
                string _return = String.Empty, _code = MConvert.getValue(_sJson, "code");
                string _wfId = (new WFIndex(_wfIdx, baseApi)).addInstance("任务单号:" + _code, "");
                SqlTrans trans = new SqlTrans(baseApi);
                try
                {
                    string[] _kv = MConvert.toKV(_sJson);
                    Json wfObj = trans.getWFInfo(_wfId);
                    string _newID = trans.addRow("YH_TASK", _kv[0] + ",wfId,users,observers", _kv[1] + "," + _wfId + ",'" + wfObj.getValue("owner") + "','" + wfObj.getValue("owner") + "'");
                    string[] infoAry = _sMSInfos.Split('^');
                    for (int i = 0, _len = infoAry.Length; i < _len; i++)
                    {
                        string[] _tKV = MConvert.toKV(infoAry[i]);
                        if (!Native.isEmpty(_tKV[0]) && !Native.isEmpty(_tKV[1]))
                        {
                            trans.execReader("insert into {0} ({1}) values ({2});", "YH_TASK_DETAIL", _tKV[0] + ",oid", _tKV[1] + "," + _newID);
                        }
                    }
                    responseText = _newID;
                    trans.commit();
                }
                catch (Exception e)
                {
                    trans.rollback();
                    responseText = Native.getErrorMsg(e.Message);
                }
                finally
                {
                    trans.close();
                }
            }
            break;
        default :
            responseText = Native.getErrorMsg("调用接口不对或不存在");
            break;
    }
    Native.writeToPage(responseText); 
%>