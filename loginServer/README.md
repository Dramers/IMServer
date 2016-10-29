#登录服务器

负责用户信息的管理。

##数据模型

###UserModel

属性

| 字段       | 类型       | 描述       | 能否为空 |
| :------- | :------- | -------- | ---- |
| userId   | int      | 用户Id     | no   |
| name     | string   | 姓名       | no   |
| username | string   | 用户登录账号   | no   |
| password | string   | 用户密码     | no   |
| buddyIds | [Int]    | 用户好友Id数组 | no   |
| groupIds | [string] | 用户群组Id数组 | no   |

