USE [MPro_yh]
GO
/****** 对象:  UserDefinedFunction [dbo].[SYS_TRANS_FPN]    脚本日期: 06/07/2013 13:43:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[SYS_TRANS_FPN] (@id int)
	returns varchar(5000)
	begin
	declare @rVal varchar(5000)
		select @rVal=nodeName from dbo.TZ_FIRE_PLACE where id=@id;
		return @rVal;
	end