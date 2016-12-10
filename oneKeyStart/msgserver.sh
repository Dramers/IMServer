# node startjs  >>a.log
BUILD_DATE=$(date +%Y%m%d%k%M%S)

cd ..
cd ./msgServer
node app.js >>${BUILD_DATE}.log