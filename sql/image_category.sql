create database duowan;
use duowan;

create table image_category(
	id int auto_increment primary key comment '分类id',
	category_name varchar(30) comment '分类名字',
	category_logo varchar(30) comment '分类logo',
	create_time date comment '创建时间',
	update_time date comment '更新时间'
) comment '分类表'