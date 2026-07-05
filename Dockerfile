FROM node:20-alpine AS builder
WORKDIR /build

COPY modules/proto/ ./proto/
COPY modules/shared/ ./shared/

COPY modules/gateway/package*.json ./gateway/
RUN cd gateway && npm install --no-audit --no-fund

COPY modules/gateway/ ./gateway/
RUN cd gateway && npm run build

FROM node:20-alpine
WORKDIR /app

COPY modules/gateway/package*.json ./gateway/
RUN cd gateway && npm install --omit=dev --no-audit --no-fund

COPY --from=builder /build/gateway/dist ./gateway/dist
# __dirname = /app/gateway/dist/gateway/src → ../../proto/ = /app/gateway/dist/proto/
COPY --from=builder /build/proto ./gateway/dist/proto

WORKDIR /app/gateway
EXPOSE 4000
CMD ["node", "dist/gateway/src/main.js"]
