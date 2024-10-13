# Use the official Nginx image
FROM nginx:alpine

# Install Node.js in the final Nginx image
RUN apk add --no-cache nodejs npm

# Copy the custom Nginx configuration file
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the frontend build to the Nginx html folder
COPY frontend/build /usr/share/nginx/html

# Copy the backend dist folder to be available as static files (optional)
COPY backend/dist /app/backend

COPY backend/node_modules /app/backend/node_modules

COPY backend/package.json backend/yarn.lock /app/backend/

# Install Supervisord to run multiple services (Nginx and Node.js backend)
RUN apk add --no-cache supervisor

# Create a supervisor configuration file
RUN mkdir -p /etc/supervisor.d/
COPY supervisord.conf /etc/supervisor.d/supervisord.conf

# Expose port 80
EXPOSE 80
# Expose port 3001 for the backend
EXPOSE 3001

# Start Supervisor
CMD ["supervisord", "-c", "/etc/supervisor.d/supervisord.conf"]