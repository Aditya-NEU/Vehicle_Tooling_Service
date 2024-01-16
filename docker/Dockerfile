FROM node:21
WORKDIR /usr/src/app
COPY ../nodejs-app/package*.json ./
RUN npm install
COPY ../nodejs-app .
EXPOSE 3000
CMD ["node", "src/index.js"]