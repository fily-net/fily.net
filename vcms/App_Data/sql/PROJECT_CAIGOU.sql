USE [Fily_gslw]
GO
/****** 对象:  Table [dbo].[TK_BASIC]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  
CREATE TABLE [dbo].[PROJECT_CAIGOU](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[code] [varchar](200) DEFAULT (''),
	[scanCode] [varchar](200) DEFAULT (''),
	[proName] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[proCode] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[proId] [int] DEFAULT (0),
	[shenQingPerson] [varchar](50) DEFAULT (''),
	[shenQingTime] [datetime] DEFAULT (getdate()),
	[orderTime] [datetime] DEFAULT (getdate()),
	[arrivedTime] [datetime] DEFAULT (getdate()),
	[caiGouPerson] [varchar](50) DEFAULT (''),
	[caiGouDept] [varchar](50) DEFAULT (''),
	[gongYingShang] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[faPiaoHao] [varchar](150) DEFAULT (''),
	[faPiaoPrice] [decimal](18, 2) DEFAULT (0),
	[jieSuanMethod] [int] DEFAULT (274),
	[type] [int] DEFAULT (0),
	[state] [int] DEFAULT (0),
	[note] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[delFlag] [bit] DEFAULT ((0)),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0)
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO