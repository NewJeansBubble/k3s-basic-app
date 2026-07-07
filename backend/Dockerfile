FROM oven/bun:alpine

WORKDIR /app

COPY package.json bun.lock  ./

RUN bun install --production --frozen-lockfile

COPY src ./src
COPY drizzle ./drizzle
COPY drizzle.config.js ./

EXPOSE 3000

CMD ["bun", "src/app.js"]