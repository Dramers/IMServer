#前置服务
BUILD_DATE=$(date +%Y%m%d%k%M%S)
# DEBUG=frontServer* npm start
mkdir logs
nohup npm start >> ./logs/${BUILD_DATE}.log 
# export frontServerPath=$serverpath/frontServer
# echo $frontServerPath
# cd $frontServerPath
# ##start frontServer
# nohup npm start &
# cd ..