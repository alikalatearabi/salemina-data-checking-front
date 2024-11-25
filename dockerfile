# Use the official Node.js image as a base
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Serve the application using a lightweight web server
FROM nginx:alpine

# Copy the build output to Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 5173

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
