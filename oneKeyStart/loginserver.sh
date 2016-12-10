BUILD_DATE=$(date +%Y%m%d%k%M%S)
cd ..
cd ./loginServer
node app.js >>${BUILD_DATE}.log
