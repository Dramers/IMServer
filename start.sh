#-------------------------
#-脚本类型: IMServer 快速启动  -
#-编写名称: 杨亚霖       -
#-编写日期: 2016/11/26  -
#-版   本:  V1.0
#-------------------------
#!/bin/bash
export serverpath=`pwd`
echo $serverpath

#mongoDB
nohup mongod --dbpath /Users/Yalin/WorkSpace/MongoDB/IM/data/db  &
 
# cd msgServer 
# ./startserver.sh 
# cd .. &

# cd loginServer
# ./startserver.sh &
# cd ..

# cd frontServer 
# ./startserver.sh &
# cd .. 