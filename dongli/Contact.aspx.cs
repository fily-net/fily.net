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

public partial class Contact : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
        BaseApi baseApi = new BaseApi(help);
        Json company = baseApi.exeJson("select * from DL_COMPANY where id=1;");
        
        CompanyName.Text = company.getValue("title");
        Address.Text = company.getValue("address");
        Phone.Text = company.getValue("phone");
        Fax.Text = company.getValue("fax");
        Eamil.Text = company.getValue("email");
        Website.Text = company.getValue("website");
        Code.Src = company.getValue("link"); //"images/erweima.png";
        
    }
}