#msgServer

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

###创建群组

标签:createGroup
请求

    {
      "groupName" ："群名",
      "userId" ："创建人Id",
      "memberIds" : "群成员Id数组",
      "groupHeadImage" : "群头像地址", // 暂时不支持，预留
    }

响应

	{
		"code" : 0,
		"result" : {
			"groupId" : "群组Id"
		}
	}

###获取群组列表

标签:queryGroupList
请求

	{
		"userId" : "用户Id"
	}

响应

	{
		"code" : 0,
		"result" : {
			[
				{
					"groupId" : "",
					"groupName" : "",
					"groupHeadImage" : "",
					"createor" : ""
					"memberIds" : ["" , "", ...],
					"updateDate" : 时间戳,
					"createDate" : 时间戳
				},
				...
			]
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
		"createor" : ""
		"memberIds" : ["" , "", ...],
	}

响应

	{
		"code" : 0
	}

###删除群

标签:deleteGroup
请求

	{
		"userId" : "",
		"groupId" : "",
	}

响应

	{
		"code" : 0
	}

### GroupModel

属性

| 字段             | 类型     | 描述            | 能否为空 |
| :------------- | :----- | ------------- | ---- |
| groupId        | string | 群组Id          | no   |
| groupName      | string | 群名            | no   |
| groupHeadImage | string | 群头像           | yes  |
| createor       | int    | 群主            | no   |
| memberIds      | [int]  | 群成员Id数组（没有群主） | no   |
| updateDate     | date   | 更新时间          | no   |
| createDate     | date   | 创建时间          | no   |
