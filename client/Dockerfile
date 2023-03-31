FROM node:16.17.1-alpine3.16 as build

# Create app directory
WORKDIR /src/client

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /src/client
#RUN npm install
# If you are building your code for production
RUN npm ci

# Bundle app source
COPY . /src/client

ARG REACT_APP_SERVER_LOCAL_PORT

ENV REACT_APP_SERVER_LOCAL_PORT $REACT_APP_SERVER_LOCAL_PORT

# Build the client
RUN npm run build

FROM nginx:1.23.1-alpine

# Expose port
EXPOSE $CLIENT_DOCKER_PORT

COPY --from=build /src/client/build /usr/share/nginx/html