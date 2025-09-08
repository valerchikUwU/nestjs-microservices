#!/bin/bash

# Exit immediately if a command exits with a non zero status
set -e
# Treat unset variables as an error when substituting
set -u

function create_databases() {
    database=$1
    password=$2
    echo "Creating user and database '$database' with password '$password'"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
      CREATE USER $database WITH ENCRYPTED PASSWORD '$password';
      CREATE DATABASE $database OWNER $database;
      
      -- Подключаемся к новой базе и даем права на схему public
      \c $database;
      GRANT ALL PRIVILEGES ON SCHEMA public TO $database;
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $database;
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $database;
      GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $database;
      
      -- Даем права на будущие объекты
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $database;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $database;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO $database;
EOSQL
}

# Ждем пока PostgreSQL будет готов
until pg_isready -U "$POSTGRES_USER"; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - creating databases"

# POSTGRES_MULTIBLE_DATABASES=db1,db2
# POSTGRES_MULTIBLE_DATABASES=db1:password,db2
if [ -n "$POSTGRES_MULTIBLE_DATABASES" ]; then
  echo "Multiple database creation requested: $POSTGRES_MULTIBLE_DATABASES"
  for db in $(echo $POSTGRES_MULTIBLE_DATABASES | tr ',' ' '); do
    user=$(echo $db | awk -F":" '{print $1}')
    pswd=$(echo $db | awk -F":" '{print $2}')
    if [[ -z "$pswd" ]]
    then
      pswd=$user
    fi

    echo "user is $user and pass is $pswd"
    create_databases $user $pswd
  done
  echo "Multiple databases created!"
fi