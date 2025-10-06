USE movie_rental;

-- --------------------------------
-- Add customer with address
-- --------------------------------
DELIMITER $$
CREATE PROCEDURE add_customer_with_address (
    IN p_first_name VARCHAR(255),
    IN p_last_name VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_phone VARCHAR(15),
    IN p_address VARCHAR(255),
    IN p_city VARCHAR(255),
    IN p_post_code CHAR(4)
)
BEGIN
    DECLARE v_customer_id INT;

    -- Start transaction
    START TRANSACTION;

    -- Insert new customer
    INSERT INTO customer (
        first_name,
        last_name,
        email,
        phone_number
    ) VALUES (
        p_first_name,
        p_last_name,
        LOWER(p_email),   -- normalized email
        p_phone
    );

    SET v_customer_id = LAST_INSERT_ID(); -- save customer ID for address

    -- Insert an address linked to this customer
    INSERT INTO address (
        address,
        city,
        post_code,
        customer_id
    ) VALUES (
        p_address,
        p_city,
        p_post_code,
        v_customer_id
    );

    -- Commit transaction
    COMMIT;

    -- Return the new customer ID
    SELECT v_customer_id AS new_customer_id;
END$$


-- --------------------------------
-- Verify inventory items available
-- --------------------------------
DELIMITER $$
CREATE PROCEDURE verify_inventory_items_available (
    IN p_inventory_items JSON,
    OUT p_all_available BOOLEAN
)
BEGIN
    DECLARE v_total INT;
    DECLARE v_available INT;

    SET v_total = JSON_LENGTH(p_inventory_items);

    SELECT COUNT(*) INTO v_available
    FROM JSON_TABLE(p_inventory_items, '$[*]' COLUMNS(item_id INT PATH '$')) j
    JOIN inventory_item i ON i.inventory_item_id = j.item_id
    WHERE i.status = 1; -- TRUE

    SET p_all_available = (v_available = v_total);
END$$


-- --------------------------------
-- 
-- --------------------------------

DELIMITER $$
CREATE PROCEDURE create_rental (
    IN p_customer_id INT,
    IN p_employee_id INT,
    IN p_promo_code_id INT,
    IN p_inventory_items JSON
)
BEGIN
    DECLARE v_rental_id INT;
    DECLARE v_now DATETIME;
    DECLARE v_due DATETIME;
    DECLARE v_all_available BOOLEAN;

    CALL verify_inventory_items_available(p_inventory_items, v_all_available);

    IF v_all_available = FALSE THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'One or more inventory items are not available for rental.';
    END IF;

    START TRANSACTION;

    SET v_now = NOW();
    SET v_due = DATE_ADD(v_now, INTERVAL 7 DAY); -- Standard 7 Days

    INSERT INTO rental (
        rented_at_datetime,
        due_at_datetime,
        status,
        customer_id,
        employee_id,
        promo_code_id
    )
    VALUES (
        v_now,
        v_due,
        'OPEN',
        p_customer_id,
        p_employee_id,
        p_promo_code_id
    );

    SET v_rental_id = LAST_INSERT_ID();

    INSERT INTO rental_item (rental_id, inventory_item_id)
    SELECT v_rental_id, item_id
    FROM JSON_TABLE(p_inventory_items, '$[*]' COLUMNS(item_id INT PATH '$')) j;

    UPDATE inventory_item
    SET status = 0
    WHERE inventory_item_id IN (
        SELECT item_id
        FROM JSON_TABLE(p_inventory_items, '$[*]' COLUMNS(item_id INT PATH '$')) j
    );

    COMMIT;

    SELECT v_rental_id AS new_rental_id;
END$$
