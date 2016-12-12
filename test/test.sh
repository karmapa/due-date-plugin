#!/bin/bash

cp ./main.js ./test && cp ./sendEmail.js ./test && cp ./index.js ./test/test.js
cd ./test
sed -i '' 's/main/index/' test.js
sed -i '' 's/function/export function/g' main.js