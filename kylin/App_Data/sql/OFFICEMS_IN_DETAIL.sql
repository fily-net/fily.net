USE [Fily_gslw]
GO
/****** Object:  Table [dbo].[GENERAL_RECEIVE_DETAIL]    Script Date: 12/12/2015 16:09:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[OFFICEMS_IN_DETAIL](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[oid] [int] NULL DEFAULT (0),
	[msId] [int] NULL DEFAULT (0),
	[batchId] [int] NULL DEFAULT (0),
	[batchCode] [varchar](50) COLLATE Chinese_PRC_CI_AS NULL DEFAULT (''),
	[totalCount] [numeric](18, 2) NULL DEFAULT (0),
	[balance] [decimal](18, 2) NULL DEFAULT (0),
	[number] [numeric](18, 2) NULL DEFAULT (0),
	[price] [numeric](18, 2) NULL DEFAULT (0),
	[sum] [numeric](18, 2) NULL DEFAULT (0),
	[cPerson] [int] NULL DEFAULT (0),
	[cTime] [datetime] NULL DEFAULT (getdate()),
	[mPerson] [int] NULL DEFAULT (0),
	[mTime] [datetime] NULL DEFAULT (null)
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF