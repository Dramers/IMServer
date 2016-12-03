# IMServer

##未完成功能

1. 单机快速启动脚本
2. 日志框架添加 日志收集http://blog.csdn.net/iefreer/article/details/34442183
3. 文件服务器 上传
4. 文件消息
5. 推送服务器
6. 多服务器调度 (离线消息储存机制估计有问题,需要改)
7. 性能测试
8. 报文修改 protobuf 或 msgpack
9. 负载服务器配置前置server（Niginx）

##待研究问题

1. login服务器获取用户信息,并发情况下,没有response.

##已完成功能

1. 前置server (分配loginserver和msgServer)
2. loginServer (创建注册用户 获取用户 好友)
3. msgServer (群组功能 单人消息功能)
4. 消息回执