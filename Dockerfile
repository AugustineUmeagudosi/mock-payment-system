# syntax=docker/dockerfile:1
FROM node:14.17.3

ENV NODE_ENV=development

WORKDIR /app
COPY package.json /app

# RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

RUN npm install
RUN npm install -g sequelize-cli
RUN npm install -- save-dev @babel/node

COPY . /app
CMD ["npm", "start"]