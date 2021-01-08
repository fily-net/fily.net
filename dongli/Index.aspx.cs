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
public partial class Index : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
        BaseApi baseApi = new BaseApi(help);

        DataSet ds = baseApi.exeDataSet("select * from dbo.SYS_CM_FILES where pid=253 and delFlag=0 order by cTime;");

        MeiTiXinWen.DataSource = ds.Tables[0];
        MeiTiXinWen.DataBind();

        MeiTiXinWen1.DataSource = ds.Tables[0];
        MeiTiXinWen1.DataBind();
    }
}