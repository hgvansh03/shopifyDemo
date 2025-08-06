# Step 1: Use Node 20 base image
FROM node:20.11.1-alpine AS base

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files and install
COPY package*.json ./
RUN npm install --omit=dev

# Step 4: Copy the rest of your code
COPY . .

# Step 5: Build the app
RUN npm run build

# Step 6: Start command
CMD ["npm", "run", "docker-start"]
