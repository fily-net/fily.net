USE [MPro_yh1]
GO
/****** 对象:  Table [dbo].[TK_WH_RECEIVE_DETAIL]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  
CREATE TABLE [dbo].[PROJECT_RECEIVE_DETAIL](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[oid] [int] DEFAULT (0),
	[msId] [int] DEFAULT (0),
	[totalCount] [numeric](18, 2) DEFAULT (0),
	[balance] [decimal](18, 2) DEFAULT (0),
	[number] [numeric](18, 2) DEFAULT (0),
	[price] [numeric](18, 2) DEFAULT (0),
	[sum] [numeric](18, 2) DEFAULT (0),
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0)
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO