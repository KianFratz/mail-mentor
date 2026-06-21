FROM node:20-alpine

WORKDIR /app

# install deps (cache layer)
COPY package.json package-lock.json ./
RUN npm ci

# copy source
COPY . .

EXPOSE 5173

# Run vite dev server and bind to all interfaces so host can access it
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
