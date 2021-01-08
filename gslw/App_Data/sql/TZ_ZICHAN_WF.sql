USE [MPro_yh]
GO
/****** 对象:  Table [dbo].[GENERAL_SEND]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  
CREATE TABLE [dbo].[TZ_ZICHAN_WF](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[code] [varchar](40) DEFAULT (''),
	[scanCode] [varchar](40) DEFAULT (''),
	[title] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[link] [varchar](200) DEFAULT (','),
	[dept] [int] DEFAULT (0),
	[wfId] [int] DEFAULT (0),
	[type] [int] DEFAULT (0),
	[note] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[delFlag] [bit] DEFAULT ((0)),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT null,
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0)
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF