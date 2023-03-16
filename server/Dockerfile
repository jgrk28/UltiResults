FROM node:16

# Create server directory
WORKDIR /src/server

# Install server dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# start node app with "node app.js"
CMD ["npm", "run", "start"]