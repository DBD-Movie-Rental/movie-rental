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
git clone https://github.com/DBD-Movie-Rental/movie-rental.git
cd movie-rental

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
git clone https://github.com/DBD-Movie-Rental/movie-rental.git
cd movie-rental

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

## ✅ Verify Setup

### Docker Method
```bash
docker compose exec mysql mysql -u root -proot movie_rental -e "
  SELECT COUNT(*) as total_customers FROM customer;
  SELECT COUNT(*) as total_movies FROM movie;
  SELECT COUNT(*) as total_rentals FROM rental;
  SHOW TABLES;
"
```

### Local MySQL Method
```sql
USE movie_rental;
SELECT COUNT(*) as total_customers FROM customer;
SELECT COUNT(*) as total_movies FROM movie;
SELECT COUNT(*) as total_rentals FROM rental;
SHOW TABLES;
```

**Expected Results:**
- 4 customers
- 6 movies  
- 0 rentals (ready for you to add some!)
- 19 tables (including views)

If these return results, the system is fully operational.

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

### DBeaver (Free Alternative)

1. **Download:** [DBeaver Community](https://dbeaver.io/download/)
2. **New Database Connection → MySQL:**
   - Server Host: `localhost`
   - Port: `3307`
   - Database: `movie_rental`
   - Username: `root`
   - Password: `root`
3. **Test Connection** and **Finish**

### phpMyAdmin (Web Interface)

For a web-based interface, add this to your `docker-compose.yml`:

```yaml
  phpmyadmin:
    image: phpmyadmin:latest
    container_name: movie-rental-phpmyadmin
    environment:
      PMA_HOST: mysql
      PMA_USER: root
      PMA_PASSWORD: root
    ports:
      - "8080:80"
    depends_on:
      - mysql
```

Then access at: http://localhost:8080

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

## 🏗️ Database Structure

The database includes:
- **Tables:** Customers, movies, rentals, inventory, payments, and more
- **Views:** Overdue rentals view for easy monitoring
- **Stored Procedures:** Customer management, rental processing
- **Functions:** Custom business logic calculations
- **Triggers:** Automated updates and validations
- **Events:** Scheduled tasks (e.g., marking overdue rentals)
- **Indexes:** Optimized query performance

---

## 🐛 Troubleshooting

### Docker Issues

**"Docker daemon not running"**
```bash
# Start Docker Desktop application
open -a Docker
# Wait for Docker to start, then retry
```

**"Port already in use"**
```bash
# Check what's using port 3307
lsof -i :3307
# Change port in docker-compose.yml if needed
```

**Container won't start**
```bash
# Check logs for errors
docker compose logs mysql
# Reset everything
docker compose down -v
docker compose up -d
```

### Local MySQL Issues

**"Command not found: mysql"**
```bash
# Install MySQL via Homebrew (macOS)
brew install mysql
brew services start mysql
```

**"Access denied"**
- Make sure you're using the correct username/password
- Try running `mysql_secure_installation` to set up root password

---

## 👥 Authors
- **chth0003** — [@ChristianBT96](https://github.com/ChristianBT96)
- **makj0005** — [@marcus-rk](https://github.com/marcus-rk)
