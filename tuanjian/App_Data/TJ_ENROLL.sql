USE [Project_tuanjian]
GO
/****** 对象:  Table [dbo].[SYS_TREE]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[TJ_ENROLL](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[qu] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[xuexiao] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[nianji] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[dianhua] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[youxiang] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[techang] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[state] [int] DEFAULT (0),
	[delFlag] [bit] DEFAULT (0),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0)
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO