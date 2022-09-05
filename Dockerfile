# base image
FROM node:alpine

# set working directory
WORKDIR /app

# `/app/node_modules/.bin`을 $PATH에 추가
ENV PATH /app/node_modules/.bin:$PATH

# app dependencies, install, caching
COPY package.json /app/package.json
RUN yarn

# 앱 실행
CMD ["yarn", "run", "dev"]