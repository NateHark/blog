#!/bin/bash

HUGO_VERSION="0.111.3"

curl -L -o hugo.tar.gz "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz"

tar -zxf hugo.tar.gz
sudo mv hugo /usr/local/bin
rm hugo.tar.gz

git submodule update --recursive --init