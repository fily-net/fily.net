USE [MPro_dongli]
GO
/****** 对象:  Table [dbo].[SYS_TREE]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[DL_MESSAGE](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[title] [varchar](50) DEFAULT (''),
	[url] [varchar](50) DEFAULT (''),
	[name] [varchar](50) DEFAULT (''),
	[mobile] [varchar](50) DEFAULT (''),
	[type] [int] DEFAULT (0),	
	[link] [varchar](200) DEFAULT (''),
	[note] [nvarchar](1000) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[state] [int] DEFAULT (0),
	[delFlag] [bit] DEFAULT ((0)),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0)
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO