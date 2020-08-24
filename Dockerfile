FROM node:12.18-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# 安装 npm 依赖
RUN npm config set registry https://registry.npm.taobao.org && npm install

RUN npm install --production --silent && mv node_modules ../
COPY . .

# 设置环境变量
ENV NODE_ENV=production
ENV MONGO_URI=mongodb://db:27017/test
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["npm", "start"]