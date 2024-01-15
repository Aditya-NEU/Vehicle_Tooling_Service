# Use an official Node.js runtime as a base image
FROM node:21

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY ../nodejs-app/package*.json ./

# Install app dependencies
RUN npm install

# Copy the entire application code to the working directory
COPY ../nodejs-app .

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "src/index.js"]