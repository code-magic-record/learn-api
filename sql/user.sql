-- 创建user表
create table user(
  id int auto_increment primary key,
  user_name varchar(10) comment '用户名',
  pass_word varchar(255) comment '用户密码'
) comment '用户表';


desc user; # 查询表结构