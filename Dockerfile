FROM node:12.16
WORKDIR /app
COPY package.json /app
RUN npm install -g sails && npm install
COPY . /app
CMD node app.js
EXPOSE 1337