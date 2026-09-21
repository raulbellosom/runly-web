# Dockerfile
FROM node:20-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm astro build

FROM node:20-slim AS runtime
WORKDIR /app
ENV HOST=0.0.0.0
ENV PORT=4321
# Astro's Node adapter does not bundle third-party dependencies into the
# server output, so node_modules must ship in the runtime image.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
