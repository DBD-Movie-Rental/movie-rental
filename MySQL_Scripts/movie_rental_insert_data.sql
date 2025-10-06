-- seed data: compact, readable, uses stored procedures, no user variables
SET SQL_SAFE_UPDATES = 0;
USE movie_rental;

-- delete all data in child-to-parent order (dev only)
DELETE FROM rental_fee       WHERE TRUE;
DELETE FROM payment          WHERE TRUE;
DELETE FROM rental_item      WHERE TRUE;
DELETE FROM movie_genre      WHERE TRUE;
DELETE FROM review           WHERE TRUE;
DELETE FROM membership_plan  WHERE TRUE;
DELETE FROM address          WHERE TRUE;
DELETE FROM rental           WHERE TRUE;
DELETE FROM inventory_item   WHERE TRUE;
DELETE FROM promo_code       WHERE TRUE;
DELETE FROM employee         WHERE TRUE;
DELETE FROM fee              WHERE TRUE;
DELETE FROM location         WHERE TRUE;
DELETE FROM format           WHERE TRUE;
DELETE FROM genre            WHERE TRUE;
DELETE FROM movie            WHERE TRUE;
DELETE FROM customer         WHERE TRUE;
DELETE FROM membership       WHERE TRUE;

-- employees
INSERT INTO employee (first_name, last_name, phone_number, email)
VALUES ('Emma', 'Eriksen', '40112233', 'emma@store.dk'),
       ('Frederik', 'Frandsen', '28776655', 'frederik@store.dk');

-- memberships
INSERT INTO membership (membership)
VALUES ('GOLD'),
       ('SILVER'),
       ('BRONZE');

-- formats
INSERT INTO format (format)
VALUES ('DVD'),
       ('BLU-RAY'),
       ('VHS');

-- locations (two stores only)
INSERT INTO location (address, city)
VALUES ('Nørreport Store', 'Copenhagen'),
       ('Bruuns Galleri', 'Aarhus');

-- movies
INSERT INTO movie (title, release_year, runtime_min, rating, summary)
VALUES ('Inception', 2010, 148, 8.8, 'Mind-bending heist across dream layers.'),
       ('The Matrix', 1999, 136, 8.7, 'A hacker awakens to reality.'),
       ('The Godfather', 1972, 175, 9.2, 'Mafia family saga.'),
       ('Interstellar', 2014, 169, 8.6, 'A quest across space and time.'),
       ('Parasite', 2019, 132, 8.6, 'Class warfare with a twist.'),
       ('The Big Lebowski', 1998, 117, 8.1, 'The Dude abides.');

-- inventory items: multiple copies, formats, for both cities
INSERT INTO inventory_item (location_id, format_id, movie_id)
SELECT l.location_id, f.format_id, m.movie_id
FROM location l
         CROSS JOIN format f
         CROSS JOIN movie m
WHERE (l.address, l.city, f.format, m.title) IN (
    ('Nørreport Store', 'Copenhagen', 'DVD', 'Inception'),
    ('Nørreport Store', 'Copenhagen', 'BLU-RAY', 'Inception'),
    ('Bruuns Galleri', 'Aarhus', 'DVD', 'The Matrix'),
    ('Bruuns Galleri', 'Aarhus', 'VHS', 'The Matrix'),
    ('Nørreport Store', 'Copenhagen', 'DVD', 'Interstellar'),
    ('Bruuns Galleri', 'Aarhus', 'BLU-RAY', 'Parasite'),
    ('Nørreport Store', 'Copenhagen', 'DVD', 'The Big Lebowski'),
    ('Bruuns Galleri', 'Aarhus', 'BLU-RAY', 'The Godfather'),
    ('Nørreport Store', 'Copenhagen', 'DVD', 'The Matrix'),
    ('Bruuns Galleri', 'Aarhus', 'VHS', 'The Godfather')
);

-- fees
INSERT INTO fee (fee_type, amount_dkk)
VALUES ('LATE', 25.00),
       ('DAMAGED', 50.00),
       ('OTHER', 10.00);

-- promo codes
INSERT INTO promo_code (code, description, percent_off, amount_off_dkk, starts_at, ends_at)
VALUES ('SUMMER25', '25% off all rentals in summer', 25.00, NULL, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH));

-- customers and addresses via stored procedure
CALL add_customer_with_address('Alice', 'Andersen', 'alice@example.com', '40223344', 'Main Street 12', 'Copenhagen',
                               '1000');
CALL add_customer_with_address('Bob', 'Bertelsen', 'bob@example.com', '50667788', 'River Road 5', 'Aarhus', '8000');
CALL add_customer_with_address('Sara', 'Larsen', 'sara@example.com', '60554433', 'Østerbrogade 10', 'Copenhagen',
                               '2100');
CALL add_customer_with_address('Mikkel', 'Madsen', 'mikkel@example.com', '71 23 45 67', 'H.C. Andersens Blvd 2',
                               'Aarhus', '8000');

-- membership plans using joins (no variables)
INSERT INTO membership_plan (monthly_cost, starts_on, ends_on, membership_id, customer_id)
SELECT 199.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), m.membership_id, c.customer_id
FROM membership m
         INNER JOIN customer c ON c.email = 'alice@example.com'
WHERE m.membership = 'GOLD';

INSERT INTO membership_plan (monthly_cost, starts_on, ends_on, membership_id, customer_id)
SELECT 129.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), m.membership_id, c.customer_id
FROM membership m
         INNER JOIN customer c ON c.email = 'sara@example.com'
WHERE m.membership = 'SILVER';

INSERT INTO membership_plan (monthly_cost, starts_on, ends_on, membership_id, customer_id)
SELECT 99.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), m.membership_id, c.customer_id
FROM membership m
         INNER JOIN customer c ON c.email = 'bob@example.com'
WHERE m.membership = 'BRONZE';

INSERT INTO membership_plan (monthly_cost, starts_on, ends_on, membership_id, customer_id)
SELECT 99.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), m.membership_id, c.customer_id
FROM membership m
         INNER JOIN customer c ON c.email = 'mikkel@example.com'
WHERE m.membership = 'BRONZE';

-- ongoing rental: Alice rents Inception (DVD @ Nørreport, CPH) and The Matrix (VHS @ Bruuns, Aarhus) with promo
CALL create_rental(
        (SELECT customer_id FROM customer WHERE email = 'alice@example.com'),
        (SELECT employee_id FROM employee WHERE email = 'emma@store.dk'),
        (SELECT promo_code_id
         FROM promo_code
         WHERE code = 'SUMMER25'
           AND NOW() BETWEEN starts_at AND ends_at
         LIMIT 1),
        JSON_ARRAY(
                (SELECT ii.inventory_item_id
                 FROM inventory_item ii
                          INNER JOIN movie m    ON m.movie_id = ii.movie_id
                          INNER JOIN format f   ON f.format_id = ii.format_id
                          INNER JOIN location l ON l.location_id = ii.location_id
                 WHERE m.title = 'Inception'
                   AND f.format = 'DVD'
                   AND l.address = 'Nørreport Store'
                   AND l.city = 'Copenhagen'
                   AND ii.status = 1
                 ORDER BY ii.inventory_item_id
                 LIMIT 1),
                (SELECT ii.inventory_item_id
                 FROM inventory_item ii
                          INNER JOIN movie m    ON m.movie_id = ii.movie_id
                          INNER JOIN format f   ON f.format_id = ii.format_id
                          INNER JOIN location l ON l.location_id = ii.location_id
                 WHERE m.title = 'The Matrix'
                   AND f.format = 'VHS'
                   AND l.address = 'Bruuns Galleri'
                   AND l.city = 'Aarhus'
                   AND ii.status = 1
                 ORDER BY ii.inventory_item_id
                 LIMIT 1)
        )
     );

-- ongoing rental: Bob rents The Godfather (BLU-RAY @ Bruuns, Aarhus) no promo
CALL create_rental(
        (SELECT customer_id FROM customer WHERE email = 'bob@example.com'),
        (SELECT employee_id FROM employee WHERE email = 'frederik@store.dk'),
        NULL,
        JSON_ARRAY(
                (SELECT ii.inventory_item_id
                 FROM inventory_item ii
                          INNER JOIN movie m    ON m.movie_id = ii.movie_id
                          INNER JOIN format f   ON f.format_id = ii.format_id
                          INNER JOIN location l ON l.location_id = ii.location_id
                 WHERE m.title = 'The Godfather'
                   AND f.format = 'BLU-RAY'
                   AND l.address = 'Bruuns Galleri'
                   AND l.city = 'Aarhus'
                   AND ii.status = 1
                 ORDER BY ii.inventory_item_id
                 LIMIT 1)
        )
     );

-- ongoing rental: Mikkel rents Interstellar (DVD @ Nørreport, CPH) no promo
CALL create_rental(
        (SELECT customer_id FROM customer WHERE email = 'mikkel@example.com'),
        (SELECT employee_id FROM employee WHERE email = 'emma@store.dk'),
        NULL,
        JSON_ARRAY(
                (SELECT ii.inventory_item_id
                 FROM inventory_item ii
                          INNER JOIN movie m    ON m.movie_id = ii.movie_id
                          INNER JOIN format f   ON f.format_id = ii.format_id
                          INNER JOIN location l ON l.location_id = ii.location_id
                 WHERE m.title = 'Interstellar'
                   AND f.format = 'DVD'
                   AND l.address = 'Nørreport Store'
                   AND l.city = 'Copenhagen'
                   AND ii.status = 1
                 ORDER BY ii.inventory_item_id
                 LIMIT 1)
        )
     );

-- mark one rental as returned for demo purposes
UPDATE rental
SET status = 'RETURNED', returned_at_datetime = NOW()
WHERE customer_id = (SELECT customer_id FROM customer WHERE email = 'alice@example.com')
LIMIT 1;

-- free up its inventory items again
UPDATE inventory_item
SET status = 1
WHERE inventory_item_id IN (
    SELECT ri.inventory_item_id
    FROM rental_item ri
             JOIN rental r ON r.rental_id = ri.rental_id
             JOIN customer c ON c.customer_id = r.customer_id
    WHERE c.email = 'alice@example.com'
);

SELECT * FROM rental;