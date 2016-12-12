#!/bin/bash

cp ./main.js ./test
cd ./test
sed -i '' 's/^function/export function/g' main.js
sed -i '' 's/^sendEmail/\/\/sendEmail/g' main.js
sed -i '' 's/^import sendEmail/\/\/import sendEmail/g' main.js
cd ..
mocha --compilers js:babel-core/register