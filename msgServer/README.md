#msgServer

##连接

登录服务器在提供消息服务器之前,检测此消息服务器是否可用,用如下

标签 : canConnect
输入 : 无
响应 : true of false

**成功连接消息服务器之后,需要发送一次用户id,以便绑定用户,否则无法使用消息服务.** 
如下:

标签: getUserId
输入

	{
		"userId" : 0,
	}

无响应

##MsgService

###发送消息

标签：message
输入：

    {
      "fromUserId" : 1,
      "toUserId" : 2,
      "contentStr" : "",
      "msgId" : "",
      "sendDate" : 时间戳,
      "msgContentType" : "",
      "sessionId" : "",
    }

* 如果sessionId为空,则为个人消息。若不为空，则传群组Id。
* msgContentType为消息内容类型, 现阶段只有文本消息,传1

响应 : 无

##GroupService

**注: taskId是用来标记本次响应是由哪次请求发出的，响应中的taskId就是请求中的taskId，由客户端自己生成.**

**注: 群组的memberIds中提交的时候需要包含自己的userId**

###创建群组

标签:createGroup
请求

    {
      "groupName" ："群名",
      "userId" ："创建人Id",
      "memberIds" : "群成员Id数组",
      "groupHeadImage" : "群头像地址", // 暂时不支持，预留
      "taskId" : "",
    }

响应

	{
		"code" : 0,
		"taskId" : "",
		"result" : {
			"groupId" : "群组Id"
		}
	}

###获取群组列表

标签:queryGroupList
请求

	{
		"userId" : "用户Id",
		"taskId" : "",
	}

响应

	{
		"code" : 0,
		"taskId" : "",
		"result" : {
			[
				{
					"groupId" : "",
					"groupName" : "",
					"groupHeadImage" : "",
					"creator" : ""
					"memberIds" : ["" , "", ...],
					"updateDate" : 时间戳,
					"createDate" : 时间戳
				},
				...
			]
		}
	}

###添加群成员

标签:addGroupMembers
请求
​	
	{
		"userId" : "",
		"groupId" : "",
		"taskId" : "",
		"memberIds" : [ 1, 2, ...]
	}

响应

	{
		"code" : 0,
		"taskId" : "",
		"result" : {
			
		}
	}

###踢出群成员

标签:kickGroupMembers
请求
​	
	{
		"userId" : "",
		"groupId" : "",
		"memberIds" : ["", "", ...],
		"taskId" : "",
	}

响应

	{
		"code" : 0,
		"taskId" : "",
		"result" : {
			
		}
	}

###获取群信息

标签:queryGroupInfo
请求

	{
		"userId" : "",
		"groupId" : "",
		"taskId" : "",
	}

响应

	{
		"code" : 0,
		"taskId" : "",
		"result" : {
					"groupId" : "",
					"groupName" : "",
					"groupHeadImage" : "",
					"creator" : ""
					"memberIds" : ["" , "", ...],
					"updateDate" : 时间戳,
					"createDate" : 时间戳
				}
		}
	}

###更新群信息

标签:updateGroupInfo
请求

	{
		"userId" : "",
		"groupId" : "",
		"groupName" : "",
		"groupHeadImage" : "",
		"creator" : "", // 群主
		"taskId" : "",
	}

响应

	{
		"code" : 0
		"taskId" : "",
	}

###删除群

标签:deleteGroup
请求

	{
		"userId" : "",
		"groupId" : "",
		"taskId" : "",
	}

响应

	{
		"code" : 0,
		"taskId" : "",
	}

### GroupModel

属性

| 字段             | 类型     | 描述            | 能否为空 |
| :------------- | :----- | ------------- | ---- |
| groupId        | string | 群组Id          | no   |
| groupName      | string | 群名            | no   |
| groupHeadImage | string | 群头像           | yes  |
| creator        | int    | 群主            | no   |
| memberIds      | [int]  | 群成员Id数组（没有群主） | no   |
| updateDate     | date   | 更新时间          | no   |
| createDate     | date   | 创建时间          | no   |

### MsgModel

| 字段                | 类型     | 描述                    | 能否为空 |
| :---------------- | :----- | --------------------- | ---- |
| fromUserId        | int    | 发送用户Id                | no   |
| toUserId          | int    | 到达用户Id                | no   |
| contentStr        | string | 消息内容                  | no   |
| serverReceiveDate | date   | 服务器接受时间               | no   |
| msgId             | string | 消息Id                  | no   |
| msgContentType    | int    | 消息类型                  | no   |
| sessionId         | string | 为空则为单人会话，不为空就是群组Id    | yes  |
| state             | int    | 1为服务器已收 2为对方已收 3为对方已读 | no   |

### GroupUserModel

属性

| 字段       | 类型       | 描述       | 能否为空 |
| :------- | :------- | -------- | ---- |
| userId   | int      | 人员Id     | no   |
| groupIds | [string] | 所在群组Id数组 | yes  |

