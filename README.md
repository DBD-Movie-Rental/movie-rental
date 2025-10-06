# 🎬 Movie Rental Database

![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue?logo=mysql&logoColor=white)

A fully functional MySQL database for a movie rental system. The project includes relational schema, stored procedures, triggers, views, functions, events, and indexes — all designed to demonstrate secure and well-structured database architecture.

---

## Requirements
- MySQL **8.0+**
- Event scheduler must be enabled:
  ```sql
  SET GLOBAL event_scheduler = ON;
  ```

---

## Installation (CLI)

```bash
# 1. Clone the repository
git clone https://github.com/DBD-Movie-Rental/movie-rental.git
cd movie-rental/MySQL_Scripts

# 2. Create the database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS movie_rental;"

# 3. Import schema and logic (in order)
mysql -u root -p movie_rental < movie_rental_create.sql
mysql -u root -p movie_rental < movie_rental_functions.sql
mysql -u root -p movie_rental < movie_rental_stored_procedures.sql
mysql -u root -p movie_rental < movie_rental_triggers.sql
mysql -u root -p movie_rental < movie_rental_views.sql
mysql -u root -p movie_rental < movie_rental_events.sql
mysql -u root -p movie_rental < movie_rental_index.sql

# 4. Add sample data (customers, rentals, and open transactions)
mysql -u root -p movie_rental < movie_rental_insert_data.sql
```

---

## Verify Setup

```sql
USE movie_rental;
SHOW TABLES;
SELECT COUNT(*) AS total_rentals FROM rental;
```

If data and views return results, the system is fully operational.

---

## Authors
- **chth0003** — [@ChristianBT96](https://github.com/ChristianBT96)
- **makj0005** — [@marcus-rk](https://github.com/marcus-rk)