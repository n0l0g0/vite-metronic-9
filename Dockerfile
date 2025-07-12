# Use Node.js LTS as the base image for building
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# แก้ไข permission ให้ /var/cache/nginx สำหรับ nginx non-root (ทุก temp dir)
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    && chown -R 101:0 /var/cache/nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

