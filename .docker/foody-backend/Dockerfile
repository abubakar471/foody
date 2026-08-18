FROM mongo:7.0

# Copy seed script into the official Mongo initialization directory
COPY .docker/foody-backend/seed-mongodb.js /docker-entrypoint-initdb.d/seed-mongodb.js
