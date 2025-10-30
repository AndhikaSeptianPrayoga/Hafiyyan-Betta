FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY server/package.json ./package.json
COPY server/package-lock.json ./package-lock.json
RUN npm install --legacy-peer-deps

# Copy source
COPY server/tsconfig.json ./tsconfig.json
COPY server/src ./src
COPY server/sql ./sql

# Build
RUN npm run build

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]