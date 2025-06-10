# --- Frontend - Builder Stage ---
# Use a slim Node.js 20 image for building your React application.
FROM node:20-slim AS frontend-builder

# Set the working directory inside the container.
# This is the root where your 'resepsku-frontend' directory resides.
WORKDIR /app

# Copy package.json and package-lock.json first for better caching.
# We copy them specifically into the 'resepsku-frontend' directory.
COPY resepsku-frontend/package*.json ./resepsku-frontend/

# Navigate into the React project directory.
WORKDIR /app/resepsku-frontend

# Install frontend dependencies.
RUN npm install

# Copy the rest of your React application code.
# This copies everything from your local 'resepsku-frontend' to '/app/resepsku-frontend' in the container.
COPY . .

# Build the React application for production.
# This typically creates a 'build' folder with optimized static assets.
RUN npm run build

# --- Frontend - Production Stage ---
# Use a lightweight Nginx based on Alpine to serve the static files.
FROM nginx:alpine

# Remove the default Nginx configuration file to use our custom one.
RUN rm /etc/nginx/conf.d/default.conf

# Optional: Copy your custom Nginx configuration if you have one.
# Make sure your 'nginx.conf' is located in the root of your 'resepsku-frontend' project
# (e.g., './resepsku-frontend/nginx.conf').
COPY resepsku-frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React static files to Nginx's default webroot.
# The 'build' folder is created by 'npm run build'.
COPY --from=frontend-builder /app/resepsku-frontend/build /usr/share/nginx/html

# Expose port 80, the standard HTTP port for Nginx.
EXPOSE 80

# Command to start Nginx when the container launches.
CMD ["nginx", "-g", "daemon off;"]