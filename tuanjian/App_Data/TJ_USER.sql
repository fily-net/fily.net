USE [MPro_tuanjian]
GO
/****** 对象:  Table [dbo].[SYS_TREE]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[TJ_USER](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[uid] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[icCard] [varchar](20) DEFAULT (''),
	[pwd] [varchar](20) DEFAULT ('1234'),
	[cName] [nvarchar](20) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[eName] [varchar](20) DEFAULT (''),
	[sex] [int] DEFAULT (0),
	[avatar] [varchar](100) DEFAULT ('default.jpg'),
	[type] [int] DEFAULT (0),
	[link] [varchar](200) DEFAULT (''),
	[state] [int] DEFAULT (0),
	[birthday] [datetime] Null,
	[pinYin] [varchar](4) DEFAULT(''),
	[agents] [varchar](200) DEFAULT (','),
	[post] [varchar](20) DEFAULT (''),
	[postRoom] [int] DEFAULT (0),
	[department] [int] DEFAULT (0),
	[email] [varchar](50) DEFAULT (''),
	[ifEnableEmail] [bit] DEFAULT ((0)),
	[fixedPhoneNum] [varchar](20) DEFAULT (''),
	[mobilePhoneNum] [varchar](20) DEFAULT (''),
	[address] [varchar](200) DEFAULT (''),
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