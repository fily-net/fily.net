USE [MPro_yh]
GO
/****** ����:  Table [dbo].[SYS_TREE]    �ű�����: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --ϵͳ��ṹ����
CREATE TABLE [dbo].[TZ_ZICHAN_REPAIR](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[wfId] [int] DEFAULT (0),	
	[reType] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[reTime] [datetime] DEFAULT (NULL),
	[delFlag] [bit] DEFAULT (0),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0),
	[note] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT ('')
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO