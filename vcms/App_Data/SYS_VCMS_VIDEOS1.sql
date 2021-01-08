USE [Fily_vcms]
GO
/****** Object:  Table [dbo].[SYS_CM_FILES]    Script Date: 12/05/2015 14:11:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[SYS_VCMS_VIDEOS](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[pid] [bigint] NULL DEFAULT (0),
	[nodeName] [nvarchar](100) DEFAULT (''),
	[title] [nvarchar](150) DEFAULT (''),
	[times] [varchar](100) DEFAULT (''),
	[author] [nvarchar](150) DEFAULT (''),
	[keywords] [nvarchar](300) DEFAULT (','),
	[tags] [nvarchar](300) DEFAULT (','),
	[sysName] [varchar](30) DEFAULT (''),
	[extName] [varchar](10) DEFAULT ('ÎÄ¼þ¼Ð'),
	[origName] [nvarchar](100) DEFAULT (''),
	[catelog] [nvarchar](100) DEFAULT (''),
	[pdfPath] [nvarchar](200) DEFAULT (''),
	[videoPath] [nvarchar](200) DEFAULT (''),
	[size] [bigint] NULL DEFAULT (0),
	[minutes] [bigint] NULL DEFAULT (0),
	[depth] [int] NULL DEFAULT (0),
	[parentPath] [varchar](200) DEFAULT (','),
	[sons] [int] NULL DEFAULT (0),
	[treeOrder] [int] NULL DEFAULT (0),
	[type] [int] NULL DEFAULT (0),
	[videoType] [int] NULL DEFAULT (0),
	[link] [varchar](200) DEFAULT (','),
	[note] [nvarchar](1000) DEFAULT (''),
	[delFlag] [bit] NULL DEFAULT (0),
	[cTime] [datetime] NULL DEFAULT (getdate()),
	[mTime] [datetime] NULL DEFAULT (getdate()),
	[cPerson] [bigint] NULL DEFAULT (0),
	[mPerson] [bigint] NULL DEFAULT (0),
	[roles] [varchar](250) DEFAULT (','),
	[observers] [varchar](250) DEFAULT (','),
	[users] [varchar](250) DEFAULT (',')
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF