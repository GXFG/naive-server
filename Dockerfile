FROM node:18-alpine AS builder
# 如果WORKDIR不存在，它将被自动创建，无需执行 mkdir -p /home/naive-sever
WORKDIR /home/naive-sever
# pnpm会继承npm的配置
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pnpm
# cache
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install
COPY . .
RUN pnpm run build

FROM node:18-alpine
WORKDIR /home/naive-sever
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pm2
RUN mkdir -p /home/pm2log
COPY --from=builder /home/naive-sever/package.json .
COPY --from=builder /home/naive-sever/pnpm-lock.yaml .
COPY --from=builder /home/naive-sever/node_modules/ ./node_modules/
COPY --from=builder /home/naive-sever/dist/ ./dist/
COPY --from=builder /home/naive-sever/.env.* .

EXPOSE 5555

ENTRYPOINT [ "npm", "run", "pm2:start-prod" ]
