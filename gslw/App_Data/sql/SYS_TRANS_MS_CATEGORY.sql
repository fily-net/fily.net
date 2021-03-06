USE [MPro_yh1]
GO
/****** 对象:  UserDefinedFunction [dbo].[SYS_TRANS_WH]    脚本日期: 06/08/2015 15:02:02 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[SYS_TRANS_MS_CATEGORY] (@id varchar(15))
	returns varchar(5000)
	begin
		declare @seed varchar(5000);
		declare @flag int;
		declare @idx int;
		declare @path varchar(250);
		declare @tempPath varchar(250);
		declare @tempId varchar(10);
		declare @tempName varchar(50);
		set @flag=isnumeric(@id);
		if(@flag=0)
			return '';
		select @path = parentPath from dbo.SYS_WH_MS where id=@id;
		set @tempPath = substring(@path, 4, len(@path))+'0';
		set @seed = '';
		while CHARINDEX(',', @tempPath)>0
			begin 
				set @idx = CHARINDEX(',', @tempPath);
				set @tempId = substring(@tempPath, 1, @idx-1);
				set @tempPath = substring(@tempPath, @idx+1, len(@path));
				select @tempName=nodeName from dbo.SYS_WH_MS where id=cast(@tempId as int);
				set @seed=@seed+'【'+@tempName+'】';
			end
		return @seed;
	end



select dbo.SYS_TRANS_MS_CATEGORY(255);
