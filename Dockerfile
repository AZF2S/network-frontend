FROM node:latest

WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend application (excluding the proxy folder)
COPY public ./public
COPY src ./src
COPY *.js *.json ./

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Use environment variable with a default value
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]