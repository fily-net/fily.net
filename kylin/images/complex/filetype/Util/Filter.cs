using System;
using System.Collections.Generic;
using System.Web;
using Fily.Base;
using System.Text.RegularExpressions;

namespace Fily.Util
{
    public static class Filter
    {
        #region filterNormalStr: 过滤普通字符串
        /// <summary>
        /// filterNormalStr: 过滤普通字符串
        /// </summary>
        /// <param name="str">要过滤的字符串</param>
        /// <returns>过滤之后的字符串</returns>
        public static string filterNormalStr(string str)
        {
            string[,] charAry = {
                {"，","【※]"},
                {"<","【＜]"},
                {">","【＞]"},
                {"%","【％]"},
                {".","【．]"},
                {"#","【≮]"},
                {"&","【＆]"},
                {"$","【＄]"},
                {"*","【＊]"},
                {"`","【｀]"},
                {"'","【＇]"},
                {"~","【～]"}
            };
            int _len = charAry.GetLength(0);
            for (int i = 0; i < _len; i++)
            {
                str = str.Replace(charAry[i, 0], charAry[i, 1]);
            }
            return str;
        }
        #endregion

        #region filterSqlStr: 过滤sql语句
        /// <summary>
        /// filterSqlStr: 过滤sql语句
        /// </summary>
        /// <param name="str">要过滤的sql字符串</param>
        /// <returns>过滤之后的sql字符串</returns>
        public static string filterSqlStr(string str)
        {
            string[,] charAry = new string[,] { 
                {"insert ","【insert] "},
                {"delete ","【delete] "},
                {"exec ","【exec] "},
                {"execute ","【execute] "},
                {"truncate ","【truncate] "},
                {"drop ","【drop] "},
                {"alter ","【alter] "},
                {"dump ","【dump] "},
                {" from ", " 【from] "},
                {" or ", " 【or] "},
                {"--", "【－－]"},
                {" 1=1 ", " 【1=1] "}
            };
            int _len = charAry.GetLength(0);
            for (int i = 0; i < _len; i++)
            {
                str = Regex.Replace(str, charAry[i, 0], charAry[i, 1], RegexOptions.IgnoreCase);
            }
            return str;
        }
        #endregion

        #region refilterStr: 反过滤字符串
        /// <summary>
        /// refilterStr: 反过滤字符串
        /// </summary>
        /// <param name="str">要反过滤的字符串</param>
        /// <returns>反过滤之后的字符串</returns>
        public static string refilterStr(string str)
        {
            string[,] charAry = { 
                {"【※]", "，"},
                {"【＜]", "<"},
                {"【＞]", ">"},
                {"【％]", "%"},
                {"【．]", "."},
                {"【：]", ":"},
                {"【≮]", "#"},
                {"【＆]", "&"},
                {"【＄]", "$"},
                {"【＊]", "*"},
                {"【｀]", "`"},
                {"【＇]", "'"},
                {"【～]", "~"},
                {"【insert] ", "insert "},
                {"【delete] ", "delete "},
                {"【exec] ", "exec "},
                {"【execute] ", "execute "},
                {"【truncate] ", "truncate "},
                {"【drop] ", "drop "},
                {"【alter] ", "alter "},
                {"【dump] ", "dump "},
                {"【from] ", "from "},
                {"【or] ", "or "},
                {"【and] ", "and "},
                {" 【1=1] ", " 1=1 "},
                {"【－－]", "--"},
                {"&quot;", "&quot;"},
                {"quot;", "&quot;"}
            };
            int _len = charAry.GetLength(0);
            for (int i = 0; i < _len; i++)
            {
                str = Regex.Replace(str, charAry[i, 0], charAry[i, 1], RegexOptions.IgnoreCase);
            }
            return str;
        }
        #endregion
    }
}