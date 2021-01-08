USE [MPro_yh]
GO
/****** 对象:  Table [dbo].[SYS_CM_USER]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[DEVICE_CAR_ACCIDENT](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[oid] [int] DEFAULT (0),
	[address] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[risk] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[breakRules] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[realPrice] [decimal](18, 2) DEFAULT (0),
	[planPrice] [decimal](18, 2) DEFAULT (0),
	[dirver] [int] DEFAULT (0),
	[rTime] [datetime] DEFAULT (NULL),
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0),
	[delFlag] [bit] DEFAULT (0),	
	[note] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT ('')
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO