# Multi-stage build for React app
# Stage 1: Build the React application
FROM node:current-alpine AS builder

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Build the application
ENV CI=false
RUN npm run build

# Stage 2: Serve the built app using nginx
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=builder /app/build /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html

# Copy nginx configuration to the sites-enabled directory (replacing default)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]