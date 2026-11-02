FROM node:20-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src
COPY queue ./queue
COPY knexfile.js ./knexfile.js
RUN mkdir -p storage/public && chown -R node:node /app

USER node
EXPOSE 3000 3001
CMD ["npm", "start"]
