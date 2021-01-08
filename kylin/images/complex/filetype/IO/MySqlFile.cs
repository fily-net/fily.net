using System;
using System.Collections.Generic;
using System.Collections;
using System.Text;
using System.Linq;
using System.Web;
using System.IO;
using Fily.Base;

namespace Fily.IO
{
    /// <summary>
    /// 操作文件常用方法
    /// </summary>
    public class MySqlFile
    {
        #region 变量定义
        public const string BY_ROW = "ByRow";
        public const string BY_ALL = "ByAll";
        public const string BY_CHAR = "ByChar";
        private string uploadPath = "../uploads";
        #endregion

        #region MFile: 构造函数
        public MySqlFile(){}
        #endregion
        
        #region File: 构造函数
        public MySqlFile(string _path)
        {
            uploadPath = _path;
        }
        #endregion

        #region setUploadPath: 设置上传文件的上传路径
        public void setUploadPath(string path){
            uploadPath = path;
        }
        #endregion

        #region getUploadPath: 获取上传文件的上传路径
        public string getUploadPath() {
            return uploadPath;
        }
        #endregion

        #region exportCsv: 导出为excel文件
        public static void exportCsv(string fileName, string str)
        {
            HttpResponse _Response = HttpContext.Current.Response;
            HttpRequest _Request = HttpContext.Current.Request;
            _Response.Clear();
            _Response.Buffer = false;
            _Response.ContentType = "application/vnd.ms-excel";
            _Response.Charset = "gb2312";
            //_Response.AddHeader("Connection", "Keep-Alive");
            //_Response.ContentEncoding = System.Text.Encoding.UTF8;
            _Response.ContentEncoding = System.Text.Encoding.GetEncoding("gb2312");
            if (_Request.UserAgent.ToLower().IndexOf("firefox") > -1)
            {
                _Response.AddHeader("Content-Disposition", "attachment;filename=\"" + fileName + "\"");
            }
            else
            {
                _Response.AddHeader("Content-Disposition", "attachment;filename=\"" + HttpUtility.UrlEncode(fileName, System.Text.Encoding.UTF8) + "\"");
            }
            _Response.Write(str);
            _Response.Flush();
        }
        #endregion

        public static void copy(string targetPath, string srcPath, bool overwrite)
        { 
            System.IO.File.Copy(targetPath, srcPath, overwrite);
        }

        #region readIcon: 读取图标
        /// <summary>
        /// readIcon: 读取图标
        /// </summary>
        /// <param name="path">完整路径</param>
        /// <param name="type">读取类型</param>
        /// <returns></returns>
        public string readIcon(string path)
        {
            string _val = String.Empty;
            try
            {
                StringBuilder _icons = new StringBuilder();
                string _temp = String.Empty;
                StreamReader strReader = new StreamReader(HttpContext.Current.Server.MapPath(path), Encoding.Default);
                while ((_temp = strReader.ReadLine()) != null) {
                    if (_temp.IndexOf("-skin-") != -1) { continue; }
                    if (_temp.IndexOf(".icon-") != -1) {_icons.Append(_temp.Split('{')[0].Replace(".", "")+"^");}
                }
                _icons.Remove(_icons.Length - 1, 1);
                _val = _icons.ToString();
            }
            catch (Exception ex)
            {
                _val = Native.getErrorMsg(ex.Message);
            }
            return _val;
        }
        #endregion

        #region readFile: 读文件
        /// <summary>
        /// readFile: 读文件
        /// </summary>
        /// <param name="path">完整路径</param>
        /// <param name="type">读取类型</param>
        /// <returns></returns>
        public string readFile(string path, string type)
        {
            try
            {
                StringBuilder StrAllContent = new StringBuilder();
                string str = "";
                StreamReader strReader = new StreamReader(path, Encoding.Default);
                switch (type)
                {
                    case BY_ROW:
                        while ((str = strReader.ReadLine()) != null){ StrAllContent.Append(str + "\n\r"); } break;
                    case BY_ALL:
                        StrAllContent.Append(strReader.ReadToEnd()); break;
                    case BY_CHAR:
                        char[] c = new char[1];
                        while (strReader.Read(c, 0, c.Length) > 0){ str = new String(c); StrAllContent.Append(str); }
                        break;
                    default: break;
                }
                return StrAllContent.ToString();
            }catch (Exception ex) { 
                return Native.getErrorMsg(ex.Message); 
            }
        }
        #endregion

        #region writeFile: 写文件, 把内容是content的字符串写到路径是path的文件中
        /// <summary>
        /// writeFile: 写文件, 把内容是content的字符串写到路径是path的文件中
        /// </summary>
        /// <param name="path">要写到的文件路径, filePath</param>
        /// <param name="content">要写到文件的内容, fileContent</param>
        /// <returns>写文件是否成功</returns>
        public bool writeFile(string path, string content) {
            if (Native.isNullEmpty(path) || Native.isNullEmpty(content)) { return false; }
            StreamWriter sw = new StreamWriter(path, false, System.Text.Encoding.GetEncoding("utf-8"));
            sw.Write(content);
            sw.Flush();
            sw.Dispose();
            return true;
        }
        #endregion

        #region exist: 判断要上传的文件是否存在
        public bool exist() {
            return true;
        }
        #endregion

        #region downloadFile: 文件下载
        /// <summary>
        /// 
        /// </summary>
        /// <param name="_Request"></param>
        /// <param name="_Response"></param>
        /// <param name="_fileName"></param>
        /// <param name="_fullPath"></param>
        /// <param name="_speed"></param>
        /// <returns></returns>
        public string downloadFile(string _fileName, string _fullPath, long _speed)
        {
            string _msg = String.Empty;
            try
            {
                HttpRequest _Request = HttpContext.Current.Request;
                HttpResponse _Response = HttpContext.Current.Response;
                FileInfo DownloadFile = new FileInfo(_fullPath);
                if (DownloadFile.Exists)
                {
                    _Response.Clear();
                    _Response.ClearContent();
                    _Response.ClearHeaders();
                    _Response.Buffer = false;
                    _Response.ContentType = "application/octet-stream";
                    _Response.ContentEncoding = System.Text.Encoding.GetEncoding("gb2312");
                    _Response.AppendHeader("Content-Disposition", "attachment;filename=" + System.Web.HttpUtility.UrlEncode(_fileName, System.Text.Encoding.UTF8));
                    _Response.AppendHeader("Content-Length", DownloadFile.Length.ToString());
                    _Response.AddHeader("Content-Transfer-Encoding", "binary");
                    _Response.TransmitFile(DownloadFile.FullName);
                    _Response.Flush();
                    _Response.End();
                    _msg = "下载成功";
                }
                else
                {
                    _msg = Native.getErrorMsg("文件不存在!");
                }
            }
            catch (Exception e)
            {
                _msg = Native.getErrorMsg(e.Message.ToString());
            }
            return _msg;
        }
        #endregion

        #region getFileTempName: 根据当前时间的时分秒来获取每次上传文件的临时文件名
        public string getFileTempName()
        {
            try
            {
                DateTime dateTime = DateTime.Now;
                string yearStr = dateTime.Year.ToString(); ;
                string monthStr = dateTime.Month.ToString();
                string dayStr = dateTime.Day.ToString();
                string hourStr = dateTime.Hour.ToString();
                string minuteStr = dateTime.Minute.ToString();
                string dir = dateTime.ToString(@"yyyyMMddhhmmss");
                Random ran = new Random(Guid.NewGuid().GetHashCode());  //解决极端时间内函数名相同问题
                int num = ran.Next(0, 9999) + 10000;
                dir = dir + num.ToString();
                return dir;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        #endregion

        #region createFile: 如果文件不存在则创建文件并返回true, 否则返回false
        public static bool createFile(string filePath)
        {
            if (Directory.Exists(filePath)) { return false; }
            Directory.CreateDirectory(filePath);
            return true;
        }
        #endregion

        #region getFileSuffix: 通过文件名得到文件后缀(文件扩展名)
        public string getFileSuffix(string fileName)
        {
            string _msg = string.Empty;
            try
            {
                string[] _tempAry = fileName.Split('.');
                _msg = _tempAry[_tempAry.Length - 1];
            }
            catch (Exception ex)
            {
                _msg = ex.Message;
            }
            return _msg;
        }
        #endregion

        #region deleteFolder: 递归删除文件夹及文件
        public void deleteFolder(string dir)
        {
            if (Directory.Exists(dir))   //如果存在这个文件夹删除之   
            {
                foreach (string d in Directory.GetFileSystemEntries(dir))
                {
                    if (File.Exists(d)){
                        File.SetAttributes(d, FileAttributes.Normal); //设置文件的属性为正常（如果文件为只读的话直接删除会报错）
                        File.Delete(d);    //直接删除其中的文件
                    }else {
                        deleteFolder(d);   //递归删除子文件夹
                    }
                }
                Directory.Delete(dir);     //删除已空文件夹
            }
        }
        #endregion

        #region deleteFile: 删除文件
        public bool deleteFile(string fileFullPath) {
            if (File.Exists(fileFullPath) == true)
            {
                File.SetAttributes(fileFullPath, FileAttributes.Normal); //设置文件的属性为正常（如果文件为只读的话直接删除会报错）
                File.Delete(fileFullPath); //删除文件
                return true;
            }
            else {
                return false;
            }
        }
        #endregion
        
        #region openFile: 打开文件
        /// <summary>
        /// 根据传来的文件全路径，外部打开文件，默认用系统注册类型关联软件打开
        /// </summary>
        /// <param name="FileFullPath">文件的全路径</param>
        /// <returns>bool</returns>
        public bool openFile(string fileFullPath)
        {
            if (File.Exists(fileFullPath) == true)
            {
                System.Diagnostics.Process.Start(fileFullPath);  //打开文件，默认用系统注册类型关联软件打开
                return true;
            }
            else
            {
                return false;
            }
        }
        #endregion

        #region getDirFiles: 获取目录文件
        /// <summary>
        /// getDirFiles: 获取目录文件
        /// </summary>
        /// <param name="fileFullPath">文件的全路径</param>
        /// <param name="fileType">文件类型, 默认是所有文件</param>
        /// <returns></returns>
        public string getDirFiles(string fileFullPath, string fileType="*") {
            DirectoryInfo dir = new DirectoryInfo(HttpContext.Current.Server.MapPath(fileFullPath));
            StringBuilder _return = new StringBuilder();
            try
            {
                _return.Append("[");
                foreach(DirectoryInfo d in dir.GetDirectories())     //查找子目录   
                {
                    string _currPath = fileFullPath + "/" + d.ToString();
                    _return.Append("{\"name\":\"" + d.ToString() + "\",\"currPath\":\"" + _currPath + "\", \"type\":\"dir\", \"count\":\"" + d.GetFiles().Length.ToString()+ "\"},");
                }
                foreach(FileInfo file in dir.GetFiles("*."+fileType))     //查找子目录   
                {
                    string _ext = file.Extension, _name = file.Name, _fullName = fileFullPath+'/'+_name;
                    _return.Append("{\"name\":\"" + _name + "\",\"fullName\":\"" + _fullName + "\", \"ext\":\"" + _ext + "\", \"type\":\"file\", \"length\":\""+file.Length+"\"},");
                }
                if(_return.Length>0){ _return.Remove(_return.Length-1,1); }
                _return.Append("]");
            }
            catch (Exception ex) {
                _return.Append(Native.getErrorMsg(ex.Message));
            }
            return _return.ToString();
        }
        #endregion

        #region writeJSFile: 根据模版文件生成js文件
        /// <summary>
        /// 
        /// </summary>
        /// <param name="comArgs"></param>
        /// <param name="structArgs"></param>
        /// <returns></returns>
        public void writeJSFile(string fileName, string comArgs, string structArgs)
        {
            string path = HttpContext.Current.Server.MapPath("View/generate/");
            string temp = HttpContext.Current.Server.MapPath("View/common/ViewTemplate.js");//   读取模板文件  
            Encoding code = Encoding.GetEncoding("utf-8");
            StreamReader sr = null;
            StreamWriter sw = null;
            string str = "";
            try
            {
                sr = new StreamReader(temp, code);
                str = sr.ReadToEnd();   //   读取文件  
            }
            catch (Exception ex)
            {
                Native.writeToPage(Native.getErrorMsg(ex.Message));
                HttpContext.Current.Response.End();
                sr.Close();
            }
            string htmlfilename = fileName + ".js";
            //   替换内容  
            //   这时,模板文件已经读入到名称为str的变量中了  
            str = str.Replace("$fileName$", fileName);
            str = str.Replace("$comArgs$", comArgs);
            str = str.Replace("$structArgs$", structArgs);
            //   写文件  
            try
            {
                sw = new StreamWriter(path + htmlfilename, false, code);
                sw.Write(str);
                sw.Flush();
            }
            catch (Exception ex)
            {
                Native.writeToPage(Native.getErrorMsg(ex.Message));
                HttpContext.Current.Response.End();
            }
            finally
            {
                sw.Close();
            }
        }
        #endregion

    }
}