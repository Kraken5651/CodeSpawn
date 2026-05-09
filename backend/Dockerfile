# Backend Dockerfile for CodeSpawn

FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy source files
COPY backend/src ./src

# Expose application port
EXPOSE 5000

# Default environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "src/app.js"]

