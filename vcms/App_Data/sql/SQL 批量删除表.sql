declare @name varchar(20)
while(exists(select * from sysobjects where name like 'U_%'))
begin
select @name=name from sysobjects where name like 'U_%'
exec ('drop table '+@name)
end