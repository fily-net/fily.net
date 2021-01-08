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

public partial class Allcyl : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
        BaseApi baseApi = new BaseApi(help);
        System.Data.DataSet ds = baseApi.exeDataSet("select * from SYS_CM_FILES where pid=220 and delFlag=0;");
        ImageList.DataSource = ds.Tables[0];
        ImageList.DataBind();
    }
}