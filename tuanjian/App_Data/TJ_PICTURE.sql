USE [MPro_tuanjian]
GO
/****** 对象:  Table [dbo].[SYS_TREE]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[TJ_PICTURE](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[zan] [bigint] DEFAULT (0),
	[userId] [bigint] DEFAULT (0),
	[regionId] [bigint] DEFAULT (0),
	[latitude] [varchar](50) DEFAULT (''),
	[longitude] [varchar](50) DEFAULT (''),
	[location] [varchar](250) DEFAULT (''),
	[address] [varchar](250) DEFAULT (''),
	[url] [varchar](250) DEFAULT (''),
	[size] [bigint] DEFAULT (0),
	[ext] [varchar](10) DEFAULT (''),
	[name] [varchar](10) DEFAULT (''),
	[fullName] [varchar](10) DEFAULT (''),
	[tempName] [varchar](250) DEFAULT (''),
	[rejectReason] [varchar](10) DEFAULT (''),
	[nodeName] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[type] [int] DEFAULT (0),	
	[link] [varchar](200) DEFAULT (''),
	[note] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[state] [int] DEFAULT (0),
	[delFlag] [bit] DEFAULT ((0)),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0),
	[roles] [varchar](250) DEFAULT (','),
	[users] [varchar](250) DEFAULT (',')
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO