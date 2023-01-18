# user 



## 新增超管概念
- 新增一个字段，is_super 1 为超级管理员， 0 不是

```sql
alter table user add is_super int default 0 not null;
```

