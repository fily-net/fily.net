using System;
using System.Collections.Generic;
using System.Web;
using System.Data;
using System.Data.OleDb;

namespace Fily.Office
{
    public static class ExeclUtil
    {
        public static void DataSetToExcel(string Path, DataSet oldds)
        {
            //先得到汇总Excel的DataSet 主要目的是获得Excel在DataSet中的结构  
            //string strCon = "Provider=Microsoft.Jet.OLEDB.4.0;" + "Data Source=" + Path + ";" + "Extended Properties=Excel 8.0;";
            //string strCon = "Provider=Microsoft.Jet.OleDb.4.0;" + "data source=" +Path+ ";Extended Properties='Excel 8.0; HDR=Yes; IMEX=1'"; //此连接只能操作Excel2007之前(.xls)文件  
            string strCon = "Provider=Microsoft.Ace.OleDb.12.0;" + "data source=" + Path + ";Extended Properties='Excel 12.0; HDR=No; IMEX=0'"; //此连接可以操作.xls与.xlsx文件 (支持Excel2003 和 Excel2007 的连接字符串)  
            //备注： "HDR=yes;"是说Excel文件的第一行是列名而不是数据，"HDR=No;"正好与前面的相反。//      "IMEX=1 "如果列中的数据类型不一致，使用"IMEX=1"可必免数据类型冲突。   


            OleDbConnection myConn = new OleDbConnection(strCon);
            string strCom = "select * from [Sheet1$]";
            myConn.Open();
            OleDbDataAdapter myCommand = new OleDbDataAdapter(strCom, myConn);
            System.Data.OleDb.OleDbCommandBuilder builder = new OleDbCommandBuilder(myCommand);
            //QuotePrefix和QuoteSuffix主要是对builder生成InsertComment命令时使用。  
            builder.QuotePrefix = "[";     //获取insert语句中保留字符（起始位置）  
            builder.QuoteSuffix = "]"; //获取insert语句中保留字符（结束位置）  
            DataSet newds = new DataSet();
            myCommand.Fill(newds, "Table1");
            for (int i = 0; i < oldds.Tables[0].Rows.Count; i++)
            {
                //在这里不能使用ImportRow方法将一行导入到news中，  
                //因为ImportRow将保留原来DataRow的所有设置(DataRowState状态不变)。  
                //在使用ImportRow后newds内有值，但不能更新到Excel中因为所有导入行的DataRowState!=Added  
                DataRow nrow = newds.Tables["Table1"].NewRow();
                for (int j = 0; j < oldds.Tables[0].Columns.Count; j++)
                {
                    nrow[j] = oldds.Tables[0].Rows[i][j];

                }
                newds.Tables["Table1"].Rows.Add(nrow);
            }
            myCommand.Update(newds, "Table1");
            myConn.Close();
        }
        /// <summary>
        /// 从Excel提取数据--》Dataset
        /// </summary>
        /// <param name="filename">Excel文件路径名</param>
        public static DataSet ImportXlsToDataSet(string fileName)
        {
            try
            {
                if (fileName == string.Empty)
                {
                    throw new ArgumentNullException("文件名为空！");
                }
                //
                /*
                string oleDBConnString = String.Empty;
                oleDBConnString = "Provider=Microsoft.Jet.OLEDB.4.0;";
                oleDBConnString += "Data Source=";
                oleDBConnString += fileName;
                oleDBConnString += ";Extended Properties=Excel 8.0;";*/

                //string oleDBConnString = "Provider=Microsoft.Ace.OleDb.12.0;Data Source=" + fileName + ";Extended Properties='Excel 12.0; HDR=No; IMEX=0'"; //此连接可以操作.xls与.xlsx文件 (支持Excel2003 和 Excel2007 的连接字符串)  
                string oleDBConnString = string.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties='Excel 8.0;HDR=Yes;IMEX=1;'", fileName);
                //
                OleDbConnection oleDBConn = null;
                OleDbDataAdapter oleAdMaster = null;
                DataTable m_tableName = new DataTable();
                DataSet ds = new DataSet();

                oleDBConn = new OleDbConnection(oleDBConnString);
                oleDBConn.Open();
                m_tableName = oleDBConn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);

                if (m_tableName != null && m_tableName.Rows.Count > 0)
                {
                    m_tableName.TableName = m_tableName.Rows[0]["TABLE_NAME"].ToString();

                }
                string sqlMaster;
                sqlMaster = " SELECT *  FROM [" + m_tableName.TableName + "]";
                oleAdMaster = new OleDbDataAdapter(sqlMaster, oleDBConn);
                oleAdMaster.Fill(ds, "m_tableName");
                oleAdMaster.Dispose();
                oleDBConn.Close();
                oleDBConn.Dispose();

                //测试是否提取数据
                //this.Datagrid1.DataSource = ds.Tables["m_tableName"];
                //this.Datagrid1.DataBind();
                //将Dataset中数据导入SQL

                return ds;
                //AddDatasetToSQL(ds);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //将Dataset的内容导入SQL
        public static bool AddDatasetToSQL(DataSet pds)
        {
            int ic, ir;
            ic = pds.Tables[0].Columns.Count;
            if (pds.Tables[0].Columns.Count < 7)
            {
                throw new Exception("导入Excel格式错误！Excel只有" + ic.ToString() + "列");
            }
            ir = pds.Tables[0].Rows.Count;
            if (pds != null && pds.Tables[0].Rows.Count > 0)
            {
                for (int i = 0; i < pds.Tables[0].Rows.Count; i++)
                {
                    /*
                    Save(pds.Tables[0].Rows[i][0].ToString(), pds.Tables[0].Rows[i][1].ToString(),
                        pds.Tables[0].Rows[i][2].ToString(), pds.Tables[0].Rows[i][3].ToString(),
                        pds.Tables[0].Rows[i][4].ToString(), pds.Tables[0].Rows[i][5].ToString(),
                        pds.Tables[0].Rows[i][6].ToString());*/
                }
            }
            else
            {
                throw new Exception("导入数据为空！");
            }
            return true;
        }
    }
}