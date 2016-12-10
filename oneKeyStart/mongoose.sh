#mongooss 服务
BUILD_DATE=$(date +%Y%m%d%k%M%S)
DB_PATH=/Users/Yalin/WorkSpace/MongoDB/IM/data/db
mongod --dbpath ${DB_PATH} >>${BUILD_DATE}.log