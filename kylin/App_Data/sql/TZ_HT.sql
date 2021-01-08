USE [MPro_yh]
GO
/****** 对象:  Table [dbo].[SYS_TREE]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[TZ_HT](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[link] [varchar](250) DEFAULT (','),
	[scanCode] [varchar](20) DEFAULT (''),
	[wfId] [int] DEFAULT (0),
	[state] [int] DEFAULT (0),
	[type] [int] DEFAULT (0),
	[htCode] [varchar](20) DEFAULT (''),
	[htType] [int] DEFAULT (0),
	[htName] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[htAddress] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[htCompany] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[htValue1] [numeric](18,2) DEFAULT (0),
	[htValue2] [numeric](18,2) DEFAULT (0),
	[htSignTime] [datetime] DEFAULT (NULL),
	[htRunBTime] [datetime] DEFAULT (NULL),
	[htRunETime] [datetime] DEFAULT (NULL),
	[htRunTime] [varchar](40) DEFAULT (''),
	[htRunDept] [int] DEFAULT (0),
	[htChangeNote] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[htArgNote] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[delFlag] [bit] DEFAULT (0),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0),
	[note] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT ('')
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO