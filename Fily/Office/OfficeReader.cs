using System;
using System.Collections.Generic;
using System.Web;
using Microsoft.Office.Core;
using Word = Microsoft.Office.Interop.Word;
using Excel = Microsoft.Office.Interop.Excel;
using PowerPoint = Microsoft.Office.Interop.PowerPoint;
namespace Fily.Office
{
    public class OfficeReader
    {
        public static string ReadWord(string wordFileName)
        {
            string text = string.Empty;
            Word.ApplicationClass app = null;
            Word.Document doc = null;
            object readOnly = true;
            object missing = System.Reflection.Missing.Value;
            object fileName = wordFileName;
            try
            {
                app = new Microsoft.Office.Interop.Word.ApplicationClass();

                doc = app.Documents.Open(ref fileName, ref missing, ref readOnly, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing);

                doc.Activate();
                //doc.ActiveWindow.Selection.WholeStory();
                //doc.ActiveWindow.Selection.Copy();
                //doc.Content.;
                //System.Windows.Forms.IDataObject data = System.Windows.Forms.Clipboard.GetDataObject();
                //text = data.GetData(System.Windows.Forms.DataFormats.Text).ToString();



               // doc.Activate();
                text = doc.Content.Text;
                //text = doc.Content.Text.Replace("\r", "<br>").Replace("\n", "<br>").Replace("\t", string.Empty);
            }
            catch (Exception e)
            {
                text = e.Message;
            }
            finally
            {
                doc.Close(ref missing, ref missing, ref missing);
                doc = null;
                app.Quit(ref missing, ref missing, ref missing);
                app = null;
            }
            return text;
        }

        public static string ReadExcel(string excelFileName)
        {
            string text = string.Empty;
            Excel.ApplicationClass app = null;
            Excel.Workbook book = null;
            object readOnly = true;
            object missing = System.Reflection.Missing.Value;
            object fileName = excelFileName;
            try
            {
                app = new Microsoft.Office.Interop.Excel.ApplicationClass();
                book = app.Workbooks.Open(fileName.ToString(), missing, readOnly, missing, missing, missing, missing, missing, missing, missing, missing, missing, missing, missing, missing);
                foreach (Excel.Worksheet sheet in book.Sheets)
                {
                    text += "<table>";
                    for (int i = 1; i <= sheet.UsedRange.Cells.Rows.Count; i++)
                    {
                        text += "<tr><td style=\"padding:6px;border:1px solid #ccc;margin:none;margin:0px;\">" + (i-1) + "</td>";
                        for (int j = 1; j <= sheet.UsedRange.Cells.Columns.Count; j++)
                        {
                            text += "<td style=\"padding:6px;border:1px solid #ccc;margin:none;margin:0px;\">" + ((Excel.Range)sheet.Cells[i, j]).Text.ToString().Replace("\r", string.Empty).Replace("\n", string.Empty).Replace("\t", string.Empty) + "</td>";
                        }
                        text += "</td>";
                    }
                    text += "</table>";
                }
            }
            catch
            {

            }
            finally
            {
                book.Close(missing, fileName, missing);
                book = null;
                app.Quit();
                app = null;
            }
            return text;
        }

        public static string ReadPPT(string pptFileName)
        {
            string text = string.Empty;
            PowerPoint.ApplicationClass app = null;
            PowerPoint.Presentation pp = null;
            object readOnly = true;
            object missing = System.Reflection.Missing.Value;
            object fileName = pptFileName;

            try
            {
                app = new Microsoft.Office.Interop.PowerPoint.ApplicationClass();
                pp = app.Presentations.Open(fileName.ToString(), Microsoft.Office.Core.MsoTriState.msoTrue, Microsoft.Office.Core.MsoTriState.msoFalse, Microsoft.Office.Core.MsoTriState.msoFalse);

                foreach (PowerPoint.Slide slide in pp.Slides)
                {
                    foreach (PowerPoint.Shape shape in slide.Shapes)
                    {
                        text += shape.TextFrame.TextRange.Text.Replace("\r", string.Empty).Replace("\n", string.Empty).Replace("\t", string.Empty) + " ";
                    }
                }
            }
            catch
            {

            }
            finally
            {
                pp.Close();
                pp = null;
                app.Quit();
                app = null;
            }

            return text;
        }
    }
}