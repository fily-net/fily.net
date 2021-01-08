using System;
using System.Collections.Generic;
using System.Web;
using System.Net.Mail;

namespace Fily.Util
{
    public class Mail
    {
        private SmtpClient client;
        private string subject;
        private string content;
        public Mail() {
            client = new SmtpClient();
            client.DeliveryMethod = SmtpDeliveryMethod.Network;//指定电子邮件发送方式
            client.Host = "smtp.sina.com.cn"; ;//指定SMTP服务器
            client.Credentials = new System.Net.NetworkCredential("jimx2011@sina.com", "jimx2011");//用户名和密码
        }
        public void setSubject(string _subject) { subject = _subject; }
        public string getSubject() { return subject; }
        public void setContent(string _content) { content = _content; }
        public string getContent() { return content; }
        public void addAttach(string _path) {  }
        public bool send(string _to) {
            MailMessage _mailMessage = new MailMessage("jimx2011@sina.com", _to);
            _mailMessage.Subject = getSubject();//主题
            _mailMessage.Body = getContent();//内容
            _mailMessage.BodyEncoding = System.Text.Encoding.UTF8;//正文编码
            _mailMessage.IsBodyHtml = true;//设置为HTML格式
            _mailMessage.Priority = MailPriority.High;//优先级
            try
            {
                client.Send(_mailMessage);
                return true;
            }
            catch
            {
                return false;
            }
        }

    }
}