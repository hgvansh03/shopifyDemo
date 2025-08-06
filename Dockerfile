# ---- Build stage ----
FROM node:18 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Remix app
RUN npm run build

# ---- Production stage ----
FROM node:18

WORKDIR /app

COPY --from=builder /app ./

# Optional: prune dev dependencies
RUN npm prune --production

CMD ["npm", "start"]
