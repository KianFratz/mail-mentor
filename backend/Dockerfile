FROM node:24-alpine AS dependencies

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

FROM dependencies AS source

COPY . .
RUN npx prisma generate

FROM source AS migrations

CMD ["npx", "prisma", "migrate", "deploy"]

FROM source AS database

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed"]

FROM source AS build

RUN npm run build
RUN npm prune --omit=dev

FROM node:24-alpine AS runner

WORKDIR /usr/src/app

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV NODE_ENV=production \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
