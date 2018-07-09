FROM node:7
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
#RUN npm cache clean
RUN npm install
COPY . /usr/src/app
EXPOSE 3000
EXPOSE 3001
RUN npm run build
CMD ["npm","run","dev"]