USE movie_rental;


-- ---------------------------------------------
-- Automatic trigger checking membership upgrade
-- ---------------------------------------------
DROP TRIGGER IF EXISTS trg_check_membership_upgrade;
DELIMITER $$
CREATE TRIGGER trg_check_membership_upgrade
AFTER INSERT ON rental
FOR EACH ROW
BEGIN
    DECLARE v_rental_count INT;
    DECLARE v_membership_id INT;

    -- Count how many rentals this customer has made
    SET v_rental_count = get_customer_rental_count(NEW.customer_id);

    -- Determine which membership they should have
    IF v_rental_count >= 200 THEN
        SELECT membership_id INTO v_membership_id
        FROM membership
        WHERE membership = 'GOLD';
    ELSEIF v_rental_count >= 50 THEN
        SELECT membership_id INTO v_membership_id
        FROM membership
        WHERE membership = 'SILVER';
    END IF;

    -- Update their membership_plan if needed
    IF v_membership_id IS NOT NULL THEN
        UPDATE membership_plan
        SET membership_id = v_membership_id
        WHERE customer_id = NEW.customer_id;
    END IF;
END$$
