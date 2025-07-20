# Stage 1: Build the Angular application
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Stage 2: The final image, using Nginx to serve the built app
FROM nginx:1.27.4-alpine-slim

# Supprimer TOUS les fichiers de configuration par défaut
RUN rm -rf /etc/nginx/conf.d/*
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Angular app from the 'build' stage
COPY --from=build /app/dist/stock-management-front /usr/share/nginx/html

# Ajouter le fichier de config nginx
COPY nginx-temp.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
