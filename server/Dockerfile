FROM node:16.6.0-alpine

WORKDIR /server
ENV PATH="./node_modules/.bin:$PATH"
ENV PORT=8080
COPY package.json ./
RUN npm install
COPY ./ ./

EXPOSE 8080
CMD ["nodemon", "server"]