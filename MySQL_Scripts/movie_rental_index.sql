USE movie_rental;

-- RENTAL
CREATE INDEX idx_rental_customer_id ON rental(customer_id);
CREATE INDEX idx_rental_employee_id ON rental(employee_id);
CREATE INDEX idx_rental_status ON rental(status);
CREATE INDEX idx_rental_due_datetime ON rental(due_at_datetime);

-- PAYMENT
CREATE INDEX idx_payment_created_at ON payment(created_at);

-- MOVIE GENRE
CREATE INDEX idx_movie_genre_movie_id_genre_id ON movie_genre(movie_id, genre_id);