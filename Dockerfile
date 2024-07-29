FROM node:18

WORKDIR /usr/app

# Copia package.json e yarn.lock
COPY package*.json ./
COPY yarn.lock ./

RUN yarn

# Copia o código fonte
COPY . .

# Compila o TypeScript para JavaScript
RUN yarn build

# Comando para iniciar a aplicação
CMD ["node", "dist/modules/main/main.js"]