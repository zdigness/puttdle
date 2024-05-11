FROM node:16-alpine

# Set the working directory in the container to /app
WORKDIR /usr/src/client

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Build the client application
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Make port 5173 available to the world outside this container
EXPOSE 5173