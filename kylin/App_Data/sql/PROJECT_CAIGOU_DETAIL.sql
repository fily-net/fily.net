USE [Fily_gslw]
GO
/****** 对象:  Table [dbo].[TK_WH_RECEIVE_DETAIL]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  
CREATE TABLE [dbo].[PROJECT_CAIGOU_DETAIL](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[caiGouId] [int] DEFAULT (0),
	[msCode] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[msType] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[msName] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[guiGe] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[danWei] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[num] [numeric](18, 2) DEFAULT (0),
	[shuiLv] [numeric](18, 2) DEFAULT (0),
	[wuShuiJinJia] [numeric](18, 2) DEFAULT (0),
	[hanShuiJinJia] [numeric](18, 2) DEFAULT (0),
	[wuShuiJinE] [numeric](18, 2) DEFAULT (0),
	[jiaShuiHeJi] [numeric](18, 2) DEFAULT (0),
	[shuiE] [decimal](18, 2) DEFAULT (0),
	[kouShuiLeiBei] [numeric](18, 2) DEFAULT (0),
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0)
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO