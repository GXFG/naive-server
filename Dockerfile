FROM node:18.16.0

# pnpm会继承npm的配置
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pnpm pm2

ADD package.json /tmp/package.json
ADD pnpm-lock.yaml /tmp/pnpm-lock.yaml
RUN cd /tmp && pnpm install && cd -
RUN mkdir -p /home/naive-sever && cp -a /tmp/node_modules /home/naive-sever/

# 如果WORKDIR不存在，它将被自动创建，无需执行 RUN mkdir -p /home/naive-sever
WORKDIR /home/naive-sever
COPY . /home/naive-sever
RUN pnpm run build
RUN mkdir -p /home/pm2log

EXPOSE 5555

CMD [ "pnpm", "run", "pm2:start-prod" ]
