FROM node:14

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install ts-node

RUN npm install 


COPY . .

COPY .env.production .env


RUN npm build


ENV NODE_ENV production
EXPOSE 8080


CMD ["node", "dist/index.js"]
USER node

#RUN npm run typeorm migration:run   

