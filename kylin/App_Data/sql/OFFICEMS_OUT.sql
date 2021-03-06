USE [Fily_gslw]
GO
/****** Object:  Table [dbo].[GENERAL_SEND]    Script Date: 12/12/2015 16:15:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[OFFICEMS_OUT](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[code] [varchar](200) DEFAULT (''),
	[nodeName] [nvarchar](100) DEFAULT (''),
	[oPerson] [int] NULL DEFAULT (0),
	[dept] [int] NULL DEFAULT (0),
	[wfId] [int] NULL DEFAULT (0),
	[state] [int] NULL DEFAULT (449),
	[note] [nvarchar](200) DEFAULT (''),
	[delFlag] [bit] NULL DEFAULT (0),
	[cTime] [datetime] NULL DEFAULT (getdate()),
	[mTime] [datetime] NULL DEFAULT (null),
	[cPerson] [bigint] NULL DEFAULT (0),
	[mPerson] [bigint] NULL DEFAULT (0),
	[users] [varchar](250) DEFAULT (','),
	[roles] [varchar](250) DEFAULT (','),
	[observers] [varchar](250) DEFAULT (',')
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF