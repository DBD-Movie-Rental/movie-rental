"""
lookups.py — routes for static lookup tables.

Route map
---------
# Genres
GET  /genres

# Fees
GET  /fees

# Promo Codes
GET  /promo-codes

# Memberships
GET  /memberships
"""

from flask import jsonify
from . import bp
from repositories.mysql import lookups_repository

# ─────────────────────────────────────────────────────────────────────────────
# Genres
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/genres", methods=["GET"])
def get_genres():
    genres = lookups_repository.get_all_genres()
    return jsonify(genres), 200

# ─────────────────────────────────────────────────────────────────────────────
# Fees
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/fees", methods=["GET"])
def get_fees():
    fees = lookups_repository.get_all_fees()
    if not fees:
        return jsonify({"error": "No fees found"}), 404
    return jsonify(fees), 200

# ─────────────────────────────────────────────────────────────────────────────
# Promo Codes
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/promo-codes", methods=["GET"])
def get_promo_codes():
    promo_codes = lookups_repository.get_all_promo_codes()
    if not promo_codes:
        return jsonify({"error": "No promo codes found"}), 404
    return jsonify(promo_codes), 200

# ─────────────────────────────────────────────────────────────────────────────
# Memberships
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/memberships", methods=["GET"])
def get_memberships():
    memberships = lookups_repository.get_all_memberships()
    if not memberships:
        return jsonify({"error": "No memberships found"}), 404
    return jsonify(memberships), 200
