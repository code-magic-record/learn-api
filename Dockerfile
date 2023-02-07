FROM node:16.17.1
# 设置用户
LABEL maintainer="yaogengzhu"
# 设置工作目录
WORKDIR /app
# 拷贝文件
COPY . /app
# 安装依赖
RUN npm install
# 暴露端口
EXPOSE 3000
# 启动命令
CMD ["npm", "serve"]
