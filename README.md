# Gerenciamento de Investimentos
API construída em NestJs para gerenciar investimentos, aplicando conceitos de clean arch, testes, cache, SOLID.

## 🛠️ Construído com

* [NestJs](https://nestjs.com/) - Um framework para a construção de aplicativos Node.js eficientes e escaláveis.
* [Jest](https://jestjs.io/) - Um framework de testes em JavaScript, projetado para garantir a correção de qualquer código JavaScript.
* [TypeORM](https://typeorm.io/) - Um ORM que pode ser executado em Node.js, usado para interagir com bancos de dados.
* [Migrations](https://typeorm.io/#/migrations) - Usado para controlar mudanças no banco de dados de forma organizada e segura.
* [DDD](https://martinfowler.com/bliki/DomainDrivenDesign.html) - Domain-Driven Design, uma abordagem para o design de software complexos, baseando-se na modelagem de domínios.
* [SOLID](https://en.wikipedia.org/wiki/SOLID) - Um acrônimo que representa cinco princípios de design que facilitam a escalabilidade e manutenção do software.
* [Cache](https://docs.nestjs.com/techniques/caching) - Usado para melhorar a performance armazenando respostas de forma temporária.
* [Guards](https://docs.nestjs.com/guards) - Usados para proteger rotas e implementar controle de acesso no aplicativo.
* [Husky](https://img.shields.io/badge/-Husky-%2334292F?logo=husky&style=flat-square): Utilizado para padronizar o projeto executando formatação e linting automaticamente.
* Swagger: Utilizado para documentar APIs automaticamente.

### 📋 Pré-requisitos

Você precisará de:

- Node na versão 18 ou superior
- Docker
- VsCode ou editor de sua preferência
- NPM ou YARN

### 🔧 Instalação

- Adicione as variáveis de ambiente, seguindo o exemplo do .env.example na raiz do projeto

- Coloque os seguintes valores no seu .env de dabse para esse teste:

```
    # Database
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=postgres
    POSTGRES_DB_TEST=postgres
```

- Cria a imagem como docker 

```
docker build docker build -t investment_api . 
```

- Crie o container com o banco de dados:

```
docker-compose up
```

- Instale as depêndencias do projeto:

```
yarn
```

- Rode as migrations:

```
yarn migration:run
```

- Inicie seu app:

```
yarn start:dev
```


## ⚙️ Executando os testes

```
yarn test
```

