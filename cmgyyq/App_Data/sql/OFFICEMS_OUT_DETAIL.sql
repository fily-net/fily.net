USE [Fily_gslw]
GO
/****** Object:  Table [dbo].[GENERAL_SEND_DETAIL]    Script Date: 12/12/2015 16:18:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[OFFICEMS_OUT_DETAIL](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[oid] [bigint] NULL DEFAULT (0),
	[msId] [bigint] NULL DEFAULT (0),
	[batchId] [bigint] NULL DEFAULT (0),
	[batchCode] [varchar](50) DEFAULT (''),
	[batchTotal] [numeric](18, 2) NULL DEFAULT (0),
	[batchRemain] [numeric](18, 2) NULL DEFAULT (0),
	[batchPrice] [decimal](18, 2) NULL DEFAULT (0),
	[number] [numeric](18, 2) NULL DEFAULT (0),
	[remainNum] [numeric](18, 2) NULL DEFAULT (0),
	[planNum] [numeric](18, 2) NULL DEFAULT (0),
	[sum] [decimal](18, 2) NULL DEFAULT (0),
	[planSum] [decimal](18, 2) NULL DEFAULT (0),
	[balance] [decimal](18, 2) NULL DEFAULT (0),
	[totalCount] [numeric](18, 2) NULL DEFAULT (0),
	[delFlag] [bit] NULL DEFAULT (0),
	[cTime] [datetime] NULL DEFAULT (getdate()),
	[mTime] [datetime] NULL DEFAULT (getdate()),
	[cPerson] [bigint] NULL DEFAULT (0),
	[mPerson] [bigint] NULL DEFAULT (0)
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF