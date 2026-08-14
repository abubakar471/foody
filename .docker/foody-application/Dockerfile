# Step 1: Start from the official base Node image
FROM node:lts-alpine

# Step 2: Set working directory inside container
WORKDIR /home/node/code/foody-application

# Step 3: Copy package files first to leverage Docker layer caching
COPY code/foody-application/package*.json ./

# Step 4: Install dependencies inside the container image
RUN npm install

# Step 5: Expose Next.js default port
EXPOSE 3000

# Step 6: Set default start command
CMD ["npm", "run", "dev"]
