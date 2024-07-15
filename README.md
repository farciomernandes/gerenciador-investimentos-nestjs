### Tecnologias Utilizadas
# Este projeto utiliza as seguintes tecnologias e práticas:

- Husky: Utilizado para padronizar o projeto executando formatação e linting automaticamente.
- TypeORM com Migrations: Para gerenciar o banco de dados com facilidade através de migrations.
- Swagger: Utilizado para documentar APIs automaticamente.
- Clean Architecture e DDD: Segue os princípios de arquitetura limpa e Domain-Driven Design para organização e estruturação do código.
- Docker e Docker-Compose: Utilizados para facilitar o ambiente de desenvolvimento, garantindo consistência entre os ambientes de desenvolvimento e produção.
- Jest: Framework de testes utilizado para garantir a qualidade do código através de testes unitários e de integração.







# Gerenciamento de Investimentos
API construída em NestJs para gerenciar investimentos, aplicando conceitos de clean arch, testes, cache, SOLID.


### 📋 Pré-requisitos

Você precisará de:

- Node na versão 16 ou superior
- Docker
- VsCode ou editor de sua preferência
- NPM ou YARN

### 🔧 Instalação

- Adicione as variáveis de ambiente, seguindo o exemplo do .env.example na raiz do projeto

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

## 🛠️ Construído com

* [NestJs](https://nestjs.com/) - Um framework para a construção de aplicativos Node.js eficientes e escaláveis.
* [Jest](https://jestjs.io/) - Um framework de testes em JavaScript, projetado para garantir a correção de qualquer código JavaScript.
* [TypeORM](https://typeorm.io/) - Um ORM que pode ser executado em Node.js, usado para interagir com bancos de dados.
* [Migrations](https://typeorm.io/#/migrations) - Usado para controlar mudanças no banco de dados de forma organizada e segura.
* [DDD](https://martinfowler.com/bliki/DomainDrivenDesign.html) - Domain-Driven Design, uma abordagem para o design de software complexos, baseando-se na modelagem de domínios.
* [SOLID](https://en.wikipedia.org/wiki/SOLID) - Um acrônimo que representa cinco princípios de design que facilitam a escalabilidade e manutenção do software.
* [Cache](https://docs.nestjs.com/techniques/caching) - Usado para melhorar a performance armazenando respostas de forma temporária.
* [Guards](https://docs.nestjs.com/guards) - Usados para proteger rotas e implementar controle de acesso no aplicativo.
