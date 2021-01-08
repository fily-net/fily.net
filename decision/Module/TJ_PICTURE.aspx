<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="Fily.Util" %>
<% 
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    baseApi.setDataType("json");
    MFile file = new MFile();
    string action = Native.getAction(), responseText = String.Empty;
    string T_PICTURE = "TJ_PICTURE";
    string [,] args;
    Json _args = null;
    switch (action) {
        case "uploadBack":
            args = new string[,] { 
                { "userId", null },
                { "note", null },
                { "latitude", "" },
                { "longitude", "" },
                { "address", "中国" },
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _address = _args.getValue("address"),
                    _userId = _args.getValue("userId"),
                    _la = _args.getValue("latitude"),
                    _lo = _args.getValue("longitude"),
                    _note = _args.getValue("note");

                if (Request.Files.Count == 0)
                {
                    responseText = Native.getErrorMsg("请求体没有文件!");
                }
                else
                {
                    System.Web.HttpPostedFile _file = Request.Files[0];
                    string _updatePath = "uploads/tj_pictures/", _path = Server.MapPath(_updatePath);
                    string _url, _name, _ext, _fullName = _file.FileName, _tempName = file.getFileTempName(), fileId = String.Empty;
                    string[] _paths = _fullName.Split('/'), _fileTemp;
                    string __full = _paths[_paths.Length - 1];
                    _fileTemp = __full.Split('.');
                    _name = _fileTemp[0];
                    _ext = _fileTemp[1];
                    _url = _updatePath + _tempName + "." + _ext;
                    string _keys = "userId, regionId, note, latitude, longitude, address, fullName, tempName, name, ext, size, url",
                        _values = _args.getValue("userId") + "," + 0 + ",'" + _args.getValue("note") + "','" + _args.getValue("latitude") + "','" + _args.getValue("longitude") + "','" + _address + "','" + _fullName + "','" + _tempName + "','" + _name + "','" + _ext + "'," + Convert.ToString(_file.ContentLength) + ", '" + _url + "'";

                    _file.SaveAs(_path + _tempName + "." + _ext);
                    string _insertId = baseApi.execScalar(MString.getInsertStr(T_PICTURE, _keys, _values, true));
                    responseText = "上传文件成功, file_id: " + _insertId;
                }
            }
            break;
        case "upload":
            args = new string[,] { 
                { "userId", null },
                { "note", null },
                { "latitude", "" },
                { "longitude", "" },
                { "address", "中国" },
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _address = _args.getValue("address"),
                    _userId = _args.getValue("userId"),
                    _la = _args.getValue("latitude"),
                    _lo = _args.getValue("longitude"),
                    _note = _args.getValue("note");

                //Native.writeToJSON("address: "+_address+", userId: "+_userId +", latitude: " + _la + ", longitude: "+_lo+", note: " + _note);


                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    if (Request.Files.Count == 0)
                    {
                        responseText = Native.getErrorMsg("请求体没有文件!");
                    }
                    else
                    {
                        System.Web.HttpPostedFile _file = Request.Files[0];
                        string _updatePath = "uploads/tj_pictures/", _path = Server.MapPath(_updatePath);
                        string _url, _name, _ext, _fullName = _file.FileName, _tempName = file.getFileTempName(), fileId = String.Empty;
                        string[] _paths = _fullName.Split('/'), _fileTemp;
                        string __full = _paths[_paths.Length - 1];
                        _fileTemp = __full.Split('.');
                        _name = _fileTemp[0];
                        _ext = _fileTemp[1];
                        _url = _updatePath + _tempName + "." + _ext;

                        int _regionId = 0;
                        ArrayList regions = _trans.execJsonList(MString.getSelectStr("TJ_REGION", "id, nodeName", "1=1"));
                        for (int i = 0, _len = regions.Count; i < _len; i++)
                        {
                            Json _region = (Json)regions[i];
                            if (_address.IndexOf(_region.getValue("nodeName")) > -1)
                            {
                                _regionId = _region.getInt("id");
                            }
                        }
                        if (_regionId > 0)
                        {
                            _trans.execNonQuery(MString.getUpdateStr("TJ_REGION", "count=count+1", _regionId));
                        }
                        string _keys = "userId, regionId, note, latitude, longitude, address, fullName, tempName, name, ext, size, url",
                            _values = _args.getValue("userId") + "," + _regionId + ",'" + _args.getValue("note") + "','" + _args.getValue("latitude") + "','" + _args.getValue("longitude") + "','" + _address + "','" + _fullName + "','" + _tempName + "','" + _name + "','" + _ext + "'," + Convert.ToString(_file.ContentLength) + ", '" + _url + "'";

                        _file.SaveAs(_path + _tempName + "." + _ext);
                        string _insertId = _trans.execScalar(MString.getInsertStr(T_PICTURE, _keys, _values, true));
                        _trans.commit();
                        responseText = "上传文件成功, file_id: " + _insertId;
                    }
                }
                catch (Exception e)
                {
                    _trans.rollback();
                    responseText = Native.getErrorMsg(e.Message);
                }
            }
            break;
        case "updatePictureState":
            args = new string[,]{
                {"id", null},
                {"json", null}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    Json _pic = _trans.execJson(MString.getSelectStr(T_PICTURE, "id, type, regionId", _args.getInt("id")));
                    int _type = _pic.getInt("type"), 
                        _regionId = _pic.getInt("regionId"),
                        _state = MConvert.getInt(_args.getValue("json"), "state");
                    
                    string _update = MConvert.toUpdateSql(_args.getValue("json")),
                        _updateRegion = "";
                    
                    if(_type==0){
                        _update += ", type=1";
                        if(_state==761){
                            _updateRegion = "confirmCount=confirmCount+1";
                        }
                    }else {
                        if(_state==761){
                            _updateRegion = "confirmCount=confirmCount+1";
                        }else {
                            _updateRegion = "confirmCount=confirmCount-1";
                        }
                    }
                    _trans.execNonQuery(MString.getUpdateStr(T_PICTURE, _update, "id=" + _args.getValue("id")));
                    _trans.execNonQuery(MString.getUpdateStr("TJ_REGION", _updateRegion, _regionId));
                    _trans.commit();
                }
                catch (Exception e)
                {
                    _trans.rollback();
                    responseText = Native.getErrorMsg(e.Message);
                }
                Native.writeToPage(responseText);
                return;
            }
            break;
        case "updateByID":
            args = new string[,]{
                {"id", null},
                {"json", null}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                string _update = MConvert.toUpdateSql(_args.getValue("json"));
                string _sql = MString.getUpdateStr(T_PICTURE, MConvert.toUpdateSql(_args.getValue("json")), "id=" + _args.getValue("id"));
                if (MConvert.getInt(_args.getValue("json"), "state") == 761)
                {
                    //_sql += MString.getUpdateStr("TJ_REGION", "confirmCount=confirmCount-1", )
                }
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "getPicturesByUserId":
            args = new string[,] { 
                { "keyFields", "*" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "userId", null },
                { "orderCondition", "{\"cTime\":\"desc\"}" },
                { "filterCondition", "" },
                { "delFlag", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {

                string _where = "userId=" + _args.getValue("userId")+" and state=761", 
                    _filter = MConvert.toFilterSql(_args.getValue("filterCondition").Trim());
                if (_where.Length > 0 && _filter.Length > 0)
                {
                    _where += " and " + _filter;
                }
                else if (_filter.Length > 0)
                {
                    _where = _filter;
                }
                responseText = baseApi.pagingNoCount(T_PICTURE, _args.getInt("pageIndex"), _args.getInt("pageSize"), _args.getValue("keyFields"), _where, MConvert.toOrderSql(_args.getValue("orderCondition")), _args.getInt("delFlag"));
            }
            break;
        case "getPicturesByRegionId":
            args = new string[,] { 
                { "keyFields", "*" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "regionId", null },
                { "orderCondition", "{\"cTime\":\"desc\"}" },
                { "filterCondition", "" },
                { "delFlag", "0" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {

                string _where = "regionId=" + _args.getValue("regionId") + " and state=761",
                    _filter = MConvert.toFilterSql(_args.getValue("filterCondition").Trim());
                if (_where.Length > 0 && _filter.Length > 0)
                {
                    _where += " and " + _filter;
                }
                else if (_filter.Length > 0)
                {
                    _where = _filter;
                }
                responseText = baseApi.pagingNoCount(T_PICTURE, _args.getInt("pageIndex"), _args.getInt("pageSize"), _args.getValue("keyFields"), _where, MConvert.toOrderSql(_args.getValue("orderCondition")), _args.getInt("delFlag"));
            }
            break;
        case "getPicture":           //登陆
            args = new string[,] { 
                { "pictureId", "" }
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {

                string _path = baseApi.execScalar(MString.getSelectStr(T_PICTURE, "url", "id=" + _args.getValue("pictureId")));
                //Native.writeToPage(_path);
                responseText = file.getImage("ShareFile", Server.MapPath(_path), 1024000);
            }
            break;
        default :
            responseText = Native.getErrorMsg("调用接口不对或不存在");
            break;
    }
    
    Native.writeToJSON(responseText); 
%>