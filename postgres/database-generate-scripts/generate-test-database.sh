#!/bin/bash
set -e

if [[ -z "$POSTGRES_USER" || -z "$POSTGRES_DB" || -z "$POSTGRES_DB_TEST" ]]; then
  echo "Erro: Variáveis de ambiente POSTGRES_USER, POSTGRES_DB ou POSTGRES_DB_TEST não estão definidas."
  exit 1
fi

echo "Criando banco de dados de teste: $POSTGRES_DB_TEST"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE $POSTGRES_DB_TEST;
EOSQL

echo "Banco de dados de teste $POSTGRES_DB_TEST criado com sucesso."
