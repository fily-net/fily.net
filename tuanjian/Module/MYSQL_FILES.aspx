<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="Fily.Util" %>
<% 
    /**
     * file 相关接口
     **/

    MySqlDBHelper help = new MySqlDBHelper("MySql_Release");
    MyBaseApi baseApi = new MyBaseApi(help);
    string action = Native.getAction(), responseText = String.Empty;
    MFile file = new MFile();
    string CITY = "t_sys_global_city", CITY_IMGS = "t_sys_global_city_imgs";
    string _uploadPath = "D:/SVN/JinPaiDaoYou/Code/Back/Node.js/FileServer/upload/";
    string _cityPicturePath =  _uploadPath + "images/city/";
    string [,] args;
    Json _args = null;
    switch (action) {
        case "uploadCityPictures":
            args = new string[,] { 
                {"cityId", null}
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                MySqlTrans trans = new MySqlTrans(baseApi);
                string _cityId = _args.getValue("cityId");
                try
                {
                    HttpFileCollection _files = Request.Files;
                    foreach (HttpPostedFile _file in _files) {
                        string _fileName = file.getFileTempName() + _file.FileName;
                        _file.SaveAs(_cityPicturePath + _fileName);
                        trans.execNonQuery(MString.getInsertStr(CITY_IMGS, "cityId, src", _cityId + "," + _fileName));
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
        case "uploadCityAvatar":
            args = new string[,] { 
                { "cityId", "*" },
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                System.Web.HttpPostedFile _file = Request.Files[0];
                string _fileName = file.getFileTempName() + _file.FileName;
                string _src = _cityPicturePath + _fileName; 
                _file.SaveAs(_src);
                baseApi.execQuery(MySqlString.getUpdateStr(CITY, "avatarImg='" + _fileName + "'", _args.getInt("cityId")));
                responseText = "[{\"fileName\": \"" + _fileName + "\"}]";
            }
            break;
        case "uploadAvatarImg":
            args = new string[,] { 
                { "catlog", null },
            };
            _args = Native.checkArgs(args, true);
            if (_args.getBool(Native.CHECK_RESULT))
            {
                System.Web.HttpPostedFile _file = Request.Files[0];
                string _fileName = file.getFileTempName() + _file.FileName;
                string _src = _uploadPath + "images/"+_args.getValue("catlog")+"/";
                MFile.createFile(_src);
                _file.SaveAs(_src+_fileName);
                responseText = "[{\"fileName\": \"" + _fileName + "\"}]";
            }
            break;
        default :
            responseText = Native.getErrorMsg("请求接口不存在");
            break;
    }
    Native.writeToPage(responseText);
%>