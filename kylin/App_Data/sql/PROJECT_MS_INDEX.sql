USE [Fily_gslw]
GO
/****** 对象:  Table [dbo].[TZ_HT_INDEX]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[PROJECT_MS_INDEX](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[nodeName] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[pid] [bigint] DEFAULT (0),
	[depth] [int] DEFAULT (0),
	[parentPath] [varchar](200) DEFAULT (','),
	[sons] [int] DEFAULT (0),
	[treeOrder] [int] DEFAULT (0),
	[typeCode] [varchar](200) DEFAULT (''),
	[typeTitle] [varchar](200) DEFAULT (''),
	[type] [int] DEFAULT (0),
	[delFlag] [bit] DEFAULT (0),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0),
	[note] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT ('')
) ON [PRIMARY]