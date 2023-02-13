#!/bin/bash
zerossl=./repo/ZeroSSL
cpanel =./repo/Cpanel

if [-e $zerossl];then
    git -C $zerossl pull;
else
    git clone https://github.com/TiagoSantos01/ZeroSSL $zerossl;
fi

if [-e $cpanel];then
    git -C $cpanel pull;
else
    git clone https://github.com/TiagoSantos01/Cpanel $cpanel;
fi

for file in ./env/*; do
    echo $file;
    node actions.js $file
done