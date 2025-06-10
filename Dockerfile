# Use a lightweight Nginx image
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all your static files (HTML, CSS, JS, etc.) into the Nginx web root
# The '.' indicates the current directory where your Dockerfile is located.
# This assumes your HTML files and 'style' directory are at the root level of your project.
COPY . /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 8080

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]