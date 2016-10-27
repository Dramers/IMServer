#msgServer

##MsgService

###发送个人消息

标签：message
输入：



  	{
    		"userId" : 1
  	}

##GroupService

###创建群组

输入

​	{

​		"groupName" ：“”，

​		"userId" ：“”

​	}

###获取群组列表

###更新群信息

###删除群

### GroupModel

属性

* groupName str
* groupId str
* groupHeadImage str
* creatorId int
* memberIds int array
* updateDate date
* createDate date