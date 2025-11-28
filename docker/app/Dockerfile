# STAGE 1: Build the app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the production assets
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ARG VITE_USERNAME
ENV VITE_USERNAME=$VITE_USERNAME
ARG VITE_PASSWORD
ENV VITE_PASSWORD=$VITE_PASSWORD
ARG VITE_SYSTEM_LOGS_URL
ENV VITE_SYSTEM_LOGS_URL=$VITE_SYSTEM_LOGS_URL
ARG VITE_TEST_MODE
ENV VITE_TEST_MODE=$VITE_TEST_MODE
ARG VITE_ENVIRONMENT
ENV VITE_ENVIRONMENT=$VITE_ENVIRONMENT
RUN npm run build

# STAGE 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output (dist) to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
