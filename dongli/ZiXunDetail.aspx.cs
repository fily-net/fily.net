using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Fily.Base;
using Fily.Data;
using Fily.JSON;
using Fily.IO;
using Fily.Util;

public partial class ZiXunDetail : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string _zxid = Request.QueryString["zxid"];
        MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
        BaseApi baseApi = new BaseApi(help);

        Json zx = baseApi.exeJson("select * from dbo.DL_NEWS where id="+_zxid+";");
        Title.InnerHtml = zx.getValue("title");
        Note.InnerHtml = Server.HtmlDecode(zx.getValue("note"));
        CTime.InnerHtml = zx.getValue("cTime");
    }
}