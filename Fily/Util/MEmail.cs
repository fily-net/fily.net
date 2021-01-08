using System;
using System.Collections.Generic;
using System.Web;
using Fily.Data;
using Fily.Base;

namespace Fily.Util
{
    public class MEmail
    {
        private BaseApi api;
        private const int TYPE_COPY = 10;
        private const int TYPE_SEND = 20;
        private const int TYPE_EMAIL = 1;
        private string T_PREFIX = "U_EMAIL_", T_EMAIL_USER;
        public MEmail(BaseApi _api) { api = _api; T_EMAIL_USER = T_PREFIX + MSession.getClientKey(); }
        public string enabledMail(int uid) {
            string _sql = MString.format(@"
                if not exists(select * from sysobjects where name='{0}')
                CREATE TABLE [dbo].[{0}](
	                [id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	                [nodeName] [nvarchar](300) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	                [pid] [bigint] DEFAULT (0),
	                [depth] [int] DEFAULT (0),
	                [parentPath] [varchar](200) DEFAULT (','),
	                [sons] [int] DEFAULT (0),
	                [treeOrder] [int] DEFAULT (0),
	                [owners] [varchar](2000) DEFAULT (','),
	                [ifRead] [bigint] DEFAULT (0),
	                [ifAttach] [bigint] DEFAULT (0),
	                [state] [int] DEFAULT (0),
	                [type] [int] DEFAULT (0),
	                [link] [varchar](200) DEFAULT (','),
	                [content] [nvarchar](3800) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	                [delFlag] [bit] DEFAULT ((0)),	
	                [cTime] [datetime] DEFAULT (getdate()),
	                [mTime] [datetime] DEFAULT (getdate()),
	                [cPerson] [bigint] DEFAULT (0),
	                [mPerson] [bigint] DEFAULT (0)
                ) ON [PRIMARY]
                insert into {0} (nodeName) values ('我的文件夹');
            ", T_PREFIX + uid);
            return api.execQuery(_sql);
        }
        public string saveAsCopy(string _json)
        {
            string []_kv = MConvert.toKV(_json);
            return api.execQuery(MString.getInsertStr(T_EMAIL_USER, _kv[0] + ", type", _kv[1] + ", " + TYPE_COPY));
        }
        public string updateByID(string _json, int _id)
        {
            return api.execQuery(MString.getUpdateStr(T_EMAIL_USER, MConvert.toUpdateSql(_json), "id="+_id));
        }
        public string send(string _json)
        {
            string _return = String.Empty;
            SqlTrans _trans = new SqlTrans(api);
            try
            {
                string[] _kv = MConvert.toKV(_json), _owners = MConvert.getValue(_json, "owners").Split(',');
                _trans.execNonQuery(MString.getInsertStr(T_EMAIL_USER, _kv[0] + ", type", _kv[1] + ", " + TYPE_SEND));
                string _link = MConvert.getValue(_json, "link");
                if (_link.Length > 1) { _link = "1"; } else { _link = "0"; }
                for (int i = 0, _len = _owners.Length; i < _len; i++) { 
                    string _uid = _owners[i];
                    if (Native.isEmpty(_uid)){ continue; }
                    _trans.execNonQuery(MString.getInsertStr(T_PREFIX + _uid, _kv[0] + ", type, ifAttach", _kv[1] + ", " + TYPE_EMAIL + ", " + _link));
                }
                _trans.commit();
            }
            catch (Exception e)
            {
                _return = Native.getErrorMsg(e.Message);
                _trans.rollback();
            }
            finally {
                _trans.close();
            }
            return _return;
        }
        public string deleteEmails(string _ids)
        {
            return api.execQuery(MString.getDeleteStr(T_EMAIL_USER, "id in (" + _ids+")"));
        }
    }
}