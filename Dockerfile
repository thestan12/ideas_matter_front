FROM node:12.2.0 as build

# install chrome for protractor tests

RUN apt-get update

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @quasar/cli

# add app
COPY . /app

RUN quasar build

RUN node server.js

############
### prod ###
############


# expose port 80
EXPOSE 80

