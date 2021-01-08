using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;  
using Fily.Office;
using Fily.Base;
using Fily.Data;
using Fily.JSON;
using Fily.Util;

public partial class office_reader : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.QueryString["fid"] == null)
        {
            Response.Write("没有传入文件ID");
        }
        else {
            try
            {
                string _fid = Request.QueryString["fid"].ToString();
                MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
                BaseApi baseApi = new BaseApi(help);
                Json json = (Json)baseApi.exeJson(MString.getSelectStr("SYS_CM_FILES", "catelog, sysName, extName, pdfPath", "id=" + _fid));
                string _ext = json.getValue("extName");
                string _orignPath = "./uploads/" + json.getValue("catelog") + "/" + json.getValue("sysName") + ".";
                string _vPath = _orignPath + _ext;
                string _path = Server.MapPath(_vPath);
                string _content = String.Empty;
                string _pdf = json.getValue("pdfPath");
                switch (_ext.ToLower())
                {
                    case "doc":
                    case "docx":
                        if (Native.isNullEmpty(_pdf))
                        {
                            Office2PDFHelper.DOCConvertToPDF(Server.MapPath(_vPath), Server.MapPath(_orignPath + "pdf"));
                            _pdf = _orignPath + "pdf";
                            baseApi.updateById("SYS_CM_FILES", "pdfPath='"+_pdf+"'", Convert.ToInt32(_fid));
                        }
                        Response.Redirect(_pdf);
                        return;
                        //_content = "<pre>" + OfficeReader.ReadWord(_path) + "</pre>";
                        break;
                    case "xls":
                    case "xlsx":
                        if (Native.isNullEmpty(_pdf))
                        {
                            Office2PDFHelper.XLSConvertToPDF(Server.MapPath(_vPath), Server.MapPath(_orignPath + "pdf"));
                            _pdf = _orignPath + "pdf";
                            baseApi.updateById("SYS_CM_FILES", "pdfPath='"+_pdf+"'", Convert.ToInt32(_fid));
                        }
                        Response.Redirect(_pdf);
                        //_content = OfficeReader.ReadExcel(_path);
                        return;
                        break;
                    case "ppt":
                    case "pptx":
                        if (Native.isNullEmpty(_pdf))
                        {
                            Office2PDFHelper.PPTConvertToPDF(Server.MapPath(_vPath), Server.MapPath(_orignPath + "pdf"));
                            _pdf = _orignPath + "pdf";
                            baseApi.updateById("SYS_CM_FILES", "pdfPath='" + _pdf + "'", Convert.ToInt32(_fid));
                        }
                        Response.Redirect(_pdf);
                        //_content = OfficeReader.ReadExcel(_path);
                        return;
                        break;
                    case "ini":
                    case "txt":
                        if (!File.Exists(_path))  
                        {
                            _content = "文件不存在";
                        }else{
                            StreamReader sr = new StreamReader(_path, System.Text.Encoding.Default);  
                            String input = sr.ReadToEnd();  
                            sr.Close();
                            _content = input;  
                        }
                        break;
                    case "jpg":
                    case "jpgx":
                    case "png":
                    case "gif":
                        Response.Write("<img src=" + _vPath + " />");
                        return;
                    default:
                        _content = _ext + "格式文件不能预览。";
                        break;
                }
                Response.Write(Server.HtmlDecode(_content));
            }
            catch (Exception ex) {
                Response.Write("文件不存在，请联系管理员");
            }
        }
        
    }
}