USE movie_rental;

-- ----------------------------------------
-- Check overdue rantals and update status
-- ----------------------------------------
CREATE EVENT mark_overdue_rentals
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 2 HOUR -- Event will run 02:00
ON COMPLETION PRESERVE
DO
    UPDATE rental
    SET status = 'LATE'
    WHERE status = 'OPEN'
      AND NOW() > due_at_datetime;

SHOW EVENTS;

