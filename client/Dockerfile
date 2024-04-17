FROM node:16-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Build the client application
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Make port 8000 available to the world outside this container
EXPOSE 4200

# Define the command to run the client application using the "dev" script
CMD ["npm", "run", "dev"]