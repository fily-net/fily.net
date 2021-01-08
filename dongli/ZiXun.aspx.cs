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
public partial class ZiXun : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
        BaseApi baseApi = new BaseApi(help);

        DataSet ds = baseApi.exeDataSet("select top 10 *, dbo.SYS_FORMAT_TIME(cTime) as cTime from dbo.DL_NEWS where type=767 and delFlag=0 order by cTime;select top 10 *, dbo.SYS_FORMAT_TIME(cTime) as cTime from dbo.DL_NEWS where type=768 and delFlag=0 order by cTime;");

        GongSiXinWen.DataSource = ds.Tables[0];
        GongSiXinWen.DataBind();

        MeiTiXinWen.DataSource = ds.Tables[1];
        MeiTiXinWen.DataBind();
    }
}