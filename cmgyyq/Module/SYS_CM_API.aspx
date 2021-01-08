<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.Util" %>
<%@ Import Namespace="System.IO" %>
<% 
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    string action = Native.getAction(), responseText = String.Empty;
    string T_API_DOC = "SYS_CM_API_DESC";
    string [,] args;
    Json hash = null;
    switch (action) {
        case "saveAPI"://保存API信息
            args = new string[,] { 
                { "args", "{}" },
                { "code", null },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateById(T_API_DOC, "args='" + Filter.filterNormalStr(hash.getValue("args")) + "',code='" + Filter.filterNormalStr(hash.getValue("code")) + "'", hash.getInt("id"));
            }
            break;
        case "toAspxFile":
            args = new string[,] { { "moduleID", null } };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                string _mID = hash.getValue("moduleID"), _content = String.Empty;
                StringBuilder _apis = new StringBuilder();
                try
                {
                    Json _mObj = _trans.execJson("select nodeName, type, code from {0} where id={1};", T_API_DOC, _mID);
                    if (_mObj.getInt("type") == 1)
                    {
                        ArrayList _list = _trans.execJsonList("select code from {0} where pid={1};", T_API_DOC, _mID);
                        for (int i = 0, _iLen = _list.Count; i < _iLen; i++ )
                        {
                            Json _api = (Json)_list[i];
                            
                            _apis.Append("\n" + _api.getValue("code") + "\n");
                        }
                        _content = _mObj.getValue("code").Replace("<$SYS-API-LIST$>", _apis.ToString());
                        StreamWriter sw = null;
                        try
                        {
                            sw = new StreamWriter(HttpContext.Current.Server.MapPath("Module/") +"xxx_new.aspx", false, Encoding.GetEncoding("utf-8"));
                            sw.Write(_content);
                            sw.Flush();
                        }
                        catch (Exception ex)
                        {
                            responseText = Native.getErrorMsg(ex.Message);
                        }
                        finally
                        {
                            sw.Close();
                        }
                    }
                    else {
                        responseText = Native.getErrorMsg("不能创建文件");
                    }
                    _trans.commit();
                }
                catch (Exception e) {
                    responseText = Native.getErrorMsg(e.Message);
                    _trans.rollback();
                }
                finally
                {
                    _trans.close();
                }
            }
            break;
        case "importAPI"://通过文件导入模块
            args = new string[,] { 
                { "type", null },
                { "filename", null },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    switch (hash.getValue("type"))
                    {
                        case "importModule":
                            StreamReader sr = null;
                            try
                            {
                                string _fPath = HttpContext.Current.Server.MapPath(hash.getValue("filename"));
                                FileInfo _fileInfo = new FileInfo(_fPath);
                                sr = new StreamReader(_fPath, Encoding.GetEncoding("utf-8"));
                                string line = String.Empty, _mainStr = String.Empty, _caseStr = String.Empty, _caseName = String.Empty;
                                ArrayList _apis = new ArrayList();
                                bool isCase = false;
                                while ((line = sr.ReadLine()) != null)
                                {
                                    if(isCase){
                                        if (line.IndexOf("case")==8){
                                            if(!Native.isEmpty(_caseStr)&&!Native.isEmpty(_caseName)){ _apis.Add(new string[]{_caseName, _caseStr}); }
                                            _caseName = line.Split('\"')[1];
                                            _caseStr = line + "\n";
                                        }else {
                                            if (line.IndexOf("default :")!=-1||line.IndexOf("}")==4){
                                                isCase = false; _mainStr += line + "\n";
                                            }else {
                                                _caseStr += line + "\n";
                                            }
                                        }
                                    }else {
                                        if(line.IndexOf("switch (action) {")!=-1){ isCase = true; }
                                        _mainStr += line + "\n";
                                    }
                                }
                                _apis.Add(new string[] { _caseName, _caseStr });
                                string _newID = _trans.addTreeNode(T_API_DOC, hash.getInt("id"), "type,nodeName,code", "1,'" + _fileInfo.Name + "','" + _mainStr + "'");
                                for (int i = 0, _iLen = _apis.Count; i < _iLen; i++) {
                                    string[] _api = (string [])_apis[i];
                                    _trans.addTreeNode(T_API_DOC, Convert.ToInt16(_newID), "type,nodeName,code", "2,'" + _api[0] + "','" + _api[1] + "'");
                                }
                            }
                            catch (Exception ex)
                            {
                                responseText = Native.getErrorMsg(ex.Message);
                            }
                            finally
                            {
                                sr.Close();
                            }
                            break;
                        case "importAPI":
                            
                            break;
                    }
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
        default :
            responseText = Native.getErrorMsg("请求接口不存在");
            break;
    }
    Native.writeToPage(responseText);  
%>