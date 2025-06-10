# Dockerfile

# --- Frontend - Builder Stage ---
FROM node:20-slim AS frontend-builder 
                                     # Ini mendefinisikan stage 'frontend-builder'

# Set the working directory inside the container to /app.
WORKDIR /app

# Copy package.json and package-lock.json first for better caching.
COPY package*.json ./

# Install frontend dependencies.
RUN npm install

# Copy the rest of your React application code.
COPY . .

# Build the React application for production.
RUN npm run build

# --- Frontend - Production Stage ---
FROM nginx:alpine

# Remove the default Nginx configuration file to use our custom one.
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React static files to Nginx's default webroot.
COPY --from=frontend-builder /app/build /usr/share/nginx/html 

# Expose port 80, the standard HTTP port for Nginx.
EXPOSE 80

# Command to start Nginx when the container launches.
CMD ["nginx", "-g", "daemon off;"]