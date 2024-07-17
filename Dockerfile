FROM node:18-alpine as builder

ENV NODE_ENV=build

WORKDIR /usr/app

# Install app dependencies and build the project
COPY . .
RUN yarn install
RUN yarn build

FROM node:18-alpine as release

ENV NODE_ENV=production

WORKDIR /usr/app

COPY --from=builder /usr/app/package*.json ./
COPY --from=builder /usr/app/yarn.lock ./
COPY --from=builder /usr/app/tsconfig*.json ./
COPY --from=builder /usr/app/node_modules/ ./node_modules/
COPY --from=builder /usr/app/dist/ ./dist/

ENTRYPOINT [ "node", "dist/modules/main/main.js" ]