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
public partial class About : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string _id = Request.QueryString["wm"];
        MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
        BaseApi baseApi = new BaseApi(help);
        Json wm = baseApi.exeJson("select * from DL_ABOUT where id=" + _id + ";");
        Note.InnerHtml = Server.HtmlDecode(wm.getValue("note"));

        switch (_id) { 
            case "1":
                Title.Attributes.Add("class", "gsjs");
                 //gsjs    qywh    gsry    zlbz     cpjs
                break;
            case "2":
                Title.Attributes.Add("class", "qywh");
                //gsjs    qywh    gsry    zlbz     cpjs
                break;
            case "3":
                Title.Attributes.Add("class", "gsry");
                //gsjs    qywh    gsry    zlbz     cpjs
                break;
            case "4":
                Title.Attributes.Add("class", "cpjs");
                //gsjs    qywh    gsry    zlbz     cpjs
                break;
            case "5":
                Title.Attributes.Add("class", "zlbz");
                //gsjs    qywh    gsry    zlbz     cpjs
                break;

        }

        //AboutList.DataSource = ds.Tables[0];
        //AboutList.DataBind();
        //UL.Style.Add("width", (1000*ds.Tables[0].Rows.Count)+"px");
    }
}