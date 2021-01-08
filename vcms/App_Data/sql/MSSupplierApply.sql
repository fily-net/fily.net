USE [MPro_yh1]
GO
/****** 对象:  Table [dbo].[SUPPLIER_APPLY]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[PRO_SUPPLIER_APPLY](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[nodeName] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[wfId] [int] DEFAULT (0),
	[companyName] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[QCN] [varchar](100) DEFAULT (''),	
	[QL] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[legalPerson] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[responsePerson] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[contact] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[mobilphone] [varchar](50) DEFAULT (''),	
	[business] [nvarchar](500) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[note] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[type] [int] DEFAULT (0),
	[link] [varchar](250) DEFAULT (','),
	[state] [int] DEFAULT (0),
	[delFlag] [bit] DEFAULT (0),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0),
	[users] [varchar](250) DEFAULT (','),
	[roles] [varchar](250) DEFAULT (','),
	[owners] [varchar](250) DEFAULT (',')
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF