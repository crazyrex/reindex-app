FROM node:7

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn install \
  && mv node_modules /node_modules

ENV PATH=/node_modules/.bin:${PATH}

CMD ["yarn","dev"]
