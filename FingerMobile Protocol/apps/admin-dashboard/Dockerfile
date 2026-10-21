# Use nginx to serve the admin dashboard build
FROM nginx:alpine

# Copy the build output to nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]