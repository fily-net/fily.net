USE [MPro_yh]
GO
/****** 对象:  Table [dbo].[SYS_CM_USER]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[PRO_MG](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[wfId] [bigint] DEFAULT (0),
	[nodeName] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	

	[state] [bigint] DEFAULT (0),
	[proCode] [varchar](50) DEFAULT (''),
	[proType] [bigint] DEFAULT (0),
	[proNature] [bigint] DEFAULT (0),
	[proArea] [bigint] DEFAULT (0),
	[proSource] [bigint] DEFAULT (0),
	[address] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[customer] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[contact] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	
	[bTime] [datetime] DEFAULT (NULL),
	[eTime] [datetime] DEFAULT (NULL),
	[progressRate] [bigint] DEFAULT (0),
	[acreage] [decimal](18, 2) DEFAULT (0),
	[outPutValue] [decimal](18, 2) DEFAULT (0),
	[collectTime] [datetime] DEFAULT (NULL),
	[issuedTime] [datetime] DEFAULT (NULL),
	[feedBack] [bigint] DEFAULT (0),
	[inCost] [decimal](18, 2) DEFAULT (0),
	[outCost] [decimal](18, 2) DEFAULT (0),
	
	[execDept] [bigint] DEFAULT (0),
	[execTeam] [bigint] DEFAULT (0),
	[execTeamLeader] [bigint] DEFAULT (0),
	[shuiTestTime] [datetime] DEFAULT (NULL),
	[xiaoDuTime] [datetime] DEFAULT (NULL),
	[deadline] [datetime] DEFAULT (NULL),
	[qingZhao] [bigint] DEFAULT (0),
	[handleTime] [datetime] DEFAULT (NULL),
	[allowTime] [datetime] DEFAULT (NULL),
	[payCost] [decimal](18, 2) DEFAULT (0),

	[lingAllCost] [decimal](18, 2) DEFAULT (0),
	[tuiAllCost] [decimal](18, 2) DEFAULT (0),	

	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (NULL),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0),
	[delFlag] [bit] DEFAULT ((0)),	
	[users] [varchar](250) DEFAULT (','),
	[roles] [varchar](250) DEFAULT (','),
	[observers] [varchar](250) DEFAULT (','),
	[note] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT ('')
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO