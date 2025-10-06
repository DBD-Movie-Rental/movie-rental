USE movie_rental;

-- ----------------------------------------
-- Get amount of movies rented by customer
-- ----------------------------------------
DELIMITER $$
CREATE FUNCTION get_customer_rental_count(p_customer_id INT)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_count INT;

    SELECT COUNT(ri.inventory_item_id)
    INTO v_count
    FROM rental r
    JOIN rental_item ri ON r.rental_id = ri.rental_id
    WHERE r.customer_id = p_customer_id;

    RETURN v_count;
END$$
