#!/bin/bash

# 部署系统会将项目在部署系统中的名字作为第一个参数传递给 build.sh
# 因为 httpprocess 所在的 git 源中包含多个模块,
# 所以我们需要通过这个参数区分不同模块的编译动作

name=$1

# 站点目录，从servicegroup取
site_dir=$(echo $name |sed -n 's/^.*_servicegroup\.\([^._]*\)_.*/\1/p')

rm -rf release
mkdir -p release && \
cp -r  deploy ${site_dir}/* release/
