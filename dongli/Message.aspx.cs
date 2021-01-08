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

public partial class Message : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
        //BaseApi baseApi = new BaseApi(help);
        //Messages.DataSource = baseApi.exeDataSet("select * from DL_MESSAGE;");
        //Messages.DataBind();
    }
}