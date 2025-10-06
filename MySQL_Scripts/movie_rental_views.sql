USE movie_rental;


-- ----------------------------------------
-- View of overdue rentals
-- ----------------------------------------
CREATE OR REPLACE VIEW vw_overdue_rentals AS
SELECT
  r.rental_id,
  r.customer_id,
  r.due_at_datetime,
  r.status,
  TIMESTAMPDIFF(HOUR, r.due_at_datetime, NOW()) AS hours_overdue
FROM rental r
WHERE r.status IN ('OPEN','LATE')
  AND r.due_at_datetime IS NOT NULL
  AND NOW() > r.due_at_datetime;
