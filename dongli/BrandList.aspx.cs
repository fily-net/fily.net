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
public partial class BrandList : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string _t1 = Request.QueryString["t1"];
        string _t2 = Request.QueryString["t2"];
        MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
        BaseApi baseApi = new BaseApi(help);

        string _sql1 = "select * from dbo.DL_PRODUCT where t1=" + _t1 + " and t2=" + _t2 + " and delFlag=0 order by cTime;";

        DataSet ds = baseApi.exeDataSet(_sql1);

        DataTable t1 = ds.Tables[0];


        /*
        int i = 0;
        string _value = "";
        foreach (DataRow dr in t1.Rows)
        {
            
            int _index =  i%4;
            if (_index == 0) {
                if (i == 0)
                {
                    _value += "<li  class=\"active\">";
                }
                else { 
                    _value += "<li>";
                }
               
            }
            _value += "<a style=\"width:220px;height: 261px;\" href=\"BrandDetail.aspx?bdid=" + dr["id"] + "\"><img style=\"width:220px;height: 261px;\" src=\"" + Fily.Util.Filter.refilterStr(dr["image1"].ToString()) + "\"></a>";
            if (_index == 3||i==t1.Rows.Count-1) {
                _value += "</li>";
            }
            i++;
        }

        //Response.Write(_value);
        ullist.InnerHtml = _value;
         * 
         * */

        Images.DataSource = t1;
        Images.DataBind();

        switch (_t2)
        {
            case "776":
                Title.InnerHtml = "女装";
                break;
            case "777":
                Title.InnerHtml = "男装";
                break;
            case "778":
                Title.InnerHtml = "围巾";
                break;
            case "779":
                Title.InnerHtml = "其他";
                break;
        }
    }
}