using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using Fily.Base;
using Fily.Data;
using Fily.JSON;
using Fily.IO;
using Fily.Util;
public partial class Alink : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
        BaseApi baseApi = new BaseApi(help);
        System.Data.DataSet ds = baseApi.exeDataSet("select * from dbo.DL_LINK where type=780 and delFlag=0 order by cTime;");

        MeiTiXinWen.DataSource = ds.Tables[0];
        MeiTiXinWen.DataBind();
    }
}