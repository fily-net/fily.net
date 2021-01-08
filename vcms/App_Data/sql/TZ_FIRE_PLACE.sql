USE [MPro_yh]
GO
/****** 对象:  Table [dbo].[TZ_HT_INDEX]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[TZ_FIRE_PLACE](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[nodeName] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[pid] [bigint] DEFAULT (0),
	[depth] [int] DEFAULT (0),
	[parentPath] [varchar](200) DEFAULT (','),
	[sons] [int] DEFAULT (0),
	[treeOrder] [int] DEFAULT (0),
	[type] [int] DEFAULT (0),
	[delFlag] [bit] DEFAULT (0),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0),
	[note] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT ('')
) ON [PRIMARY]

--添加基本节点
insert into TZ_FIRE_PLACE (nodeName) values ('市南养护总公司');

truncate table TZ_FIRE_PLACE;


insert into TZ_FIRE_PLACE (nodeName,parentPath,treeOrder,depth,pid,cPerson) values ('公司本部(桂林路888号)',',1,',1,1,1,);