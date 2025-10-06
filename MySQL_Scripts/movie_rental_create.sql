SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema movie_rental
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `movie_rental`;
USE `movie_rental`;

-- -----------------------------------------------------
-- Table customer
-- -----------------------------------------------------
DROP TABLE IF EXISTS customer;
CREATE TABLE customer (
  customer_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(15) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (customer_id)
);

-- -----------------------------------------------------
-- Table address
-- -----------------------------------------------------
DROP TABLE IF EXISTS address;
CREATE TABLE address (
  address_id INT NOT NULL AUTO_INCREMENT,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  post_code CHAR(4) NOT NULL,
  customer_id INT NOT NULL,
  PRIMARY KEY (address_id),
  CONSTRAINT fk_address_customer
    FOREIGN KEY (customer_id)
    REFERENCES customer (customer_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table employee
-- -----------------------------------------------------
DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
  employee_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(15) NOT NULL,
  email VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (employee_id)
);

-- -----------------------------------------------------
-- Table fee
-- -----------------------------------------------------
DROP TABLE IF EXISTS fee;
CREATE TABLE fee (
  fee_id INT NOT NULL AUTO_INCREMENT,
  fee_type ENUM('LATE', 'DAMAGED', 'OTHER') NOT NULL UNIQUE,
  amount_dkk DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (fee_id)
);

-- -----------------------------------------------------
-- Table format
-- -----------------------------------------------------
DROP TABLE IF EXISTS format;
CREATE TABLE format (
  format_id INT NOT NULL AUTO_INCREMENT,
  format ENUM('DVD', 'BLU-RAY', 'VHS') NOT NULL UNIQUE,
  PRIMARY KEY (format_id)
);

-- -----------------------------------------------------
-- Table genre
-- -----------------------------------------------------
DROP TABLE IF EXISTS genre;
CREATE TABLE genre (
  genre_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (genre_id)
);

-- -----------------------------------------------------
-- Table location
-- -----------------------------------------------------
DROP TABLE IF EXISTS location;
CREATE TABLE location (
  location_id INT NOT NULL AUTO_INCREMENT,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  PRIMARY KEY (location_id)
);

-- -----------------------------------------------------
-- Table movie
-- -----------------------------------------------------
DROP TABLE IF EXISTS movie;
CREATE TABLE movie (
  movie_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  release_year YEAR NOT NULL,
  runtime_min SMALLINT NOT NULL,
  rating DECIMAL(3,1) NULL,
  summary TEXT NULL,
  PRIMARY KEY (movie_id)
);

-- -----------------------------------------------------
-- Table inventory_item
-- -----------------------------------------------------
DROP TABLE IF EXISTS inventory_item;
CREATE TABLE inventory_item (
  inventory_item_id INT NOT NULL AUTO_INCREMENT,
  location_id INT NOT NULL,
  format_id INT NOT NULL,
  movie_id INT NOT NULL,
  status SMALLINT(1) DEFAULT 1,
  PRIMARY KEY (inventory_item_id),
  CONSTRAINT fk_inventory_item_format
    FOREIGN KEY (format_id)
    REFERENCES format (format_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_inventory_item_location
    FOREIGN KEY (location_id)
    REFERENCES location (location_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_inventory_item_movie
    FOREIGN KEY (movie_id)
    REFERENCES movie (movie_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table membership
-- -----------------------------------------------------
DROP TABLE IF EXISTS membership;
CREATE TABLE membership (
  membership_id INT NOT NULL AUTO_INCREMENT,
  membership ENUM('GOLD', 'SILVER', 'BRONZE') NOT NULL UNIQUE,
  PRIMARY KEY (membership_id)
);

-- -----------------------------------------------------
-- Table membership_plan
-- -----------------------------------------------------
DROP TABLE IF EXISTS membership_plan;
CREATE TABLE membership_plan (
  membership_plan_id INT NOT NULL AUTO_INCREMENT,
  monthly_cost DECIMAL(10,2) NOT NULL,
  starts_on DATETIME NOT NULL,
  ends_on DATETIME NOT NULL,
  membership_id INT NOT NULL,
  customer_id INT NOT NULL UNIQUE,
  PRIMARY KEY (membership_plan_id),
  CONSTRAINT fk_membership_plan_membership
    FOREIGN KEY (membership_id)
    REFERENCES membership (membership_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_membership_plan_customer
    FOREIGN KEY (customer_id)
    REFERENCES customer (customer_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table movie_genre
-- -----------------------------------------------------
DROP TABLE IF EXISTS movie_genre;
CREATE TABLE movie_genre (
  movie_genre_id INT NOT NULL AUTO_INCREMENT,
  movie_id INT NOT NULL,
  genre_id INT NOT NULL,
  PRIMARY KEY (movie_genre_id),
  CONSTRAINT fk_movie_genre_genre
    FOREIGN KEY (genre_id)
    REFERENCES genre (genre_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_movie_genre_movie
    FOREIGN KEY (movie_id)
    REFERENCES movie (movie_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table promo_code
-- -----------------------------------------------------
DROP TABLE IF EXISTS promo_code;
CREATE TABLE promo_code (
  promo_code_id INT NOT NULL AUTO_INCREMENT,
  code VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  percent_off DECIMAL(5,2) DEFAULT NULL CHECK (percent_off BETWEEN 0 AND 100),
  amount_off_dkk DECIMAL(10,2) DEFAULT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  PRIMARY KEY (promo_code_id)
);

-- -----------------------------------------------------
-- Table rental
-- -----------------------------------------------------
DROP TABLE IF EXISTS rental;
CREATE TABLE rental (
  rental_id INT NOT NULL AUTO_INCREMENT,
  rented_at_datetime DATETIME NULL,
  returned_at_datetime DATETIME NULL,
  due_at_datetime DATETIME NULL,
  reserved_at_datetime DATETIME NULL,
  status ENUM('RESERVED', 'OPEN', 'RETURNED', 'LATE', 'CANCELLED') NOT NULL,
  customer_id INT NOT NULL,
  promo_code_id INT NULL,
  employee_id INT NULL,
  PRIMARY KEY (rental_id),
  CONSTRAINT fk_rental_customer
    FOREIGN KEY (customer_id)
    REFERENCES customer (customer_id)
    ON UPDATE CASCADE,
  CONSTRAINT fk_rental_employee
    FOREIGN KEY (employee_id)
    REFERENCES employee (employee_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_rental_promo_code
    FOREIGN KEY (promo_code_id)
    REFERENCES promo_code (promo_code_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table payment
-- -----------------------------------------------------
DROP TABLE IF EXISTS payment;
CREATE TABLE payment (
  payment_id INT NOT NULL AUTO_INCREMENT,
  amount_dkk DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rental_id INT NOT NULL,
  PRIMARY KEY (payment_id),
  CONSTRAINT fk_payment_rental
    FOREIGN KEY (rental_id)
    REFERENCES rental (rental_id)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table rental_fee
-- -----------------------------------------------------
DROP TABLE IF EXISTS rental_fee;
CREATE TABLE rental_fee (
  rental_fee_id INT NOT NULL AUTO_INCREMENT,
  fee_id INT NOT NULL,
  rental_id INT NOT NULL,
  PRIMARY KEY (rental_fee_id),
  CONSTRAINT fk_rental_fee_fee
    FOREIGN KEY (fee_id)
    REFERENCES fee (fee_id)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT fk_rental_fee_rental
    FOREIGN KEY (rental_id)
    REFERENCES rental (rental_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table review
-- -----------------------------------------------------
DROP TABLE IF EXISTS review;
CREATE TABLE review (
  review_id INT NOT NULL AUTO_INCREMENT,
  rating TINYINT UNSIGNED CHECK (rating BETWEEN 1 AND 10),
  body TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  movie_id INT NOT NULL,
  PRIMARY KEY (review_id),
  CONSTRAINT fk_review_movie
    FOREIGN KEY (movie_id)
    REFERENCES movie (movie_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table rental_item
-- -----------------------------------------------------
DROP TABLE IF EXISTS rental_item;
CREATE TABLE rental_item (
  rental_item_id INT NOT NULL AUTO_INCREMENT,
  rental_id INT NOT NULL,
  inventory_item_id INT NOT NULL,
  PRIMARY KEY (rental_item_id),
  CONSTRAINT fk_rental_item_rental
    FOREIGN KEY (rental_id)
    REFERENCES rental (rental_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_rental_item_inventory_item
    FOREIGN KEY (inventory_item_id)
    REFERENCES inventory_item (inventory_item_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;