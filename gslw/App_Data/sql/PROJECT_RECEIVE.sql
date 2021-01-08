USE [MPro_yh1]
GO
/****** 对象:  Table [dbo].[TK_BASIC]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  
CREATE TABLE [dbo].[PROJECT_RECEIVE](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[code] [varchar](200) DEFAULT (''),
	[scanCode] [varchar](200) DEFAULT (''),
	[nodeName] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[whId] [int] DEFAULT (0),
	[proId] [int] DEFAULT (0),
	[shenQingPerson] [int] DEFAULT (0),
	[shenQingTime] [datetime] DEFAULT (getdate()),
	[shenHePerson] [int] DEFAULT (0),
	[shenHeTime] [datetime] DEFAULT (getdate()),
	[caiGouPerson] [int] DEFAULT (0),
	[gongYingShang] [varchar](50) DEFAULT (''),
	[faPiaoHao] [varchar](50) DEFAULT (''),
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