# --- Frontend - Production Stage ---
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

# Now this line will correctly copy your custom nginx.conf
# from your project root into the Nginx configuration directory in the container.
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=frontend-builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]