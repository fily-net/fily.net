USE [Fily_gslw]
GO
/****** 对象:  Table [dbo].[SYS_CM_USER]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[SYS_WH_MS_DETAIL](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[typeId] [bigint] DEFAULT (0),
	[typeName] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[msCode] [varchar](50) DEFAULT (''),
	[nodeName] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[engName] [varchar](50) DEFAULT (''),
	[version] [varchar](50) DEFAULT (''),
	[guiGe] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),	
	[engGuiGe] [varchar](50) DEFAULT (''),
	[xingHao] [varchar](50) DEFAULT (''),
	[jianChen] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[zhuJiMa] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[tuHao] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[tiaoXingMa] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[danWei] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[chanPinXian] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[pinPai] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[shuiLei] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[chanDi] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[guanLiMoShi] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[daYinMingChen] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
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