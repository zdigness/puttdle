FROM node:16-alpine
LABEL authors="Amongstar"

# Set the working directory in the container to /app
WORKDIR /usr/src/server

# Copy package.json and package-lock.json into the directory
COPY package.json package-lock.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Make port 8000 available to the world outside this container
EXPOSE 3000