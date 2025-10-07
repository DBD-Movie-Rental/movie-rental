# 🎬 Movie Rental Database

![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue?logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-20.10+-blue?logo=docker&logoColor=white)

A fully functional MySQL database for a movie rental system. The project includes relational schema, stored procedures, triggers, views, functions, events, and indexes — all designed to demonstrate secure and well-structured database architecture.

---

## 🚀 Quick Start (Docker - Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/DBD-Movie-Rental/movie-rental-mysql.git
cd movie-rental-mysql

# 2. Start the database (this will automatically import all data)
docker compose up -d

# 3. Wait for initialization (about 30 seconds) then verify
docker compose exec mysql mysql -u root -proot movie_rental -e "SHOW TABLES;"
```

### Connection Details
- **Host:** `localhost` (or `127.0.0.1`)
- **Port:** `3307`
- **Username:** `root`
- **Password:** `root`
- **Database:** `movie_rental`

### Connecting to the Database

```bash
# Connect via Docker (recommended)
docker compose exec mysql mysql -u root -proot movie_rental

# Connect from host system (if MySQL client is installed)
mysql -h 127.0.0.1 -P 3307 -u root -proot movie_rental
```

### Managing the Database

```bash
# Stop the database
docker compose down

# Start the database
docker compose up -d

# View logs
docker compose logs mysql

# Reset database (removes all data)
docker compose down -v
docker compose up -d
```

---

## 🛠 Alternative Setup (Local MySQL)

### Prerequisites
- MySQL **8.0+** installed locally
- Event scheduler enabled: `SET GLOBAL event_scheduler = ON;`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/DBD-Movie-Rental/movie-rental-mysql.git
cd movie-rental-mysql

# 2. Run the setup script (single command, one password prompt)
mysql -u root -p << 'EOF'
CREATE DATABASE IF NOT EXISTS movie_rental;
USE movie_rental;
SOURCE MySQL_Scripts/movie_rental_create.sql;
SOURCE MySQL_Scripts/movie_rental_functions.sql;
SOURCE MySQL_Scripts/movie_rental_stored_procedures.sql;
SOURCE MySQL_Scripts/movie_rental_triggers.sql;
SOURCE MySQL_Scripts/movie_rental_views.sql;
SOURCE MySQL_Scripts/movie_rental_events.sql;
SOURCE MySQL_Scripts/movie_rental_index.sql;
SOURCE MySQL_Scripts/movie_rental_insert_data.sql;
EOF
```

---

## 💻 Using GUI Database Tools

Once your database is running, you can connect using popular database management tools:

### MySQL Workbench

1. **Download and Install:** [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
2. **Create New Connection:**
   - Connection Name: `Movie Rental (Docker)`
   - Hostname: `127.0.0.1`
   - Port: `3307`
   - Username: `root`
   - Password: `root`
   - Default Schema: `movie_rental`
3. **Test Connection** and click **OK**

### DataGrip (JetBrains)

1. **Open DataGrip**
2. **Add Data Source → MySQL:**
   - Host: `localhost`
   - Port: `3307`
   - User: `root`
   - Password: `root`
   - Database: `movie_rental`
3. **Test Connection** and **Apply**

### 📊 Sample Queries to Try

Once connected, try these queries to explore the database:

```sql
-- View all customers with their details
SELECT customer_id, first_name, last_name, email, phone_number FROM customer;

-- View all movies
SELECT movie_id, title, release_year, runtime_min, rating FROM movie;

-- View all genres
SELECT * FROM genre;

-- View movies with their genres (if any)
SELECT m.title, g.name as genre_name 
FROM movie m 
LEFT JOIN movie_genre mg ON m.movie_id = mg.movie_id 
LEFT JOIN genre g ON mg.genre_id = g.genre_id;

-- Check overdue rentals (using the view)
SELECT * FROM vw_overdue_rentals;

-- View all inventory items
SELECT * FROM inventory_item;

-- Call a stored procedure to add a new customer
CALL add_customer_with_address(
  'John', 'Doe', 'john.doe@email.com', '555-1234', 
  '123 Main St', 'Anytown', 'CA', '12345', 'USA'
);

-- View all available functions and procedures
SHOW FUNCTION STATUS WHERE Db = 'movie_rental';
SHOW PROCEDURE STATUS WHERE Db = 'movie_rental';

-- Check what events are scheduled
SHOW EVENTS;
```

---

## 👥 Authors
- **chth0003** — [@ChristianBT96](https://github.com/ChristianBT96)
- **makj0005** — [@marcus-rk](https://github.com/marcus-rk)
