<%@ Page Language="C#" AutoEventWireup="true" CodeFile="OF.aspx.cs" Inherits="Module_OF" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="Fily" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.Office" %>
<% 
    try
    {
        Native.write(MapPath("../uploads/docmg/2015100109080019059.doc"));
        Native.write(MapPath("../uploads/docmg/2015100109080019059.pdf"));
        Office2PDFHelper.DOCConvertToPDF(MapPath("../uploads/docmg/2015100109080019059.doc"), MapPath("../uploads/docmg/2015100109080019059.pdf"));
        //Office2HtmlHelper.Excel2Html(MapPath("../uploads/docmg/2015100109060715227.xlsx"), MapPath("../Html/"), "2015100109060715227");
        // Of .XLSConvertToPDF(MapPath("../uploads/docmg/2015100109220419673.xlsx"), MapPath("../uploads/docmg/2015100109220419673.pdf"));
    }
    catch (Exception e)
    {
        Native.writeToPage(e.Message);
    }
    %>
