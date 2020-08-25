FROM node:12.18-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .

# 设置环境变量
ENV NODE_ENV=production
ENV MONGO_URI=mongodb://db:27017/mock
ENV HOST=0.0.0.0
ENV PORT=5000

EXPOSE 5000
CMD ["npm", "start"]