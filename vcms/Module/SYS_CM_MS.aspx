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
    string [,] args;
    MFile file = new MFile();
    Json _args = null;
    switch (action) {
        case "pagingForMSDetail":
            args = new string[,] { 
                { "code", "*" },
                { "keyFields", "*" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "jsonCondition", ""},
                { "orderCondition", "{\"cTime\":\"desc\"}" },
                { "filterCondition", "" },
                { "delFlag", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.paging("SYS_WH_MS_DETAIL", _args.getInt("pageIndex"), _args.getInt("pageSize"), _args.getValue("keyFields"), "CHARINDEX('"+_args.getValue("code")+"', msCode)<>0", MConvert.toOrderSql(_args.getValue("orderCondition")), _args.getInt("delFlag"));
            }
            break;
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
                        string _existCode = _trans.execScalar(MString.getSelectStr("SYS_WH_MS", "code", "code='" + _typeCode + "'"));
                        if (!Native.isNullEmpty(_existCode))
                        {
                            continue;
                        }
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

                        string _existCode = _trans.execScalar(MString.getSelectStr("SYS_WH_MS_DETAIL", "msCode", "msCode='" + _msCode + "'"));
                        if (!Native.isNullEmpty(_existCode))
                        {
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
        case "importCaiGouOrder":
            args = new string[,] { 
                { "path", "../App_Data/采购订单执行查询.xls" },
                { "ifReset" , "0"}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    DataSet _ds = ExeclUtil.ImportXlsToDataSet(MapPath(_args.getValue("path")));
                    DataTable _t0 = _ds.Tables[0];
                    DataRowCollection _rows = _t0.Rows;
                    DataRow _row;
                    Hashtable codeMapIDHS = new Hashtable();
                    
                    string _ifReset = _args.getValue("ifReset");

                    if (_ifReset == "1") {
                        _trans.execNonQuery("truncate table PROJECT_CAIGOU;");
                        _trans.execNonQuery("truncate table PROJECT_CAIGOU_DETAIL;");
                    }

                    ArrayList msAry = _trans.execJsonList(MString.getSelectStr("PROJECT_CAIGOU", "id, code", "len(code)=8"));
                    for (int i = 0, _len = msAry.Count; i < _len; i++)
                    {
                        Json ms = (Json)msAry[i];
                        codeMapIDHS.Add(ms.getValue("code"), ms.getValue("id"));
                    }

                    if (_args.getInt("ifReset") == 1)
                    {
                        _trans.execNonQuery("truncate table SYS_WH_MS_DETAIL");
                    }
                    string _typeId = String.Empty;
                    string _values = "";
                    string _keys = "typeId, msCode, nodeName, version, typeName, guiGe, danWei, shuiZhong";
                    double _wuShuiJinECount = 0, _jiaShuiHeJiCount = 0;
                    string _preId = "";
                    for (int i = 0, _len = _rows.Count; i < _len; i++)
                    {
                        _row = _rows[i];
                        string _code = _row[1].ToString();
                        if (_code.Length != 18)
                        {
                            continue;
                        }

                        string _existCode = _trans.execScalar(MString.getSelectStr("PROJECT_CAIGOU", "code", "code='" + _code + "'"));
                        if (!Native.isNullEmpty(_existCode))
                        {
                            continue;
                        }

                        string _gongYingShang = _row[3].ToString();
                        string _caiGouPerson = _row[4].ToString();
                        string _caiGouDept = _row[5].ToString();
                        string _orderTime = _row[6].ToString();
                        string _proCode = _row[9].ToString();
                        string _proName = _row[10].ToString();
                        
                        string _msType = _row[11].ToString();
                        string _msCode = _row[12].ToString();
                        string _msName = _row[13].ToString();
                        string _guiGe = _row[14].ToString();
                        string _xingHao = _row[15].ToString();
                        string _danWei = _row[16].ToString();
                        string _num = _row[17].ToString();
                        string _shuiLv = _row[18].ToString();
                        string _wuShuiJinJia = _row[19].ToString();
                        string _hanShuiJinJia = _row[20].ToString();
                        string _wuShuiJinE = _row[21].ToString();
                        string _jiaShuiHeJi = _row[22].ToString();
                        string _shuiE = _row[23].ToString();
                        string _kouShuiLeiBei = _row[24].ToString();
                        
                        string _arrivedTime = _row[25].ToString();
                        
                        
                        object tid = codeMapIDHS[_code];
                        if (tid == null) {
                            _keys = "code, proName, proCode, orderTime, arrivedTime, caiGouPerson, caiGouDept, gongYingShang";
                            _values = "'"+_code+"','"+_proName+"','"+_proCode+"','"+_orderTime+"','"+_arrivedTime+"','"+_caiGouPerson+"','"+_caiGouDept+"','"+_gongYingShang+"'";
                            tid = _trans.addRow("PROJECT_CAIGOU", _keys, _values);
                            codeMapIDHS[_code] = tid;
                            if (!Native.isNullEmpty(_preId) && _wuShuiJinECount != 0 && _jiaShuiHeJiCount != 0) {
                                _trans.execNonQuery(MString.getUpdateStr("PROJECT_CAIGOU", "wuShuiJinE=" + _wuShuiJinECount + ", jiaShuiHeJi=" + _jiaShuiHeJiCount, "id=" + _preId));
                            }
                            _wuShuiJinECount = 0;
                            _jiaShuiHeJiCount = 0;
                            _preId = tid.ToString();
                        }
                        
                        if (tid != null)
                        {
                            _wuShuiJinECount = _wuShuiJinECount + Convert.ToDouble(_wuShuiJinE);
                            _jiaShuiHeJiCount = _jiaShuiHeJiCount + Convert.ToDouble(_jiaShuiHeJi);
                            _keys = "caiGouId, msCode, msType, msName, guiGe, danWei, num, shuiLv, wuShuiJinJia, hanShuiJinJia, wuShuiJinE, jiaShuiHeJi, shuiE, kouShuiLeiBei";
                            _values = tid.ToString() + ",'" + _msCode + "','" + _msType + "','" + _msName + "','" + _guiGe + "','" + _danWei + "'," + _num + "," + _shuiLv + "," + _wuShuiJinJia + "," + _hanShuiJinJia + "," + _wuShuiJinE + "," + _jiaShuiHeJi + "," + _shuiE + ",'" + _kouShuiLeiBei + "'";
                            _trans.execNonQuery(MString.getInsertStr("PROJECT_CAIGOU_DETAIL", _keys, _values));
                        }
                    }
                    if (!Native.isNullEmpty(_preId) && _wuShuiJinECount != 0 && _jiaShuiHeJiCount != 0)
                    {
                        _trans.execNonQuery(MString.getUpdateStr("PROJECT_CAIGOU", "wuShuiJinE=" + _wuShuiJinECount + ", jiaShuiHeJi=" + _jiaShuiHeJiCount, "id=" + _preId));
                    }
                    responseText = "导入成功";
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
        case "importProject":
            args = new string[,] { 
                { "path", "../App_Data/project/2015年劳服道路排管台账.xls" },
                { "ifReset" , "0"}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    DataSet _ds = ExeclUtil.ImportXlsToDataSet(MapPath(_args.getValue("path")));
                    DataTable _t0 = _ds.Tables[0];
                    DataRowCollection _rows = _t0.Rows;
                    DataRow _row;
                    
                    string _typeId = String.Empty;
                    string _keys = "proType, collectTime, proCode, address, note, heTongCode, heTongPrice, execTeamName, execTeamLeader, execTeamLeaderMobile, bTime, eTime";
                    for (int i = 1, _len = _rows.Count; i < _len; i++)
                    {
                        _row = _rows[i];
                        string type = "457";
                        string collectTime = _row[1].ToString();
                        string proCode = _row[2].ToString();
                        string address = _row[3].ToString();
                        string note = _row[4].ToString();
                        string heTongCode = _row[5].ToString();
                        string heTongPrice = _row[6].ToString();
                        string execTeamName = _row[7].ToString();
                        string execTeamLeader = _row[8].ToString();
                        string execTeamLeaderMobile = _row[9].ToString();
                        string bTime = _row[10].ToString();
                        string eTime = _row[10].ToString();
                        if (heTongPrice == "") {
                            heTongPrice = "0";
                        }
                        if (!Native.isNullEmpty(proCode)) {
                            Native.write(MString.getInsertStr("PRO_MG", _keys, type + ",'" + collectTime + "','" + proCode + "','" + address + "','" + note + "','" + heTongCode + "','" + heTongPrice + "','" + execTeamName + "','" + execTeamLeader + "','" + execTeamLeaderMobile + "','" + bTime + "','" + eTime + "'")+"<br>");
                            //_trans.execNonQuery(MString.getInsertStr("PRO_MG", _keys, type + ",'" + collectTime + "','" + proCode + "','" + address + "','" + note + "','" + heTongCode + "','" + heTongPrice + "','" + execTeamName + "','" + execTeamLeader + "','" + execTeamLeaderMobile + "','" + bTime + "','" + eTime + "'"));
                        }
                    }
                    _trans.commit();
                    responseText = "倒入成功";
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
        case "importEnterprise":
            args = new string[,] { 
                { "path", "../App_Data/project/2015年劳服改困台账.xls" },
                { "ifReset" , "0"}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                System.Web.HttpPostedFile _file = Request.Files[0];
                string _fPath = Server.MapPath("../uploads/enterprise/"); 
                string _orig, _ext, _new;
                string[] _fTemp = _file.FileName.Split('/');
                _orig = _fTemp[_fTemp.Length - 1];
                _ext = file.getFileSuffix(_orig);
                _new = _file.FileName + "." + _ext;
                MFile.createFile(_fPath);
                _file.SaveAs(_fPath + _new);

                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    DataSet _ds = ExeclUtil.ImportXlsToDataSet(MapPath("../uploads/enterprise/"+_new));
                    DataTable _t0 = _ds.Tables[0];
                    DataRowCollection _rows = _t0.Rows;
                    DataRow _row;

                    string _typeId = String.Empty;
                    string _keys = "title, collectTime, jieShuiCode, proCode, jieShuiDanCode, address, note, shouYiHu, applyDanWei, applyContact, applyMobile, execTeamName, execTeamLeader, execTeamLeaderMobile, xiuFuTeam, xiuFuContact, xiuFuMobile, bTime, eTime, planCost";
                    for (int i = 1, _len = _rows.Count; i < _len; i++)
                    {
                        _row = _rows[i];
                        string title = _row[1].ToString();
                        string type = _row[2].ToString();
                        string country = _row[3].ToString();
                        string province = _row[4].ToString();
                        string address = _row[5].ToString();
                        string contactPhone = _row[6].ToString();
                        string contact = _row[7].ToString();
                        string website = _row[8].ToString();
                        string note = _row[9].ToString();
                        string product = _row[10].ToString();
                        _trans.execNonQuery(MString.getInsertStr("PRO_MG", _keys, type + ",'" + collectTime + "','" + jieShuiCode + "','" + proCode + "','" + jieShuiDan + "','" + address + "','" + note + "','" + shouYiHu + "','" + applyDanWei + "','" + applyContact + "','" + applyMobile + "','" + execTeamName + "','" + execTeamLeader + "','" + execTeamLeaderMobile + "','" + applyDanWei + "','" + applyContact + "','" + applyMobile + "','" + bTime + "','" + eTime + "', "+planCost));
                    }
                    _trans.commit();
                    responseText = "倒入成功";
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
        case "gaiKun":
            args = new string[,] { 
                { "path", "../App_Data/project/2015年劳服改困台账.xls" },
                { "ifReset" , "0"}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    DataSet _ds = ExeclUtil.ImportXlsToDataSet(MapPath(_args.getValue("path")));
                    DataTable _t0 = _ds.Tables[0];
                    DataRowCollection _rows = _t0.Rows;
                    DataRow _row;

                    string _typeId = String.Empty;
                    string _keys = "proType, collectTime, jieShuiCode, proCode, jieShuiDanCode, address, note, shouYiHu, applyDanWei, applyContact, applyMobile, execTeamName, execTeamLeader, execTeamLeaderMobile, xiuFuTeam, xiuFuContact, xiuFuMobile, bTime, eTime, planCost";
                    for (int i = 1, _len = _rows.Count; i < _len; i++)
                    {
                        _row = _rows[i];
                        string type = "463";
                        string collectTime = _row[1].ToString();
                        string jieShuiCode = _row[2].ToString();
                        string proCode = _row[3].ToString();
                        string jieShuiDan = _row[4].ToString();
                        string quMing = _row[5].ToString();
                        string address = _row[6].ToString();
                        string note = _row[7].ToString();
                        string shouYiHu = _row[8].ToString();
                        string applyDanWei = _row[9].ToString();
                        string applyContact = _row[10].ToString();
                        string applyMobile = _row[11].ToString();
                        
                        string execTeamName = _row[12].ToString();
                        string execTeamLeader = _row[13].ToString();
                        string execTeamLeaderMobile = _row[14].ToString();
                        string xiuFuTeam = _row[15].ToString();
                        string xiuFuContact = _row[16].ToString();
                        string xiuFuMobile = _row[17].ToString();
                        string bTime = _row[18].ToString();
                        string eTime = _row[19].ToString();
                        string planCost = _row[21].ToString();
                        if (planCost == "")
                        {
                            planCost = "0";
                        }
                        if (!Native.isNullEmpty(jieShuiCode))
                        {
                            string _sql = MString.getInsertStr("PRO_MG", _keys, type + ",'" + collectTime + "','" + jieShuiCode + "','" + proCode + "','" + jieShuiDan + "','" + address + "','" + note + "','" + shouYiHu + "','" + applyDanWei + "','" + applyContact + "','" + applyMobile + "','" + execTeamName + "','" + execTeamLeader + "','" + execTeamLeaderMobile + "','" + applyDanWei + "','" + applyContact + "','" + applyMobile + "','" + bTime + "','" + eTime + "', "+planCost);
                            Native.write(_sql + "<br>");
                            //_trans.execNonQuery();
                        }
                    }
                    _trans.commit();
                    responseText = "倒入成功";
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
        case "zongBiaoFengZhuang":
            args = new string[,] { 
                { "path", "../App_Data/project/2015年劳服总表分装台账.xls" },
                { "ifReset" , "0"}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    DataSet _ds = ExeclUtil.ImportXlsToDataSet(MapPath(_args.getValue("path")));
                    DataTable _t0 = _ds.Tables[0];
                    DataRowCollection _rows = _t0.Rows;
                    DataRow _row;

                    string _typeId = String.Empty;
                    string _keys = "proType, collectTime, jieShuiCode, address, applyDanWei,applyContact,applyMobile,hu,shouYiHu, note, execTeamName, execTeamLeader, execTeamLeaderMobile, jieShuiDanCode, bTime";
                    for (int i = 1, _len = _rows.Count; i < _len; i++)
                    {
                        _row = _rows[i];
                        string type = "464";
                        string collectTime = _row[1].ToString();
                        string jieShuiCode = _row[3].ToString();
                        string address = _row[4].ToString();
                        string applyDanWei = _row[5].ToString();
                        string applyContact = _row[6].ToString();
                        string applyMobile = _row[7].ToString();

                        string hu = _row[9].ToString();
                        string shouYiHu = _row[10].ToString();
                        string note = _row[11].ToString();
                        string execTeamName = _row[12].ToString();
                        string execTeamLeader = _row[13].ToString();
                        string execTeamLeaderMobile = _row[14].ToString();

                        string jieShuiDanCode = _row[15].ToString();
                        string bTime = _row[16].ToString();
                        
                        
                        if (!Native.isNullEmpty(jieShuiCode))
                        {
                            string _sql = MString.getInsertStr("PRO_MG", _keys, type + ",'" + collectTime + "','" + jieShuiCode + "','" + address + "','" + applyDanWei + "','" + applyContact + "','" + applyMobile + "','" + hu + "','" + shouYiHu + "','" + note + "','" + execTeamName + "','" + execTeamLeader + "','" + execTeamLeaderMobile + "','" + jieShuiDanCode + "','" + bTime + "'");
                            Native.write(_sql + "<br>");
                            //_trans.execNonQuery();
                        }
                    }
                    _trans.commit();
                    responseText = "倒入成功";
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
        case "zhongXinDaiBan":
            args = new string[,] { 
                { "path", "../App_Data/project/2015年劳服中心泵房代办台账.xlsx" },
                { "ifReset" , "0"}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    DataSet _ds = ExeclUtil.ImportXlsToDataSet(MapPath(_args.getValue("path")));
                    DataTable _t0 = _ds.Tables[0];
                    DataRowCollection _rows = _t0.Rows;
                    DataRow _row;

                    string _typeId = String.Empty;
                    string _keys = "proType, collectTime, proCode, address, note,execTeamName, execTeamLeader, execTeamLeaderMobile, heTongPrice, applyDanWei, applyContact,applyMobile,jieShuiCode,heTongCode, bTime";
                    for (int i = 1, _len = _rows.Count; i < _len; i++)
                    {
                        _row = _rows[i];
                        string type = "770";
                        string collectTime = _row[1].ToString();
                        string proCode = _row[2].ToString();
                        string address = _row[4].ToString();
                        string note = _row[5].ToString();

                        string execTeamName = _row[6].ToString();
                        string execTeamLeader = _row[7].ToString();
                        string execTeamLeaderMobile = _row[8].ToString();

                        string heTongPrice = _row[9].ToString();

                        string applyDanWei = _row[10].ToString();
                        string applyContact = _row[11].ToString();
                        string applyMobile = _row[12].ToString();

                        string jieShuiCode = _row[13].ToString();
                        string heTongCode = _row[14].ToString();
                        string bTime = _row[16].ToString();


                        if (!Native.isNullEmpty(jieShuiCode))
                        {
                            string _sql = MString.getInsertStr("PRO_MG", _keys, type + ",'" + collectTime + "','" + proCode + "','" + address + "','" + note + "','" + execTeamName + "','" + execTeamLeader + "','" + execTeamLeaderMobile + "','" + heTongPrice + "','" + applyDanWei + "','" + applyContact + "','" + applyMobile + "','" + jieShuiCode + "','" + heTongCode + "','" + bTime + "'");
                            Native.write(_sql + "<br>");
                            //_trans.execNonQuery();
                        }
                    }
                    _trans.commit();
                    responseText = "倒入成功";
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
        case "zhongXinShiZhengDaiBan":
            args = new string[,] { 
                { "path", "../App_Data/project/2015年劳服市政代办（中心）.xls" },
                { "ifReset" , "0"}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    DataSet _ds = ExeclUtil.ImportXlsToDataSet(MapPath(_args.getValue("path")));
                    DataTable _t0 = _ds.Tables[0];
                    DataRowCollection _rows = _t0.Rows;
                    DataRow _row;

                    string _typeId = String.Empty;
                    string _keys = "proType, collectTime, proCode1, proCode, address, note, applyDanWei, applyContact, applyMobile, heTongPrice, execTeamName, execTeamLeader, execTeamLeaderMobile, bTime, eTime";
                    for (int i = 1, _len = _rows.Count; i < _len; i++)
                    {
                        _row = _rows[i];
                        string type = "465";
                        string collectTime = _row[1].ToString();
                        string proCode1 = _row[2].ToString();
                        string proCode = _row[3].ToString();
                        string address = _row[4].ToString();
                        string note = _row[5].ToString();

                        string applyDanWei = _row[6].ToString();
                        string applyContact = _row[7].ToString();
                        string applyMobile = _row[8].ToString();

                        string heTongPrice = _row[9].ToString();
                        
                        string execTeamName = _row[10].ToString();
                        string execTeamLeader = _row[11].ToString();
                        string execTeamLeaderMobile = _row[12].ToString();

                        string bTime = _row[13].ToString();
                        string eTime = _row[14].ToString();


                        if (heTongPrice == "")
                        {
                            heTongPrice = "0";
                        }
                        

                        if (!Native.isNullEmpty(proCode))
                        {
                            string _sql = MString.getInsertStr("PRO_MG", _keys, type + ",'" + collectTime + "','" + proCode1 + "','" + proCode + "','" + address + "','" + note + "','" + applyDanWei + "','" + applyContact + "','" + applyMobile + "','" + heTongPrice + "','" + execTeamName + "','" + execTeamLeader + "','" + execTeamLeaderMobile + "','" + bTime + "','" + eTime + "'");
                            Native.write(_sql + "<br>");
                            //_trans.execNonQuery();
                        }
                    }
                    _trans.commit();
                    responseText = "倒入成功";
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
        case "guanLiSuoDaiBan":
            args = new string[,] { 
                { "path", "../App_Data/project/2015年劳服市政代办(管理所）.xls" },
                { "ifReset" , "0"}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    DataSet _ds = ExeclUtil.ImportXlsToDataSet(MapPath(_args.getValue("path")));
                    DataTable _t0 = _ds.Tables[0];
                    DataRowCollection _rows = _t0.Rows;
                    DataRow _row;

                    string _typeId = String.Empty;
                    string _keys = "proType, collectTime, proCode1, proCode, address, note, applyDanWei, applyContact, applyMobile, heTongPrice, execTeamName, execTeamLeader, execTeamLeaderMobile, bTime, eTime";
                    for (int i = 1, _len = _rows.Count; i < _len; i++)
                    {
                        _row = _rows[i];
                        string type = "769";
                        string collectTime = _row[1].ToString();
                        string proCode1 = _row[2].ToString();
                        string proCode = _row[3].ToString();
                        string address = _row[4].ToString();
                        string note = _row[5].ToString();

                        string applyDanWei = _row[6].ToString();
                        string applyContact = _row[7].ToString();
                        string applyMobile = _row[8].ToString();

                        string heTongPrice = _row[9].ToString();

                        string execTeamName = _row[10].ToString();
                        string execTeamLeader = _row[11].ToString();
                        string execTeamLeaderMobile = _row[12].ToString();

                        string bTime = _row[13].ToString();
                        string eTime = _row[14].ToString();


                        if (heTongPrice == "")
                        {
                            heTongPrice = "0";
                        }


                        if (!Native.isNullEmpty(proCode))
                        {
                            string _sql = MString.getInsertStr("PRO_MG", _keys, type + ",'" + collectTime + "','" + proCode1 + "','" + proCode + "','" + address + "','" + note + "','" + applyDanWei + "','" + applyContact + "','" + applyMobile + "','" + heTongPrice + "','" + execTeamName + "','" + execTeamLeader + "','" + execTeamLeaderMobile + "','" + bTime + "','" + eTime + "'");
                            Native.write(_sql + "<br>");
                            //_trans.execNonQuery();
                        }
                    }
                    _trans.commit();
                    responseText = "倒入成功";
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
        case "paiGuan":
            args = new string[,] { 
                { "path", "../App_Data/project/2015年劳服街坊排管台账.xlsx" },
                { "ifReset" , "0"}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    DataSet _ds = ExeclUtil.ImportXlsToDataSet(MapPath(_args.getValue("path")));
                    DataTable _t0 = _ds.Tables[0];
                    DataRowCollection _rows = _t0.Rows;
                    DataRow _row;

                    string _typeId = String.Empty;
                    string _keys = "proType, collectTime, proCode, address, note, execTeamName, execTeamLeader, execTeamLeaderMobile, acreage, applyDanWei, applyContact, applyMobile, jieShuiCode, jieShuiDanCode, bTime, eTime";
                    for (int i = 1, _len = _rows.Count; i < _len; i++)
                    {
                        _row = _rows[i];
                        string type = "768";
                        string collectTime = _row[1].ToString();
                        string proCode = _row[2].ToString();
                        string address = _row[4].ToString();
                        string note = _row[5].ToString();

                        string acreage = _row[9].ToString();

                        string applyDanWei = _row[12].ToString();
                        string applyContact = _row[13].ToString();
                        string applyMobile = _row[14].ToString();

                        string jieShuiCode = _row[15].ToString();
                        string jieShuiDanCode = _row[16].ToString();
                        

                        string execTeamName = _row[6].ToString();
                        string execTeamLeader = _row[7].ToString();
                        string execTeamLeaderMobile = _row[8].ToString();

                        string bTime = _row[17].ToString();
                        string eTime = _row[18].ToString();


                        if (acreage == "")
                        {
                            acreage = "0";
                        }


                        if (!Native.isNullEmpty(proCode))
                        {
                            string _sql = MString.getInsertStr("PRO_MG", _keys, type + ",'" + collectTime + "','" + proCode + "','" + address + "','" + note + "','" + execTeamName + "','" + execTeamLeader + "','" + execTeamLeaderMobile + "','" + acreage + "','" + applyDanWei + "','" + applyContact + "','" + applyMobile + "','" + jieShuiCode + "','" + jieShuiDanCode + "','" + bTime + "','" + eTime + "'");
                            Native.write(_sql + "<br>");
                            //_trans.execNonQuery();
                        }
                    }
                    _trans.commit();
                    responseText = "倒入成功";
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
        case "uploadMSFile":
            args = new string[,] { 
                { "type", "*" },
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                System.Web.HttpPostedFile _file = Request.Files[0];
                string _fPath = Server.MapPath("../uploads/ms/");
                string _type = _args.getValue("type");
                string _sys, _orig, _ext, _new;
                string[] _fTemp = _file.FileName.Split('/');
                _orig = _fTemp[_fTemp.Length - 1];
                _ext = file.getFileSuffix(_orig);
                _sys = file.getFileTempName();
                _new = _sys + "." + _ext;
                MFile.createFile(_fPath);
                _file.SaveAs(_fPath + _new);
                string _keys = "nodeName, sys, ext, orign, catelog, path, size, type";
                string _values = "'" + _orig + "','" + _sys + "','" + _ext + "','" + _orig + "','uploads/ms/','../uploads/ms/" + _new + "','" + _file.ContentLength.ToString() + "'," + _type;
                baseApi.execQuery(MString.getInsertStr("SYS_WH_MS_FILES", _keys, _values));
                responseText = "[{\"fileName\": \"" + _new + "\"}]";
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
        default :
            responseText = Native.getErrorMsg("调用接口不对或不存在");
            break;
    }
    Native.writeToPage(responseText); 
%>