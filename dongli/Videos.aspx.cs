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

public partial class Home : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
        BaseApi baseApi = new BaseApi(help);
        Pictures.DataSource = baseApi.exeDataSet("select * from SYS_CM_FILES where pid=220;");
        Pictures.DataBind();

        Videos.DataSource = baseApi.exeDataSet("select * from SYS_CM_FILES where pid=221;");
        Videos.DataBind();
    }
}