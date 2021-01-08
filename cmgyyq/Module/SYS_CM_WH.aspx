<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="Fily.WorkFlow" %>
<%@ Import Namespace="Fily.Util" %>
<%@ Import Namespace="Fily.Depository" %>
<%@ Import Namespace="Fily.Office" %>
<%@ Import Namespace="System.Data" %>
<% 
    
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    string action = Native.getAction(), responseText = String.Empty;
    string T_MS = R.Table.WH_MS, T_STOCK = R.Table.WH_MS_STOCK, T_BATCH = R.Table.WH_MS_BATCH;
    string [,] args;
    Json _args = null;
    switch (action) {
        case "importMSIndex":
            args = new string[,] { 
                { "path", "../App_Data/物料基本分类打印.xls" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    DataSet _ds = ExeclUtil.ImportXlsToDataSet(MapPath(_args.getValue("path")));
                    DataTable _t0 = _ds.Tables[0];
                    DataRowCollection _rows =  _t0.Rows;
                    DataRow _row;
                    Hashtable codeMapIDHS = new Hashtable();
                    _trans.execNonQuery("truncate table SYS_WH_MS");
                    string _newId = String.Empty;
                    object _pid = null;
                    for (int i = 0, _len = _rows.Count; i < _len; i++)
                    {
                        
                        _row = _rows[i];
                        string _typeCode = _row[1].ToString();
                        string _typeTitle = _row[2].ToString();
                        switch (_typeCode.Length)
                        {
                            case 2:
                                _newId = _trans.addRow("SYS_WH_MS", "code, nodeName", "'" + _typeCode + "','" + _typeTitle + "'");
                                codeMapIDHS.Add(_typeCode, _newId);
                                break;
                            case 4:
                                _pid = codeMapIDHS[_typeCode.Substring(0, 2)];
                                if (_pid != null) {
                                    _newId = _trans.addTreeNode("SYS_WH_MS", Convert.ToInt16(_pid), "code, nodeName", "'" + _typeCode + "','" + _typeTitle + "'");
                                    codeMapIDHS.Add(_typeCode, _newId);
                                }
                                break;
                            case 8:
                                _pid = codeMapIDHS[_typeCode.Substring(0, 4)];
                                if (_pid != null) {
                                    _newId = _trans.addTreeNode("SYS_WH_MS", Convert.ToInt16(_pid), "code, nodeName", "'" + _typeCode + "','" + _typeTitle + "'");
                                    codeMapIDHS.Add(_typeCode, _newId);
                                }
                                break;
                        }
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
        case "importMSDetail":
            args = new string[,] { 
                { "path", "../App_Data/物料基本信息列表.xls" },
                { "ifReset" , "0"}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                Native.setDebug(Native.DEBUG_SQL);
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    DataSet _ds = ExeclUtil.ImportXlsToDataSet(MapPath(_args.getValue("path")));
                    DataTable _t0 = _ds.Tables[0];
                    DataRowCollection _rows = _t0.Rows;
                    DataRow _row;
                    Hashtable codeMapIDHS = new Hashtable();

                    ArrayList msAry = _trans.execJsonList(MString.getSelectStr("SYS_WH_MS", "id, code", "len(code)=8"));
                    for (int i = 0, _len = msAry.Count; i < _len; i++ )
                    {
                        Json ms = (Json)msAry[i];
                        codeMapIDHS.Add(ms.getValue("code"), ms.getValue("id"));
                    }
                    
                    if (_args.getInt("ifReset") == 1) {
                        _trans.execNonQuery("truncate table SYS_WH_MS_DETAIL");
                    }
                    string _typeId = String.Empty;
                    string _keys = "typeId, msCode, nodeName, version, typeName, guiGe, danWei, shuiZhong";
                    for (int i = 0, _len = _rows.Count; i < _len; i++)
                    {

                        _row = _rows[i];
                        string _msCode = _row[1].ToString();
                        if (_msCode.Length < 10) {
                            continue;
                        }
                        
                        string _nodeName = _row[2].ToString();
                        string _version = _row[4].ToString();
                        string _typeName = _row[5].ToString();
                        string _guiGe = _row[6].ToString();
                        string _danWei = _row[15].ToString();
                        string _shuiZhong = _row[18].ToString();
                        string _typeCode = _msCode.Substring(0, 8);
                        object tid = codeMapIDHS[_typeCode];
                        if (tid!=null) {
                            _trans.execNonQuery(MString.getInsertStr("SYS_WH_MS_DETAIL", _keys, tid.ToString() + ",'" + _msCode + "','" + _nodeName + "','" + _version + "','" + _typeName + "','" + _guiGe + "','" + _danWei + "','" + _shuiZhong + "'"));
                        }
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
        case "getStockNumByWH":
            args = new string[,] { 
                { "keyFields", "*" },
                { "msPid", null },
                { "whId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sql = "select {0} from {1} ms left join {2} stock on ms.id=stock.msId and stock.whId={3} where ms.pid={4};";
                responseText = baseApi.execQuery(_sql, _args.getValue("keyFields"), R.Table.WH_MS, R.Table.WH_MS_STOCK, _args.getValue("whId"), _args.getValue("msPid"));
            }
            break;
        case "getGLStockNumByWH":
            args = new string[,] { 
                { "keyFields", "*" },
                { "pid", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sql = "select {0} from {1} ms left join {2} stock on ms.id=stock.msId where ms.pid={3};";
                responseText = baseApi.execQuery(_sql, _args.getValue("keyFields"), R.Table.GL_MS, R.Table.GL_MS_STOCK, _args.getValue("pid"));
            }
            break;
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
                string tk_form = _args.getValue("json"), MSInfos = _args.getValue("MSInfos");
                int wfIdx = _args.getInt("wfIdx");
                switch (_args.getValue("type")) { 
                    case "receive":
                        responseText = ticket.receive(tk_form, MSInfos, wfIdx);break;
                    case "back":
                        responseText = ticket.back(tk_form, MSInfos, wfIdx);break;
                    case "send":
                        responseText = ticket.send(tk_form, MSInfos, wfIdx);break;
                    case "allocate":
                        responseText = ticket.allocate(tk_form, MSInfos, wfIdx);break;
                    case "yhSend":
                        responseText = ticket.yhSend(tk_form, MSInfos, wfIdx); break;
                    case "glReceive":
                        responseText = ticket.glReceive(tk_form, MSInfos, wfIdx);break;
                    case "glSend":
                        responseText = ticket.glSend(tk_form, MSInfos, wfIdx); break;
                    case "officeIn":
                        responseText = ticket.officeIn(tk_form, MSInfos, wfIdx); break;
                    case "officeOut":
                        responseText = ticket.officeOut(tk_form, MSInfos, wfIdx); break;
                }
            }
            break;
        case "getWHTaskByType":
            args = new string[,] {
                { "keyFields", "*" }, 
                { "pageIndex", "1" }, 
                { "pageSize", "10" },
                { "jsonCondition", "1=1" }, 
                { "type", null },
                { "whId", null },
                { "jsonOrder", "id" },
                { "delFlag", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _wSql = MConvert.toWhereSql(_args.getValue("jsonCondition"));
                if (!Native.isEmpty(_wSql)){ _wSql += " and"; }
                _wSql += " whId=" + _args.getValue("whId");
                responseText = baseApi.paging(_args.getValue("type"), _args.getInt("pageIndex"), _args.getInt("pageSize"), _args.getValue("keyFields"), _wSql, MConvert.toOrderSql(_args.getValue("jsonOrder")), _args.getInt("delFlag"));
            }
            break;
        case "getMSBatchDetail":
            args = new string[,] { 
                { "keyFields", "batchCode,price,remainNum,totalNum,cTime,dbo.SYS_TRANS_USER(cPerson) as cPerson" },
                { "msId", null },
                { "whId", null },
                { "totalNum", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _sql = "select {0},remainNum, dbo.SYS_TRANS_WH(whId) as wh from {1} where msId={2} and whId={3} and remainNum<>0 order by cTime;", _return = String.Empty;
                    int _total = _args.getInt("totalNum"), _currTotal = 0;
                    ArrayList _batchs = _trans.execJsonList(_sql, _args.getValue("keyFields"), T_BATCH, _args.getValue("msId"), _args.getValue("whId"));
                    for (int i = 0; i < _batchs.Count; i++)
                    {
                        Json _batch = (Json)_batchs[i];
                        _currTotal += _batch.getInt("remainNum");
                        if (!Native.isEmpty(_return)) { _return += ","; }
                        _return += "{";
                        foreach (DictionaryEntry de in _batch) { _return += "\"" + de.Key + "\":\"" + de.Value + "\","; }
                        _return = _return.Substring(0, _return.Length-1);
                        _return += "}";
                        if (_currTotal > _total||_currTotal == _total) { break; }
                    }
                    responseText = "["+_return+"]";
                    _trans.commit();
                }
                catch (Exception e)
                {
                    responseText = Native.getErrorMsg(e.Message);
                    _trans.rollback();
                }
                finally {
                    _trans.close();   
                }
            }
            break;
        case "getAllMSBatchDetail":
            args = new string[,] { 
                { "keyFields", "batchCode,price,remainNum,totalNum,cTime,dbo.SYS_TRANS_USER(cPerson) as cPerson" },
                { "msId", null },
                { "whId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("select {0} from {1} where msId={2} and whId={3} order by cTime;", _args.getValue("keyFields"), T_BATCH, _args.getValue("msId"), _args.getValue("whId"));
            }
            break;
        case "getAllGLMSBatchDetail":
            args = new string[,] { 
                { "keyFields", "batchCode,price,remainNum,totalNum,cTime,dbo.SYS_TRANS_USER(cPerson) as cPerson" },
                { "msId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("select {0} from {1} where msId={2} order by cTime;", _args.getValue("keyFields"), R.Table.GL_MS_BATCH, _args.getValue("msId"));
            }
            break;
        case "getMSDetailForTK":
            args = new string[,] { 
                { "keyFields", "*" },
                { "jsonCondition", "1=1" }, 
                { "type", null },
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sql = "select {0} from dbo.SYS_WH_MS ms left join dbo.{1}_DETAIL detail on ms.id=detail.msId where detail.oid={2} and " + MConvert.toWhereSql(_args.getValue("jsonCondition")) + ";";
                responseText = baseApi.execQuery(_sql, _args.getValue("keyFields"), _args.getValue("type"), _args.getValue("tkId"));
            }
            break;
        case "getBackMSDetailForProject":
            args = new string[,] { 
                { "keyFields", "*" },
                { "proId", "0" }, 
                { "type", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sql = "select {0} from dbo.SYS_WH_MS ms left join dbo.{1}_DETAIL detail on ms.id=detail.msId where detail.notUsed<>0 and detail.state=741 and detail.proId={2};";
                
                responseText = baseApi.execQuery(_sql, _args.getValue("keyFields"), _args.getValue("type"), _args.getValue("proId"));
            }
            break;
        case "getGLMSDetailForTK":
            args = new string[,] { 
                { "keyFields", "*" },
                { "jsonCondition", "1=1" }, 
                { "type", null },
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sql = "select {0} from dbo.GENERAL_MS ms left join dbo.{1}_DETAIL detail on ms.id=detail.msId where detail.oid={2} and " + MConvert.toWhereSql(_args.getValue("jsonCondition")) + ";";
                responseText = baseApi.execQuery(_sql, _args.getValue("keyFields"), _args.getValue("type"), _args.getValue("tkId"));
            }
            break;
        case "getOfficeMSDetailForTK":
            args = new string[,] { 
                { "keyFields", "*" },
                { "jsonCondition", "1=1" }, 
                { "type", null },
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _sql = "select {0} from dbo.SYS_WH_MS_DETAIL ms left join dbo.{1}_DETAIL detail on ms.id=detail.msId where detail.oid={2} and " + MConvert.toWhereSql(_args.getValue("jsonCondition")) + ";";
                responseText = baseApi.execQuery(_sql, _args.getValue("keyFields"), _args.getValue("type"), _args.getValue("tkId"));
            }
            break;
        case "onReceiveComplete":
            args = new string[,] { 
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = new Ticket(baseApi).onReceiveComplete(_args.getValue("tkId"));
            }
            break;
        case "onSendComplete":
            args = new string[,] { 
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = new Ticket(baseApi).onSendComplete(_args.getValue("tkId"));
            }
            break;
        case "onAllocateComplete":
            args = new string[,] { 
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = new Ticket(baseApi).onAllocateComplete(_args.getValue("tkId"));
            }
            break;
        case "onBackComplete":
            args = new string[,] { 
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = new Ticket(baseApi).onBackComplete(_args.getValue("tkId"));
            }
            break;
        case "onYHSendComplete":
            args = new string[,] { 
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = new Ticket(baseApi).onYHSendComplete(_args.getValue("tkId"));
            }
            break;
        case "onGLReceiveComplete":
            args = new string[,] { 
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = new Ticket(baseApi).onGLReceiveComplete(_args.getValue("tkId"));
            }
            break;
        case "onGLSendComplete":
            args = new string[,] { 
                { "tkId", null }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = new Ticket(baseApi).onGLSendComplete(_args.getValue("tkId"));
            }
            break;
        case "getBackMSDetail":
            args = new string[,] { 
                { "keyFields", "*" },
                { "msId", null },
                { "proId", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _msId = _args.getValue("msId"), _proId = _args.getValue("proId"), _sql = String.Empty;
                _sql = "select {0}, (select sum(remainNum) from dbo.TK_WH_SEND_DETAIL where msId=ms.id and batchId<>0 and proId={1}) as stockNumber from dbo.SYS_WH_MS as ms where ms.id={2};";
                responseText = baseApi.execQuery(_sql, _args.getValue("keyFields"), _args.getValue("proId"), _args.getValue("msId"));
            }
            break;
        default :
            responseText = Native.getErrorMsg("调用接口不对或不存在");
            break;
    }
    Native.writeToPage(responseText); 
%>