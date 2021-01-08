USE [MPro_yh]
GO
/****** 对象:  Table [dbo].[SYS_CM_USER]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[DEVICE_MACHINES](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[deviceName] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[deviceCode] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[deviceType] [varchar](20) DEFAULT (''),
	[guiGe] [varchar](20) DEFAULT (''),
	[xiShuJi] [varchar](20) DEFAULT (''),
	[xiShuDian] [varchar](20) DEFAULT (''),
	[dianJiXinHao] [varchar](20) DEFAULT (''),
	[dianJiGongLv] [varchar](20) DEFAULT (''),
	[maker] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),	
	[outTime] [datetime] DEFAULT (NULL),
	[useTime] [datetime] DEFAULT (NULL),
	[origCost] [decimal](18, 2) DEFAULT (0),
	[address] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[zheJiuTime] [datetime] DEFAULT (NULL),
	[type] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[state] [int] DEFAULT (0),
	[inCost] [decimal](18, 2) DEFAULT (0),
	[outCost] [decimal](18, 2) DEFAULT (0),
	[link] [varchar](250) DEFAULT (','),
	[nextCheckTime] [datetime] DEFAULT (getdate()),
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0),
	[delFlag] [bit] DEFAULT ((0)),	
	[note] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT ('')
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO