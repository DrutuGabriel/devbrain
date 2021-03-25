FROM postgres:10

# WORKDIR /etc/postgresql/

ADD tables/ /docker-entrypoit-initdb.d/tables/

ADD deploy_schemas.sql /docker-entrypoit-initdb.d
# COPY my-postgres.conf .

# RUN mv my-postgres.conf postgresql.conf

EXPOSE 5432