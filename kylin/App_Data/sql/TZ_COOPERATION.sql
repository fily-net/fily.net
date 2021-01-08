USE [MPro_yh]
GO
/****** 对象:  Table [dbo].[SYS_TREE]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[TZ_COOPERATION](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[companyName] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[QCN] [varchar](100) DEFAULT (''),	
	[QL] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[legalPerson] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[responsePerson] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[contact] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[mobilphone] [varchar](50) DEFAULT (''),	
	[business] [nvarchar](500) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[delFlag] [bit] DEFAULT (0),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0)
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO