USE [MPro_yh1]
GO
/****** 对象:  UserDefinedFunction [dbo].[SYS_TRANS_CPN]    脚本日期: 05/31/2015 12:44:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[SYS_TRANS_PET] (@id int)
	returns varchar(5000)
	begin
	declare @rVal varchar(5000)
		select @rVal=companyName from dbo.PRO_EXEC_TEAM where id=@id;
		return @rVal;
	end