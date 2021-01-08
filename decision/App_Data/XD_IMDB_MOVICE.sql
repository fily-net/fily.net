USE [MPro_xd]
GO
/****** 对象:  Table [dbo].[SYS_TREE]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[XD_IMDB_MOVICE](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[rank] [int] DEFAULT (0),
	[title] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[publicTime] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[director] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[episode] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[company] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[awards] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[note] [nvarchar](500) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[country] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[keys] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[language] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[imdbPoint] [decimal](18, 1) DEFAULT (0),
	[minuteLength] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[douBanPoint] [decimal](18, 1) DEFAULT (0),
	[types] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[imdbLink] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[type] [int] DEFAULT (0),	
	[link] [varchar](200) DEFAULT (','),
	[delFlag] [bit] DEFAULT (0),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (NULL),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0)
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO