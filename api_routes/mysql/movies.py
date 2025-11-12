"""
movies.py — routes for movies, reviews, and movie⇄genre links.

Route map
---------
# Movies (CRUD)
GET    /movies
GET    /movies/<movie_id>
POST   /movies
PUT    /movies/<movie_id>
DELETE /movies/<movie_id>

# Reviews (per movie)
GET    /movies/<movie_id>/reviews
POST   /movies/<movie_id>/reviews

# Movie - Genre links
POST   /movies/<movie_id>/genres/<genre_id>
DELETE /movies/<movie_id>/genres/<genre_id>
"""

from repositories.mysql import movies_repository
from flask import jsonify
from . import bp

# ─────────────────────────────────────────────────────────────────────────────
# Movies (CRUD)
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/movies", methods=["GET"])
def get_movies():
    movies = movies_repository.get_all_movies()
    return jsonify(movies), 200  # empty list: still 200 OK


@bp.route("/movies/<int:movie_id>", methods=["GET"])
def get_movie(movie_id: int):
    movie = movies_repository.get_movie_by_id(movie_id)
    if not movie:
        return jsonify({"error": "Movie not found"}), 404
    return jsonify(movie), 200


@bp.route("/movies", methods=["POST"])
def create_movie():
    # TODO: Waiting for repo implementation for creating a new movie
    return jsonify({"todo": "implement"}), 501  # Not Implemented


@bp.route("/movies/<int:movie_id>", methods=["PUT"])
def update_movie(movie_id):
    # TODO: Waiting for repo implementation for updating an existing movie
    return jsonify({"todo": "implement"}), 501  # Not Implemented


@bp.route("/movies/<int:movie_id>", methods=["DELETE"])
def delete_movie(movie_id):
    ok = movies_repository.delete_movie(movie_id)
    if not ok:
        return jsonify({"error": "Movie not found"}), 404
    return jsonify({"message": "Movie deleted"}), 204

# ─────────────────────────────────────────────────────────────────────────────
# Reviews (per movie)
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/movies/<int:movie_id>/reviews", methods=["GET"])
def get_movie_reviews(movie_id):
    reviews = movies_repository.get_reviews_by_movie_id(movie_id)
    return jsonify(reviews), 200  # empty list: still 200 OK


@bp.route("/movies/<int:movie_id>/reviews", methods=["POST"])
def create_movie_review(movie_id):
    # TODO: Implement repository call to create a review for a movie
    return jsonify({"todo": "implement"}), 501  # Not Implemented

# ─────────────────────────────────────────────────────────────────────────────
# Movie - Genre links
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/movies/<int:movie_id>/genres/<int:genre_id>", methods=["POST"])
def attach_genre_to_movie(movie_id, genre_id):
    # TODO: Implement repository call to attach genre to movie
    return jsonify({"todo": "implement"}), 501  # Not Implemented


@bp.route("/movies/<int:movie_id>/genres/<int:genre_id>", methods=["DELETE"])
def detach_genre_from_movie(movie_id, genre_id):
    ok = movies_repository.detach_genre_from_movie(movie_id, genre_id)
    if not ok:
        return jsonify({"error": "Movie-Genre link not found"}), 404
    return jsonify({"message": "Genre detached from movie"}), 204
