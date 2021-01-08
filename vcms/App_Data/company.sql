USE [Project_vcms]
GO
/****** 对象:  Table [dbo].[SYS_CM_USER]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[TCDIC_COMPANY](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[title] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[country] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[province] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[address] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[contact] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[contactPhone] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[website] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[product] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[link] [varchar](500) DEFAULT (','),
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