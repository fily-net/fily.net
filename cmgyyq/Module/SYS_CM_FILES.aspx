<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="Fily.Util" %>
<%@ Import Namespace="Fily.Office" %>
<%@ Import Namespace="System.Data" %>
<% 
    /**
     * file 相关接口
     **/

    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    string action = Native.getAction(), responseText = String.Empty;
    MFile file = new MFile();
    string T_SYS_FILE = "SYS_CM_FILES";
    string [,] args;
    Json hash = null;
    switch (action) {
        case "getFiles"://获取特殊文件的状态：是否已经上传
            args = new string[,] { { "fileNames", null }, { "ifSpecialFile", null } };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _fields = "origName+'.'+extName";
                if (hash["ifSpecialFile"].ToString() == "1") { _fields = "origName"; }
                responseText = baseApi.execQuery("SELECT DISTINCT id,origName,extName FROM " + T_SYS_FILE + " where " + _fields + " in (" + hash["fileNames"].ToString() + ") order by origName;");
            }
            break;
        case "uploadFile":
            args = new string[,] { 
                { "keyFields", "*" },
                { "mId", "4" },
                { "catelog", "" }, //0：表示测试目录  目录ID
                { "catelogId", "0" }, //0：表示测试目录  目录ID
                { "specialFileName", "" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                SqlTrans trans = new SqlTrans(baseApi);
                try
                {
                    baseApi.setDataType("html");
                    System.Web.HttpPostedFile _file = Request.Files[0];
                    string _catelog = hash.getValue("catelog");
                    if (Native.isEmpty(_catelog)) { 
                        _catelog = trans.execScalar("select dbo.SYS_TRANS_FN(" + hash.getValue("catelogId") + ");");
                        if (!Native.isEmpty(_catelog)) { _catelog += "custom/" + _catelog; }
                    }
                    if (Native.isEmpty(_catelog)) { _catelog = "test"; }
                    string _fPath = Server.MapPath(file.getUploadPath() + "/" + _catelog);
                    string _orig, _ext, _sys = file.getFileTempName(), _fileID = String.Empty, _origFull, _sfn = hash.getValue("specialFileName");
                    string _k = "nodeName,sysName,extName,origName,catelog,size,type";
                    string[] _fTemp = _file.FileName.Split('/'), _sfnAry = _sfn.Split('.');
                    _orig = _fTemp[_fTemp.Length - 1];
                    string _saveAsPath = _fPath + "/" + _sys;
                    if (Native.isEmpty(_orig))
                    {
                        responseText = Native.getErrorMsg("上传文件不存在");
                    }
                    else {
                        MFile.createFile(_fPath);
                        if (Native.isEmpty(_sfn))
                        {
                            _ext = file.getFileSuffix(_orig); _origFull = _orig;
                            _orig = _orig.Substring(0, _orig.Length - _ext.Length - 1);
                            string _v = "'" + _origFull + "','" + _sys + "','" + _ext + "','" + _orig + "','" + _catelog + "'," + _file.ContentLength + ",1";
                            _fileID = trans.addTreeNode(T_SYS_FILE, hash.getInt("mId"), _k, _v);
                            _file.SaveAs(_fPath + "\\" + _sys + "." + _ext);
                            
                        }
                        else {
                            _orig = _sfnAry[0]; _ext = _sfnAry[1]; _fileID = _sfnAry[2]; _origFull = _orig + "." + _ext;
                            if (_fileID != "0")
                            {
                                string _tempPath = trans.execScalar(MString.getSelectStr(T_SYS_FILE, "sysName+'.'+extName", "id=" + _fileID));
                                file.deleteFile(_fPath + "/" + _tempPath);
                                _file.SaveAs(_fPath + "/" + _tempPath);
                            }
                            else {
                                string _v = "'" + _origFull + "','" + _sys + "','" + _ext + "','" + _orig + "','" + _catelog + "'," + _file.ContentLength + ",1";
                                _fileID = trans.addTreeNode(T_SYS_FILE, hash.getInt("mId"), _k, _v);
                                _file.SaveAs(_saveAsPath + "." + _ext);
                            }
                        }
                        baseApi.setDataType("json");
                        responseText = trans.execReader(MString.getSelectStr(T_SYS_FILE, hash.getValue("keyFields"), Convert.ToInt16(_fileID)));
                        /* 
                        switch (_ext)
                        {
                            case "doc":
                            case "docx":
                                Office2PDFHelper.DOCConvertToPDF(_saveAsPath + "." + _ext, _saveAsPath + ".pdf");
                                break;
                            case "xls":
                            case "xlsx":
                                Office2PDFHelper.XLSConvertToPDF(_saveAsPath + "." + _ext, _saveAsPath + ".pdf");
                                break;
                            case "ppt":
                            case "pptx":
                                Office2PDFHelper.PPTConvertToPDF(_saveAsPath + "." + _ext, _saveAsPath + ".pdf");
                                break;
                        }*/
                    }
                    trans.commit();
                }
                catch (Exception e)
                {
                    responseText = Native.getErrorMsg(e.Message);
                    trans.rollback();
                }
                finally {
                    trans.close();
                }
            }
            break;
        case "uploadAvatar":
            args = new string[,] { 
                { "id", "*" },
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                System.Web.HttpPostedFile _file = Request.Files[0];
                string _fPath = Server.MapPath("../images/avatar/"); 
                int _id = hash.getInt("id");
                string _orig, _ext, _new;
                string[] _fTemp = _file.FileName.Split('/');
                _orig = _fTemp[_fTemp.Length - 1];
                _ext = file.getFileSuffix(_orig);
                _new = _id + "." + _ext;
                MFile.createFile(_fPath);
                _file.SaveAs(_fPath + _new);
                baseApi.execQuery(MString.getUpdateStr("SYS_CM_USER", "avatar='" + _new + "'", _id));
                responseText = "[{\"fileName\": \""+_new+"\"}]";
            }
            break;
        case "uploadMSFile":
            args = new string[,] { 
                { "type", "*" },
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                System.Web.HttpPostedFile _file = Request.Files[0];
                string _fPath = Server.MapPath("../uploads/ms/");
                string _type = hash.getValue("type");
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
                responseText = "[{\"nodeName\": \"" + _new + "\"}]";
            }
            break;
        case "uploadMSDetail":
            args = new string[,] { 
                { "type", "*" },
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                System.Web.HttpPostedFile _file = Request.Files[0];
                string _fPath = Server.MapPath("../uploads/ms/");
                string _type = hash.getValue("type");
                string _sys, _orig, _ext, _new, _path;
                string[] _fTemp = _file.FileName.Split('/');
                _orig = _fTemp[_fTemp.Length - 1];
                _ext = file.getFileSuffix(_orig);
                _sys = file.getFileTempName();
                _new = _sys + "." + _ext;
                MFile.createFile(_fPath);
                _file.SaveAs(_fPath + _new);

                _path = "../uploads/ms/" + _new;

                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    DataSet _ds = ExeclUtil.ImportXlsToDataSet(MapPath(_path));
                    DataTable _t0 = _ds.Tables[0];
                    DataRowCollection _rows = _t0.Rows;
                    DataRow _row;
                    Hashtable codeMapIDHS = new Hashtable();

                    ArrayList msAry = _trans.execJsonList(MString.getSelectStr("PROJECT_CAIGOU", "id, code", "len(code)=8"));
                    for (int i = 0, _len = msAry.Count; i < _len; i++)
                    {
                        Json ms = (Json)msAry[i];
                        codeMapIDHS.Add(ms.getValue("code"), ms.getValue("id"));
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

                        string _existCode = _trans.execScalar(MString.getSelectStr("PROJECT_CAIGOU", "code", "code='" + _code + "'"));
                        if (!Native.isNullEmpty(_existCode)) {
                            continue;
                        }

                        object tid = codeMapIDHS[_code];
                        if (tid == null)
                        {
                            _keys = "code, proName, proCode, orderTime, arrivedTime, caiGouPerson, caiGouDept, gongYingShang";
                            _values = "'" + _code + "','" + _proName + "','" + _proCode + "','" + _orderTime + "','" + _arrivedTime + "','" + _caiGouPerson + "','" + _caiGouDept + "','" + _gongYingShang + "'";
                            tid = _trans.addRow("PROJECT_CAIGOU", _keys, _values);
                            codeMapIDHS[_code] = tid;
                            if (!Native.isNullEmpty(_preId) && _wuShuiJinECount != 0 && _jiaShuiHeJiCount != 0)
                            {
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
                    responseText = "[{\"nodeName\": \"" + _path + "\"}]";
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
        case "getFilesList"://获取文件列表
            args = new string[,] { 
                { "keyFields", "*" },
                { "link", "," },
                { "jsonCondition", "1=1" }, 
                { "jsonOrder", "{\"cTime\":1}" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _whereSql = MConvert.toWhereSql(hash.getValue("jsonCondition")), _link = hash.getValue("link");
                if (_link.Length>0) { _whereSql +=  " and id in (0"+_link+"0)"; }
                responseText = baseApi.select(T_SYS_FILE, hash.getValue("keyFields"), _whereSql, "cTime", "asc");
            }
            break;
        case "getFilesByLink"://获取文件列表
            args = new string[,] { 
                { "keyFields", "*" },
                { "link", "," },
                { "jsonCondition", "1=1" }, 
                { "jsonOrder", "{\"cTime\":1}" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _whereSql = MConvert.toWhereSql(hash.getValue("jsonCondition")), _link = hash.getValue("link");
                _whereSql += " and id in (0" + _link + "0)";
                responseText = baseApi.select(T_SYS_FILE, hash.getValue("keyFields"), _whereSql, "cTime", "asc");
            }
            break;
        case "downloadFile": //下载文件
            args = new string[,] { { "id", null } };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _sql = "select catelog+'/'+sysName+'.'+extName as filePath, nodeName as fileName from "+T_SYS_FILE+" where id=" + hash.getValue("id") + ";";
                string _strVal = baseApi.execQuery(_sql);
                if(Native.isEmpty(_strVal)){
                    responseText = Native.getErrorMsg("文件不存在");
                }else {
                    string[] _ary = _strVal.Split(Convert.ToChar(baseApi.getCSplit()));
                    responseText = file.downloadFile(_ary[1], Server.MapPath(file.getUploadPath() + "/" + _ary[0]), 1024000);
                }
            }
            break;
        case "delFileOrDir": //删除文件或者目录
            args = new string[,] { { "id", null } };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.deleteTreeNode(T_SYS_FILE, hash.getInt("id"));
            }
            break;
        case "getFileDetail": //得到单个文件详细信息
            args = new string[,] { { "id", null }, { "keyFields", "*" } };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.select(T_SYS_FILE, hash.getValue("keyFields"), "id=" + hash.getValue("id"));
            }
            break;
        case "getFilesDetail": //获取多个文件信息
            args = new string[,] { { "ids", null }, { "keyFields", "*" } };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery("select "+hash.getValue("keyFields")+" from " + T_SYS_FILE + " where id in ("+hash.getValue("ids")+");");
            }
            break;
        case "getDirFiles":
            args = new string[,] { { "dir", "/" }, { "fileType", "*" } };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = file.getDirFiles(hash.getValue("dir"), hash.getValue("fileType"));
            }
            break;
        case "toJSFile":
            args = new string[,] { { "fileName", null }, { "comArgs", null }, { "structArgs", null } };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                file.writeJSFile(hash.getValue("fileName"), hash.getValue("comArgs"), hash.getValue("structArgs"));
            }
            break;
        default :
            responseText = Native.getErrorMsg("请求接口不存在");
            break;
    }
    Native.writeToPage(responseText);
%>