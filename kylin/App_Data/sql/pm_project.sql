USE [MPro_yh1]
GO
/****** 对象:  Table [dbo].[SYS_PM_PROJECT]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  
CREATE TABLE [dbo].[SYS_PM_PROJECT](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[pid] [bigint] DEFAULT (0),
	[depth] [int] DEFAULT (0),
	[parentPath] [varchar](200) DEFAULT (','),
	[sons] [int] DEFAULT (0),
	[treeOrder] [int] DEFAULT (0),
	[nodeName] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[schedule] [int] DEFAULT (0),
	[step] [int] DEFAULT (0),	
	[state] [int] DEFAULT (0),
	[proType] [int] DEFAULT (0),
	[type] [int] DEFAULT (0),	
	[link] [varchar](200) DEFAULT (','),
	[sTime] [datetime] DEFAULT (''),
	[eTime] [datetime] DEFAULT (''),
	[preSTime] [datetime] DEFAULT (''),
	[preETime] [datetime] DEFAULT (''),
	[note] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[delFlag] [bit] DEFAULT ((0)),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0),
	[owners] [varchar](250) DEFAULT (','),
	[roles] [varchar](250) DEFAULT (','),
	[users] [varchar](250) DEFAULT (',')
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF


select * from dbo.SYS_CM_GLOBAL_TABLE where pid > 10; charindex(','+cast(pid as varchar(15)+',', ))<>0

select id from SYS_CM_GLOBAL_TABLE where delFlag<>1 and pid > 158 and treeOrder = 1 order by treeOrder asc; 


select nodeName, id from SYS_CM_GLOBAL_TABLE where delFlag<>1 and charindex(','+cast(158 as varchar(15))+',', parentPath)<>0 and treeOrder = 1 order by treeOrder asc;

select id from SYS_CM_GLOBAL_TABLE where delFlag<>1 and charindex(','+cast(pid as varchar(15))+',', parentPath)<>0 and treeOrder = 1 order by treeOrder asc; 