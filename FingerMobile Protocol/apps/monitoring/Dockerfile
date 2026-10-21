# Use Node.js LTS
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3004

# Define the command to run the application
CMD [ "npm", "start" ]