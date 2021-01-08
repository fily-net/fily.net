<%@ codepage = 65001%>
<%
    Server.ScriptTimeout=999
    DIM   xmlhttp,   strResponse  
    set   xmlhttp   =   Server.CreateObject("MSXML2.ServerXMLHTTP")  
    xmlhttp.Open   "GET", request("url") ,   false  
    xmlhttp.send  
    Response.write    xmlhttp.responseText      
    set   xmlhttp=Nothing
%>