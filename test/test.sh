#!/bin/sh

cp ./main.js ./test
cd ./test
sed -i '' 's/^function/export function/g' main.js
sed -i '' 's/^sendEmail/\/\/sendEmail/g' main.js
sed -i '' 's/^import sendEmail/\/\/import sendEmail/g' main.js
sed -i '' 's/new Date(today).getTime()/new Date("2016-12-12").getTime()/g' main.js
cd ..
mocha --compilers js:babel-core/register