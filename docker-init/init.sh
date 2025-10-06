#!/usr/bin/env bash
set -euo pipefail

DB="movie_rental"
MYSQL="mysql -uroot -p${MYSQL_ROOT_PASSWORD} ${DB}"

# Ensure DB exists (also created by MYSQL_DATABASE, but harmless to repeat)
mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE DATABASE IF NOT EXISTS ${DB};"

# Explicit order, no numbered filenames needed
$MYSQL < /scripts/movie_rental_create.sql
$MYSQL < /scripts/movie_rental_functions.sql
$MYSQL < /scripts/movie_rental_stored_procedures.sql
$MYSQL < /scripts/movie_rental_triggers.sql
$MYSQL < /scripts/movie_rental_views.sql
$MYSQL < /scripts/movie_rental_events.sql
$MYSQL < /scripts/movie_rental_index.sql
$MYSQL < /scripts/movie_rental_insert_data.sql