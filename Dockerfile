# build environment
FROM node:20-alpine3.17 as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project directory to the working directory
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:1.21

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the production build files from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration (if needed)
COPY nginx.conf /etc/nginx/conf.d/

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
