USE [MPro_yh]
GO
/****** 对象:  Table [dbo].[TZ_ZICHAN]    脚本日期: 10/19/2012 16:54:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO  --系统表结构定义
CREATE TABLE [dbo].[TZ_ZICHAN](
	[id] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[scanCode] [varchar](30) DEFAULT (''),
	[zcCode] [varchar](30) DEFAULT (''),
	[zcOrigalCode] [varchar](30) DEFAULT (''),
	[zcName] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[zcNorm] [nvarchar](40) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[zcSort] [int] DEFAULT (0),
	[zcType] [int] DEFAULT (0),
	[zcUnits] [int] DEFAULT (0),
	[zcNum] [int] DEFAULT (0),
	[zcMgDept] [int] DEFAULT (0),
	[zcUseDept] [int] DEFAULT (0),
	[zcUser] [int] DEFAULT (0),
	[zcKeeper] [int] DEFAULT (0),
	[zcStorage] [int] DEFAULT (0),
	[zcAssessedInfo] [nvarchar](80) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[zcBuyTime] [datetime] DEFAULT (NULL),
	[zcPATime] [datetime] DEFAULT (getdate()),
	[zcFATime] [datetime] DEFAULT (getdate()),
	[zcCurrency] [int] DEFAULT (0),
	[zcOrigalCost] [numeric](18,2) DEFAULT (0),
	[zcCost] [numeric](18,2) DEFAULT (0),
	[zcProvider] [nvarchar](50) COLLATE Chinese_PRC_CI_AS DEFAULT (''),
	[zcMaintainPhone] [varchar](30) DEFAULT (''),
	[zcDepreciation] [numeric](18,2) DEFAULT (0),
	[zcMonthDepreciation] [numeric](18,2) DEFAULT (0),
	[zcRemainValue] [numeric](18,2) DEFAULT (0),
	[zcEnginCode] [varchar](30) DEFAULT (''),
	[zcFrameCode] [varchar](30) DEFAULT (''),	
	[zcOil] [numeric](18,2) DEFAULT (0),
	[zcCarCode] [varchar](30) DEFAULT (''),
	[ifOverYear] [int] DEFAULT (0),
	[invalidState] [int] DEFAULT (0),
	[leasState] [int] DEFAULT (0),
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