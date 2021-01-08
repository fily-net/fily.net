USE [MPro_dongli]
GO
/****** 对象:  Table [dbo].[SYS_VIEW]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[DL_CATAGORY](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[nodeName] [nvarchar](100) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[pid] [bigint] DEFAULT (0),
	[depth] [int] DEFAULT (0),
	[parentPath] [varchar](200) DEFAULT (','),
	[sons] [int] DEFAULT (0),
	[treeOrder] [int] DEFAULT (0),
	[type] [int] DEFAULT (0),	
	[link] [varchar](200) DEFAULT (''),
	[note] [nvarchar](200) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[state] [int] DEFAULT (0),
	[delFlag] [bit] DEFAULT ((0)),	
	[cTime] [datetime] DEFAULT (getdate()),
	[mTime] [datetime] DEFAULT (getdate()),
	[cPerson] [bigint] DEFAULT (0),
	[mPerson] [bigint] DEFAULT (0)
) ON [PRIMARY]

--添加基本节点
insert into DL_CATAGORY (nodeName) values ('根目录');

GO
SET ANSI_PADDING OFF
GO



declare @name varchar(20)
while(exists(select * from sysobjects where name like 'TK_WH_%'))
begin
select @name=name from sysobjects where name like 'TK_WH_%'
exec ('drop table '+@name)
end