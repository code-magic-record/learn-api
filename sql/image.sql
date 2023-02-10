create table image(
	id int auto_increment primary key comment 'id',
	img_size int comment '文件size',
	img_name varchar(30) comment '文件名字',
	img_type varchar(20) comment '文件类型',
	img_key varchar(20) comment '文件key',
	create_time date comment '创建时间'
) comment 'img 表'

# 字段上的修改
alter table image modify img_name varchar(30) not null;
alter table image add catetory_id int not null;
alter table image modify create_time DATETIME;
