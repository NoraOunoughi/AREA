FROM node:16.6.0-alpine 

WORKDIR /client
ENV PATH="./node_modules/.bin:$PATH"
ENV PORT=8081
COPY package.json ./
RUN npm install
COPY ./ ./

EXPOSE 8081
CMD ["npm", "start"]