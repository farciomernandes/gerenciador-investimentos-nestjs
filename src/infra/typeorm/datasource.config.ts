import 'dotenv/config';
import path from 'path';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database:
    process.env.NODE_ENV === 'test'
      ? process.env.POSTGRES_DB_TEST
      : process.env.POSTGRES_DB,
  entities: [
    path.join(__dirname, `/../../modules/**/entities/*.entity{.ts,.js}`),
  ],
  migrations: [path.join(__dirname, `/migrations/*.{ts,js}`)],
  logger: 'advanced-console',
  migrationsTableName: 'migrations',
  namingStrategy: new SnakeNamingStrategy(),
};

export const dataSource = new DataSource(config);
