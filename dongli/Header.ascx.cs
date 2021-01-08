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

public partial class Header : System.Web.UI.UserControl
{
    protected void Page_Load(object sender, EventArgs e)
    {
        MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
        BaseApi baseApi = new BaseApi(help);
        System.Data.DataSet ds = baseApi.exeDataSet("select * from dbo.SYS_CM_FN_TREE where pid=99 order by treeOrder;");
        MenuList.DataSource = ds.Tables[0];
        MenuList.DataBind();
    }
}