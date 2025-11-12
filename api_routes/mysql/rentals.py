from flask import jsonify
from . import bp
from repositories.mysql import rentals_repository


# ─────────────────────────────────────────────────────────────────────────────
# Rentals (CRUD)
# ─────────────────────────────────────────────────────────────────────────────
@bp.route("/rentals", methods=["GET"])
def get_rentals():
    rentals = rentals_repository.get_all_rentals()
    return jsonify(rentals), 200


@bp.route("/rentals/<int:rental_id>", methods=["GET"])
def get_rental(rental_id):
    rental = rentals_repository.get_rental_by_id(rental_id)
    if not rental:
        return jsonify({"error": "Rental not found"}), 404
    return jsonify(rental), 200


@bp.route("/rentals", methods=["POST"])
def create_rental():
    # TODO: Implement repository call to create rental
    return jsonify({"todo": "implement"}), 501  # Not Implemented


@bp.route("/rentals/<int:rental_id>", methods=["PUT"])
def update_rental(rental_id):
    # TODO: Implement repository call to update rental
    return jsonify({"todo": "implement"}), 501  # Not Implemented


@bp.route("/rentals/<int:rental_id>", methods=["DELETE"])
def delete_rental(rental_id):
    ok = rentals_repository.delete_rental(rental_id)
    if not ok:
        return jsonify({"error": "Rental not found"}), 404
    return jsonify({"message": "Rental deleted"}), 204

# ─────────────────────────────────────────────────────────────────────────────
# Rental Items
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/rentals/<int:rental_id>/items", methods=["POST"])
def add_rental_items(rental_id):
    # TODO: Implement repository call to add items to rental
    return jsonify({"todo": "implement"}), 501  # Not Implemented

# ─────────────────────────────────────────────────────────────────────────────
# Returns
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/rentals/<int:rental_id>/return", methods=["POST"])
def return_rental(rental_id):
    # TODO: Implement repository call to process rental return
    return jsonify({"todo": "implement"}), 501  # Not Implemented

# ─────────────────────────────────────────────────────────────────────────────
# Payments
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/rentals/<int:rental_id>/payments", methods=["GET"])
def get_rental_payments(rental_id):
    rental_payment = rentals_repository.get_payments_by_rental_id(rental_id)
    if not rental_payment:
        return jsonify({"error": "Payments not found"}), 404
    return jsonify(rental_payment), 200


@bp.route("/rentals/<int:rental_id>/payments", methods=["POST"])
def create_rental_payment(rental_id):
    # TODO: Implement repository call to create payment for rental
    return jsonify({"todo": "implement"}), 501  # Not Implemented

# ─────────────────────────────────────────────────────────────────────────────
# Fees
# ─────────────────────────────────────────────────────────────────────────────

@bp.route("/rentals/<int:rental_id>/fees", methods=["GET"])
def get_rental_fees(rental_id):
    rental_fees = rentals_repository.get_fees_by_rental_id(rental_id)
    if not rental_fees:
        return jsonify({"error": "Fees not found"}), 404
    return jsonify(rental_fees), 200


@bp.route("/rentals/<int:rental_id>/fees", methods=["POST"])
def create_rental_fee(rental_id):
    # TODO: Implement repository call to create fee for rental
    return jsonify({"todo": "implement"}), 501  # Not Implemented

# ─────────────────────────────────────────────────────────────────────────────
# Promo Codes .....
# ─────────────────────────────────────────────────────────────────────────────
