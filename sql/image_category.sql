create database duowan;
use duowan;

create table image_category(
	id int auto_increment primary key comment '分类id',
	category_name varchar(30) comment '分类名字',
	category_logo varchar(30) comment '分类logo',
	create_time date comment '创建时间',
	update_time date comment '更新时间'
) comment '分类表' 

# 更新时间表
alter table image_category modify create_time DATETIME;
alter table image_category modify update_time DATETIME;
alter table image_category modify category_name varchar(30) not null;
