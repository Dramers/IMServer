#消息服务
BUILD_DATE=$(date +%Y%m%d%k%M%S)
if [ -d logs ]
then
echo ''
else
mkdir logs
fi
nohup node app.js >> ./logs/${BUILD_DATE}.log
