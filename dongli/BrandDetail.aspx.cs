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
public partial class BrandDetail : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string _bdid = Request.QueryString["detail"];
        string _t2 = Request.QueryString["t2"];
        string _t1 = Request.QueryString["t1"];
        MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
        BaseApi baseApi = new BaseApi(help);

        Back.HRef ="BrandList.aspx?t1=" + _t1 + "&t2=" + _t2;

        string _sql1 = "select * from dbo.DL_PRODUCT where id=" + _bdid + " and delFlag=0 order by cTime;";

        Json detail = baseApi.exeJson(_sql1);

        Note.InnerHtml = detail.getValue("note");

        Guige.InnerHtml = detail.getValue("guige");


        Big1.Src = detail.getValue("big1");
        Big2.Src = detail.getValue("big2");
        Big3.Src = detail.getValue("big3");
        Big4.Src = detail.getValue("big4");
        Big5.Src = detail.getValue("big5");


        Small1.Src = detail.getValue("small1");
        Small2.Src = detail.getValue("small2");
        Small3.Src = detail.getValue("small3");
        Small4.Src = detail.getValue("small4");
        Small5.Src = detail.getValue("small5");

        /*
        DataSet ds = baseApi.exeDataSet(_sql1);

        Infos.DataSource = ds.Tables[0];
        Infos.DataBind();

        Images.DataSource = ds.Tables[0];
        Images.DataBind();

        BgImages.DataSource = ds.Tables[0];
        BgImages.DataBind();

        Notes.DataSource = ds.Tables[0];
        Notes.DataBind();*/

        

        switch (_t2) { 
            case "776":
                Title.Text = "私人高端定制 - 女装";
                break;
            case "777":
                Title.Text = "私人高端定制 - 男装";
                break;
            case "778":
                Title.Text = "私人高端定制 - 围巾";
                break;
            case "779":
                Title.Text = "私人高端定制 - 其他";
                break;
        }
    }
}