# planning-poker-backend/Dockerfile

# Stage 1: Build the backend
FROM node:14-alpine AS build
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build

# Stage 2: Run the backend
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/server.js"]
