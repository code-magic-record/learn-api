create table image(
	id int auto_increment primary key comment 'id',
	img_size int comment '文件size',
	img_name varchar(30) comment '文件名字',
	img_type varchar(20) comment '文件类型',
	img_key varchar(20) comment '文件key',
	create_time date comment '创建时间'
) comment 'img 表'

