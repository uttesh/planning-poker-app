# Stage 1: Build the frontend (React)
FROM node:16-alpine AS frontend-build
WORKDIR /app
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY frontend/ ./
RUN yarn build

# Stage 2: Build the backend (Node.js)
FROM node:16-alpine AS backend-build
WORKDIR /app
COPY backend/package.json backend/yarn.lock /app/
RUN yarn install --production
COPY backend/ /app/
RUN yarn build

# Stage 3: Create the final image with Nginx and backend (Node.js)
FROM nginx:alpine

# Install Node.js in the final Nginx image
RUN apk add --no-cache nodejs npm

# Copy Nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built frontend files to the Nginx html directory
COPY --from=frontend-build /app/build /usr/share/nginx/html

# Copy the backend build files
COPY --from=backend-build /app/dist /app/backend

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
