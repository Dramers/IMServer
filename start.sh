#-------------------------
#-脚本类型: IMServer 快速启动  -
#-编写名称: 杨亚霖       -
#-编写日期: 2016/11/26  -
#-版   本:  V1.0
#-------------------------
#!/bin/bash

#mongooss 服务
DB_PATH=/Users/Yalin/WorkSpace/MongoDB/IM/data/db
mongod --dbpath ${DB_PATH}

cd ./msgServer
node app.js

cd ..
cd ./loginServer
node app.js

cd ..
cd ./frontServer
DEBUG=fromtServer* npm start