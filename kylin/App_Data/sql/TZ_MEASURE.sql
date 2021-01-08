USE [MPro_yh]
GO
/****** 对象:  Table [dbo].[SYS_TREE]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[TZ_MEASURE](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[nodeName] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[pid] [bigint] DEFAULT (0),
	[depth] [int] DEFAULT (0),
	[parentPath] [varchar](200) DEFAULT (','),
	[sons] [int] DEFAULT (0),
	[treeOrder] [int] DEFAULT (0),
	[type] [int] DEFAULT (0),
	[scanCode] [varchar](20) DEFAULT (''),
	[wareCode] [varchar](20) DEFAULT (''),
	[wareName] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),	
	[wareMode] [varchar](20) DEFAULT (''),
	[wareFormat] [varchar](20) DEFAULT (''),
	[wareAccuracy] [varchar](20) DEFAULT (''),
	[serialNumber] [varchar](20) DEFAULT (''),
	[madeUnits] [varchar](50) DEFAULT (''),
	[usedUnits] [int] DEFAULT (0),
	[usedTime] [datetime] DEFAULT (NULL),
	[assessType] [int] DEFAULT (0),
	[origiCost] [varchar](50) DEFAULT (''),
	[assetNumber] [varchar](50) DEFAULT (''),
	[preCheckTime] [datetime] DEFAULT (NULL),
	[checkCycle] [int] DEFAULT (0),
	[nextCheckTime] [datetime] DEFAULT (NULL),
	[delFlag] [bit] DEFAULT ((0)),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0),
	[note] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT ('')
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO