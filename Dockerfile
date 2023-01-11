FROM node:14-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:14-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/build .
CMD ["serve", "-l", "3000", "-s", "."]