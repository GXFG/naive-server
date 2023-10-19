# 构建阶段
FROM node:18-alpine AS builder
# 如果WORKDIR不存在，它将被自动创建，无需执行 mkdir -p /home/naive-sever
WORKDIR /home/naive-sever
# pnpm会继承npm的配置
RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pnpm
# cache 当依赖项没有改变时，Docker 可以重用缓存
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install
# Dockerfile 所在目录 to WORKDIR，如果没有设置工作目录，那么就代表镜像的根目录（/）。
COPY . .
RUN pnpm run build

# 运行阶段
FROM node:18-alpine
WORKDIR /home/naive-sever
RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g pm2 && \
    mkdir -p /home/pm2log
# 从 builder 阶段复制文件到工作目录
COPY --from=builder /home/naive-sever/package.json .
COPY --from=builder /home/naive-sever/pnpm-lock.yaml .
COPY --from=builder /home/naive-sever/node_modules/ ./node_modules/
COPY --from=builder /home/naive-sever/dist/ ./dist/
COPY --from=builder /home/naive-sever/.env.* .

EXPOSE 5555

ENTRYPOINT [ "npm", "run", "pm2:start-prod" ]
