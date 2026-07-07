FROM oven/bun:alpine AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY index.html vite.config.js ./
COPY public ./public
COPY src ./src

RUN bun run build 


FROM nginx:stable-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80