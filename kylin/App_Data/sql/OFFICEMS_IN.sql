USE [Fily_gslw]
GO
/****** Object:  Table [dbo].[GENERAL_RECEIVE]    Script Date: 12/12/2015 16:03:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[OFFICEMS_IN](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[code] [varchar](200) DEFAULT (''),
	[shenQingPerson] [int] DEFAULT (0),
	[shenQingTime] [datetime] DEFAULT (getdate()),
	[gongYingShang] [varchar](50) DEFAULT (''),
	[faPiaoHao] [varchar](50) DEFAULT (''),
	[jieSuanMethod] [int] DEFAULT (274),
	[cost] [decimal](18, 2) NULL,
	[wfId] [int] DEFAULT (0),
	[state] [int] DEFAULT (449),
	[note] [nvarchar](200) DEFAULT (''),
	[delFlag] [bit] DEFAULT (0),
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0),
	[users] [varchar](250) DEFAULT (','),
	[roles] [varchar](250) DEFAULT (','),
	[observers] [varchar](250) DEFAULT (',')
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF