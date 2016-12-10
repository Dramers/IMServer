#前置服务
BUILD_DATE=$(date +%Y%m%d%k%M%S)
if [ -d logs ]
then
	echo ''
else 
	mkdir logs
fi
nohup npm start >> ./logs/${BUILD_DATE}.log
