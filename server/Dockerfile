FROM node

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8000

CMD ["sh", "-c", "node init.js && npm start"]