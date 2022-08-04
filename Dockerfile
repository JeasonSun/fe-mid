# 构建基础镜像
# FROM alpine:3.16 AS base
FROM node:16-alpine AS base

# 设置环境变量
ENV APP_PATH=/node/app

# 设置工作目录
WORKDIR $APP_PATH

# # 安装 nodejs 和 yarn 
# RUN apk add --no-cache --update nodejs=16.16.0-r0 yarn=1.22.19-r0

# 使用基础镜像 安装依赖阶段
FROM base AS install

# 拷贝package.json 到工作根目录下面
COPY package.json ./

# 安装依赖
RUN yarn install --registry https://registry.npmmirror.com/

# 打包阶段
FROM base AS builder

# 拷贝 依赖阶段 生成的node_modules 文件夹到工作目录下面
COPY --from=install $APP_PATH/node_modules ./node_modules

# 将当前目录下面的所有文件(除了.dockerignore排除的路径)，都拷贝进入镜像的工作目录下面
COPY . .

# 构建
RUN yarn build

# 最终阶段，也就是输出的镜像是这个阶段构建的，前面的阶段都是为这个阶段做铺垫
FROM base

# 拷贝 依赖阶段 生成的node_modules 文件夹到工作目录下面
COPY --from=install $APP_PATH/node_modules ./node_modules

# 拷贝 将前面打包生成的dist复制过来
COPY --from=builder $APP_PATH/dist ./dist
# 将当前目录下面的所有文件(除了.dockerignore排除的路径)，都拷贝进入镜像的工作目录下面

COPY . .

# 启动
CMD ["yarn", "start:prod"]

