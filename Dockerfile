FROM node:16.17.0

WORKDIR /app

COPY ./ ./

RUN npm install

CMD ["node", "dist/main.js"]