FROM node:latest

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

CMD ["npm", "start"]