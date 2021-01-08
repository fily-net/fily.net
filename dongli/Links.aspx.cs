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
        Companys.DataSource = baseApi.exeDataSet("select * from DL_LINK where type=764;");
        Companys.DataBind();
        Links.DataSource = baseApi.exeDataSet("select * from DL_LINK where type=765;");
        Links.DataBind();
    }
}