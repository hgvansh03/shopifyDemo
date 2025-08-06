# Build Stage
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

COPY . .

RUN npm run build

# Production Stage
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app .

CMD ["npm", "run", "docker-start"]
