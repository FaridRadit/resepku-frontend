# --- Frontend - Builder Stage ---
# Use a slim Node.js 20 image for building your React application.
FROM node:20-slim AS frontend-builder

# Set the working directory inside the container to /app.
# This '/app' will mirror your project root where your React code resides.
WORKDIR /app

# Copy package.json and package-lock.json first for better caching.
COPY package*.json ./

# Install frontend dependencies.
RUN npm install

# Copy the rest of your React application code.
# This copies all files and folders (src, public, etc.) from your local project root
# into the '/app' directory in the container.
COPY . .

# Build the React application for production.
# This typically creates a 'build' folder in '/app/build'.
RUN npm run build

# --- Frontend - Production Stage ---
# Use a lightweight Nginx based on Alpine to serve the static files.
FROM nginx:alpine

# Remove the default Nginx configuration file to use our custom one (if any).
RUN rm /etc/nginx/conf.d/default.conf

# Optional: Copy your custom Nginx configuration if you have one.
# If you have an 'nginx.conf' file directly in your project root, uncomment this.
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React static files to Nginx's default webroot.
# The 'build' folder is created by 'npm run build' inside '/app'.
COPY --from=frontend-builder /app/build /usr/share/nginx/html

# Expose port 80, the standard HTTP port for Nginx.
EXPOSE 80

# Command to start Nginx when the container launches.
CMD ["nginx", "-g", "daemon off;"]