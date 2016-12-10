#FileServer

文件服务器直接使用express的静态文件服务功能

##上传

上传地址为

http://fileServerIp:fileServerPort/upload

上传的文件会用MD5生成一个文件名保存下来.

发送报文:

文件流

响应报文:

	{
		"code" : 0,
		"result" : ""
	}

如果code为0,上传成功,result内为文件下载地址. 如果不为0,则上传失败,result是错误信息.