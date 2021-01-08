using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Net;
using System.IO;
using System.IO.Compression;
using System.Text.RegularExpressions;  

namespace Fily.Http
{
    public class HttpClient
    {
        /// <summary>
        /// 使用HttpWebRequest发送HTTP请求，同时支持GET/POST方式提交。
        /// </summary>
        /// <param name="url">要访问的URL地址</param>
        /// <param name="queryString"><![CDATA[QueryString形式的数据，如：action=1&id=2]]></param>
        /// <param name="method">任何HTTP 1.1 协议谓词：GET、HEAD、POST、PUT、DELETE、TRACE 或OPTIONS。</param>
        /// <param name="encoding">页面使用的编码</param>
        /// <remarks>
        /// <para>
        /// 请注意：
        /// <ol>
        /// <li><paramref name="queryString"/> 中如果有中文，则需要使用Uri.EscapeDataString(string) 
        /// 或Uri.EscapeUriString(string) 进行对应转换。</li>
        /// <li>理论上支持任何HTTP 1.1 协议谓词，不过就实际使用情况来说，仅对GET/POST方式进行了测试，
        /// 其他谓词并未测试。</li>
        /// </ol>
        /// </para>
        /// </remarks>
        /// <returns></returns>
        public static string GetWebRequest(string url, string queryString, string method, Encoding encoding)
        {
            string html = string.Empty;
            string fullUrl;
            if (url.Contains("?"))
            {
                fullUrl = url + "&" + queryString;
            }
            else
            {
                fullUrl = url + "?" + queryString;
            }
            try
            {
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(fullUrl);
                request.UserAgent = "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko";
                request.Method = method;
                if (method == "POST")
                {
                    byte[] data = encoding.GetBytes(queryString);
                    request.ContentType = "application/x-www-form-urlencoded";
                    request.ContentLength = data.Length;
                    using (Stream reqStream = request.GetRequestStream())
                    {
                        reqStream.Write(data, 0, data.Length);
                        reqStream.Close();
                    }
                }
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    if (response != null)
                    {
                        if (response.StatusCode == HttpStatusCode.OK && request.HaveResponse)
                        {
                            using (StreamReader sr = new StreamReader(response.GetResponseStream(), encoding))
                            {
                                if (sr != null)
                                {
                                    html = sr.ReadToEnd();
                                }
                            }
                        }
                        response.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                html = ex.ToString();
            }
            return html;
        }

        public string Post(string url, byte [] data) {
            string _result = String.Empty;
            int _dataLength = data.Length;
            try
            {
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
                request.UserAgent = "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko";
                request.Method = "POST";
                request.ContentType = "application/json";
                request.ContentLength = _dataLength;
                using (Stream reqStream = request.GetRequestStream())
                {
                    reqStream.Write(data, 0, _dataLength);
                    reqStream.Close();
                }
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    if (response != null)
                    {
                        if (response.StatusCode == HttpStatusCode.OK && request.HaveResponse)
                        {
                            using (StreamReader sr = new StreamReader(response.GetResponseStream(), new UTF8Encoding()))
                            {
                                if (sr != null)
                                {
                                    _result = sr.ReadToEnd();
                                }
                            }
                        }
                        response.Close();
                    }
                }
            }
            catch (Exception e)
            {
                _result = e.Message;
            }
            return _result;
        }
    }
}