USE [MPro_yh]
GO
/****** 对象:  Table [dbo].[SYS_CM_USER]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[DEVICE_CAR](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[carName] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[carCode] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[carType] [int] DEFAULT (0),
	[vehicleType] [int] DEFAULT (0),
	[useType] [int] DEFAULT (0),
	[production] [int] DEFAULT (0),
	[tonnage] [int] DEFAULT (0),
	[brands] [int] DEFAULT (0),
	[code] [varchar](20) DEFAULT (''),
	[carNum] [varchar](20) DEFAULT (''),
	[engineNum] [varchar](20) DEFAULT (''),
	[frameNum] [varchar](20) DEFAULT (''),
	[regeistTime] [datetime] DEFAULT (getdate()),
	[carOwner] [int] DEFAULT (0),
	[carNature] [int] DEFAULT (0),
	[useUnit] [int] DEFAULT (0),
	[origUseUnit] [int] DEFAULT (0),
	[recallTime] [datetime] DEFAULT (getdate()),
	[reinTime] [datetime] DEFAULT (getdate()),
	[useDept] [int] DEFAULT (0),
	[usePerson] [int] DEFAULT (0),
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