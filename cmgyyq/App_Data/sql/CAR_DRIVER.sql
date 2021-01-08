USE [MPro_yh]
GO
/****** 对象:  Table [dbo].[SYS_CM_USER]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[CAR_DRIVER](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[name] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[code] [varchar](20) DEFAULT (''),
	[sex] [int] DEFAULT (0),
	[avatar] [varchar](100) DEFAULT ('default.jpg'),
	[birthday] [datetime] Null,
	[idNumber] [varchar](20) DEFAULT (''),
	[getLicenseTime] [datetime] Null,
	[address] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[driverCode] [varchar](20) DEFAULT (''),
	[carType] [int] DEFAULT (0),
	[department] [int] DEFAULT (0),	
	[mobilePhoneNum] [varchar](20) DEFAULT (''),
	[nextCheckTime] [datetime] DEFAULT (getdate()),
	[link] [varchar](200) DEFAULT (','),
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